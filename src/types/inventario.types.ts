export interface DisponibilidadeRequest {
  brinquedo_nome: string; // Nome do brinquedo (case-insensitive)
  data_evento: string; // ISO date format
  hora_inicio: string; // HH:mm format
  hora_fim: string; // HH:mm format
  quantidade_desejada: number;
  excludeAgendamentoId?: string; // Para edição, excluir agendamento atual
}

export interface VerificarMultiplosRequest {
  items: Array<{
    brinquedo_nome: string; // Nome do brinquedo (case-insensitive)
    quantidade_desejada: number;
  }>;
  data_evento: string;
  hora_inicio: string;
  hora_fim: string;
  excludeAgendamentoId?: string;
}

export interface Conflito {
  agendamento_id: string;
  cliente_nome: string;
  quantidade_reservada: number;
  data_evento: string;
  hora_inicio: string;
  hora_fim: string;
  status: string;
}

export interface DisponibilidadeResponse {
  nome: string; // Nome do brinquedo
  quantidade_total: number;
  quantidade_reservada: number;
  quantidade_disponivel: number;
  disponivel: boolean;
  conflitos: Conflito[];
}

export interface DisponibilidadeMultiplosResponse {
  todos_disponiveis: boolean;
  items: DisponibilidadeResponse[];
}

export interface DisponibilidadePeriodoRequest {
  data_inicio: string;
  data_fim: string;
  brinquedo_nome?: string; // Opcional, para filtrar por nome do brinquedo
}

export interface DisponibilidadePeriodoItem {
  data: string;
  nome: string; // Nome do brinquedo
  quantidade_total: number;
  quantidade_reservada: number;
  quantidade_disponivel: number;
  agendamentos: Array<{
    agendamento_id: string;
    cliente_nome: string;
    quantidade: number;
    hora_inicio: string;
    hora_fim: string;
    status: string;
  }>;
}
