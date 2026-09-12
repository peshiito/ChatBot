import type { ResultSetHeader } from 'mysql2';
import { consultar, obtenerPool } from '../config/db';

/** Crea la conversación si no existe y actualiza su última actividad. Devuelve su id. */
export async function asegurarConversacion(sesionId: string, origen: string): Promise<number> {
  // LAST_INSERT_ID(id) hace que insertId devuelva el id también cuando la fila ya existía.
  const [resultado] = await obtenerPool().query<ResultSetHeader>(
    `INSERT INTO conversaciones (sesion_id, origen, iniciada_en, ultima_actividad)
     VALUES (?, ?, NOW(), NOW())
     ON DUPLICATE KEY UPDATE ultima_actividad = NOW(), id = LAST_INSERT_ID(id)`,
    [sesionId, origen],
  );
  return resultado.insertId;
}

export interface NuevoMensaje {
  rol: 'user' | 'assistant';
  contenido: string;
  productosSugeridos?: number[];
}

export async function insertarMensajes(conversacionId: number, mensajes: NuevoMensaje[]): Promise<void> {
  if (mensajes.length === 0) return;
  const filas = mensajes.map((m) => [
    conversacionId,
    m.rol,
    m.contenido,
    m.productosSugeridos?.length ? JSON.stringify(m.productosSugeridos) : null,
  ]);
  await consultar(
    `INSERT INTO mensajes (conversacion_id, rol, contenido, productos_sugeridos, creado_en)
     VALUES ${filas.map(() => '(?, ?, ?, ?, NOW())').join(', ')}`,
    filas.flat(),
  );
}

/**
 * Borra las conversaciones sin actividad desde hace N días. Los mensajes se van
 * con ellas por la FK ON DELETE CASCADE. Devuelve cuántas se borraron.
 */
export async function borrarConversacionesViejas(dias: number): Promise<number> {
  if (dias <= 0) return 0;
  const [resultado] = await obtenerPool().query<ResultSetHeader>(
    'DELETE FROM conversaciones WHERE ultima_actividad < NOW() - INTERVAL ? DAY',
    [dias],
  );
  return resultado.affectedRows;
}
