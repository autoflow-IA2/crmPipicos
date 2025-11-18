import { supabase } from './supabase';
import { Cliente, CreateClienteDTO, UpdateClienteDTO, ClienteComAgendamentos } from '../types/cliente.types';

export const clientesService = {
  // Buscar todos os clientes
  async getAll(): Promise<Cliente[]> {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('nome', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Buscar clientes ativos
  async getAtivos(): Promise<Cliente[]> {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('ativo', true)
      .order('nome', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Buscar cliente por ID
  async getById(id: string): Promise<Cliente | null> {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Cliente não encontrado
      }
      throw error;
    }
    return data;
  },

  // Buscar cliente com histórico de agendamentos
  async getByIdComAgendamentos(id: string): Promise<ClienteComAgendamentos | null> {
    // Buscar dados do cliente
    const cliente = await this.getById(id);
    if (!cliente) return null;

    // Buscar agendamentos do cliente
    const { data: agendamentos, error: agendamentosError } = await supabase
      .from('agendamentos')
      .select('id, data_evento, valor_total, status')
      .or(`cliente_telefone.eq.${cliente.telefone},cliente_email.eq.${cliente.email}`)
      .order('data_evento', { ascending: false });

    if (agendamentosError) {
      console.error('Erro ao buscar agendamentos:', agendamentosError);
    }

    // Calcular estatísticas
    const total_agendamentos = agendamentos?.length || 0;
    const ultimo_agendamento = agendamentos?.[0]?.data_evento;
    const valor_total_gasto = agendamentos?.reduce(
      (sum, ag) => sum + (ag.valor_total || 0),
      0
    ) || 0;

    return {
      ...cliente,
      total_agendamentos,
      ultimo_agendamento,
      valor_total_gasto,
    };
  },

  // Buscar clientes por nome (busca)
  async searchByName(searchTerm: string): Promise<Cliente[]> {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .ilike('nome', `%${searchTerm}%`)
      .order('nome', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Buscar cliente por telefone
  async getByTelefone(telefone: string): Promise<Cliente | null> {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('telefone', telefone)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }
    return data;
  },

  // Buscar cliente por email
  async getByEmail(email: string): Promise<Cliente | null> {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }
    return data;
  },

  // Criar novo cliente
  async create(cliente: CreateClienteDTO): Promise<Cliente> {
    const { data, error } = await supabase
      .from('clientes')
      .insert([
        {
          ...cliente,
          ativo: cliente.ativo !== undefined ? cliente.ativo : true,
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Atualizar cliente
  async update(cliente: UpdateClienteDTO): Promise<Cliente> {
    const { id, ...updateData } = cliente;

    const { data, error } = await supabase
      .from('clientes')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Deletar cliente (soft delete - apenas marca como inativo)
  async softDelete(id: string): Promise<void> {
    const { error } = await supabase
      .from('clientes')
      .update({ ativo: false })
      .eq('id', id);

    if (error) throw error;
  },

  // Deletar cliente permanentemente
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('clientes')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Reativar cliente
  async reativar(id: string): Promise<Cliente> {
    const { data, error } = await supabase
      .from('clientes')
      .update({ ativo: true })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Verificar se telefone já está cadastrado
  async telefoneExists(telefone: string, excludeId?: string): Promise<boolean> {
    let query = supabase
      .from('clientes')
      .select('id')
      .eq('telefone', telefone);

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return (data?.length || 0) > 0;
  },

  // Verificar se email já está cadastrado
  async emailExists(email: string, excludeId?: string): Promise<boolean> {
    let query = supabase
      .from('clientes')
      .select('id')
      .eq('email', email);

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return (data?.length || 0) > 0;
  },

  // Estatísticas gerais
  async getEstatisticas() {
    const { count: totalClientes } = await supabase
      .from('clientes')
      .select('*', { count: 'exact', head: true });

    const { count: clientesAtivos } = await supabase
      .from('clientes')
      .select('*', { count: 'exact', head: true })
      .eq('ativo', true);

    const { count: clientesInativos } = await supabase
      .from('clientes')
      .select('*', { count: 'exact', head: true })
      .eq('ativo', false);

    return {
      total: totalClientes || 0,
      ativos: clientesAtivos || 0,
      inativos: clientesInativos || 0,
    };
  },
};
