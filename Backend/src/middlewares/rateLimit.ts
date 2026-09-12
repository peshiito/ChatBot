import type { Request, Response, NextFunction, RequestHandler } from 'express';

interface OpcionesRateLimit {
  ventanaMs: number;
  max: number;
  mensaje: string;
  /** Con qué se agrupa el conteo. Por defecto la IP; `() => 'global'` cuenta todo junto. */
  clave?: (req: Request) => string;
}

/**
 * Rate limit con ventana deslizante, en memoria.
 * Alcanza para un demo en un solo proceso; con varias instancias haría falta Redis.
 */
export function crearRateLimit({ ventanaMs, max, mensaje, clave }: OpcionesRateLimit): RequestHandler {
  const solicitudes = new Map<string, number[]>();
  const claveDe = clave ?? ((req: Request) => req.ip ?? 'desconocida');

  // Limpieza periódica para que el Map no crezca con IPs que ya no vuelven.
  setInterval(() => {
    const limite = Date.now() - ventanaMs;
    for (const [id, tiempos] of solicitudes) {
      if (tiempos.every((t) => t < limite)) solicitudes.delete(id);
    }
  }, ventanaMs).unref();

  return (req: Request, res: Response, next: NextFunction) => {
    const id = claveDe(req);
    const ahora = Date.now();
    const recientes = (solicitudes.get(id) ?? []).filter((t) => ahora - t < ventanaMs);

    if (recientes.length >= max) {
      const segundos = Math.max(1, Math.ceil((recientes[0]! + ventanaMs - ahora) / 1000));
      res.setHeader('Retry-After', String(segundos));
      res.status(429).json({ error: mensaje, reintentar_en_segundos: segundos });
      return;
    }

    recientes.push(ahora);
    solicitudes.set(id, recientes);
    next();
  };
}
