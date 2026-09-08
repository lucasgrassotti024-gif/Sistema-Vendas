-- 006_orders_and_advances.sql
-- Gestão de Encomendas, Itens Encomendados e Adiantamentos (Sinais)

CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(30) NOT NULL UNIQUE,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
    delivery_date DATE NOT NULL,
    status VARCHAR(25) NOT NULL DEFAULT 'confirmed' CHECK (
        status IN ('pending', 'confirmed', 'in_production', 'ready', 'partially_delivered', 'completed', 'cancelled')
    ),
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (total_amount >= 0),
    notes TEXT NULL,
    created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_customer ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_delivery_date ON public.orders(delivery_date);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    quantity_ordered NUMERIC(12, 2) NOT NULL CHECK (quantity_ordered > 0),
    unit_price NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0),
    discount_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (discount_amount >= 0),
    subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0)
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);

CREATE TABLE IF NOT EXISTS public.order_advances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE RESTRICT,
    total_advance_amount NUMERIC(12, 2) NOT NULL CHECK (total_advance_amount > 0),
    status VARCHAR(25) NOT NULL DEFAULT 'available' CHECK (
        status IN ('available', 'partially_applied', 'fully_applied', 'refunded', 'converted_to_credit')
    ),
    notes TEXT NULL,
    created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_advances_order_id ON public.order_advances(order_id);
