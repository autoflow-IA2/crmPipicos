import { getSupabase } from '../config/supabase.config';
import type {
  Agendamento,
  CreateAgendamentoDTO,
  AgendamentoFilters,
} from '../types/agendamento.types';
import inventarioService from './inventario.service';

export const agendamentosService = {
  // Listar todos os agendamentos com filtros opcionais
  async getAll(filters?: AgendamentoFilters) {
    const supabase = getSupabase();
    let query = supabase
      .from('agendamentos')
      .select('*');

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.data) {
      query = query.eq('data_evento', filters.data);
    }

    if (filters?.dataInicio) {
      query = query.gte('data_evento', filters.dataInicio);
    }

    if (filters?.dataFim) {
      query = query.lte('data_evento', filters.dataFim);
    }

    if (filters?.tipoServico) {
      query = query.eq('tipo_servico', filters.tipoServico);
    }

    if (filters?.cliente) {
      query = query.ilike('cliente_nome', `%${filters.cliente}%`);
    }

    query = query.order('data_evento', { ascending: true });

    const { data, error } = await query;

    if (error) throw error;
    return data as Agendamento[];
  },

  // Buscar por ID
  async getById(id: string) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('agendamentos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Agendamento | null;
  },

  // Criar agendamento
  async create(agendamento: CreateAgendamentoDTO) {
    const supabase = getSupabase();

    // Validar disponibilidade de brinquedos antes de criar
    if (agendamento.brinquedos_selecionados && Array.isArray(agendamento.brinquedos_selecionados)) {
      const items = agendamento.brinquedos_selecionados.map((item: any) => ({
        brinquedo_nome: item.nome,
        quantidade_desejada: item.quantidade,
      }));

      if (items.length > 0) {
        const disponibilidade = await inventarioService.verificarDisponibilidadeMultiplos({
          items,
          data_evento: agendamento.data_evento,
          hora_inicio: agendamento.hora_inicio,
          hora_fim: agendamento.hora_fim,
        });

        if (!disponibilidade.todos_disponiveis) {
          const itensIndisponiveis = disponibilidade.items
            .filter(item => !item.disponivel)
            .map(item => `${item.nome} (solicitado: ${items.find(i => i.brinquedo_nome === item.nome)?.quantidade_desejada}, disponível: ${item.quantidade_disponivel})`)
            .join(', ');

          throw new Error(`Itens indisponíveis para a data/horário selecionados: ${itensIndisponiveis}`);
        }
      }
    }

    const { data, error } = await supabase
      .from('agendamentos')
      .insert(agendamento)
      .select()
      .single();

    if (error) throw error;
    return data as Agendamento;
  },

  // Atualizar agendamento
  async update(id: string, updateData: Partial<Agendamento>) {
    const supabase = getSupabase();

    // Validar disponibilidade de brinquedos antes de atualizar
    // (se estiver alterando data, horário ou brinquedos)
    if (updateData.brinquedos_selecionados || updateData.data_evento || updateData.hora_inicio || updateData.hora_fim) {
      // Buscar dados atuais do agendamento
      const { data: agendamentoAtual } = await supabase
        .from('agendamentos')
        .select('*')
        .eq('id', id)
        .single();

      if (agendamentoAtual) {
        const brinquedos = updateData.brinquedos_selecionados || agendamentoAtual.brinquedos_selecionados;
        const dataEvento = updateData.data_evento || agendamentoAtual.data_evento;
        const horaInicio = updateData.hora_inicio || agendamentoAtual.hora_inicio;
        const horaFim = updateData.hora_fim || agendamentoAtual.hora_fim;

        if (brinquedos && Array.isArray(brinquedos)) {
          const items = brinquedos.map((item: any) => ({
            brinquedo_nome: item.nome,
            quantidade_desejada: item.quantidade,
          }));

          if (items.length > 0) {
            const disponibilidade = await inventarioService.verificarDisponibilidadeMultiplos({
              items,
              data_evento: dataEvento,
              hora_inicio: horaInicio,
              hora_fim: horaFim,
              excludeAgendamentoId: id, // Excluir o próprio agendamento
            });

            if (!disponibilidade.todos_disponiveis) {
              const itensIndisponiveis = disponibilidade.items
                .filter(item => !item.disponivel)
                .map(item => `${item.nome} (solicitado: ${items.find(i => i.brinquedo_nome === item.nome)?.quantidade_desejada}, disponível: ${item.quantidade_disponivel})`)
                .join(', ');

              throw new Error(`Itens indisponíveis para a data/horário selecionados: ${itensIndisponiveis}`);
            }
          }
        }
      }
    }

    const { data, error } = await supabase
      .from('agendamentos')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Agendamento;
  },

  // Atualizar status
  async updateStatus(id: string, status: string) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('agendamentos')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Agendamento;
  },

  // Deletar agendamento
  async delete(id: string) {
    const supabase = getSupabase();
    const { error } = await supabase.from('agendamentos').delete().eq('id', id);

    if (error) throw error;
  },

  // Verificar conflitos de horário
  async checkConflicts(dataEvento: string, horaInicio: string, horaFim: string, excludeId?: string) {
    const supabase = getSupabase();
    let query = supabase
      .from('agendamentos')
      .select('id, cliente_nome, data_evento, hora_inicio, hora_fim, tipo_servico')
      .eq('data_evento', dataEvento);

    // Verificar sobreposição de horários
    // Um conflito existe se:
    // - O novo evento começa durante um evento existente (horaInicio < hora_fim E horaInicio >= hora_inicio)
    // - O novo evento termina durante um evento existente (horaFim > hora_inicio E horaFim <= hora_fim)
    // - O novo evento engloba completamente um evento existente (horaInicio <= hora_inicio E horaFim >= hora_fim)

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Filtrar manualmente para verificar sobreposição de horários
    const conflitos = (data as Agendamento[]).filter(agendamento => {
      const inicioNovo = horaInicio;
      const fimNovo = horaFim;
      const inicioExistente = agendamento.hora_inicio;
      const fimExistente = agendamento.hora_fim;

      // Verifica se há sobreposição
      return (
        (inicioNovo < fimExistente && fimNovo > inicioExistente)
      );
    });

    return conflitos;
  },
};
