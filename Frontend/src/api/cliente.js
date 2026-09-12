const BASE = import.meta.env.VITE_API_URL || '/api';

/** El backend puede esperar a que se libere el cupo de la IA: se le da margen. */
const TIMEOUT_CHAT_MS = 45_000;
const TIMEOUT_CATALOGO_MS = 10_000;

export class ErrorApi extends Error {
  constructor(mensaje, status, reintentarEnSegundos) {
    super(mensaje);
    this.name = 'ErrorApi';
    this.status = status;
    this.reintentarEnSegundos = reintentarEnSegundos;
  }
}

async function pedir(ruta, { timeoutMs, ...opciones } = {}) {
  let respuesta;
  try {
    respuesta = await fetch(`${BASE}${ruta}`, {
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(timeoutMs ?? TIMEOUT_CATALOGO_MS),
      ...opciones,
    });
  } catch (err) {
    const mensaje =
      err?.name === 'TimeoutError'
        ? 'La tienda tardó demasiado en responder. Probá de nuevo.'
        : 'No hay conexión con la tienda. Revisá tu internet y probá de nuevo.';
    throw new ErrorApi(mensaje, 0);
  }

  const datos = await respuesta.json().catch(() => null);
  if (!respuesta.ok) {
    throw new ErrorApi(
      datos?.error ?? 'La tienda no pudo responder. Probá de nuevo en unos segundos.',
      respuesta.status,
      datos?.reintentar_en_segundos,
    );
  }
  return datos;
}

export function obtenerProductos() {
  return pedir('/productos');
}

export function obtenerCategorias() {
  return pedir('/categorias');
}

export function enviarMensaje({ mensaje, historial, sesionId }) {
  return pedir('/chat', {
    method: 'POST',
    body: JSON.stringify({ mensaje, historial, sesion_id: sesionId ?? undefined }),
    timeoutMs: TIMEOUT_CHAT_MS,
  });
}
