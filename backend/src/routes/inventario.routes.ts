import { Router } from 'express';
import * as inventarioController from '../controllers/inventario.controller';

const router = Router();

/**
 * @route POST /api/inventario/verificar-disponibilidade
 * @desc Verifica disponibilidade de um brinquedo específico para uma data/horário
 * @access Autenticado (API Key)
 */
router.post('/verificar-disponibilidade', inventarioController.verificarDisponibilidade);

/**
 * @route POST /api/inventario/verificar-multiplos
 * @desc Verifica disponibilidade de múltiplos brinquedos de uma vez
 * @access Autenticado (API Key)
 */
router.post('/verificar-multiplos', inventarioController.verificarDisponibilidadeMultiplos);

/**
 * @route GET /api/inventario/disponibilidade-periodo
 * @desc Retorna disponibilidade de itens em um período (para calendário)
 * @query data_inicio, data_fim, brinquedo_id (opcional)
 * @access Autenticado (API Key)
 */
router.get('/disponibilidade-periodo', inventarioController.obterDisponibilidadePeriodo);

/**
 * @route POST /api/inventario/finalizar-eventos-passados
 * @desc Finaliza automaticamente eventos que já passaram (cron job)
 * @access Autenticado (API Key)
 */
router.post('/finalizar-eventos-passados', inventarioController.finalizarEventosPassados);

export default router;
