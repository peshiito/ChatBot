import type { Producto } from '../../types/producto';
import { obtenerVariosPorId } from '../../db/productos.queries';

/** Un combo de tres niveles son 9 productos. */
const MAX_PRODUCTOS_EN_RESPUESTA = 9;

/** Tolera lo que el modelo le agrega: "**PRODUCTOS**:", "Productos :", etc. */
const PATRON_MARCADOR = /^[\s*_>-]*productos[\s*_]*:/i;

export interface TextoYProductos {
  mensaje: string;
  productos: Producto[];
}

function idsDelMarcador(linea: string): number[] {
  return linea
    .replace(PATRON_MARCADOR, '')
    .split(/[,\s]+/)
    .map((x) => Number(x.replace(/\D/g, '')))
    .filter((n) => Number.isInteger(n) && n > 0);
}

/**
 * Deja nombres comparables: el modelo escribe "16 GB (2×8)" y en la base dice
 * "16GB (2x8)"; también mete espacios y guiones no separables (U+00A0, U+2011).
 */
function normalizar(texto: string): string {
  return texto
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[‐-―−]/g, '-')
    .replace(/×/g, 'x')
    .replace(/\*\*/g, '')
    .replace(/(\d)\s+(gb|mhz|w|mm)\b/g, '$1$2')
    .replace(/\s+/g, ' ');
}

/** "ryzen 5 5600" no tiene que coincidir dentro de "ryzen 5 5600x". */
function aparece(nombre: string, texto: string): boolean {
  let desde = texto.indexOf(nombre);
  while (desde !== -1) {
    const siguiente = texto[desde + nombre.length] ?? ' ';
    if (!/[a-z0-9]/.test(siguiente)) return true;
    desde = texto.indexOf(nombre, desde + 1);
  }
  return false;
}

function idsMencionados(texto: string, candidatos: Producto[]): number[] {
  const normalizado = normalizar(texto);
  return candidatos.filter((p) => aparece(normalizar(p.nombre), normalizado)).map((p) => p.id);
}

/**
 * Verifica cada id: primero entre lo que devolvió la herramienta en este turno,
 * y si no está (repreguntas sobre algo de un turno anterior), contra la base.
 * Un id inventado no existe en ninguno de los dos y se descarta.
 */
async function resolver(ids: number[], candidatos: Producto[]): Promise<Producto[]> {
  const unicos = [...new Set(ids)].slice(0, 30);
  const porId = new Map(candidatos.map((p) => [p.id, p]));
  const faltantes = unicos.filter((id) => !porId.has(id));

  for (const p of await obtenerVariosPorId(faltantes)) porId.set(p.id, p);

  return unicos
    .map((id) => porId.get(id))
    .filter((p): p is Producto => p !== undefined)
    .slice(0, MAX_PRODUCTOS_EN_RESPUESTA);
}

/**
 * Separa el texto para el usuario de la lista de productos recomendados.
 * Primero van los ids del marcador, en el orden que eligió el modelo; después,
 * cualquier otro producto de la búsqueda que el texto nombre.
 */
export async function extraerProductos(texto: string, candidatos: Producto[]): Promise<TextoYProductos> {
  const lineas = texto.split('\n');
  const indice = lineas.findIndex((l) => PATRON_MARCADOR.test(l));

  const idsMarcador = indice === -1 ? [] : idsDelMarcador(lineas[indice] ?? '');
  if (indice !== -1) lineas.splice(indice, 1);
  // Red de seguridad: el usuario no tiene por qué ver "(id 9)".
  const mensaje = lineas.join('\n').replace(/\s*\(id:?\s*\d+\)/gi, '').trim();

  const ids = [...idsMarcador, ...idsMencionados(mensaje, candidatos)];
  return { mensaje, productos: await resolver(ids, candidatos) };
}
