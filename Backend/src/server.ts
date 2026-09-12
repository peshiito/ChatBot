import { env } from './config/env';
import { verificarConexion, cerrarPool } from './config/db';
import { crearApp } from './app';

async function iniciar(): Promise<void> {
  try {
    await verificarConexion();
  } catch (err) {
    console.error('No se pudo conectar a MySQL. ¿Estan levantados los contenedores?');
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  }

  const servidor = crearApp().listen(env.puerto, () => {
    console.log(`API escuchando en http://localhost:${env.puerto}/api`);
  });

  const apagar = () => {
    servidor.close(async () => {
      await cerrarPool();
      process.exit(0);
    });
  };
  process.on('SIGINT', apagar);
  process.on('SIGTERM', apagar);
}

void iniciar();
