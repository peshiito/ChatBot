import type { Request, Response } from 'express';
import { responder } from '../services/ia/asistente';
import { registrarIntercambio } from '../services/chat/registro';
import type { SolicitudChat, RespuestaChat } from '../types/chat';

export async function postChat(_req: Request, res: Response<RespuestaChat>): Promise<void> {
  const { mensaje, historial, sesionId } = res.locals.solicitud as SolicitudChat;

  const respuesta = await responder([...historial, { rol: 'user', contenido: mensaje }]);

  registrarIntercambio({
    sesionId,
    pregunta: mensaje,
    respuesta: respuesta.mensaje,
    productosIds: respuesta.productos.map((p) => p.id),
  });

  res.json({
    mensaje: respuesta.mensaje,
    productos: respuesta.productos,
    sesion_id: sesionId,
  });
}
