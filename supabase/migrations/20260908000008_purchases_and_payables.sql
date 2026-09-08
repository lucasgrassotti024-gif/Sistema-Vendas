-- 008_purchases_and_payables.sql
-- Compras de Insumos, Itens Comprados e Contas a Pagar (Compras e Despesas Operacionais)

CREATE TABLE IF NOT EXISTS public.purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(30) NOT NULL UNIQUE,
    supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE RESTRICT,
    purchase_date DATE NOT NULL DEFAULT CURRENT_DATE,
    total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
    status VARCHAR(20) NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'cancelled')),
    notes TEXT NULL,
    created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_purchases_supplier ON public.purchases(supplier_id);
CREATE INDEX IF NOT EXISTS idx_purchases_date ON public.purchases(purchase_date);

CREATE TABLE IF NOT EXISTS public.purchase_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    purchase_id UUID NOT NULL REFERENCES public.purchases(id) ON DELETE RESTRICT,
    material_id UUID NOT NULL REFERENCES public.materials(id) ON DELETE RESTRICT,
    quantity_purchased NUMERIC(12, 3) NOT NULL CHECK (quantity_purchased > 0),
    unit_cost_paid NUMERIC(12, 4) NOT NULL CHECK (unit_cost_paid >= 0),
    subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0)
);

CREATE INDEX IF NOT EXISTS idx_purchase_items_purchase_id ON public.purchase_items(purchase_id);
CREATE INDEX IF NOT EXISTS idx_purchase_items_material_id ON public.purchase_items(material_id);

CREATE TABLE IF NOT EXISTS public.payables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    purchase_id UUID NULL UNIQUE REFERENCES public.purchases(id) ON DELETE RESTRICT,
    supplier_id UUID NULL REFERENCES public.suppliers(id) ON DELETE RESTRICT,
    category_id UUID NOT NULL REFERENCES public.financial_categories(id) ON DELETE RESTRICT,
    description VARCHAR(150) NOT NULL,
    original_amount NUMERIC(12, 2) NOT NULL CHECK (original_amount > 0),
    due_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'cancelled')),
    notes TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payables_due_date ON public.payables(due_date);
CREATE INDEX IF NOT EXISTS idx_payables_supplier ON public.payables(supplier_id);
CREATE INDEX IF NOT EXISTS idx_payables_category ON public.payables(category_id);
CREATE INDEX IF NOT EXISTS idx_payables_status ON public.payables(status);
