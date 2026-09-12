import mysql from 'mysql2/promise';
import { env } from './env';

let pool: mysql.Pool | null = null;

export function obtenerPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: env.mysql.host,
      port: env.mysql.puerto,
      user: env.mysql.usuario,
      password: env.mysql.password,
      database: env.mysql.base,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      charset: 'utf8mb4',
      // Sin esto mysql2 devuelve los DECIMAL como string.
      decimalNumbers: true,
    });
  }
  return pool;
}

export async function consultar<T>(sql: string, params: unknown[] = []): Promise<T[]> {
  const [filas] = await obtenerPool().query(sql, params);
  return filas as T[];
}

export async function verificarConexion(): Promise<void> {
  const conexion = await obtenerPool().getConnection();
  try {
    await conexion.ping();
  } finally {
    conexion.release();
  }
}

export async function cerrarPool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
