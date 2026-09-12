import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { apiRouter } from './routes';
import { manejarErrores, noEncontrado } from './middlewares/errores';

export function crearApp(): express.Express {
  const app = express();

  app.disable('x-powered-by');
  // Detras de un proxy (Render, Nginx) la IP real llega en X-Forwarded-For.
  app.set('trust proxy', 1);

  app.use(cors({ origin: env.corsOrigen }));
  // El chat manda el historial completo en cada pregunta.
  app.use(express.json({ limit: '100kb' }));

  app.use('/api', apiRouter);

  app.use(noEncontrado);
  app.use(manejarErrores);

  return app;
}
