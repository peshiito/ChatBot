import { env } from '../../config/env';
import type { Producto } from '../../types/producto';
import type { ResultadoBusqueda } from '../../types/busqueda';
import { buscarProductos } from '../productos/buscarProductos';
import { buscarAlternativa, type Alternativa } from '../productos/alternativas';
import { HERRAMIENTA_BUSCAR, MAX_BUSQUEDAS } from './herramientaSchema';

export { HERRAMIENTAS } from './herramientaSchema';

export interface ResultadoHerramienta {
  /** Lo que se le devuelve al modelo, en JSON. */
  contenido: string;
  /** Productos completos, para mandarle al frontend los que se recomienden. */
  productos: Producto[];
}

/** El proveedor cobra el límite en tokens por minuto: se manda lo justo. */
const LARGO_DESCRIPCION = 100;

function compactar(p: Producto) {
  const d = p.descripcion ?? '';
  return {
    id: p.id,
    nombre: p.nombre,
    precio: p.precio,
    stock: p.stock,
    specs: p.specs,
    descripcion: d.length > LARGO_DESCRIPCION ? `${d.slice(0, LARGO_DESCRIPCION)}…` : d,
  };
}

function resumir(r: ResultadoBusqueda, alternativa: Alternativa | null) {
  return {
    categoria: r.criterios_aplicados.categoria ?? 'todas',
    total: r.total,
    relajaciones: r.relajaciones,
    productos: r.productos.map(compactar),
    ...(alternativa
      ? { alternativa_razonable: { motivo: alternativa.motivo, producto: compactar(alternativa.producto) } }
      : {}),
  };
}

function error(mensaje: string): ResultadoHerramienta {
  return { contenido: JSON.stringify({ error: mensaje }), productos: [] };
}

/**
 * Todo lo que devuelve la herramienta vuelve a entrar como tokens en la respuesta:
 * se reparte un cupo total de productos entre las búsquedas (3 búsquedas = 4 c/u).
 */
const PRODUCTOS_POR_LLAMADA = 12;
const MINIMO_POR_BUSQUEDA = 3;
const MAXIMO_POR_BUSQUEDA = 8;

/** Acepta el formato nuevo ({ busquedas: [...] }) y también una búsqueda suelta. */
function extraerBusquedas(argumentos: Record<string, unknown>): Record<string, unknown>[] {
  const lista = (Array.isArray(argumentos.busquedas) ? argumentos.busquedas : [argumentos])
    .filter((b): b is Record<string, unknown> => typeof b === 'object' && b !== null)
    .slice(0, MAX_BUSQUEDAS);

  const cupo = Math.max(MINIMO_POR_BUSQUEDA, Math.min(MAXIMO_POR_BUSQUEDA, Math.floor(PRODUCTOS_POR_LLAMADA / lista.length)));
  return lista.map((b) => {
    const pedido = Number(b.limite) || 4;
    return { ...b, limite: Math.min(pedido, cupo) };
  });
}

async function ejecutarUna(criterios: Record<string, unknown>) {
  const resultado = await buscarProductos(criterios);
  const alternativa = await buscarAlternativa(resultado.criterios_aplicados);
  if (env.ia.debug) {
    const extra = alternativa ? ` + alternativa: ${alternativa.producto.nombre}` : '';
    console.log(`  [tool] ${JSON.stringify(criterios)} -> ${resultado.total}${extra}`);
  }
  const productos = alternativa ? [...resultado.productos, alternativa.producto] : resultado.productos;
  return { resumen: resumir(resultado, alternativa), productos };
}

/** Ejecuta la herramienta que pidió el modelo. Nunca tira: los errores vuelven como contenido. */
export async function ejecutarHerramienta(nombre: string, argumentosJson: string): Promise<ResultadoHerramienta> {
  if (nombre !== HERRAMIENTA_BUSCAR.function.name) {
    return error(`La herramienta "${nombre}" no existe. Usá buscar_productos.`);
  }

  let argumentos: Record<string, unknown>;
  try {
    argumentos = JSON.parse(argumentosJson || '{}') as Record<string, unknown>;
  } catch {
    return error('Los argumentos no son JSON válido. Volvé a intentar.');
  }

  const busquedas = extraerBusquedas(argumentos);
  if (busquedas.length === 0) return error('Mandá al menos una búsqueda en "busquedas".');

  const resultados = await Promise.all(busquedas.map(ejecutarUna));
  return {
    contenido: JSON.stringify({ resultados: resultados.map((r) => r.resumen) }),
    productos: resultados.flatMap((r) => r.productos),
  };
}
