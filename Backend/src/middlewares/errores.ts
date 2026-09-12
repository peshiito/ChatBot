import type { Request, Response, NextFunction } from 'express';
import { esProduccion } from '../config/env';
import { ErrorIA } from '../services/ia/cliente';
import type { RespuestaError } from '../types/chat';

/** Error con un mensaje apto para mostrarle al usuario final. */
export class ErrorHttp extends Error {
  constructor(
    public readonly status: number,
    public readonly mensajePublico: string,
  ) {
    super(mensajePublico);
    this.name = 'ErrorHttp';
  }
}

/** Lo que ve el usuario cuando falla la IA. El detalle técnico va solo al log. */
function traducirErrorIA(err: ErrorIA): { status: number; cuerpo: RespuestaError } {
  switch (err.tipo) {
    case 'limite': {
      const segundos = err.reintentarEnSegundos ?? 20;
      return {
        status: 429,
        cuerpo: {
          error: `El asistente está atendiendo muchas consultas en este momento. Probá de nuevo en ${segundos} segundos.`,
          reintentar_en_segundos: segundos,
        },
      };
    }
    case 'timeout':
      return { status: 504, cuerpo: { error: 'El asistente tardó demasiado en responder. Probá de nuevo.' } };
    case 'configuracion':
      return { status: 503, cuerpo: { error: 'El asistente no está disponible en este momento.' } };
    default:
      return { status: 502, cuerpo: { error: 'El asistente tuvo un problema para responder. Probá de nuevo en unos segundos.' } };
  }
}

export function noEncontrado(_req: Request, res: Response): void {
  res.status(404).json({ error: 'Ruta no encontrada.' });
}

/** Nunca devuelve un stack trace al cliente. */
export function manejarErrores(err: unknown, req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ErrorHttp) {
    res.status(err.status).json({ error: err.mensajePublico });
    return;
  }

  if (err instanceof ErrorIA) {
    console.error(`[ia] ${err.tipo}: ${err.message}`);
    const { status, cuerpo } = traducirErrorIA(err);
    if (cuerpo.reintentar_en_segundos) res.setHeader('Retry-After', String(cuerpo.reintentar_en_segundos));
    res.status(status).json(cuerpo);
    return;
  }

  // Errores del parser de JSON de Express.
  const tipo = (err as { type?: string }).type;
  if (tipo === 'entity.too.large') {
    res.status(413).json({ error: 'La solicitud es demasiado grande.' });
    return;
  }
  if (tipo === 'entity.parse.failed') {
    res.status(400).json({ error: 'El cuerpo de la solicitud no es JSON válido.' });
    return;
  }

  console.error(`[${req.method} ${req.originalUrl}]`, err);
  res.status(500).json({
    error: 'Ocurrió un error inesperado. Probá de nuevo en unos segundos.',
    ...(esProduccion ? {} : { detalle: err instanceof Error ? err.message : String(err) }),
  });
}
