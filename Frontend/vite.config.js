import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    server: {
      port: 5173,
      // En desarrollo el front llama a /api y Vite lo reenvía al backend: sin CORS ni URLs fijas.
      proxy: {
        '/api': env.VITE_BACKEND_URL ?? 'http://localhost:3000',
      },
    },
  };
});
