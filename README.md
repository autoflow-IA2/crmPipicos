# CRM de Agendamentos - Brinquedos, Recreação e Decoração

Sistema de gestão de agendamentos para empresas de aluguel de brinquedos, recreação e decoração de eventos.

## Stack Tecnológica

- **Frontend**: React 18 + TypeScript + Vite
- **Backend/Database**: Supabase (PostgreSQL + APIs REST/Realtime)
- **Estilização**: Tailwind CSS
- **Gerenciamento de Estado**: React Query + Context API
- **Roteamento**: React Router DOM
- **Calendário**: React Big Calendar
- **Gráficos**: Recharts

## Estrutura do Projeto

```
crm-agendamentos/
├── src/
│   ├── components/
│   │   ├── agendamentos/      # Componentes específicos de agendamentos
│   │   ├── calendario/         # Componentes do calendário
│   │   ├── dashboard/          # Componentes do dashboard
│   │   ├── common/             # Componentes reutilizáveis (Button, Input, etc)
│   │   └── layout/             # Layout principal (Header, Sidebar)
│   ├── pages/                  # Páginas da aplicação
│   ├── hooks/                  # Custom hooks
│   ├── services/               # Serviços de API (Supabase)
│   ├── types/                  # Definições TypeScript
│   ├── utils/                  # Funções utilitárias
│   └── App.tsx                 # Componente principal
├── supabase/
│   ├── migrations/             # Scripts de migração do banco
│   └── seed.sql                # Dados de exemplo
└── package.json
```

## Configuração Inicial

### 1. Pré-requisitos

- Node.js 18+ instalado
- Conta no Supabase (gratuita)

### 2. Configurar o Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. Crie um novo projeto
3. Aguarde a criação do banco de dados
4. Vá em **SQL Editor** no painel lateral
5. Cole e execute o conteúdo do arquivo `supabase/migrations/001_create_agendamentos.sql`
6. (Opcional) Execute o arquivo `supabase/seed.sql` para dados de exemplo

### 3. Configurar Variáveis de Ambiente

1. Copie o arquivo `.env.example` para `.env`:
   ```bash
   copy .env.example .env
   ```

2. No painel do Supabase, vá em **Settings > API**
3. Copie os valores:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

4. Cole os valores no arquivo `.env`:
   ```env
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-publica-aqui
   ```

### 4. Instalar Dependências

```bash
npm install
```

### 5. Executar o Projeto

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza o build de produção localmente
- `npm run lint` - Executa o linter

## Funcionalidades Implementadas (Fase 1)

- ✅ Estrutura completa do projeto
- ✅ Configuração do Supabase
- ✅ Sistema de roteamento
- ✅ Layout responsivo com Sidebar e Header
- ✅ Componentes comuns reutilizáveis
- ✅ Páginas base (Dashboard, Agendamentos, Calendário, Clientes, Relatórios)
- ✅ Tipos TypeScript para todas as entidades
- ✅ Serviços de API para Agendamentos, Brinquedos e Decoração

## Próximas Fases

### Fase 2 - CRUD de Agendamentos
- Formulário completo de criação de agendamentos
- Listagem com filtros e busca integrada ao Supabase
- Edição e exclusão de agendamentos
- Validações e tratamento de erros

### Fase 3 - Dashboard e Calendário
- Dashboard com métricas em tempo real
- Implementação do calendário visual com react-big-calendar
- Gráficos de performance com Recharts
- Sistema de notificações

### Fase 4 - Módulos Complementares
- Gestão completa de clientes
- Controle financeiro
- Geração de relatórios
- Exportação de dados (PDF/Excel)

### Fase 5 - Refinamentos e Deploy
- Testes e correções
- Otimizações de performance
- Deploy em produção
- Documentação final

## Estrutura do Banco de Dados

O banco de dados possui as seguintes tabelas principais:

- **agendamentos**: Armazena todos os agendamentos
- **brinquedos**: Catálogo de brinquedos disponíveis
- **itens_decoracao**: Catálogo de itens de decoração
- **historico_status**: Histórico de mudanças de status

Para mais detalhes, consulte o arquivo `supabase/migrations/001_create_agendamentos.sql`

## Segurança

- Row Level Security (RLS) habilitado em todas as tabelas
- Autenticação via Supabase Auth
- Validação de dados no frontend e backend
- Variáveis de ambiente para credenciais sensíveis

## Suporte

Para dúvidas ou problemas:
1. Consulte a documentação do Supabase: https://supabase.com/docs
2. Consulte a documentação do Vite: https://vitejs.dev
3. Consulte a documentação do React: https://react.dev

## Licença

Este projeto foi desenvolvido para uso interno.

---

**Desenvolvido por**: Engenheiro de Software Sênior
**Data**: Novembro 2025
**Versão**: 1.0
