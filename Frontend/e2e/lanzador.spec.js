import { test, expect } from '@playwright/test';

test('el botón flotante se oculta mientras se ve el hero y aparece al bajar', async ({ page }) => {
  await page.goto('/');
  const lanzador = page.locator('.lanzador');
  await expect(lanzador).toBeHidden();

  await page.locator('#catalogo').scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollBy(0, 400));
  await expect(lanzador).toBeVisible();
});

test('con movimiento reducido no quedan animaciones infinitas', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.getByText('41 productos')).toBeVisible();
  const infinitas = await page.evaluate(
    () => document.getAnimations().filter((a) => a.effect?.getTiming().iterations === Infinity).length,
  );
  expect(infinitas).toBe(0);
});
