export interface ItemDecoracao {
  id: string;
  nome: string;
  categoria?: string;
  descricao?: string;
  quantidade_estoque: number;
  valor_locacao?: number;
  foto_url?: string;
  created_at: string;
}

export interface CreateItemDecoracaoDTO {
  nome: string;
  categoria?: string;
  descricao?: string;
  quantidade_estoque?: number;
  valor_locacao?: number;
  foto_url?: string;
}

export interface UpdateItemDecoracaoDTO extends Partial<CreateItemDecoracaoDTO> {
  id: string;
}
