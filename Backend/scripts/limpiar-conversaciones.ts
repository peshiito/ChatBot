/**
 * Política de retención: borra las conversaciones viejas del chat.
 * Se corre a mano o desde un cron:  npm run limpiar
 *   0 4 * * *  cd /ruta/Backend && npm run limpiar >> /var/log/chatbot-limpieza.log
 */
import { env } from '../src/config/env';
import { cerrarPool } from '../src/config/db';
import { borrarConversacionesViejas } from '../src/db/conversaciones.queries';

async function main(): Promise<void> {
  const dias = Number(process.argv[2]) || env.privacidad.retencionDias;

  if (dias <= 0) {
    console.log('RETENCION_DIAS es 0: no se borra nada. Pasá los días como argumento para forzarlo.');
    return;
  }

  const borradas = await borrarConversacionesViejas(dias);
  console.log(`Retención de ${dias} días: ${borradas} conversación(es) borradas con sus mensajes.`);
}

main()
  .catch((err) => {
    console.error('No se pudo limpiar:', err instanceof Error ? err.message : err);
    process.exitCode = 1;
  })
  .finally(() => cerrarPool());
