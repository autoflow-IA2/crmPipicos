import { useMemo } from 'react';
import { parseISO } from 'date-fns';
import { useAgendamentos } from './useAgendamentos';
import { Agendamento, TipoServico } from '../types/agendamento.types';

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: Agendamento;
  tipoServico: TipoServico;
  status: string;
}

// Cores por tipo de serviço
export const CORES_TIPO_SERVICO: Record<TipoServico, string> = {
  brinquedos: '#3b82f6', // blue
  recreacao: '#10b981', // green
  decoracao: '#f59e0b', // amber
  completo: '#8b5cf6', // purple
};

// Cores por status
export const CORES_STATUS: Record<string, string> = {
  pendente: '#6b7280', // gray
  confirmado: '#3b82f6', // blue
  em_preparacao: '#f59e0b', // amber
  entregue: '#10b981', // green
  finalizado: '#059669', // emerald
  cancelado: '#ef4444', // red
};

export const useCalendario = () => {
  const { data: agendamentos, isLoading, error } = useAgendamentos();

  // Transforma agendamentos em eventos do calendário
  const events = useMemo<CalendarEvent[]>(() => {
    if (!agendamentos) return [];

    return agendamentos.map((agendamento: Agendamento) => {
      const dataEvento = parseISO(agendamento.data_evento);

      // Parse das horas (formato HH:mm:ss)
      const [horaInicioHH, horaInicioMM] = agendamento.hora_inicio.split(':');
      const [horaFimHH, horaFimMM] = agendamento.hora_fim.split(':');

      // Cria as datas de início e fim
      const start = new Date(dataEvento);
      start.setHours(parseInt(horaInicioHH), parseInt(horaInicioMM), 0);

      const end = new Date(dataEvento);
      end.setHours(parseInt(horaFimHH), parseInt(horaFimMM), 0);

      return {
        id: agendamento.id,
        title: agendamento.cliente_nome,
        start,
        end,
        resource: agendamento,
        tipoServico: agendamento.tipo_servico,
        status: agendamento.status,
      };
    });
  }, [agendamentos]);

  // Função para obter cor do evento baseado no tipo de serviço
  const getEventColor = (event: CalendarEvent) => {
    return CORES_TIPO_SERVICO[event.tipoServico];
  };

  // Função para obter cor do evento baseado no status
  const getEventColorByStatus = (event: CalendarEvent) => {
    return CORES_STATUS[event.status] || '#6b7280';
  };

  return {
    events,
    agendamentos,
    isLoading,
    error,
    getEventColor,
    getEventColorByStatus,
    CORES_TIPO_SERVICO,
    CORES_STATUS,
  };
};
