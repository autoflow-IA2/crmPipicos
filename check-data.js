import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gjqkkiuqryhhobmcevuo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqcWtraXVxcnloaG9ibWNldnVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NzI1NjUsImV4cCI6MjA3ODU0ODU2NX0.-sCj_ojV9nIyNhEcLOcQftA-oN4P9ybcVziA0fT_Q28';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkData() {
  console.log('📊 Verificando brinquedos no banco de dados...\n');

  try {
    // Buscar todos os brinquedos
    const { data: brinquedos, error } = await supabase
      .from('brinquedos')
      .select('*')
      .order('categoria', { ascending: true });

    if (error) {
      console.log('❌ Erro ao buscar brinquedos:', error.message);
      return;
    }

    if (!brinquedos || brinquedos.length === 0) {
      console.log('⚠️  Nenhum brinquedo encontrado no banco de dados.');
      console.log('   Certifique-se de executar o arquivo supabase/import-brinquedos.sql');
      return;
    }

    console.log(`✅ Total de brinquedos: ${brinquedos.length}`);
    console.log(`📦 Total de unidades: ${brinquedos.reduce((acc, b) => acc + b.quantidade_estoque, 0)}\n`);

    // Agrupar por categoria
    const porCategoria = brinquedos.reduce((acc, brinquedo) => {
      const cat = brinquedo.categoria || 'Sem Categoria';
      if (!acc[cat]) {
        acc[cat] = { quantidade: 0, unidades: 0, itens: [] };
      }
      acc[cat].quantidade++;
      acc[cat].unidades += brinquedo.quantidade_estoque;
      acc[cat].itens.push(brinquedo.nome);
      return acc;
    }, {});

    console.log('📋 Brinquedos por Categoria:\n');
    Object.entries(porCategoria).forEach(([categoria, info]) => {
      console.log(`🎪 ${categoria}`);
      console.log(`   Tipos: ${info.quantidade} | Unidades: ${info.unidades}`);
      info.itens.forEach(nome => {
        const brinquedo = brinquedos.find(b => b.nome === nome);
        console.log(`   - ${nome} (${brinquedo.quantidade_estoque}x) - R$ ${brinquedo.valor_locacao?.toFixed(2)}`);
      });
      console.log('');
    });

    console.log('🎉 Dados importados com sucesso!');
    console.log('   Acesse http://localhost:3002/estoque para visualizar\n');

  } catch (err) {
    console.log('❌ Erro:', err.message);
  }
}

checkData();
