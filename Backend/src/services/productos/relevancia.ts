import type { Producto, ProductoPuntuado } from '../../types/producto';
import type { CriteriosBusqueda } from '../../types/busqueda';

function numeroSpec(producto: Producto, clave: string): number | undefined {
  const valor = producto.specs[clave];
  return typeof valor === 'number' ? valor : undefined;
}

/** Holgura sana entre 1.2x y 4x lo requerido; justo al limite o muy por encima, baja. */
function puntajeHolgura(capacidad: number | undefined, requerido: number | undefined): number {
  if (capacidad === undefined || requerido === undefined) return 0;
  const ratio = capacidad / requerido;
  if (ratio < 1.2) return -4;
  if (ratio <= 4) return 10;
  return -10;
}

/**
 * Debajo de 100 W una torre de aire alcanza de sobra: la liquida funciona pero
 * es gastar de mas, y la recomendacion honesta la pone despues.
 */
const TDP_SIN_NECESIDAD_DE_LIQUIDA = 100;

function puntajeLiquidaInnecesaria(producto: Producto, criterios: CriteriosBusqueda): number {
  if (criterios.tdp_minimo === undefined || criterios.tipo === 'liquida') return 0;
  const esLiquida = producto.specs.tipo === 'liquida';
  return esLiquida && criterios.tdp_minimo < TDP_SIN_NECESIDAD_DE_LIQUIDA ? -12 : 0;
}

function puntajePrecio(precio: number, criterios: CriteriosBusqueda): number {
  if (criterios.precio_max === undefined) return 0;
  return precio <= criterios.precio_max * 0.85 ? 6 : 2;
}

function puntajeTexto(producto: Producto, criterios: CriteriosBusqueda): number {
  let puntos = 0;
  const nombre = producto.nombre.toLowerCase();
  if (criterios.texto && nombre.includes(criterios.texto.toLowerCase())) puntos += 12;
  if (criterios.marca && producto.marca.toLowerCase() === criterios.marca.toLowerCase()) puntos += 8;
  if (criterios.rgb !== undefined && producto.specs.rgb === criterios.rgb) puntos += 5;
  return puntos;
}

export function puntuar(producto: Producto, criterios: CriteriosBusqueda): number {
  let puntos = 50;
  puntos += producto.stock > 0 ? 15 : -30;
  puntos += puntajeHolgura(numeroSpec(producto, 'tdp_max_w'), criterios.tdp_minimo);
  puntos += puntajeLiquidaInnecesaria(producto, criterios);
  puntos += puntajeHolgura(numeroSpec(producto, 'potencia_w'), criterios.potencia_minima_w);
  puntos += puntajePrecio(producto.precio, criterios);
  puntos += puntajeTexto(producto, criterios);
  return Math.max(0, Math.min(100, puntos));
}

/** Mayor relevancia primero; a igual puntaje, el mas barato. */
export function ordenarPorRelevancia(
  productos: Producto[],
  criterios: CriteriosBusqueda,
): ProductoPuntuado[] {
  return productos
    .map((p) => ({ ...p, relevancia: puntuar(p, criterios) }))
    .sort((a, b) => b.relevancia - a.relevancia || a.precio - b.precio);
}
