import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Loading } from '../components/common';
import { useAgendamentos } from '../hooks';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Agendamentos: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [tipoServicoFilter, setTipoServicoFilter] = useState('');
  const [dataFilter, setDataFilter] = useState('');

  const { data: agendamentos = [], isLoading } = useAgendamentos({
    status: statusFilter || undefined,
    tipoServico: tipoServicoFilter || undefined,
    dataInicio: dataFilter || undefined,
  });

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  };

  const formatarData = (data: string) => {
    try {
      return format(new Date(data + 'T00:00:00'), 'dd/MM/yyyy', { locale: ptBR });
    } catch {
      return data;
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pendente: 'bg-yellow-100 text-yellow-800',
      confirmado: 'bg-green-100 text-green-800',
      em_preparacao: 'bg-blue-100 text-blue-800',
      entregue: 'bg-purple-100 text-purple-800',
      finalizado: 'bg-gray-100 text-gray-800',
      cancelado: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pendente: 'Pendente',
      confirmado: 'Confirmado',
      em_preparacao: 'Em Preparação',
      entregue: 'Entregue',
      finalizado: 'Finalizado',
      cancelado: 'Cancelado',
    };
    return labels[status] || status;
  };

  const agendamentosFiltrados = agendamentos.filter((agendamento) => {
    if (searchTerm) {
      return agendamento.cliente_nome.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loading size="lg" message="Carregando agendamentos..." />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-black">Agendamentos</h1>
          <p className="text-black font-bold mt-1">
            {agendamentosFiltrados.length} agendamento(s) encontrado(s)
          </p>
        </div>
        <Button variant="primary" onClick={() => navigate('/agendamentos/novo')}>
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M12 4v16m8-8H4"></path>
            </svg>
            Novo Agendamento
          </span>
        </Button>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <input
              type="text"
              placeholder="Buscar por cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Todos os Status</option>
              <option value="pendente">Pendente</option>
              <option value="confirmado">Confirmado</option>
              <option value="em_preparacao">Em Preparação</option>
              <option value="entregue">Entregue</option>
              <option value="finalizado">Finalizado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>

          <div>
            <select
              value={tipoServicoFilter}
              onChange={(e) => setTipoServicoFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Tipo de Serviço</option>
              <option value="brinquedos">Brinquedos</option>
              <option value="recreacao">Recreação</option>
              <option value="decoracao">Decoração</option>
              <option value="completo">Completo</option>
            </select>
          </div>

          <div>
            <input
              type="date"
              value={dataFilter}
              onChange={(e) => setDataFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {(searchTerm || statusFilter || tipoServicoFilter || dataFilter) && (
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('');
                setTipoServicoFilter('');
                setDataFilter('');
              }}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Limpar todos os filtros
            </button>
          </div>
        )}
      </div>

      {/* Lista de Agendamentos */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data do Evento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Horário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo de Serviço
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {agendamentosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-black">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-16 h-16 mb-4 text-purple-300" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                      </svg>
                      <p className="text-lg font-bold">Nenhum agendamento encontrado</p>
                      <p className="text-sm mt-2 text-gray-700">
                        {searchTerm || statusFilter || tipoServicoFilter || dataFilter
                          ? 'Tente ajustar os filtros ou criar um novo agendamento'
                          : 'Clique em "Novo Agendamento" para começar'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                agendamentosFiltrados.map((agendamento) => (
                  <tr key={agendamento.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm font-bold text-black">
                          {agendamento.cliente_nome}
                        </div>
                        <div className="text-sm text-gray-600">
                          {agendamento.cliente_telefone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-black">
                        {formatarData(agendamento.data_evento)}
                      </div>
                      {agendamento.tipo_evento && (
                        <div className="text-sm text-gray-600">
                          {agendamento.tipo_evento}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-black">
                        {agendamento.hora_inicio} - {agendamento.hora_fim}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-black capitalize">
                        {agendamento.tipo_servico}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          agendamento.status
                        )}`}
                      >
                        {getStatusLabel(agendamento.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-black">
                        {formatarMoeda(Number(agendamento.valor_total) || 0)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => navigate(`/agendamentos/${agendamento.id}`)}
                        className="text-purple-600 hover:text-purple-900 mr-3 font-bold"
                      >
                        Ver
                      </button>
                      <button
                        onClick={() => navigate(`/agendamentos/${agendamento.id}/editar`)}
                        className="text-green-600 hover:text-green-900 mr-3 font-bold"
                      >
                        Editar
                      </button>
                      <button className="text-red-600 hover:text-red-900 font-bold">
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Agendamentos;
