import { useState } from 'react';
import { Pictograma } from './Pictograma';
import './foto.css';

/**
 * Foto del producto. Si no tiene, o si no carga, se muestra el dibujo de su
 * categoría: la tarjeta nunca queda con un hueco o un ícono de imagen rota.
 */
export function FotoProducto({ producto, className = '', prioridad = false }) {
  const [fallo, setFallo] = useState(false);

  if (!producto.imagen_url || fallo) {
    return <Pictograma categoria={producto.categoria} className={`${className} foto--dibujo`} />;
  }

  return (
    <img
      className={`${className} foto`}
      src={producto.imagen_url}
      alt={producto.nombre}
      width={800}
      height={500}
      loading={prioridad ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFallo(true)}
    />
  );
}

export const tieneFoto = (producto) => Boolean(producto.imagen_url);
