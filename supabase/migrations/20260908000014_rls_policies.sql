-- 014_rls_policies.sql
-- Políticas de Row Level Security (RLS) Governança por Papéis

-- Habilitar RLS em todas as tabelas públicas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_advances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_advance_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receivables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_consumptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_outputs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Política de Administrador: Acesso Pleno em Tudo
DO $$ 
DECLARE
    t text;
    tables text[] := ARRAY[
        'profiles', 'customers', 'suppliers', 'financial_categories',
        'products', 'materials', 'inventory_balances', 'stock_movements',
        'orders', 'order_items', 'order_advances', 'sales', 'sale_items',
        'order_advance_applications', 'receivables', 'purchases', 'purchase_items',
        'payables', 'financial_transactions', 'recipes', 'recipe_items',
        'production_orders', 'production_consumptions', 'production_outputs', 'audit_logs'
    ];
BEGIN
    FOREACH t IN ARRAY tables LOOP
        EXECUTE format('
            DROP POLICY IF EXISTS p_admin_all_%I ON public.%I;
            CREATE POLICY p_admin_all_%I ON public.%I
            FOR ALL TO authenticated
            USING (public.fn_current_user_role() = ''admin'')
            WITH CHECK (public.fn_current_user_role() = ''admin'');
        ', t, t, t, t);
    END LOOP;
END $$;

-- 2. Políticas de Vendedor (seller):
-- Leitura de catálogo, clientes, pedidos e vendas
CREATE POLICY p_seller_read_catalog ON public.products FOR SELECT TO authenticated
USING (public.fn_current_user_role() IN ('seller', 'finance', 'production'));

CREATE POLICY p_seller_customers ON public.customers FOR ALL TO authenticated
USING (public.fn_current_user_role() IN ('seller', 'finance'))
WITH CHECK (public.fn_current_user_role() IN ('seller', 'finance'));

CREATE POLICY p_seller_orders ON public.orders FOR ALL TO authenticated
USING (public.fn_current_user_role() = 'seller')
WITH CHECK (public.fn_current_user_role() = 'seller');

CREATE POLICY p_seller_order_items ON public.order_items FOR ALL TO authenticated
USING (public.fn_current_user_role() = 'seller')
WITH CHECK (public.fn_current_user_role() = 'seller');

CREATE POLICY p_seller_sales_read ON public.sales FOR SELECT TO authenticated
USING (public.fn_current_user_role() = 'seller');

CREATE POLICY p_seller_sale_items_read ON public.sale_items FOR SELECT TO authenticated
USING (public.fn_current_user_role() = 'seller');

CREATE POLICY p_seller_receivables_read ON public.receivables FOR SELECT TO authenticated
USING (public.fn_current_user_role() = 'seller');

CREATE POLICY p_seller_inventory_read ON public.inventory_balances FOR SELECT TO authenticated
USING (public.fn_current_user_role() IN ('seller', 'production', 'finance'));

-- 3. Políticas de Financeiro (finance):
CREATE POLICY p_finance_fin_transactions ON public.financial_transactions FOR SELECT TO authenticated
USING (public.fn_current_user_role() = 'finance');

CREATE POLICY p_finance_receivables ON public.receivables FOR ALL TO authenticated
USING (public.fn_current_user_role() = 'finance')
WITH CHECK (public.fn_current_user_role() = 'finance');

CREATE POLICY p_finance_payables ON public.payables FOR ALL TO authenticated
USING (public.fn_current_user_role() = 'finance')
WITH CHECK (public.fn_current_user_role() = 'finance');

CREATE POLICY p_finance_purchases_read ON public.purchases FOR SELECT TO authenticated
USING (public.fn_current_user_role() = 'finance');

CREATE POLICY p_finance_categories_read ON public.financial_categories FOR SELECT TO authenticated
USING (public.fn_current_user_role() IN ('seller', 'finance'));

-- 4. Políticas de Produção (production):
CREATE POLICY p_prod_materials_read ON public.materials FOR SELECT TO authenticated
USING (public.fn_current_user_role() = 'production');

CREATE POLICY p_prod_recipes_read ON public.recipes FOR SELECT TO authenticated
USING (public.fn_current_user_role() = 'production');

CREATE POLICY p_prod_recipe_items_read ON public.recipe_items FOR SELECT TO authenticated
USING (public.fn_current_user_role() = 'production');

CREATE POLICY p_prod_orders ON public.production_orders FOR ALL TO authenticated
USING (public.fn_current_user_role() = 'production')
WITH CHECK (public.fn_current_user_role() = 'production');

CREATE POLICY p_prod_consumptions ON public.production_consumptions FOR ALL TO authenticated
USING (public.fn_current_user_role() = 'production')
WITH CHECK (public.fn_current_user_role() = 'production');

CREATE POLICY p_prod_outputs ON public.production_outputs FOR ALL TO authenticated
USING (public.fn_current_user_role() = 'production')
WITH CHECK (public.fn_current_user_role() = 'production');
