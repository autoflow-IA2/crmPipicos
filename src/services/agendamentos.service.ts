import { supabase } from './supabase';
import type {
  Agendamento,
  CreateAgendamentoDTO,
} from '../types';

export const agendamentosService = {
  // Listar todos os agendamentos com filtros opcionais
  async getAll(filters?: {
    status?: string;
    dataInicio?: string;
    dataFim?: string;
    tipoServico?: string;
  }) {
    let query = supabase
      .from('agendamentos')
      .select('*');

    if (filters?.status) {
      query = query.eq('status', filters.status);
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

    query = query.order('data_evento', { ascending: true });

    const { data, error } = await query;

    if (error) throw error;
    return data as Agendamento[];
  },

  // Buscar por ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('agendamentos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Agendamento;
  },

  // Buscar por data específica
  async getByData(data: string) {
    const { data: result, error } = await supabase
      .from('agendamentos')
      .select('*')
      .eq('data_evento', data)
      .order('hora_inicio', { ascending: true });

    if (error) throw error;
    return result as Agendamento[];
  },

  // Buscar por período
  async getByPeriodo(dataInicio: string, dataFim: string) {
    const { data, error } = await supabase
      .from('agendamentos')
      .select('*')
      .gte('data_evento', dataInicio)
      .lte('data_evento', dataFim)
      .order('data_evento', { ascending: true });

    if (error) throw error;
    return data as Agendamento[];
  },

  // Buscar por status
  async getByStatus(status: string) {
    const { data, error } = await supabase
      .from('agendamentos')
      .select('*')
      .eq('status', status)
      .order('data_evento', { ascending: true });

    if (error) throw error;
    return data as Agendamento[];
  },

  // Buscar por cliente
  async searchByCliente(nome: string) {
    const { data, error } = await supabase
      .from('agendamentos')
      .select('*')
      .ilike('cliente_nome', `%${nome}%`)
      .order('data_evento', { ascending: false });

    if (error) throw error;
    return data as Agendamento[];
  },

  // Criar agendamento
  async create(agendamento: CreateAgendamentoDTO) {
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
    const { error } = await supabase.from('agendamentos').delete().eq('id', id);

    if (error) throw error;
  },

  // Verificar conflitos de horário
  async checkConflicts(dataEvento: string, horaInicio: string, horaFim: string, excludeId?: string) {
    let query = supabase
      .from('agendamentos')
      .select('*')
      .eq('data_evento', dataEvento)
      .or(`hora_inicio.lte.${horaFim},hora_fim.gte.${horaInicio}`);

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as Agendamento[];
  },
};
