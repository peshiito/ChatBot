import { env } from '../../src/config/env';

let contador = 0;

export const api = (ruta: string): string => `http://localhost:${env.puerto}/api${ruta}`;

export function titulo(texto: string): void {
  console.log(`\n> ${texto}`);
}

export function afirmar(condicion: boolean, mensaje: string): boolean {
  console.log(`  ${condicion ? 'OK   ' : 'FALLA'} ${mensaje}`);
  if (!condicion) contador++;
  return condicion;
}

export const fallas = (): number => contador;
