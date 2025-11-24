# API de Disponibilidade de Inventário

## 📋 Visão Geral

Sistema completo de gerenciamento de disponibilidade de inventário que verifica automaticamente a disponibilidade de brinquedos e itens de decoração em tempo real, considerando reservas existentes.

## 🎯 Funcionalidades Implementadas

### ✅ Backend (Express + TypeScript)

1. **Serviço de Inventário** (`backend/src/services/inventario.service.ts`)
   - Verificação de disponibilidade por item
   - Verificação de múltiplos itens simultaneamente
   - Cálculo de disponibilidade por período
   - Finalização automática de eventos passados

2. **Endpoints REST**
   - `POST /api/inventario/verificar-disponibilidade` - Verifica disponibilidade de um item
   - `POST /api/inventario/verificar-multiplos` - Verifica múltiplos itens
   - `GET /api/inventario/disponibilidade-periodo` - Disponibilidade em período
   - `POST /api/inventario/finalizar-eventos-passados` - Finaliza eventos automaticamente

3. **Validação Automática**
   - Todo agendamento criado ou editado valida disponibilidade automaticamente
   - Impede overbooking de itens
   - Mensagens de erro detalhadas com itens indisponíveis

### ✅ Frontend (React + TypeScript)

1. **Serviço de Inventário** (`src/services/inventario.service.ts`)
   - Client HTTP para chamar API backend
   - Tratamento de erros
   - Tipagem completa com TypeScript

2. **Formulário de Agendamento Aprimorado**
   - Verificação em tempo real ao adicionar brinquedos
   - Feedback visual de disponibilidade
   - Alertas quando estoque está baixo
   - Bloqueio de adição se não houver disponibilidade

## 🔧 Como Funciona

### Lógica de Disponibilidade

1. **Estoque Total**: Quantidade total do item no catálogo (`brinquedos.quantidade_estoque`)

2. **Quantidade Reservada**: Soma de todas as quantidades reservadas em agendamentos ativos que se sobrepõem no mesmo período

3. **Quantidade Disponível**: `Estoque Total - Quantidade Reservada`

4. **Status que Bloqueiam Inventário**:
   - `pendente`
   - `confirmado`
   - `em_preparacao`
   - `entregue`

5. **Status que Liberam Inventário**:
   - `finalizado`
   - `cancelado`

### Sobreposição de Horários

A API verifica se dois períodos se sobrepõem usando a lógica:
```
(horaInicio1 < horaFim2) AND (horaFim1 > horaInicio2)
```

## 📚 Exemplos de Uso

### Verificar Disponibilidade de Um Item

```javascript
const response = await fetch('http://localhost:3001/api/inventario/verificar-disponibilidade', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'sua-api-key'
  },
  body: JSON.stringify({
    brinquedo_id: 'uuid-do-brinquedo',
    data_evento: '2025-12-25',
    hora_inicio: '14:00',
    hora_fim: '18:00',
    quantidade_desejada: 2
  })
});

const resultado = await response.json();
// {
//   brinquedo_id: '...',
//   nome: 'Pula-Pula Grande',
//   quantidade_total: 5,
//   quantidade_reservada: 2,
//   quantidade_disponivel: 3,
//   disponivel: true,
//   conflitos: [...]
// }
```

### Verificar Múltiplos Itens

```javascript
const response = await fetch('http://localhost:3001/api/inventario/verificar-multiplos', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'sua-api-key'
  },
  body: JSON.stringify({
    items: [
      { brinquedo_id: 'uuid-1', quantidade_desejada: 1 },
      { brinquedo_id: 'uuid-2', quantidade_desejada: 2 }
    ],
    data_evento: '2025-12-25',
    hora_inicio: '14:00',
    hora_fim: '18:00'
  })
});

const resultado = await response.json();
// {
//   todos_disponiveis: true,
//   items: [...]
// }
```

### Disponibilidade por Período

```javascript
const response = await fetch(
  'http://localhost:3001/api/inventario/disponibilidade-periodo?data_inicio=2025-12-01&data_fim=2025-12-31',
  {
    headers: { 'X-API-Key': 'sua-api-key' }
  }
);

const resultado = await response.json();
// Array com disponibilidade de cada item por dia
```

## 🚀 Como Usar

### 1. Configurar Variáveis de Ambiente

**Frontend** (`.env`):
```env
VITE_API_URL=http://localhost:3001/api
VITE_API_KEY=sua-api-key-aqui
```

**Backend** (`backend/.env`):
```env
API_KEY=sua-api-key-aqui
```

### 2. Iniciar Backend

```bash
cd backend
npm run dev
```

O servidor iniciará em `http://localhost:3001`

### 3. Usar no Frontend

```typescript
import { inventarioService } from './services';

// Verificar disponibilidade ao adicionar item
const disponibilidade = await inventarioService.verificarDisponibilidade({
  brinquedo_id: item.id,
  data_evento: '2025-12-25',
  hora_inicio: '14:00',
  hora_fim: '18:00',
  quantidade_desejada: 1
});

if (!disponibilidade.disponivel) {
  alert(`Apenas ${disponibilidade.quantidade_disponivel} disponíveis!`);
}
```

## 🔄 Devolução Automática (Auto-Finalização)

### Conceito

Não há necessidade de "subtrair" ou "somar" quantidades fisicamente no banco de dados. O sistema calcula disponibilidade dinamicamente baseado nos agendamentos ativos.

### Como Funciona

1. Quando um agendamento é criado com status `confirmado`, os itens ficam "reservados"
2. O sistema considera reservado enquanto o status for: `pendente`, `confirmado`, `em_preparacao`, `entregue`
3. Quando o status muda para `finalizado` ou `cancelado`, os itens são automaticamente liberados
4. A API `POST /api/inventario/finalizar-eventos-passados` pode ser executada para finalizar eventos que já passaram há mais de 1 dia

### Executar Manualmente

```bash
curl -X POST http://localhost:3001/api/inventario/finalizar-eventos-passados \
  -H "X-API-Key: sua-api-key"
```

### Executar Automaticamente (Cron Job)

Você pode configurar um cron job para executar diariamente:

**Linux/Mac** (`crontab -e`):
```bash
0 2 * * * curl -X POST http://localhost:3001/api/inventario/finalizar-eventos-passados -H "X-API-Key: sua-api-key"
```

**Windows** (Task Scheduler ou script PowerShell):
```powershell
# finalizar-eventos.ps1
$headers = @{ "X-API-Key" = "sua-api-key" }
Invoke-RestMethod -Uri "http://localhost:3001/api/inventario/finalizar-eventos-passados" -Method POST -Headers $headers
```

**n8n Workflow**:
Crie um workflow com Schedule Trigger (diariamente às 2h) que chama o endpoint.

## 📊 Fluxo Completo

```
1. Usuário seleciona data/hora do evento
2. Usuário tenta adicionar brinquedo
3. Frontend chama API verificarDisponibilidade
4. Backend:
   - Busca brinquedo no catálogo
   - Busca agendamentos ativos na mesma data
   - Filtra por sobreposição de horários
   - Parseia JSONB brinquedos_selecionados
   - Soma quantidades reservadas
   - Calcula disponível = total - reservado
5. Frontend mostra resultado ao usuário
6. Se disponível, permite adicionar
7. Se indisponível, bloqueia e mostra mensagem
8. Ao salvar agendamento, backend valida novamente (autoritative check)
9. Após evento passar, endpoint finalizar-eventos-passados atualiza status
10. Itens são automaticamente liberados para nova reserva
```

## 🎨 Experiência do Usuário

### Antes (Problema)

- ❌ Usuário conseguia agendar mais itens que o disponível
- ❌ Conflitos descobertos apenas na entrega
- ❌ Verificação apenas de estoque total, não reservas

### Depois (Solução)

- ✅ Verificação em tempo real ao adicionar item
- ✅ Feedback imediato: "Apenas 2 de 5 disponíveis para esta data"
- ✅ Alerta quando estoque baixo
- ✅ Bloqueio automático se indisponível
- ✅ Validação dupla (frontend + backend)
- ✅ Mensagens claras com detalhes

## 🧪 Testes

Execute o script de teste:

```bash
node test-inventario-api.js
```

Testes incluídos:
1. ✅ Health check
2. ✅ Listar brinquedos
3. ✅ Verificar disponibilidade única
4. ✅ Verificar múltiplos itens
5. ✅ Disponibilidade por período

## 📁 Arquivos Criados/Modificados

### Backend
- ✨ `backend/src/types/inventario.types.ts` - Tipos TypeScript
- ✨ `backend/src/services/inventario.service.ts` - Lógica de negócio
- ✨ `backend/src/controllers/inventario.controller.ts` - Controllers REST
- ✨ `backend/src/routes/inventario.routes.ts` - Rotas
- 🔧 `backend/src/routes/index.ts` - Registro de rotas
- 🔧 `backend/src/services/agendamentos.service.ts` - Validação adicionada
- 🔧 `backend/src/server.ts` - Documentação de endpoints

### Frontend
- ✨ `src/types/inventario.types.ts` - Tipos TypeScript
- ✨ `src/services/inventario.service.ts` - Client HTTP
- 🔧 `src/services/index.ts` - Export do serviço
- 🔧 `src/components/agendamentos/AgendamentoForm.tsx` - Verificação em tempo real
- 🔧 `.env` - Variáveis de ambiente

### Testes
- ✨ `test-inventario-api.js` - Script de teste

## 🎯 Próximos Passos Sugeridos

1. **Dashboard de Disponibilidade**
   - Calendário visual mostrando disponibilidade
   - Cores: verde (alta), amarelo (baixa), vermelho (indisponível)

2. **Alertas Proativos**
   - Email quando item ficar com estoque baixo
   - Notificação quando conflito for resolvido

3. **Relatórios**
   - Itens mais reservados
   - Períodos de alta demanda
   - Taxa de utilização do inventário

4. **Otimizações**
   - Cache de consultas frequentes
   - Materialized view para cálculos pesados
   - WebSocket para updates em tempo real

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique logs do backend
2. Teste endpoints com `test-inventario-api.js`
3. Confirme variáveis de ambiente
4. Verifique se backend está rodando na porta 3001

---

**Desenvolvido com ❤️ para PPC Agendamentos**
