-- 007_sales_and_receivables.sql
-- Vendas Faturadas, Itens Vendidos, Aplicação de Sinais e Contas a Receber

CREATE TABLE IF NOT EXISTS public.sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(30) NOT NULL UNIQUE,
    order_id UUID NULL REFERENCES public.orders(id) ON DELETE RESTRICT,
    customer_id UUID NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
    sale_date DATE NOT NULL DEFAULT CURRENT_DATE,
    gross_amount NUMERIC(12, 2) NOT NULL CHECK (gross_amount >= 0),
    discount_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (discount_amount >= 0),
    advance_applied_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (advance_applied_amount >= 0),
    net_amount NUMERIC(12, 2) NOT NULL CHECK (net_amount >= 0),
    status VARCHAR(20) NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'cancelled')),
    notes TEXT NULL,
    created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sales_sale_date ON public.sales(sale_date);
CREATE INDEX IF NOT EXISTS idx_sales_customer ON public.sales(customer_id);
CREATE INDEX IF NOT EXISTS idx_sales_status ON public.sales(status);
CREATE INDEX IF NOT EXISTS idx_sales_order_id ON public.sales(order_id);

CREATE TABLE IF NOT EXISTS public.sale_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sale_id UUID NOT NULL REFERENCES public.sales(id) ON DELETE RESTRICT,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    order_item_id UUID NULL REFERENCES public.order_items(id) ON DELETE RESTRICT,
    quantity NUMERIC(12, 2) NOT NULL CHECK (quantity > 0),
    unit_price_sold NUMERIC(12, 2) NOT NULL CHECK (unit_price_sold >= 0),
    unit_cost_at_sale NUMERIC(12, 2) NOT NULL CHECK (unit_cost_at_sale >= 0),
    subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0)
);

CREATE INDEX IF NOT EXISTS idx_sale_items_sale_id ON public.sale_items(sale_id);
CREATE INDEX IF NOT EXISTS idx_sale_items_product_id ON public.sale_items(product_id);
CREATE INDEX IF NOT EXISTS idx_sale_items_order_item_id ON public.sale_items(order_item_id);

CREATE TABLE IF NOT EXISTS public.order_advance_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_advance_id UUID NOT NULL REFERENCES public.order_advances(id) ON DELETE RESTRICT,
    sale_id UUID NOT NULL REFERENCES public.sales(id) ON DELETE RESTRICT,
    amount_applied NUMERIC(12, 2) NOT NULL CHECK (amount_applied > 0),
    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_order_advance_sale UNIQUE (order_advance_id, sale_id)
);

CREATE TABLE IF NOT EXISTS public.receivables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sale_id UUID NOT NULL UNIQUE REFERENCES public.sales(id) ON DELETE RESTRICT,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
    original_amount NUMERIC(12, 2) NOT NULL CHECK (original_amount > 0),
    due_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'cancelled')),
    notes TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_receivables_customer ON public.receivables(customer_id);
CREATE INDEX IF NOT EXISTS idx_receivables_due_date ON public.receivables(due_date);
CREATE INDEX IF NOT EXISTS idx_receivables_status ON public.receivables(status);
