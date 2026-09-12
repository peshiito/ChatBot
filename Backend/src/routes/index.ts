import { Router } from 'express';
import { verificarConexion } from '../config/db';
import { productosRouter } from './productos.routes';
import { chatRouter } from './chat.routes';

export const apiRouter = Router();

apiRouter.get('/salud', async (_req, res) => {
  await verificarConexion();
  res.json({ estado: 'ok', base: 'conectada' });
});

apiRouter.use(productosRouter);
apiRouter.use(chatRouter);
