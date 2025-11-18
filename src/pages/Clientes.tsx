import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClientes, useClientesEstatisticas, useSoftDeleteCliente, useReativarCliente } from '../hooks';
import { Button, Loading } from '../components/common';
import { Cliente } from '../types/cliente.types';
import { format } from 'date-fns';

const Clientes: React.FC = () => {
  const navigate = useNavigate();
  const { data: clientes, isLoading } = useClientes();
  const { data: estatisticas } = useClientesEstatisticas();
  const softDeleteCliente = useSoftDeleteCliente();
  const reativarCliente = useReativarCliente();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'ativos' | 'inativos'>('ativos');

  // Filtrar clientes
  const clientesFiltrados = useMemo(() => {
    if (!clientes) return [];

    return clientes.filter((cliente) => {
      // Filtro de busca
      const matchSearch =
        cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.telefone.includes(searchTerm) ||
        cliente.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.cpf_cnpj?.includes(searchTerm);

      // Filtro de status
      const matchStatus =
        statusFilter === 'todos' ||
        (statusFilter === 'ativos' && cliente.ativo) ||
        (statusFilter === 'inativos' && !cliente.ativo);

      return matchSearch && matchStatus;
    });
  }, [clientes, searchTerm, statusFilter]);

  const handleInativar = async (id: string) => {
    if (window.confirm('Deseja realmente inativar este cliente?')) {
      await softDeleteCliente.mutateAsync(id);
    }
  };

  const handleReativar = async (id: string) => {
    if (window.confirm('Deseja reativar este cliente?')) {
      await reativarCliente.mutateAsync(id);
    }
  };

  const limparFiltros = () => {
    setSearchTerm('');
    setStatusFilter('ativos');
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      {/* Header com Gradiente */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl shadow-xl p-8 mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Gestão de Clientes</h1>
            <p className="text-purple-100">
              Gerencie o cadastro de clientes e visualize o histórico
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => navigate('/clientes/novo')}
            className="bg-white text-purple-600 hover:bg-purple-50 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <span className="flex items-center gap-2 font-semibold">
              <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 4v16m8-8H4"></path>
              </svg>
              Novo Cliente
            </span>
          </Button>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      {estatisticas && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border-t-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total de Clientes</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">{estatisticas.total}</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border-t-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Clientes Ativos</p>
                <p className="text-4xl font-bold text-green-600">{estatisticas.ativos}</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border-t-4 border-gray-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Clientes Inativos</p>
                <p className="text-4xl font-bold text-gray-600">{estatisticas.inativos}</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-purple-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filtros
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Buscar Cliente
            </label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Nome, telefone, email ou CPF/CNPJ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white"
            >
              <option value="todos">Todos</option>
              <option value="ativos">Ativos</option>
              <option value="inativos">Inativos</option>
            </select>
          </div>
        </div>

        {(searchTerm || statusFilter !== 'ativos') && (
          <div className="mt-4 flex items-center justify-between pt-4 border-t border-purple-100">
            <p className="text-sm font-medium text-gray-700">
              <span className="text-purple-600 font-bold">{clientesFiltrados.length}</span> cliente(s) encontrado(s)
            </p>
            <button
              onClick={limparFiltros}
              className="text-sm text-purple-600 hover:text-purple-700 font-semibold hover:underline transition-all"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </div>

      {/* Tabela de Clientes */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-purple-100">
        {clientesFiltrados.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Nenhum cliente encontrado
            </h3>
            <p className="text-gray-600">
              {searchTerm
                ? 'Tente ajustar os filtros de busca'
                : 'Clique em "Novo Cliente" para cadastrar o primeiro cliente'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-purple-200">
              <thead className="bg-gradient-to-r from-purple-50 to-purple-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-purple-800 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-purple-800 uppercase tracking-wider">
                    Contato
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-purple-800 uppercase tracking-wider">
                    Cidade
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-purple-800 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-purple-800 uppercase tracking-wider">
                    Cadastro
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-purple-800 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-purple-100">
                {clientesFiltrados.map((cliente) => (
                  <tr key={cliente.id} className="hover:bg-purple-50 transition-all duration-200">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{cliente.nome}</div>
                        {cliente.cpf_cnpj && (
                          <div className="text-sm text-gray-500">{cliente.cpf_cnpj}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{cliente.telefone}</div>
                      {cliente.email && (
                        <div className="text-sm text-gray-500">{cliente.email}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {cliente.cidade || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        cliente.ativo
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {cliente.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {format(new Date(cliente.created_at), 'dd/MM/yyyy')}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => navigate(`/clientes/${cliente.id}`)}
                        className="text-purple-600 hover:text-purple-800 hover:bg-purple-50 p-2 rounded-lg transition-all"
                        title="Ver detalhes"
                      >
                        <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => navigate(`/clientes/${cliente.id}/editar`)}
                        className="text-purple-600 hover:text-purple-800 hover:bg-purple-50 p-2 rounded-lg transition-all"
                        title="Editar"
                      >
                        <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      {cliente.ativo ? (
                        <button
                          onClick={() => handleInativar(cliente.id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-all"
                          title="Inativar"
                        >
                          <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                          </svg>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReativar(cliente.id)}
                          className="text-green-600 hover:text-green-800 hover:bg-green-50 p-2 rounded-lg transition-all"
                          title="Reativar"
                        >
                          <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Clientes;
