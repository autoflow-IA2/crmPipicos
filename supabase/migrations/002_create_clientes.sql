-- Criação da tabela de clientes
CREATE TABLE IF NOT EXISTS clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Dados Pessoais
  nome VARCHAR(255) NOT NULL,
  cpf_cnpj VARCHAR(20),
  email VARCHAR(255),
  telefone VARCHAR(20) NOT NULL,
  telefone_alternativo VARCHAR(20),
  data_nascimento DATE,

  -- Endereço
  cep VARCHAR(10),
  endereco TEXT,
  numero VARCHAR(20),
  complemento VARCHAR(100),
  bairro VARCHAR(100),
  cidade VARCHAR(100),
  estado VARCHAR(2),

  -- Observações
  observacoes TEXT,

  -- Metadados
  usuario_criacao UUID REFERENCES auth.users(id),
  usuario_atualizacao UUID REFERENCES auth.users(id),

  -- Status
  ativo BOOLEAN DEFAULT true
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_clientes_nome ON clientes(nome);
CREATE INDEX IF NOT EXISTS idx_clientes_telefone ON clientes(telefone);
CREATE INDEX IF NOT EXISTS idx_clientes_email ON clientes(email);
CREATE INDEX IF NOT EXISTS idx_clientes_cpf_cnpj ON clientes(cpf_cnpj);
CREATE INDEX IF NOT EXISTS idx_clientes_ativo ON clientes(ativo);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_clientes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_clientes_updated_at_trigger
    BEFORE UPDATE ON clientes
    FOR EACH ROW
    EXECUTE FUNCTION update_clientes_updated_at();

-- Row Level Security (RLS)
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Permitir leitura para usuários autenticados"
    ON clientes FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Permitir inserção para usuários autenticados"
    ON clientes FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Permitir atualização para usuários autenticados"
    ON clientes FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Permitir exclusão para usuários autenticados"
    ON clientes FOR DELETE
    TO authenticated
    USING (true);

-- Comentários na tabela
COMMENT ON TABLE clientes IS 'Tabela de cadastro de clientes do CRM';
COMMENT ON COLUMN clientes.nome IS 'Nome completo do cliente';
COMMENT ON COLUMN clientes.cpf_cnpj IS 'CPF ou CNPJ do cliente';
COMMENT ON COLUMN clientes.ativo IS 'Indica se o cliente está ativo no sistema';
