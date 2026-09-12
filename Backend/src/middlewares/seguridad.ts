import cors from 'cors';
import helmet from 'helmet';
import type { RequestHandler } from 'express';
import { env, esProduccion } from '../config/env';

/**
 * Cabeceras de seguridad. La API solo devuelve JSON, así que la CSP puede ser
 * la más cerrada posible: nada de scripts, estilos ni frames desde acá.
 */
export function cabecerasSeguras(): RequestHandler {
  return helmet({
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        'default-src': ["'none'"],
        'frame-ancestors': ["'none'"],
        'base-uri': ["'none'"],
        'form-action': ["'none'"],
      },
    },
    // Solo tiene efecto sobre HTTPS; en local el navegador la ignora.
    hsts: esProduccion ? { maxAge: 15_552_000, includeSubDomains: true } : false,
    referrerPolicy: { policy: 'no-referrer' },
    crossOriginResourcePolicy: { policy: 'same-site' },
  });
}

/**
 * CORS con lista blanca. Los pedidos sin Origin (curl, Postman, el health check
 * del hosting) se dejan pasar: CORS protege al navegador, no al servidor.
 */
export function corsControlado(): RequestHandler {
  const permitidos = new Set(env.corsOrigenes);

  return cors({
    origin(origen, callback) {
      if (!origen || permitidos.has(origen)) return callback(null, true);
      callback(new Error(`Origen no permitido: ${origen}`));
    },
    methods: ['GET', 'POST'],
    maxAge: 86_400,
  });
}
