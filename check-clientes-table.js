import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carregar variáveis de ambiente do arquivo .env
dotenv.config({ path: join(__dirname, '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('\n🔍 Verificando configuração do Supabase...\n');

if (!supabaseUrl) {
  console.log('❌ VITE_SUPABASE_URL não encontrada no arquivo .env');
  console.log('📝 Verifique se o arquivo .env existe e contém a URL do Supabase\n');
  process.exit(1);
}

if (!supabaseKey) {
  console.log('❌ VITE_SUPABASE_ANON_KEY não encontrada no arquivo .env');
  console.log('📝 Verifique se o arquivo .env existe e contém a chave anônima do Supabase\n');
  process.exit(1);
}

console.log('✅ Variáveis de ambiente encontradas');
console.log(`📍 URL: ${supabaseUrl}`);
console.log(`🔑 Key: ${supabaseKey.substring(0, 20)}...\n`);

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkClientesTable() {
  try {
    console.log('🔍 Verificando se a tabela "clientes" existe...\n');

    // Tentar fazer uma query simples na tabela
    const { data, error, count } = await supabase
      .from('clientes')
      .select('*', { count: 'exact', head: true });

    if (error) {
      if (error.code === '42P01') {
        console.log('❌ A tabela "clientes" NÃO existe no banco de dados!\n');
        console.log('📋 Para criar a tabela, siga estes passos:\n');
        console.log('1. Acesse: https://supabase.com/dashboard');
        console.log('2. Vá em SQL Editor → New query');
        console.log('3. Copie o conteúdo do arquivo: supabase/migrations/002_create_clientes.sql');
        console.log('4. Cole no editor e clique em RUN\n');
        console.log('📄 Ou consulte: INSTRUCOES_MIGRACAO_CLIENTES.md\n');
        return false;
      } else {
        console.log('❌ Erro ao verificar a tabela:', error.message);
        console.log('Código do erro:', error.code);
        console.log('Detalhes:', error.details, '\n');
        return false;
      }
    }

    console.log('✅ A tabela "clientes" EXISTE e está acessível!\n');
    console.log(`📊 Número de registros na tabela: ${count || 0}\n`);

    // Verificar estrutura da tabela
    const { data: sample, error: sampleError } = await supabase
      .from('clientes')
      .select('*')
      .limit(1);

    if (!sampleError) {
      if (sample && sample.length > 0) {
        console.log('📋 Estrutura da tabela (campos disponíveis):');
        Object.keys(sample[0]).forEach(field => {
          console.log(`   - ${field}`);
        });
        console.log('\n✅ Tabela pronta para uso!');
      } else {
        console.log('📋 Tabela existe mas está vazia (sem registros)');
        console.log('✅ Pronto para cadastrar clientes!\n');
      }
    }

    // Verificar se a tabela tem os campos esperados
    const expectedFields = ['id', 'nome', 'telefone', 'email', 'cpf_cnpj', 'ativo', 'created_at'];
    if (sample && sample.length > 0) {
      const missingFields = expectedFields.filter(field => !(field in sample[0]));
      if (missingFields.length > 0) {
        console.log('\n⚠️  Campos esperados ausentes:', missingFields.join(', '));
      } else {
        console.log('\n✅ Todos os campos principais estão presentes!');
      }
    }

    return true;

  } catch (error) {
    console.log('❌ Erro ao verificar a tabela:', error.message);
    console.log('\n🔧 Possíveis soluções:');
    console.log('1. Verifique se o arquivo .env está configurado corretamente');
    console.log('2. Verifique se a conexão com o Supabase está funcionando');
    console.log('3. Execute a migração SQL manualmente no Supabase Dashboard\n');
    return false;
  }
}

// Executar verificação
checkClientesTable().then(exists => {
  console.log('\n' + '='.repeat(60));
  if (exists) {
    console.log('🎉 STATUS: Tabela de clientes CONFIGURADA e FUNCIONANDO!');
    console.log('🚀 Você pode começar a usar o módulo de Gestão de Clientes!');
    console.log('\n📍 Acesse: http://localhost:3001/clientes');
  } else {
    console.log('⚠️  STATUS: Tabela de clientes NÃO encontrada');
    console.log('📝 Execute a migração SQL para criar a tabela');
  }
  console.log('='.repeat(60) + '\n');
  process.exit(exists ? 0 : 1);
});
