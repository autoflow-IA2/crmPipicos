-- Migration 004: Add brinquedo_principal field
-- Adiciona campo para identificação rápida do brinquedo/decoração principal

ALTER TABLE agendamentos
ADD COLUMN brinquedo_principal VARCHAR(255);

COMMENT ON COLUMN agendamentos.brinquedo_principal IS
'Nome do brinquedo ou decoração principal do agendamento. Campo opcional usado para identificação rápida e relatórios.';
