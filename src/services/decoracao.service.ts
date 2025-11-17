import { supabase } from './supabase';
import type {
  ItemDecoracao,
  CreateItemDecoracaoDTO,
  UpdateItemDecoracaoDTO,
} from '../types';

export const decoracaoService = {
  async getAll() {
    const { data, error } = await supabase
      .from('itens_decoracao')
      .select('*')
      .order('nome', { ascending: true });

    if (error) throw error;
    return data as ItemDecoracao[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('itens_decoracao')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as ItemDecoracao;
  },

  async create(item: CreateItemDecoracaoDTO) {
    const { data, error } = await supabase
      .from('itens_decoracao')
      .insert(item)
      .select()
      .single();

    if (error) throw error;
    return data as ItemDecoracao;
  },

  async update(item: UpdateItemDecoracaoDTO) {
    const { id, ...updateData } = item;
    const { data, error } = await supabase
      .from('itens_decoracao')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as ItemDecoracao;
  },

  async delete(id: string) {
    const { error } = await supabase.from('itens_decoracao').delete().eq('id', id);
    if (error) throw error;
  },
};
