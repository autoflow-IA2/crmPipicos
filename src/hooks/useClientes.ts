import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientesService } from '../services/clientes.service';
import { CreateClienteDTO, UpdateClienteDTO } from '../types/cliente.types';
import toast from 'react-hot-toast';

// Hook para buscar todos os clientes
export const useClientes = () => {
  return useQuery({
    queryKey: ['clientes'],
    queryFn: () => clientesService.getAll(),
  });
};

// Hook para buscar apenas clientes ativos
export const useClientesAtivos = () => {
  return useQuery({
    queryKey: ['clientes', 'ativos'],
    queryFn: () => clientesService.getAtivos(),
  });
};

// Hook para buscar cliente por ID
export const useCliente = (id: string | undefined) => {
  return useQuery({
    queryKey: ['clientes', id],
    queryFn: () => clientesService.getById(id!),
    enabled: !!id,
  });
};

// Hook para buscar cliente com agendamentos
export const useClienteComAgendamentos = (id: string | undefined) => {
  return useQuery({
    queryKey: ['clientes', id, 'agendamentos'],
    queryFn: () => clientesService.getByIdComAgendamentos(id!),
    enabled: !!id,
  });
};

// Hook para buscar estatísticas
export const useClientesEstatisticas = () => {
  return useQuery({
    queryKey: ['clientes', 'estatisticas'],
    queryFn: () => clientesService.getEstatisticas(),
  });
};

// Hook para criar cliente
export const useCreateCliente = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cliente: CreateClienteDTO) => clientesService.create(cliente),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      toast.success('Cliente cadastrado com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao cadastrar cliente');
    },
  });
};

// Hook para atualizar cliente
export const useUpdateCliente = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cliente: UpdateClienteDTO) => clientesService.update(cliente),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      queryClient.invalidateQueries({ queryKey: ['clientes', data.id] });
      toast.success('Cliente atualizado com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao atualizar cliente');
    },
  });
};

// Hook para deletar cliente (soft delete)
export const useSoftDeleteCliente = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => clientesService.softDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      toast.success('Cliente inativado com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao inativar cliente');
    },
  });
};

// Hook para deletar cliente permanentemente
export const useDeleteCliente = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => clientesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      toast.success('Cliente excluído com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao excluir cliente');
    },
  });
};

// Hook para reativar cliente
export const useReativarCliente = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => clientesService.reativar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      toast.success('Cliente reativado com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao reativar cliente');
    },
  });
};

// Hook para busca por nome
export const useSearchClientes = (searchTerm: string) => {
  return useQuery({
    queryKey: ['clientes', 'search', searchTerm],
    queryFn: () => clientesService.searchByName(searchTerm),
    enabled: searchTerm.length > 0,
  });
};
