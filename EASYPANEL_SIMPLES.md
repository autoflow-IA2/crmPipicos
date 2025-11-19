# 🚀 Deploy no Easypanel - Guia Simplificado

## ⚡ Configuração Rápida (3 Passos)

### 1️⃣ Configure APENAS Environment Variables

No Easypanel, vá na aba **Environment** e adicione:

```bash
NODE_ENV=production
PORT=3001
API_KEY=tcU2bg7bIslW9KKMXGzw1kICdPRSRg-vaG8Xl2b9lfs
SUPABASE_URL=https://gjqkkiuqryhhobmcevuo.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqcWtraXVxcnloaG9ibWNldnVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NzI1NjUsImV4cCI6MjA3ODU0ODU2NX0.-sCj_ojV9nIyNhEcLOcQftA-oN4P9ybcVziA0fT_Q28
ALLOWED_ORIGINS=*
```

### 2️⃣ Configure Porta

Na aba **Networking**:
- Container Port: `80`
- Public: ✅ Ativado
- HTTPS: ✅ Ativado

### 3️⃣ Deploy

- **NÃO configure Build Arguments** (deixe vazio!)
- Clique em **Deploy** ou **Rebuild**
- Aguarde 5-10 minutos

---

## ❌ O Que NÃO Fazer

- ❌ **NÃO adicione variáveis em "Build Arguments"**
- ❌ **NÃO configure VITE_* nas Environment Variables**
- ❌ **NÃO exponha porta 3001** (só porta 80)

---

## ✅ Checklist Pré-Deploy

- [ ] Build Arguments: **VAZIO** (não adicione nada)
- [ ] Environment Variables: **6 variáveis** (NODE_ENV, PORT, API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY, ALLOWED_ORIGINS)
- [ ] Networking Port: **80**
- [ ] Branch: **main**
- [ ] Dockerfile Path: **(vazio)**

---

## 🔍 Logs Esperados

Quando o deploy funcionar, você verá:

```
Starting CRM Agendamentos Services
Starting Backend API...
✓ Backend started (PID: 123)
Starting Nginx...
✓ Nginx started (PID: 456)
Services running successfully!
```

---

## 🆘 Se Ainda Não Funcionar

### Erro: "npm run build failed"

**Solução**: Remova TODAS as variáveis de "Build Arguments"

### Erro: "502 Bad Gateway"

**Solução**: Verifique Environment Variables e aguarde 30-60s

### Erro: "Cannot find module"

**Solução**: Force rebuild sem cache

---

## 📸 Screenshot da Configuração

### Environment Variables (deve ter EXATAMENTE isso):

```
┌─────────────────────────────────────────────┐
│ Environment Variables                       │
├─────────────────────────────────────────────┤
│ NODE_ENV          = production              │
│ PORT              = 3001                    │
│ API_KEY           = tcU2bg7bIslW9KKM...     │
│ SUPABASE_URL      = https://gjqkkiuq...     │
│ SUPABASE_SERVICE_KEY = eyJhbGciOiJIUz...    │
│ ALLOWED_ORIGINS   = *                       │
└─────────────────────────────────────────────┘
```

### Build Arguments (deve estar VAZIO):

```
┌─────────────────────────────────────────────┐
│ Build Arguments                             │
├─────────────────────────────────────────────┤
│                                             │
│          (nenhuma variável)                 │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🎯 Por Que Simplificamos?

O Dockerfile agora tem as credenciais do Supabase **hardcoded** na linha 21-22:

```dockerfile
ENV VITE_SUPABASE_URL=https://gjqkkiuqryhhobmcevuo.supabase.co
ENV VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

Isso significa:
- ✅ Não precisa de Build Arguments
- ✅ Build sempre funciona
- ✅ Mais simples de configurar
- ⚠️ Credenciais públicas no código (OK para anon key, é pública mesmo)

---

## 🔐 Segurança

A `ANON_KEY` do Supabase é **pública por design**. Ela pode estar no código sem problemas.

A `SERVICE_KEY` (privada) está **apenas** nas Environment Variables, nunca no código.

---

**Última atualização**: 19/11/2025
**Versão**: 3.0 (Simplificada)
