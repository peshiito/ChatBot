import { test, expect } from '@playwright/test';
import { abrirConLanzador } from './utils.js';

const dialogo = (page) => page.locator('dialog.legal');

test.describe('Textos legales', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('el pie abre cada sección en su pestaña', async ({ page }) => {
    await page.getByRole('button', { name: 'Privacidad' }).click();

    await expect(dialogo(page)).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Privacidad' })).toBeVisible();
    await expect(page.getByText('no se pide ni se guarda nombre')).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Privacidad' })).toHaveAttribute('aria-selected', 'true');
  });

  test('se cambia de pestaña con el teclado y se cierra con Escape', async ({ page }) => {
    await page.getByRole('button', { name: 'Sobre el demo' }).click();
    await expect(page.getByRole('tab', { name: 'Sobre el demo' })).toBeFocused();

    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('heading', { name: 'Privacidad' })).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(dialogo(page)).not.toBeVisible();
  });

  test('el asesor avisa que las respuestas son de una IA', async ({ page }) => {
    await abrirConLanzador(page);

    const aviso = page.locator('.chat__aviso');
    await expect(aviso).toContainText('Respuestas generadas por IA');

    await aviso.getByRole('button', { name: 'Cómo funciona' }).click();
    await expect(page.getByRole('heading', { name: 'Cómo funciona el asesor' })).toBeVisible();
    await expect(page.getByText('no con una persona')).toBeVisible();
  });
});
