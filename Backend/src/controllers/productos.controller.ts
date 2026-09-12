import type { Request, Response } from 'express';
import { ErrorHttp } from '../middlewares/errores';
import { listarProductos, obtenerProducto, obtenerCategorias } from '../services/productos/listarProductos';
import { buscarProductos } from '../services/productos/buscarProductos';

// Express 5 manda al middleware de errores lo que tiren los handlers async.

export async function getProductos(req: Request, res: Response): Promise<void> {
  const resultado = await listarProductos(req.query as Record<string, unknown>);
  res.json(resultado);
}

/** Misma busqueda que usa la IA, expuesta para probarla sin pasar por el chat. */
export async function getBuscar(req: Request, res: Response): Promise<void> {
  const resultado = await buscarProductos(req.query as Record<string, unknown>);
  res.json(resultado);
}

export async function getProductoPorId(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    throw new ErrorHttp(400, 'El id del producto tiene que ser un numero entero positivo.');
  }

  const producto = await obtenerProducto(id);
  if (!producto) {
    throw new ErrorHttp(404, 'No existe un producto con ese id.');
  }
  res.json(producto);
}

export async function getCategorias(_req: Request, res: Response): Promise<void> {
  res.json(await obtenerCategorias());
}
