import { Router } from 'express';
import { AgendamentosController } from '../controllers/agendamentos.controller';
import { validateRequest, validateParams, validateQuery } from '../middlewares/validation.middleware';
import {
  createAgendamentoSchema,
  updateAgendamentoSchema,
  updateStatusSchema,
  verificarDisponibilidadeSchema,
  listAgendamentosQuerySchema,
  uuidParamSchema,
} from '../types/validation.schemas';

const router = Router();

/**
 * GET /api/agendamentos
 * Lista agendamentos com filtros opcionais
 * Query params: data, dataInicio, dataFim, status, tipoServico, cliente
 */
router.get(
  '/',
  validateQuery(listAgendamentosQuerySchema),
  AgendamentosController.list
);

/**
 * GET /api/agendamentos/:id
 * Busca agendamento específico por ID
 */
router.get(
  '/:id',
  validateParams(uuidParamSchema),
  AgendamentosController.getById
);

/**
 * POST /api/agendamentos
 * Cria novo agendamento
 * Verifica conflitos automaticamente e retorna avisos se houver
 */
router.post(
  '/',
  validateRequest(createAgendamentoSchema),
  AgendamentosController.create
);

/**
 * PATCH /api/agendamentos/:id
 * Atualiza agendamento existente
 */
router.patch(
  '/:id',
  validateParams(uuidParamSchema),
  validateRequest(updateAgendamentoSchema),
  AgendamentosController.update
);

/**
 * PATCH /api/agendamentos/:id/status
 * Atualiza apenas o status do agendamento
 */
router.patch(
  '/:id/status',
  validateParams(uuidParamSchema),
  validateRequest(updateStatusSchema),
  AgendamentosController.updateStatus
);

/**
 * DELETE /api/agendamentos/:id
 * Deleta agendamento
 */
router.delete(
  '/:id',
  validateParams(uuidParamSchema),
  AgendamentosController.delete
);

/**
 * POST /api/agendamentos/verificar-disponibilidade
 * Verifica se há conflitos de horário
 */
router.post(
  '/verificar-disponibilidade',
  validateRequest(verificarDisponibilidadeSchema),
  AgendamentosController.verificarDisponibilidade
);

export default router;
