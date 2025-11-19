# 🔧 Easypanel Buildpack vs Dockerfile

## 🚨 Problema Identificado

O Easypanel está usando **Heroku Buildpacks** em vez de **Dockerfile**!

Isso acontece porque o Easypanel detectou `package.json` na raiz e assumiu que é um app Node.js simples.

## ✅ Soluções (em ordem de preferência)

### Solução 1: Forçar Uso do Dockerfile (RECOMENDADO)

No Easypanel, procure pela configuração:

1. **Vá nas configurações do serviço**
2. Procure por:
   - **"Build Method"** ou
   - **"Builder Type"** ou
   - **"Build Strategy"**

3. **Mude de**:
   - ❌ "Buildpack" / "Heroku" / "Auto"

4. **Para**:
   - ✅ "Dockerfile" / "Docker"

5. **Salve e Rebuild**

---

### Solução 2: Desativar Buildpack Detection

Se a Solução 1 não existir, tente:

1. Criar arquivo `.easypanel.yml` (já criado)
2. Fazer commit e push
3. Rebuild no Easypanel

Arquivo criado:
```yaml
build:
  type: dockerfile
  dockerfile: Dockerfile
  context: .
```

---

### Solução 3: Deploy Apenas Backend (Se Buildpack for Obrigatório)

Se o Easypanel **realmente** só aceita buildpacks, você precisa separar frontend e backend:

#### A. Deploy Backend no Easypanel (com buildpack)

1. **Criar novo serviço** apontando para `/backend`
2. **Root Directory**: `backend`
3. **Environment Variables**:
   ```
   NODE_ENV=production
   PORT=8080
   API_KEY=tcU2bg7bIslW9KKMXGzw1kICdPRSRg-vaG8Xl2b9lfs
   SUPABASE_URL=https://gjqkkiuqryhhobmcevuo.supabase.co
   SUPABASE_SERVICE_KEY=eyJhbGci...
   ALLOWED_ORIGINS=*
   ```
4. **Deploy**

#### B. Deploy Frontend em Serviço Separado

**Opção B1**: Vercel (grátis)
1. Conectar repositório no Vercel
2. Build Command: `npm run build:frontend`
3. Output Directory: `dist`
4. Environment Variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

**Opção B2**: Netlify (grátis)
1. Conectar repositório no Netlify
2. Build Command: `npm run build:frontend`
3. Publish Directory: `dist`
4. Environment Variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

**Opção B3**: Cloudflare Pages (grátis)
- Similar ao Vercel/Netlify

---

### Solução 4: Usar Outro Serviço (MAIS FÁCIL)

Honestamente, se o Easypanel não permite escolher Dockerfile, sugiro mudar para:

#### **Render.com** (5 minutos, grátis)

1. Acesse https://render.com
2. New → Web Service
3. Connect GitHub repo
4. Render **detecta Dockerfile automaticamente** ✅
5. Configure Environment Variables
6. Deploy!

**Pronto em 5 minutos, sem problemas.**

---

## 🔍 Como Saber Qual Método o Easypanel Está Usando?

Olhe os logs de build:

### Se estiver usando Buildpacks:
```
===> DETECTING
[detector] heroku/nodejs 5.2.8
===> BUILDING
[builder] ## Heroku Node.js
```

### Se estiver usando Dockerfile:
```
#1 [internal] load build definition from Dockerfile
#2 [internal] load metadata for docker.io/library/node
#3 [frontend-builder 1/6] FROM node:20-alpine
```

---

## 📋 Status Atual

Após o último commit, o projeto tem:

✅ **Dockerfile** completo e funcional
✅ **`.easypanel.yml`** para forçar uso do Dockerfile
✅ **`Procfile`** (fallback para buildpack)
✅ **`package.json`** com script de build que não quebra

---

## 🎯 Recomendação Final

### Se conseguir configurar Dockerfile no Easypanel:
- ✅ Continue com Easypanel
- ✅ Use Dockerfile
- ✅ Tudo funcionará

### Se NÃO conseguir:
- 🚀 **Mude para Render.com** (5 minutos, zero configuração)
- Ou separe frontend (Vercel) + backend (Easypanel)

---

## 💬 Me Diga

Você consegue ver uma opção no Easypanel para mudar de Buildpack para Dockerfile?

Se não:
1. Podemos tentar a Solução 3 (separar serviços)
2. Ou eu crio um guia completo para Render.com (MUITO mais simples)

O que prefere?
