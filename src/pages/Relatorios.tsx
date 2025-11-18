import React, { useState } from 'react';
import { useAgendamentos } from '../hooks';
import { Button, Loading } from '../components/common';
import { exportAgendamentosToExcel, exportAgendamentosToPDF, exportRelatorioFinanceiroPDF } from '../services/export.service';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import toast from 'react-hot-toast';

const Relatorios: React.FC = () => {
  const [dataInicio, setDataInicio] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
  const [dataFim, setDataFim] = useState(format(endOfMonth(new Date()), 'yyyy-MM-dd'));
  const [tipoRelatorio, setTipoRelatorio] = useState<'geral' | 'financeiro' | 'mensal'>('geral');

  const { data: agendamentos = [], isLoading } = useAgendamentos({
    dataInicio,
    dataFim,
  });

  // Cálculos
  const totalAgendamentos = agendamentos.length;
  const receitaTotal = agendamentos.reduce((sum, ag) => sum + (ag.valor_total || 0), 0);
  const valorRecebido = agendamentos.reduce((sum, ag) => sum + (ag.valor_sinal || 0), 0);
  const valorPendente = agendamentos.reduce((sum, ag) => sum + (ag.valor_restante || 0), 0);

  // Agendamentos por status
  const porStatus = agendamentos.reduce((acc, ag) => {
    acc[ag.status] = (acc[ag.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Receita por tipo de serviço
  const porTipo = agendamentos.reduce((acc, ag) => {
    acc[ag.tipo_servico] = (acc[ag.tipo_servico] || 0) + (ag.valor_total || 0);
    return acc;
  }, {} as Record<string, number>);

  const handleExportExcel = () => {
    if (agendamentos.length === 0) {
      toast.error('Nenhum agendamento para exportar');
      return;
    }

    toast.loading('Gerando arquivo Excel...');
    setTimeout(() => {
      exportAgendamentosToExcel(agendamentos, 'relatorio_agendamentos');
      toast.dismiss();
      toast.success('Arquivo Excel gerado com sucesso!');
    }, 500);
  };

  const handleExportPDF = () => {
    if (agendamentos.length === 0) {
      toast.error('Nenhum agendamento para exportar');
      return;
    }

    toast.loading('Gerando PDF...');
    setTimeout(() => {
      exportAgendamentosToPDF(agendamentos, 'relatorio_agendamentos');
      toast.dismiss();
      toast.success('PDF gerado com sucesso!');
    }, 500);
  };

  const handleExportFinanceiro = () => {
    if (agendamentos.length === 0) {
      toast.error('Nenhum agendamento para exportar');
      return;
    }

    toast.loading('Gerando relatório financeiro...');
    setTimeout(() => {
      exportRelatorioFinanceiroPDF(agendamentos, { inicio: dataInicio, fim: dataFim });
      toast.dismiss();
      toast.success('Relatório financeiro gerado com sucesso!');
    }, 500);
  };

  const setPeriodoMesAtual = () => {
    setDataInicio(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
    setDataFim(format(endOfMonth(new Date()), 'yyyy-MM-dd'));
  };

  const setPeriodoMesAnterior = () => {
    const mesAnterior = subMonths(new Date(), 1);
    setDataInicio(format(startOfMonth(mesAnterior), 'yyyy-MM-dd'));
    setDataFim(format(endOfMonth(mesAnterior), 'yyyy-MM-dd'));
  };

  if (isLoading) {
    return <Loading size="lg" message="Carregando dados..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">Relatórios e Análises</h1>
      </div>

      {/* Filtros de Período */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-black mb-4">Período do Relatório</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-bold text-black mb-1">Data Inicial</label>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-black mb-1">Data Final</label>
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex items-end gap-2">
            <Button variant="secondary" onClick={setPeriodoMesAtual}>
              Mês Atual
            </Button>
            <Button variant="secondary" onClick={setPeriodoMesAnterior}>
              Mês Anterior
            </Button>
          </div>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-sm font-bold text-black">Total de Agendamentos</div>
          <div className="text-3xl font-bold text-purple-600 mt-2">{totalAgendamentos}</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-sm font-bold text-black">Receita Total</div>
          <div className="text-3xl font-bold text-green-600 mt-2">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(receitaTotal)}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-sm font-bold text-black">Valor Recebido</div>
          <div className="text-3xl font-bold text-blue-600 mt-2">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorRecebido)}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-sm font-bold text-black">Valor Pendente</div>
          <div className="text-3xl font-bold text-yellow-600 mt-2">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorPendente)}
          </div>
        </div>
      </div>

      {/* Análises */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Por Status */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-black mb-4">Agendamentos por Status</h3>
          <div className="space-y-3">
            {Object.entries(porStatus).map(([status, count]) => (
              <div key={status} className="flex justify-between items-center">
                <span className="text-black font-bold capitalize">{status}</span>
                <span className="text-lg font-bold text-purple-600">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Por Tipo de Serviço */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-black mb-4">Receita por Tipo de Serviço</h3>
          <div className="space-y-3">
            {Object.entries(porTipo).map(([tipo, valor]) => (
              <div key={tipo} className="flex justify-between items-center">
                <span className="text-black font-bold capitalize">{tipo}</span>
                <span className="text-lg font-bold text-green-600">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Opções de Exportação */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-black mb-4">Exportar Relatório</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border-2 border-purple-200 rounded-lg p-4 hover:border-purple-400 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-black">Excel (XLSX)</h3>
                <p className="text-sm text-gray-600">Planilha completa</p>
              </div>
            </div>
            <Button variant="success" onClick={handleExportExcel} className="w-full">
              Exportar Excel
            </Button>
          </div>

          <div className="border-2 border-purple-200 rounded-lg p-4 hover:border-purple-400 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-red-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-black">PDF</h3>
                <p className="text-sm text-gray-600">Listagem resumida</p>
              </div>
            </div>
            <Button variant="danger" onClick={handleExportPDF} className="w-full">
              Exportar PDF
            </Button>
          </div>

          <div className="border-2 border-purple-200 rounded-lg p-4 hover:border-purple-400 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-purple-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-black">Financeiro (PDF)</h3>
                <p className="text-sm text-gray-600">Análise detalhada</p>
              </div>
            </div>
            <Button variant="primary" onClick={handleExportFinanceiro} className="w-full">
              Relatório Financeiro
            </Button>
          </div>
        </div>
      </div>

      {/* Tabela de Agendamentos */}
      {agendamentos.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-black mb-4">
            Agendamentos no Período ({agendamentos.length})
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase">Cliente</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase">Data</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase">Tipo</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {agendamentos.map((agendamento) => (
                  <tr key={agendamento.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-bold text-black">{agendamento.cliente_nome}</td>
                    <td className="px-4 py-3 text-sm text-black">
                      {format(new Date(agendamento.data_evento + 'T00:00:00'), 'dd/MM/yyyy')}
                    </td>
                    <td className="px-4 py-3 text-sm text-black capitalize">{agendamento.tipo_servico}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                        {agendamento.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-black">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                        agendamento.valor_total || 0
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {agendamentos.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12">
          <div className="text-center text-black">
            <svg className="w-24 h-24 mx-auto mb-4 text-purple-300" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            <h2 className="text-2xl font-bold mb-2">Nenhum Agendamento Encontrado</h2>
            <p className="text-black font-bold">
              Não há agendamentos no período selecionado
            </p>
            <p className="text-sm mt-2 text-gray-700">
              Tente selecionar um período diferente ou criar novos agendamentos
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Relatorios;
