# API REST - Agendamento PPC

API REST para integração com n8n e ferramentas externas para gerenciamento de agendamentos de brinquedos, recreação e decoração.

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 18+ instalado
- Conta no Supabase com projeto configurado
- npm ou yarn

### Instalação

```bash
# 1. Navegar até a pasta do backend
cd backend

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas credenciais

# 4. Iniciar servidor em modo desenvolvimento
npm run dev

# 5. Ou fazer build e rodar em produção
npm run build
npm start
```

### Configuração do .env

```env
# Configuração do Servidor
PORT=3001
NODE_ENV=development

# API Key para autenticação
# Gere uma chave segura usando: openssl rand -base64 32
API_KEY=sua-chave-api-super-secreta-aqui

# Configuração do Supabase
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_KEY=sua-service-role-key

# CORS - Origens permitidas (separadas por vírgula)
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

## 📚 Documentação da API

### Autenticação

Todas as rotas `/api/*` requerem autenticação via API Key.

**Header obrigatório:**
```
X-API-Key: sua-chave-api-aqui
```

### Formato de Resposta

#### Sucesso
```json
{
  "success": true,
  "data": { ... },
  "message": "Mensagem de sucesso"
}
```

#### Erro
```json
{
  "success": false,
  "error": {
    "code": "CODIGO_ERRO",
    "message": "Mensagem de erro",
    "details": { ... }
  }
}
```

## 🛣️ Endpoints

### 1. Health Check

**GET** `/api/health`

Verifica se a API está funcionando.

**Resposta:**
```json
{
  "success": true,
  "data": {
    "status": "OK",
    "timestamp": "2025-11-18T10:30:00.000Z",
    "uptime": 12345,
    "environment": "development"
  }
}
```

### 2. Listar Agendamentos

**GET** `/api/agendamentos`

Lista agendamentos com filtros opcionais.

**Query Parameters:**
- `data` - Filtrar por data específica (YYYY-MM-DD)
- `dataInicio` - Data inicial do período (YYYY-MM-DD)
- `dataFim` - Data final do período (YYYY-MM-DD)
- `status` - Filtrar por status (pendente, confirmado, em_preparacao, entregue, finalizado, cancelado)
- `tipoServico` - Filtrar por tipo (brinquedos, recreacao, decoracao, completo)
- `cliente` - Buscar por nome do cliente (parcial)

**Exemplo:**
```bash
GET /api/agendamentos?dataInicio=2025-11-01&dataFim=2025-11-30&status=confirmado
```

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "cliente_nome": "João Silva",
      "cliente_telefone": "11999999999",
      "data_evento": "2025-11-20",
      "hora_inicio": "14:00",
      "hora_fim": "18:00",
      "tipo_servico": "completo",
      "status": "confirmado",
      ...
    }
  ]
}
```

### 3. Buscar Agendamento por ID

**GET** `/api/agendamentos/:id`

Retorna detalhes de um agendamento específico.

**Exemplo:**
```bash
GET /api/agendamentos/123e4567-e89b-12d3-a456-426614174000
```

### 4. Criar Agendamento

**POST** `/api/agendamentos`

Cria um novo agendamento. Verifica automaticamente conflitos de horário.

**Body (JSON):**
```json
{
  "cliente_nome": "Maria Santos",
  "cliente_telefone": "11988888888",
  "cliente_email": "maria@example.com",
  "cliente_endereco": "Rua das Flores, 123",
  "cliente_bairro": "Centro",
  "cliente_cidade": "São Paulo",
  "cliente_cep": "01234-567",

  "tipo_servico": "completo",
  "data_evento": "2025-11-25",
  "hora_inicio": "15:00",
  "hora_fim": "19:00",
  "tipo_evento": "Aniversário infantil",
  "num_convidados": 50,
  "faixa_etaria": "infantil",

  "brinquedos_selecionados": [
    {
      "id": "brinquedo-1",
      "nome": "Pula-pula",
      "quantidade": 1,
      "valor": 200.00
    }
  ],
  "recreadores_quantidade": 2,
  "tema_decoracao": "Super-heróis",

  "valor_total": 800.00,
  "valor_sinal": 200.00,
  "valor_restante": 600.00,
  "forma_pagamento": "PIX",
  "status_pagamento": "sinal_pago",

  "status": "pendente",
  "observacoes": "Cliente prefere balões azuis",

  "necessita_montagem": true,
  "hora_montagem": "13:00"
}
```

**Resposta (sem conflitos):**
```json
{
  "success": true,
  "data": {
    "id": "novo-id-gerado",
    ...
  },
  "message": "Agendamento criado com sucesso"
}
```

**Resposta (com conflitos):**
```json
{
  "success": true,
  "data": {
    "agendamento": { ... },
    "avisos": {
      "conflitos_horario": [
        {
          "id": "outro-id",
          "cliente_nome": "Pedro Costa",
          "data_evento": "2025-11-25",
          "hora_inicio": "14:00",
          "hora_fim": "18:00"
        }
      ],
      "mensagem": "Atenção: Existem 1 agendamento(s) conflitante(s) no mesmo horário."
    }
  },
  "message": "Agendamento criado com sucesso, mas existem conflitos de horário"
}
```

### 5. Atualizar Agendamento

**PATCH** `/api/agendamentos/:id`

Atualiza um agendamento existente (campos parciais).

**Body (JSON):**
```json
{
  "status": "confirmado",
  "valor_sinal": 250.00,
  "observacoes": "Cliente solicitou mais balões"
}
```

### 6. Atualizar Status

**PATCH** `/api/agendamentos/:id/status`

Atualiza apenas o status do agendamento.

**Body (JSON):**
```json
{
  "status": "confirmado"
}
```

**Status válidos:**
- `pendente`
- `confirmado`
- `em_preparacao`
- `entregue`
- `finalizado`
- `cancelado`

### 7. Deletar Agendamento

**DELETE** `/api/agendamentos/:id`

Remove um agendamento.

### 8. Verificar Disponibilidade

**POST** `/api/agendamentos/verificar-disponibilidade`

Verifica se há conflitos de horário sem criar o agendamento.

**Body (JSON):**
```json
{
  "dataEvento": "2025-11-25",
  "horaInicio": "15:00",
  "horaFim": "19:00",
  "excludeId": "id-para-excluir-da-verificacao" // Opcional
}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "disponivel": false,
    "conflitos": [
      {
        "id": "conflito-id",
        "cliente_nome": "Ana Silva",
        "data_evento": "2025-11-25",
        "hora_inicio": "14:00",
        "hora_fim": "18:00",
        "tipo_servico": "brinquedos"
      }
    ]
  },
  "message": "1 conflito(s) encontrado(s)"
}
```

## 🔒 Segurança

- ✅ API Key obrigatória em todas as requisições `/api/*`
- ✅ CORS configurável
- ✅ Helmet.js para headers de segurança
- ✅ Validação de entrada com Zod
- ✅ Service Role Key do Supabase (bypass RLS)
- ✅ Tratamento consistente de erros

## 🧪 Testando a API

### Com cURL

```bash
# Health check
curl -H "X-API-Key: sua-api-key" http://localhost:3001/api/health

# Listar agendamentos
curl -H "X-API-Key: sua-api-key" http://localhost:3001/api/agendamentos

# Criar agendamento
curl -X POST \
  -H "X-API-Key: sua-api-key" \
  -H "Content-Type: application/json" \
  -d '{"cliente_nome":"Teste","cliente_telefone":"11999999999","tipo_servico":"brinquedos","data_evento":"2025-12-01","hora_inicio":"14:00","hora_fim":"18:00"}' \
  http://localhost:3001/api/agendamentos
```

### Com Postman/Insomnia

1. Configure o header `X-API-Key` com sua chave
2. Importe a collection (ver seção abaixo)

## 📦 Deploy

### Opções de Hosting

- **Render.com** (gratuito)
- **Railway.app** (gratuito)
- **Fly.io** (gratuito com limites)
- **Heroku** (pago)
- **VPS** (DigitalOcean, Linode, etc)

### Exemplo de Deploy no Render

1. Conecte seu repositório
2. Configure as variáveis de ambiente
3. Build command: `npm run build`
4. Start command: `npm start`

## 📊 Logs

A API usa Morgan para logging de requisições:

```
::1 - - [18/Nov/2025:10:30:00 +0000] "GET /api/agendamentos HTTP/1.1" 200 1234
```

## ⚡ Performance

- Índices criados no Supabase para queries rápidas
- Validação eficiente com Zod
- Service cacheável com React Query no frontend

## 🐛 Códigos de Erro

| Código | Descrição |
|--------|-----------|
| `UNAUTHORIZED` | API Key não fornecida |
| `FORBIDDEN` | API Key inválida |
| `NOT_FOUND` | Recurso não encontrado |
| `VALIDATION_ERROR` | Dados inválidos |
| `CONFLICT` | Conflito de dados |
| `DATABASE_ERROR` | Erro no banco de dados |
| `INTERNAL_ERROR` | Erro interno do servidor |

## 📞 Suporte

Para problemas ou dúvidas, abra uma issue no repositório.

---

**Versão:** 1.0.0
**Última atualização:** Novembro 2025
