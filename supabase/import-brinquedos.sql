-- Importação dos Brinquedos da Lista
-- Execute este script no SQL Editor do Supabase

-- Limpar brinquedos existentes (opcional)
-- DELETE FROM brinquedos;

-- Inserir brinquedos da lista
INSERT INTO brinquedos (nome, descricao, categoria, valor_locacao, quantidade_estoque, status) VALUES
('TOTÓ MADEIRA', 'Mesa de pebolim em madeira. Não requer monitor para eventos privados (R$ 210). Evento público: R$ 270.', 'Jogos de Mesa', 210.00, 1, 'disponivel'),
('TOTÓ DESMONTÁVEL', 'Mesa de pebolim desmontável. Não requer monitor para eventos privados (R$ 210). Evento público: R$ 270.', 'Jogos de Mesa', 210.00, 2, 'disponivel'),
('AIR GAME - MESA DE DISCO - AERO HOCKEY', 'Mesa de Air Hockey. Não requer monitor para eventos privados (R$ 200). Evento público: R$ 250.', 'Jogos de Mesa', 200.00, 3, 'disponivel'),
('KIT BABY', 'Kit completo para bebês e crianças pequenas. Não requer monitor para eventos privados (R$ 240). Evento público: R$ 280.', 'Baby', 240.00, 3, 'disponivel'),
('CAMA ELÁSTICA PEQUENA', 'Cama elástica pequena com rede de proteção. Não requer monitor para eventos privados (R$ 150). Evento público com monitor: R$ 290.', 'Camas Elásticas', 150.00, 8, 'disponivel'),
('CAMA ELÁSTICA ROSA PEQUENA', 'Cama elástica pequena rosa com rede de proteção. Não requer monitor para eventos privados (R$ 150). Evento público com monitor: R$ 290.', 'Camas Elásticas', 150.00, 1, 'disponivel'),
('CAMA ELÁSTICA GRANDE', 'Cama elástica grande com rede de proteção. Não requer monitor para eventos privados (R$ 180). Evento público com monitor: R$ 320.', 'Camas Elásticas', 180.00, 6, 'disponivel'),
('PISCINA DE BOLINHAS PEQUENA', 'Piscina de bolinhas pequena. Não requer monitor para eventos privados (R$ 150). Evento público com monitor: R$ 320.', 'Piscina de Bolinhas', 150.00, 6, 'disponivel'),
('PISCINA DE BOLINHAS GRANDE', 'Piscina de bolinhas grande. Não requer monitor para eventos privados (R$ 230). Evento público com monitor: R$ 420.', 'Piscina de Bolinhas', 230.00, 2, 'disponivel'),
('CARRINHO DE PIPOCA - PIPOQUEIRA', 'Carrinho profissional de pipoca. Requer monitor. Evento privado: R$ 380. Evento público: R$ 430.', 'Alimentação', 380.00, 2, 'disponivel'),
('ALGODÃO DOCE', 'Máquina de algodão doce profissional. Requer monitor. Evento privado: R$ 290. Evento público: R$ 350.', 'Alimentação', 290.00, 2, 'disponivel'),
('CASTELINHO - PULA PULA INFLÁVEL', 'Pula pula inflável temático de castelo. Não requer monitor para eventos privados (R$ 220). Evento público com monitor: R$ 400.', 'Infláveis', 220.00, 1, 'disponivel'),
('CASTELINHO BABY - PULA PULA INFLÁVEL', 'Pula pula inflável baby temático de castelo. Não requer monitor para eventos privados (R$ 200). Evento público com monitor: R$ 380.', 'Infláveis', 200.00, 1, 'disponivel'),
('TOBOGÃ ESCORREGADOR', 'Tobogã escorregador inflável grande. Requer monitor. Evento privado: R$ 520. Evento público: R$ 660.', 'Escorregadores', 520.00, 3, 'disponivel'),
('FUTEBOL DE SABÃO GRANDE', 'Futebol de sabão inflável tamanho grande. Requer monitor. Evento privado: R$ 750. Evento público: R$ 850.', 'Futebol de Sabão', 750.00, 2, 'disponivel'),
('FUTEBOL DE SABÃO MÉDIO - 3 em 1', 'Futebol de sabão médio 3 em 1 (vôlei, basquete e futebol). Requer monitor. Evento privado: R$ 650. Evento público: R$ 750.', 'Futebol de Sabão', 650.00, 1, 'disponivel'),
('GUERRA DE COTONETES', 'Arena inflável para guerra de cotonetes. Requer monitor. Evento privado: R$ 460. Evento público: R$ 530.', 'Interativos', 460.00, 1, 'disponivel'),
('GIRAFINHA 3 EM 1 INFLÁVEL', 'Inflável 3 em 1 com pula pula, piscina de bolinhas e escorregador. Requer monitor. Evento privado: R$ 460. Evento público: R$ 580.', 'Infláveis', 460.00, 1, 'disponivel'),
('PATRULHA CANINA 3 EM 1 INFLÁVEL', 'Inflável temático Patrulha Canina 3 em 1 com pula pula, piscina de bolinhas e escorregador. Requer monitor. Evento privado: R$ 460. Evento público: R$ 580.', 'Infláveis', 460.00, 1, 'disponivel'),
('CROCODILO INFLÁVEL', 'Pula pula inflável temático de crocodilo com escorregador. Não requer monitor para eventos privados (R$ 340). Evento público com monitor: R$ 520.', 'Infláveis', 340.00, 1, 'disponivel'),
('PULA PULA INFLÁVEL COM ESCORREGADOR', 'Pula pula inflável com escorregador (laranja ou azul). Não requer monitor para eventos privados (R$ 340). Evento público com monitor: R$ 490.', 'Infláveis', 340.00, 2, 'disponivel'),
('PULA PULA INFLÁVEL 3 EM 1 - ROXINHO', 'Pula pula inflável roxo 3 em 1. Não requer monitor para eventos privados (R$ 340). Evento público com monitor: R$ 520.', 'Infláveis', 340.00, 1, 'disponivel');

-- Verificar importação
SELECT
    categoria,
    COUNT(*) as quantidade,
    SUM(quantidade_estoque) as total_unidades
FROM brinquedos
GROUP BY categoria
ORDER BY categoria;

SELECT 'Total de brinquedos importados: ' || COUNT(*) as resultado FROM brinquedos;
