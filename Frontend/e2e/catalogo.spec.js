import { test, expect } from '@playwright/test';

test.describe('Catálogo', () => {
  test('carga los 41 productos con precio en pesos', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('41 productos')).toBeVisible();
    await expect(page.locator('.tarjeta')).toHaveCount(41);
    await expect(page.locator('.tarjeta__precio').first()).toHaveText(/^\$\d{1,3}(\.\d{3})+$/);
  });

  test('filtra por categoría y deja el filtro en la URL', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Fuentes/ }).click();

    await expect(page.getByText('6 productos')).toBeVisible();
    await expect(page.getByRole('button', { name: /Fuentes/ })).toHaveAttribute('aria-pressed', 'true');
    await expect(page).toHaveURL(/categoria=fuente/);
  });

  test('un link con ?categoria abre directo filtrado', async ({ page }) => {
    await page.goto('/?categoria=placa_video');
    await expect(page.getByText('7 productos')).toBeVisible();
  });

  test('la ficha muestra specs legibles, con tildes, y cierra con Escape', async ({ page }) => {
    await page.goto('/?categoria=cooler');
    await page.getByRole('button', { name: 'DeepCool LE500 Marrs' }).click();

    const ficha = page.getByRole('dialog', { name: 'DeepCool LE500 Marrs' });
    await expect(ficha).toBeVisible();
    await expect(ficha.getByText('Refrigeración', { exact: true })).toBeVisible();
    await expect(ficha.locator('dd', { hasText: /^Líquida$/ })).toBeVisible();
    await expect(ficha.locator('dd', { hasText: /^240 mm$/ })).toBeVisible();
    await expect(ficha.locator('dt').first()).toHaveText('Tipo');

    await page.keyboard.press('Escape');
    await expect(ficha).toBeHidden();
  });

  test('se puede recorrer con teclado y abrir una ficha con Enter', async ({ page, isMobile }) => {
    test.skip(isMobile, 'navegación con teclado: solo escritorio');
    await page.goto('/?categoria=fuente');
    const primera = page.locator('.tarjeta__abrir').first();
    await primera.focus();
    await expect(primera).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('.detalle[open]')).toBeVisible();
  });
});
