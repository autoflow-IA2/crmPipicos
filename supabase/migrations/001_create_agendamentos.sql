-- Tabela Principal: agendamentos
CREATE TABLE agendamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Dados do Cliente
  cliente_nome VARCHAR(255) NOT NULL,
  cliente_telefone VARCHAR(20) NOT NULL,
  cliente_email VARCHAR(255),
  cliente_endereco TEXT,
  cliente_bairro VARCHAR(100),
  cliente_cidade VARCHAR(100),
  cliente_cep VARCHAR(10),

  -- Dados do Evento
  tipo_servico VARCHAR(50) NOT NULL CHECK (tipo_servico IN ('brinquedos', 'recreacao', 'decoracao', 'completo')),
  data_evento DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fim TIME NOT NULL,
  tipo_evento VARCHAR(100), -- aniversário, casamento, corporativo, etc
  num_convidados INTEGER,
  faixa_etaria VARCHAR(50), -- infantil, adolescente, adulto, misto

  -- Itens Solicitados
  brinquedos_selecionados JSONB, -- array de objetos com brinquedos
  recreadores_quantidade INTEGER DEFAULT 0,
  itens_decoracao JSONB, -- array de itens de decoração
  tema_decoracao VARCHAR(100),

  -- Financeiro
  valor_total DECIMAL(10,2),
  valor_sinal DECIMAL(10,2),
  valor_restante DECIMAL(10,2),
  forma_pagamento VARCHAR(50),
  status_pagamento VARCHAR(30) CHECK (status_pagamento IN ('pendente', 'sinal_pago', 'pago', 'cancelado')),

  -- Status e Observações
  status VARCHAR(30) DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmado', 'em_preparacao', 'entregue', 'finalizado', 'cancelado')),
  observacoes TEXT,
  observacoes_internas TEXT,

  -- Logística
  necessita_montagem BOOLEAN DEFAULT false,
  hora_montagem TIME,
  necessita_desmontagem BOOLEAN DEFAULT false,
  hora_desmontagem TIME,
  responsavel_entrega VARCHAR(255),

  -- Metadados
  usuario_criacao UUID REFERENCES auth.users(id),
  usuario_atualizacao UUID REFERENCES auth.users(id)
);

-- Índices para performance
CREATE INDEX idx_agendamentos_data_evento ON agendamentos(data_evento);
CREATE INDEX idx_agendamentos_status ON agendamentos(status);
CREATE INDEX idx_agendamentos_cliente_nome ON agendamentos(cliente_nome);
CREATE INDEX idx_agendamentos_tipo_servico ON agendamentos(tipo_servico);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_agendamentos_updated_at BEFORE UPDATE
    ON agendamentos FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Catálogo de Brinquedos
CREATE TABLE brinquedos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  categoria VARCHAR(100),
  capacidade_pessoas INTEGER,
  dimensoes VARCHAR(100),
  valor_locacao DECIMAL(10,2),
  quantidade_estoque INTEGER DEFAULT 1,
  status VARCHAR(30) DEFAULT 'disponivel',
  foto_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Catálogo de Decoração
CREATE TABLE itens_decoracao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  categoria VARCHAR(100), -- balões, painéis, toalhas, etc
  descricao TEXT,
  quantidade_estoque INTEGER DEFAULT 1,
  valor_locacao DECIMAL(10,2),
  foto_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Histórico de Status
CREATE TABLE historico_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agendamento_id UUID REFERENCES agendamentos(id) ON DELETE CASCADE,
  status_anterior VARCHAR(30),
  status_novo VARCHAR(30),
  observacao TEXT,
  usuario_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE brinquedos ENABLE ROW LEVEL SECURITY;
ALTER TABLE itens_decoracao ENABLE ROW LEVEL SECURITY;
ALTER TABLE historico_status ENABLE ROW LEVEL SECURITY;

-- Política: Usuários autenticados podem ver todos os agendamentos
CREATE POLICY "Permitir leitura para usuários autenticados"
ON agendamentos FOR SELECT
TO authenticated
USING (true);

-- Política: Usuários autenticados podem inserir agendamentos
CREATE POLICY "Permitir inserção para usuários autenticados"
ON agendamentos FOR INSERT
TO authenticated
WITH CHECK (true);

-- Política: Usuários podem atualizar agendamentos
CREATE POLICY "Permitir atualização para usuários autenticados"
ON agendamentos FOR UPDATE
TO authenticated
USING (true);

-- Políticas para brinquedos
CREATE POLICY "Permitir leitura de brinquedos"
ON brinquedos FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Permitir gestão de brinquedos"
ON brinquedos FOR ALL
TO authenticated
USING (true);

-- Políticas para itens_decoracao
CREATE POLICY "Permitir leitura de decoração"
ON itens_decoracao FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Permitir gestão de decoração"
ON itens_decoracao FOR ALL
TO authenticated
USING (true);

-- Políticas para historico_status
CREATE POLICY "Permitir leitura de histórico"
ON historico_status FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Permitir inserção de histórico"
ON historico_status FOR INSERT
TO authenticated
WITH CHECK (true);
