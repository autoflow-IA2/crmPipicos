import { getSupabase } from '../config/supabase.config';
import {
  DisponibilidadeRequest,
  DisponibilidadeResponse,
  VerificarMultiplosRequest,
  DisponibilidadeMultiplosResponse,
  DisponibilidadePeriodoRequest,
  DisponibilidadePeriodoItem,
  Conflito,
} from '../types/inventario.types';

/**
 * Serviço de gestão de inventário e disponibilidade
 * Calcula disponibilidade real baseado em reservas ativas
 */
class InventarioService {
  /**
   * Status de agendamento que bloqueiam o inventário
   */
  private readonly STATUS_BLOQUEANTES = ['pendente', 'confirmado', 'em_preparacao', 'entregue'];

  /**
   * Normaliza o nome do brinquedo removendo textos descritivos extras
   * Exemplos:
   * - "Fábrica de Algodão Doce (materiais inclusos) - 3hrs" → "ALGODÃO DOCE"
   * - "Máquina de Pula Pula" → "PULA PULA"
   * - "Cama Elástica Pink" → "CAMA ELÁSTICA ROSA"
   */
  private normalizarNomeBrinquedo(nome: string): string {
    let normalizado = nome;

    // Remove conteúdo entre parênteses: (materiais e monitor inclusos)
    normalizado = normalizado.replace(/\s*\([^)]*\)\s*/g, ' ');

    // Remove durações de tempo: - 3hrs, - 2h, -3h
    normalizado = normalizado.replace(/\s*-\s*\d+\s*hrs?\s*/gi, ' ');

    // Remove prefixos comuns
    const prefixosRemover = [
      'Fábrica de ',
      'Máquina de ',
      'Kit de ',
      'Conjunto de ',
      'Mesa de ',
      'Jogo de ',
    ];

    for (const prefixo of prefixosRemover) {
      const regex = new RegExp(`^${prefixo}`, 'i');
      normalizado = normalizado.replace(regex, '');
    }

    // Substituir sinônimos e variações comuns (case-insensitive)
    const sinonimos: Record<string, string> = {
      'pink': 'ROSA',
      'roxinho': 'ROXO',
      'pequeno': 'PEQUENA',
      'grande': 'GRANDE',
      'médio': 'MÉDIA',
      'medio': 'MÉDIA',
      'baby': 'BABY',
      'inflavel': 'INFLÁVEL',
      'elastica': 'ELÁSTICA',
      'piscina': 'PISCINA',
      'futebol': 'FUTEBOL',
      'sabao': 'SABÃO',
      'algodao': 'ALGODÃO',
      'pipoca': 'PIPOCA',
    };

    // Converte para uppercase primeiro
    normalizado = normalizado.toUpperCase();

    // Aplica substituições de sinônimos
    for (const [variacao, padrao] of Object.entries(sinonimos)) {
      const regex = new RegExp(`\\b${variacao.toUpperCase()}\\b`, 'gi');
      normalizado = normalizado.replace(regex, padrao);
    }

    // Remove espaços múltiplos e trim
    normalizado = normalizado.replace(/\s+/g, ' ').trim();

    return normalizado;
  }

  /**
   * Verifica se dois períodos de tempo se sobrepõem
   */
  private horariosSesobrepõem(
    inicio1: string,
    fim1: string,
    inicio2: string,
    fim2: string
  ): boolean {
    // Converte strings HH:mm para minutos desde meia-noite
    const toMinutes = (time: string): number => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const inicio1Min = toMinutes(inicio1);
    const fim1Min = toMinutes(fim1);
    const inicio2Min = toMinutes(inicio2);
    const fim2Min = toMinutes(fim2);

    // Verifica sobreposição: (StartA < EndB) and (EndA > StartB)
    return inicio1Min < fim2Min && fim1Min > inicio2Min;
  }

  /**
   * Verifica disponibilidade de um brinquedo específico para uma data/horário
   */
  async verificarDisponibilidade(
    request: DisponibilidadeRequest
  ): Promise<DisponibilidadeResponse> {
    const {
      brinquedo_nome,
      data_evento,
      hora_inicio,
      hora_fim,
      quantidade_desejada,
      excludeAgendamentoId,
    } = request;

    // Normalizar o nome do brinquedo para busca mais flexível
    const nomeNormalizado = this.normalizarNomeBrinquedo(brinquedo_nome);

    console.log(`[InventarioService] Buscando brinquedo:`, {
      original: brinquedo_nome,
      normalizado: nomeNormalizado,
    });

    // 1. Buscar informações do brinquedo (case-insensitive com wildcards)
    const supabase = getSupabase();
    let { data: brinquedos, error: brinquedoError } = await supabase
      .from('brinquedos')
      .select('id, nome, quantidade_estoque, status')
      .ilike('nome', `%${nomeNormalizado}%`);

    // Se não encontrar com nome normalizado, tentar com o nome original
    if ((!brinquedos || brinquedos.length === 0) && nomeNormalizado !== brinquedo_nome.toUpperCase()) {
      console.log(`[InventarioService] Tentando com nome original...`);
      const resultado = await supabase
        .from('brinquedos')
        .select('id, nome, quantidade_estoque, status')
        .ilike('nome', `%${brinquedo_nome}%`);

      brinquedos = resultado.data;
      brinquedoError = resultado.error;
    }

    // Se ainda não encontrar, tentar busca por palavras-chave principais
    if (!brinquedos || brinquedos.length === 0) {
      console.log(`[InventarioService] Tentando busca por palavras-chave...`);

      // Extrair palavras-chave (palavras com 4+ caracteres)
      const palavrasChave = nomeNormalizado
        .split(/\s+/)
        .filter(palavra => palavra.length >= 4 && !['PARA', 'COM', 'SEM'].includes(palavra));

      if (palavrasChave.length > 0) {
        // Buscar todos os brinquedos e filtrar por palavras-chave
        const { data: todosBrinquedos } = await supabase
          .from('brinquedos')
          .select('id, nome, quantidade_estoque, status');

        if (todosBrinquedos) {
          brinquedos = todosBrinquedos.filter(b => {
            const nomeDb = b.nome.toUpperCase();
            // Brinquedo deve conter pelo menos 50% das palavras-chave
            const matches = palavrasChave.filter(palavra => nomeDb.includes(palavra));
            return matches.length >= Math.ceil(palavrasChave.length * 0.5);
          });

          if (brinquedos.length > 0) {
            console.log(`[InventarioService] Encontrado por palavras-chave: ${brinquedos[0].nome}`);
          }
        }
      }
    }

    if (brinquedoError) {
      throw new Error(`Erro ao buscar brinquedo: ${brinquedoError.message}`);
    }

    if (!brinquedos || brinquedos.length === 0) {
      console.error(`[InventarioService] Brinquedo não encontrado:`, {
        original: brinquedo_nome,
        normalizado: nomeNormalizado,
      });
      throw new Error(
        `Brinquedo não encontrado: "${brinquedo_nome}" (normalizado: "${nomeNormalizado}")`
      );
    }

    console.log(`[InventarioService] Brinquedo encontrado: ${brinquedos[0].nome}`);

    // Verificar duplicatas
    if (brinquedos.length > 1) {
      const nomes = brinquedos.map(b => b.nome).join('", "');
      throw new Error(
        `Encontrados ${brinquedos.length} brinquedos com nomes similares: "${nomes}". ` +
        `Por favor, seja mais específico com o nome.`
      );
    }

    const brinquedo = brinquedos[0];

    // Verifica se o brinquedo está disponível para locação
    if (brinquedo.status !== 'disponivel') {
      return {
        nome: brinquedo.nome,
        quantidade_total: brinquedo.quantidade_estoque,
        quantidade_reservada: brinquedo.quantidade_estoque, // Todo estoque bloqueado
        quantidade_disponivel: 0,
        disponivel: false,
        conflitos: [],
      };
    }

    // 2. Buscar agendamentos que podem conflitar
    let query = supabase
      .from('agendamentos')
      .select('id, cliente_nome, data_evento, hora_inicio, hora_fim, brinquedos_selecionados, status')
      .eq('data_evento', data_evento)
      .in('status', this.STATUS_BLOQUEANTES);

    // Excluir agendamento atual (para edição)
    if (excludeAgendamentoId) {
      query = query.neq('id', excludeAgendamentoId);
    }

    const { data: agendamentos, error: agendamentosError } = await query;

    if (agendamentosError) {
      throw new Error(`Erro ao buscar agendamentos: ${agendamentosError.message}`);
    }

    // 3. Calcular quantidade reservada e identificar conflitos
    let quantidadeReservada = 0;
    const conflitos: Conflito[] = [];

    if (agendamentos && agendamentos.length > 0) {
      for (const agendamento of agendamentos) {
        // Verificar se os horários se sobrepõem
        const horariosConflitam = this.horariosSesobrepõem(
          hora_inicio,
          hora_fim,
          agendamento.hora_inicio,
          agendamento.hora_fim
        );

        if (horariosConflitam && agendamento.brinquedos_selecionados) {
          // Parsear JSONB e procurar o brinquedo específico
          const brinquedosSelecionados = agendamento.brinquedos_selecionados as Array<{
            nome: string;
            quantidade: number;
          }>;

          const itemReservado = brinquedosSelecionados.find(
            (item) => item.nome.toLowerCase() === brinquedo.nome.toLowerCase()
          );

          if (itemReservado && itemReservado.quantidade > 0) {
            quantidadeReservada += itemReservado.quantidade;

            conflitos.push({
              agendamento_id: agendamento.id,
              cliente_nome: agendamento.cliente_nome,
              quantidade_reservada: itemReservado.quantidade,
              data_evento: agendamento.data_evento,
              hora_inicio: agendamento.hora_inicio,
              hora_fim: agendamento.hora_fim,
              status: agendamento.status,
            });
          }
        }
      }
    }

    // 4. Calcular disponibilidade
    const quantidadeDisponivel = brinquedo.quantidade_estoque - quantidadeReservada;
    const disponivel = quantidadeDisponivel >= quantidade_desejada;

    return {
      nome: brinquedo.nome,
      quantidade_total: brinquedo.quantidade_estoque,
      quantidade_reservada: quantidadeReservada,
      quantidade_disponivel: quantidadeDisponivel,
      disponivel,
      conflitos,
    };
  }

  /**
   * Verifica disponibilidade de múltiplos itens de uma vez
   */
  async verificarDisponibilidadeMultiplos(
    request: VerificarMultiplosRequest
  ): Promise<DisponibilidadeMultiplosResponse> {
    const { items, data_evento, hora_inicio, hora_fim, excludeAgendamentoId } = request;

    const resultados: DisponibilidadeResponse[] = [];

    // Verificar cada item
    for (const item of items) {
      const resultado = await this.verificarDisponibilidade({
        brinquedo_nome: item.brinquedo_nome,
        quantidade_desejada: item.quantidade_desejada,
        data_evento,
        hora_inicio,
        hora_fim,
        excludeAgendamentoId,
      });

      resultados.push(resultado);
    }

    // Verificar se todos estão disponíveis
    const todosDisponiveis = resultados.every((r) => r.disponivel);

    return {
      todos_disponiveis: todosDisponiveis,
      items: resultados,
    };
  }

  /**
   * Retorna disponibilidade de itens em um período (para visualização em calendário)
   */
  async calcularDisponibilidadePeriodo(
    request: DisponibilidadePeriodoRequest
  ): Promise<DisponibilidadePeriodoItem[]> {
    const { data_inicio, data_fim, brinquedo_nome } = request;

    // Buscar todos os agendamentos no período
    const supabase = getSupabase();
    let query = supabase
      .from('agendamentos')
      .select('id, cliente_nome, data_evento, hora_inicio, hora_fim, brinquedos_selecionados, status')
      .gte('data_evento', data_inicio)
      .lte('data_evento', data_fim)
      .in('status', this.STATUS_BLOQUEANTES)
      .order('data_evento', { ascending: true });

    const { data: agendamentos, error: agendamentosError } = await query;

    if (agendamentosError) {
      throw new Error(`Erro ao buscar agendamentos: ${agendamentosError.message}`);
    }

    // Buscar brinquedos
    let brinquedosQuery = supabase.from('brinquedos').select('id, nome, quantidade_estoque, status');

    if (brinquedo_nome) {
      brinquedosQuery = brinquedosQuery.ilike('nome', `%${brinquedo_nome}%`);
    }

    const { data: brinquedos, error: brinquedosError } = await brinquedosQuery;

    if (brinquedosError) {
      throw new Error(`Erro ao buscar brinquedos: ${brinquedosError.message}`);
    }

    // Agrupar por data e brinquedo
    const resultado: DisponibilidadePeriodoItem[] = [];

    // Gerar todas as datas no período
    const datas = this.gerarDatasNoPeriodo(data_inicio, data_fim);

    for (const data of datas) {
      for (const brinquedo of brinquedos || []) {
        // Filtrar agendamentos desta data
        const agendamentosData = agendamentos?.filter((a) => a.data_evento === data) || [];

        let quantidadeReservada = 0;
        const agendamentosItem: Array<{
          agendamento_id: string;
          cliente_nome: string;
          quantidade: number;
          hora_inicio: string;
          hora_fim: string;
          status: string;
        }> = [];

        // Calcular reservas para este brinquedo
        for (const agendamento of agendamentosData) {
          if (agendamento.brinquedos_selecionados) {
            const brinquedosSelecionados = agendamento.brinquedos_selecionados as Array<{
              nome: string;
              quantidade: number;
            }>;

            const itemReservado = brinquedosSelecionados.find(
              (i) => i.nome.toLowerCase() === brinquedo.nome.toLowerCase()
            );

            if (itemReservado && itemReservado.quantidade > 0) {
              quantidadeReservada += itemReservado.quantidade;

              agendamentosItem.push({
                agendamento_id: agendamento.id,
                cliente_nome: agendamento.cliente_nome,
                quantidade: itemReservado.quantidade,
                hora_inicio: agendamento.hora_inicio,
                hora_fim: agendamento.hora_fim,
                status: agendamento.status,
              });
            }
          }
        }

        // Só adicionar se houver alguma reserva ou se filtrou por brinquedo específico
        if (quantidadeReservada > 0 || brinquedo_nome) {
          resultado.push({
            data,
            nome: brinquedo.nome,
            quantidade_total: brinquedo.quantidade_estoque,
            quantidade_reservada: quantidadeReservada,
            quantidade_disponivel: brinquedo.quantidade_estoque - quantidadeReservada,
            agendamentos: agendamentosItem,
          });
        }
      }
    }

    return resultado;
  }

  /**
   * Gera array de datas entre data_inicio e data_fim
   */
  private gerarDatasNoPeriodo(dataInicio: string, dataFim: string): string[] {
    const datas: string[] = [];
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);

    const atual = new Date(inicio);
    while (atual <= fim) {
      datas.push(atual.toISOString().split('T')[0]);
      atual.setDate(atual.getDate() + 1);
    }

    return datas;
  }

  /**
   * Finaliza automaticamente eventos passados
   * (Deve ser chamado por cron job ou manualmente)
   */
  async finalizarEventosPassados(): Promise<{ finalizados: number; ids: string[] }> {
    const hoje = new Date();
    // Eventos que já passaram mais de 1 dia (para garantir devolução)
    const dataLimite = new Date(hoje);
    dataLimite.setDate(dataLimite.getDate() - 1);
    const dataLimiteStr = dataLimite.toISOString().split('T')[0];

    // Buscar eventos entregues ou em preparação que já passaram
    const supabase = getSupabase();
    const { data: agendamentos, error: selectError } = await supabase
      .from('agendamentos')
      .select('id')
      .in('status', ['entregue', 'em_preparacao'])
      .lt('data_evento', dataLimiteStr);

    if (selectError) {
      throw new Error(`Erro ao buscar eventos passados: ${selectError.message}`);
    }

    if (!agendamentos || agendamentos.length === 0) {
      return { finalizados: 0, ids: [] };
    }

    const ids = agendamentos.map((a) => a.id);

    // Atualizar status para finalizado
    const { error: updateError } = await supabase
      .from('agendamentos')
      .update({ status: 'finalizado', updated_at: new Date().toISOString() })
      .in('id', ids);

    if (updateError) {
      throw new Error(`Erro ao finalizar eventos: ${updateError.message}`);
    }

    return { finalizados: ids.length, ids };
  }
}

export default new InventarioService();
