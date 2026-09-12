import type { MensajeChat } from './ia';
import type { Producto } from './producto';

/** Cuerpo de POST /api/chat, ya validado. */
export interface SolicitudChat {
  mensaje: string;
  historial: MensajeChat[];
  /** Identifica la conversación para registrarla. Si no viene, se genera una. */
  sesionId: string;
}

export interface RespuestaChat {
  mensaje: string;
  productos: Producto[];
  sesion_id: string;
}

export interface RespuestaError {
  error: string;
  reintentar_en_segundos?: number;
}
