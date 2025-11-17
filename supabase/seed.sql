-- Dados de exemplo para Brinquedos
INSERT INTO brinquedos (nome, descricao, categoria, capacidade_pessoas, dimensoes, valor_locacao, quantidade_estoque, status) VALUES
('Pula-Pula Castelo', 'Pula-pula temático de castelo medieval', 'Infláveis', 8, '3x3x2.5m', 250.00, 3, 'disponivel'),
('Tobogã Gigante', 'Tobogã inflável de 5 metros de altura', 'Infláveis', 1, '5x3x5m', 400.00, 2, 'disponivel'),
('Piscina de Bolinhas', 'Piscina inflável com 1000 bolinhas coloridas', 'Infláveis', 10, '4x4x1m', 200.00, 2, 'disponivel'),
('Cama Elástica', 'Cama elástica profissional com rede de proteção', 'Trampolins', 3, '3.5m diâmetro', 180.00, 4, 'disponivel'),
('Mesa de Pebolim', 'Mesa de pebolim profissional', 'Jogos', 4, '1.4x0.8x0.9m', 100.00, 2, 'disponivel'),
('Mesa de Ping Pong', 'Mesa oficial de tênis de mesa', 'Jogos', 4, '2.74x1.52m', 120.00, 2, 'disponivel');

-- Dados de exemplo para Itens de Decoração
INSERT INTO itens_decoracao (nome, categoria, descricao, quantidade_estoque, valor_locacao) VALUES
('Painel de Festa Infantil', 'Painéis', 'Painel temático personalizável', 5, 80.00),
('Kit Balões Arco-Íris', 'Balões', 'Kit com 100 balões coloridos', 10, 50.00),
('Toalha de Mesa Premium', 'Toalhas', 'Toalha de mesa 3x1.5m', 20, 30.00),
('Cortina de LED', 'Iluminação', 'Cortina de LED 3x2m com efeitos', 8, 150.00),
('Mesa Provençal Branca', 'Móveis', 'Mesa provençal decorativa', 10, 200.00),
('Kit Utensílios Descartáveis', 'Utensílios', 'Pratos, copos e talheres para 50 pessoas', 50, 40.00);

-- Dados de exemplo para Agendamentos (apenas se houver usuário autenticado)
-- Nota: Estes inserts devem ser executados após ter usuários criados no sistema
-- Você pode descomentar e ajustar os UUIDs após criar usuários

/*
INSERT INTO agendamentos (
  cliente_nome, cliente_telefone, cliente_email, cliente_endereco,
  cliente_bairro, cliente_cidade, cliente_cep,
  tipo_servico, data_evento, hora_inicio, hora_fim, tipo_evento,
  num_convidados, faixa_etaria,
  brinquedos_selecionados,
  recreadores_quantidade,
  itens_decoracao,
  tema_decoracao,
  valor_total, valor_sinal, valor_restante,
  forma_pagamento, status_pagamento, status,
  observacoes, necessita_montagem, hora_montagem
) VALUES
(
  'Maria Silva',
  '(11) 98765-4321',
  'maria.silva@email.com',
  'Rua das Flores, 123',
  'Jardim Primavera',
  'São Paulo',
  '01234-567',
  'completo',
  CURRENT_DATE + INTERVAL '15 days',
  '14:00:00',
  '18:00:00',
  'Aniversário Infantil',
  30,
  'infantil',
  '[{"id": "uuid", "nome": "Pula-Pula Castelo", "quantidade": 1, "valor": 250}]'::jsonb,
  2,
  '[{"id": "uuid", "nome": "Painel de Festa Infantil", "quantidade": 1, "valor": 80}, {"id": "uuid", "nome": "Kit Balões Arco-Íris", "quantidade": 2, "valor": 100}]'::jsonb,
  'Frozen',
  800.00,
  400.00,
  400.00,
  'PIX',
  'sinal_pago',
  'confirmado',
  'Festa de 5 anos da Ana. Tema Frozen.',
  true,
  '12:00:00'
),
(
  'João Santos',
  '(11) 91234-5678',
  'joao.santos@email.com',
  'Av. Principal, 456',
  'Centro',
  'São Paulo',
  '01234-890',
  'brinquedos',
  CURRENT_DATE + INTERVAL '7 days',
  '15:00:00',
  '19:00:00',
  'Confraternização',
  50,
  'misto',
  '[{"id": "uuid", "nome": "Tobogã Gigante", "quantidade": 1, "valor": 400}, {"id": "uuid", "nome": "Cama Elástica", "quantidade": 2, "valor": 360}]'::jsonb,
  0,
  null,
  null,
  760.00,
  300.00,
  460.00,
  'Cartão',
  'sinal_pago',
  'confirmado',
  'Evento corporativo. Necessário chegar com 2h de antecedência.',
  true,
  '13:00:00'
);
*/
