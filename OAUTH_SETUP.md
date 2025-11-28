# 🔐 Configuração de OAuth (Google e Facebook) - Pipicos Festas CRM

## 📋 Visão Geral

Este guia mostra como configurar autenticação social (Google e Facebook) no Supabase para o CRM Pipicos Festas.

---

## 🌐 Configurar Google OAuth

### **Passo 1: Criar Projeto no Google Cloud Console**

1. Acesse: [Google Cloud Console](https://console.cloud.google.com/)
2. Clique em **"Select a project"** → **"NEW PROJECT"**
3. Nome do projeto: `Pipicos Festas CRM`
4. Clique em **"CREATE"**

### **Passo 2: Configurar Tela de Consentimento OAuth**

1. No menu lateral, vá em: **APIs & Services** → **OAuth consent screen**
2. Selecione **External** (para permitir qualquer usuário do Google)
3. Clique em **"CREATE"**

**Configurações**:
- **App name**: `Pipicos Festas CRM`
- **User support email**: Seu email
- **App logo**: (Opcional) Upload da logo do Pipicos
- **Developer contact**: Seu email
- Clique em **"SAVE AND CONTINUE"**

**Scopes** (próxima tela):
- Clique em **"ADD OR REMOVE SCOPES"**
- Selecione:
  - `.../auth/userinfo.email`
  - `.../auth/userinfo.profile`
- Clique em **"UPDATE"** → **"SAVE AND CONTINUE"**

**Test users** (próxima tela):
- Clique em **"SAVE AND CONTINUE"**
- Clique em **"BACK TO DASHBOARD"**

### **Passo 3: Criar Credenciais OAuth**

1. Vá em: **APIs & Services** → **Credentials**
2. Clique em **"CREATE CREDENTIALS"** → **"OAuth client ID"**
3. **Application type**: `Web application`
4. **Name**: `Pipicos Festas Web Client`

**Authorized JavaScript origins**:
```
http://localhost:3000
https://seu-dominio-producao.com
```

**Authorized redirect URIs**:
```
https://<SEU-PROJETO>.supabase.co/auth/v1/callback
```

> ⚠️ **Importante**: Substitua `<SEU-PROJETO>` pelo ID do seu projeto Supabase
>
> Exemplo: `https://abcdefghijklmn.supabase.co/auth/v1/callback`

5. Clique em **"CREATE"**
6. **Copie o Client ID e Client Secret** (você vai precisar no próximo passo)

### **Passo 4: Configurar Google Provider no Supabase**

1. Acesse: [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em: **Authentication** → **Providers**
4. Procure por **"Google"** e clique em **"Enable"**

**Configurações**:
- **Client ID**: Cole o Client ID do Google
- **Client Secret**: Cole o Client Secret do Google
- **Redirect URL**: Já preenchida automaticamente
  - Exemplo: `https://<seu-projeto>.supabase.co/auth/v1/callback`

5. Clique em **"Save"**

### **Passo 5: Testar Login com Google**

1. Acesse: `http://localhost:3000/login`
2. Clique em **"Continuar com Google"**
3. Selecione sua conta Google
4. Permita o acesso aos dados
5. Você será redirecionado para o dashboard! ✅

---

## 📘 Configurar Facebook OAuth

### **Passo 1: Criar App no Facebook Developers**

1. Acesse: [Facebook for Developers](https://developers.facebook.com/)
2. Clique em **"My Apps"** → **"Create App"**
3. Selecione **"Consumer"** como tipo de app
4. Clique em **"Next"**

**Detalhes do App**:
- **App name**: `Pipicos Festas CRM`
- **App contact email**: Seu email
- Clique em **"Create app"**

### **Passo 2: Adicionar Produto Facebook Login**

1. No dashboard do seu app, procure por **"Facebook Login"**
2. Clique em **"Set Up"**
3. Selecione **"Web"**

**Site URL**:
```
http://localhost:3000
```
(Em produção, use seu domínio real)

4. Clique em **"Save"** → **"Continue"**

### **Passo 3: Configurar OAuth Redirect URIs**

1. No menu lateral, vá em: **Facebook Login** → **Settings**

**Valid OAuth Redirect URIs**:
```
https://<SEU-PROJETO>.supabase.co/auth/v1/callback
```

> ⚠️ **Importante**: Substitua `<SEU-PROJETO>` pelo ID do seu projeto Supabase

2. Clique em **"Save Changes"**

### **Passo 4: Obter App ID e App Secret**

1. No menu lateral, vá em: **Settings** → **Basic**
2. **Copie**:
   - **App ID**
   - **App Secret** (clique em "Show" para revelar)

### **Passo 5: Configurar Facebook Provider no Supabase**

1. Acesse: [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em: **Authentication** → **Providers**
4. Procure por **"Facebook"** e clique em **"Enable"**

**Configurações**:
- **Client ID**: Cole o App ID do Facebook
- **Client Secret**: Cole o App Secret do Facebook
- **Redirect URL**: Já preenchida automaticamente

5. Clique em **"Save"**

### **Passo 6: Publicar o App Facebook (Para Produção)**

> ⚠️ **Importante**: Em modo de desenvolvimento, apenas você e testadores podem fazer login

1. No Facebook Developers, vá em: **App Review** → **Permissions and Features**
2. Solicite aprovação para:
   - `public_profile`
   - `email`
3. Vá em: **Settings** → **Basic**
4. Mude **"App Mode"** de "Development" para "Live"

### **Passo 7: Testar Login com Facebook**

1. Acesse: `http://localhost:3000/login`
2. Clique em **"Continuar com Facebook"**
3. Faça login com sua conta Facebook
4. Permita o acesso aos dados
5. Você será redirecionado para o dashboard! ✅

---

## 🔍 Como Funciona o Fluxo OAuth

### **Fluxo de Autenticação**:

1. **Usuário clica em "Continuar com Google/Facebook"**
   ```typescript
   await signInWithGoogle();
   // ou
   await signInWithFacebook();
   ```

2. **Supabase redireciona para o provider** (Google/Facebook)
   - URL de redirect: `https://accounts.google.com/o/oauth2/auth?...`

3. **Usuário faz login e autoriza o app**
   - Concede permissões: email, perfil, etc.

4. **Provider redireciona de volta para o Supabase**
   - URL de callback: `https://<projeto>.supabase.co/auth/v1/callback`
   - Com um `code` de autorização

5. **Supabase troca o code por um token de acesso**
   - Cria ou atualiza o usuário no banco de dados
   - Gera uma sessão Supabase

6. **Supabase redireciona para o app**
   - URL: `http://localhost:3000/` (ou a configurada)
   - Sessão ativa!

7. **AuthContext detecta a sessão**
   ```typescript
   supabase.auth.onAuthStateChange((_event, session) => {
     setSession(session);
     setUser(session?.user ?? null);
   });
   ```

8. **Usuário é redirecionado para o dashboard**
   - `PrivateRoute` permite o acesso
   - Header mostra email do usuário

---

## 🐛 Troubleshooting

### **Erro: "redirect_uri_mismatch" (Google)**

**Problema**: A URL de redirect não está autorizada

**Solução**:
1. Verifique no Google Cloud Console:
   - **APIs & Services** → **Credentials** → Seu OAuth Client
   - **Authorized redirect URIs** deve conter:
     ```
     https://<SEU-PROJETO>.supabase.co/auth/v1/callback
     ```
2. Copie a URL EXATA do Supabase Dashboard (Authentication → Providers → Google)

### **Erro: "Invalid OAuth Redirect URI" (Facebook)**

**Problema**: A URI de callback não está configurada no Facebook

**Solução**:
1. Vá no Facebook Developers:
   - **Facebook Login** → **Settings**
   - **Valid OAuth Redirect URIs** deve conter:
     ```
     https://<SEU-PROJETO>.supabase.co/auth/v1/callback
     ```

### **Erro: "App Not Set Up" (Facebook em produção)**

**Problema**: O app Facebook está em modo Development

**Solução**:
1. Publique o app (veja "Passo 6: Publicar o App Facebook")
2. Ou adicione testadores:
   - **Roles** → **Add Testers**

### **Login funciona em localhost mas não em produção**

**Problema**: URLs não configuradas para produção

**Solução**:
1. Adicione seu domínio de produção em:
   - **Google Cloud Console**: Authorized JavaScript origins
   - **Facebook Developers**: Site URL e Valid OAuth Redirect URIs
2. No Supabase, verifique:
   - **Authentication** → **URL Configuration** → **Site URL**
   - Deve ser seu domínio de produção

### **Usuário faz login mas não é redirecionado**

**Problema**: `redirectTo` incorreto no código

**Solução**:
Verifique `src/contexts/AuthContext.tsx`:
```typescript
const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/`,  // ✅ Correto
      // redirectTo: 'http://localhost:3000/',  // ❌ Hardcoded
    },
  });
};
```

---

## 📋 Checklist de Configuração

### Google OAuth:
- [ ] Projeto criado no Google Cloud Console
- [ ] Tela de consentimento OAuth configurada
- [ ] OAuth Client ID criado
- [ ] Authorized redirect URIs configuradas
- [ ] Client ID e Secret copiados
- [ ] Provider habilitado no Supabase
- [ ] Testado com sucesso

### Facebook OAuth:
- [ ] App criado no Facebook Developers
- [ ] Facebook Login adicionado ao app
- [ ] Valid OAuth Redirect URIs configuradas
- [ ] App ID e Secret copiados
- [ ] Provider habilitado no Supabase
- [ ] App publicado (para produção)
- [ ] Testado com sucesso

---

## 🎯 URLs Importantes

### Google:
- [Google Cloud Console](https://console.cloud.google.com/)
- [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)

### Facebook:
- [Facebook for Developers](https://developers.facebook.com/)
- [App Dashboard](https://developers.facebook.com/apps/)

### Supabase:
- [Supabase Dashboard](https://app.supabase.com)
- [Docs - Google OAuth](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Docs - Facebook OAuth](https://supabase.com/docs/guides/auth/social-login/auth-facebook)

---

## 💡 Dicas Extras

### **Personalizar Scopes (Google)**

Se precisar de mais dados do usuário:
```typescript
const { error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/`,
    scopes: 'email profile', // Adicione mais scopes aqui
  },
});
```

### **Personalizar Scopes (Facebook)**

```typescript
const { error } = await supabase.auth.signInWithOAuth({
  provider: 'facebook',
  options: {
    redirectTo: `${window.location.origin}/`,
    scopes: 'email public_profile', // Adicione mais scopes aqui
  },
});
```

### **Acessar Dados Extras do Provider**

```typescript
const { user } = useAuth();

// Metadados do Google/Facebook
console.log(user?.user_metadata);
// {
//   avatar_url: "https://...",
//   full_name: "Nome Completo",
//   email: "email@exemplo.com",
//   provider: "google"
// }
```

---

**Documentação criada por**: Claude Code
**Data**: Novembro 2025
**Versão**: 1.0
