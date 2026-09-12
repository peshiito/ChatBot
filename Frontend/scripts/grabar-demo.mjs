/**
 * Graba un video del demo, sin manos: escribe la pregunta, espera la respuesta real
 * del asesor, muestra las tarjetas y abre una ficha.
 *
 *   node scripts/grabar-demo.mjs           → con la IA de verdad (lo que se muestra)
 *   SIN_IA=1 node scripts/grabar-demo.mjs  → con una respuesta de ejemplo (para ensayar)
 *
 * Sale un .webm en docs/demo/. Necesita el backend y Vite levantados.
 */
import { chromium } from '@playwright/test';
import { mkdir, readdir, rename } from 'node:fs/promises';

const BASE = process.env.BASE_URL ?? 'http://localhost:5173';
const SALIDA = '../docs/demo';
const PREGUNTA = '¿Qué water cooling le pongo a un Ryzen 5 4600G?';

const RESPUESTA_EJEMPLO =
  '**Criterio:** tu Ryzen 5 4600G usa socket AM4 y consume 65 W: no hace falta una AIO de 360 mm.\n\nDe nuestra parte, te podemos ofrecer:\n\n- **DeepCool LE500 Marrs** – líquida de 240 mm. $92.500.\n- **ARCTIC Liquid Freezer II 240** – más silenciosa. $127.000.\n- **DeepCool AG400** – por aire, 150 mm de alto. $37.900.';

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

async function mockearChat(pagina) {
  const { productos } = await (await pagina.request.get(`${BASE}/api/productos`)).json();
  await pagina.route('**/api/chat', async (ruta) => {
    await esperar(2500);
    await ruta.fulfill({
      json: {
        mensaje: RESPUESTA_EJEMPLO,
        productos: [9, 10, 3].map((id) => productos.find((p) => p.id === id)),
        sesion_id: 'ses_demo',
      },
    });
  });
}

/** Escribe como una persona: se ve el texto apareciendo. */
async function escribir(campo, texto) {
  await campo.click();
  await campo.fill('');
  await campo.pressSequentially(texto, { delay: 55 });
}

async function guion(pagina) {
  await pagina.goto(BASE);
  await pagina.locator('.tarjeta').first().waitFor();
  await esperar(1800);

  // 1. La pregunta, escrita en el panel del hero.
  const campo = pagina.locator('#hero-pregunta');
  await escribir(campo, PREGUNTA);
  await esperar(700);
  await pagina.getByRole('button', { name: 'Preguntar al asesor' }).click();

  // 2. El asesor piensa y responde con productos reales.
  const tarjeta = pagina.locator('.caja').first();
  await tarjeta.waitFor({ timeout: 90_000 });
  await esperar(2500);

  // 3. Se lee la respuesta de arriba hacia abajo hasta las tarjetas.
  await pagina.mouse.move(700, 500);
  for (let i = 0; i < 6; i++) {
    await pagina.mouse.wheel(0, 180);
    await esperar(450);
  }
  await esperar(1500);

  // 4. Una tarjeta abre la ficha completa del producto.
  await tarjeta.click();
  await pagina.locator('.detalle[open]').waitFor();
  await esperar(3000);
  await pagina.getByRole('button', { name: 'Cerrar ficha' }).click();
  await esperar(1200);

  // 5. Repregunta: el asesor mantiene el contexto.
  const chat = pagina.locator('#chat-campo');
  await escribir(chat, '¿y el más barato?');
  await esperar(500);
  await pagina.keyboard.press('Enter');
  await pagina.locator('.mensaje--asesor').nth(1).waitFor({ timeout: 90_000 });
  await esperar(4000);
}

async function main() {
  await mkdir(SALIDA, { recursive: true });
  const navegador = await chromium.launch();
  const contexto = await navegador.newContext({
    viewport: { width: 1280, height: 800 },
    recordVideo: { dir: SALIDA, size: { width: 1280, height: 800 } },
  });

  const pagina = await contexto.newPage();
  if (process.env.SIN_IA) await mockearChat(pagina);

  try {
    await guion(pagina);
  } finally {
    await contexto.close();
    await navegador.close();
  }

  // Playwright nombra el video con un hash: se le pone un nombre que se entienda.
  const archivos = await readdir(SALIDA);
  const video = archivos.filter((f) => f.endsWith('.webm')).sort().pop();
  const nombre = `demo-${new Date().toISOString().slice(0, 10)}.webm`;
  await rename(`${SALIDA}/${video}`, `${SALIDA}/${nombre}`);
  console.log(`\nListo: docs/demo/${nombre}`);
  console.log('Para pasarlo a mp4:  ffmpeg -i docs/demo/' + nombre + ' -c:v libx264 -crf 23 docs/demo/demo.mp4');
}

main().catch((err) => {
  console.error('No se pudo grabar. ¿Están levantados el backend y Vite?\n', err.message);
  process.exit(1);
});
