# 📋 Instruções para Criar a Tabela de Clientes

Para ativar o módulo de Gestão de Clientes, você precisa executar a migração SQL no Supabase.

## 🚀 Passo a Passo

### 1. Acesse o Supabase Dashboard
- Vá para: https://supabase.com/dashboard
- Faça login na sua conta
- Selecione o projeto do CRM

### 2. Abra o SQL Editor
- No menu lateral, clique em **SQL Editor**
- Clique em **New query**

### 3. Execute a Migração
- Copie todo o conteúdo do arquivo: `supabase/migrations/002_create_clientes.sql`
- Cole no editor SQL
- Clique em **Run** ou pressione `Ctrl + Enter`

### 4. Verifique se a Tabela Foi Criada
- No menu lateral, clique em **Table Editor**
- Você deve ver a tabela **clientes** na lista

## ✅ O Que Será Criado

A migração cria:
- ✅ Tabela `clientes` com todos os campos necessários
- ✅ Índices para melhorar performance de buscas
- ✅ Trigger para atualizar `updated_at` automaticamente
- ✅ Políticas de segurança (RLS - Row Level Security)
- ✅ Comentários na tabela e colunas

## 📊 Estrutura da Tabela

```sql
clientes
├── id (UUID) - Chave primária
├── created_at - Data de criação
├── updated_at - Data da última atualização
├── nome (obrigatório) - Nome completo
├── cpf_cnpj - CPF ou CNPJ
├── email - E-mail
├── telefone (obrigatório) - Telefone principal
├── telefone_alternativo - Telefone secundário
├── data_nascimento - Data de nascimento
├── cep - CEP
├── endereco - Endereço completo
├── numero - Número
├── complemento - Complemento
├── bairro - Bairro
├── cidade - Cidade
├── estado - Estado (sigla)
├── observacoes - Observações gerais
├── ativo - Status do cliente (ativo/inativo)
└── usuario_criacao/usuario_atualizacao - Metadados
```

## 🔒 Segurança

A tabela vem com Row Level Security (RLS) habilitado:
- Apenas usuários autenticados podem acessar os dados
- Políticas para SELECT, INSERT, UPDATE e DELETE

## ⚠️ Problemas Comuns

### Erro: "relation clientes already exists"
- A tabela já foi criada anteriormente
- Você pode pular esta etapa

### Erro de permissão
- Certifique-se de estar logado com uma conta que tenha permissões de administrador no projeto

## 📞 Suporte

Em caso de dúvidas:
1. Verifique os logs de erro no Supabase
2. Consulte a documentação do Supabase: https://supabase.com/docs
3. Revise o arquivo de migração em: `supabase/migrations/002_create_clientes.sql`
