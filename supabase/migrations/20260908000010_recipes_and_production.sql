-- 010_recipes_and_production.sql
-- Fichas Técnicas, Ordens de Produção, Consumos e Saídas Analíticas

CREATE TABLE IF NOT EXISTS public.recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    name VARCHAR(100) NOT NULL,
    yield_quantity NUMERIC(12, 2) NOT NULL CHECK (yield_quantity > 0),
    yield_unit VARCHAR(10) NOT NULL DEFAULT 'un',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_recipes_single_active_per_product 
ON public.recipes (product_id) WHERE (active IS TRUE);

CREATE TABLE IF NOT EXISTS public.recipe_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
    material_id UUID NOT NULL REFERENCES public.materials(id) ON DELETE RESTRICT,
    quantity_required NUMERIC(12, 3) NOT NULL CHECK (quantity_required > 0),
    unit VARCHAR(10) NOT NULL,
    CONSTRAINT uq_recipe_material UNIQUE (recipe_id, material_id)
);

CREATE TABLE IF NOT EXISTS public.production_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_code VARCHAR(30) NOT NULL UNIQUE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    recipe_id UUID NULL REFERENCES public.recipes(id) ON DELETE RESTRICT,
    planned_quantity NUMERIC(12, 2) NOT NULL CHECK (planned_quantity > 0),
    status VARCHAR(20) NOT NULL DEFAULT 'planned' CHECK (
        status IN ('planned', 'in_progress', 'completed', 'cancelled')
    ),
    start_date TIMESTAMPTZ NULL,
    completion_date TIMESTAMPTZ NULL,
    notes TEXT NULL,
    created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_production_orders_product ON public.production_orders(product_id);
CREATE INDEX IF NOT EXISTS idx_production_orders_status ON public.production_orders(status);

CREATE TABLE IF NOT EXISTS public.production_consumptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    production_order_id UUID NOT NULL REFERENCES public.production_orders(id) ON DELETE RESTRICT,
    material_id UUID NOT NULL REFERENCES public.materials(id) ON DELETE RESTRICT,
    actual_quantity NUMERIC(12, 3) NOT NULL CHECK (actual_quantity > 0),
    unit VARCHAR(10) NOT NULL,
    unit_cost NUMERIC(12, 4) NOT NULL CHECK (unit_cost >= 0)
);

CREATE INDEX IF NOT EXISTS idx_prod_consumptions_order ON public.production_consumptions(production_order_id);

CREATE TABLE IF NOT EXISTS public.production_outputs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    production_order_id UUID NOT NULL REFERENCES public.production_orders(id) ON DELETE RESTRICT,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    good_quantity NUMERIC(12, 2) NOT NULL CHECK (good_quantity >= 0),
    lost_quantity NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (lost_quantity >= 0),
    loss_reason VARCHAR(100) NULL,
    CONSTRAINT chk_production_outputs_has_qty CHECK ((good_quantity + lost_quantity) > 0)
);

CREATE INDEX IF NOT EXISTS idx_prod_outputs_order ON public.production_outputs(production_order_id);
