import express from 'express';
import { env } from './config/env';
import { apiRouter } from './routes';
import { cabecerasSeguras, corsControlado } from './middlewares/seguridad';
import { crearRateLimit } from './middlewares/rateLimit';
import { manejarErrores, noEncontrado } from './middlewares/errores';

export function crearApp(): express.Express {
  const app = express();

  app.disable('x-powered-by');
  // Detras de un proxy (Render, Nginx) la IP real llega en X-Forwarded-For.
  app.set('trust proxy', 1);

  app.use(cabecerasSeguras());
  app.use(corsControlado());
  // Techo general de la API. Alto a propósito: navegar el catálogo no tiene que rozarlo.
  app.use(
    crearRateLimit({
      ventanaMs: env.limites.rateLimitVentanaMs,
      max: env.limites.rateLimitApiMax,
      mensaje: 'El sitio está recibiendo muchas consultas. Probá de nuevo en un minuto.',
      clave: () => 'global',
    }),
  );
  // El chat manda el historial completo en cada pregunta.
  app.use(express.json({ limit: '100kb' }));

  app.use('/api', apiRouter);

  app.use(noEncontrado);
  app.use(manejarErrores);

  return app;
}
