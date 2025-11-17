# Instruções para Configurar o Banco de Dados

## O banco de dados está acessível, mas precisa de configuração

As políticas de segurança (RLS) do Supabase estão bloqueando a inserção de dados.
Para resolver, siga os passos abaixo:

## Passo a Passo

### 1. Acesse o Supabase Dashboard
- Acesse: https://supabase.com/dashboard
- Faça login com sua conta
- Selecione o projeto: **gjqkkiuqryhhobmcevuo**

### 2. Abra o SQL Editor
- No menu lateral esquerdo, clique em **SQL Editor** (ícone de código)
- Clique no botão **+ New query** para criar uma nova consulta

### 3. Execute o Script Completo
- Abra o arquivo: `supabase/setup-completo.sql`
- **Copie TODO o conteúdo** do arquivo
- **Cole** no editor SQL do Supabase
- Clique no botão **Run** (▶️) no canto inferior direito

### 4. Verifique a Execução
Você deverá ver duas tabelas de resultado:

**Tabela 1 - Por Categoria:**
```
categoria              | quantidade_tipos | total_unidades | valor_total_estoque
----------------------|------------------|----------------|--------------------
Alimentação           | 2                | 4              | ...
Baby                  | 1                | 3              | ...
Camas Elásticas       | 3                | 15             | ...
...
```

**Tabela 2 - Resumo:**
```
resultado                                    | unidades
--------------------------------------------|------------------------
✅ Total de brinquedos importados: 22 tipos | 📦 Total de unidades: 48
```

### 5. Confirme a Importação
Após executar o script, volte ao terminal e execute:

```bash
node check-data.js
```

Você deverá ver todos os 22 brinquedos listados por categoria.

## O que o script faz?

1. **Corrige as políticas de RLS** - Permite leitura e escrita de dados
2. **Importa 22 tipos de brinquedos** - Com 48 unidades no total
3. **Verifica a importação** - Mostra um resumo dos dados

## Próximos Passos

Após a importação bem-sucedida:

1. Execute `npm run dev` para iniciar a aplicação
2. Acesse http://localhost:3002
3. Navegue até a página **Estoque** para ver os brinquedos
4. Comece a criar agendamentos!

## Problemas?

Se após executar o script você ainda tiver problemas:

1. Verifique se você está no projeto correto no Supabase
2. Certifique-se de que copiou TODO o conteúdo do arquivo
3. Verifique se há mensagens de erro no SQL Editor
4. Execute `node check-data.js` novamente para confirmar

---

**Arquivo do script:** `C:\agendamento_ppc\supabase\setup-completo.sql`
