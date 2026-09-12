import 'dotenv/config';

function requerido(clave: string): string {
  const valor = process.env[clave];
  if (!valor) {
    throw new Error(`Falta la variable de entorno ${clave}. Copiá .env.example a .env.`);
  }
  return valor;
}

function numero(clave: string, porDefecto: number): number {
  const valor = process.env[clave];
  if (!valor) return porDefecto;
  const parseado = Number(valor);
  if (!Number.isFinite(parseado)) {
    throw new Error(`La variable ${clave} tiene que ser numérica, llegó "${valor}".`);
  }
  return parseado;
}

export const env = {
  entorno: process.env.NODE_ENV ?? 'development',
  puerto: numero('PORT', 3000),
  corsOrigen: process.env.CORS_ORIGIN ?? 'http://localhost:5173',

  mysql: {
    host: process.env.MYSQL_HOST ?? '127.0.0.1',
    puerto: numero('MYSQL_PORT', 3306),
    usuario: requerido('MYSQL_USER'),
    password: requerido('MYSQL_PASSWORD'),
    base: requerido('MYSQL_DATABASE'),
  },

  tiendaNombre: process.env.TIENDA_NOMBRE ?? 'HardStore',

  ia: {
    apiKey: process.env.GROQ_API_KEY ?? '',
    baseUrl: process.env.GROQ_BASE_URL ?? 'https://api.groq.com/openai/v1',
    modelo: process.env.GROQ_MODEL ?? 'openai/gpt-oss-120b',
    // El limite de tokens por minuto es por modelo: ante un 429 se prueba el siguiente.
    modelosRespaldo: (process.env.GROQ_MODELOS_RESPALDO ?? '')
      .split(',')
      .map((m) => m.trim())
      .filter(Boolean),
    // Solo lo entienden los modelos de razonamiento; vacio = no se envia.
    reasoningEffort: process.env.IA_REASONING_EFFORT ?? '',
    // Redactar con los resultados en la mano pide menos razonamiento que deducir specs.
    reasoningEffortRespuesta: process.env.IA_REASONING_EFFORT_RESPUESTA ?? '',
    timeoutMs: numero('IA_TIMEOUT_MS', 25_000),
    // Si todos los modelos están en su límite y liberan en menos de esto, se espera.
    esperaMaxSegundos: numero('IA_ESPERA_MAX_SEGUNDOS', 12),
    maxIteraciones: numero('IA_MAX_ITERACIONES', 3),
    maxTokensSalida: numero('IA_MAX_TOKENS_SALIDA', 2000),
    debug: process.env.IA_DEBUG === '1',
  },

  limites: {
    rateLimitVentanaMs: numero('RATE_LIMIT_VENTANA_MS', 60_000),
    rateLimitMax: numero('RATE_LIMIT_MAX', 6),
    mensajeMaxCaracteres: numero('MENSAJE_MAX_CARACTERES', 500),
    historialMaxMensajes: numero('HISTORIAL_MAX_MENSAJES', 20),
    // El historial se reenvía completo en cada pregunta: es lo que más tokens consume.
    historialMaxCaracteres: numero('HISTORIAL_MAX_CARACTERES', 6000),
  },
} as const;

export const esProduccion = env.entorno === 'production';
