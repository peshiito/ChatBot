import { test, expect } from '@playwright/test';
import { mockearChat, mockearChatSaturado, panelChat, abrirConLanzador } from './utils';

test.describe('Asesor', () => {
  test('la pregunta del hero abre el asesor y muestra tarjetas de producto', async ({ page }) => {
    const productos = await mockearChat(page);
    await page.goto('/');
    await page.getByRole('button', { name: 'Preguntar al asesor' }).click();

    const chat = panelChat(page);
    await expect(chat).toBeVisible();
    await expect(chat.getByText('¿Qué water cooling le pongo a un Ryzen 5 4600G?')).toBeVisible();
    await expect(chat.locator('.vidrio__tira')).toHaveAttribute('data-encendida', 'true');

    await expect(chat.locator('.mensaje--asesor')).toBeVisible();
    await expect(chat.locator('.vidrio__tira')).toHaveAttribute('data-encendida', 'false');
    await expect(chat.locator('.caja')).toHaveCount(productos.length);
    await expect(chat.locator('.mensaje--asesor strong').first()).toHaveText('Criterio:');
    await expect(chat.getByText('**')).toHaveCount(0);
  });

  test('una respuesta larga se muestra desde su comienzo', async ({ page }) => {
    const larga = `**Criterio:** empieza acá.\n\n${'- Una línea más de explicación para alargar la respuesta.\n'.repeat(14)}`;
    await mockearChat(page, { mensaje: larga });
    await page.goto('/');
    await page.getByRole('button', { name: 'Preguntar al asesor' }).click();

    const inicio = panelChat(page).locator('.mensaje--asesor strong').first();
    await expect(inicio).toHaveText('Criterio:');
    await expect(inicio).toBeInViewport();
  });

  test('tocar una tarjeta del chat abre la ficha del producto', async ({ page }) => {
    await mockearChat(page);
    await page.goto('/');
    await page.getByRole('button', { name: 'Preguntar al asesor' }).click();
    await panelChat(page).locator('.caja__boton').first().click();
    await expect(page.getByRole('dialog', { name: 'DeepCool LE500 Marrs' })).toBeVisible();
  });

  test('una sugerencia inicial manda la pregunta', async ({ page }) => {
    await mockearChat(page);
    await page.goto('/?categoria=fuente');
    await abrirConLanzador(page);
    const chat = panelChat(page);
    await chat.getByRole('button', { name: /RTX 4070 Super/ }).click();
    await expect(chat.locator('.mensaje--usuario')).toHaveText('¿Qué fuente necesito para una RTX 4070 Super?');
    await expect(chat.locator('.mensaje--asesor')).toBeVisible();
  });

  test('si la IA está saturada, avisa y deja volver a preguntar', async ({ page }) => {
    // Playwright prueba las rutas de la última a la primera: el 429 va encima del mock normal.
    await mockearChat(page);
    await mockearChatSaturado(page);
    await page.goto('/');
    await page.getByRole('button', { name: 'Preguntar al asesor' }).click();

    const chat = panelChat(page);
    await expect(chat.getByRole('alert')).toContainText('Probá de nuevo en 5 segundos');
    await chat.getByRole('button', { name: 'Volver a preguntar' }).click();
    await expect(chat.locator('.mensaje--asesor')).toBeVisible();
    await expect(chat.getByRole('alert')).toHaveCount(0);
    await expect(chat.locator('.mensaje--usuario')).toHaveCount(1);
  });

  test('desde la ficha se abre el asesor con la pregunta empezada', async ({ page }) => {
    await page.goto('/?categoria=procesador');
    await page.getByRole('button', { name: 'AMD Ryzen 5 4600G' }).click();
    await page.getByRole('button', { name: 'Preguntar por este producto' }).click();

    const campo = panelChat(page).getByRole('textbox', { name: 'Tu pregunta para el asesor' });
    await expect(campo).toHaveValue(/^¿El AMD Ryzen 5 4600G me sirve\?/);
    await expect(campo).toBeFocused();
  });

  test('Escape cierra el asesor y el foco vuelve al botón', async ({ page, isMobile }) => {
    test.skip(isMobile, 'teclado físico: solo escritorio');
    await page.goto('/?categoria=fuente');
    await abrirConLanzador(page);
    await expect(panelChat(page)).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(panelChat(page)).toBeHidden();
    await expect(page.locator('.lanzador')).toBeFocused();
  });
});
