import { z } from 'zod';

/**
 * Schemas de validação Zod para os endpoints
 */

// Schema para criar agendamento
export const createAgendamentoSchema = z.object({
  // Dados do Cliente (obrigatórios)
  cliente_nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  cliente_telefone: z.string().min(10, 'Telefone inválido'),
  cliente_email: z.string().email('Email inválido').optional().or(z.literal('')),
  cliente_endereco: z.string().optional(),
  cliente_bairro: z.string().optional(),
  cliente_cidade: z.string().optional(),
  cliente_cep: z.string().optional(),

  // Dados do Evento (obrigatórios)
  tipo_servico: z.enum(['brinquedos', 'recreacao', 'decoracao', 'completo']),
  data_evento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),
  hora_inicio: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Hora deve estar no formato HH:MM ou HH:MM:SS'),
  hora_fim: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Hora deve estar no formato HH:MM ou HH:MM:SS'),
  tipo_evento: z.string().optional(),
  num_convidados: z.number().int().positive().optional(),
  faixa_etaria: z.enum(['infantil', 'adolescente', 'adulto', 'misto']).optional(),

  // Itens Solicitados
  brinquedos_selecionados: z.array(z.object({
    id: z.string(),
    nome: z.string(),
    quantidade: z.number().int().positive(),
    valor: z.number().nonnegative(),
  })).optional(),
  recreadores_quantidade: z.number().int().nonnegative().optional(),
  itens_decoracao: z.array(z.object({
    id: z.string(),
    nome: z.string(),
    quantidade: z.number().int().positive(),
    valor: z.number().nonnegative(),
  })).optional(),
  tema_decoracao: z.string().optional(),

  // Financeiro
  valor_total: z.number().nonnegative().optional(),
  valor_sinal: z.number().nonnegative().optional(),
  valor_restante: z.number().nonnegative().optional(),
  forma_pagamento: z.string().optional(),
  status_pagamento: z.enum(['pendente', 'sinal_pago', 'pago', 'cancelado']).optional(),

  // Status e Observações
  status: z.enum(['pendente', 'confirmado', 'em_preparacao', 'entregue', 'finalizado', 'cancelado']).optional(),
  observacoes: z.string().optional(),
  observacoes_internas: z.string().optional(),

  // Logística
  necessita_montagem: z.boolean().optional(),
  hora_montagem: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/).optional(),
  necessita_desmontagem: z.boolean().optional(),
  hora_desmontagem: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/).optional(),
  responsavel_entrega: z.string().optional(),
});

// Schema para atualizar agendamento (parcial)
export const updateAgendamentoSchema = createAgendamentoSchema.partial();

// Schema para atualizar status
export const updateStatusSchema = z.object({
  status: z.enum(['pendente', 'confirmado', 'em_preparacao', 'entregue', 'finalizado', 'cancelado']),
});

// Schema para verificar disponibilidade
export const verificarDisponibilidadeSchema = z.object({
  dataEvento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),
  horaInicio: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Hora deve estar no formato HH:MM ou HH:MM:SS'),
  horaFim: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Hora deve estar no formato HH:MM ou HH:MM:SS'),
  excludeId: z.string().uuid().optional(),
});

// Schema para query params de listagem
export const listAgendamentosQuerySchema = z.object({
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  dataInicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  dataFim: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  status: z.enum(['pendente', 'confirmado', 'em_preparacao', 'entregue', 'finalizado', 'cancelado']).optional(),
  tipoServico: z.enum(['brinquedos', 'recreacao', 'decoracao', 'completo']).optional(),
  cliente: z.string().optional(),
});

// Schema para validar UUID em params
export const uuidParamSchema = z.object({
  id: z.string().uuid('ID inválido'),
});
