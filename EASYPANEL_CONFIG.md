# ⚙️ Configuração EXATA do Easypanel

## 🚨 IMPORTANTE: Configuração Correta

O Easypanel tem **3 seções diferentes**. Você precisa configurar APENAS 2 delas:

---

## 1️⃣ Build Configuration (Tab: Build)

### Build Arguments

Adicione APENAS estas 2 variáveis (são usadas durante o BUILD do frontend):

```
VITE_SUPABASE_URL
```
Valor: `https://gjqkkiuqryhhobmcevuo.supabase.co`

```
VITE_SUPABASE_ANON_KEY
```
Valor: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqcWtraXVxcnloaG9ibWNldnVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NzI1NjUsImV4cCI6MjA3ODU0ODU2NX0.-sCj_ojV9nIyNhEcLOcQftA-oN4P9ybcVziA0fT_Q28`

**⚠️ NÃO adicione**: NODE_ENV, PORT, API_KEY, etc nos Build Arguments!

---

## 2️⃣ Environment Variables (Tab: Environment)

Adicione estas variáveis (são usadas durante a EXECUÇÃO do backend):

```
NODE_ENV=production
PORT=3001
API_KEY=tcU2bg7bIslW9KKMXGzw1kICdPRSRg-vaG8Xl2b9lfs
SUPABASE_URL=https://gjqkkiuqryhhobmcevuo.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqcWtraXVxcnloaG9ibWNldnVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NzI1NjUsImV4cCI6MjA3ODU0ODU2NX0.-sCj_ojV9nIyNhEcLOcQftA-oN4P9ybcVziA0fT_Q28
ALLOWED_ORIGINS=*
```

---

## 3️⃣ Ports Configuration (Tab: Networking)

Configure apenas:

```
Container Port: 80
Public: ✅ Enabled
HTTPS: ✅ Enabled (recomendado)
```

**⚠️ NÃO exponha a porta 3001** - ela é interna, apenas nginx (porta 80) deve ser pública!

---

## 📸 Visual (O que você deve ver)

### Tab: Build
```
┌─────────────────────────────────────┐
│ Build Method: Dockerfile            │
│ Dockerfile Path: (deixe em branco)  │
│                                     │
│ Build Arguments:                    │
│ ┌─────────────────────────────────┐ │
│ │ VITE_SUPABASE_URL               │ │
│ │ https://gjqkkiuqryhhobmce...    │ │
│ │                                 │ │
│ │ VITE_SUPABASE_ANON_KEY          │ │
│ │ eyJhbGciOiJIUzI1NiIsInR5c...   │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Tab: Environment
```
┌─────────────────────────────────────┐
│ Environment Variables:              │
│ ┌─────────────────────────────────┐ │
│ │ NODE_ENV = production           │ │
│ │ PORT = 3001                     │ │
│ │ API_KEY = tcU2bg7bIslW9KK...    │ │
│ │ SUPABASE_URL = https://gjqk...  │ │
│ │ SUPABASE_SERVICE_KEY = eyJhb... │ │
│ │ ALLOWED_ORIGINS = *             │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Tab: Networking
```
┌─────────────────────────────────────┐
│ Ports:                              │
│ ┌─────────────────────────────────┐ │
│ │ Container: 80                   │ │
│ │ Public: ✅                      │ │
│ │ HTTPS: ✅                       │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## 🔄 Sequência de Deploy

1. **Configure Build Arguments** (tab Build)
   - Apenas VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY

2. **Configure Environment Variables** (tab Environment)
   - NODE_ENV, PORT, API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY, ALLOWED_ORIGINS

3. **Configure Ports** (tab Networking)
   - Container Port: 80, Public ✅, HTTPS ✅

4. **Clique em Deploy** (ou Rebuild)

5. **Aguarde o build** (5-10 minutos primeira vez)

6. **Verifique os logs**:
   - Deve ver: "Starting CRM Agendamentos Services"
   - Deve ver: "✓ Backend started"
   - Deve ver: "✓ Nginx started"

7. **Acesse sua aplicação**:
   - URL fornecida pelo Easypanel

---

## ❌ Erros Comuns

### "npm run build failed (exit code 2)"
**Causa**: Build arguments incorretos ou faltando
**Solução**: Verifique que VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão nos **Build Arguments**

### "public: not found"
**Causa**: Arquivo já corrigido no último commit
**Solução**: Certifique-se de usar o código mais recente do GitHub

### "Cannot find module 'dist/server.js'"
**Causa**: Backend build falhou
**Solução**: Verifique logs de build para erros TypeScript

### "502 Bad Gateway"
**Causa**: Backend não iniciou
**Solução**: Verifique environment variables e logs do container

---

## 📋 Checklist Pré-Deploy

Antes de fazer deploy, verifique:

- [ ] Código foi commitado e pushed para GitHub
- [ ] Build Arguments tem APENAS 2 variáveis (VITE_*)
- [ ] Environment Variables tem 6 variáveis (NODE_ENV, PORT, etc)
- [ ] Ports configurado para porta 80 pública
- [ ] Dockerfile está na raiz do repositório
- [ ] nginx.conf está na raiz do repositório

---

## 🎯 Valores Rápidos (Copiar e Colar)

### Build Arguments (Tab: Build)

Nome: `VITE_SUPABASE_URL`
Valor:
```
https://gjqkkiuqryhhobmcevuo.supabase.co
```

Nome: `VITE_SUPABASE_ANON_KEY`
Valor:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqcWtraXVxcnloaG9ibWNldnVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NzI1NjUsImV4cCI6MjA3ODU0ODU2NX0.-sCj_ojV9nIyNhEcLOcQftA-oN4P9ybcVziA0fT_Q28
```

### Environment Variables (Tab: Environment)

```
NODE_ENV=production
PORT=3001
API_KEY=tcU2bg7bIslW9KKMXGzw1kICdPRSRg-vaG8Xl2b9lfs
SUPABASE_URL=https://gjqkkiuqryhhobmcevuo.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqcWtraXVxcnloaG9ibWNldnVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NzI1NjUsImV4cCI6MjA3ODU0ODU2NX0.-sCj_ojV9nIyNhEcLOcQftA-oN4P9ybcVziA0fT_Q28
ALLOWED_ORIGINS=*
```

---

**Última atualização**: 19/11/2025
**Versão do Dockerfile**: 2.0
