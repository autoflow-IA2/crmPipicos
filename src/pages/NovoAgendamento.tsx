import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AgendamentoForm } from '../components/agendamentos';

const NovoAgendamento: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Obter parâmetros da URL (quando vem do calendário)
  const dataEvento = searchParams.get('data');
  const horaInicio = searchParams.get('horaInicio');
  const horaFim = searchParams.get('horaFim');

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
        <h1 className="text-3xl font-bold text-black">Novo Agendamento</h1>
        <p className="text-black font-bold mt-2">
          Preencha os dados abaixo para criar um novo agendamento
        </p>
        {dataEvento && (
          <div className="mt-2 bg-purple-50 border-l-4 border-purple-400 p-3 rounded">
            <p className="text-sm font-bold text-purple-800">
              📅 Data e horário pré-selecionados do calendário
            </p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <AgendamentoForm
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          initialData={dataEvento && horaInicio && horaFim ? {
            data_evento: dataEvento,
            hora_inicio: horaInicio,
            hora_fim: horaFim,
          } : undefined}
        />
      </div>
    </div>
  );
};

export default NovoAgendamento;
