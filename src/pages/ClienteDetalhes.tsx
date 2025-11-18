import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useClienteComAgendamentos, useDeleteCliente } from '../hooks';
import { Button, Loading } from '../components/common';
import { format } from 'date-fns';

const ClienteDetalhes: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: cliente, isLoading } = useClienteComAgendamentos(id);
  const deleteCliente = useDeleteCliente();

  const handleDelete = async () => {
    if (window.confirm(`Deseja realmente excluir o cliente ${cliente?.nome}? Esta ação não pode ser desfeita.`)) {
      await deleteCliente.mutateAsync(id!);
      navigate('/clientes');
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!cliente) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Cliente não encontrado
        </h2>
        <button
          onClick={() => navigate('/clientes')}
          className="text-primary-600 hover:text-primary-700"
        >
          Voltar para lista de clientes
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-800">{cliente.nome}</h1>
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
              cliente.ativo
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {cliente.ativo ? 'Ativo' : 'Inativo'}
            </span>
          </div>
          <p className="text-gray-600 mt-1">
            Cliente desde {format(new Date(cliente.created_at), 'dd/MM/yyyy')}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => navigate('/clientes')}
          >
            Voltar
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate(`/clientes/${id}/editar`)}
          >
            Editar
          </Button>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Agendamentos</p>
              <p className="text-3xl font-bold text-primary-600">{cliente.total_agendamentos || 0}</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-full">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Último Agendamento</p>
              <p className="text-lg font-bold text-gray-800">
                {cliente.ultimo_agendamento
                  ? format(new Date(cliente.ultimo_agendamento), 'dd/MM/yyyy')
                  : '-'}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Gasto</p>
              <p className="text-2xl font-bold text-green-600">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(cliente.valor_total_gasto || 0)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Informações Detalhadas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dados Pessoais */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Dados Pessoais</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Nome Completo</p>
              <p className="font-medium">{cliente.nome}</p>
            </div>
            {cliente.cpf_cnpj && (
              <div>
                <p className="text-sm text-gray-600">CPF/CNPJ</p>
                <p className="font-medium">{cliente.cpf_cnpj}</p>
              </div>
            )}
            {cliente.data_nascimento && (
              <div>
                <p className="text-sm text-gray-600">Data de Nascimento</p>
                <p className="font-medium">{format(new Date(cliente.data_nascimento), 'dd/MM/yyyy')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Contato */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Contato</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Telefone Principal</p>
              <p className="font-medium">{cliente.telefone}</p>
            </div>
            {cliente.telefone_alternativo && (
              <div>
                <p className="text-sm text-gray-600">Telefone Alternativo</p>
                <p className="font-medium">{cliente.telefone_alternativo}</p>
              </div>
            )}
            {cliente.email && (
              <div>
                <p className="text-sm text-gray-600">E-mail</p>
                <p className="font-medium">{cliente.email}</p>
              </div>
            )}
          </div>
        </div>

        {/* Endereço */}
        {(cliente.endereco || cliente.cidade) && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Endereço</h2>
            <div className="space-y-3">
              {cliente.cep && (
                <div>
                  <p className="text-sm text-gray-600">CEP</p>
                  <p className="font-medium">{cliente.cep}</p>
                </div>
              )}
              {cliente.endereco && (
                <div>
                  <p className="text-sm text-gray-600">Endereço</p>
                  <p className="font-medium">
                    {cliente.endereco}
                    {cliente.numero && `, ${cliente.numero}`}
                    {cliente.complemento && ` - ${cliente.complemento}`}
                  </p>
                </div>
              )}
              {(cliente.bairro || cliente.cidade || cliente.estado) && (
                <div>
                  <p className="text-sm text-gray-600">Cidade</p>
                  <p className="font-medium">
                    {cliente.bairro && `${cliente.bairro} - `}
                    {cliente.cidade}
                    {cliente.estado && `/${cliente.estado}`}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Observações */}
        {cliente.observacoes && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Observações</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{cliente.observacoes}</p>
          </div>
        )}
      </div>

      {/* Botão de Excluir */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-red-800">
                Zona de Perigo
              </h3>
              <p className="mt-2 text-sm text-red-700">
                Excluir este cliente removerá permanentemente todos os seus dados. Esta ação não pode ser desfeita.
              </p>
              <div className="mt-4">
                <Button
                  variant="secondary"
                  onClick={handleDelete}
                  disabled={deleteCliente.isPending}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {deleteCliente.isPending ? 'Excluindo...' : 'Excluir Cliente'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClienteDetalhes;
