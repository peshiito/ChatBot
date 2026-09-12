import type { Request, Response, NextFunction, RequestHandler } from 'express';

interface OpcionesRateLimit {
  ventanaMs: number;
  max: number;
  mensaje: string;
}

/**
 * Rate limit por IP con ventana deslizante, en memoria.
 * Alcanza para un demo en un solo proceso; con varias instancias haría falta Redis.
 */
export function crearRateLimit({ ventanaMs, max, mensaje }: OpcionesRateLimit): RequestHandler {
  const solicitudes = new Map<string, number[]>();

  // Limpieza periódica para que el Map no crezca con IPs que ya no vuelven.
  setInterval(() => {
    const limite = Date.now() - ventanaMs;
    for (const [ip, tiempos] of solicitudes) {
      if (tiempos.every((t) => t < limite)) solicitudes.delete(ip);
    }
  }, ventanaMs).unref();

  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip ?? 'desconocida';
    const ahora = Date.now();
    const recientes = (solicitudes.get(ip) ?? []).filter((t) => ahora - t < ventanaMs);

    if (recientes.length >= max) {
      const segundos = Math.max(1, Math.ceil((recientes[0]! + ventanaMs - ahora) / 1000));
      res.setHeader('Retry-After', String(segundos));
      res.status(429).json({ error: mensaje, reintentar_en_segundos: segundos });
      return;
    }

    recientes.push(ahora);
    solicitudes.set(ip, recientes);
    next();
  };
}
