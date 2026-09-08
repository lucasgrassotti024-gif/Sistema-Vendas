-- 005_inventory_core.sql
-- Estoque: Projeção de Saldos (Semáforo de Concorrência) e Livro-Razão (Ledger)

CREATE TABLE IF NOT EXISTS public.inventory_balances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_type VARCHAR(10) NOT NULL CHECK (item_type IN ('material', 'product')),
    material_id UUID NULL REFERENCES public.materials(id) ON DELETE RESTRICT,
    product_id UUID NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    current_quantity NUMERIC(12, 3) NOT NULL DEFAULT 0.000,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_inventory_balances_target CHECK (
        (item_type = 'material' AND material_id IS NOT NULL AND product_id IS NULL) OR
        (item_type = 'product' AND product_id IS NOT NULL AND material_id IS NULL)
    )
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_inventory_balances_material ON public.inventory_balances(material_id) WHERE material_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS uq_inventory_balances_product ON public.inventory_balances(product_id) WHERE product_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.stock_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_id UUID NULL REFERENCES public.materials(id) ON DELETE RESTRICT,
    product_id UUID NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    movement_type stock_movement_type NOT NULL,
    quantity NUMERIC(12, 3) NOT NULL CHECK (quantity > 0),
    unit VARCHAR(10) NOT NULL,
    unit_cost NUMERIC(12, 4) NOT NULL DEFAULT 0.0000 CHECK (unit_cost >= 0),
    reference_type VARCHAR(30) NOT NULL CHECK (reference_type IN ('purchase', 'sale', 'production_order', 'manual_adjustment', 'loss')),
    reference_id UUID NOT NULL,
    notes TEXT NULL,
    created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_stock_movement_target CHECK (
        (material_id IS NOT NULL AND product_id IS NULL) OR
        (material_id IS NULL AND product_id IS NOT NULL)
    )
);

CREATE INDEX IF NOT EXISTS idx_stock_movements_material ON public.stock_movements(material_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_product ON public.stock_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_ref ON public.stock_movements(reference_type, reference_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_created_at ON public.stock_movements(created_at);

-- Trigger de Gênese: Garante que todo novo produto ou material tenha linha inicial em inventory_balances
CREATE OR REPLACE FUNCTION public.fn_trg_init_inventory_balance_product()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.inventory_balances (item_type, product_id, current_quantity)
    VALUES ('product', NEW.id, 0.000)
    ON CONFLICT DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_init_inventory_balance_product ON public.products;
CREATE TRIGGER trg_init_inventory_balance_product
AFTER INSERT ON public.products
FOR EACH ROW EXECUTE FUNCTION public.fn_trg_init_inventory_balance_product();

CREATE OR REPLACE FUNCTION public.fn_trg_init_inventory_balance_material()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.inventory_balances (item_type, material_id, current_quantity)
    VALUES ('material', NEW.id, 0.000)
    ON CONFLICT DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_init_inventory_balance_material ON public.materials;
CREATE TRIGGER trg_init_inventory_balance_material
AFTER INSERT ON public.materials
FOR EACH ROW EXECUTE FUNCTION public.fn_trg_init_inventory_balance_material();
