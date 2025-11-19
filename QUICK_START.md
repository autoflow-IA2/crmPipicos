# ⚡ Quick Start - Deploy no Easypanel

## 🎯 TL;DR

1. **Push o código** para o Git
2. **Crie um app** no Easypanel conectando ao repo
3. **Configure 6 variáveis** de ambiente
4. **Defina porta 80** no networking
5. **Faça deploy**

---

## 📝 Variáveis de Ambiente (copie e cole)

```bash
NODE_ENV=production
PORT=3001
API_KEY=tcU2bg7bIslW9KKMXGzw1kICdPRSRg-vaG8Xl2b9lfs
SUPABASE_URL=https://gjqkkiuqryhhobmcevuo.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqcWtraXVxcnloaG9ibWNldnVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NzI1NjUsImV4cCI6MjA3ODU0ODU2NX0.-sCj_ojV9nIyNhEcLOcQftA-oN4P9ybcVziA0fT_Q28
ALLOWED_ORIGINS=*
```

---

## 🔧 Configuração Easypanel

### Environment Variables
Cole as 6 variáveis acima

### Networking
```
Port: 80
Public: ✅
HTTPS: ✅
```

### Build
```
Dockerfile: (vazio - usa raiz)
Build Args: (vazio - usa defaults)
```

---

## ✅ Verificar Deploy

Após o deploy, teste:

```bash
# Health check
https://seu-app.easypanel.host/health

# Backend API
https://seu-app.easypanel.host/api/health

# Frontend
https://seu-app.easypanel.host/
```

---

## 🚨 Erros Comuns

### Build falha
- ✅ Certifique-se que `Dockerfile` está na raiz
- ✅ Certifique-se que `nginx-easypanel.conf` existe
- ✅ Não adicione Build Arguments

### 502 Bad Gateway
- ✅ Aguarde 30-60s após deploy
- ✅ Verifique Environment Variables
- ✅ Force rebuild

### Frontend carrega mas API não funciona
- ✅ Verifique se PORT=3001 nas Environment Variables
- ✅ Verifique logs do container

---

## 📚 Documentação Completa

- **Deploy detalhado**: `EASYPANEL_DEPLOY.md`
- **Dockerfile técnico**: `DOCKERFILE_README.md`
- **Docker Compose**: `EASYPANEL_SIMPLES.md`

---

## 🆘 Suporte

Problemas? Leia `EASYPANEL_DEPLOY.md` seção "Troubleshooting"
