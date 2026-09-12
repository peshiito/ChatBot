import { env } from '../../config/env';
import type { MensajeChat, MensajeIA, RespuestaAsistente } from '../../types/ia';
import type { Producto } from '../../types/producto';
import { completarChat, ErrorIA } from './cliente';
import type { OpcionesCompletado } from '../../types/ia';
import { HERRAMIENTAS, ejecutarHerramienta } from './herramientas';
import { construirPromptSistema } from './prompt';
import { extraerProductos } from './extraerProductos';
import { obtenerContextoCatalogo } from './contextoCatalogo';

const RESPUESTA_VACIA =
  'Perdón, no pude armar una respuesta. ¿Me contás un poco más qué estás buscando?';

async function armarMensajes(conversacion: MensajeChat[]): Promise<MensajeIA[]> {
  return [
    { role: 'system', content: construirPromptSistema(await obtenerContextoCatalogo()) },
    ...conversacion.map((m) => ({ role: m.rol, content: m.contenido })),
  ];
}

/** Ejecuta todas las herramientas pedidas en una vuelta y agrega sus resultados. */
async function resolverLlamadas(
  llamadas: NonNullable<Extract<MensajeIA, { role: 'assistant' }>['tool_calls']>,
  mensajes: MensajeIA[],
  candidatos: Producto[],
): Promise<void> {
  const resultados = await Promise.all(
    llamadas.map((l) => ejecutarHerramienta(l.function.name, l.function.arguments)),
  );

  llamadas.forEach((llamada, i) => {
    const resultado = resultados[i]!;
    candidatos.push(...resultado.productos);
    mensajes.push({ role: 'tool', tool_call_id: llamada.id, content: resultado.contenido });
  });
}

/**
 * Si el proveedor rechaza la llamada a la herramienta por formato, se le dice
 * al modelo qué falló y se reintenta una vez, en vez de mostrarle un error al usuario.
 */
async function completarConCorreccion(opciones: OpcionesCompletado) {
  try {
    return await completarChat(opciones);
  } catch (err) {
    if (!(err instanceof ErrorIA) || err.tipo !== 'herramienta') throw err;
    opciones.mensajes.push({
      role: 'system',
      content: `Tu llamada a buscar_productos fue rechazada: ${err.message}. Corregila y volvé a llamar.`,
    });
    return completarChat(opciones);
  }
}

/**
 * Loop de tool use: el modelo pide búsquedas hasta que tiene lo que necesita y
 * responde en texto. Con el tope de iteraciones alcanzado se le exige responder
 * con lo que ya tiene, así nunca queda colgado.
 */
export async function responder(conversacion: MensajeChat[]): Promise<RespuestaAsistente> {
  const mensajes = await armarMensajes(conversacion);
  const candidatos: Producto[] = [];

  for (let iteracion = 0; iteracion < env.ia.maxIteraciones; iteracion++) {
    // La primera vuelta deduce specs (necesita pensar); las siguientes redactan con resultados.
    const esfuerzo = iteracion === 0 ? undefined : env.ia.reasoningEffortRespuesta || undefined;
    const respuesta = await completarConCorreccion({ mensajes, herramientas: HERRAMIENTAS, esfuerzo });
    mensajes.push(respuesta);

    if (!respuesta.tool_calls?.length) {
      return finalizar(respuesta.content, candidatos, iteracion);
    }

    await resolverLlamadas(respuesta.tool_calls, mensajes, candidatos);
  }

  const cierre = await completarChat({
    mensajes,
    herramientas: HERRAMIENTAS,
    eleccionHerramienta: 'none',
    esfuerzo: env.ia.reasoningEffortRespuesta || undefined,
  });
  return finalizar(cierre.content, candidatos, env.ia.maxIteraciones);
}

async function finalizar(
  texto: string | null,
  candidatos: Producto[],
  iteraciones: number,
): Promise<RespuestaAsistente> {
  if (!texto?.trim()) {
    return { mensaje: RESPUESTA_VACIA, productos: [], iteraciones };
  }
  const { mensaje, productos } = await extraerProductos(texto, candidatos);
  return { mensaje, productos, iteraciones };
}
