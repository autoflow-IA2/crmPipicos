# 🔐 Sistema de Autenticação - Pipicos Festas CRM

## Visão Geral

Sistema completo de autenticação integrado com **Supabase Auth**, com proteção de rotas, recuperação de senha e interface totalmente alinhada com a identidade visual Pipicos Festas.

---

## ✨ Funcionalidades Implementadas

### 1. **Autenticação com Supabase**
- ✅ Login com email e senha
- ✅ Cadastro de novos usuários (signUp)
- ✅ Logout com limpeza de sessão
- ✅ Recuperação de senha via email
- ✅ Persistência de sessão entre reloads
- ✅ Monitoramento em tempo real do estado de autenticação

### 2. **Proteção de Rotas**
- ✅ Todas as rotas do CRM protegidas (exceto `/login` e `/esqueci-senha`)
- ✅ Redirect automático para login se não autenticado
- ✅ Preservação da URL tentada para redirect após login bem-sucedido
- ✅ Loading state durante verificação de autenticação

### 3. **Interface de Usuário**
- ✅ Tela de Login com branding Pipicos Festas
- ✅ Tela "Esqueci a Senha" com confirmação visual
- ✅ Header mostra email do usuário autenticado
- ✅ Botão de logout funcional
- ✅ Notificações toast para feedback (sucesso/erro)

---

## 🚀 Como Usar

### **Configuração Inicial**

1. **Certifique-se de ter as variáveis de ambiente configuradas** (`.env`):
   ```env
   VITE_SUPABASE_URL=sua_url_do_supabase
   VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
   ```

2. **Configure a autenticação no Supabase Dashboard**:
   - Acesse: [Supabase Dashboard](https://app.supabase.com)
   - Vá em **Authentication** → **Providers**
   - Habilite **Email** como provider
   - Configure templates de email (opcional)

---

## 📝 Fluxo de Autenticação

### **1. Primeiro Acesso (Criar Conta)**

```typescript
// O usuário pode criar uma conta via Supabase Dashboard ou via código:
import { useAuth } from './contexts/AuthContext';

const { signUp } = useAuth();
await signUp('email@exemplo.com', 'senha123');
```

**Nota**: O Supabase envia um email de confirmação automaticamente.

### **2. Login**

1. Acesse `http://localhost:3000/login`
2. Digite email e senha
3. Clique em "Entrar"
4. Será redirecionado para o dashboard (ou página que tentou acessar)

### **3. Esqueci a Senha**

1. Na tela de login, clique em "Esqueci a senha"
2. Digite seu email
3. Clique em "Enviar Link de Recuperação"
4. Verifique sua caixa de entrada
5. Clique no link recebido para redefinir a senha

### **4. Logout**

1. Clique no avatar do usuário no Header (canto superior direito)
2. Clique em "Sair"
3. Será redirecionado para a tela de login

---

## 🛠️ Arquitetura Técnica

### **Contexto de Autenticação** (`src/contexts/AuthContext.tsx`)

Centraliza toda a lógica de autenticação:

```typescript
interface AuthContextType {
  user: User | null;              // Usuário atual
  session: Session | null;        // Sessão ativa
  loading: boolean;               // Estado de carregamento
  signIn: (email, password) => Promise<{ error: AuthError | null }>;
  signUp: (email, password) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email) => Promise<{ error: AuthError | null }>;
}
```

**Como usar**:
```typescript
import { useAuth } from '../contexts/AuthContext';

const { user, signIn, signOut } = useAuth();

// Login
await signIn('email@exemplo.com', 'senha');

// Logout
await signOut();

// Verificar se está autenticado
if (user) {
  console.log('Usuário logado:', user.email);
}
```

### **Proteção de Rotas** (`src/components/auth/PrivateRoute.tsx`)

Componente que protege rotas autenticadas:

```typescript
<PrivateRoute>
  <Layout><Dashboard /></Layout>
</PrivateRoute>
```

**Comportamento**:
- Se `loading = true`: Mostra loading
- Se `user = null`: Redireciona para `/login`
- Se `user = autenticado`: Renderiza o componente

### **Estrutura de Rotas** (`src/App.tsx`)

```typescript
<AuthProvider>
  <Routes>
    {/* Rotas públicas */}
    <Route path="/login" element={<Login />} />
    <Route path="/esqueci-senha" element={<EsqueciSenha />} />

    {/* Rotas protegidas */}
    <Route path="/" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
    // ... outras rotas protegidas
  </Routes>
</AuthProvider>
```

---

## 🎨 Componentes Criados

### 1. **Login.tsx** (`src/pages/Login.tsx`)
- Formulário de login com validação
- Integração com `signIn` do Supabase
- Redirect automático após login
- Link para "Esqueci a senha"

### 2. **EsqueciSenha.tsx** (`src/pages/EsqueciSenha.tsx`)
- Formulário de recuperação de senha
- Envio de email via `resetPassword`
- Tela de confirmação após envio
- Branding Pipicos Festas

### 3. **PrivateRoute.tsx** (`src/components/auth/PrivateRoute.tsx`)
- HOC para proteção de rotas
- Loading state integrado
- Preserva URL para redirect

### 4. **AuthContext.tsx** (`src/contexts/AuthContext.tsx`)
- Gerenciamento de estado global de autenticação
- Integração com Supabase Auth
- Notificações toast automáticas

---

## 🔒 Segurança

### **Row Level Security (RLS) - Supabase**

Para proteger os dados, configure políticas RLS no Supabase:

```sql
-- Exemplo: Apenas usuários autenticados podem ver agendamentos
CREATE POLICY "Usuários autenticados podem ver agendamentos"
ON agendamentos FOR SELECT
TO authenticated
USING (true);

-- Exemplo: Apenas o próprio usuário pode ver seus dados
CREATE POLICY "Usuários veem apenas seus dados"
ON agendamentos FOR SELECT
TO authenticated
USING (auth.uid() = usuario_criacao);
```

### **Boas Práticas Implementadas**
- ✅ Senhas nunca armazenadas no frontend
- ✅ Tokens gerenciados automaticamente pelo Supabase
- ✅ HTTPS obrigatório em produção
- ✅ Sessões com timeout automático
- ✅ Logout limpa completamente a sessão

---

## 🧪 Testando a Autenticação

### **1. Criar Usuário de Teste**

Via Supabase Dashboard:
1. Acesse **Authentication** → **Users**
2. Clique em "Add user" → "Create new user"
3. Digite email e senha
4. Clique em "Create user"

Via código (se habilitado):
```typescript
const { signUp } = useAuth();
await signUp('teste@pipicos.com', 'senha123');
```

### **2. Testar Fluxo Completo**

```bash
# 1. Acesse http://localhost:3000
# → Deve redirecionar para /login

# 2. Faça login com credenciais válidas
# → Deve redirecionar para /

# 3. Clique em "Sair"
# → Deve redirecionar para /login

# 4. Tente acessar http://localhost:3000/clientes sem estar logado
# → Deve redirecionar para /login

# 5. Faça login novamente
# → Deve redirecionar para /clientes (página que tentou acessar)
```

---

## 📋 Checklist de Implementação

- [x] Contexto de autenticação (AuthContext)
- [x] Hook useAuth
- [x] Proteção de rotas (PrivateRoute)
- [x] Tela de Login integrada com Supabase
- [x] Tela "Esqueci a Senha"
- [x] Logout funcional no Header
- [x] Persistência de sessão
- [x] Redirect após login
- [x] Loading states
- [x] Notificações toast
- [x] Tratamento de erros
- [x] Branding Pipicos Festas em todas as telas

---

## 🐛 Troubleshooting

### **Problema: "Faltam as variáveis de ambiente do Supabase"**
**Solução**: Crie um arquivo `.env` na raiz do projeto com:
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-aqui
```

### **Problema: Não recebo email de recuperação de senha**
**Soluções**:
1. Verifique a pasta de spam
2. No Supabase Dashboard, vá em **Authentication** → **Email Templates** e configure
3. Certifique-se de que o email está confirmado no Supabase

### **Problema: Loop infinito de redirect**
**Solução**: Limpe o localStorage e sessão:
```javascript
localStorage.clear();
// Depois faça logout no Supabase Dashboard
```

### **Problema: "User não está definido"**
**Solução**: O componente está renderizando antes do AuthContext carregar. Use:
```typescript
const { user, loading } = useAuth();

if (loading) return <Loading />;
if (!user) return null;

// Resto do componente...
```

---

## 📚 Recursos Adicionais

- [Documentação Supabase Auth](https://supabase.com/docs/guides/auth)
- [Guia de Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Email Templates Supabase](https://supabase.com/docs/guides/auth/auth-email-templates)

---

## 👥 Próximos Passos (Opcionais)

- [ ] Login com Google (OAuth)
- [ ] Login com Facebook (OAuth)
- [ ] Autenticação de dois fatores (2FA)
- [ ] Tela de perfil de usuário
- [ ] Gerenciamento de permissões/roles
- [ ] Logs de auditoria de login
- [ ] Página "Reset Password" customizada

---

**Documentação criada por**: Claude Code
**Data**: Novembro 2025
**Versão**: 1.0
