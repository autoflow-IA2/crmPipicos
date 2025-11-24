// Script de teste para API de inventário
const API_URL = 'http://localhost:3001/api';
const API_KEY = 'tcU2bg7bIslW9KKMXGzw1kICdPRSRg-vaG8Xl2b9lfs';

async function testarAPI() {
  console.log('🧪 Testando API de Inventário\n');

  try {
    // Teste 1: Health Check
    console.log('1️⃣ Testando Health Check...');
    const healthResponse = await fetch(`${API_URL}/health`, {
      headers: { 'X-API-Key': API_KEY }
    });
    const healthData = await healthResponse.json();
    console.log('✅ Health Check:', healthData.message);
    console.log('');

    // Teste 2: Listar brinquedos disponíveis
    console.log('2️⃣ Listando brinquedos...');
    const brinquedosResponse = await fetch('https://gjqkkiuqryhhobmcevuo.supabase.co/rest/v1/brinquedos?select=*', {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqcWtraXVxcnloaG9ibWNldnVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NzI1NjUsImV4cCI6MjA3ODU0ODU2NX0.-sCj_ojV9nIyNhEcLOcQftA-oN4P9ybcVziA0fT_Q28',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqcWtraXVxcnloaG9ibWNldnVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NzI1NjUsImV4cCI6MjA3ODU0ODU2NX0.-sCj_ojV9nIyNhEcLOcQftA-oN4P9ybcVziA0fT_Q28'
      }
    });
    const brinquedos = await brinquedosResponse.json();

    if (brinquedos.length === 0) {
      console.log('⚠️ Nenhum brinquedo encontrado no banco. Pulando testes de disponibilidade.');
      return;
    }

    console.log(`✅ Encontrados ${brinquedos.length} brinquedos`);
    const primeiroBrinquedo = brinquedos[0];
    console.log(`   Usando: ${primeiroBrinquedo.nome}`);
    console.log(`   Estoque: ${primeiroBrinquedo.quantidade_estoque} unidades`);
    console.log('');

    // Teste 3: Verificar disponibilidade de um brinquedo
    console.log('3️⃣ Verificando disponibilidade para 2025-12-25...');
    const disponibilidadeRequest = {
      brinquedo_nome: primeiroBrinquedo.nome,
      data_evento: '2025-12-25',
      hora_inicio: '14:00',
      hora_fim: '18:00',
      quantidade_desejada: 1
    };

    const dispResponse = await fetch(`${API_URL}/inventario/verificar-disponibilidade`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY
      },
      body: JSON.stringify(disponibilidadeRequest)
    });

    if (!dispResponse.ok) {
      const error = await dispResponse.json();
      console.log('❌ Erro:', error);
      return;
    }

    const disponibilidade = await dispResponse.json();
    console.log('✅ Resultado da verificação:');
    console.log(`   - Brinquedo: ${disponibilidade.nome}`);
    console.log(`   - Quantidade Total: ${disponibilidade.quantidade_total}`);
    console.log(`   - Quantidade Reservada: ${disponibilidade.quantidade_reservada}`);
    console.log(`   - Quantidade Disponível: ${disponibilidade.quantidade_disponivel}`);
    console.log(`   - Disponível: ${disponibilidade.disponivel ? '✅ SIM' : '❌ NÃO'}`);

    if (disponibilidade.conflitos.length > 0) {
      console.log(`   - Conflitos encontrados: ${disponibilidade.conflitos.length}`);
      disponibilidade.conflitos.forEach((conflito, idx) => {
        console.log(`     ${idx + 1}. ${conflito.cliente_nome} - ${conflito.data_evento} (${conflito.hora_inicio}-${conflito.hora_fim})`);
      });
    } else {
      console.log('   - Sem conflitos ✅');
    }
    console.log('');

    // Teste 4: Verificar múltiplos itens
    if (brinquedos.length >= 2) {
      console.log('4️⃣ Verificando disponibilidade de múltiplos itens...');
      const multiplosRequest = {
        items: [
          { brinquedo_nome: brinquedos[0].nome, quantidade_desejada: 1 },
          { brinquedo_nome: brinquedos[1].nome, quantidade_desejada: 1 }
        ],
        data_evento: '2025-12-25',
        hora_inicio: '14:00',
        hora_fim: '18:00'
      };

      const multiplosResponse = await fetch(`${API_URL}/inventario/verificar-multiplos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_KEY
        },
        body: JSON.stringify(multiplosRequest)
      });

      const multiplosResult = await multiplosResponse.json();
      console.log(`✅ Todos disponíveis: ${multiplosResult.todos_disponiveis ? '✅ SIM' : '❌ NÃO'}`);
      multiplosResult.items.forEach(item => {
        console.log(`   - ${item.nome}: ${item.disponivel ? '✅' : '❌'} (${item.quantidade_disponivel}/${item.quantidade_total})`);
      });
      console.log('');
    }

    // Teste 5: Disponibilidade por período
    console.log('5️⃣ Consultando disponibilidade no período (próximos 7 dias)...');
    const hoje = new Date();
    const daquiASemana = new Date(hoje);
    daquiASemana.setDate(daquiASemana.getDate() + 7);

    const periodoResponse = await fetch(
      `${API_URL}/inventario/disponibilidade-periodo?data_inicio=${hoje.toISOString().split('T')[0]}&data_fim=${daquiASemana.toISOString().split('T')[0]}`,
      {
        headers: { 'X-API-Key': API_KEY }
      }
    );

    const periodoData = await periodoResponse.json();
    console.log(`✅ Encontrados ${periodoData.length} registros de disponibilidade`);
    if (periodoData.length > 0) {
      console.log('   Primeiros registros:');
      periodoData.slice(0, 3).forEach(item => {
        console.log(`   - ${item.data}: ${item.nome} (${item.quantidade_disponivel}/${item.quantidade_total} disponíveis)`);
      });
    }
    console.log('');

    console.log('🎉 Todos os testes concluídos com sucesso!');

  } catch (error) {
    console.error('❌ Erro durante os testes:', error.message);
    console.error(error);
  }
}

// Executar testes
testarAPI();
