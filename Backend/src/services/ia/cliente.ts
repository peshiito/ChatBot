import { env } from '../../config/env';
import type { MensajeIA, OpcionesCompletado } from '../../types/ia';

/** 'herramienta': el modelo armó una llamada que el proveedor rechazó por formato; se puede corregir. */
export type TipoErrorIA = 'configuracion' | 'limite' | 'timeout' | 'proveedor' | 'herramienta';

type MensajeAsistente = Extract<MensajeIA, { role: 'assistant' }>;

/** Error del proveedor de IA, ya clasificado para poder responder algo útil. */
export class ErrorIA extends Error {
  constructor(
    public readonly tipo: TipoErrorIA,
    mensaje: string,
    public readonly reintentarEnSegundos?: number,
  ) {
    super(mensaje);
    this.name = 'ErrorIA';
  }
}

interface RespuestaCompletado {
  choices: { message: MensajeAsistente }[];
  usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
}

function clasificarError(status: number, cuerpo: string, retryAfter: string | null): ErrorIA {
  if (status === 401 || status === 403) {
    return new ErrorIA('configuracion', `API key inválida o sin permisos (${status}).`);
  }
  if (status === 400 && cuerpo.includes('tool_use_failed')) {
    const detalle = cuerpo.match(/"message":"([^"]+)"/)?.[1] ?? 'formato inválido';
    return new ErrorIA('herramienta', detalle.slice(0, 300));
  }
  if (status === 429) {
    const segundos = Math.ceil(Number(retryAfter)) || undefined;
    return new ErrorIA('limite', 'Límite de solicitudes del proveedor alcanzado.', segundos);
  }
  return new ErrorIA('proveedor', `El proveedor respondió ${status}: ${cuerpo.slice(0, 300)}`);
}

function construirCuerpo(modelo: string, opciones: OpcionesCompletado): Record<string, unknown> {
  const cuerpo: Record<string, unknown> = {
    model: modelo,
    messages: opciones.mensajes,
    temperature: 0.3,
    // El razonamiento del modelo cuenta como salida: esto evita respuestas desbocadas.
    max_completion_tokens: env.ia.maxTokensSalida,
  };
  if (opciones.herramientas?.length) {
    cuerpo.tools = opciones.herramientas;
    cuerpo.tool_choice = opciones.eleccionHerramienta ?? 'auto';
  }
  const esfuerzo = opciones.esfuerzo ?? env.ia.reasoningEffort;
  if (esfuerzo) {
    cuerpo.reasoning_effort = esfuerzo;
  }
  return cuerpo;
}

async function llamarModelo(modelo: string, opciones: OpcionesCompletado): Promise<MensajeAsistente> {
  let respuesta: Response;
  try {
    respuesta = await fetch(`${env.ia.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.ia.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(construirCuerpo(modelo, opciones)),
      signal: AbortSignal.timeout(env.ia.timeoutMs),
    });
  } catch (err) {
    if (err instanceof Error && err.name === 'TimeoutError') {
      throw new ErrorIA('timeout', `El proveedor no respondió en ${env.ia.timeoutMs} ms.`);
    }
    throw new ErrorIA('proveedor', `No se pudo contactar al proveedor: ${String(err)}`);
  }

  if (!respuesta.ok) {
    throw clasificarError(respuesta.status, await respuesta.text(), respuesta.headers.get('retry-after'));
  }

  const datos = (await respuesta.json()) as RespuestaCompletado;
  const mensaje = datos.choices[0]?.message;
  if (!mensaje) {
    throw new ErrorIA('proveedor', 'El proveedor devolvió una respuesta sin mensajes.');
  }
  if (env.ia.debug && datos.usage) {
    const u = datos.usage;
    console.log(`  [ia] ${modelo}: ${u.prompt_tokens} entrada + ${u.completion_tokens} salida = ${u.total_tokens} tokens`);
  }

  // Solo se conservan los campos del protocolo: algunos modelos agregan `reasoning`.
  return {
    role: 'assistant',
    content: mensaje.content ?? null,
    ...(mensaje.tool_calls?.length ? { tool_calls: mensaje.tool_calls } : {}),
  };
}

/** Prueba cada modelo en orden. Devuelve el error de límite con la menor espera si todos están llenos. */
async function probarModelos(opciones: OpcionesCompletado): Promise<MensajeAsistente | ErrorIA> {
  let menorEspera: ErrorIA | undefined;

  for (const modelo of [env.ia.modelo, ...env.ia.modelosRespaldo]) {
    try {
      return await llamarModelo(modelo, opciones);
    } catch (err) {
      if (!(err instanceof ErrorIA) || err.tipo !== 'limite') throw err;
      if (env.ia.debug) console.log(`  [ia] ${modelo} en su límite (${err.reintentarEnSegundos ?? '?'}s)`);
      const espera = err.reintentarEnSegundos ?? Infinity;
      if (!menorEspera || espera < (menorEspera.reintentarEnSegundos ?? Infinity)) menorEspera = err;
    }
  }
  return menorEspera ?? new ErrorIA('proveedor', 'No hay modelos configurados.');
}

/**
 * Una llamada a /chat/completions. Si el modelo principal está en su límite,
 * prueba con los de respaldo; si todos lo están y la espera es corta, espera
 * una vez y reintenta: una respuesta más lenta es mejor que un error.
 */
export async function completarChat(opciones: OpcionesCompletado): Promise<MensajeAsistente> {
  if (!env.ia.apiKey) {
    throw new ErrorIA('configuracion', 'Falta GROQ_API_KEY en el .env.');
  }

  const primero = await probarModelos(opciones);
  if (!(primero instanceof ErrorIA)) return primero;

  const segundos = primero.reintentarEnSegundos;
  if (segundos === undefined || segundos > env.ia.esperaMaxSegundos) throw primero;

  if (env.ia.debug) console.log(`  [ia] todos los modelos llenos, espero ${segundos}s y reintento`);
  await new Promise((r) => setTimeout(r, segundos * 1000));

  const segundo = await probarModelos(opciones);
  if (segundo instanceof ErrorIA) throw segundo;
  return segundo;
}
