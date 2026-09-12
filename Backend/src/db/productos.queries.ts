import { consultar } from '../config/db';
import type { Producto, Categoria } from '../types/producto';
import type { FiltroSql } from '../services/productos/filtros';

const CAMPOS = `
  id, sku, nombre, categoria, marca, precio, stock,
  descripcion, imagen_url, specs
`;

/**
 * Trae mas filas de las que se van a mostrar: el ordenamiento definitivo lo
 * decide la capa de relevancia, no el SQL.
 */
export async function buscarPorFiltros(filtro: FiltroSql, limite: number): Promise<Producto[]> {
  const where = filtro.condiciones.join(' AND ');
  const sql = `SELECT ${CAMPOS} FROM productos WHERE ${where} ORDER BY precio ASC LIMIT ?`;
  return consultar<Producto>(sql, [...filtro.params, limite]);
}

export async function contarPorFiltros(filtro: FiltroSql): Promise<number> {
  const where = filtro.condiciones.join(' AND ');
  const filas = await consultar<{ total: number }>(
    `SELECT COUNT(*) AS total FROM productos WHERE ${where}`,
    filtro.params,
  );
  return filas[0]?.total ?? 0;
}

export async function obtenerPorId(id: number): Promise<Producto | null> {
  const filas = await consultar<Producto>(
    `SELECT ${CAMPOS} FROM productos WHERE id = ? AND activo = 1`,
    [id],
  );
  return filas[0] ?? null;
}

export async function obtenerVariosPorId(ids: number[]): Promise<Producto[]> {
  if (ids.length === 0) return [];
  const marcadores = ids.map(() => '?').join(', ');
  return consultar<Producto>(
    `SELECT ${CAMPOS} FROM productos WHERE id IN (${marcadores}) AND activo = 1`,
    ids,
  );
}

export interface ResumenCategoria {
  slug: string;
  etiqueta: string;
  cantidad: number;
  con_stock: number;
  minimo: number;
  maximo: number;
}

export async function resumirCategorias(): Promise<ResumenCategoria[]> {
  return consultar<ResumenCategoria>(
    `SELECT c.slug, c.etiqueta, COUNT(p.id) AS cantidad,
            CAST(SUM(p.stock > 0) AS UNSIGNED) AS con_stock,
            MIN(p.precio) AS minimo, MAX(p.precio) AS maximo
     FROM categorias c
     JOIN productos p ON p.categoria = c.slug AND p.activo = 1
     GROUP BY c.slug, c.etiqueta, c.orden
     ORDER BY c.orden ASC`,
  );
}

export async function listarCategorias(): Promise<Categoria[]> {
  return consultar<Categoria>(
    `SELECT c.slug, c.etiqueta, c.orden
     FROM categorias c
     WHERE EXISTS (SELECT 1 FROM productos p WHERE p.categoria = c.slug AND p.activo = 1)
     ORDER BY c.orden ASC`,
  );
}
