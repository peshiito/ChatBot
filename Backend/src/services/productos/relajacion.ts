import type { CriteriosBusqueda } from '../../types/busqueda';

export interface Relajacion {
  criterios: CriteriosBusqueda;
  descripcion: string;
  /** Devolver productos repartidos en todo el rango de precio, no solo los primeros. */
  muestraRepresentativa?: boolean;
}

type Paso = (c: CriteriosBusqueda) => Relajacion | null;

function sin(c: CriteriosBusqueda, clave: keyof CriteriosBusqueda): CriteriosBusqueda {
  const copia = { ...c };
  delete copia[clave];
  return copia;
}

/**
 * Orden en que se aflojan los criterios cuando no hay resultados: primero
 * gustos (RGB, marca), despues presupuesto, al final el stock.
 * Nunca se tocan categoria, socket, tdp_minimo, altura_maxima_mm ni
 * potencia_minima_w: relajarlos devolveria productos incompatibles.
 */
const PASOS: Paso[] = [
  (c) =>
    c.rgb === undefined ? null : { criterios: sin(c, 'rgb'), descripcion: `sin filtrar por RGB (se pidio rgb=${c.rgb})` },
  (c) =>
    c.marca ? { criterios: sin(c, 'marca'), descripcion: `de otras marcas ademas de ${c.marca}` } : null,
  (c) =>
    c.texto
      ? {
          criterios: sin(c, 'texto'),
          descripcion: `no hay "${c.texto}"; se muestran productos de la categoría repartidos de la gama más barata a la más cara`,
          muestraRepresentativa: true,
        }
      : null,
  (c) =>
    c.radiador_mm ? { criterios: sin(c, 'radiador_mm'), descripcion: `con otro tamanio de radiador (se pidio ${c.radiador_mm} mm)` } : null,
  (c) =>
    c.tipo ? { criterios: sin(c, 'tipo'), descripcion: `de otro tipo (se pidio "${c.tipo}")` } : null,
  (c) =>
    c.vram_minima_gb ? { criterios: sin(c, 'vram_minima_gb'), descripcion: `con menos de ${c.vram_minima_gb} GB de VRAM` } : null,
  (c) =>
    c.capacidad_minima_gb ? { criterios: sin(c, 'capacidad_minima_gb'), descripcion: `con menos de ${c.capacidad_minima_gb} GB` } : null,
  (c) =>
    c.precio_max
      ? {
          criterios: { ...c, precio_max: Math.round(c.precio_max * 1.25) },
          descripcion: `hasta un 25% por encima del presupuesto de $${c.precio_max}`,
        }
      : null,
  (c) =>
    c.precio_max ? { criterios: sin(c, 'precio_max'), descripcion: 'sin tope de precio' } : null,
  (c) =>
    c.precio_min ? { criterios: sin(c, 'precio_min'), descripcion: 'sin precio minimo' } : null,
  (c) =>
    c.solo_con_stock ? { criterios: { ...c, solo_con_stock: false }, descripcion: 'incluyendo productos sin stock (a pedido)' } : null,
];

/**
 * Devuelve la secuencia de relajaciones acumulativas a probar, en orden.
 * Cada elemento incluye todas las anteriores.
 */
export function generarRelajaciones(criterios: CriteriosBusqueda): Relajacion[] {
  const secuencia: Relajacion[] = [];
  let actual = criterios;

  for (const paso of PASOS) {
    const resultado = paso(actual);
    if (!resultado) continue;
    secuencia.push(resultado);
    actual = resultado.criterios;
  }

  return secuencia;
}
