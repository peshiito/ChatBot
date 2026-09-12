import type { Producto } from './producto';

/** Mensaje de la conversacion tal como lo maneja el frontend: solo texto. */
export interface MensajeChat {
  rol: 'user' | 'assistant';
  contenido: string;
}

export interface RespuestaAsistente {
  mensaje: string;
  productos: Producto[];
  /** Cuantas vueltas de herramientas hizo el modelo antes de responder. */
  iteraciones: number;
}

// ---- Formato de la API compatible con OpenAI ----

export interface LlamadaHerramienta {
  id: string;
  type: 'function';
  function: { name: string; arguments: string };
}

export type MensajeIA =
  | { role: 'system' | 'user'; content: string }
  | { role: 'assistant'; content: string | null; tool_calls?: LlamadaHerramienta[] }
  | { role: 'tool'; tool_call_id: string; content: string };

export interface DefinicionHerramienta {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
}

export interface OpcionesCompletado {
  mensajes: MensajeIA[];
  herramientas?: DefinicionHerramienta[];
  /** 'none' fuerza una respuesta en texto, sin mas llamadas a herramientas. */
  eleccionHerramienta?: 'auto' | 'none';
  /** Esfuerzo de razonamiento para esta llamada; si falta, el de la configuración. */
  esfuerzo?: string;
}
