import { env } from '../../config/env';

/**
 * Cupo diario de tokens del proveedor. El rate limit por IP no alcanza: cien
 * visitantes legítimos también agotan el cupo gratuito, y a partir de ahí la
 * API devolvería errores en vez de respuestas. Mejor avisar que se terminó.
 */
interface Consumo {
  dia: string;
  tokens: number;
  llamadas: number;
}

let consumo: Consumo = { dia: hoy(), tokens: 0, llamadas: 0 };

function hoy(): string {
  return new Date().toISOString().slice(0, 10);
}

function alDia(): Consumo {
  if (consumo.dia !== hoy()) consumo = { dia: hoy(), tokens: 0, llamadas: 0 };
  return consumo;
}

/** Segundos que faltan para que el contador se reinicie (medianoche UTC). */
export function segundosHastaReinicio(): number {
  const manana = new Date();
  manana.setUTCHours(24, 0, 0, 0);
  return Math.ceil((manana.getTime() - Date.now()) / 1000);
}

export function hayCupo(): boolean {
  const max = env.limites.tokensDiaMax;
  return max <= 0 || alDia().tokens < max;
}

export function registrarUso(tokens: number): void {
  const actual = alDia();
  actual.tokens += tokens;
  actual.llamadas += 1;
  if (env.ia.debug) {
    console.log(`  [cupo] ${actual.tokens}/${env.limites.tokensDiaMax} tokens hoy (${actual.llamadas} llamadas)`);
  }
}

/** Para el endpoint de salud y los scripts: cuánto queda. */
export function estadoPresupuesto() {
  const actual = alDia();
  return {
    dia: actual.dia,
    tokens_usados: actual.tokens,
    tokens_max: env.limites.tokensDiaMax,
    llamadas: actual.llamadas,
    reinicia_en_segundos: segundosHastaReinicio(),
  };
}

/** Solo para los tests. */
export function reiniciarPresupuesto(): void {
  consumo = { dia: hoy(), tokens: 0, llamadas: 0 };
}
