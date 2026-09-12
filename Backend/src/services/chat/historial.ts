import type { MensajeChat } from '../../types/ia';

/** Una respuesta vieja del asistente no necesita viajar entera para dar contexto. */
const CONTENIDO_MAX_CARACTERES = 2000;

/**
 * Se queda con los mensajes más recientes que entren en ambos topes.
 * No es un error que la conversación sea larga: se olvida lo más viejo.
 */
export function recortarHistorial(
  historial: MensajeChat[],
  maxMensajes: number,
  maxCaracteres: number,
): MensajeChat[] {
  const recortado: MensajeChat[] = [];
  let caracteres = 0;

  for (let i = historial.length - 1; i >= 0 && recortado.length < maxMensajes; i--) {
    const mensaje = historial[i]!;
    const contenido = mensaje.contenido.slice(0, CONTENIDO_MAX_CARACTERES);
    if (caracteres + contenido.length > maxCaracteres) break;
    caracteres += contenido.length;
    recortado.unshift({ rol: mensaje.rol, contenido });
  }

  // Si el corte dejó una respuesta del asistente al principio, sin su pregunta, sobra.
  while (recortado[0]?.rol === 'assistant') recortado.shift();
  return recortado;
}
