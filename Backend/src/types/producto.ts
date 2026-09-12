/** Datos tecnicos variables segun la categoria. Viven en la columna JSON `specs`. */
export type Specs = Record<string, string | number | boolean | string[] | null>;

export interface Producto {
  id: number;
  sku: string | null;
  nombre: string;
  categoria: string;
  marca: string;
  precio: number;
  stock: number;
  descripcion: string | null;
  imagen_url: string | null;
  specs: Specs;
}

/** Producto con el puntaje que le dio el ordenamiento por relevancia. */
export interface ProductoPuntuado extends Producto {
  relevancia: number;
}

export interface Categoria {
  slug: string;
  etiqueta: string;
  orden: number;
}
