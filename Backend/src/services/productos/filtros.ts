import type { CriteriosBusqueda } from '../../types/busqueda';

export interface FiltroSql {
  condiciones: string[];
  params: unknown[];
}

/** Escapa los comodines de LIKE para que el texto del usuario no ensanche la busqueda. */
function paraLike(valor: string): string {
  return `%${valor.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
}

/**
 * Los filtros sobre `specs` toleran que la clave no exista: si un producto no
 * declara el dato, no se lo excluye. Sin esto, pedir `tdp_minimo` dejaria
 * afuera a todas las categorias que no son coolers.
 */
function specMayorIgual(clave: string, valor: number, f: FiltroSql): void {
  f.condiciones.push(
    `(specs->>'$.${clave}' IS NULL OR CAST(specs->>'$.${clave}' AS UNSIGNED) >= ?)`,
  );
  f.params.push(valor);
}

function specMenorIgual(clave: string, valor: number, f: FiltroSql): void {
  f.condiciones.push(
    `(specs->>'$.${clave}' IS NULL OR CAST(specs->>'$.${clave}' AS UNSIGNED) <= ?)`,
  );
  f.params.push(valor);
}

/** El socket puede ser un escalar (procesadores) o un arreglo (coolers). */
function filtrarSocket(socket: string, f: FiltroSql): void {
  f.condiciones.push(
    `(JSON_CONTAINS(COALESCE(specs->'$.sockets', JSON_ARRAY()), ?) OR specs->>'$.socket' = ?)`,
  );
  f.params.push(JSON.stringify(socket), socket);
}

export function construirFiltros(criterios: CriteriosBusqueda): FiltroSql {
  const f: FiltroSql = { condiciones: ['activo = 1'], params: [] };

  if (criterios.categoria) {
    f.condiciones.push('categoria = ?');
    f.params.push(criterios.categoria);
  }

  if (criterios.marca) {
    f.condiciones.push('marca LIKE ?');
    f.params.push(paraLike(criterios.marca));
  }

  if (criterios.texto) {
    f.condiciones.push('(nombre LIKE ? OR descripcion LIKE ?)');
    f.params.push(paraLike(criterios.texto), paraLike(criterios.texto));
  }

  if (criterios.precio_min !== undefined) {
    f.condiciones.push('precio >= ?');
    f.params.push(criterios.precio_min);
  }

  if (criterios.precio_max !== undefined) {
    f.condiciones.push('precio <= ?');
    f.params.push(criterios.precio_max);
  }

  if (criterios.solo_con_stock) {
    f.condiciones.push('stock > 0');
  }

  if (criterios.socket) filtrarSocket(criterios.socket, f);

  if (criterios.tdp_minimo !== undefined) {
    specMayorIgual('tdp_max_w', criterios.tdp_minimo, f);
  }

  if (criterios.altura_maxima_mm !== undefined) {
    specMenorIgual('altura_mm', criterios.altura_maxima_mm, f);
  }

  if (criterios.tipo) {
    f.condiciones.push(`LOWER(specs->>'$.tipo') = ?`);
    f.params.push(criterios.tipo);
  }

  if (criterios.radiador_mm !== undefined) {
    f.condiciones.push(`CAST(specs->>'$.radiador_mm' AS UNSIGNED) = ?`);
    f.params.push(criterios.radiador_mm);
  }

  if (criterios.vram_minima_gb !== undefined) {
    specMayorIgual('vram_gb', criterios.vram_minima_gb, f);
  }

  if (criterios.capacidad_minima_gb !== undefined) {
    specMayorIgual('capacidad_gb', criterios.capacidad_minima_gb, f);
  }

  if (criterios.potencia_minima_w !== undefined) {
    specMayorIgual('potencia_w', criterios.potencia_minima_w, f);
  }

  if (criterios.rgb !== undefined) {
    f.condiciones.push(`specs->>'$.rgb' = ?`);
    f.params.push(String(criterios.rgb));
  }

  return f;
}
