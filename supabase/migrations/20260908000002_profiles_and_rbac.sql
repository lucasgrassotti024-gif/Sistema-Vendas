-- 002_profiles_and_rbac.sql
-- Perfis de usuário vinculados ao Supabase Auth

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE RESTRICT,
    full_name VARCHAR(150) NOT NULL,
    role user_role NOT NULL DEFAULT 'seller',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Função auxiliar de conveniência para ler o papel do usuário atual
CREATE OR REPLACE FUNCTION public.fn_current_user_role()
RETURNS user_role AS $$
DECLARE
    v_role user_role;
BEGIN
    SELECT role INTO v_role
    FROM public.profiles
    WHERE id = auth.uid();
    
    RETURN COALESCE(v_role, 'seller'::user_role);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
