import { asegurarConversacion, insertarMensajes } from '../../db/conversaciones.queries';

interface Intercambio {
  sesionId: string;
  pregunta: string;
  respuesta: string;
  productosIds: number[];
}

/**
 * Guarda la pregunta y la respuesta para poder auditar qué recomendó el asistente.
 * No se espera ni puede fallar hacia afuera: si la base tiene un problema, el
 * usuario igual recibe su respuesta y el error queda en el log.
 */
export function registrarIntercambio(intercambio: Intercambio): void {
  void guardar(intercambio).catch((err) => {
    console.error(`[registro] No se pudo guardar la sesión ${intercambio.sesionId}:`, err);
  });
}

async function guardar({ sesionId, pregunta, respuesta, productosIds }: Intercambio): Promise<void> {
  const conversacionId = await asegurarConversacion(sesionId, 'web');
  await insertarMensajes(conversacionId, [
    { rol: 'user', contenido: pregunta },
    { rol: 'assistant', contenido: respuesta, productosSugeridos: productosIds },
  ]);
}
