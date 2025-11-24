import { Request, Response } from 'express';
import { z } from 'zod';
import inventarioService from '../services/inventario.service';

/**
 * Controller para endpoints de inventário e disponibilidade
 */

// Schemas de validação com Zod
const verificarDisponibilidadeSchema = z.object({
  brinquedo_nome: z.string().min(1, 'Nome do brinquedo é obrigatório').max(255, 'Nome muito longo'),
  data_evento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),
  hora_inicio: z.string().regex(/^\d{2}:\d{2}$/, 'Hora de início deve estar no formato HH:mm'),
  hora_fim: z.string().regex(/^\d{2}:\d{2}$/, 'Hora de fim deve estar no formato HH:mm'),
  quantidade_desejada: z.number().int().positive('Quantidade deve ser um número positivo'),
  excludeAgendamentoId: z.string().uuid().optional(),
});

const verificarMultiplosSchema = z.object({
  items: z
    .array(
      z.object({
        brinquedo_nome: z.string().min(1, 'Nome do brinquedo é obrigatório').max(255, 'Nome muito longo'),
        quantidade_desejada: z.number().int().positive('Quantidade deve ser um número positivo'),
      })
    )
    .min(1, 'Deve haver pelo menos um item'),
  data_evento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),
  hora_inicio: z.string().regex(/^\d{2}:\d{2}$/, 'Hora de início deve estar no formato HH:mm'),
  hora_fim: z.string().regex(/^\d{2}:\d{2}$/, 'Hora de fim deve estar no formato HH:mm'),
  excludeAgendamentoId: z.string().uuid().optional(),
});

const disponibilidadePeriodoSchema = z.object({
  data_inicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data de início deve estar no formato YYYY-MM-DD'),
  data_fim: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data de fim deve estar no formato YYYY-MM-DD'),
  brinquedo_nome: z.string().min(1).max(255).optional(),
});

export const verificarDisponibilidade = async (req: Request, res: Response) => {
  try {
    // Validar request body
    const validatedData = verificarDisponibilidadeSchema.parse(req.body);

    // Validação adicional: hora_fim deve ser maior que hora_inicio
    const [horaInicioH, horaInicioM] = validatedData.hora_inicio.split(':').map(Number);
    const [horaFimH, horaFimM] = validatedData.hora_fim.split(':').map(Number);
    const inicioMinutos = horaInicioH * 60 + horaInicioM;
    const fimMinutos = horaFimH * 60 + horaFimM;

    if (fimMinutos <= inicioMinutos) {
      return res.status(400).json({
        error: 'Hora de fim deve ser posterior à hora de início',
      });
    }

    // Chamar serviço
    const resultado = await inventarioService.verificarDisponibilidade(validatedData);

    return res.status(200).json(resultado);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: error.errors,
      });
    }

    if (error instanceof Error) {
      return res.status(500).json({
        error: 'Erro ao verificar disponibilidade',
        message: error.message,
      });
    }

    return res.status(500).json({
      error: 'Erro desconhecido ao verificar disponibilidade',
    });
  }
};

export const verificarDisponibilidadeMultiplos = async (req: Request, res: Response) => {
  try {
    // Validar request body
    const validatedData = verificarMultiplosSchema.parse(req.body);

    // Validação adicional: hora_fim deve ser maior que hora_inicio
    const [horaInicioH, horaInicioM] = validatedData.hora_inicio.split(':').map(Number);
    const [horaFimH, horaFimM] = validatedData.hora_fim.split(':').map(Number);
    const inicioMinutos = horaInicioH * 60 + horaInicioM;
    const fimMinutos = horaFimH * 60 + horaFimM;

    if (fimMinutos <= inicioMinutos) {
      return res.status(400).json({
        error: 'Hora de fim deve ser posterior à hora de início',
      });
    }

    // Chamar serviço
    const resultado = await inventarioService.verificarDisponibilidadeMultiplos(validatedData);

    return res.status(200).json(resultado);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: error.errors,
      });
    }

    if (error instanceof Error) {
      return res.status(500).json({
        error: 'Erro ao verificar disponibilidade',
        message: error.message,
      });
    }

    return res.status(500).json({
      error: 'Erro desconhecido ao verificar disponibilidade',
    });
  }
};

export const obterDisponibilidadePeriodo = async (req: Request, res: Response) => {
  try {
    // Validar query params
    const validatedData = disponibilidadePeriodoSchema.parse({
      data_inicio: req.query.data_inicio,
      data_fim: req.query.data_fim,
      brinquedo_nome: req.query.brinquedo_nome,
    });

    // Validação adicional: data_fim deve ser >= data_inicio
    if (validatedData.data_fim < validatedData.data_inicio) {
      return res.status(400).json({
        error: 'Data de fim deve ser posterior ou igual à data de início',
      });
    }

    // Chamar serviço
    const resultado = await inventarioService.calcularDisponibilidadePeriodo(validatedData);

    return res.status(200).json(resultado);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Parâmetros inválidos',
        details: error.errors,
      });
    }

    if (error instanceof Error) {
      return res.status(500).json({
        error: 'Erro ao obter disponibilidade do período',
        message: error.message,
      });
    }

    return res.status(500).json({
      error: 'Erro desconhecido ao obter disponibilidade',
    });
  }
};

export const finalizarEventosPassados = async (_req: Request, res: Response) => {
  try {
    const resultado = await inventarioService.finalizarEventosPassados();

    return res.status(200).json({
      message: 'Eventos passados finalizados com sucesso',
      ...resultado,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
        error: 'Erro ao finalizar eventos passados',
        message: error.message,
      });
    }

    return res.status(500).json({
      error: 'Erro desconhecido ao finalizar eventos',
    });
  }
};
