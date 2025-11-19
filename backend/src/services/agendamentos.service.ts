import { getSupabase } from '../config/supabase.config';
import type {
  Agendamento,
  CreateAgendamentoDTO,
  AgendamentoFilters,
} from '../types/agendamento.types';

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
