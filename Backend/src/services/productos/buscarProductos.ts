import type { CriteriosBusqueda, ResultadoBusqueda } from '../../types/busqueda';
import type { ProductoPuntuado } from '../../types/producto';
import { buscarPorFiltros } from '../../db/productos.queries';
import { normalizarCriterios } from './criterios';
import { construirFiltros } from './filtros';
import { ordenarPorRelevancia } from './relevancia';
import { generarRelajaciones } from './relajacion';

/** Se traen más candidatos de los que se muestran para que la relevancia pueda reordenar. */
const CANDIDATOS_POR_RESULTADO = 4;
const CANDIDATOS_MAXIMOS = 40;

/**
 * Elige productos repartidos a lo largo del rango de precio. Cuando el modelo
 * pedido no existe, así se ve de la gama de entrada a la más alta, en vez de
 * solo los más baratos (lo que llevaría a decir "este es el más potente").
 */
export function muestraRepresentativa(productos: ProductoPuntuado[], n: number): ProductoPuntuado[] {
  if (productos.length <= n) return productos;
  if (n <= 1) return productos.slice(0, 1);
  const porPrecio = [...productos].sort((a, b) => a.precio - b.precio);
  const paso = (porPrecio.length - 1) / (n - 1);
  const indices = new Set(Array.from({ length: n }, (_, i) => Math.round(i * paso)));
  return [...indices].map((i) => porPrecio[i]!);
}

function aplicarOrden(productos: ProductoPuntuado[], orden: CriteriosBusqueda['orden']): ProductoPuntuado[] {
  if (orden === 'precio_asc') return [...productos].sort((a, b) => a.precio - b.precio);
  if (orden === 'precio_desc') return [...productos].sort((a, b) => b.precio - a.precio);
  return productos;
}

async function ejecutar(criterios: CriteriosBusqueda, representativa = false) {
  const limite = criterios.limite ?? 4;
  const orden = criterios.orden ?? 'relevancia';
  const repartir = representativa || orden === 'variado';
  // Cualquier orden que no sea el de relevancia necesita ver toda la categoría, no solo lo barato.
  const candidatos = repartir || orden !== 'relevancia'
    ? CANDIDATOS_MAXIMOS
    : Math.min(limite * CANDIDATOS_POR_RESULTADO, CANDIDATOS_MAXIMOS);
  const filas = await buscarPorFiltros(construirFiltros(criterios), candidatos);
  const ordenados = aplicarOrden(ordenarPorRelevancia(filas, criterios), orden);
  const elegidos = repartir ? muestraRepresentativa(ordenados, limite) : ordenados.slice(0, limite);
  return { productos: elegidos, total: ordenados.length };
}

/**
 * Busca en el catálogo. Si con los criterios pedidos no hay nada, va aflojando
 * preferencias de a una (nunca compatibilidad) hasta encontrar algo, y deja
 * registrado qué se aflojó para que la respuesta lo pueda explicar.
 */
export async function buscarProductos(crudos: Record<string, unknown>): Promise<ResultadoBusqueda> {
  const criterios = normalizarCriterios(crudos);

  const estricto = await ejecutar(criterios);
  if (estricto.total > 0) {
    return { ...estricto, criterios_aplicados: criterios, relajaciones: [] };
  }

  const relajaciones: string[] = [];
  let representativa = false;
  for (const paso of generarRelajaciones(criterios)) {
    relajaciones.push(paso.descripcion);
    representativa ||= paso.muestraRepresentativa ?? false;
    const intento = await ejecutar(paso.criterios, representativa);
    if (intento.total > 0) {
      return { ...intento, criterios_aplicados: paso.criterios, relajaciones };
    }
  }

  return { productos: [], total: 0, criterios_aplicados: criterios, relajaciones };
}
