import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import toast from 'react-hot-toast';
import {
  useAgendamento,
  useUpdateStatusAgendamento,
  useDeleteAgendamento,
} from '../hooks/useAgendamentos';
import type { StatusAgendamento } from '../types';

const AgendamentoDetalhes: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: agendamento, isLoading, error } = useAgendamento(id!);
  const updateStatus = useUpdateStatusAgendamento();
  const deleteAgendamento = useDeleteAgendamento();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !agendamento) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-800 text-lg font-medium">
          Erro ao carregar agendamento
        </p>
        <button
          onClick={() => navigate('/agendamentos')}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Voltar para lista
        </button>
      </div>
    );
  }

  const getStatusColor = (status: StatusAgendamento) => {
    const colors = {
      pendente: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmado: 'bg-blue-100 text-blue-800 border-blue-200',
      em_preparacao: 'bg-purple-100 text-purple-800 border-purple-200',
      entregue: 'bg-green-100 text-green-800 border-green-200',
      finalizado: 'bg-gray-100 text-gray-800 border-gray-200',
      cancelado: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusLabel = (status: StatusAgendamento) => {
    const labels = {
      pendente: 'Pendente',
      confirmado: 'Confirmado',
      em_preparacao: 'Em Preparação',
      entregue: 'Entregue',
      finalizado: 'Finalizado',
      cancelado: 'Cancelado',
    };
    return labels[status] || status;
  };

  const formatCurrency = (value?: number) => {
    if (!value) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString + 'T00:00:00'), 'dd/MM/yyyy', {
        locale: ptBR,
      });
    } catch {
      return dateString;
    }
  };

  const handleStatusChange = async (newStatus: StatusAgendamento) => {
    if (newStatus === agendamento.status) return;

    const loadingToast = toast.loading('Atualizando status...');
    try {
      await updateStatus.mutateAsync({ id: agendamento.id, status: newStatus });
      toast.success('Status atualizado com sucesso!', { id: loadingToast });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status. Tente novamente.', { id: loadingToast });
    }
  };

  const handleDelete = async () => {
    const loadingToast = toast.loading('Excluindo agendamento...');
    try {
      await deleteAgendamento.mutateAsync(agendamento.id);
      toast.success('Agendamento excluído com sucesso!', { id: loadingToast });
      navigate('/agendamentos');
    } catch (error) {
      console.error('Erro ao deletar agendamento:', error);
      toast.error('Erro ao excluir agendamento. Tente novamente.', { id: loadingToast });
    }
  };

  const statusOptions: StatusAgendamento[] = [
    'pendente',
    'confirmado',
    'em_preparacao',
    'entregue',
    'finalizado',
    'cancelado',
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Detalhes do Agendamento
            </h1>
            <p className="text-gray-600">ID: {agendamento.id}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/agendamentos')}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Voltar
            </button>
            <button
              onClick={() => navigate(`/agendamentos/${id}/editar`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Editar
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Excluir
            </button>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-4">
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(
              agendamento.status
            )}`}
          >
            {getStatusLabel(agendamento.status)}
          </span>
          <select
            value={agendamento.status}
            onChange={(e) => handleStatusChange(e.target.value as StatusAgendamento)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                Alterar para: {getStatusLabel(status)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid de Informações */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dados do Cliente */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
            📋 Dados do Cliente
          </h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-600">Nome:</label>
              <p className="text-gray-800 font-medium">{agendamento.cliente_nome}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Telefone:</label>
              <p className="text-gray-800">{agendamento.cliente_telefone}</p>
            </div>
            {agendamento.cliente_email && (
              <div>
                <label className="text-sm font-medium text-gray-600">Email:</label>
                <p className="text-gray-800">{agendamento.cliente_email}</p>
              </div>
            )}
            {agendamento.cliente_endereco && (
              <div>
                <label className="text-sm font-medium text-gray-600">Endereço:</label>
                <p className="text-gray-800">
                  {agendamento.cliente_endereco}
                  {agendamento.cliente_bairro && `, ${agendamento.cliente_bairro}`}
                  {agendamento.cliente_cidade && ` - ${agendamento.cliente_cidade}`}
                  {agendamento.cliente_cep && ` - CEP: ${agendamento.cliente_cep}`}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Dados do Evento */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
            🎉 Dados do Evento
          </h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-600">Data:</label>
              <p className="text-gray-800 font-medium">
                {formatDate(agendamento.data_evento)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Horário:</label>
              <p className="text-gray-800">
                {agendamento.hora_inicio} às {agendamento.hora_fim}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Tipo de Serviço:</label>
              <p className="text-gray-800 capitalize">{agendamento.tipo_servico}</p>
            </div>
            {agendamento.tipo_evento && (
              <div>
                <label className="text-sm font-medium text-gray-600">Tipo de Evento:</label>
                <p className="text-gray-800">{agendamento.tipo_evento}</p>
              </div>
            )}
            {agendamento.num_convidados && (
              <div>
                <label className="text-sm font-medium text-gray-600">Nº de Convidados:</label>
                <p className="text-gray-800">{agendamento.num_convidados}</p>
              </div>
            )}
            {agendamento.faixa_etaria && (
              <div>
                <label className="text-sm font-medium text-gray-600">Faixa Etária:</label>
                <p className="text-gray-800 capitalize">{agendamento.faixa_etaria}</p>
              </div>
            )}
          </div>
        </div>

        {/* Brinquedos Selecionados */}
        {agendamento.brinquedos_selecionados &&
          agendamento.brinquedos_selecionados.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                🎮 Brinquedos Selecionados
              </h2>
              <div className="space-y-3">
                {agendamento.brinquedos_selecionados.map((brinquedo, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{brinquedo.nome}</p>
                      <p className="text-sm text-gray-600">
                        Quantidade: {brinquedo.quantidade}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-800">
                        {formatCurrency(brinquedo.valor * brinquedo.quantidade)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatCurrency(brinquedo.valor)} cada
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Informações Financeiras */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
            💰 Informações Financeiras
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg">
              <label className="font-medium text-gray-700">Valor Total:</label>
              <p className="text-xl font-bold text-blue-600">
                {formatCurrency(agendamento.valor_total)}
              </p>
            </div>
            {agendamento.valor_sinal !== undefined && agendamento.valor_sinal > 0 && (
              <>
                <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg">
                  <label className="font-medium text-gray-700">Sinal Pago:</label>
                  <p className="text-lg font-bold text-green-600">
                    {formatCurrency(agendamento.valor_sinal)}
                  </p>
                </div>
                <div className="flex justify-between items-center bg-yellow-50 p-3 rounded-lg">
                  <label className="font-medium text-gray-700">Valor Restante:</label>
                  <p className="text-lg font-bold text-yellow-600">
                    {formatCurrency(agendamento.valor_restante)}
                  </p>
                </div>
              </>
            )}
            {agendamento.forma_pagamento && (
              <div>
                <label className="text-sm font-medium text-gray-600">Forma de Pagamento:</label>
                <p className="text-gray-800 capitalize">{agendamento.forma_pagamento}</p>
              </div>
            )}
            {agendamento.status_pagamento && (
              <div>
                <label className="text-sm font-medium text-gray-600">Status Pagamento:</label>
                <p className="text-gray-800 capitalize">
                  {agendamento.status_pagamento.replace('_', ' ')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Observações */}
      {(agendamento.observacoes || agendamento.observacoes_internas) && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
            📝 Observações
          </h2>
          <div className="space-y-4">
            {agendamento.observacoes && (
              <div>
                <label className="text-sm font-medium text-gray-600">Observações do Cliente:</label>
                <p className="text-gray-800 mt-1 bg-gray-50 p-3 rounded-lg">
                  {agendamento.observacoes}
                </p>
              </div>
            )}
            {agendamento.observacoes_internas && (
              <div>
                <label className="text-sm font-medium text-gray-600">Observações Internas:</label>
                <p className="text-gray-800 mt-1 bg-yellow-50 p-3 rounded-lg">
                  {agendamento.observacoes_internas}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Logística */}
      {(agendamento.necessita_montagem ||
        agendamento.necessita_desmontagem ||
        agendamento.responsavel_entrega) && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
            🚚 Logística
          </h2>
          <div className="space-y-3">
            {agendamento.necessita_montagem && (
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span className="text-gray-800">
                  Necessita montagem
                  {agendamento.hora_montagem && ` às ${agendamento.hora_montagem}`}
                </span>
              </div>
            )}
            {agendamento.necessita_desmontagem && (
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span className="text-gray-800">
                  Necessita desmontagem
                  {agendamento.hora_desmontagem && ` às ${agendamento.hora_desmontagem}`}
                </span>
              </div>
            )}
            {agendamento.responsavel_entrega && (
              <div>
                <label className="text-sm font-medium text-gray-600">Responsável pela Entrega:</label>
                <p className="text-gray-800">{agendamento.responsavel_entrega}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Metadados */}
      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Criado em: {new Date(agendamento.created_at).toLocaleString('pt-BR')}</span>
          <span>Atualizado em: {new Date(agendamento.updated_at).toLocaleString('pt-BR')}</span>
        </div>
      </div>

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Confirmar Exclusão
            </h3>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteAgendamento.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              >
                {deleteAgendamento.isPending ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgendamentoDetalhes;
