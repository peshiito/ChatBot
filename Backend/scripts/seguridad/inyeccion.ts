import { buscarProductos } from '../../src/services/productos/buscarProductos';
import { afirmar, api, titulo } from './comun';

/**
 * Las consultas usan parámetros (`?`), así que una comilla es un dato más.
 * Estas pruebas lo verifican por los dos caminos: la función y el endpoint.
 */
const CARGAS = [
  "' OR 1=1 -- ",
  "'; DROP TABLE productos; -- ",
  "\\' UNION SELECT id, nombre FROM usuarios -- ",
  "1' AND (SELECT SLEEP(3)) -- ",
  '<script>alert(1)</script>',
];

async function porLaFuncion(): Promise<void> {
  for (const carga of CARGAS) {
    const antes = Date.now();
    const { productos } = await buscarProductos({ texto: carga, marca: carga, socket: carga });
    const tardo = Date.now() - antes;

    afirmar(productos.length === 0, `no devuelve nada con  ${carga.trim().slice(0, 34)}`);
    afirmar(tardo < 2000, `y responde rápido (${tardo} ms: el SLEEP no se ejecutó)`);
  }
}

async function tablasIntactas(): Promise<void> {
  const { productos } = await buscarProductos({ categoria: 'procesador' });
  afirmar(productos.length > 0, 'el catálogo sigue entero después de las cargas');
}

async function porElEndpoint(): Promise<void> {
  for (const carga of CARGAS.slice(0, 3)) {
    const url = `${api('/productos/buscar')}?texto=${encodeURIComponent(carga)}`;
    const res = await fetch(url);
    const datos = (await res.json()) as {
      productos?: Record<string, unknown>[];
      criterios_aplicados?: Record<string, unknown>;
      relajaciones?: string[];
    };

    afirmar(res.status === 200, `/productos/buscar responde 200 con  ${carga.trim().slice(0, 28)}`);
    // La carga se trata como texto: no matchea nada y la búsqueda se relaja sola.
    afirmar(datos.criterios_aplicados?.texto === undefined, 'la carga no quedó como criterio: no matcheó nada');
    afirmar(Boolean(datos.relajaciones?.length), 'la respuesta avisa que tuvo que relajar la búsqueda');

    const campos = new Set(Object.keys(datos.productos?.[0] ?? {}));
    afirmar(
      campos.has('nombre') && !campos.has('password_hash') && !campos.has('email'),
      'solo devuelve columnas del catálogo, nada de otras tablas',
    );
  }
}

export async function pruebasDeInyeccion(): Promise<void> {
  titulo('Inyección SQL');
  await porLaFuncion();
  await tablasIntactas();
  await porElEndpoint();
}
