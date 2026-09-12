import { test, expect } from '@playwright/test';
import { mockearChat, panelChat } from './utils';

/*
 * Capturas de referencia. La primera corrida las genera
 * (npm run test:e2e -- --update-snapshots); después avisan si algo cambió.
 */
const opciones = { animations: 'disabled', maxDiffPixelRatio: 0.02 };

test.describe('Visual', () => {
  test('inicio', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.tarjeta').first()).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    await expect(page).toHaveScreenshot('inicio.png', opciones);
  });

  test('respuesta del asesor con tarjetas', async ({ page }) => {
    await mockearChat(page, { demoraMs: 50 });
    await page.goto('/');
    await page.getByRole('button', { name: 'Preguntar al asesor' }).click();
    await expect(panelChat(page).locator('.caja')).toHaveCount(4);
    await page.evaluate(() => document.fonts.ready);
    await expect(page).toHaveScreenshot('asesor-respuesta.png', opciones);
  });

  test('ficha de producto', async ({ page }) => {
    await page.goto('/?categoria=placa_video');
    await page.getByRole('button', { name: /RTX 4070 SUPER/ }).click();
    await expect(page.locator('.detalle[open]')).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    await expect(page).toHaveScreenshot('ficha.png', opciones);
  });
});
