# 🧪 Guia Rápido - Como Testar a API REST

## 📋 Pré-requisitos

1. Backend rodando na porta 3001
2. API Key configurada no arquivo `backend/.env`
3. Supabase configurado com dados

---

## 🚀 Iniciando o Backend

```bash
# Entre na pasta do backend
cd backend

# Instale as dependências (se ainda não fez)
npm install

# Inicie o servidor
npm run dev

# Você deve ver:
# Server running on http://localhost:3001
```

---

## 🔑 Configurar API Key

### Opção 1: Usar a API Key do .env

1. Abra o arquivo `backend/.env`
2. Localize a linha `API_KEY=...`
3. Copie o valor

### Opção 2: Gerar uma Nova API Key

```bash
# No terminal (Linux/Mac)
openssl rand -base64 32

# No PowerShell (Windows)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

Cole o resultado no arquivo `backend/.env`:
```env
API_KEY=sua-nova-chave-super-secreta
```

---

## 🧪 Testando os Endpoints

### 1. Health Check (Verificar se a API está funcionando)

```bash
curl -H "X-API-Key: sua-api-key-aqui" http://localhost:3001/api/health
```

**Resposta esperada:**
```json
{
  "success": true,
  "data": {
    "status": "OK",
    "timestamp": "2025-11-19T10:30:00.000Z",
    "uptime": 12345,
    "environment": "development"
  }
}
```

---

### 2. Listar Todos os Agendamentos

```bash
curl -H "X-API-Key: sua-api-key-aqui" http://localhost:3001/api/agendamentos
```

---

### 3. Listar Agendamentos com Filtros

#### Filtrar por Status
```bash
curl -H "X-API-Key: sua-api-key-aqui" \
  "http://localhost:3001/api/agendamentos?status=confirmado"
```

#### Filtrar por Período
```bash
curl -H "X-API-Key: sua-api-key-aqui" \
  "http://localhost:3001/api/agendamentos?dataInicio=2025-11-01&dataFim=2025-11-30"
```

#### Filtrar por Tipo de Serviço
```bash
curl -H "X-API-Key: sua-api-key-aqui" \
  "http://localhost:3001/api/agendamentos?tipoServico=completo"
```

#### Buscar por Nome do Cliente
```bash
curl -H "X-API-Key: sua-api-key-aqui" \
  "http://localhost:3001/api/agendamentos?cliente=Maria"
```

---

### 4. Buscar Agendamento por ID

```bash
curl -H "X-API-Key: sua-api-key-aqui" \
  http://localhost:3001/api/agendamentos/SEU-ID-AQUI
```

**Dica**: Copie um ID real da listagem de agendamentos

---

### 5. Criar Novo Agendamento

```bash
curl -X POST \
  -H "X-API-Key: sua-api-key-aqui" \
  -H "Content-Type: application/json" \
  -d '{
    "cliente_nome": "João da Silva",
    "cliente_telefone": "11999999999",
    "cliente_email": "joao@example.com",
    "tipo_servico": "brinquedos",
    "data_evento": "2025-12-01",
    "hora_inicio": "14:00",
    "hora_fim": "18:00",
    "tipo_evento": "Aniversário",
    "num_convidados": 30,
    "valor_total": 500.00,
    "valor_sinal": 100.00,
    "forma_pagamento": "PIX"
  }' \
  http://localhost:3001/api/agendamentos
```

**Resposta esperada:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-gerado",
    "cliente_nome": "João da Silva",
    ...
  },
  "message": "Agendamento criado com sucesso"
}
```

---

### 6. Verificar Disponibilidade (Antes de Criar)

```bash
curl -X POST \
  -H "X-API-Key: sua-api-key-aqui" \
  -H "Content-Type: application/json" \
  -d '{
    "dataEvento": "2025-12-01",
    "horaInicio": "14:00",
    "horaFim": "18:00"
  }' \
  http://localhost:3001/api/agendamentos/verificar-disponibilidade
```

**Resposta (sem conflitos):**
```json
{
  "success": true,
  "data": {
    "disponivel": true,
    "conflitos": []
  },
  "message": "Horário disponível"
}
```

**Resposta (com conflitos):**
```json
{
  "success": true,
  "data": {
    "disponivel": false,
    "conflitos": [
      {
        "id": "uuid-do-conflito",
        "cliente_nome": "Maria Santos",
        "data_evento": "2025-12-01",
        "hora_inicio": "15:00",
        "hora_fim": "19:00"
      }
    ]
  },
  "message": "1 conflito(s) encontrado(s)"
}
```

---

### 7. Atualizar Status do Agendamento

```bash
curl -X PATCH \
  -H "X-API-Key: sua-api-key-aqui" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "confirmado"
  }' \
  http://localhost:3001/api/agendamentos/SEU-ID-AQUI/status
```

**Status válidos:**
- `pendente`
- `confirmado`
- `em_preparacao`
- `entregue`
- `finalizado`
- `cancelado`

---

### 8. Atualizar Agendamento (Parcial)

```bash
curl -X PATCH \
  -H "X-API-Key: sua-api-key-aqui" \
  -H "Content-Type: application/json" \
  -d '{
    "valor_sinal": 200.00,
    "observacoes": "Cliente solicitou mais balões"
  }' \
  http://localhost:3001/api/agendamentos/SEU-ID-AQUI
```

---

### 9. Deletar Agendamento

```bash
curl -X DELETE \
  -H "X-API-Key: sua-api-key-aqui" \
  http://localhost:3001/api/agendamentos/SEU-ID-AQUI
```

---

## 🔍 Testando com a Interface Web

### Método mais fácil!

1. **Inicie o frontend:**
```bash
npm run dev
```

2. **Acesse a documentação:**
```
http://localhost:3000/api-docs
```

3. **Cole sua API Key** no campo de configuração

4. **Escolha um endpoint**

5. **Clique em "Mostrar cURL"**

6. **Copie e execute no terminal**

---

## 🔧 Testando com Ferramentas

### Postman

1. Crie uma nova requisição
2. Adicione o header:
   - Key: `X-API-Key`
   - Value: `sua-api-key-aqui`
3. Configure a URL e método
4. Envie a requisição

### Insomnia

1. Importe a collection (se disponível)
2. Configure o header `X-API-Key`
3. Teste os endpoints

### Thunder Client (VS Code)

1. Instale a extensão Thunder Client
2. Crie uma nova requisição
3. Adicione o header `X-API-Key`
4. Teste diretamente no VS Code

---

## 🐛 Troubleshooting

### Erro: UNAUTHORIZED

**Problema**: API Key não foi enviada
**Solução**: Adicione o header `X-API-Key` em todas as requisições

```bash
curl -H "X-API-Key: sua-chave" ...
```

---

### Erro: FORBIDDEN

**Problema**: API Key inválida
**Solução**: Verifique se a chave no header é igual à do arquivo `.env`

---

### Erro: Connection refused

**Problema**: Backend não está rodando
**Solução**:
```bash
cd backend
npm run dev
```

---

### Erro: NOT_FOUND

**Problema**: ID do agendamento não existe
**Solução**: Liste os agendamentos e use um ID válido

```bash
curl -H "X-API-Key: sua-chave" http://localhost:3001/api/agendamentos
```

---

### Erro: VALIDATION_ERROR

**Problema**: Dados inválidos no body
**Solução**: Verifique os campos obrigatórios:

**Campos obrigatórios para criar agendamento:**
- `cliente_nome`
- `cliente_telefone`
- `tipo_servico`
- `data_evento`
- `hora_inicio`
- `hora_fim`

---

## 🌐 Testando Integração com n8n

### Passo a Passo

1. **Crie um novo workflow no n8n**

2. **Adicione um nó "HTTP Request"**

3. **Configure:**
   - Method: `GET` (ou outro)
   - URL: `http://localhost:3001/api/agendamentos`
   - Headers:
     - Name: `X-API-Key`
     - Value: `sua-api-key-aqui`

4. **Execute o nó**

5. **Processe os dados** com outros nós

### Exemplo de Automação

```
Manual Trigger → HTTP Request (Listar Agendamentos) → Filter (Status = confirmado) → Email
```

---

## 📊 Exemplos de Uso Real

### Cenário 1: Criar Agendamento Automaticamente

**Quando**: Novo formulário no Google Forms
**Ação**: Criar agendamento via API

```javascript
// n8n - HTTP Request Node
{
  "method": "POST",
  "url": "http://localhost:3001/api/agendamentos",
  "headers": {
    "X-API-Key": "sua-chave",
    "Content-Type": "application/json"
  },
  "body": {
    "cliente_nome": "{{$node['Google Forms'].json['nome']}}",
    "cliente_telefone": "{{$node['Google Forms'].json['telefone']}}",
    "tipo_servico": "brinquedos",
    "data_evento": "{{$node['Google Forms'].json['data']}}",
    ...
  }
}
```

---

### Cenário 2: Enviar Email de Confirmação

**Quando**: Agendamento confirmado
**Ação**: Enviar email automático

```
Webhook → HTTP Request (Verificar Status) → Filter → Email
```

---

### Cenário 3: Sincronizar com Google Calendar

**Quando**: Novo agendamento criado
**Ação**: Adicionar evento no Google Calendar

```
Webhook → HTTP Request (Buscar Agendamento) → Google Calendar (Create Event)
```

---

## ✅ Checklist de Testes

- [ ] Health check funcionando
- [ ] Listar todos os agendamentos
- [ ] Filtrar por status
- [ ] Filtrar por data
- [ ] Buscar por ID
- [ ] Criar novo agendamento
- [ ] Verificar disponibilidade
- [ ] Atualizar status
- [ ] Atualizar dados parcialmente
- [ ] Deletar agendamento
- [ ] Testar com API Key inválida (deve retornar erro)
- [ ] Testar sem API Key (deve retornar erro)
- [ ] Testar criação com conflito de horário
- [ ] Testar integração com n8n/Zapier

---

## 🎯 Dicas Finais

1. **Sempre use HTTPS em produção**
2. **Mantenha a API Key segura** (nunca compartilhe)
3. **Use a documentação visual** (`/api-docs`) para referência rápida
4. **Teste todos os endpoints** antes de integrar
5. **Monitore os logs** do backend para debugar
6. **Use variáveis de ambiente** para diferentes ambientes

---

**🚀 Boa sorte com seus testes!**

Se tiver dúvidas, consulte:
- `backend/README.md` - Documentação completa da API
- `http://localhost:3000/api-docs` - Documentação visual interativa
