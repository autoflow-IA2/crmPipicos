import { supabase } from './supabase';
import type { Brinquedo, CreateBrinquedoDTO } from '../types';

export const brinquedosService = {
  async getAll() {
    const { data, error } = await supabase
      .from('brinquedos')
      .select('*')
      .order('nome', { ascending: true });

    if (error) throw error;
    return data as Brinquedo[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('brinquedos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Brinquedo;
  },

  async getDisponiveis(_dataEvento?: string) {
    // TODO: Implementar verificação de disponibilidade por data
    // Por enquanto, retorna todos os brinquedos disponíveis
    const { data, error } = await supabase
      .from('brinquedos')
      .select('*')
      .eq('status', 'disponivel')
      .order('nome', { ascending: true });

    if (error) throw error;
    return data as Brinquedo[];
  },

  async create(brinquedo: CreateBrinquedoDTO) {
    const { data, error } = await supabase
      .from('brinquedos')
      .insert(brinquedo)
      .select()
      .single();

    if (error) throw error;
    return data as Brinquedo;
  },

  async update(id: string, updateData: Partial<Brinquedo>) {
    const { data, error } = await supabase
      .from('brinquedos')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Brinquedo;
  },

  async delete(id: string) {
    const { error } = await supabase.from('brinquedos').delete().eq('id', id);
    if (error) throw error;
  },
};
