-- 012_views_and_summaries.sql
-- Views Especializadas: Saldos de Títulos a Receber, a Pagar e Posição de Estoque

-- View: Resumo e Saldos Dinâmicos de Contas a Receber
CREATE OR REPLACE VIEW public.vw_receivables_summary AS
SELECT 
    r.id AS receivable_id,
    r.sale_id,
    r.customer_id,
    c.name AS customer_name,
    c.phone AS customer_phone,
    r.original_amount,
    r.due_date,
    r.status AS receivable_status,
    COALESCE(SUM(CASE WHEN ft.type = 'in' AND ft.status = 'cleared' THEN ft.amount ELSE 0 END), 0.00) -
    COALESCE(SUM(CASE WHEN ft.type = 'out' AND ft.status = 'cleared' THEN ft.amount ELSE 0 END), 0.00) AS total_paid,
    r.original_amount - (
        COALESCE(SUM(CASE WHEN ft.type = 'in' AND ft.status = 'cleared' THEN ft.amount ELSE 0 END), 0.00) -
        COALESCE(SUM(CASE WHEN ft.type = 'out' AND ft.status = 'cleared' THEN ft.amount ELSE 0 END), 0.00)
    ) AS remaining_balance,
    CASE 
        WHEN r.status = 'cancelled' THEN 'cancelled'
        WHEN (r.original_amount - (
            COALESCE(SUM(CASE WHEN ft.type = 'in' AND ft.status = 'cleared' THEN ft.amount ELSE 0 END), 0.00) -
            COALESCE(SUM(CASE WHEN ft.type = 'out' AND ft.status = 'cleared' THEN ft.amount ELSE 0 END), 0.00)
        )) <= 0.00 THEN 'paid'
        WHEN r.due_date < CURRENT_DATE THEN 'overdue'
        WHEN (
            COALESCE(SUM(CASE WHEN ft.type = 'in' AND ft.status = 'cleared' THEN ft.amount ELSE 0 END), 0.00) -
            COALESCE(SUM(CASE WHEN ft.type = 'out' AND ft.status = 'cleared' THEN ft.amount ELSE 0 END), 0.00)
        ) > 0.00 THEN 'partial'
        ELSE 'pending'
    END AS computed_status,
    r.created_at
FROM public.receivables r
JOIN public.customers c ON c.id = r.customer_id
LEFT JOIN public.financial_transactions ft ON ft.receivable_id = r.id
GROUP BY r.id, r.sale_id, r.customer_id, c.name, c.phone, r.original_amount, r.due_date, r.status, r.created_at;

-- View: Resumo e Saldos Dinâmicos de Contas a Pagar
CREATE OR REPLACE VIEW public.vw_payables_summary AS
SELECT 
    p.id AS payable_id,
    p.purchase_id,
    p.supplier_id,
    s.trade_name AS supplier_name,
    p.category_id,
    fc.name AS category_name,
    p.description,
    p.original_amount,
    p.due_date,
    p.status AS payable_status,
    COALESCE(SUM(CASE WHEN ft.type = 'out' AND ft.status = 'cleared' THEN ft.amount ELSE 0 END), 0.00) -
    COALESCE(SUM(CASE WHEN ft.type = 'in' AND ft.status = 'cleared' THEN ft.amount ELSE 0 END), 0.00) AS total_paid,
    p.original_amount - (
        COALESCE(SUM(CASE WHEN ft.type = 'out' AND ft.status = 'cleared' THEN ft.amount ELSE 0 END), 0.00) -
        COALESCE(SUM(CASE WHEN ft.type = 'in' AND ft.status = 'cleared' THEN ft.amount ELSE 0 END), 0.00)
    ) AS remaining_balance,
    CASE 
        WHEN p.status = 'cancelled' THEN 'cancelled'
        WHEN (p.original_amount - (
            COALESCE(SUM(CASE WHEN ft.type = 'out' AND ft.status = 'cleared' THEN ft.amount ELSE 0 END), 0.00) -
            COALESCE(SUM(CASE WHEN ft.type = 'in' AND ft.status = 'cleared' THEN ft.amount ELSE 0 END), 0.00)
        )) <= 0.00 THEN 'paid'
        WHEN p.due_date < CURRENT_DATE THEN 'overdue'
        WHEN (
            COALESCE(SUM(CASE WHEN ft.type = 'out' AND ft.status = 'cleared' THEN ft.amount ELSE 0 END), 0.00) -
            COALESCE(SUM(CASE WHEN ft.type = 'in' AND ft.status = 'cleared' THEN ft.amount ELSE 0 END), 0.00)
        ) > 0.00 THEN 'partial'
        ELSE 'pending'
    END AS computed_status,
    p.created_at
FROM public.payables p
LEFT JOIN public.suppliers s ON s.id = p.supplier_id
JOIN public.financial_categories fc ON fc.id = p.category_id
LEFT JOIN public.financial_transactions ft ON ft.payable_id = p.id
GROUP BY p.id, p.purchase_id, p.supplier_id, s.trade_name, p.category_id, fc.name, p.description, p.original_amount, p.due_date, p.status, p.created_at;

-- View: Posição Consolidada de Estoque e Alertas de Ponto de Reposição
CREATE OR REPLACE VIEW public.vw_inventory_overview AS
SELECT 
    b.id AS balance_id,
    b.item_type,
    b.material_id,
    b.product_id,
    COALESCE(p.name, m.name) AS item_name,
    COALESCE(p.code, m.name) AS item_identifier,
    COALESCE(p.unit, m.base_unit) AS unit,
    b.current_quantity,
    COALESCE(p.min_stock_alert, m.min_stock_alert) AS min_stock_alert,
    CASE 
        WHEN b.current_quantity <= 0 THEN 'critical'
        WHEN b.current_quantity <= COALESCE(p.min_stock_alert, m.min_stock_alert) THEN 'warning'
        ELSE 'adequate'
    END AS stock_status,
    b.updated_at
FROM public.inventory_balances b
LEFT JOIN public.products p ON p.id = b.product_id
LEFT JOIN public.materials m ON m.id = b.material_id;
