/**
 * Capturas para el README y para mostrar el proyecto.
 *   node scripts/capturas.mjs          → usa una respuesta de ejemplo (no gasta IA)
 *   CON_IA=1 node scripts/capturas.mjs → le pregunta de verdad al asesor
 *
 * Necesita el backend y Vite levantados (npm run dev en cada uno).
 */
import { chromium, devices } from '@playwright/test';
import { mkdir, rm } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const ejecutar = promisify(execFile);

const BASE = process.env.BASE_URL ?? 'http://localhost:5173';
const SALIDA = '../docs/capturas';
const PREGUNTA = '¿Qué water cooling le pongo a un Ryzen 5 4600G?';

const RESPUESTA_EJEMPLO = {
  mensaje:
    '**Criterio:** tu Ryzen 5 4600G usa socket AM4 y consume 65 W, así que no necesitás una refrigeración líquida de 360 mm. Mirá que el cooler entre en el gabinete y no tape la RAM.\n\nDe nuestra parte, te podemos ofrecer:\n\n- **DeepCool LE500 Marrs** – líquida de 240 mm, compatible con AM4. $92.500.\n- **ARCTIC Liquid Freezer II 240** – más silenciosa y con mejor disipación. $127.000.\n- **DeepCool AG400** – por aire, 150 mm de alto: alcanza de sobra para 65 W. $37.900.',
  ids: [9, 10, 3],
};

async function mockearChat(pagina) {
  const { productos } = await (await pagina.request.get(`${BASE}/api/productos`)).json();
  await pagina.route('**/api/chat', (ruta) =>
    ruta.fulfill({
      json: {
        mensaje: RESPUESTA_EJEMPLO.mensaje,
        productos: RESPUESTA_EJEMPLO.ids.map((id) => productos.find((p) => p.id === id)),
        sesion_id: 'ses_capturas',
      },
    }),
  );
}

async function capturar(pagina, nombre) {
  await pagina.evaluate(() => document.fonts.ready);
  // Los diálogos entran con una transición: sin esto la captura sale a medio abrir.
  await pagina.waitForTimeout(400);
  const png = `${SALIDA}/${nombre}.png`;
  await pagina.screenshot({ path: png });

  // A WebP pesan la quinta parte y el README carga igual. Sin conversor, quedan en PNG.
  const webp = `${SALIDA}/${nombre}.webp`;
  for (const [orden, args] of [
    ['cwebp', ['-quiet', '-q', '86', png, '-o', webp]],
    ['magick', [png, '-quality', '86', webp]],
  ]) {
    try {
      await ejecutar(orden, args);
      await rm(png);
      console.log(`  ${webp}`);
      return;
    } catch {
      // Se prueba el siguiente conversor.
    }
  }
  console.log(`  ${png} (sin cwebp ni magick: quedó en PNG)`);
}

async function conAsesor(pagina, nombre) {
  await pagina.goto(BASE);
  await pagina.getByRole('button', { name: 'Preguntar al asesor' }).click();
  const tarjeta = pagina.locator('.caja').first();
  await tarjeta.waitFor({ timeout: 60_000 });
  // Las tarjetas embebidas son lo que hay que mostrar: se deja la conversación a esa altura.
  await tarjeta.scrollIntoViewIfNeeded();
  await capturar(pagina, nombre);
}

async function main() {
  await mkdir(SALIDA, { recursive: true });
  const navegador = await chromium.launch();
  const escritorio = await navegador.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const celular = await navegador.newContext({ ...devices['Pixel 7'] });

  const pagina = await escritorio.newPage();
  if (!process.env.CON_IA) await mockearChat(pagina);

  await pagina.goto(BASE);
  await capturar(pagina, '1-inicio');

  await pagina.goto(`${BASE}/?categoria=cooler`);
  await pagina.locator('.tarjeta').first().waitFor();
  await pagina.locator('#catalogo').scrollIntoViewIfNeeded();
  await capturar(pagina, '2-catalogo');

  await conAsesor(pagina, '3-asesor');

  await pagina.goto(`${BASE}/?categoria=placa_video`);
  await pagina.getByRole('button', { name: /RTX 4070 SUPER/ }).click();
  await pagina.locator('.detalle[open]').waitFor();
  await capturar(pagina, '4-ficha');

  await pagina.getByRole('button', { name: 'Cerrar ficha' }).click();
  await pagina.getByRole('button', { name: 'Privacidad' }).click();
  await pagina.locator('dialog.legal[open]').waitFor();
  await capturar(pagina, '5-legales');

  const movil = await celular.newPage();
  if (!process.env.CON_IA) await mockearChat(movil);
  await conAsesor(movil, '6-celular');

  await navegador.close();
  console.log(`\nListo. Pregunta usada: «${PREGUNTA}»${process.env.CON_IA ? ' (respuesta real)' : ' (respuesta de ejemplo)'}`);
}

main().catch((err) => {
  console.error('No se pudieron sacar las capturas. ¿Están levantados el backend y Vite?\n', err.message);
  process.exit(1);
});
