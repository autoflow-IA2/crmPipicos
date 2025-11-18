import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEstatsticas, useAgendamentosHoje } from '../hooks';
import { Loading } from '../components/common';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { data: estatisticas, isLoading: loadingStats } = useEstatsticas();
  const { data: agendamentosHoje = [], isLoading: loadingHoje } = useAgendamentosHoje();

  const isLoading = loadingStats || loadingHoje;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loading size="lg" message="Carregando dashboard..." />
      </div>
    );
  }

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-black mb-6">Dashboard</h1>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-black">Total Agendamentos</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {estatisticas?.total || 0}
              </p>
            </div>
            <div className="bg-primary-100 p-3 rounded-lg">
              <svg className="w-8 h-8 text-primary-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-black">Agendamentos Hoje</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {estatisticas?.hoje || 0}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <svg className="w-8 h-8 text-green-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-black">Receita Mensal</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">
                {formatarMoeda(estatisticas?.receitaMensal || 0)}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <svg className="w-8 h-8 text-yellow-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-black">Pendentes</p>
              <p className="text-3xl font-bold text-red-600 mt-2">
                {estatisticas?.pendentes || 0}
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <svg className="w-8 h-8 text-red-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Eventos de Hoje */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-black mb-4">Eventos de Hoje</h2>
        {agendamentosHoje.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-black font-semibold">Nenhum evento agendado para hoje</p>
            <p className="text-sm mt-2 text-gray-700">
              {estatisticas?.total === 0
                ? 'Comece criando seu primeiro agendamento!'
                : 'Aproveite o dia livre!'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {agendamentosHoje.map((agendamento) => (
              <div
                key={agendamento.id}
                className="flex items-center justify-between p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer border border-purple-100"
                onClick={() => navigate(`/agendamentos/${agendamento.id}`)}
              >
                <div className="flex-1">
                  <h3 className="font-bold text-black">
                    {agendamento.cliente_nome}
                  </h3>
                  <p className="text-sm font-semibold text-gray-700">
                    {agendamento.tipo_evento || 'Evento'}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {agendamento.hora_inicio} - {agendamento.hora_fim}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <p className="font-bold text-black">
                    {formatarMoeda(Number(agendamento.valor_total) || 0)}
                  </p>
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                      agendamento.status === 'confirmado'
                        ? 'bg-green-100 text-green-800'
                        : agendamento.status === 'pendente'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {agendamento.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          className="bg-primary-600 text-white rounded-lg shadow-md p-6 hover:bg-primary-700 transition-colors cursor-pointer"
          onClick={() => navigate('/agendamentos')}
        >
          <h3 className="text-lg font-semibold mb-2">Novo Agendamento</h3>
          <p className="text-sm opacity-90">Criar um novo agendamento</p>
        </div>

        <div
          className="bg-green-600 text-white rounded-lg shadow-md p-6 hover:bg-green-700 transition-colors cursor-pointer"
          onClick={() => navigate('/calendario')}
        >
          <h3 className="text-lg font-semibold mb-2">Ver Calendário</h3>
          <p className="text-sm opacity-90">Visualizar todos os agendamentos</p>
        </div>

        <div
          className="bg-yellow-600 text-white rounded-lg shadow-md p-6 hover:bg-yellow-700 transition-colors cursor-pointer"
          onClick={() => navigate('/relatorios')}
        >
          <h3 className="text-lg font-semibold mb-2">Relatórios</h3>
          <p className="text-sm opacity-90">Gerar relatórios financeiros</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
