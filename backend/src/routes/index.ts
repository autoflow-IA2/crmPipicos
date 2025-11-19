import { Router } from 'express';
import agendamentosRoutes from './agendamentos.routes';

const router = Router();

// Rota de health check
router.get('/health', (_req, res) => {
  res.json({
    success: true,
    data: {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    },
    message: 'API está funcionando corretamente',
  });
});

// Rotas de agendamentos
router.use('/agendamentos', agendamentosRoutes);

export default router;
