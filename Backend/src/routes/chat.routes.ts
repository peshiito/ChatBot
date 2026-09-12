import { Router } from 'express';
import { env } from '../config/env';
import { crearRateLimit } from '../middlewares/rateLimit';
import { validarChat } from '../middlewares/validarChat';
import { postChat } from '../controllers/chat.controller';

export const chatRouter = Router();

const limiteChat = crearRateLimit({
  ventanaMs: env.limites.rateLimitVentanaMs,
  max: env.limites.rateLimitMax,
  mensaje: 'Hiciste muchas preguntas seguidas. Esperá unos segundos y probá de nuevo.',
});

chatRouter.post('/chat', limiteChat, validarChat, postChat);
