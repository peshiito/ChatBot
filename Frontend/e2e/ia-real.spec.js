import { test, expect } from '@playwright/test';
import { panelChat } from './utils';

/*
 * Prueba de punta a punta con la IA de verdad (gasta cupo de Groq).
 * Se corre aparte: CON_IA=1 npm run test:e2e -- --grep @ia --project=escritorio
 */
test('@ia la pregunta de referencia trae criterio técnico y productos reales', async ({ page }) => {
  test.setTimeout(60_000);
  await page.goto('/');
  await page.getByRole('button', { name: 'Preguntar al asesor' }).click();

  const chat = panelChat(page);
  const respuesta = chat.locator('.mensaje--asesor');
  await expect(respuesta).toBeVisible({ timeout: 45_000 });

  await expect(respuesta).toContainText('AM4');
  await expect(respuesta).toContainText('65');
  const tarjetas = chat.locator('.caja');
  expect(await tarjetas.count()).toBeGreaterThanOrEqual(2);

  const { productos } = await (await page.request.get('/api/productos')).json();
  const nombresReales = new Set(productos.map((p) => p.nombre));
  for (const nombre of await chat.locator('.caja__nombre').allTextContents()) {
    expect(nombresReales.has(nombre)).toBe(true);
  }

  await page.screenshot({ path: `test-results/ia-real-${test.info().project.name}.png` });
});
