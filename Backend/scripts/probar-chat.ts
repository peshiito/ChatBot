/**
 * Prueba de la Etapa 4 contra la API levantada (npm run dev en otra terminal).
 * Después de esta prueba la IP queda limitada un minuto: es lo esperado.
 */
import { env } from '../src/config/env';
import { consultar, cerrarPool } from '../src/config/db';
import type { MensajeChat } from '../src/types/ia';

const URL_CHAT = `http://localhost:${env.puerto}/api/chat`;
let fallas = 0;

function afirmar(condicion: boolean, mensaje: string): void {
  console.log(`  ${condicion ? 'OK   ' : 'FALLA'} ${mensaje}`);
  if (!condicion) fallas++;
}

async function enviar(cuerpo: unknown, crudo = false) {
  const res = await fetch(URL_CHAT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: crudo ? String(cuerpo) : JSON.stringify(cuerpo),
  });
  return { status: res.status, datos: (await res.json()) as Record<string, any> };
}

async function conversar(): Promise<string> {
  const preguntas = [
    '¿Qué water cooling le pongo a un Ryzen 5 4600G?',
    '¿Y el más barato?',
    '¿Y si en vez de líquida prefiero uno por aire que no tape la RAM?',
  ];
  const historial: MensajeChat[] = [];
  let sesionId = '';

  for (const pregunta of preguntas) {
    console.log(`\n> ${pregunta}`);
    const { status, datos } = await enviar({ mensaje: pregunta, historial, sesion_id: sesionId || undefined });
    afirmar(status === 200, `responde 200 (llegó ${status}${datos.error ? `: ${datos.error}` : ''})`);
    if (status !== 200) continue;

    console.log(`  ${String(datos.mensaje).replace(/\n+/g, ' ').slice(0, 220)}…`);
    console.log(`  tarjetas: ${datos.productos.map((p: any) => p.nombre).join(' | ') || '(ninguna)'}`);
    afirmar(Array.isArray(datos.productos), 'trae la lista de productos');
    afirmar(!sesionId || datos.sesion_id === sesionId, 'mantiene la misma sesión');

    sesionId = datos.sesion_id;
    historial.push({ rol: 'user', contenido: pregunta }, { rol: 'assistant', contenido: datos.mensaje });
  }
  return sesionId;
}

async function validaciones(): Promise<void> {
  console.log('\n> Validaciones');
  const vacio = await enviar({ mensaje: '   ' });
  afirmar(vacio.status === 400, `mensaje vacío -> 400 "${vacio.datos.error}"`);

  const largo = await enviar({ mensaje: 'x'.repeat(env.limites.mensajeMaxCaracteres + 1) });
  afirmar(largo.status === 400, `mensaje muy largo -> 400 "${largo.datos.error}"`);

  const roto = await enviar('{"mensaje": ', true);
  afirmar(roto.status === 400, `JSON roto -> 400 "${roto.datos.error}"`);
}

/** Manda pedidos inválidos (no gastan IA pero sí cuentan para el límite) hasta que corte. */
async function rateLimit(): Promise<void> {
  console.log('\n> Rate limit');
  let intentos = 0;
  let r = await enviar({ mensaje: '' });
  while (r.status !== 429 && intentos < env.limites.rateLimitMax) {
    intentos++;
    r = await enviar({ mensaje: '' });
  }
  afirmar(r.status === 429, `corta con 429 al pasar ${env.limites.rateLimitMax} pedidos por minuto: "${r.datos.error}"`);
  afirmar(typeof r.datos.reintentar_en_segundos === 'number', `indica cuándo reintentar (${r.datos.reintentar_en_segundos}s)`);
  afirmar(!('detalle' in r.datos) && !JSON.stringify(r.datos).includes(' at '), 'sin stack trace');
}

async function registro(sesionId: string): Promise<void> {
  console.log('\n> Registro en la base');
  await new Promise((r) => setTimeout(r, 500)); // el registro no bloquea la respuesta
  const filas = await consultar<{ rol: string; productos_sugeridos: unknown }>(
    `SELECT m.rol, m.productos_sugeridos FROM mensajes m
     JOIN conversaciones c ON c.id = m.conversacion_id WHERE c.sesion_id = ? ORDER BY m.id`,
    [sesionId],
  );
  afirmar(filas.length === 6, `quedaron 6 mensajes guardados para ${sesionId} (${filas.length})`);
  afirmar(filas.some((f) => f.rol === 'assistant' && f.productos_sugeridos), 'se guardaron los productos sugeridos');
}

async function main(): Promise<void> {
  const sesionId = await conversar();
  await validaciones();
  await rateLimit();
  if (sesionId) await registro(sesionId);
  console.log(`\n${fallas === 0 ? 'Todas las pruebas pasaron.' : `${fallas} prueba(s) fallaron.`}`);
}

main()
  .catch((err) => {
    console.error('\n¿Está levantada la API? (npm run dev)\n', err);
    fallas++;
  })
  .finally(async () => {
    await cerrarPool();
    process.exit(fallas === 0 ? 0 : 1);
  });
