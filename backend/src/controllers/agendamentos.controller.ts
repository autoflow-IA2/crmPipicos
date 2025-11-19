import { Request, Response, NextFunction } from 'express';
import { agendamentosService } from '../services/agendamentos.service';
import { ResponseUtils } from '../utils/response.utils';
import { ApiError } from '../middlewares/errorHandler.middleware';
import type {
  CreateAgendamentoDTO,
  AgendamentoFilters,
  VerificarDisponibilidadeDTO,
  DisponibilidadeResponse,
} from '../types/agendamento.types';

export class AgendamentosController {
  /**
   * GET /api/agendamentos
   * Lista agendamentos com filtros opcionais
   */
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const filters: AgendamentoFilters = req.query;
      const agendamentos = await agendamentosService.getAll(filters);

      ResponseUtils.success(res, agendamentos, 'Agendamentos listados com sucesso');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/agendamentos/:id
   * Busca agendamento por ID
   */
  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const agendamento = await agendamentosService.getById(id);

      if (!agendamento) {
        throw new ApiError(404, 'NOT_FOUND', 'Agendamento não encontrado');
      }

      ResponseUtils.success(res, agendamento, 'Agendamento encontrado');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/agendamentos
   * Cria novo agendamento
   */
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const agendamentoData: CreateAgendamentoDTO = req.body;

      // Verificar conflitos de horário
      const conflitos = await agendamentosService.checkConflicts(
        agendamentoData.data_evento,
        agendamentoData.hora_inicio,
        agendamentoData.hora_fim
      );

      // Criar o agendamento
      const novoAgendamento = await agendamentosService.create(agendamentoData);

      // Retornar com avisos se houver conflitos
      if (conflitos.length > 0) {
        ResponseUtils.created(res, {
          agendamento: novoAgendamento,
          avisos: {
            conflitos_horario: conflitos,
            mensagem: `Atenção: Existem ${conflitos.length} agendamento(s) conflitante(s) no mesmo horário.`,
          },
        }, 'Agendamento criado com sucesso, mas existem conflitos de horário');
      } else {
        ResponseUtils.created(res, novoAgendamento, 'Agendamento criado com sucesso');
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/agendamentos/:id
   * Atualiza agendamento
   */
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Verificar se existe
      const exists = await agendamentosService.getById(id);
      if (!exists) {
        throw new ApiError(404, 'NOT_FOUND', 'Agendamento não encontrado');
      }

      // Atualizar
      const agendamentoAtualizado = await agendamentosService.update(id, updateData);

      ResponseUtils.success(res, agendamentoAtualizado, 'Agendamento atualizado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/agendamentos/:id/status
   * Atualiza status do agendamento
   */
  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      // Verificar se existe
      const exists = await agendamentosService.getById(id);
      if (!exists) {
        throw new ApiError(404, 'NOT_FOUND', 'Agendamento não encontrado');
      }

      // Atualizar status
      const agendamentoAtualizado = await agendamentosService.updateStatus(id, status);

      ResponseUtils.success(res, agendamentoAtualizado, 'Status atualizado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/agendamentos/:id
   * Deleta agendamento
   */
  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Verificar se existe
      const exists = await agendamentosService.getById(id);
      if (!exists) {
        throw new ApiError(404, 'NOT_FOUND', 'Agendamento não encontrado');
      }

      // Deletar
      await agendamentosService.delete(id);

      ResponseUtils.success(res, { id }, 'Agendamento deletado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/agendamentos/verificar-disponibilidade
   * Verifica conflitos de horário
   */
  static async verificarDisponibilidade(req: Request, res: Response, next: NextFunction) {
    try {
      const { dataEvento, horaInicio, horaFim, excludeId }: VerificarDisponibilidadeDTO = req.body;

      const conflitos = await agendamentosService.checkConflicts(
        dataEvento,
        horaInicio,
        horaFim,
        excludeId
      );

      const response: DisponibilidadeResponse = {
        disponivel: conflitos.length === 0,
        conflitos: conflitos.map(c => ({
          id: c.id,
          cliente_nome: c.cliente_nome,
          data_evento: c.data_evento,
          hora_inicio: c.hora_inicio,
          hora_fim: c.hora_fim,
          tipo_servico: c.tipo_servico,
        })),
      };

      ResponseUtils.success(res, response,
        conflitos.length === 0
          ? 'Horário disponível'
          : `${conflitos.length} conflito(s) encontrado(s)`
      );
    } catch (error) {
      next(error);
    }
  }
}
