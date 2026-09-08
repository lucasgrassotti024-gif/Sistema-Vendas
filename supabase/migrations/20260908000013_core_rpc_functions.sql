-- 013_core_rpc_functions.sql
-- Funções Transacionais Atômicas (RPCs) da Operação

-- 1. RPC: Criação Atômica de Venda (Venda + Itens + Baixa de Estoque + Aplicação de Sinal + Caixa/Receivable)
CREATE OR REPLACE FUNCTION public.fn_create_sale(
    p_code VARCHAR(30),
    p_customer_id UUID,
    p_order_id UUID,
    p_sale_date DATE,
    p_items JSONB, -- Array de objetos: [{"product_id": uuid, "order_item_id": uuid, "quantity": num, "unit_price": num}]
    p_discount_amount NUMERIC(12, 2) DEFAULT 0.00,
    p_order_advance_id UUID DEFAULT NULL,
    p_advance_amount_to_apply NUMERIC(12, 2) DEFAULT 0.00,
    p_payment_method payment_method_enum DEFAULT NULL,
    p_immediate_amount_paid NUMERIC(12, 2) DEFAULT 0.00,
    p_due_date DATE DEFAULT NULL,
    p_allow_stock_override BOOLEAN DEFAULT FALSE,
    p_notes TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_user_id UUID;
    v_sale_id UUID;
    v_item RECORD;
    v_gross_amount NUMERIC(12, 2) := 0.00;
    v_net_amount NUMERIC(12, 2) := 0.00;
    v_item_subtotal NUMERIC(12, 2);
    v_unit_cost NUMERIC(12, 2);
    v_curr_stock NUMERIC(12, 3);
    v_adv_avail NUMERIC(12, 2);
    v_category_id UUID;
    v_remaining_to_pay NUMERIC(12, 2);
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        -- Fallback de segurança para automações/seed interno caso auth.uid() seja nulo
        SELECT id INTO v_user_id FROM public.profiles LIMIT 1;
    END IF;

    IF jsonb_array_length(p_items) = 0 THEN
        RAISE EXCEPTION 'A venda deve conter pelo menos 1 produto.';
    END IF;

    -- Pré-calcular valor bruto
    FOR v_item IN SELECT * FROM jsonb_to_recordset(p_items) AS (
        product_id UUID,
        order_item_id UUID,
        quantity NUMERIC(12, 2),
        unit_price NUMERIC(12, 2)
    ) LOOP
        v_item_subtotal := ROUND(v_item.quantity * v_item.unit_price, 2);
        v_gross_amount := v_gross_amount + v_item_subtotal;
    END LOOP;

    -- Validar e abater adiantamento
    IF p_order_advance_id IS NOT NULL AND p_advance_amount_to_apply > 0 THEN
        SELECT total_advance_amount - COALESCE(SUM(oa.amount_applied), 0.00)
        INTO v_adv_avail
        FROM public.order_advances adv
        LEFT JOIN public.order_advance_applications oa ON oa.order_advance_id = adv.id
        WHERE adv.id = p_order_advance_id AND adv.status IN ('available', 'partially_applied')
        GROUP BY adv.id, adv.total_advance_amount;

        IF v_adv_avail IS NULL OR v_adv_avail < p_advance_amount_to_apply THEN
            RAISE EXCEPTION 'Saldo de adiantamento insuficiente. Disponível: %, Solicitado: %', COALESCE(v_adv_avail, 0.00), p_advance_amount_to_apply;
        END IF;
    ELSE
        p_advance_amount_to_apply := 0.00;
    END IF;

    v_net_amount := (v_gross_amount - p_discount_amount) - p_advance_amount_to_apply;
    IF v_net_amount < 0 THEN
        RAISE EXCEPTION 'O valor líquido da venda não pode ser negativo (Bruto: %, Desconto: %, Sinal: %)', v_gross_amount, p_discount_amount, p_advance_amount_to_apply;
    END IF;

    -- Inserir Venda Mestra
    INSERT INTO public.sales (
        code, order_id, customer_id, sale_date,
        gross_amount, discount_amount, advance_applied_amount, net_amount,
        status, notes, created_by
    ) VALUES (
        p_code, p_order_id, p_customer_id, COALESCE(p_sale_date, CURRENT_DATE),
        v_gross_amount, p_discount_amount, p_advance_amount_to_apply, v_net_amount,
        'completed', p_notes, v_user_id
    ) RETURNING id INTO v_sale_id;

    -- Processar Itens, Custo Congelado e Baixa de Estoque
    FOR v_item IN SELECT * FROM jsonb_to_recordset(p_items) AS (
        product_id UUID,
        order_item_id UUID,
        quantity NUMERIC(12, 2),
        unit_price NUMERIC(12, 2)
    ) LOOP
        -- Obter custo de catálogo no momento da venda
        SELECT COALESCE(manual_cost_price, 0.00) INTO v_unit_cost
        FROM public.products WHERE id = v_item.product_id;

        -- Gravar Item de Venda com preço e custo congelados
        INSERT INTO public.sale_items (
            sale_id, product_id, order_item_id, quantity,
            unit_price_sold, unit_cost_at_sale, subtotal
        ) VALUES (
            v_sale_id, v_item.product_id, v_item.order_item_id, v_item.quantity,
            v_item.unit_price, v_unit_cost, ROUND(v_item.quantity * v_item.unit_price, 2)
        );

        -- Lock de concorrência e validação de estoque
        SELECT current_quantity INTO v_curr_stock
        FROM public.inventory_balances
        WHERE product_id = v_item.product_id
        FOR UPDATE;

        IF (v_curr_stock - v_item.quantity) < 0 AND p_allow_stock_override IS FALSE THEN
            RAISE EXCEPTION 'Estoque insuficiente para o produto % (Disponível: %, Solicitado: %)', v_item.product_id, v_curr_stock, v_item.quantity;
        END IF;

        -- Registro imutável no Ledger de Estoque
        INSERT INTO public.stock_movements (
            product_id, movement_type, quantity, unit, unit_cost,
            reference_type, reference_id, notes, created_by
        ) VALUES (
            v_item.product_id, 'sale_out', v_item.quantity, 'un', v_unit_cost,
            'sale', v_sale_id, 'Baixa automática de faturamento de venda', v_user_id
        );

        -- Atualizar projeção de saldo
        UPDATE public.inventory_balances
        SET current_quantity = current_quantity - v_item.quantity, updated_at = NOW()
        WHERE product_id = v_item.product_id;

        -- Registrar auditoria caso tenha ocorrido override
        IF (v_curr_stock - v_item.quantity) < 0 AND p_allow_stock_override IS TRUE THEN
            INSERT INTO public.audit_logs (user_id, action, table_name, record_id, reason, details)
            VALUES (
                v_user_id, 'STOCK_NEGATIVE_OVERRIDE', 'products', v_item.product_id,
                'Venda balcão autorizada com saldo de estoque em espera de entrada de produção',
                jsonb_build_object('sale_id', v_sale_id, 'requested', v_item.quantity, 'previous_stock', v_curr_stock)
            );
        END IF;
    END LOOP;

    -- Registrar aplicação de adiantamento, se houver
    IF p_order_advance_id IS NOT NULL AND p_advance_amount_to_apply > 0 THEN
        INSERT INTO public.order_advance_applications (order_advance_id, sale_id, amount_applied)
        VALUES (p_order_advance_id, v_sale_id, p_advance_amount_to_apply);

        -- Atualizar status do adiantamento
        UPDATE public.order_advances
        SET status = CASE 
            WHEN (v_adv_avail - p_advance_amount_to_apply) <= 0.00 THEN 'fully_applied'
            ELSE 'partially_applied'
        END
        WHERE id = p_order_advance_id;
    END IF;

    -- Obter categoria financeira de vendas padrão
    SELECT id INTO v_category_id FROM public.financial_categories WHERE name = 'Vendas de Produtos' AND type = 'in' LIMIT 1;
    IF v_category_id IS NULL THEN
        INSERT INTO public.financial_categories (name, type) VALUES ('Vendas de Produtos', 'in') RETURNING id INTO v_category_id;
    END IF;

    -- Processar Liquidação Financeira
    IF p_immediate_amount_paid > 0 THEN
        IF p_payment_method IS NULL THEN
            RAISE EXCEPTION 'Método de pagamento obrigatório para pagamentos à vista.';
        END IF;

        IF p_immediate_amount_paid > v_net_amount THEN
            RAISE EXCEPTION 'O valor pago no ato (%) não pode exceder o valor líquido da venda (%).', p_immediate_amount_paid, v_net_amount;
        END IF;

        -- Gravar entrada no livro-caixa
        INSERT INTO public.financial_transactions (
            type, amount, payment_method, category_id, sale_id, status, notes, created_by
        ) VALUES (
            'in', p_immediate_amount_paid, p_payment_method, v_category_id, v_sale_id, 'cleared', 'Recebimento à vista de venda', v_user_id
        );
    END IF;

    v_remaining_to_pay := v_net_amount - COALESCE(p_immediate_amount_paid, 0.00);

    -- Se houver saldo em aberto residual (fiado/a prazo), gerar Contas a Receber
    IF v_remaining_to_pay > 0 THEN
        IF p_customer_id IS NULL THEN
            RAISE EXCEPTION 'Vendas com saldo a prazo exigem identificação obrigatória do cliente.';
        END IF;
        IF p_due_date IS NULL THEN
            p_due_date := CURRENT_DATE + INTERVAL '7 days';
        END IF;

        INSERT INTO public.receivables (
            sale_id, customer_id, original_amount, due_date, status, notes
        ) VALUES (
            v_sale_id, p_customer_id, v_remaining_to_pay, p_due_date, 'open', 'Saldo residual faturado a prazo'
        );
    END IF;

    RETURN v_sale_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. RPC: Registro de Pagamento de Contas a Receber / Contas a Pagar
CREATE OR REPLACE FUNCTION public.fn_register_payment(
    p_receivable_id UUID,
    p_payable_id UUID,
    p_amount NUMERIC(12, 2),
    p_payment_method payment_method_enum,
    p_payment_date DATE DEFAULT CURRENT_DATE,
    p_notes TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_user_id UUID;
    v_transaction_id UUID;
    v_category_id UUID;
    v_rec RECORD;
    v_pay RECORD;
    v_remaining NUMERIC(12, 2);
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        SELECT id INTO v_user_id FROM public.profiles LIMIT 1;
    END IF;

    IF p_amount <= 0 THEN
        RAISE EXCEPTION 'O valor do pagamento deve ser estritamente positivo.';
    END IF;

    IF (p_receivable_id IS NOT NULL AND p_payable_id IS NOT NULL) OR
       (p_receivable_id IS NULL AND p_payable_id IS NULL) THEN
        RAISE EXCEPTION 'Informe exatamente um título: ou receivable_id ou payable_id.';
    END IF;

    -- Pagamento de Recebível (Entrada de Dinheiro)
    IF p_receivable_id IS NOT NULL THEN
        SELECT * INTO v_rec FROM public.vw_receivables_summary WHERE receivable_id = p_receivable_id;
        IF v_rec IS NULL THEN
            RAISE EXCEPTION 'Título a receber não localizado.';
        END IF;
        IF v_rec.receivable_status = 'cancelled' THEN
            RAISE EXCEPTION 'Não é permitido registrar pagamentos em título cancelado.';
        END IF;
        IF p_amount > v_rec.remaining_balance THEN
            RAISE EXCEPTION 'Valor do pagamento (%) excede o saldo devedor restante (%).', p_amount, v_rec.remaining_balance;
        END IF;

        SELECT id INTO v_category_id FROM public.financial_categories WHERE name = 'Recebimento de Vendas a Prazo' AND type = 'in' LIMIT 1;
        IF v_category_id IS NULL THEN
            INSERT INTO public.financial_categories (name, type) VALUES ('Recebimento de Vendas a Prazo', 'in') RETURNING id INTO v_category_id;
        END IF;

        INSERT INTO public.financial_transactions (
            type, amount, payment_method, payment_date, category_id, receivable_id, status, notes, created_by
        ) VALUES (
            'in', p_amount, p_payment_method, COALESCE(p_payment_date, CURRENT_DATE),
            v_category_id, p_receivable_id, 'cleared', p_notes, v_user_id
        ) RETURNING id INTO v_transaction_id;
    END IF;

    -- Pagamento de Conta a Pagar (Saída de Dinheiro)
    IF p_payable_id IS NOT NULL THEN
        SELECT * INTO v_pay FROM public.vw_payables_summary WHERE payable_id = p_payable_id;
        IF v_pay IS NULL THEN
            RAISE EXCEPTION 'Título a pagar não localizado.';
        END IF;
        IF v_pay.payable_status = 'cancelled' THEN
            RAISE EXCEPTION 'Não é permitido quitar título a pagar cancelado.';
        END IF;
        IF p_amount > v_pay.remaining_balance THEN
            RAISE EXCEPTION 'Valor do pagamento (%) excede o saldo a pagar restante (%).', p_amount, v_pay.remaining_balance;
        END IF;

        INSERT INTO public.financial_transactions (
            type, amount, payment_method, payment_date, category_id, payable_id, status, notes, created_by
        ) VALUES (
            'out', p_amount, p_payment_method, COALESCE(p_payment_date, CURRENT_DATE),
            v_pay.category_id, p_payable_id, 'cleared', p_notes, v_user_id
        ) RETURNING id INTO v_transaction_id;
    END IF;

    RETURN v_transaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 3. RPC: Conclusão Atômica de Ordem de Produção
CREATE OR REPLACE FUNCTION public.fn_complete_production_order(
    p_production_order_id UUID,
    p_consumptions JSONB, -- [{"material_id": uuid, "actual_quantity": num, "unit": "g"}]
    p_outputs JSONB       -- [{"product_id": uuid, "good_quantity": num, "lost_quantity": num, "loss_reason": "..."}]
)
RETURNS VOID AS $$
DECLARE
    v_user_id UUID;
    v_order RECORD;
    v_cons RECORD;
    v_out RECORD;
    v_curr_stock NUMERIC(12, 3);
    v_mat_cost NUMERIC(12, 4);
    v_prod_cost NUMERIC(12, 2);
    v_total_good NUMERIC(12, 2) := 0.00;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        SELECT id INTO v_user_id FROM public.profiles LIMIT 1;
    END IF;

    SELECT * INTO v_order FROM public.production_orders WHERE id = p_production_order_id FOR UPDATE;
    IF v_order IS NULL THEN
        RAISE EXCEPTION 'Ordem de produção não encontrada.';
    END IF;
    IF v_order.status = 'completed' THEN
        RAISE EXCEPTION 'Esta ordem de produção já foi concluída anteriormente.';
    END IF;
    IF v_order.status = 'cancelled' THEN
        RAISE EXCEPTION 'Não é permitido concluir ordem de produção cancelada.';
    END IF;

    -- Processar Baixa de Insumos Consumidos
    FOR v_cons IN SELECT * FROM jsonb_to_recordset(p_consumptions) AS (
        material_id UUID,
        actual_quantity NUMERIC(12, 3),
        unit VARCHAR(10)
    ) LOOP
        -- Lock e verificação de estoque de insumo (Insumo NUNCA pode ficar negativo)
        SELECT current_quantity INTO v_curr_stock
        FROM public.inventory_balances
        WHERE material_id = v_cons.material_id
        FOR UPDATE;

        IF (v_curr_stock - v_cons.actual_quantity) < 0 THEN
            RAISE EXCEPTION 'Estoque insuficiente de insumo % para produção (Disponível: %, Consumo: %)', 
            v_cons.material_id, v_curr_stock, v_cons.actual_quantity;
        END IF;

        SELECT current_avg_cost INTO v_mat_cost FROM public.materials WHERE id = v_cons.material_id;

        -- Gravar consumo analítico
        INSERT INTO public.production_consumptions (
            production_order_id, material_id, actual_quantity, unit, unit_cost
        ) VALUES (
            p_production_order_id, v_cons.material_id, v_cons.actual_quantity, v_cons.unit, v_mat_cost
        );

        -- Gravar saída no Ledger de Estoque
        INSERT INTO public.stock_movements (
            material_id, movement_type, quantity, unit, unit_cost, reference_type, reference_id, notes, created_by
        ) VALUES (
            v_cons.material_id, 'production_consumption_out', v_cons.actual_quantity, v_cons.unit, v_mat_cost,
            'production_order', p_production_order_id, 'Consumo de fabricação do lote', v_user_id
        );

        -- Atualizar projeção de saldo de insumo
        UPDATE public.inventory_balances
        SET current_quantity = current_quantity - v_cons.actual_quantity, updated_at = NOW()
        WHERE material_id = v_cons.material_id;
    END LOOP;

    -- Processar Entrada de Produtos Acabados e Registro de Perdas
    FOR v_out IN SELECT * FROM jsonb_to_recordset(p_outputs) AS (
        product_id UUID,
        good_quantity NUMERIC(12, 2),
        lost_quantity NUMERIC(12, 2),
        loss_reason VARCHAR(100)
    ) LOOP
        SELECT manual_cost_price INTO v_prod_cost FROM public.products WHERE id = v_out.product_id;

        -- Gravar saída analítica do lote
        INSERT INTO public.production_outputs (
            production_order_id, product_id, good_quantity, lost_quantity, loss_reason
        ) VALUES (
            p_production_order_id, v_out.product_id, v_out.good_quantity, v_out.lost_quantity, v_out.loss_reason
        );

        v_total_good := v_total_good + v_out.good_quantity;

        -- Entrada física dos doces prontos no Ledger
        IF v_out.good_quantity > 0 THEN
            INSERT INTO public.stock_movements (
                product_id, movement_type, quantity, unit, unit_cost, reference_type, reference_id, notes, created_by
            ) VALUES (
                v_out.product_id, 'production_in', v_out.good_quantity, 'un', v_prod_cost,
                'production_order', p_production_order_id, 'Entrada de doces prontos para venda', v_user_id
            );

            UPDATE public.inventory_balances
            SET current_quantity = current_quantity + v_out.good_quantity, updated_at = NOW()
            WHERE product_id = v_out.product_id;
        END IF;

        -- Registro de perda física no Ledger, se houver
        IF v_out.lost_quantity > 0 THEN
            INSERT INTO public.stock_movements (
                product_id, movement_type, quantity, unit, unit_cost, reference_type, reference_id, notes, created_by
            ) VALUES (
                v_out.product_id, 'loss_out', v_out.lost_quantity, 'un', v_prod_cost,
                'production_order', p_production_order_id, COALESCE(v_out.loss_reason, 'Descarte em lote de produção'), v_user_id
            );
        END IF;
    END LOOP;

    -- Atualizar status da Ordem de Produção
    UPDATE public.production_orders
    SET status = 'completed', completion_date = NOW()
    WHERE id = p_production_order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 4. RPC: Cancelamento Atômico de Venda
CREATE OR REPLACE FUNCTION public.fn_cancel_sale(
    p_sale_id UUID,
    p_reason TEXT
)
RETURNS VOID AS $$
DECLARE
    v_user_id UUID;
    v_sale RECORD;
    v_item RECORD;
    v_trans RECORD;
    v_adv RECORD;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        SELECT id INTO v_user_id FROM public.profiles LIMIT 1;
    END IF;

    IF p_reason IS NULL OR LENGTH(TRIM(p_reason)) < 5 THEN
        RAISE EXCEPTION 'A justificativa do cancelamento é obrigatória e deve ter pelo menos 5 caracteres.';
    END IF;

    SELECT * INTO v_sale FROM public.sales WHERE id = p_sale_id FOR UPDATE;
    IF v_sale IS NULL THEN
        RAISE EXCEPTION 'Venda não localizada.';
    END IF;
    IF v_sale.status = 'cancelled' THEN
        RAISE EXCEPTION 'Esta venda já está cancelada.';
    END IF;

    -- 1. Marcar venda como cancelada
    UPDATE public.sales SET status = 'cancelled' WHERE id = p_sale_id;

    -- 2. Devolver produtos ao estoque físico (Estorno)
    FOR v_item IN SELECT * FROM public.sale_items WHERE sale_id = p_sale_id LOOP
        INSERT INTO public.stock_movements (
            product_id, movement_type, quantity, unit, unit_cost, reference_type, reference_id, notes, created_by
        ) VALUES (
            v_item.product_id, 'sale_cancellation_in', v_item.quantity, 'un', v_item.unit_cost_at_sale,
            'sale', p_sale_id, 'Estorno automático de venda cancelada', v_user_id
        );

        UPDATE public.inventory_balances
        SET current_quantity = current_quantity + v_item.quantity, updated_at = NOW()
        WHERE product_id = v_item.product_id;
    END LOOP;

    -- 3. Cancelar Contas a Receber, se houver
    UPDATE public.receivables
    SET status = 'cancelled'
    WHERE sale_id = p_sale_id;

    -- 4. Restaurar Adiantamento de Pedido, se tiver sido aplicado
    FOR v_adv IN SELECT * FROM public.order_advance_applications WHERE sale_id = p_sale_id LOOP
        DELETE FROM public.order_advance_applications WHERE id = v_adv.id;

        UPDATE public.order_advances
        SET status = 'available'
        WHERE id = v_adv.order_advance_id;
    END LOOP;

    -- 5. Estorno Contábil de Pagamentos de Caixa Realizados
    FOR v_trans IN SELECT * FROM public.financial_transactions WHERE sale_id = p_sale_id AND status = 'cleared' LOOP
        INSERT INTO public.financial_transactions (
            type, amount, payment_method, category_id, sale_id, reversal_of_id, status, notes, created_by
        ) VALUES (
            'out', v_trans.amount, v_trans.payment_method, v_trans.category_id, p_sale_id, v_trans.id,
            'cleared', 'Estorno de pagamento de venda cancelada', v_user_id
        );
    END LOOP;

    -- 6. Auditoria
    INSERT INTO public.audit_logs (user_id, action, table_name, record_id, reason, details)
    VALUES (
        v_user_id, 'SALE_CANCELLED', 'sales', p_sale_id, p_reason,
        jsonb_build_object('sale_code', v_sale.code, 'net_amount', v_sale.net_amount)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
