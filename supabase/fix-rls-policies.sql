-- Corrigir políticas de RLS para permitir acesso público aos dados
-- Execute este script no SQL Editor do Supabase

-- Para a tabela brinquedos
DROP POLICY IF EXISTS "Permitir leitura de brinquedos" ON brinquedos;
DROP POLICY IF EXISTS "Permitir gestão de brinquedos" ON brinquedos;

-- Permitir leitura pública (anon e authenticated)
CREATE POLICY "Permitir leitura pública de brinquedos"
ON brinquedos FOR SELECT
USING (true);

-- Permitir inserção/atualização/deleção apenas para usuários autenticados
CREATE POLICY "Permitir gestão de brinquedos para autenticados"
ON brinquedos FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Para a tabela itens_decoracao
DROP POLICY IF EXISTS "Permitir leitura de decoração" ON itens_decoracao;
DROP POLICY IF EXISTS "Permitir gestão de decoração" ON itens_decoracao;

CREATE POLICY "Permitir leitura pública de decoração"
ON itens_decoracao FOR SELECT
USING (true);

CREATE POLICY "Permitir gestão de decoração para autenticados"
ON itens_decoracao FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Para a tabela agendamentos
DROP POLICY IF EXISTS "Permitir leitura para usuários autenticados" ON agendamentos;
DROP POLICY IF EXISTS "Permitir inserção para usuários autenticados" ON agendamentos;
DROP POLICY IF EXISTS "Permitir atualização para usuários autenticados" ON agendamentos;

CREATE POLICY "Permitir leitura pública de agendamentos"
ON agendamentos FOR SELECT
USING (true);

CREATE POLICY "Permitir gestão de agendamentos para autenticados"
ON agendamentos FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Para a tabela historico_status
DROP POLICY IF EXISTS "Permitir leitura de histórico" ON historico_status;
DROP POLICY IF EXISTS "Permitir inserção de histórico" ON historico_status;

CREATE POLICY "Permitir leitura pública de histórico"
ON historico_status FOR SELECT
USING (true);

CREATE POLICY "Permitir gestão de histórico para autenticados"
ON historico_status FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Verificar políticas criadas
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE tablename IN ('brinquedos', 'itens_decoracao', 'agendamentos', 'historico_status')
ORDER BY tablename, policyname;
