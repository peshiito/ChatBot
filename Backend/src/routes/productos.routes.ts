import { Router } from 'express';
import {
  getProductos,
  getBuscar,
  getProductoPorId,
  getCategorias,
} from '../controllers/productos.controller';

export const productosRouter = Router();

productosRouter.get('/productos', getProductos);
productosRouter.get('/productos/buscar', getBuscar);
productosRouter.get('/productos/:id', getProductoPorId);
productosRouter.get('/categorias', getCategorias);
