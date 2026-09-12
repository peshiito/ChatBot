import type { CriteriosBusqueda, OrdenBusqueda } from '../../types/busqueda';

const ORDENES: OrdenBusqueda[] = ['relevancia', 'precio_asc', 'precio_desc', 'variado'];

function orden(valor: unknown): OrdenBusqueda | undefined {
  return ORDENES.find((o) => o === valor);
}

const LIMITE_POR_DEFECTO = 4;
const LIMITE_MAXIMO = 12;

/** La IA no siempre usa el slug exacto: se acepta lo que suele escribir. */
const SINONIMOS_CATEGORIA: Record<string, string> = {
  cooler: 'cooler',
  coolers: 'cooler',
  refrigeracion: 'cooler',
  disipador: 'cooler',
  'water cooling': 'cooler',
  watercooling: 'cooler',
  procesador: 'procesador',
  procesadores: 'procesador',
  cpu: 'procesador',
  placa_video: 'placa_video',
  'placa de video': 'placa_video',
  gpu: 'placa_video',
  'placa grafica': 'placa_video',
  memoria_ram: 'memoria_ram',
  memoria: 'memoria_ram',
  ram: 'memoria_ram',
  fuente: 'fuente',
  fuentes: 'fuente',
  psu: 'fuente',
};

function texto(valor: unknown): string | undefined {
  if (typeof valor !== 'string') return undefined;
  const limpio = valor.trim();
  return limpio.length > 0 ? limpio.slice(0, 120) : undefined;
}

function positivo(valor: unknown): number | undefined {
  const numero = typeof valor === 'string' ? Number(valor) : valor;
  if (typeof numero !== 'number' || !Number.isFinite(numero) || numero <= 0) return undefined;
  return numero;
}

function booleano(valor: unknown): boolean | undefined {
  if (typeof valor === 'boolean') return valor;
  if (valor === 'true') return true;
  if (valor === 'false') return false;
  return undefined;
}

function normalizarCategoria(valor: unknown): string | undefined {
  const crudo = texto(valor)?.toLowerCase();
  if (!crudo) return undefined;
  return SINONIMOS_CATEGORIA[crudo] ?? crudo;
}

/** Convierte lo que mande la IA en criterios seguros y con tipos correctos. */
export function normalizarCriterios(crudos: Record<string, unknown>): CriteriosBusqueda {
  const limite = positivo(crudos.limite) ?? LIMITE_POR_DEFECTO;

  const criterios: CriteriosBusqueda = {
    categoria: normalizarCategoria(crudos.categoria),
    marca: texto(crudos.marca),
    texto: texto(crudos.texto),
    precio_min: positivo(crudos.precio_min),
    precio_max: positivo(crudos.precio_max),
    solo_con_stock: booleano(crudos.solo_con_stock) ?? true,
    socket: texto(crudos.socket)?.toUpperCase(),
    tdp_minimo: positivo(crudos.tdp_minimo),
    altura_maxima_mm: positivo(crudos.altura_maxima_mm),
    tipo: texto(crudos.tipo)?.toLowerCase(),
    radiador_mm: positivo(crudos.radiador_mm),
    vram_minima_gb: positivo(crudos.vram_minima_gb),
    capacidad_minima_gb: positivo(crudos.capacidad_minima_gb),
    potencia_minima_w: positivo(crudos.potencia_minima_w),
    rgb: booleano(crudos.rgb),
    limite: Math.min(Math.round(limite), LIMITE_MAXIMO),
    orden: orden(crudos.orden),
  };

  return quitarIndefinidos(criterios);
}

export function quitarIndefinidos(criterios: CriteriosBusqueda): CriteriosBusqueda {
  const limpio: Record<string, unknown> = {};
  for (const [clave, valor] of Object.entries(criterios)) {
    if (valor !== undefined) limpio[clave] = valor;
  }
  return limpio as CriteriosBusqueda;
}
