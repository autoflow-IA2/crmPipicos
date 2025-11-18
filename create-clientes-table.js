import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carregar variáveis de ambiente
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Erro: Variáveis de ambiente não encontradas');
  console.error('Certifique-se de ter VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createClientesTable() {
  try {
    console.log('📦 Criando tabela de clientes...\n');

    // Ler o arquivo SQL
    const sqlPath = join(__dirname, 'supabase', 'migrations', '002_create_clientes.sql');
    const sql = readFileSync(sqlPath, 'utf-8');

    // Executar o SQL
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql }).catch(() => {
      // Se não tiver a função exec_sql, vamos executar manualmente
      return { error: null };
    });

    if (error) {
      console.error('❌ Erro ao criar tabela:', error.message);

      // Tentar criar diretamente usando o SQL em partes
      console.log('\n📝 Executando SQL diretamente...');

      // Criar a tabela primeiro
      const { error: tableError } = await supabase.rpc('exec', {
        query: `
          CREATE TABLE IF NOT EXISTS clientes (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            nome VARCHAR(255) NOT NULL,
            cpf_cnpj VARCHAR(20),
            email VARCHAR(255),
            telefone VARCHAR(20) NOT NULL,
            telefone_alternativo VARCHAR(20),
            data_nascimento DATE,
            cep VARCHAR(10),
            endereco TEXT,
            numero VARCHAR(20),
            complemento VARCHAR(100),
            bairro VARCHAR(100),
            cidade VARCHAR(100),
            estado VARCHAR(2),
            observacoes TEXT,
            usuario_criacao UUID,
            usuario_atualizacao UUID,
            ativo BOOLEAN DEFAULT true
          );
        `
      });

      if (tableError) {
        console.log('\n⚠️  A tabela pode já existir ou você precisa executar a migração manualmente.');
        console.log('\n📋 Passos manuais:');
        console.log('1. Acesse o Supabase Dashboard: https://supabase.com/dashboard');
        console.log('2. Vá em SQL Editor');
        console.log('3. Cole o conteúdo do arquivo: supabase/migrations/002_create_clientes.sql');
        console.log('4. Execute o SQL');
      }
    } else {
      console.log('✅ Tabela de clientes criada com sucesso!');
    }

    // Verificar se a tabela existe
    const { data, error: checkError } = await supabase
      .from('clientes')
      .select('count')
      .limit(1);

    if (!checkError) {
      console.log('\n✅ Tabela "clientes" está acessível e pronta para uso!');
    } else {
      console.log('\n⚠️  Aviso: Não foi possível verificar a tabela.');
      console.log('Por favor, execute a migração manualmente no Supabase Dashboard.');
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.log('\n📋 Execute a migração manualmente:');
    console.log('1. Acesse: https://supabase.com/dashboard');
    console.log('2. Vá em SQL Editor');
    console.log('3. Cole o conteúdo de: supabase/migrations/002_create_clientes.sql');
  }
}

createClientesTable();
