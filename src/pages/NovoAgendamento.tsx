import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AgendamentoForm } from '../components/agendamentos';

const NovoAgendamento: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    // Redirecionar para a lista de agendamentos após sucesso
    navigate('/agendamentos');
  };

  const handleCancel = () => {
    // Voltar para a lista de agendamentos
    navigate('/agendamentos');
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Novo Agendamento</h1>
        <p className="text-gray-600 mt-2">
          Preencha os dados abaixo para criar um novo agendamento
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <AgendamentoForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </div>
    </div>
  );
};

export default NovoAgendamento;
