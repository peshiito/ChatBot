import { expect } from '@playwright/test';

/** Respuesta del asesor armada con productos reales de la base, sin gastar la IA. */
export async function mockearChat(page, { ids = [9, 10, 11, 3], demoraMs = 600, mensaje } = {}) {
  const { productos } = await (await page.request.get('/api/productos')).json();
  const elegidos = ids.map((id) => productos.find((p) => p.id === id));

  await page.route('**/api/chat', async (route) => {
    await new Promise((r) => setTimeout(r, demoraMs));
    await route.fulfill({
      json: {
        mensaje:
          mensaje ??
          '**Criterio:** tu Ryzen 5 4600G usa socket AM4 y consume 65 W.\n\n- **DeepCool LE500 Marrs** – $92.500.\n- **ARCTIC Liquid Freezer II 240** – $127.000.\n\n> Para 65 W una torre de aire alcanza: **DeepCool AG400**, $37.900.',
        productos: elegidos,
        sesion_id: 'ses_prueba_e2e_0001',
      },
    });
  });
  return elegidos;
}

/** Simula que la IA está saturada: el backend responde 429 con cuándo reintentar. */
export async function mockearChatSaturado(page) {
  let llamadas = 0;
  await page.route('**/api/chat', async (route) => {
    llamadas += 1;
    if (llamadas === 1) {
      await route.fulfill({
        status: 429,
        json: { error: 'El asistente está atendiendo muchas consultas. Probá de nuevo en 5 segundos.', reintentar_en_segundos: 5 },
      });
      return;
    }
    await route.fallback();
  });
}

export const panelChat = (page) => page.getByRole('dialog', { name: 'Asesor HardStore' });

/** El botón flotante solo aparece cuando el hero sale de pantalla. */
export async function abrirConLanzador(page) {
  await page.locator('#catalogo').scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollBy(0, 400));
  const lanzador = page.locator('.lanzador');
  await expect(lanzador).toBeVisible();
  await lanzador.click();
}
