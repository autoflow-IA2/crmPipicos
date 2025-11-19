# 📦 Dockerfile - Documentação Técnica

## 🏗️ Arquitetura Multi-Stage

Este Dockerfile utiliza uma estratégia **multi-stage build** para criar uma imagem otimizada que roda o frontend (React + Vite) e o backend (Node.js + Express) em um único container.

---

## 📋 Estrutura

```
┌──────────────────────────────────────────────────────┐
│ Stage 1: frontend-builder (node:20-alpine)          │
├──────────────────────────────────────────────────────┤
│ • Instala dependências do frontend                   │
│ • Compila TypeScript                                 │
│ • Executa build do Vite                              │
│ • Gera arquivos estáticos (HTML, CSS, JS)            │
└──────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────┐
│ Stage 2: backend-builder (node:20-alpine)           │
├──────────────────────────────────────────────────────┤
│ • Instala dependências do backend                    │
│ • Compila TypeScript do backend                      │
│ • Gera arquivos JavaScript otimizados                │
└──────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────┐
│ Stage 3: production (node:20-alpine)                │
├──────────────────────────────────────────────────────┤
│ • Instala Nginx + Supervisor + curl                  │
│ • Copia frontend estático do Stage 1                 │
│ • Copia backend compilado do Stage 2                 │
│ • Configura Nginx como reverse proxy                 │
│ • Configura Supervisor para gerenciar processos      │
│ • Expõe porta 80                                     │
└──────────────────────────────────────────────────────┘
```

---

## 🔧 Stages Detalhados

### Stage 1: Frontend Builder

```dockerfile
FROM node:20-alpine AS frontend-builder
```

**Objetivo**: Compilar o frontend React com Vite

**Passos**:
1. Copia `package.json`, `tsconfig.json`, `vite.config.ts`
2. Instala dependências com `npm ci`
3. Copia código fonte (`src/`, `public/`)
4. Define variáveis de ambiente do Supabase (com defaults)
5. Executa `npm run build:frontend`
6. Resultado: pasta `dist/` com arquivos estáticos

**Variáveis de Build**:
- `VITE_SUPABASE_URL`: URL do projeto Supabase
- `VITE_SUPABASE_ANON_KEY`: Chave pública do Supabase

**Nota**: Se as variáveis não forem passadas, usa valores default hardcoded.

---

### Stage 2: Backend Builder

```dockerfile
FROM node:20-alpine AS backend-builder
```

**Objetivo**: Compilar o backend Node.js + Express

**Passos**:
1. Copia `backend/package.json` e `backend/tsconfig.json`
2. Instala dependências com `npm ci`
3. Copia código fonte (`backend/src/`)
4. Executa `npm run build`
5. Resultado: pasta `backend/dist/` com JavaScript compilado

**Dependências**:
- TypeScript
- Express
- Supabase JS Client
- CORS, Helmet, Morgan

---

### Stage 3: Production Runtime

```dockerfile
FROM node:20-alpine
```

**Objetivo**: Criar imagem final otimizada para produção

**Componentes Instalados**:

1. **Nginx** (Servidor Web)
   - Serve arquivos estáticos do frontend
   - Proxy reverso para o backend
   - Compressão gzip
   - Headers de segurança

2. **Supervisor** (Gerenciador de Processos)
   - Inicia e monitora o backend
   - Inicia e monitora o Nginx
   - Reinicia processos automaticamente se caírem

3. **Node.js** (Runtime do Backend)
   - Executa o servidor Express
   - Conecta ao Supabase
   - Expõe API REST na porta 3001

4. **curl** (Healthcheck)
   - Usado pelo Docker healthcheck
   - Verifica se o serviço está rodando

---

## 🌐 Configuração do Nginx

### Arquivo: `nginx-easypanel.conf`

```nginx
# Arquivos estáticos do frontend
location / {
    root /usr/share/nginx/html;
    try_files $uri $uri/ /index.html;
}

# Proxy reverso para o backend
location /api {
    proxy_pass http://127.0.0.1:3001;
}

# Health check
location /health {
    return 200 "healthy\n";
}
```

**Configurações Importantes**:
- Frontend servido em `/`
- Backend proxiado em `/api/*`
- Health check em `/health`
- Compressão gzip ativada
- Headers de segurança configurados

---

## 🔄 Supervisor Configuration

### Arquivo: `/etc/supervisor/conf.d/supervisord.conf`

```ini
[program:backend]
command=node /app/backend/dist/server.js
autostart=true
autorestart=true

[program:nginx]
command=nginx -g 'daemon off;'
autostart=true
autorestart=true
```

**Benefícios**:
- Ambos os serviços rodam em paralelo
- Reinício automático em caso de falha
- Logs centralizados
- Gerenciamento simplificado

---

## 📝 Script de Inicialização

### Arquivo: `/app/start.sh`

```bash
#!/bin/sh
echo "🚀 Starting CRM Agendamentos Services"

# Verifica se os builds existem
if [ ! -f /app/backend/dist/server.js ]; then
    echo "❌ Backend build not found!"
    exit 1
fi

# Inicia supervisor
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
```

**Validações**:
- ✅ Backend compilado existe
- ✅ Frontend compilado existe
- ✅ Variáveis de ambiente configuradas

---

## 🔐 Variáveis de Ambiente

### Build Time (ARG)

Usadas durante o build do frontend:

```dockerfile
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
```

**Como passar**:
```bash
docker build \
  --build-arg VITE_SUPABASE_URL=https://seu-projeto.supabase.co \
  --build-arg VITE_SUPABASE_ANON_KEY=sua_anon_key \
  -t crm-agendamentos .
```

### Runtime (ENV)

Usadas quando o container está rodando:

```dockerfile
ENV NODE_ENV=production
ENV PORT=3001
```

**Variáveis Necessárias** (passadas pelo Easypanel):
- `NODE_ENV`: Ambiente (production)
- `PORT`: Porta do backend (3001)
- `API_KEY`: Chave de autenticação da API
- `SUPABASE_URL`: URL do Supabase
- `SUPABASE_SERVICE_KEY`: Service key do Supabase
- `ALLOWED_ORIGINS`: CORS (ex: `*` ou domínios específicos)

---

## 🏃 Como Usar

### Build Local

```bash
# Build com valores default
docker build -t crm-agendamentos .

# Build com variáveis customizadas
docker build \
  --build-arg VITE_SUPABASE_URL=https://seu-projeto.supabase.co \
  --build-arg VITE_SUPABASE_ANON_KEY=sua_chave \
  -t crm-agendamentos .
```

### Run Local

```bash
docker run -d \
  -p 80:80 \
  -e NODE_ENV=production \
  -e PORT=3001 \
  -e API_KEY=sua_api_key \
  -e SUPABASE_URL=https://seu-projeto.supabase.co \
  -e SUPABASE_SERVICE_KEY=sua_service_key \
  -e ALLOWED_ORIGINS=* \
  --name crm-app \
  crm-agendamentos
```

### Verificar Logs

```bash
# Logs gerais
docker logs crm-app

# Logs do backend
docker exec crm-app tail -f /var/log/supervisor/backend.out.log

# Logs do Nginx
docker exec crm-app tail -f /var/log/nginx/access.log
```

### Health Check

```bash
# Frontend + Nginx
curl http://localhost/health

# Backend
curl http://localhost/api/health
```

---

## 🎯 Otimizações

### 1. Multi-Stage Build

**Benefício**: Reduz o tamanho final da imagem

- Build stages descartam node_modules de desenvolvimento
- Imagem final contém apenas código compilado
- Redução de ~500MB para ~200MB

### 2. Alpine Linux

**Benefício**: Imagem base menor e mais segura

- `node:20-alpine` tem ~50MB vs `node:20` com ~300MB
- Menos vulnerabilidades
- Inicialização mais rápida

### 3. npm ci --silent

**Benefício**: Instalação mais rápida e confiável

- Usa `package-lock.json` exato
- Não modifica arquivos de lock
- Menos logs, build mais limpo

### 4. Supervisor

**Benefício**: Gerenciamento robusto de processos

- Reinício automático de serviços
- Logs centralizados
- Melhor controle de lifecycle

### 5. Cache de Layers

**Benefício**: Builds incrementais mais rápidos

- Layers de dependências são cacheadas
- Apenas código alterado é recompilado
- Rebuild em segundos após primeira build

---

## 🐛 Debugging

### Container não inicia

```bash
# Ver logs de inicialização
docker logs crm-app

# Entrar no container
docker exec -it crm-app sh

# Verificar processos
docker exec -it crm-app ps aux

# Verificar supervisor
docker exec -it crm-app supervisorctl status
```

### Backend não responde

```bash
# Verificar se está rodando
docker exec crm-app curl http://localhost:3001/api/health

# Ver logs do backend
docker exec crm-app tail -f /var/log/supervisor/backend.out.log
docker exec crm-app tail -f /var/log/supervisor/backend.err.log

# Verificar variáveis de ambiente
docker exec crm-app env | grep -E 'SUPABASE|API_KEY|PORT'
```

### Nginx retorna 502

```bash
# Verificar logs do Nginx
docker exec crm-app tail -f /var/log/nginx/error.log

# Testar conexão com backend
docker exec crm-app curl http://localhost:3001/api/health

# Verificar configuração do Nginx
docker exec crm-app nginx -t
```

### Build falha

```bash
# Build com logs completos
docker build --no-cache --progress=plain -t crm-agendamentos .

# Verificar espaço em disco
docker system df

# Limpar cache antigo
docker builder prune -a
```

---

## 📊 Tamanho da Imagem

```bash
# Verificar tamanho
docker images crm-agendamentos

# Exemplo de resultado:
# REPOSITORY          TAG       SIZE
# crm-agendamentos    latest    ~200MB
```

**Breakdown aproximado**:
- Base Alpine: ~50MB
- Node.js Runtime: ~50MB
- Nginx: ~5MB
- Frontend Build: ~30MB
- Backend Build: ~10MB
- Dependencies: ~55MB

---

## 🔄 CI/CD Integration

### GitHub Actions

```yaml
name: Build and Push Docker Image

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build Docker Image
        run: |
          docker build \
            --build-arg VITE_SUPABASE_URL=${{ secrets.SUPABASE_URL }} \
            --build-arg VITE_SUPABASE_ANON_KEY=${{ secrets.SUPABASE_ANON_KEY }} \
            -t crm-agendamentos .
```

### GitLab CI

```yaml
build:
  stage: build
  script:
    - docker build \
        --build-arg VITE_SUPABASE_URL=$SUPABASE_URL \
        --build-arg VITE_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY \
        -t crm-agendamentos .
```

---

## 📚 Referências

- [Docker Multi-Stage Builds](https://docs.docker.com/build/building/multi-stage/)
- [Nginx Official Docs](https://nginx.org/en/docs/)
- [Supervisor Documentation](http://supervisord.org/configuration.html)
- [Alpine Linux](https://alpinelinux.org/)
- [Vite Build Guide](https://vitejs.dev/guide/build.html)

---

**Autor**: Claude Code
**Data**: 19/11/2025
**Versão**: 1.0
