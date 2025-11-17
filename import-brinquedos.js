import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gjqkkiuqryhhobmcevuo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqcWtraXVxcnloaG9ibWNldnVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NzI1NjUsImV4cCI6MjA3ODU0ODU2NX0.-sCj_ojV9nIyNhEcLOcQftA-oN4P9ybcVziA0fT_Q28';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const brinquedos = [
  {
    nome: 'TOTÓ MADEIRA',
    descricao: 'Mesa de pebolim em madeira. Não requer monitor para eventos privados (R$ 210). Evento público: R$ 270.',
    categoria: 'Jogos de Mesa',
    valor_locacao: 210.00,
    quantidade_estoque: 1,
    status: 'disponivel'
  },
  {
    nome: 'TOTÓ DESMONTÁVEL',
    descricao: 'Mesa de pebolim desmontável. Não requer monitor para eventos privados (R$ 210). Evento público: R$ 270.',
    categoria: 'Jogos de Mesa',
    valor_locacao: 210.00,
    quantidade_estoque: 2,
    status: 'disponivel'
  },
  {
    nome: 'AIR GAME - MESA DE DISCO - AERO HOCKEY',
    descricao: 'Mesa de Air Hockey. Não requer monitor para eventos privados (R$ 200). Evento público: R$ 250.',
    categoria: 'Jogos de Mesa',
    valor_locacao: 200.00,
    quantidade_estoque: 3,
    status: 'disponivel'
  },
  {
    nome: 'KIT BABY',
    descricao: 'Kit completo para bebês e crianças pequenas. Não requer monitor para eventos privados (R$ 240). Evento público: R$ 280.',
    categoria: 'Baby',
    valor_locacao: 240.00,
    quantidade_estoque: 3,
    status: 'disponivel'
  },
  {
    nome: 'CAMA ELÁSTICA PEQUENA',
    descricao: 'Cama elástica pequena com rede de proteção. Não requer monitor para eventos privados (R$ 150). Evento público com monitor: R$ 290.',
    categoria: 'Camas Elásticas',
    valor_locacao: 150.00,
    quantidade_estoque: 8,
    status: 'disponivel'
  },
  {
    nome: 'CAMA ELÁSTICA ROSA PEQUENA',
    descricao: 'Cama elástica pequena rosa com rede de proteção. Não requer monitor para eventos privados (R$ 150). Evento público com monitor: R$ 290.',
    categoria: 'Camas Elásticas',
    valor_locacao: 150.00,
    quantidade_estoque: 1,
    status: 'disponivel'
  },
  {
    nome: 'CAMA ELÁSTICA GRANDE',
    descricao: 'Cama elástica grande com rede de proteção. Não requer monitor para eventos privados (R$ 180). Evento público com monitor: R$ 320.',
    categoria: 'Camas Elásticas',
    valor_locacao: 180.00,
    quantidade_estoque: 6,
    status: 'disponivel'
  },
  {
    nome: 'PISCINA DE BOLINHAS PEQUENA',
    descricao: 'Piscina de bolinhas pequena. Não requer monitor para eventos privados (R$ 150). Evento público com monitor: R$ 320.',
    categoria: 'Piscina de Bolinhas',
    valor_locacao: 150.00,
    quantidade_estoque: 6,
    status: 'disponivel'
  },
  {
    nome: 'PISCINA DE BOLINHAS GRANDE',
    descricao: 'Piscina de bolinhas grande. Não requer monitor para eventos privados (R$ 230). Evento público com monitor: R$ 420.',
    categoria: 'Piscina de Bolinhas',
    valor_locacao: 230.00,
    quantidade_estoque: 2,
    status: 'disponivel'
  },
  {
    nome: 'CARRINHO DE PIPOCA - PIPOQUEIRA',
    descricao: 'Carrinho profissional de pipoca. Requer monitor. Evento privado: R$ 380. Evento público: R$ 430.',
    categoria: 'Alimentação',
    valor_locacao: 380.00,
    quantidade_estoque: 2,
    status: 'disponivel'
  },
  {
    nome: 'ALGODÃO DOCE',
    descricao: 'Máquina de algodão doce profissional. Requer monitor. Evento privado: R$ 290. Evento público: R$ 350.',
    categoria: 'Alimentação',
    valor_locacao: 290.00,
    quantidade_estoque: 2,
    status: 'disponivel'
  },
  {
    nome: 'CASTELINHO - PULA PULA INFLÁVEL',
    descricao: 'Pula pula inflável temático de castelo. Não requer monitor para eventos privados (R$ 220). Evento público com monitor: R$ 400.',
    categoria: 'Infláveis',
    valor_locacao: 220.00,
    quantidade_estoque: 1,
    status: 'disponivel'
  },
  {
    nome: 'CASTELINHO BABY - PULA PULA INFLÁVEL',
    descricao: 'Pula pula inflável baby temático de castelo. Não requer monitor para eventos privados (R$ 200). Evento público com monitor: R$ 380.',
    categoria: 'Infláveis',
    valor_locacao: 200.00,
    quantidade_estoque: 1,
    status: 'disponivel'
  },
  {
    nome: 'TOBOGÃ ESCORREGADOR',
    descricao: 'Tobogã escorregador inflável grande. Requer monitor. Evento privado: R$ 520. Evento público: R$ 660.',
    categoria: 'Escorregadores',
    valor_locacao: 520.00,
    quantidade_estoque: 3,
    status: 'disponivel'
  },
  {
    nome: 'FUTEBOL DE SABÃO GRANDE',
    descricao: 'Futebol de sabão inflável tamanho grande. Requer monitor. Evento privado: R$ 750. Evento público: R$ 850.',
    categoria: 'Futebol de Sabão',
    valor_locacao: 750.00,
    quantidade_estoque: 2,
    status: 'disponivel'
  },
  {
    nome: 'FUTEBOL DE SABÃO MÉDIO - 3 em 1',
    descricao: 'Futebol de sabão médio 3 em 1 (vôlei, basquete e futebol). Requer monitor. Evento privado: R$ 650. Evento público: R$ 750.',
    categoria: 'Futebol de Sabão',
    valor_locacao: 650.00,
    quantidade_estoque: 1,
    status: 'disponivel'
  },
  {
    nome: 'GUERRA DE COTONETES',
    descricao: 'Arena inflável para guerra de cotonetes. Requer monitor. Evento privado: R$ 460. Evento público: R$ 530.',
    categoria: 'Interativos',
    valor_locacao: 460.00,
    quantidade_estoque: 1,
    status: 'disponivel'
  },
  {
    nome: 'GIRAFINHA 3 EM 1 INFLÁVEL',
    descricao: 'Inflável 3 em 1 com pula pula, piscina de bolinhas e escorregador. Requer monitor. Evento privado: R$ 460. Evento público: R$ 580.',
    categoria: 'Infláveis',
    valor_locacao: 460.00,
    quantidade_estoque: 1,
    status: 'disponivel'
  },
  {
    nome: 'PATRULHA CANINA 3 EM 1 INFLÁVEL',
    descricao: 'Inflável temático Patrulha Canina 3 em 1 com pula pula, piscina de bolinhas e escorregador. Requer monitor. Evento privado: R$ 460. Evento público: R$ 580.',
    categoria: 'Infláveis',
    valor_locacao: 460.00,
    quantidade_estoque: 1,
    status: 'disponivel'
  },
  {
    nome: 'CROCODILO INFLÁVEL',
    descricao: 'Pula pula inflável temático de crocodilo com escorregador. Não requer monitor para eventos privados (R$ 340). Evento público com monitor: R$ 520.',
    categoria: 'Infláveis',
    valor_locacao: 340.00,
    quantidade_estoque: 1,
    status: 'disponivel'
  },
  {
    nome: 'PULA PULA INFLÁVEL COM ESCORREGADOR',
    descricao: 'Pula pula inflável com escorregador (laranja ou azul). Não requer monitor para eventos privados (R$ 340). Evento público com monitor: R$ 490.',
    categoria: 'Infláveis',
    valor_locacao: 340.00,
    quantidade_estoque: 2,
    status: 'disponivel'
  },
  {
    nome: 'PULA PULA INFLÁVEL 3 EM 1 - ROXINHO',
    descricao: 'Pula pula inflável roxo 3 em 1. Não requer monitor para eventos privados (R$ 340). Evento público com monitor: R$ 520.',
    categoria: 'Infláveis',
    valor_locacao: 340.00,
    quantidade_estoque: 1,
    status: 'disponivel'
  }
];

async function importBrinquedos() {
  console.log('🚀 Iniciando importação de brinquedos...\n');

  try {
    // Primeiro, limpar brinquedos existentes
    console.log('🧹 Limpando dados antigos...');
    const { error: deleteError } = await supabase
      .from('brinquedos')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Deletar todos

    if (deleteError) {
      console.log('⚠️  Aviso ao limpar dados:', deleteError.message);
    }

    // Inserir novos brinquedos
    console.log('📦 Inserindo brinquedos...');
    const { data, error } = await supabase
      .from('brinquedos')
      .insert(brinquedos)
      .select();

    if (error) {
      console.log('❌ Erro ao inserir brinquedos:', error.message);
      return;
    }

    console.log(`✅ ${data.length} brinquedos importados com sucesso!\n`);

    // Mostrar resumo por categoria
    const porCategoria = data.reduce((acc, brinquedo) => {
      const cat = brinquedo.categoria || 'Sem Categoria';
      if (!acc[cat]) {
        acc[cat] = { quantidade: 0, unidades: 0 };
      }
      acc[cat].quantidade++;
      acc[cat].unidades += brinquedo.quantidade_estoque;
      return acc;
    }, {});

    console.log('📊 Resumo por Categoria:\n');
    Object.entries(porCategoria).forEach(([categoria, info]) => {
      console.log(`  ${categoria}: ${info.quantidade} tipos, ${info.unidades} unidades`);
    });

    console.log('\n🎉 Importação concluída com sucesso!');
    console.log('   Execute "npm run dev" e acesse /estoque para visualizar\n');

  } catch (err) {
    console.log('❌ Erro:', err.message);
  }
}

importBrinquedos();
