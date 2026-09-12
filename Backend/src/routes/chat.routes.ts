import { Router } from 'express';
import { env } from '../config/env';
import { crearRateLimit } from '../middlewares/rateLimit';
import { validarChat } from '../middlewares/validarChat';
import { postChat } from '../controllers/chat.controller';

export const chatRouter = Router();

const limitePorIp = crearRateLimit({
  ventanaMs: env.limites.rateLimitVentanaMs,
  max: env.limites.rateLimitMax,
  mensaje: 'Hiciste muchas preguntas seguidas. Esperá unos segundos y probá de nuevo.',
});

// Muchas IPs distintas también agotan el cupo de la IA: este techo vale para todos juntos.
const limiteGlobal = crearRateLimit({
  ventanaMs: env.limites.rateLimitVentanaMs,
  max: env.limites.rateLimitGlobalMax,
  mensaje: 'El asesor está atendiendo muchas consultas. Probá de nuevo en un minuto.',
  clave: () => 'global',
});

chatRouter.post('/chat', limiteGlobal, limitePorIp, validarChat, postChat);
