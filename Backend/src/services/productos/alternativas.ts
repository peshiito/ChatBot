import type { CriteriosBusqueda } from '../../types/busqueda';
import type { ProductoPuntuado } from '../../types/producto';
import { buscarProductos } from './buscarProductos';

/** Debajo de este TDP una torre de aire enfría de sobra. */
const TDP_MAXIMO_PARA_AIRE = 100;

export interface Alternativa {
  producto: ProductoPuntuado;
  motivo: string;
}

function pideLiquidaInnecesaria(c: CriteriosBusqueda): boolean {
  return (
    c.categoria === 'cooler' &&
    c.tipo === 'liquida' &&
    c.tdp_minimo !== undefined &&
    c.tdp_minimo < TDP_MAXIMO_PARA_AIRE
  );
}

/**
 * Cuando lo pedido está sobredimensionado para el caso, busca la opción
 * razonable. La calcula el backend para que el asesor no la saque de memoria:
 * si la ofrece, es un producto real con precio real.
 */
export async function buscarAlternativa(criterios: CriteriosBusqueda): Promise<Alternativa | null> {
  if (!pideLiquidaInnecesaria(criterios)) return null;

  const resultado = await buscarProductos({
    categoria: 'cooler',
    tipo: 'aire',
    socket: criterios.socket,
    tdp_minimo: criterios.tdp_minimo,
    altura_maxima_mm: criterios.altura_maxima_mm,
    limite: 1,
  });

  const producto = resultado.productos[0];
  if (!producto || resultado.relajaciones.length > 0) return null;

  return {
    producto,
    motivo: `Para ${criterios.tdp_minimo} W de TDP una torre de aire alcanza de sobra; la líquida es opcional (estética o gusto).`,
  };
}
