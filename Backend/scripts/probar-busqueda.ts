import { buscarProductos } from '../src/services/productos/buscarProductos';
import { cerrarPool } from '../src/config/db';
import type { ResultadoBusqueda } from '../src/types/busqueda';

let fallas = 0;

function afirmar(condicion: boolean, mensaje: string): void {
  console.log(`  ${condicion ? 'OK   ' : 'FALLA'} ${mensaje}`);
  if (!condicion) fallas++;
}

function mostrar(r: ResultadoBusqueda): void {
  for (const p of r.productos) {
    const precio = `$${p.precio.toLocaleString('es-AR')}`;
    console.log(`    [${String(p.relevancia).padStart(3)}] ${p.nombre.padEnd(46)} ${precio}`);
  }
  if (r.relajaciones.length) console.log(`    relajado: ${r.relajaciones.join(' -> ')}`);
}

function socketsDe(specs: Record<string, unknown>): string[] {
  if (Array.isArray(specs.sockets)) return specs.sockets as string[];
  return typeof specs.socket === 'string' ? [specs.socket] : [];
}

async function caso(titulo: string, criterios: Record<string, unknown>, verificar: (r: ResultadoBusqueda) => void) {
  console.log(`\n> ${titulo}\n  ${JSON.stringify(criterios)}`);
  const r = await buscarProductos(criterios);
  mostrar(r);
  verificar(r);
}

async function main(): Promise<void> {
  await caso('Prueba del plan: coolers AM4', { categoria: 'cooler', socket: 'AM4', limite: 12 }, (r) => {
    afirmar(r.total > 0, `devuelve resultados (${r.total})`);
    afirmar(r.productos.every((p) => p.categoria === 'cooler'), 'todos son coolers');
    afirmar(r.productos.every((p) => socketsDe(p.specs).includes('AM4')), 'todos soportan AM4');
    afirmar(r.relajaciones.length === 0, 'no hizo falta relajar');
  });

  await caso('Caso Ryzen 5 4600G (65 W): lo sobredimensionado baja', { categoria: 'cooler', socket: 'AM4', tdp_minimo: 65 }, (r) => {
    afirmar(r.productos.every((p) => p.specs.tipo === 'aire'), 'para 65 W recomienda primero aire');
    afirmar(r.productos.every((p) => (p.specs.tdp_max_w as number) >= 65), 'todos soportan 65 W o mas');
  });

  await caso('Pregunta de referencia: water cooling para Ryzen 5 4600G', { categoria: 'cooler', socket: 'AM4', tdp_minimo: 65, tipo: 'liquida', limite: 5 }, (r) => {
    afirmar(r.productos.every((p) => p.specs.tipo === 'liquida'), 'si pide liquida, respeta el pedido');
    afirmar(r.productos.at(-1)?.specs.radiador_mm === 360, 'la de 360 mm queda ultima (no hace falta para 65 W)');
  });

  await caso('Sin match exacto: cooler por aire con RGB para AM4', { categoria: 'cooler', socket: 'AM4', tipo: 'aire', rgb: true }, (r) => {
    afirmar(r.total > 0, 'igual ofrece algo');
    afirmar(r.relajaciones.some((x) => x.includes('RGB')), 'avisa que aflojo el RGB');
    afirmar(r.productos.every((p) => socketsDe(p.specs).includes('AM4')), 'nunca relaja la compatibilidad de socket');
  });

  await caso('Procesadores AM5', { categoria: 'cpu', socket: 'am5' }, (r) => {
    afirmar(r.productos.every((p) => p.categoria === 'procesador' && p.specs.socket === 'AM5'), 'sinonimo "cpu" y socket en minuscula funcionan');
  });

  await caso('Placa de video hasta $300.000', { categoria: 'placa_video', precio_max: 300000 }, (r) => {
    afirmar(r.productos.every((p) => p.precio <= 300000), 'respeta el presupuesto');
  });

  await caso('Tipos que la IA manda como texto', { categoria: 'gpu', vram_minima_gb: '12' }, (r) => {
    afirmar(r.productos.every((p) => (p.specs.vram_gb as number) >= 12), 'convierte "12" a numero y filtra');
  });

  await caso('Presupuesto imposible', { categoria: 'placa_video', precio_max: 100000 }, (r) => {
    afirmar(r.total > 0, 'no responde "no hay nada"');
    afirmar(r.relajaciones.length > 0, 'explica que tuvo que aflojar el presupuesto');
  });

  await caso('Modelo que no hay: muestra toda la gama, no solo lo barato', { categoria: 'procesador', texto: 'Ryzen 9 9950X', limite: 4 }, (r) => {
    const precios = r.productos.map((p) => p.precio);
    afirmar(Math.max(...precios) === 459000, 'incluye el procesador más caro (7800X3D)');
    afirmar(Math.min(...precios) === 124900, 'incluye el más barato (4600G)');
  });

  await caso('Orden variado: para armar niveles barato / medio / caro', { categoria: 'placa_video', orden: 'variado', limite: 3 }, (r) => {
    const precios = r.productos.map((p) => p.precio);
    afirmar(precios.length === 3, 'devuelve 3 opciones');
    afirmar(Math.min(...precios) === 248000 && Math.max(...precios) === 785000, 'va de la más barata a la más cara');
  });

  await caso('Orden precio_desc', { categoria: 'procesador', orden: 'precio_desc', limite: 2 }, (r) => {
    afirmar(r.productos[0]?.precio === 459000, 'arranca por el más caro');
  });

  await caso('Socket inexistente', { categoria: 'cooler', socket: 'LGA9999' }, (r) => {
    afirmar(r.total === 0, 'no inventa compatibilidad');
  });

  console.log(`\n${fallas === 0 ? 'Todas las pruebas pasaron.' : `${fallas} prueba(s) fallaron.`}`);
}

main()
  .catch((err) => {
    console.error(err);
    fallas++;
  })
  .finally(async () => {
    await cerrarPool();
    process.exit(fallas === 0 ? 0 : 1);
  });
