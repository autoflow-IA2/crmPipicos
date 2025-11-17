import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAgendamento } from '../hooks/useAgendamentos';
import { AgendamentoForm } from '../components/agendamentos';
import { Loading } from '../components/common';

const EditarAgendamento: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: agendamento, isLoading, error } = useAgendamento(id!);

  const handleSuccess = () => {
    navigate(`/agendamentos/${id}`);
  };

  const handleCancel = () => {
    navigate(`/agendamentos/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loading size="lg" message="Carregando agendamento..." />
      </div>
    );
  }

  if (error || !agendamento) {
    return (
      <div className="max-w-5xl mx-auto">
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
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Editar Agendamento</h1>
        <p className="text-gray-600 mt-2">
          Modifique os dados do agendamento de {agendamento.cliente_nome}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <AgendamentoForm
          initialData={agendamento}
          mode="edit"
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default EditarAgendamento;
