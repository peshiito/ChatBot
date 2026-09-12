import { randomUUID } from 'node:crypto';
import type { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';
import { ErrorHttp } from './errores';
import { recortarHistorial } from '../services/chat/historial';
import type { MensajeChat } from '../types/ia';
import type { SolicitudChat } from '../types/chat';

/** Tope duro contra abuso. Por debajo, el historial se recorta sin error. */
const HISTORIAL_MAX_ABSOLUTO = 200;
const PATRON_SESION = /^[A-Za-z0-9_-]{8,64}$/;

function validarMensaje(valor: unknown): string {
  if (typeof valor !== 'string' || valor.trim().length === 0) {
    throw new ErrorHttp(400, 'Escribí una pregunta para el asistente.');
  }
  const mensaje = valor.trim();
  const maximo = env.limites.mensajeMaxCaracteres;
  if (mensaje.length > maximo) {
    throw new ErrorHttp(400, `La pregunta es muy larga: el máximo es de ${maximo} caracteres.`);
  }
  return mensaje;
}

function validarHistorial(valor: unknown): MensajeChat[] {
  if (valor === undefined || valor === null) return [];
  if (!Array.isArray(valor)) {
    throw new ErrorHttp(400, 'El historial tiene que ser una lista de mensajes.');
  }
  if (valor.length > HISTORIAL_MAX_ABSOLUTO) {
    throw new ErrorHttp(400, 'El historial es demasiado largo.');
  }

  return valor.map((item, i) => {
    const m = item as Partial<MensajeChat> | null;
    const rolValido = m?.rol === 'user' || m?.rol === 'assistant';
    if (!rolValido || typeof m.contenido !== 'string' || m.contenido.trim() === '') {
      throw new ErrorHttp(400, `El mensaje ${i} del historial no es válido: necesita rol (user|assistant) y contenido.`);
    }
    return { rol: m.rol!, contenido: m.contenido };
  });
}

function resolverSesion(valor: unknown): string {
  if (typeof valor === 'string' && PATRON_SESION.test(valor)) return valor;
  return `ses_${randomUUID().replaceAll('-', '').slice(0, 16)}`;
}

/** Valida el cuerpo de POST /api/chat y deja la solicitud limpia en res.locals.solicitud. */
export function validarChat(req: Request, res: Response, next: NextFunction): void {
  const cuerpo = (req.body ?? {}) as Record<string, unknown>;

  const solicitud: SolicitudChat = {
    mensaje: validarMensaje(cuerpo.mensaje),
    historial: recortarHistorial(
      validarHistorial(cuerpo.historial),
      env.limites.historialMaxMensajes,
      env.limites.historialMaxCaracteres,
    ),
    sesionId: resolverSesion(cuerpo.sesion_id),
  };

  res.locals.solicitud = solicitud;
  next();
}
