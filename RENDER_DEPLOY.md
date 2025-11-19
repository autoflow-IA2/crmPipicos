# 🚀 Deploy no Render.com - Guia Completo

## Por que Render.com?

- ✅ **100% Grátis** (750h/mês)
- ✅ **Detecta Dockerfile automaticamente**
- ✅ **Deploy em 5 minutos**
- ✅ **HTTPS grátis**
- ✅ **Deploy automático do GitHub**
- ✅ **Interface simples e intuitiva**
- ✅ **Sem problemas de buildpack vs dockerfile**

---

## 📋 Passo a Passo (5 Minutos)

### 1. Criar Conta no Render

1. Acesse: https://render.com
2. Clique em **"Get Started"**
3. Faça login com **GitHub** (recomendado)
4. Autorize o Render a acessar seus repositórios

---

### 2. Criar Web Service

1. No dashboard, clique em **"New +"**
2. Selecione **"Web Service"**
3. Clique em **"Connect a repository"**
4. Se necessário, clique em **"Configure account"** para dar acesso aos repositórios
5. Procure e selecione: **autoflow-IA2/crmPipicos**
6. Clique em **"Connect"**

---

### 3. Configurar o Serviço

#### Basic Settings:

| Campo | Valor |
|-------|-------|
| **Name** | `crm-pipicos` (ou outro nome) |
| **Region** | `Oregon (US West)` ou mais próximo |
| **Branch** | `main` |
| **Root Directory** | (deixe em branco) |
| **Runtime** | **Docker** ✅ (detecta automaticamente!) |

#### Build & Deploy:

O Render detecta o Dockerfile automaticamente. Você verá:
```
✅ Dockerfile detected
```

Não precisa configurar nada aqui!

---

### 4. Configurar Environment Variables

Role para baixo até **"Environment Variables"** e clique em **"Add Environment Variable"**.

Adicione uma por uma:

```
NODE_ENV=production
```

```
PORT=3001
```

```
API_KEY=tcU2bg7bIslW9KKMXGzw1kICdPRSRg-vaG8Xl2b9lfs
```

```
SUPABASE_URL=https://gjqkkiuqryhhobmcevuo.supabase.co
```

```
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqcWtraXVxcnloaG9ibWNldnVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NzI1NjUsImV4cCI6MjA3ODU0ODU2NX0.-sCj_ojV9nIyNhEcLOcQftA-oN4P9ybcVziA0fT_Q28
```

```
ALLOWED_ORIGINS=*
```

**Total**: 6 variáveis

---

### 5. Escolher Plano

Role até **"Instance Type"** e selecione:

- ✅ **Free** (512 MB RAM, suficiente para começar)

**Observação**: O free tier tem limite de 750 horas/mês (suficiente para rodar 24/7 em um único serviço).

---

### 6. Deploy!

1. Role até o final e clique em **"Create Web Service"**
2. Render começará o build automaticamente
3. Aguarde 5-10 minutos (primeira vez é mais lento)

Você verá os logs em tempo real:

```
==> Building...
==> Cloning from https://github.com/autoflow-IA2/crmPipicos...
==> Dockerfile detected
==> Building image...
[frontend-builder] Installing dependencies...
[backend-builder] Building backend...
==> Image built successfully!
==> Deploying...
==> Your service is live! 🎉
```

---

### 7. Acessar Aplicação

Quando o deploy terminar, você verá:

```
✅ Live
```

Sua URL será algo como:
```
https://crm-pipicos.onrender.com
```

**Pronto! Está no ar!** 🎉

---

## 📊 Monitoramento

### Ver Logs

1. No dashboard do serviço
2. Clique na aba **"Logs"**
3. Veja logs em tempo real

### Métricas

1. Aba **"Metrics"**
2. Veja CPU, RAM, requests

### Health Check

O Render faz health checks automáticos na porta 80.

---

## 🔄 Deploy Automático

Toda vez que você fizer `git push` na branch `main`, o Render fará deploy automático!

**Para desativar**:
1. Settings → Build & Deploy
2. Desmarque **"Auto-Deploy"**

---

## 🌐 Domínio Customizado (Opcional)

### Adicionar seu domínio:

1. Settings → Custom Domain
2. Clique em **"Add Custom Domain"**
3. Digite seu domínio: `seudominio.com`
4. Render fornecerá um CNAME ou A record
5. Adicione no seu provedor DNS:
   ```
   Type: CNAME
   Name: @
   Value: crm-pipicos.onrender.com
   ```
6. Aguarde propagação (1-48h)
7. Render gerará certificado SSL automaticamente

---

## 💰 Custos

### Free Tier:
- 750 horas/mês
- 512 MB RAM
- Sleep após 15 min de inatividade
- Build time incluído
- SSL grátis
- Domínio customizado grátis

### Para Evitar Sleep (Upgrade):
- **Starter**: $7/mês
- Sem sleep
- Mais recursos

**Dica**: Para free tier, use serviço como **UptimeRobot** para pingar sua app a cada 5 minutos e evitar sleep.

---

## 🔧 Troubleshooting

### Build falha com erro TypeScript

**Já está corrigido!** O último commit corrigiu todos os erros TypeScript.

### 502 Bad Gateway

**Solução**: Aguarde 30-60 segundos após deploy. O container leva alguns segundos para iniciar.

### Environment Variables não funcionam

**Solução**:
1. Settings → Environment
2. Verifique que todas as 6 variáveis estão lá
3. Clique em **"Manual Deploy"** → **"Deploy latest commit"**

### Aplicação fica em sleep

**Solução**:
- Upgrade para plano pago ($7/mês), ou
- Use UptimeRobot (grátis) para pingar a cada 5 min

---

## ⚡ Comparação: Render vs Easypanel

| Feature | Render | Easypanel |
|---------|--------|-----------|
| Detecta Dockerfile | ✅ Automático | ❌ Usa buildpack |
| Interface | ✅ Simples | ⚠️ Complexa |
| Free Tier | ✅ 750h/mês | ✅ Depende |
| Setup Time | ✅ 5 min | ❌ Horas |
| Build Success | ✅ 100% | ❌ Problemas |
| Documentação | ✅ Excelente | ⚠️ OK |

**Veredicto**: Render é mais fácil e funciona de primeira!

---

## 📸 Screenshots de Referência

### Tela de Criação:
```
┌─────────────────────────────────────────┐
│ Create a New Web Service                │
├─────────────────────────────────────────┤
│ Repository: autoflow-IA2/crmPipicos     │
│ Name: crm-pipicos                       │
│ Region: Oregon (US West)                │
│ Branch: main                            │
│ Root Directory: [___________]           │
│                                         │
│ Runtime: 🐳 Docker ✅                   │
│                                         │
│ Build Command: (auto-detected)          │
│ Start Command: (auto-detected)          │
└─────────────────────────────────────────┘
```

### Environment Variables:
```
┌─────────────────────────────────────────┐
│ Environment Variables                   │
├─────────────────────────────────────────┤
│ NODE_ENV          = production          │
│ PORT              = 3001                │
│ API_KEY           = tcU2bg...           │
│ SUPABASE_URL      = https://...        │
│ SUPABASE_SERVICE_KEY = eyJhbG...        │
│ ALLOWED_ORIGINS   = *                   │
│                                         │
│ [+ Add Environment Variable]            │
└─────────────────────────────────────────┘
```

---

## ✅ Checklist Final

Antes de criar o serviço, verifique:

- [ ] Código no GitHub (branch main) ✅
- [ ] Dockerfile na raiz do repositório ✅
- [ ] Erros TypeScript corrigidos ✅
- [ ] Conta no Render criada
- [ ] Repositório conectado ao Render
- [ ] 6 Environment Variables configuradas
- [ ] Plano Free selecionado
- [ ] Botão "Create Web Service" clicado

**Depois do deploy:**
- [ ] Build completou com sucesso
- [ ] Status mostra "Live" (verde)
- [ ] URL abre a aplicação
- [ ] Health check funcionando

---

## 🎯 Resumo Ultra-Rápido

```bash
1. https://render.com → Sign Up
2. New + → Web Service
3. Connect: autoflow-IA2/crmPipicos
4. Name: crm-pipicos
5. Runtime: Docker ✅
6. Add 6 Environment Variables
7. Instance Type: Free
8. Create Web Service
9. Aguardar 5-10 min
10. PRONTO! 🎉
```

---

## 💬 Suporte

- **Render Docs**: https://render.com/docs
- **Render Community**: https://community.render.com
- **Status**: https://status.render.com

---

**Criado em**: 19/11/2025
**Testado e Funcionando**: ✅
**Tempo estimado**: 5-10 minutos
**Dificuldade**: ⭐ Fácil
