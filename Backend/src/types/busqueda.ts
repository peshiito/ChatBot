import type { ProductoPuntuado } from './producto';

/**
 * Criterios de busqueda. Los emite la IA a partir de una pregunta en lenguaje
 * natural, asi que todo es opcional y todo se valida antes de tocar la base.
 */
export interface CriteriosBusqueda {
  categoria?: string;
  marca?: string;
  texto?: string;
  precio_min?: number;
  precio_max?: number;
  solo_con_stock?: boolean;

  // Compatibilidad fisica y electrica. No se relajan nunca.
  socket?: string;
  tdp_minimo?: number;
  altura_maxima_mm?: number;

  // Preferencias. Se relajan si la busqueda no devuelve nada.
  tipo?: string;
  radiador_mm?: number;
  vram_minima_gb?: number;
  capacidad_minima_gb?: number;
  potencia_minima_w?: number;
  rgb?: boolean;

  limite?: number;
  /**
   * relevancia (por defecto) · precio_asc · precio_desc ·
   * variado: repartidos de la gama más barata a la más cara (para armar niveles).
   */
  orden?: OrdenBusqueda;
}

export type OrdenBusqueda = 'relevancia' | 'precio_asc' | 'precio_desc' | 'variado';

export interface ResultadoBusqueda {
  productos: ProductoPuntuado[];
  total: number;
  /** Criterios que efectivamente se aplicaron (pueden diferir de los pedidos). */
  criterios_aplicados: CriteriosBusqueda;
  /**
   * Que se tuvo que aflojar para encontrar algo, en texto legible.
   * La IA usa esto para explicar en que se diferencia lo ofrecido de lo pedido.
   */
  relajaciones: string[];
}
