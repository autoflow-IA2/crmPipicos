export interface Brinquedo {
  id: string;
  nome: string;
  descricao?: string;
  categoria?: string;
  capacidade_pessoas?: number;
  dimensoes?: string;
  valor_locacao?: number;
  quantidade_estoque: number;
  status: 'disponivel' | 'manutencao' | 'indisponivel';
  foto_url?: string;
  created_at: string;
}

export interface CreateBrinquedoDTO {
  nome: string;
  descricao?: string;
  categoria?: string;
  capacidade_pessoas?: number;
  dimensoes?: string;
  valor_locacao?: number;
  quantidade_estoque?: number;
  status?: 'disponivel' | 'manutencao' | 'indisponivel';
  foto_url?: string;
}

export interface UpdateBrinquedoDTO extends Partial<CreateBrinquedoDTO> {
  id: string;
}
