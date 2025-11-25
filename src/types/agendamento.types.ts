export type TipoServico = 'brinquedos' | 'recreacao' | 'decoracao' | 'completo';

export type StatusPagamento = 'pendente' | 'sinal_pago' | 'pago' | 'cancelado';

export type StatusAgendamento =
  | 'pendente'
  | 'confirmado'
  | 'em_preparacao'
  | 'entregue'
  | 'finalizado'
  | 'cancelado';

export type FaixaEtaria = 'infantil' | 'adolescente' | 'adulto' | 'misto';

export interface BrinquedoSelecionado {
  id: string;
  nome: string;
  quantidade: number;
  valor: number;
}

export interface ItemDecoracaoSelecionado {
  id: string;
  nome: string;
  quantidade: number;
  valor: number;
}

export interface Agendamento {
  id: string;
  created_at: string;
  updated_at: string;

  // Dados do Cliente
  cliente_nome: string;
  cliente_telefone: string;
  cliente_email?: string;
  cliente_endereco?: string;
  cliente_bairro?: string;
  cliente_cidade?: string;
  cliente_cep?: string;

  // Dados do Evento
  tipo_servico: TipoServico;
  data_evento: string;
  hora_inicio: string;
  hora_fim: string;
  tipo_evento?: string;
  num_convidados?: number;
  faixa_etaria?: FaixaEtaria;

  // Itens Solicitados
  brinquedos_selecionados?: BrinquedoSelecionado[];
  recreadores_quantidade?: number;
  itens_decoracao?: ItemDecoracaoSelecionado[];
  tema_decoracao?: string;
  brinquedo_principal?: string;

  // Financeiro
  valor_total?: number;
  valor_sinal?: number;
  valor_restante?: number;
  forma_pagamento?: string;
  status_pagamento?: StatusPagamento;

  // Status e Observações
  status: StatusAgendamento;
  observacoes?: string;
  observacoes_internas?: string;

  // Logística
  necessita_montagem?: boolean;
  hora_montagem?: string;
  necessita_desmontagem?: boolean;
  hora_desmontagem?: string;
  responsavel_entrega?: string;

  // Metadados
  usuario_criacao?: string;
  usuario_atualizacao?: string;
}

export interface CreateAgendamentoDTO {
  // Dados do Cliente (obrigatórios)
  cliente_nome: string;
  cliente_telefone: string;
  cliente_email?: string;
  cliente_endereco?: string;
  cliente_bairro?: string;
  cliente_cidade?: string;
  cliente_cep?: string;

  // Dados do Evento (obrigatórios)
  tipo_servico: TipoServico;
  data_evento: string;
  hora_inicio: string;
  hora_fim: string;
  tipo_evento?: string;
  num_convidados?: number;
  faixa_etaria?: FaixaEtaria;

  // Itens Solicitados
  brinquedos_selecionados?: BrinquedoSelecionado[];
  recreadores_quantidade?: number;
  itens_decoracao?: ItemDecoracaoSelecionado[];
  tema_decoracao?: string;
  brinquedo_principal?: string;

  // Financeiro
  valor_total?: number;
  valor_sinal?: number;
  valor_restante?: number;
  forma_pagamento?: string;
  status_pagamento?: StatusPagamento;

  // Status e Observações
  status?: StatusAgendamento;
  observacoes?: string;
  observacoes_internas?: string;

  // Logística
  necessita_montagem?: boolean;
  hora_montagem?: string;
  necessita_desmontagem?: boolean;
  hora_desmontagem?: string;
  responsavel_entrega?: string;
}

export interface UpdateAgendamentoDTO extends Partial<CreateAgendamentoDTO> {
  id: string;
}
