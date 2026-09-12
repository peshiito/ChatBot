import { useEffect, useRef } from 'react';
import { useTienda } from '../../context/TiendaContext';
import { FotoProducto, tieneFoto } from '../ui/FotoProducto';
import { creditoDe } from '../../utils/creditosImagenes';
import { IconoCerrar, IconoChat } from '../ui/Iconos';
import { formatearPrecio, estadoStock } from '../../utils/formato';
import { filasSpecs } from '../../utils/specs';
import './detalle.css';
import './detalle-responsive.css';
import './specs.css';

function CreditoFoto({ producto }) {
  const credito = creditoDe(producto);
  if (!credito) return null;
  if (!credito.licencia) return <figcaption className="detalle__credito">Imagen: {credito.autor}</figcaption>;
  return (
    <figcaption className="detalle__credito">
      Foto:{' '}
      <a href={credito.url} target="_blank" rel="noopener noreferrer">
        {credito.autor}
      </a>{' '}
      · {credito.licencia}
    </figcaption>
  );
}

/**
 * Ficha del producto sobre <dialog> nativo: foco atrapado, Escape y fondo
 * inerte vienen del navegador. En el celular se comporta como hoja inferior.
 */
export function DetalleProducto() {
  const { productoAbierto, cerrarDetalle, abrirChat, catalogo } = useTienda();
  const dialogo = useRef(null);
  const ultimo = useRef(null);
  if (productoAbierto) ultimo.current = productoAbierto;
  const producto = productoAbierto ?? ultimo.current;

  useEffect(() => {
    const d = dialogo.current;
    if (productoAbierto && !d.open) d.showModal();
    if (!productoAbierto && d.open) d.close();
  }, [productoAbierto]);

  const alClickearFondo = (e) => {
    if (e.target === dialogo.current) cerrarDetalle();
  };

  const preguntar = () => {
    cerrarDetalle();
    abrirChat({ pregunta: `¿El ${producto.nombre} me sirve? Mi equipo tiene ` });
  };

  const categoria = catalogo.categorias.find((c) => c.slug === producto?.categoria)?.etiqueta;
  const stock = producto ? estadoStock(producto.stock) : null;

  return (
    <dialog ref={dialogo} className="detalle" aria-labelledby="detalle-nombre" onClose={cerrarDetalle} onClick={alClickearFondo}>
      {producto && (
        <div className="detalle__hoja">
          <div className="detalle__barra">
            <p className="detalle__categoria datos">{categoria}</p>
            <button type="button" className="boton boton--icono" onClick={cerrarDetalle} aria-label="Cerrar ficha">
              <IconoCerrar />
            </button>
          </div>

          <figure className={`detalle__vitrina ${tieneFoto(producto) ? 'vitrina--foto' : ''}`}>
            <FotoProducto producto={producto} className="detalle__dibujo" prioridad />
            <CreditoFoto producto={producto} />
          </figure>

          <div className="detalle__info">
            <p className="detalle__marca datos">
              {producto.marca}
              {producto.sku && <span> · {producto.sku}</span>}
            </p>
            <h2 id="detalle-nombre" className="detalle__nombre" translate="no">
              {producto.nombre}
            </h2>

            <div className="detalle__compra">
              <p className="detalle__precio">{formatearPrecio(producto.precio)}</p>
              <p className={`stock stock--${stock.tono}`}>{stock.texto}</p>
            </div>

            {producto.descripcion && <p className="detalle__descripcion">{producto.descripcion}</p>}

            <button type="button" className="boton boton--accion boton--grande detalle__preguntar" onClick={preguntar}>
              <IconoChat />
              Preguntar por este producto
            </button>

            <h3 className="detalle__subtitulo datos">Especificaciones</h3>
            <dl className="specs">
              {filasSpecs(producto.specs, producto.categoria).map((f) => (
                <div key={f.clave} className="specs__fila">
                  <dt>{f.etiqueta}</dt>
                  <dd className="datos">{f.valor}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}
    </dialog>
  );
}
