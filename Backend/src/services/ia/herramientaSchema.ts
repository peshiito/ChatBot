import type { DefinicionHerramienta } from '../../types/ia';

/**
 * Se controla en el servidor y no con maxItems en el schema: Groq valida el
 * schema y rechaza la llamada entera (400) si el modelo se pasa por uno.
 */
export const MAX_BUSQUEDAS = 9;

const CRITERIOS = {
  categoria: {
    type: 'string',
    enum: ['cooler', 'procesador', 'placa_video', 'memoria_ram', 'fuente'],
    description: 'Tipo de producto. cooler incluye disipadores por aire y refrigeración líquida.',
  },
  socket: { type: 'string', description: 'Socket del procesador: AM4, AM5, LGA1700, LGA1200.' },
  tdp_minimo: { type: 'number', description: 'Coolers: TDP en watts del procesador a enfriar.' },
  tipo: {
    type: 'string',
    description:
      'Coolers: "liquida" si pide water cooling, refrigeración líquida o AIO; "aire" si pide por aire. ' +
      'Memorias: "DDR4" o "DDR5" según el socket. Omitilo si el usuario no lo pide ni es obligatorio.',
  },
  altura_maxima_mm: { type: 'number', description: 'Coolers: altura máxima que entra en el gabinete.' },
  radiador_mm: { type: 'number', description: 'Coolers líquidos: 120, 240 o 360.' },
  vram_minima_gb: { type: 'number', description: 'Placas de video: memoria mínima en GB.' },
  capacidad_minima_gb: { type: 'number', description: 'Memorias: capacidad total mínima del kit en GB.' },
  potencia_minima_w: { type: 'number', description: 'Fuentes: potencia mínima en watts.' },
  marca: { type: 'string', description: 'Solo si el usuario pide una marca.' },
  rgb: { type: 'boolean', description: 'Solo si el usuario menciona iluminación.' },
  precio_min: { type: 'number', description: 'Precio mínimo en pesos argentinos, número completo (ej: 150000).' },
  precio_max: { type: 'number', description: 'Presupuesto máximo en pesos argentinos, número completo (ej: 400000).' },
  texto: { type: 'string', description: 'Modelo puntual a buscar por nombre, ej: "RTX 4060".' },
  orden: {
    type: 'string',
    enum: ['relevancia', 'precio_asc', 'precio_desc', 'variado'],
    description:
      'Por defecto "relevancia" (lo mejor para la pregunta). "variado" SOLO si el usuario pide niveles ' +
      'de precio (barato / medio / caro): trae una muestra de toda la gama. "precio_asc" para "el más barato".',
  },
  limite: { type: 'number', description: 'Cantidad de resultados, entre 1 y 8. Por defecto 4.' },
};

export const HERRAMIENTA_BUSCAR: DefinicionHerramienta = {
  type: 'function',
  function: {
    name: 'buscar_productos',
    description:
      'Busca en el catálogo real de la tienda: es la ÚNICA fuente de productos, precios y stock. ' +
      'Mandá TODAS las búsquedas que necesites en UNA sola llamada, dentro de "busquedas" ' +
      '(ej: un combo = una búsqueda por categoría). Completá los criterios técnicos que se deducen ' +
      'de la pregunta aunque el usuario no los diga ("Ryzen 5 4600G" implica socket AM4 y 65 W).',
    parameters: {
      type: 'object',
      properties: {
        busquedas: {
          type: 'array',
          description: `Entre 1 y ${MAX_BUSQUEDAS} búsquedas. Para niveles de precio alcanza una por categoría con orden "variado".`,
          items: { type: 'object', properties: CRITERIOS },
        },
      },
      required: ['busquedas'],
    },
  },
};

export const HERRAMIENTAS = [HERRAMIENTA_BUSCAR];
