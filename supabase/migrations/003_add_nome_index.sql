-- Migração: Adicionar índice case-insensitive na coluna nome da tabela brinquedos
-- Data: 2025-11-24
-- Objetivo: Melhorar performance de busca por nome (case-insensitive)

-- Criar índice funcional usando LOWER() para busca case-insensitive
CREATE INDEX IF NOT EXISTS idx_brinquedos_nome_lower
ON brinquedos(LOWER(nome));

-- Comentário explicativo
COMMENT ON INDEX idx_brinquedos_nome_lower IS 'Índice case-insensitive para busca eficiente por nome de brinquedo';
