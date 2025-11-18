/**
 * Serviço de Exportação
 * Funções para exportar dados para Excel e PDF
 */

import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Agendamento } from '../types';
import { format } from 'date-fns';

/**
 * Exporta agendamentos para Excel
 */
export const exportAgendamentosToExcel = (agendamentos: Agendamento[], filename = 'agendamentos') => {
  // Prepara os dados
  const data = agendamentos.map((agendamento) => ({
    'ID': agendamento.id,
    'Cliente': agendamento.cliente_nome,
    'Telefone': agendamento.cliente_telefone,
    'Email': agendamento.cliente_email || '',
    'Data do Evento': format(new Date(agendamento.data_evento + 'T00:00:00'), 'dd/MM/yyyy'),
    'Horário Início': agendamento.hora_inicio,
    'Horário Fim': agendamento.hora_fim,
    'Tipo de Evento': agendamento.tipo_evento || '',
    'Tipo de Serviço': agendamento.tipo_servico,
    'Nº Convidados': agendamento.num_convidados || '',
    'Status': agendamento.status,
    'Valor Total': `R$ ${(agendamento.valor_total || 0).toFixed(2)}`,
    'Valor Sinal': `R$ ${(agendamento.valor_sinal || 0).toFixed(2)}`,
    'Valor Restante': `R$ ${(agendamento.valor_restante || 0).toFixed(2)}`,
    'Forma de Pagamento': agendamento.forma_pagamento || '',
    'Status Pagamento': agendamento.status_pagamento || '',
    'Observações': agendamento.observacoes || '',
  }));

  // Cria a planilha
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Agendamentos');

  // Define larguras das colunas
  const colWidths = [
    { wch: 10 }, // ID
    { wch: 30 }, // Cliente
    { wch: 15 }, // Telefone
    { wch: 30 }, // Email
    { wch: 15 }, // Data
    { wch: 12 }, // Hora Início
    { wch: 12 }, // Hora Fim
    { wch: 20 }, // Tipo Evento
    { wch: 15 }, // Tipo Serviço
    { wch: 12 }, // Nº Convidados
    { wch: 15 }, // Status
    { wch: 15 }, // Valor Total
    { wch: 15 }, // Valor Sinal
    { wch: 15 }, // Valor Restante
    { wch: 20 }, // Forma Pagamento
    { wch: 18 }, // Status Pagamento
    { wch: 40 }, // Observações
  ];
  worksheet['!cols'] = colWidths;

  // Salva o arquivo
  XLSX.writeFile(workbook, `${filename}_${format(new Date(), 'dd-MM-yyyy')}.xlsx`);
};

/**
 * Exporta agendamentos para PDF
 */
export const exportAgendamentosToPDF = (agendamentos: Agendamento[], filename = 'agendamentos') => {
  const doc = new jsPDF('l', 'mm', 'a4'); // landscape, milímetros, A4

  // Título
  doc.setFontSize(18);
  doc.text('Relatório de Agendamentos', 14, 15);

  // Data de geração
  doc.setFontSize(10);
  doc.text(`Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 14, 22);

  // Prepara os dados da tabela
  const tableData = agendamentos.map((agendamento) => [
    agendamento.cliente_nome,
    format(new Date(agendamento.data_evento + 'T00:00:00'), 'dd/MM/yyyy'),
    `${agendamento.hora_inicio} - ${agendamento.hora_fim}`,
    agendamento.tipo_servico,
    agendamento.status,
    `R$ ${(agendamento.valor_total || 0).toFixed(2)}`,
  ]);

  // Cria a tabela
  autoTable(doc, {
    startY: 28,
    head: [['Cliente', 'Data', 'Horário', 'Tipo', 'Status', 'Valor']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [147, 51, 234], // purple-600
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 30 },
      2: { cellWidth: 40 },
      3: { cellWidth: 35 },
      4: { cellWidth: 35 },
      5: { cellWidth: 30, halign: 'right' },
    },
  });

  // Resumo financeiro
  const totalGeral = agendamentos.reduce((sum, ag) => sum + (ag.valor_total || 0), 0);
  const totalRecebido = agendamentos.reduce((sum, ag) => sum + (ag.valor_sinal || 0), 0);
  const totalPendente = agendamentos.reduce((sum, ag) => sum + (ag.valor_restante || 0), 0);

  const finalY = (doc as any).lastAutoTable.finalY || 28;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Resumo Financeiro:', 14, finalY + 10);

  doc.setFont('helvetica', 'normal');
  doc.text(`Total de Agendamentos: ${agendamentos.length}`, 14, finalY + 17);
  doc.text(`Valor Total: R$ ${totalGeral.toFixed(2)}`, 14, finalY + 24);
  doc.text(`Total Recebido (Sinais): R$ ${totalRecebido.toFixed(2)}`, 14, finalY + 31);
  doc.text(`Total Pendente: R$ ${totalPendente.toFixed(2)}`, 14, finalY + 38);

  // Salva o PDF
  doc.save(`${filename}_${format(new Date(), 'dd-MM-yyyy')}.pdf`);
};

/**
 * Exporta relatório financeiro para PDF
 */
export const exportRelatorioFinanceiroPDF = (
  agendamentos: Agendamento[],
  periodo: { inicio: string; fim: string }
) => {
  const doc = new jsPDF('p', 'mm', 'a4');

  // Título
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Relatório Financeiro', 105, 20, { align: 'center' });

  // Período
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `Período: ${format(new Date(periodo.inicio), 'dd/MM/yyyy')} a ${format(new Date(periodo.fim), 'dd/MM/yyyy')}`,
    105,
    28,
    { align: 'center' }
  );

  // Resumo Geral
  const totalGeral = agendamentos.reduce((sum, ag) => sum + (ag.valor_total || 0), 0);
  const totalRecebido = agendamentos.reduce((sum, ag) => sum + (ag.valor_sinal || 0), 0);
  const totalPendente = agendamentos.reduce((sum, ag) => sum + (ag.valor_restante || 0), 0);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Resumo Geral', 14, 40);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total de Agendamentos: ${agendamentos.length}`, 14, 50);
  doc.text(`Receita Total: R$ ${totalGeral.toFixed(2)}`, 14, 58);
  doc.text(`Valor Recebido: R$ ${totalRecebido.toFixed(2)}`, 14, 66);
  doc.text(`Valor Pendente: R$ ${totalPendente.toFixed(2)}`, 14, 74);

  // Agendamentos por Status
  const porStatus = agendamentos.reduce((acc, ag) => {
    acc[ag.status] = (acc[ag.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Agendamentos por Status', 14, 88);

  let yPos = 98;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  Object.entries(porStatus).forEach(([status, count]) => {
    doc.text(`${status}: ${count}`, 14, yPos);
    yPos += 8;
  });

  // Receita por Tipo de Serviço
  const porTipo = agendamentos.reduce((acc, ag) => {
    acc[ag.tipo_servico] = (acc[ag.tipo_servico] || 0) + (ag.valor_total || 0);
    return acc;
  }, {} as Record<string, number>);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Receita por Tipo de Serviço', 14, yPos + 8);

  yPos += 18;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  Object.entries(porTipo).forEach(([tipo, valor]) => {
    doc.text(`${tipo}: R$ ${valor.toFixed(2)}`, 14, yPos);
    yPos += 8;
  });

  // Tabela de Agendamentos
  autoTable(doc, {
    startY: yPos + 10,
    head: [['Cliente', 'Data', 'Tipo', 'Status', 'Valor', 'Sinal', 'Restante']],
    body: agendamentos.map((ag) => [
      ag.cliente_nome,
      format(new Date(ag.data_evento + 'T00:00:00'), 'dd/MM/yyyy'),
      ag.tipo_servico,
      ag.status,
      `R$ ${(ag.valor_total || 0).toFixed(2)}`,
      `R$ ${(ag.valor_sinal || 0).toFixed(2)}`,
      `R$ ${(ag.valor_restante || 0).toFixed(2)}`,
    ]),
    theme: 'striped',
    headStyles: {
      fillColor: [147, 51, 234],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 9,
    },
  });

  doc.save(`relatorio_financeiro_${format(new Date(), 'dd-MM-yyyy')}.pdf`);
};
