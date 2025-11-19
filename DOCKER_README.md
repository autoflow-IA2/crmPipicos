# 🐳 Guia de Deploy Docker - CRM Agendamentos

Sistema de gerenciamento de agendamentos para brinquedos, recreação e decoração.

---

## 📋 Índice

1. [Requisitos](#requisitos)
2. [Quick Start](#quick-start)
3. [Configuração de Ambiente](#configuração-de-ambiente)
4. [Comandos Docker](#comandos-docker)
5. [Deploy em Produção](#deploy-em-produção)
6. [Configuração SSL/HTTPS](#configuração-sslhttps)
7. [Monitoramento e Logs](#monitoramento-e-logs)
8. [Troubleshooting](#troubleshooting)
9. [Arquitetura](#arquitetura)

---

## 🔧 Requisitos

- **Docker**: versão 20.10 ou superior
- **Docker Compose**: versão 2.0 ou superior
- **Conta Supabase**: com projeto criado
- **Portas livres**: 80 (frontend) e 3001 (backend)

### Verificar instalação:

```bash
docker --version
docker-compose --version
```

---

## 🚀 Quick Start

### 1. Configurar variáveis de ambiente

```bash
# Copiar template
copy .env.docker .env

# Editar .env com suas credenciais do Supabase
notepad .env
```

**IMPORTANTE**: Altere os seguintes valores no arquivo `.env`:

- `VITE_SUPABASE_URL` - URL do seu projeto Supabase
- `VITE_SUPABASE_ANON_KEY` - Chave anônima do Supabase
- `SUPABASE_SERVICE_KEY` - Chave de serviço do Supabase
- `API_KEY` - Gere uma nova chave segura (veja abaixo)

### 2. Gerar API Key segura (opcional mas recomendado)

```bash
# Windows PowerShell
$bytes = New-Object byte[] 32
[Security.Cryptography.RNGCryptoServiceProvider]::Create().GetBytes($bytes)
[Convert]::ToBase64String($bytes)

# Linux/Mac
openssl rand -base64 32
```

### 3. Build e iniciar containers

```bash
# Build das imagens
docker-compose build

# Iniciar serviços
docker-compose up -d

# Verificar status
docker-compose ps
```

### 4. Acessar aplicação

- **Frontend**: http://localhost
- **Backend API**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/api/health

---

## ⚙️ Configuração de Ambiente

### Variáveis Obrigatórias

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `VITE_SUPABASE_URL` | URL do projeto Supabase | `https://xxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Chave anônima pública | `eyJhbGci...` |
| `SUPABASE_SERVICE_KEY` | Chave de serviço (privada) | `eyJhbGci...` |
| `API_KEY` | Chave de autenticação da API | Gerar com comando acima |

### Variáveis Opcionais

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `FRONTEND_PORT` | `80` | Porta do frontend |
| `BACKEND_PORT` | `3001` | Porta do backend |
| `NODE_ENV` | `production` | Ambiente Node.js |
| `ALLOWED_ORIGINS` | `*` | CORS origins permitidas |

### Ambiente de Produção

Para produção, **sempre** configure:

```env
NODE_ENV=production
ALLOWED_ORIGINS=https://seudominio.com,https://www.seudominio.com
API_KEY=<sua-chave-super-segura>
```

---

## 🐋 Comandos Docker

### Build e Deploy

```bash
# Build das imagens
docker-compose build

# Build sem cache (força rebuild completo)
docker-compose build --no-cache

# Iniciar em background
docker-compose up -d

# Iniciar com logs visíveis
docker-compose up

# Parar serviços
docker-compose down

# Parar e remover volumes (CUIDADO: perde dados)
docker-compose down -v
```

### Gerenciamento de Containers

```bash
# Listar containers
docker-compose ps

# Ver logs de todos os serviços
docker-compose logs

# Ver logs de um serviço específico
docker-compose logs frontend
docker-compose logs backend

# Seguir logs em tempo real
docker-compose logs -f

# Reiniciar serviço específico
docker-compose restart backend
docker-compose restart frontend

# Reconstruir e reiniciar serviço
docker-compose up -d --build backend
```

### Debug e Inspeção

```bash
# Acessar shell do container
docker-compose exec backend sh
docker-compose exec frontend sh

# Ver recursos utilizados
docker stats

# Inspecionar container
docker inspect agendamento-backend
docker inspect agendamento-frontend

# Ver networks
docker network ls
docker network inspect agendamento_app-network
```

### Limpeza

```bash
# Remover containers parados
docker container prune

# Remover imagens não utilizadas
docker image prune

# Limpeza completa (CUIDADO!)
docker system prune -a
```

---

## 🌐 Deploy em Produção

### 1. Preparar servidor

```bash
# Instalar Docker (Ubuntu/Debian)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Configurar firewall

```bash
# Ubuntu/Debian
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3001/tcp  # Se necessário acesso direto ao backend

# CentOS/RHEL
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=443/tcp
sudo firewall-cmd --reload
```

### 3. Clonar repositório

```bash
git clone https://github.com/seu-usuario/agendamento-ppc.git
cd agendamento-ppc
```

### 4. Configurar ambiente de produção

```bash
cp .env.docker .env
nano .env  # Editar com credenciais reais
```

### 5. Deploy

```bash
docker-compose build
docker-compose up -d
```

### 6. Verificar deploy

```bash
# Health check
curl http://localhost:3001/api/health

# Status dos containers
docker-compose ps

# Logs
docker-compose logs -f
```

---

## 🔒 Configuração SSL/HTTPS

### Opção 1: Nginx Proxy Manager (Recomendado)

1. Instalar Nginx Proxy Manager em outro container
2. Configurar proxy host apontando para `agendamento-frontend:80`
3. Adicionar certificado SSL (Let's Encrypt integrado)

### Opção 2: Certbot + Nginx Manual

```bash
# Instalar certbot
sudo apt install certbot python3-certbot-nginx

# Obter certificado
sudo certbot --nginx -d seudominio.com -d www.seudominio.com

# Renovação automática (já configurada)
sudo certbot renew --dry-run
```

### Opção 3: Cloudflare (Mais fácil)

1. Adicionar domínio ao Cloudflare
2. Configurar DNS apontando para IP do servidor
3. Ativar SSL/TLS no modo "Full" ou "Full (strict)"
4. Cloudflare gerencia certificados automaticamente

---

## 📊 Monitoramento e Logs

### Logs em tempo real

```bash
# Todos os serviços
docker-compose logs -f

# Backend apenas
docker-compose logs -f backend

# Frontend apenas
docker-compose logs -f frontend

# Últimas 100 linhas
docker-compose logs --tail=100
```

### Health Checks

```bash
# Health check do backend
curl http://localhost:3001/api/health

# Health check do frontend
curl http://localhost/health

# Status dos containers
docker-compose ps
```

### Monitoramento de Recursos

```bash
# Ver uso de CPU/RAM
docker stats

# Uso de disco das imagens
docker images

# Uso de disco dos containers
docker ps -s
```

### Alertas Automáticos (Opcional)

Configure ferramentas como:
- **Portainer** - Interface web para Docker
- **Grafana + Prometheus** - Métricas detalhadas
- **Uptime Kuma** - Monitoramento de uptime

---

## 🔧 Troubleshooting

### Container não inicia

```bash
# Ver logs de erro
docker-compose logs backend

# Verificar se porta está em uso
netstat -ano | findstr :3001  # Windows
lsof -i :3001  # Linux/Mac

# Rebuild sem cache
docker-compose build --no-cache
docker-compose up -d
```

### Erro de conexão com Supabase

1. Verifique se as credenciais no `.env` estão corretas
2. Teste conexão direta:
   ```bash
   curl https://seu-projeto.supabase.co
   ```
3. Verifique se o servidor tem acesso à internet

### Frontend não carrega

```bash
# Verificar logs do Nginx
docker-compose logs frontend

# Testar se Nginx está respondendo
curl http://localhost

# Verificar arquivos buildados
docker-compose exec frontend ls -la /usr/share/nginx/html
```

### API retorna 502 Bad Gateway

```bash
# Verificar se backend está rodando
docker-compose ps

# Verificar health check
curl http://backend:3001/api/health

# Reiniciar backend
docker-compose restart backend
```

### Variáveis de ambiente não funcionam

```bash
# Verificar se .env existe
ls -la .env

# Ver variáveis carregadas
docker-compose config

# Recriar containers
docker-compose down
docker-compose up -d
```

### Erro de permissão (Linux)

```bash
# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER

# Fazer logout e login novamente
exit
```

### Build muito lento

```bash
# Limpar cache do Docker
docker builder prune

# Build com mais recursos
docker-compose build --parallel

# Verificar se .dockerignore está correto
cat .dockerignore
```

### Erro "network not found"

```bash
# Recriar network
docker network rm agendamento_app-network
docker-compose up -d
```

---

## 🏗️ Arquitetura

### Estrutura dos Containers

```
┌─────────────────────────────────────────┐
│           Internet / Cliente            │
└────────────────┬────────────────────────┘
                 │ Port 80
       ┌─────────▼──────────┐
       │   Nginx (Frontend) │
       │  - Servir SPA      │
       │  - Reverse Proxy   │
       └─────────┬──────────┘
                 │
          ┌──────┴──────┐
          │             │
    Static Files    /api requests
          │             │
          │      ┌──────▼────────┐
          │      │ Backend API   │
          │      │ (Express)     │
          │      └──────┬────────┘
          │             │
          │      ┌──────▼────────┐
          │      │   Supabase    │
          │      │  (PostgreSQL) │
          │      └───────────────┘
          │
     React SPA Build
```

### Portas

- **80**: Nginx (Frontend + Proxy)
- **3001**: Backend API (interno e externo)

### Volumes

Nenhum volume persistente necessário - arquitetura stateless.
Todos os dados são armazenados no Supabase (externo).

### Networks

- **app-network**: Bridge network interna
  - Frontend pode acessar Backend pelo nome `backend:3001`
  - Isolamento de rede entre containers

### Imagens

| Serviço | Base Image | Tamanho Final |
|---------|-----------|---------------|
| Frontend | `nginx:alpine` | ~50 MB |
| Backend | `node:20-alpine` | ~150 MB |

### Build Multi-stage

Ambos containers usam build multi-stage:

1. **Stage 1 (Builder)**: Instala dependências e builda
2. **Stage 2 (Production)**: Copia apenas artifacts necessários

Benefícios:
- Imagens finais menores (200MB vs 2GB)
- Sem ferramentas de desenvolvimento em produção
- Build cache otimizado

---

## 🔐 Segurança

### Checklist de Produção

- [ ] API_KEY gerada com crypto seguro (32+ bytes)
- [ ] ALLOWED_ORIGINS configurado (não usar `*`)
- [ ] Variáveis sensíveis no `.env` (não no código)
- [ ] `.env` adicionado ao `.gitignore`
- [ ] HTTPS configurado (certificado SSL)
- [ ] Firewall configurado (apenas portas necessárias)
- [ ] Backup automático do Supabase configurado
- [ ] Logs de auditoria ativos
- [ ] Rate limiting configurado (Supabase)
- [ ] Headers de segurança ativos (já inclusos no nginx.conf)

### Headers de Segurança Inclusos

```nginx
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: no-referrer-when-downgrade
```

---

## 📞 Suporte

### Documentação Adicional

- **Docker**: https://docs.docker.com
- **Docker Compose**: https://docs.docker.com/compose
- **Supabase**: https://supabase.com/docs
- **Nginx**: https://nginx.org/en/docs

### Logs Úteis

Sempre inclua os logs ao reportar problemas:

```bash
docker-compose logs > logs.txt
docker-compose ps > status.txt
docker-compose config > config.txt
```

---

## 📝 Notas Importantes

1. **Backup**: Configure backup automático no Supabase (já gerenciado)
2. **Escalabilidade**: Para alta demanda, considere múltiplas instâncias com load balancer
3. **Updates**: Sempre teste updates em staging antes de produção
4. **Monitoramento**: Configure alertas para downtime e erros
5. **Logs**: Configure rotação de logs para não encher disco

---

**Versão**: 1.0.0
**Última atualização**: Novembro 2025
**Suporte**: Consulte documentação do projeto principal

---

## 🚢 Deploy Rápido (TL;DR)

```bash
# 1. Configurar ambiente
copy .env.docker .env
notepad .env  # Editar credenciais

# 2. Build e deploy
docker-compose build
docker-compose up -d

# 3. Verificar
docker-compose ps
curl http://localhost:3001/api/health

# 4. Ver logs
docker-compose logs -f
```

✅ Pronto! Aplicação rodando em http://localhost
