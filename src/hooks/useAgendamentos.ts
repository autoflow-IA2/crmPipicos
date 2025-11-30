import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { agendamentosService } from '../services';
import type { Agendamento } from '../types';

export function useAgendamentos(filters?: {
  status?: string;
  dataInicio?: string;
  dataFim?: string;
  tipoServico?: string;
}) {
  return useQuery({
    queryKey: ['agendamentos', filters],
    queryFn: () => agendamentosService.getAll(filters),
  });
}

export function useAgendamento(id: string) {
  return useQuery({
    queryKey: ['agendamentos', id],
    queryFn: async () => {
      const agendamento = await agendamentosService.getById(id);

      // Normalizar: sempre array, nunca null
      if (!agendamento.brinquedos_selecionados) {
        agendamento.brinquedos_selecionados = [];
      }

      // Filtrar itens inválidos (compatibilidade com dados antigos)
      if (Array.isArray(agendamento.brinquedos_selecionados)) {
        agendamento.brinquedos_selecionados = agendamento.brinquedos_selecionados.filter(
          (item: any) => item && item.nome && item.quantidade && item.valor
        );
      }

      return agendamento;
    },
    enabled: !!id,
  });
}

export function useAgendamentosHoje() {
  const hoje = new Date().toISOString().split('T')[0];

  return useQuery({
    queryKey: ['agendamentos', 'hoje'],
    queryFn: () => agendamentosService.getByData(hoje),
  });
}

export function useAgendamentosPorData(dataInicio: string, dataFim: string) {
  return useQuery({
    queryKey: ['agendamentos', 'periodo', dataInicio, dataFim],
    queryFn: () => agendamentosService.getByPeriodo(dataInicio, dataFim),
    enabled: !!dataInicio && !!dataFim,
  });
}

export function useCreateAgendamento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Agendamento, 'id' | 'created_at' | 'updated_at'>) =>
      agendamentosService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
    },
  });
}

export function useUpdateAgendamento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Agendamento> }) =>
      agendamentosService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
    },
  });
}

export function useDeleteAgendamento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => agendamentosService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
    },
  });
}

export function useUpdateStatusAgendamento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      agendamentosService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
    },
  });
}

export function useEstatsticas() {
  return useQuery({
    queryKey: ['agendamentos', 'estatisticas'],
    queryFn: async () => {
      const agendamentos = await agendamentosService.getAll();

      const hoje = new Date().toISOString().split('T')[0];
      const mesAtual = hoje.substring(0, 7); // YYYY-MM

      const total = agendamentos.length;
      const hoje_count = agendamentos.filter(a => a.data_evento === hoje).length;
      const pendentes = agendamentos.filter(a => a.status === 'pendente').length;

      const receitaMensal = agendamentos
        .filter(a => a.data_evento.startsWith(mesAtual))
        .reduce((acc, a) => acc + (Number(a.valor_total) || 0), 0);

      return {
        total,
        hoje: hoje_count,
        pendentes,
        receitaMensal,
      };
    },
  });
}
