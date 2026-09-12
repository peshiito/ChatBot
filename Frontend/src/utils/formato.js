const NUMERO = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 });

/** Mismo formato que usa el asesor en sus respuestas: $124.900 */
export function formatearPrecio(precio) {
  return `$${NUMERO.format(precio)}`;
}

const POCAS_UNIDADES = 3;

/** Estado de stock en el lenguaje de un mostrador. */
export function estadoStock(stock) {
  if (stock <= 0) return { texto: 'Sin stock · a pedido', tono: 'agotado' };
  if (stock <= POCAS_UNIDADES) return { texto: `Quedan ${stock}`, tono: 'pocas' };
  return { texto: `${stock} en stock`, tono: 'disponible' };
}
