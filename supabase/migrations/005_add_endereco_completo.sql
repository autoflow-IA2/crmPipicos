-- Migration 005: Add endereco_completo field
-- Adiciona campo para endereço completo do evento

ALTER TABLE agendamentos
ADD COLUMN endereco_completo TEXT;

COMMENT ON COLUMN agendamentos.endereco_completo IS
'Endereço completo do local do evento. Campo opcional.';
