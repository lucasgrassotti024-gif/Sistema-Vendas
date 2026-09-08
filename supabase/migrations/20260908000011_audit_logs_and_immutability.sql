-- 011_audit_logs_and_immutability.sql
-- Trilha de Auditoria e Proteção Append-Only de Fatos Críticos

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    action VARCHAR(50) NOT NULL,
    table_name VARCHAR(50) NOT NULL,
    record_id UUID NOT NULL,
    reason TEXT NOT NULL,
    details JSONB NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_table_record ON public.audit_logs(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);

-- Função Genérica de Proteção Append-Only (Impede UPDATE e DELETE)
CREATE OR REPLACE FUNCTION public.fn_block_mutation_append_only()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Operação ilegal: a tabela % é estritamente append-only. Nenhuma alteração ou exclusão é permitida.', TG_TABLE_NAME;
END;
$$ LANGUAGE plpgsql;

-- Triggers de Bloqueio em Tabelas de Fatos Imutáveis
DROP TRIGGER IF EXISTS trg_block_mutation_stock_movements ON public.stock_movements;
CREATE TRIGGER trg_block_mutation_stock_movements
BEFORE UPDATE OR DELETE ON public.stock_movements
FOR EACH ROW EXECUTE FUNCTION public.fn_block_mutation_append_only();

DROP TRIGGER IF EXISTS trg_block_mutation_financial_transactions ON public.financial_transactions;
CREATE TRIGGER trg_block_mutation_financial_transactions
BEFORE UPDATE OR DELETE ON public.financial_transactions
FOR EACH ROW EXECUTE FUNCTION public.fn_block_mutation_append_only();

DROP TRIGGER IF EXISTS trg_block_mutation_audit_logs ON public.audit_logs;
CREATE TRIGGER trg_block_mutation_audit_logs
BEFORE UPDATE OR DELETE ON public.audit_logs
FOR EACH ROW EXECUTE FUNCTION public.fn_block_mutation_append_only();

DROP TRIGGER IF EXISTS trg_block_mutation_sale_items ON public.sale_items;
CREATE TRIGGER trg_block_mutation_sale_items
BEFORE UPDATE OR DELETE ON public.sale_items
FOR EACH ROW EXECUTE FUNCTION public.fn_block_mutation_append_only();

DROP TRIGGER IF EXISTS trg_block_mutation_purchase_items ON public.purchase_items;
CREATE TRIGGER trg_block_mutation_purchase_items
BEFORE UPDATE OR DELETE ON public.purchase_items
FOR EACH ROW EXECUTE FUNCTION public.fn_block_mutation_append_only();
