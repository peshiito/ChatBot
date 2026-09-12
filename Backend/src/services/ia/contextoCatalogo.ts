import { resumirCategorias, type ResumenCategoria } from '../../db/productos.queries';

/** El catálogo cambia poco: se consulta como mucho una vez cada 5 minutos. */
const VIGENCIA_MS = 5 * 60_000;
let cache: { texto: string; vence: number } | null = null;

const precio = (n: number) => `$${Math.round(n).toLocaleString('es-AR')}`;

function formatear(categorias: ResumenCategoria[]): string {
  return categorias
    .map(
      (c) =>
        `- ${c.etiqueta} (categoria "${c.slug}"): ${c.cantidad} productos, ` +
        `de ${precio(c.minimo)} a ${precio(c.maximo)}`,
    )
    .join('\n');
}

/**
 * Qué vende la tienda y en qué rango de precios. Le da al modelo la escala
 * de los precios (sin esto, pide "precio_max: 20000") y le dice qué NO hay.
 */
export async function obtenerContextoCatalogo(): Promise<string> {
  if (cache && cache.vence > Date.now()) return cache.texto;
  const texto = formatear(await resumirCategorias());
  cache = { texto, vence: Date.now() + VIGENCIA_MS };
  return texto;
}
