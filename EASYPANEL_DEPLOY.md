# 🚀 Deploy no Easypanel - CRM Agendamentos

Guia completo para fazer deploy do CRM no Easypanel.

---

## 📋 Pré-requisitos

1. Conta no [Easypanel](https://easypanel.io)
2. Servidor configurado no Easypanel
3. Repositório Git (GitHub, GitLab, etc.)
4. Credenciais do Supabase

---

## 🔧 Configuração no Easypanel

### 1. Criar Novo Projeto

1. Acesse seu dashboard Easypanel
2. Clique em **"Create Project"**
3. Nome do projeto: `crm-agendamentos` (ou outro de sua escolha)

### 2. Adicionar Serviço

1. Dentro do projeto, clique em **"Add Service"**
2. Selecione **"App"**
3. Escolha **"From Source (GitHub/GitLab)"**

### 3. Configurar Source

- **Repository**: Selecione seu repositório
- **Branch**: `main` (ou sua branch principal)
- **Build Method**: `Dockerfile`
- **Dockerfile Path**: deixe em branco (usará o `Dockerfile` na raiz)

### 4. Configurar Build Arguments

Na seção **Build Arguments**, adicione:

```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

**IMPORTANTE**: Substitua pelos valores reais do seu Supabase!

### 5. Configurar Environment Variables

Na seção **Environment Variables**, adicione:

| Nome | Valor |
|------|-------|
| `NODE_ENV` | `production` |
| `PORT` | `3001` |
| `API_KEY` | Gere uma chave segura (veja abaixo) |
| `SUPABASE_URL` | `https://seu-projeto.supabase.co` |
| `SUPABASE_SERVICE_KEY` | Sua service key do Supabase |
| `ALLOWED_ORIGINS` | `*` (ou seu domínio específico) |

#### Como gerar API_KEY segura:

**Windows PowerShell:**
```powershell
$bytes = New-Object byte[] 32
[Security.Cryptography.RNGCryptoServiceProvider]::Create().GetBytes($bytes)
[Convert]::ToBase64String($bytes)
```

**Linux/Mac:**
```bash
openssl rand -base64 32
```

**Online (Node.js):**
```javascript
require('crypto').randomBytes(32).toString('base64')
```

### 6. Configurar Portas

Na seção **Ports**:

- **Container Port**: `80`
- **Public**: ✅ Ativado
- **HTTPS**: ✅ Ativado (recomendado)

### 7. Configurar Domínio (Opcional)

1. Na aba **Domains**, adicione seu domínio customizado
2. Configure o DNS conforme instruções do Easypanel
3. Easypanel gerará certificado SSL automaticamente

### 8. Deploy

1. Clique em **"Deploy"**
2. Aguarde o build (pode levar 5-10 minutos na primeira vez)
3. Acompanhe os logs em tempo real

---

## 📂 Estrutura do Dockerfile

O `Dockerfile` na raiz builda e executa ambos os serviços:

```
Frontend (React + Vite) → Build → Nginx (porta 80)
Backend (Node.js + Express) → Build → Node (porta 3001)
```

Ambos rodam no mesmo container:
- **Frontend**: http://seu-app.easypanel.host
- **API**: http://seu-app.easypanel.host/api

---

## ✅ Verificação Pós-Deploy

### 1. Verificar Logs

No Easypanel, vá em **Logs** e verifique:

```
Starting backend...
Backend started with PID XXX
Starting nginx...
Nginx started with PID XXX
```

### 2. Testar Aplicação

- **Frontend**: Acesse a URL fornecida pelo Easypanel
- **API Health**: `https://seu-app.easypanel.host/api/health`

### 3. Testar API

Usando curl ou Postman:

```bash
curl -X GET https://seu-app.easypanel.host/api/health
# Deve retornar: {"status":"ok","message":"API CRM Agendamentos está rodando"}
```

---

## 🔄 Atualizações e Redeploy

### Deploy Automático (CI/CD)

Configure webhook no GitHub:

1. No Easypanel, vá em **Settings** do serviço
2. Copie o **Webhook URL**
3. No GitHub: Settings → Webhooks → Add webhook
4. Cole a URL e salve

Agora, cada push na branch `main` fará deploy automático!

### Deploy Manual

1. No Easypanel, clique em **"Rebuild"**
2. Ou faça push no repositório (se webhook configurado)

---

## 🐛 Troubleshooting

### Build falha com "npm ci failed"

**Problema**: Dependências não instaladas corretamente

**Solução**:
1. Verifique se `package-lock.json` existe no repositório
2. Se não, gere localmente: `npm install` e faça commit

### Erro "ECONNREFUSED" ao acessar Supabase

**Problema**: Credenciais inválidas ou firewall

**Solução**:
1. Verifique as variáveis de ambiente
2. Teste conexão manualmente:
   ```bash
   curl https://seu-projeto.supabase.co
   ```
3. Verifique se IP do servidor Easypanel não está bloqueado no Supabase

### Frontend carrega mas API não responde

**Problema**: Nginx não está fazendo proxy corretamente

**Solução**:
1. Verifique logs do container
2. Teste diretamente a porta 3001:
   ```bash
   curl http://seu-app.easypanel.host:3001/api/health
   ```
3. Verifique se `nginx.conf` está correto

### Erro "502 Bad Gateway"

**Problema**: Backend não iniciou ou crashou

**Solução**:
1. Verifique logs do container
2. Procure por erros de sintaxe TypeScript
3. Verifique variáveis de ambiente obrigatórias

### Build muito lento

**Problema**: Cache do Docker não otimizado

**Solução**:
1. Garanta que `.dockerignore` está no repositório
2. Faça rebuild sem cache: **Settings** → **Clear Build Cache**

---

## 🔐 Segurança em Produção

### Checklist

- [ ] `API_KEY` gerada com 32+ bytes (não usar a do exemplo)
- [ ] `SUPABASE_SERVICE_KEY` mantida em segredo (não commitar)
- [ ] HTTPS habilitado no Easypanel
- [ ] `ALLOWED_ORIGINS` configurado com domínio específico (não usar `*`)
- [ ] Row Level Security (RLS) habilitado no Supabase
- [ ] Backup automático configurado no Supabase

### Atualizar ALLOWED_ORIGINS

Depois de configurar domínio customizado:

```
ALLOWED_ORIGINS=https://seudominio.com,https://www.seudominio.com
```

---

## 📊 Monitoramento

### Logs em Tempo Real

No Easypanel:
1. Clique em **Logs**
2. Selecione **Real-time**

### Métricas

No Easypanel, vá em **Metrics** para ver:
- Uso de CPU
- Uso de RAM
- Tráfego de rede
- Uptime

### Alertas

Configure notificações:
1. **Settings** → **Notifications**
2. Adicione email ou webhook
3. Configure alertas de downtime

---

## 💰 Recursos e Limites

### Requisitos Mínimos

- **CPU**: 0.5 vCPU
- **RAM**: 512 MB
- **Disco**: 2 GB

### Requisitos Recomendados

- **CPU**: 1 vCPU
- **RAM**: 1 GB
- **Disco**: 5 GB

### Ajustar Recursos

No Easypanel:
1. **Settings** → **Resources**
2. Ajuste CPU e RAM conforme necessário
3. Clique em **Update**

---

## 🌐 Configurar Domínio Customizado

### 1. No Easypanel

1. Vá em **Domains**
2. Clique em **Add Domain**
3. Digite: `seudominio.com`
4. Anote os registros DNS fornecidos

### 2. No seu Provedor de DNS

Adicione os registros:

```
Type: A
Name: @
Value: [IP fornecido pelo Easypanel]

Type: A
Name: www
Value: [IP fornecido pelo Easypanel]
```

### 3. Aguardar Propagação

- DNS pode levar até 48h (geralmente 1-2h)
- Teste com: `nslookup seudominio.com`

### 4. Ativar SSL

No Easypanel, em **Domains**:
1. Clique em **Enable SSL**
2. Aguarde certificado ser gerado (Let's Encrypt)
3. ✅ Pronto! HTTPS configurado

---

## 🔄 Backup e Restore

### Backup Automático (Supabase)

Supabase faz backup automático:
- Plano Free: 7 dias de retenção
- Plano Pro: 30 dias de retenção

### Backup Manual

```bash
# Via Supabase Dashboard
1. Project Settings → Database → Backups
2. Click "Download Backup"
```

### Restore

```bash
# Via Supabase Dashboard
1. Project Settings → Database → Backups
2. Select backup
3. Click "Restore"
```

---

## 📞 Suporte

### Documentação

- **Easypanel**: https://easypanel.io/docs
- **Supabase**: https://supabase.com/docs
- **Docker**: https://docs.docker.com

### Logs Úteis para Reportar Problemas

```bash
# No Easypanel, exportar logs:
1. Logs → Download Logs
2. Incluir últimas 500 linhas
```

---

## 🎯 Quick Reference

### URLs Importantes

```
Frontend: https://seu-app.easypanel.host
Backend API: https://seu-app.easypanel.host/api
Health Check: https://seu-app.easypanel.host/api/health
API Docs: https://seu-app.easypanel.host/api-docs
```

### Variáveis de Ambiente Obrigatórias

```env
NODE_ENV=production
PORT=3001
API_KEY=sua-chave-segura-aqui
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=sua-service-key
ALLOWED_ORIGINS=*
```

### Build Arguments Obrigatórios

```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key
```

---

## ✅ Checklist Final

Antes de marcar como concluído:

- [ ] Dockerfile na raiz do repositório
- [ ] nginx.conf na raiz do repositório
- [ ] .dockerignore configurado
- [ ] Build arguments configurados no Easypanel
- [ ] Environment variables configuradas no Easypanel
- [ ] Porta 80 exposta e pública
- [ ] Deploy executado com sucesso
- [ ] Frontend acessível
- [ ] API respondendo em /api/health
- [ ] HTTPS configurado (se usando domínio customizado)
- [ ] ALLOWED_ORIGINS atualizado para domínio real

---

**Pronto! Seu CRM está no ar! 🎉**

Em caso de dúvidas, consulte os logs do Easypanel ou a documentação oficial.

---

**Versão**: 1.0.0
**Última atualização**: Novembro 2025
**Compatível com**: Easypanel 1.x+
