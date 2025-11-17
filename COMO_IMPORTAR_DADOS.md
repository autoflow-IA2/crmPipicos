# Como Importar os Brinquedos para o Supabase

## Passo a Passo

1. **Acesse seu projeto no Supabase**
   - Vá para https://supabase.com/dashboard
   - Selecione seu projeto: `gjqkkiuqryhhobmcevuo`

2. **Abra o SQL Editor**
   - No menu lateral, clique em **SQL Editor**
   - Clique em **New query** (+ Nova consulta)

3. **Execute o script de importação**
   - Abra o arquivo: `supabase/import-brinquedos.sql`
   - Copie todo o conteúdo
   - Cole no SQL Editor do Supabase
   - Clique em **Run** (▶️ Executar)

4. **Verifique a importação**
   - Você verá um resumo por categoria
   - Total de 22 brinquedos importados
   - 48 unidades no estoque

## Categorias Importadas

- **Jogos de Mesa**: 3 tipos (6 unidades)
- **Baby**: 1 tipo (3 unidades)
- **Camas Elásticas**: 3 tipos (15 unidades)
- **Piscina de Bolinhas**: 2 tipos (8 unidades)
- **Alimentação**: 2 tipos (4 unidades)
- **Infláveis**: 8 tipos (9 unidades)
- **Escorregadores**: 1 tipo (3 unidades)
- **Futebol de Sabão**: 2 tipos (3 unidades)
- **Interativos**: 1 tipo (1 unidade)

## Informações dos Preços

Cada brinquedo tem dois preços no sistema:
- **Valor de Locação (Privado)**: Preço base no campo `valor_locacao`
- **Valor Público**: Mencionado na descrição (geralmente mais alto)

## Próximos Passos

Após importar os brinquedos:

1. Execute `npm run dev` para iniciar a aplicação
2. Acesse http://localhost:3001
3. Navegue até a página de **Estoque** para ver os brinquedos
4. Comece a criar agendamentos usando os brinquedos cadastrados

## Observações

- Os preços estão em Reais (BRL)
- Monitor necessário está indicado na descrição
- Todos os brinquedos estão com status "disponivel"
- Você pode editar preços e quantidades diretamente no Supabase ou pela aplicação (quando implementado)
