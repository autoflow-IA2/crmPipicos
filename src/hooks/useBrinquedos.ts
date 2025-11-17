import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { brinquedosService } from '../services';
import type { Brinquedo } from '../types';

export function useBrinquedos() {
  return useQuery({
    queryKey: ['brinquedos'],
    queryFn: () => brinquedosService.getAll(),
  });
}

export function useBrinquedosByCategoria() {
  const { data: brinquedos, ...rest } = useBrinquedos();

  const brinquedosPorCategoria = brinquedos?.reduce((acc, brinquedo) => {
    const categoria = brinquedo.categoria || 'Outros';
    if (!acc[categoria]) {
      acc[categoria] = [];
    }
    acc[categoria].push(brinquedo);
    return acc;
  }, {} as Record<string, Brinquedo[]>);

  return {
    data: brinquedosPorCategoria,
    brinquedos,
    ...rest,
  };
}

export function useBrinquedo(id: string) {
  return useQuery({
    queryKey: ['brinquedos', id],
    queryFn: () => brinquedosService.getById(id),
    enabled: !!id,
  });
}

export function useBrinquedosDisponiveis(dataEvento?: string) {
  return useQuery({
    queryKey: ['brinquedos', 'disponiveis', dataEvento],
    queryFn: () => brinquedosService.getDisponiveis(dataEvento),
    enabled: !!dataEvento,
  });
}

export function useCreateBrinquedo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Brinquedo, 'id' | 'created_at'>) =>
      brinquedosService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brinquedos'] });
    },
  });
}

export function useUpdateBrinquedo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Brinquedo> }) =>
      brinquedosService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brinquedos'] });
    },
  });
}

export function useDeleteBrinquedo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => brinquedosService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brinquedos'] });
    },
  });
}
