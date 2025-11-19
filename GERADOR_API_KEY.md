# 🔑 Gerador de API Key - Documentação

## ✨ Nova Funcionalidade Implementada!

Agora você pode gerar API Keys seguras diretamente na página de documentação da API!

---

## 📍 Onde Encontrar

**URL:** `http://localhost:3000/api-docs`

**Localização:** Seção "Configuração" → "Gerar Nova API Key"

---

## 🎯 Como Funciona

### 1. Acessar a Página

```
http://localhost:3000/api-docs
```

### 2. Clicar no Botão "🔑 Gerar API Key Segura"

O sistema vai:
- Gerar uma chave aleatória de 256 bits
- Usar a API Web Crypto (segura e criptograficamente forte)
- Codificar em Base64 URL-safe
- Exibir a chave imediatamente

### 3. Resultado Visual

Quando você clica em "Gerar API Key Segura", aparece um card verde com:

```
✅ API Key gerada com sucesso!

[Chave gerada aqui - ex: xK9mP2vL8nR4qW7sY1tU6hF5jC3dE0bA9mN8vB2cX4z]

📋 Próximos passos:
1. Copie a chave usando o botão "Copiar" acima
2. Abra o arquivo backend/.env
3. Cole a chave na linha: API_KEY=sua-chave-aqui
4. Reinicie o servidor backend
5. Use esta chave nos testes abaixo
```

---

## 🔧 Passo a Passo Completo

### **Passo 1: Gerar a Chave**

1. Acesse `http://localhost:3000/api-docs`
2. Clique em **"🔑 Gerar API Key Segura"**
3. A chave será exibida em um card verde

**Exemplo de chave gerada:**
```
xK9mP2vL8nR4qW7sY1tU6hF5jC3dE0bA9mN8vB2cX4zL6hJ8kM3nP5qR7sT9vW1x
```

---

### **Passo 2: Copiar a Chave**

- Clique no botão **"Copiar"** ao lado do botão de gerar
- A chave será copiada para sua área de transferência
- Você verá um alerta: "Copiado para a área de transferência!"

---

### **Passo 3: Configurar no Backend**

1. **Abra o arquivo:**
   ```
   C:\agendamento_ppc\backend\.env
   ```

2. **Localize a linha:**
   ```env
   API_KEY=sua-chave-api-super-secreta-aqui
   ```

3. **Cole a nova chave:**
   ```env
   API_KEY=xK9mP2vL8nR4qW7sY1tU6hF5jC3dE0bA9mN8vB2cX4zL6hJ8kM3nP5qR7sT9vW1x
   ```

4. **Salve o arquivo** (Ctrl+S)

---

### **Passo 4: Reiniciar o Backend**

```bash
# Pare o servidor (Ctrl+C)
# Depois reinicie:
cd backend
npm run dev
```

---

### **Passo 5: Testar a Chave**

#### Opção A: Na Interface Web

1. Na mesma página (`/api-docs`)
2. Role até a seção "Ou cole sua API Key existente"
3. Cole a chave gerada
4. Role até qualquer endpoint
5. Clique em "Mostrar cURL"
6. A chave será incluída automaticamente nos exemplos!

#### Opção B: No Terminal

```bash
curl -H "X-API-Key: xK9mP2vL8nR4qW7sY1tU6hF5jC3dE0bA9mN8vB2cX4z" \
  http://localhost:3001/api/health
```

**Resposta esperada:**
```json
{
  "success": true,
  "data": {
    "status": "OK",
    "timestamp": "2025-11-19T12:00:00.000Z",
    "uptime": 1234,
    "environment": "development"
  }
}
```

---

## 🔒 Segurança

### Como a Chave é Gerada?

```typescript
// Usa a Web Crypto API (segura)
const array = new Uint8Array(32); // 32 bytes = 256 bits
window.crypto.getRandomValues(array); // Valores criptograficamente seguros

// Converte para Base64 URL-safe
const key = btoa(String.fromCharCode(...array))
  .replace(/\+/g, '-')   // Substitui + por -
  .replace(/\//g, '_')   // Substitui / por _
  .replace(/=+$/, '');   // Remove padding
```

### Características da Chave

- ✅ **256 bits de entropia** (muito segura)
- ✅ **Criptograficamente aleatória** (Web Crypto API)
- ✅ **URL-safe** (pode ser usada em URLs sem encoding)
- ✅ **Base64 codificada** (fácil de copiar e colar)
- ✅ **Sem caracteres especiais problemáticos**

### Nível de Segurança

- 🔐 **2^256 combinações possíveis**
- 🔐 **Impossível adivinhar por força bruta**
- 🔐 **Equivalente a chaves usadas em bancos e criptomoedas**
- 🔐 **Segura para uso em produção**

---

## 💡 Recursos da Interface

### Botões Disponíveis

| Botão | Função |
|-------|--------|
| 🔑 Gerar API Key Segura | Gera uma nova chave aleatória |
| Copiar | Copia a chave para área de transferência |

### Estados Visuais

#### Antes de Gerar
- Apenas o botão "Gerar API Key Segura" visível
- Dica informativa sobre segurança

#### Depois de Gerar
- ✅ Card verde com sucesso
- 🔑 Chave exibida em destaque
- 📋 Lista de próximos passos
- 📋 Botão "Copiar" habilitado

---

## 🧪 Testando a Funcionalidade

### Teste 1: Gerar e Copiar

```
1. Acesse /api-docs
2. Clique em "Gerar API Key Segura"
3. Verifique se uma chave apareceu
4. Clique em "Copiar"
5. Cole em um editor de texto (Ctrl+V)
6. Confirme que a chave foi copiada
```

### Teste 2: Usar em Requisição

```bash
# 1. Gere uma chave na interface
# 2. Copie a chave
# 3. Execute:

curl -H "X-API-Key: [cole-a-chave-aqui]" \
  http://localhost:3001/api/health

# Deve retornar: {"success": true, "data": {...}}
```

### Teste 3: Testar Chave Inválida

```bash
# Use uma chave qualquer
curl -H "X-API-Key: chave-invalida" \
  http://localhost:3001/api/health

# Deve retornar erro 403:
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "API Key inválida"
  }
}
```

---

## 📱 Interface Responsiva

A interface do gerador funciona em:
- ✅ Desktop (telas grandes)
- ✅ Tablet (telas médias)
- ✅ Mobile (telas pequenas)

O card verde se ajusta automaticamente ao tamanho da tela.

---

## 🎨 Design

### Cores

- **Verde**: Sucesso (chave gerada)
- **Roxo**: Código/API Key (destaque)
- **Cinza**: Informações secundárias

### Ícones

- 🔑 Chave (botão de gerar)
- ✅ Check (sucesso)
- 📋 Clipboard (próximos passos)

---

## ⚠️ Dicas Importantes

### ✅ Faça

- ✅ Gere uma nova chave para cada ambiente (dev, staging, prod)
- ✅ Mantenha a chave no arquivo `.env` (nunca no código)
- ✅ Adicione `.env` no `.gitignore`
- ✅ Use HTTPS em produção
- ✅ Regenere a chave periodicamente (segurança)

### ❌ Não Faça

- ❌ Compartilhe a chave publicamente
- ❌ Commit a chave no Git
- ❌ Use a mesma chave em dev e prod
- ❌ Envie a chave por email/chat não criptografado
- ❌ Use chaves simples como "123456" ou "password"

---

## 🔄 Regenerar Chave

### Quando Regenerar?

- 🔄 A cada 90 dias (rotação de segurança)
- 🔄 Se suspeitar de vazamento
- 🔄 Ao mudar de ambiente
- 🔄 Após remover um desenvolvedor do projeto

### Como Regenerar?

1. Clique novamente em "Gerar API Key Segura"
2. Uma nova chave será gerada (substitui a anterior)
3. Copie e configure no backend
4. Reinicie o servidor
5. Atualize todas as integrações (n8n, Zapier, etc.)

---

## 🚀 Integração com Outras Ferramentas

### n8n

1. Gere a chave na interface
2. Copie a chave
3. No n8n, adicione header:
   - Name: `X-API-Key`
   - Value: [cole a chave]

### Zapier

1. Gere a chave na interface
2. Em "Headers" no Zapier:
   - Key: `X-API-Key`
   - Value: [cole a chave]

### Postman

1. Gere a chave na interface
2. Em "Headers" no Postman:
   - Key: `X-API-Key`
   - Value: [cole a chave]

---

## 📊 Exemplo Completo

### Cenário: Configurar API pela Primeira Vez

```bash
# 1. Frontend - Gerar chave
1. Acesse: http://localhost:3000/api-docs
2. Clique: "🔑 Gerar API Key Segura"
3. Copie a chave gerada

# 2. Backend - Configurar
1. Abra: backend/.env
2. Cole: API_KEY=xK9mP2vL8nR4qW7sY1tU6hF5jC3dE0bA
3. Salve o arquivo

# 3. Reiniciar Backend
cd backend
npm run dev

# 4. Testar
curl -H "X-API-Key: xK9mP2vL8nR4qW7sY1tU6hF5jC3dE0bA" \
  http://localhost:3001/api/health

# 5. Resultado
{"success": true, "data": {"status": "OK"}}

# ✅ Pronto! API configurada e funcionando!
```

---

## 🎉 Benefícios

1. **🚀 Mais Rápido**: Não precisa usar terminal ou comandos
2. **🔒 Mais Seguro**: Gera chaves criptograficamente fortes
3. **💡 Mais Fácil**: Interface visual com instruções passo a passo
4. **📋 Mais Prático**: Copiar e colar com um clique
5. **✅ Mais Confiável**: Sem erros de digitação ou formatação

---

## 📝 Notas Técnicas

### Compatibilidade

- ✅ Chrome 37+
- ✅ Firefox 34+
- ✅ Safari 11+
- ✅ Edge 12+
- ✅ Opera 24+

### Dependências

- Nenhuma! Usa apenas a Web Crypto API nativa do navegador

### Performance

- ⚡ Geração instantânea (<1ms)
- ⚡ Sem requisições ao servidor
- ⚡ Processamento 100% client-side

---

**🔑 Gerador de API Key implementado com sucesso!**

**Versão:** 1.0.0
**Data:** 19/11/2025
**Status:** ✅ Pronto para uso
