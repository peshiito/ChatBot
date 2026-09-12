/**
 * Pruebas de seguridad contra la API levantada (npm run dev en otra terminal).
 * No gasta tokens de IA salvo que se corra con CON_IA=1 (prueba de prompt injection).
 * Al final la IP queda limitada un minuto: es parte de la prueba.
 */
import { env } from '../src/config/env';
import { cerrarPool } from '../src/config/db';
import { pruebasDeInyeccion } from './seguridad/inyeccion';
import { pruebaPromptInjection } from './seguridad/promptInjection';
import { afirmar, api, fallas, titulo } from './seguridad/comun';

async function cabeceras(): Promise<void> {
  titulo('Cabeceras de seguridad');
  const res = await fetch(api('/salud'));
  const csp = res.headers.get('content-security-policy') ?? '';

  afirmar(csp.includes("default-src 'none'"), `CSP cerrada (${csp.slice(0, 40)}…)`);
  afirmar(csp.includes("frame-ancestors 'none'"), 'no se puede embeber en un iframe ajeno');
  afirmar(res.headers.get('x-content-type-options') === 'nosniff', 'X-Content-Type-Options: nosniff');
  afirmar(res.headers.get('referrer-policy') === 'no-referrer', 'Referrer-Policy: no-referrer');
  afirmar(res.headers.get('x-powered-by') === null, 'no publica que es Express');
}

async function cors(): Promise<void> {
  titulo('CORS');
  const permitido = await fetch(api('/categorias'), { headers: { Origin: env.corsOrigenes[0]! } });
  afirmar(
    permitido.headers.get('access-control-allow-origin') === env.corsOrigenes[0],
    `el frontend propio pasa (${env.corsOrigenes[0]})`,
  );

  const ajeno = await fetch(api('/categorias'), { headers: { Origin: 'https://sitio-ajeno.example' } });
  afirmar(ajeno.status === 403, `un origen ajeno recibe 403 (llegó ${ajeno.status})`);
  afirmar(
    ajeno.headers.get('access-control-allow-origin') === null,
    'y no recibe la cabecera que lo habilitaría',
  );
}

async function erroresSinFugas(): Promise<void> {
  titulo('Errores sin fugas');
  const roto = await fetch(api('/chat'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{"mensaje": ',
  });
  const cuerpoRoto = await roto.text();
  afirmar(roto.status === 400, `JSON inválido -> 400 (llegó ${roto.status})`);
  afirmar(!/\bat \w+ \(|node_modules|\.ts:\d+/.test(cuerpoRoto), 'la respuesta no trae stack trace');

  const grande = await fetch(api('/chat'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mensaje: 'hola', historial: [{ rol: 'user', contenido: 'x'.repeat(200_000) }] }),
  });
  afirmar(grande.status === 413, `cuerpo de 200 KB -> 413 (llegó ${grande.status})`);

  const inexistente = await fetch(api('/no-existe'));
  afirmar(inexistente.status === 404, `ruta inexistente -> 404 (llegó ${inexistente.status})`);

  const idRaro = await fetch(api('/productos/1;DROP'));
  afirmar(idRaro.status === 400, `id no numérico -> 400, no 500 (llegó ${idRaro.status})`);
}

/** El límite por IP tiene que cortar aunque los pedidos sean inválidos (no llegan a la IA). */
async function limiteDeUso(): Promise<void> {
  titulo('Límite de uso');
  const intentos = env.limites.rateLimitMax + 2;
  let bloqueados = 0;

  for (let i = 0; i < intentos; i++) {
    const res = await fetch(api('/chat'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensaje: '' }),
    });
    if (res.status === 429) {
      bloqueados++;
      if (bloqueados === 1) afirmar(res.headers.get('retry-after') !== null, 'el 429 dice cuándo reintentar');
    }
  }
  afirmar(bloqueados > 0, `tras ${intentos} pedidos seguidos aparece el 429 (${bloqueados} bloqueados)`);
}

async function main(): Promise<void> {
  await cabeceras();
  await cors();
  await pruebasDeInyeccion();
  await erroresSinFugas();
  // El de uso va último: deja la IP limitada un minuto.
  await pruebaPromptInjection();
  await limiteDeUso();
  console.log(`\n${fallas() === 0 ? 'Todas las pruebas de seguridad pasaron.' : `${fallas()} prueba(s) fallaron.`}`);
}

main()
  .catch((err) => {
    console.error('\n¿Está levantada la API? (npm run dev)\n', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await cerrarPool();
    process.exit(fallas() === 0 ? 0 : 1);
  });
