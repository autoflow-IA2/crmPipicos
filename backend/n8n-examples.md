# Exemplos de Integração com n8n

Este documento mostra como integrar a API de Agendamentos com o n8n para automações.

## 🔧 Configuração Inicial no n8n

### 1. Configurar Credenciais (Opcional mas recomendado)

No n8n, você pode criar uma credencial reutilizável para a API Key:

1. Vá em **Credentials** > **New**
2. Procure por **Header Auth**
3. Configure:
   - **Name**: Agendamento PPC API
   - **Header Name**: `X-API-Key`
   - **Value**: sua-chave-api-aqui

### 2. URL Base da API

```
http://localhost:3001/api
```

Se fez deploy, use a URL de produção:
```
https://sua-api.onrender.com/api
```

## 📝 Exemplos de Workflows

### Exemplo 1: Criar Agendamento a partir de Formulário Web

**Cenário:** Receber dados de um formulário (Typeform, Google Forms, etc) e criar agendamento automaticamente.

#### Nodes:

1. **Webhook** (Trigger)
   - Method: POST
   - Path: `/novo-agendamento`

2. **HTTP Request** (Criar agendamento)
   - Method: POST
   - URL: `http://localhost:3001/api/agendamentos`
   - Headers:
     - `X-API-Key`: `sua-api-key`
     - `Content-Type`: `application/json`
   - Body:
     ```json
     {
       "cliente_nome": "{{ $json.nome }}",
       "cliente_telefone": "{{ $json.telefone }}",
       "cliente_email": "{{ $json.email }}",
       "tipo_servico": "{{ $json.tipo_servico }}",
       "data_evento": "{{ $json.data }}",
       "hora_inicio": "{{ $json.hora_inicio }}",
       "hora_fim": "{{ $json.hora_fim }}",
       "tipo_evento": "{{ $json.tipo_evento }}",
       "num_convidados": {{ $json.num_convidados }},
       "observacoes": "{{ $json.observacoes }}"
     }
     ```

3. **IF** (Verificar se há conflitos)
   - Condition: `{{ $json.data.avisos !== undefined }}`

4. **Email** (Enviar alerta se houver conflito)
   - Para: admin@empresa.com
   - Assunto: "⚠️ Novo agendamento com conflito de horário"
   - Body:
     ```
     Cliente: {{ $json.data.agendamento.cliente_nome }}
     Data: {{ $json.data.agendamento.data_evento }}

     ATENÇÃO: {{ $json.data.avisos.mensagem }}

     Conflitos:
     {{ $json.data.avisos.conflitos_horario }}
     ```

5. **Email** (Confirmação para o cliente)
   - Para: `{{ $json.data.agendamento.cliente_email }}`
   - Assunto: "✅ Agendamento Confirmado"
   - Body:
     ```
     Olá {{ $json.data.agendamento.cliente_nome }},

     Seu agendamento foi registrado com sucesso!

     Data: {{ $json.data.agendamento.data_evento }}
     Horário: {{ $json.data.agendamento.hora_inicio }} às {{ $json.data.agendamento.hora_fim }}
     Tipo: {{ $json.data.agendamento.tipo_servico }}

     Obrigado pela preferência!
     ```

---

### Exemplo 2: Verificar Disponibilidade antes de Criar

**Cenário:** Verificar se há conflitos antes de confirmar o agendamento.

#### Nodes:

1. **Webhook** (Trigger)

2. **HTTP Request** (Verificar disponibilidade)
   - Method: POST
   - URL: `http://localhost:3001/api/agendamentos/verificar-disponibilidade`
   - Headers:
     - `X-API-Key`: `sua-api-key`
     - `Content-Type`: `application/json`
   - Body:
     ```json
     {
       "dataEvento": "{{ $json.data }}",
       "horaInicio": "{{ $json.hora_inicio }}",
       "horaFim": "{{ $json.hora_fim }}"
     }
     ```

3. **IF** (Verificar se está disponível)
   - Condition: `{{ $json.data.disponivel === true }}`

4. **Branch TRUE**: HTTP Request (Criar agendamento)
   - Criar agendamento normalmente

5. **Branch FALSE**: Email (Avisar indisponibilidade)
   - Informar que o horário não está disponível
   - Listar horários conflitantes

---

### Exemplo 3: Sincronizar com Google Calendar

**Cenário:** Criar evento no Google Calendar quando um agendamento for criado.

#### Nodes:

1. **Schedule** (Trigger - rodar a cada 5 minutos)

2. **HTTP Request** (Listar novos agendamentos)
   - Method: GET
   - URL: `http://localhost:3001/api/agendamentos?status=pendente`
   - Headers:
     - `X-API-Key`: `sua-api-key`

3. **Item Lists** (Processar cada agendamento)

4. **Google Calendar** (Criar evento)
   - Calendar: Seu calendário
   - Summary: `{{ $json.tipo_servico }} - {{ $json.cliente_nome }}`
   - Start: `{{ $json.data_evento }}T{{ $json.hora_inicio }}`
   - End: `{{ $json.data_evento }}T{{ $json.hora_fim }}`
   - Description:
     ```
     Cliente: {{ $json.cliente_nome }}
     Telefone: {{ $json.cliente_telefone }}
     Tipo: {{ $json.tipo_servico }}
     Convidados: {{ $json.num_convidados }}
     Observações: {{ $json.observacoes }}
     ```

5. **HTTP Request** (Atualizar status)
   - Method: PATCH
   - URL: `http://localhost:3001/api/agendamentos/{{ $json.id }}/status`
   - Body:
     ```json
     {
       "status": "confirmado"
     }
     ```

---

### Exemplo 4: Lembretes Automáticos por WhatsApp

**Cenário:** Enviar lembrete no WhatsApp 24h antes do evento.

#### Nodes:

1. **Schedule** (Trigger - rodar diariamente às 9h)

2. **Code** (Calcular data de amanhã)
   ```javascript
   const tomorrow = new Date();
   tomorrow.setDate(tomorrow.getDate() + 1);
   const dateStr = tomorrow.toISOString().split('T')[0];

   return [{ json: { data: dateStr } }];
   ```

3. **HTTP Request** (Buscar agendamentos de amanhã)
   - Method: GET
   - URL: `http://localhost:3001/api/agendamentos?data={{ $json.data }}&status=confirmado`
   - Headers:
     - `X-API-Key`: `sua-api-key`

4. **Item Lists** (Para cada agendamento)

5. **WhatsApp** (Enviar mensagem)
   - Para: `{{ $json.cliente_telefone }}`
   - Mensagem:
     ```
     Olá {{ $json.cliente_nome }}! 👋

     Este é um lembrete do seu evento amanhã:

     📅 Data: {{ $json.data_evento }}
     ⏰ Horário: {{ $json.hora_inicio }} às {{ $json.hora_fim }}
     🎉 Tipo: {{ $json.tipo_servico }}

     Estamos ansiosos para tornar seu evento especial!
     ```

---

### Exemplo 5: Relatório Diário de Agendamentos

**Cenário:** Enviar email diário com resumo dos agendamentos.

#### Nodes:

1. **Schedule** (Trigger - diariamente às 8h)

2. **HTTP Request** (Agendamentos de hoje)
   - Method: GET
   - URL: `http://localhost:3001/api/agendamentos?data={{ $now.format('YYYY-MM-DD') }}`

3. **Code** (Formatar relatório)
   ```javascript
   const agendamentos = $input.all();

   let html = '<h2>Agendamentos de Hoje</h2>';
   html += `<p>Total: ${agendamentos.length}</p>`;

   agendamentos.forEach((item) => {
     const a = item.json;
     html += `
       <div style="border: 1px solid #ccc; padding: 10px; margin: 10px 0;">
         <h3>${a.cliente_nome}</h3>
         <p><strong>Horário:</strong> ${a.hora_inicio} - ${a.hora_fim}</p>
         <p><strong>Tipo:</strong> ${a.tipo_servico}</p>
         <p><strong>Status:</strong> ${a.status}</p>
         <p><strong>Telefone:</strong> ${a.cliente_telefone}</p>
       </div>
     `;
   });

   return [{ json: { html } }];
   ```

4. **Email**
   - Para: equipe@empresa.com
   - Assunto: `📋 Agendamentos de Hoje - {{ $now.format('DD/MM/YYYY') }}`
   - Body HTML: `{{ $json.html }}`

---

## 🔄 Exemplo de JSON do Workflow (Exemplo 1)

Você pode importar este JSON diretamente no n8n:

```json
{
  "name": "Criar Agendamento via Webhook",
  "nodes": [
    {
      "parameters": {
        "path": "novo-agendamento",
        "responseMode": "responseNode",
        "options": {}
      },
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [250, 300]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "http://localhost:3001/api/agendamentos",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpHeaderAuth",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Content-Type",
              "value": "application/json"
            }
          ]
        },
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "cliente_nome",
              "value": "={{ $json.nome }}"
            },
            {
              "name": "cliente_telefone",
              "value": "={{ $json.telefone }}"
            },
            {
              "name": "tipo_servico",
              "value": "={{ $json.tipo_servico }}"
            },
            {
              "name": "data_evento",
              "value": "={{ $json.data }}"
            },
            {
              "name": "hora_inicio",
              "value": "={{ $json.hora_inicio }}"
            },
            {
              "name": "hora_fim",
              "value": "={{ $json.hora_fim }}"
            }
          ]
        },
        "options": {}
      },
      "name": "HTTP Request",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 3,
      "position": [450, 300],
      "credentials": {
        "httpHeaderAuth": {
          "id": "1",
          "name": "Agendamento PPC API"
        }
      }
    }
  ],
  "connections": {
    "Webhook": {
      "main": [
        [
          {
            "node": "HTTP Request",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

## 🎯 Dicas para n8n

1. **Use variáveis de ambiente** no n8n para a URL da API
2. **Configure retry** nos HTTP Requests para lidar com falhas temporárias
3. **Adicione error handling** em todos os workflows
4. **Teste com dados mockados** antes de conectar fontes reais
5. **Use o modo de execução manual** durante desenvolvimento

## 📞 Testando com Webhook

Para testar o webhook localmente com n8n:

1. Crie um workflow com Webhook node
2. Copie a URL de teste do n8n
3. Faça uma requisição POST:

```bash
curl -X POST https://seu-n8n.com/webhook-test/novo-agendamento \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Teste n8n",
    "telefone": "11999999999",
    "tipo_servico": "brinquedos",
    "data": "2025-12-01",
    "hora_inicio": "14:00",
    "hora_fim": "18:00"
  }'
```

---

**Documentação completa do n8n:** https://docs.n8n.io
