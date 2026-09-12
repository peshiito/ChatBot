import type { Producto, Categoria } from '../../types/producto';
import { buscarPorFiltros, contarPorFiltros, obtenerPorId, listarCategorias } from '../../db/productos.queries';
import { normalizarCriterios } from './criterios';
import { construirFiltros } from './filtros';

const LIMITE_LISTADO = 100;

export interface Listado {
  productos: Producto[];
  total: number;
}

/**
 * Listado para la pagina de catalogo. A diferencia de buscarProductos, no relaja
 * criterios: si el visitante filtra y no hay nada, tiene que ver que no hay nada.
 * Por defecto muestra tambien lo que no tiene stock.
 */
export async function listarProductos(crudos: Record<string, unknown>): Promise<Listado> {
  const criterios = normalizarCriterios({ solo_con_stock: false, ...crudos });
  const filtro = construirFiltros(criterios);
  const [productos, total] = await Promise.all([
    buscarPorFiltros(filtro, LIMITE_LISTADO),
    contarPorFiltros(filtro),
  ]);
  return { productos, total };
}

export async function obtenerProducto(id: number): Promise<Producto | null> {
  return obtenerPorId(id);
}

export async function obtenerCategorias(): Promise<Categoria[]> {
  return listarCategorias();
}
