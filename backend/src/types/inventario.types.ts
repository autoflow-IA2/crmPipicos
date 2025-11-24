export interface DisponibilidadeRequest {
  brinquedo_id: string;
  data_evento: string; // ISO date format
  hora_inicio: string; // HH:mm format
  hora_fim: string; // HH:mm format
  quantidade_desejada: number;
  excludeAgendamentoId?: string; // Para edição, excluir agendamento atual
}

export interface VerificarMultiplosRequest {
  items: Array<{
    brinquedo_id: string;
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
  brinquedo_id: string;
  nome: string;
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
  brinquedo_id?: string; // Opcional, para filtrar por item específico
}

export interface DisponibilidadePeriodoItem {
  data: string;
  brinquedo_id: string;
  nome: string;
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
