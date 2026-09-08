-- 009_financial_transactions.sql
-- Livro-Caixa Consolidado e Append-Only da Veneza Brownies

CREATE TABLE IF NOT EXISTS public.financial_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(5) NOT NULL CHECK (type IN ('in', 'out')),
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    payment_method payment_method_enum NOT NULL,
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    category_id UUID NOT NULL REFERENCES public.financial_categories(id) ON DELETE RESTRICT,
    receivable_id UUID NULL REFERENCES public.receivables(id) ON DELETE RESTRICT,
    payable_id UUID NULL REFERENCES public.payables(id) ON DELETE RESTRICT,
    order_advance_id UUID NULL REFERENCES public.order_advances(id) ON DELETE RESTRICT,
    sale_id UUID NULL REFERENCES public.sales(id) ON DELETE RESTRICT,
    reversal_of_id UUID NULL REFERENCES public.financial_transactions(id) ON DELETE RESTRICT,
    status VARCHAR(15) NOT NULL DEFAULT 'cleared' CHECK (status IN ('cleared', 'reversed')),
    notes TEXT NULL,
    created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_fin_transactions_single_origin CHECK (
        (
            (receivable_id IS NOT NULL)::int +
            (payable_id IS NOT NULL)::int +
            (order_advance_id IS NOT NULL)::int +
            (sale_id IS NOT NULL)::int
        ) <= 1
    ),
    CONSTRAINT chk_fin_transactions_origin_type CHECK (
        (receivable_id IS NULL OR type = 'in') AND
        (order_advance_id IS NULL OR type = 'in') AND
        (payable_id IS NULL OR type = 'out')
    )
);

CREATE INDEX IF NOT EXISTS idx_fin_transactions_date ON public.financial_transactions(payment_date);
CREATE INDEX IF NOT EXISTS idx_fin_transactions_type ON public.financial_transactions(type);
CREATE INDEX IF NOT EXISTS idx_fin_transactions_category ON public.financial_transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_fin_transactions_receivable ON public.financial_transactions(receivable_id);
CREATE INDEX IF NOT EXISTS idx_fin_transactions_payable ON public.financial_transactions(payable_id);
CREATE INDEX IF NOT EXISTS idx_fin_transactions_advance ON public.financial_transactions(order_advance_id);
CREATE INDEX IF NOT EXISTS idx_fin_transactions_sale ON public.financial_transactions(sale_id);
CREATE INDEX IF NOT EXISTS idx_fin_transactions_reversal ON public.financial_transactions(reversal_of_id);
