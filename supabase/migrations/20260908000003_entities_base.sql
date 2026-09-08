-- 003_entities_base.sql
-- Clientes, Fornecedores e Categorias Financeiras

CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    document VARCHAR(20) NULL,
    phone VARCHAR(25) NULL,
    email VARCHAR(150) NULL,
    notes TEXT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_document ON public.customers(document) WHERE document IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_customers_name ON public.customers(name);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone);

CREATE TABLE IF NOT EXISTS public.suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trade_name VARCHAR(150) NOT NULL,
    contact_name VARCHAR(100) NULL,
    document VARCHAR(20) NULL,
    phone VARCHAR(25) NULL,
    email VARCHAR(150) NULL,
    notes TEXT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_suppliers_trade_name ON public.suppliers(trade_name);

CREATE TABLE IF NOT EXISTS public.financial_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(80) NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('in', 'out')),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_financial_categories_name_type UNIQUE (name, type)
);
