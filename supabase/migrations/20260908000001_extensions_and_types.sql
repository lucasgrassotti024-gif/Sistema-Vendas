-- 001_extensions_and_types.sql
-- Sistema de Gestão - Veneza Brownies
-- Configuração de extensões, domínios e enums/tipos base

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enum para papéis de acesso do sistema
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'seller', 'finance', 'production');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Enum para dimensões físicas dos insumos
DO $$ BEGIN
    CREATE TYPE material_dimension AS ENUM ('mass', 'volume', 'discrete');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Enum para tipos de movimentação de estoque
DO $$ BEGIN
    CREATE TYPE stock_movement_type AS ENUM (
        'purchase_in',
        'purchase_cancellation_out',
        'sale_out',
        'sale_cancellation_in',
        'production_in',
        'production_consumption_out',
        'loss_out',
        'adjustment_in',
        'adjustment_out'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Enum para métodos de pagamento do caixa
DO $$ BEGIN
    CREATE TYPE payment_method_enum AS ENUM ('pix', 'cash', 'debit_card', 'credit_card', 'bank_transfer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
