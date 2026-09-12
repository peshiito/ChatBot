/**
 * Prueba de la Etapa 3 desde consola.
 *   npm run probar:ia                          -> pregunta de referencia + repregunta
 *   npm run probar:ia -- "tu pregunta"         -> una pregunta suelta
 * El script de npm activa IA_DEBUG para mostrar los criterios que dedujo el modelo.
 */
import { responder } from '../src/services/ia/asistente';
import { cerrarPool } from '../src/config/db';
import type { MensajeChat } from '../src/types/ia';

const PREGUNTA_REFERENCIA = '¿Qué water cooling le pongo a un Ryzen 5 4600G?';
const REPREGUNTA = '¿Y cuál es el más barato de esos?';

async function turno(conversacion: MensajeChat[], pregunta: string): Promise<void> {
  console.log(`\n\x1b[1mUsuario:\x1b[0m ${pregunta}`);
  conversacion.push({ rol: 'user', contenido: pregunta });

  const inicio = Date.now();
  const r = await responder(conversacion);
  const segundos = ((Date.now() - inicio) / 1000).toFixed(1);

  console.log(`\n\x1b[1mAsistente\x1b[0m (${segundos}s, ${r.iteraciones} vuelta(s) de herramientas):`);
  console.log(r.mensaje);
  console.log('\n\x1b[1mTarjetas de producto:\x1b[0m');
  for (const p of r.productos) {
    console.log(`  #${p.id} ${p.nombre} - $${p.precio.toLocaleString('es-AR')} (stock ${p.stock})`);
  }
  if (r.productos.length === 0) console.log('  (ninguna)');

  conversacion.push({ rol: 'assistant', contenido: r.mensaje });
}

async function main(): Promise<void> {
  const conversacion: MensajeChat[] = [];
  const preguntaSuelta = process.argv.slice(2).join(' ').trim();

  if (preguntaSuelta) {
    await turno(conversacion, preguntaSuelta);
    return;
  }
  await turno(conversacion, PREGUNTA_REFERENCIA);
  await turno(conversacion, REPREGUNTA);
}

main()
  .catch((err) => {
    console.error('\nError:', err);
    process.exitCode = 1;
  })
  .finally(() => cerrarPool());
