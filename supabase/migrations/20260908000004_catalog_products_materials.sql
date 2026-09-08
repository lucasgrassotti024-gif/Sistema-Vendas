-- 004_catalog_products_materials.sql
-- Catálogo de Produtos Vendáveis e Matérias-Primas/Insumos

CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(30) NOT NULL UNIQUE,
    name VARCHAR(120) NOT NULL,
    description TEXT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'Geral',
    sale_price NUMERIC(12, 2) NOT NULL CHECK (sale_price >= 0),
    cost_method VARCHAR(20) NOT NULL DEFAULT 'manual' CHECK (cost_method IN ('manual', 'recipe_cost')),
    manual_cost_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (manual_cost_price >= 0),
    unit VARCHAR(10) NOT NULL DEFAULT 'un',
    min_stock_alert NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (min_stock_alert >= 0),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_name ON public.products(name);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);

CREATE TABLE IF NOT EXISTS public.materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(120) NOT NULL UNIQUE,
    dimension material_dimension NOT NULL,
    base_unit VARCHAR(10) NOT NULL CHECK (base_unit IN ('g', 'ml', 'un')),
    current_avg_cost NUMERIC(12, 4) NOT NULL DEFAULT 0.0000 CHECK (current_avg_cost >= 0),
    min_stock_alert NUMERIC(12, 3) NOT NULL DEFAULT 0.000 CHECK (min_stock_alert >= 0),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_materials_dimension_unit CHECK (
        (dimension = 'mass' AND base_unit = 'g') OR
        (dimension = 'volume' AND base_unit = 'ml') OR
        (dimension = 'discrete' AND base_unit = 'un')
    )
);

CREATE INDEX IF NOT EXISTS idx_materials_name ON public.materials(name);
