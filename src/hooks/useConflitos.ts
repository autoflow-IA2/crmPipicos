/**
 * Hook para verificação de conflitos de horário
 */

import { useMemo } from 'react';
import type { Agendamento } from '../types';

export interface Conflito {
  agendamentoId: string;
  clienteNome: string;
  data: string;
  horaInicio: string;
  horaFim: string;
}

/**
 * Verifica se dois horários se sobrepõem
 */
const horariosConflitam = (
  inicio1: string,
  fim1: string,
  inicio2: string,
  fim2: string
): boolean => {
  const [h1Start, m1Start] = inicio1.split(':').map(Number);
  const [h1End, m1End] = fim1.split(':').map(Number);
  const [h2Start, m2Start] = inicio2.split(':').map(Number);
  const [h2End, m2End] = fim2.split(':').map(Number);

  const minutos1Start = h1Start * 60 + m1Start;
  const minutos1End = h1End * 60 + m1End;
  const minutos2Start = h2Start * 60 + m2Start;
  const minutos2End = h2End * 60 + m2End;

  // Verifica sobreposição
  return (
    (minutos1Start < minutos2End && minutos1End > minutos2Start) ||
    (minutos2Start < minutos1End && minutos2End > minutos1Start)
  );
};

/**
 * Hook para verificar conflitos de agendamentos
 */
export const useConflitos = (agendamentos: Agendamento[]) => {
  /**
   * Verifica se existe conflito para um novo agendamento
   */
  const verificarConflito = useMemo(() => {
    return (data: string, horaInicio: string, horaFim: string, excluirId?: string): Conflito[] => {
      const conflitos: Conflito[] = [];

      agendamentos.forEach((ag) => {
        // Ignora o próprio agendamento (para edição)
        if (excluirId && ag.id === excluirId) return;

        // Verifica se é a mesma data
        if (ag.data_evento === data) {
          // Verifica se os horários conflitam
          if (horariosConflitam(horaInicio, horaFim, ag.hora_inicio, ag.hora_fim)) {
            conflitos.push({
              agendamentoId: ag.id,
              clienteNome: ag.cliente_nome,
              data: ag.data_evento,
              horaInicio: ag.hora_inicio,
              horaFim: ag.hora_fim,
            });
          }
        }
      });

      return conflitos;
    };
  }, [agendamentos]);

  /**
   * Retorna todos os conflitos existentes no sistema
   */
  const todosConflitos = useMemo(() => {
    const conflitosMap = new Map<string, Conflito[]>();

    agendamentos.forEach((ag1) => {
      const conflitosDoAgendamento: Conflito[] = [];

      agendamentos.forEach((ag2) => {
        if (ag1.id === ag2.id) return;

        if (ag1.data_evento === ag2.data_evento) {
          if (horariosConflitam(ag1.hora_inicio, ag1.hora_fim, ag2.hora_inicio, ag2.hora_fim)) {
            conflitosDoAgendamento.push({
              agendamentoId: ag2.id,
              clienteNome: ag2.cliente_nome,
              data: ag2.data_evento,
              horaInicio: ag2.hora_inicio,
              horaFim: ag2.hora_fim,
            });
          }
        }
      });

      if (conflitosDoAgendamento.length > 0) {
        conflitosMap.set(ag1.id, conflitosDoAgendamento);
      }
    });

    return conflitosMap;
  }, [agendamentos]);

  /**
   * Conta o total de conflitos
   */
  const totalConflitos = useMemo(() => {
    return todosConflitos.size;
  }, [todosConflitos]);

  /**
   * Verifica se um agendamento específico tem conflito
   */
  const temConflito = (agendamentoId: string): boolean => {
    return todosConflitos.has(agendamentoId);
  };

  /**
   * Retorna os conflitos de um agendamento específico
   */
  const getConflitos = (agendamentoId: string): Conflito[] => {
    return todosConflitos.get(agendamentoId) || [];
  };

  return {
    verificarConflito,
    todosConflitos,
    totalConflitos,
    temConflito,
    getConflitos,
  };
};
