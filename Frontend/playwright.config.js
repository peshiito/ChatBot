import { defineConfig, devices } from '@playwright/test';

/**
 * Pruebas de punta a punta. Levanta el backend y Vite si no están corriendo;
 * MySQL tiene que estar arriba (docker compose up -d en Backend/).
 * Los tests @ia usan Groq de verdad: `npm run test:e2e -- --grep @ia`.
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  expect: { timeout: 8_000 },
  fullyParallel: false,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  grepInvert: process.env.CON_IA ? undefined : /@ia/,
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'escritorio',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'celular',
      use: { ...devices['Pixel 7'], viewport: { width: 390, height: 844 } },
    },
  ],
  webServer: [
    {
      command: 'npx tsx src/server.ts',
      cwd: '../Backend',
      url: 'http://localhost:3000/api/salud',
      reuseExistingServer: true,
      timeout: 30_000,
    },
    {
      command: 'npx vite --port 5173 --strictPort',
      url: 'http://localhost:5173',
      reuseExistingServer: true,
      timeout: 30_000,
    },
  ],
});
