# Plano de Desenvolvimento - CRM de Agendamentos para Brinquedos, Recreação e Decoração

## 1. Arquitetura do Sistema

### Stack Tecnológica Recomendada
- **Frontend**: React.js com TypeScript
- **Backend/Database**: Supabase (PostgreSQL + APIs REST/Realtime)
- **Estilização**: Tailwind CSS
- **Gerenciamento de Estado**: React Query + Context API
- **Autenticação**: Supabase Auth

---

## 2. Estrutura do Banco de Dados (Supabase)

### Tabela Principal: `agendamentos`

```sql
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
```

### Tabelas Auxiliares (Opcionais para expandir)

```sql
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
```

---

## 3. Funcionalidades do CRM

### Módulo 1: Dashboard
- **Visão Geral**:
  - Agendamentos do dia/semana/mês
  - Calendário visual interativo
  - Indicadores: total de agendamentos, receita prevista, status de pagamentos
  - Alertas de conflitos de horário
  - Gráficos de performance (agendamentos por tipo, faturamento mensal)

### Módulo 2: Gestão de Agendamentos
- **Listagem**:
  - Filtros por data, status, tipo de serviço, cliente
  - Busca por nome do cliente ou ID
  - Ordenação customizável
  - Exportação para Excel/PDF
  
- **Criação/Edição**:
  - Formulário completo com validações
  - Cálculo automático de valores
  - Seleção de brinquedos/decoração com verificação de disponibilidade
  - Upload de contratos/documentos
  - Sistema de tags/categorias

- **Visualização Detalhada**:
  - Timeline do agendamento
  - Histórico de alterações
  - Documentos anexados
  - Chat/notas internas

### Módulo 3: Calendário
- Visualização mensal/semanal/diária
- Drag & drop para reagendamento
- Cores por tipo de serviço ou status
- Verificação de conflitos automática
- Sincronização com Google Calendar (opcional)

### Módulo 4: Clientes
- Cadastro de clientes
- Histórico de agendamentos por cliente
- Dados de contato e preferências
- Sistema de fidelidade/descontos

### Módulo 5: Financeiro
- Controle de pagamentos
- Geração de recibos/notas
- Relatórios financeiros
- Contas a receber
- Fluxo de caixa

### Módulo 6: Estoque (Opcional)
- Controle de brinquedos e itens de decoração
- Disponibilidade em tempo real
- Manutenção e limpeza programada
- Alertas de itens em uso

---

## 4. Estrutura de Pastas do Projeto

```
crm-agendamentos/
├── src/
│   ├── components/
│   │   ├── agendamentos/
│   │   │   ├── AgendamentoCard.tsx
│   │   │   ├── AgendamentoForm.tsx
│   │   │   ├── AgendamentoList.tsx
│   │   │   └── AgendamentoDetalhes.tsx
│   │   ├── calendario/
│   │   │   ├── CalendarioMensal.tsx
│   │   │   └── EventoCard.tsx
│   │   ├── dashboard/
│   │   │   ├── StatsCard.tsx
│   │   │   ├── GraficoAgendamentos.tsx
│   │   │   └── ProximosEventos.tsx
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Loading.tsx
│   │   └── layout/
│   │       ├── Sidebar.tsx
│   │       ├── Header.tsx
│   │       └── Layout.tsx
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Agendamentos.tsx
│   │   ├── NovoAgendamento.tsx
│   │   ├── Calendario.tsx
│   │   ├── Clientes.tsx
│   │   └── Relatorios.tsx
│   ├── hooks/
│   │   ├── useAgendamentos.ts
│   │   ├── useSupabase.ts
│   │   └── useAuth.ts
│   ├── services/
│   │   ├── supabase.ts
│   │   ├── agendamentos.service.ts
│   │   └── clientes.service.ts
│   ├── types/
│   │   ├── agendamento.types.ts
│   │   └── cliente.types.ts
│   ├── utils/
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── calculations.ts
│   └── App.tsx
├── supabase/
│   ├── migrations/
│   │   └── 001_create_agendamentos.sql
│   └── seed.sql
└── package.json
```

---

## 5. Configuração do Supabase

### Row Level Security (RLS)

```sql
-- Habilitar RLS
ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;

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
```

---

## 6. Cronograma de Desenvolvimento

### Fase 1 - Setup e Fundação (1 semana)
- Configurar projeto React + TypeScript
- Configurar Supabase e criar tabelas
- Implementar autenticação
- Criar estrutura de pastas e componentes base

### Fase 2 - CRUD de Agendamentos (2 semanas)
- Formulário de criação de agendamentos
- Listagem com filtros e busca
- Edição e exclusão
- Validações e tratamento de erros

### Fase 3 - Dashboard e Calendário (1,5 semanas)
- Criar dashboard com métricas
- Implementar calendário visual
- Integrar gráficos
- Sistema de notificações

### Fase 4 - Módulos Complementares (1,5 semanas)
- Gestão de clientes
- Controle financeiro básico
- Relatórios
- Exportação de dados

### Fase 5 - Refinamentos e Deploy (1 semana)
- Testes e correções
- Otimizações de performance
- Deploy em produção
- Documentação

**Total estimado: 7 semanas**

---

## 7. Próximos Passos Imediatos

1. **Criar projeto no Supabase** e executar os scripts SQL
2. **Inicializar projeto React**: 
   ```bash
   npx create-react-app crm-agendamentos --template typescript
   ```
3. **Instalar dependências**:
   ```bash
   npm install @supabase/supabase-js
   npm install react-query axios date-fns
   npm install react-router-dom
   npm install tailwindcss
   npm install react-big-calendar # para calendário
   npm install recharts # para gráficos
   ```
4. **Configurar variáveis de ambiente** (.env):
   ```
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
5. **Criar primeiro componente** de listagem de agendamentos

---

## 8. Considerações de Segurança

- Implementar RLS (Row Level Security) em todas as tabelas
- Validação de dados no frontend e backend
- Sanitização de inputs para prevenir SQL Injection
- Autenticação obrigatória para todas as rotas
- Logs de auditoria para ações críticas
- Backup automático do banco de dados

---

## 9. Melhorias Futuras

- App mobile (React Native)
- Sistema de notificações por WhatsApp/SMS
- Assinatura digital de contratos
- Integração com sistemas de pagamento (PIX, cartão)
- Geolocalização para otimização de rotas de entrega
- Sistema de avaliações e feedbacks
- Portal do cliente para acompanhamento
- Integração com ERP/contabilidade

---

## 10. Requisitos Não Funcionais

- **Performance**: Carregamento de página < 3 segundos
- **Responsividade**: Compatível com desktop, tablet e mobile
- **Disponibilidade**: 99.9% uptime
- **Backup**: Backup diário automático
- **Suporte**: Documentação completa e treinamento de usuários

---

**Documentação criada por**: Engenheiro de Software Sênior  
**Data**: Novembro 2025  
**Versão**: 1.0