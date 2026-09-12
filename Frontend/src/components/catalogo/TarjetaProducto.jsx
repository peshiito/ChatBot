import { FotoProducto, tieneFoto } from '../ui/FotoProducto';
import { formatearPrecio, estadoStock } from '../../utils/formato';
import { resumenSpecs } from '../../utils/specs';
import './tarjeta.css';

/**
 * Tarjeta del catálogo. Toda la tarjeta abre el detalle, pero el control real
 * es el botón del nombre (su ::after cubre la tarjeta): así el lector de
 * pantalla anuncia un solo botón con un nombre claro, no un bloque entero.
 */
export function TarjetaProducto({ producto, alAbrir }) {
  const stock = estadoStock(producto.stock);
  const specs = resumenSpecs(producto);

  return (
    <article className="tarjeta">
      <div className={`tarjeta__vitrina ${tieneFoto(producto) ? 'vitrina--foto' : ''}`}>
        <FotoProducto producto={producto} className="tarjeta__dibujo" />
        <p className="tarjeta__precio">{formatearPrecio(producto.precio)}</p>
      </div>

      <div className="tarjeta__cuerpo">
        <p className="tarjeta__marca datos">{producto.marca}</p>
        <h3 className="tarjeta__nombre" translate="no">
          <button type="button" className="tarjeta__abrir" onClick={() => alAbrir(producto)}>
            {producto.nombre}
          </button>
        </h3>
        {specs.length > 0 && (
          <ul className="tarjeta__specs datos" aria-label="Datos clave">
            {specs.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        )}
        <p className={`stock stock--${stock.tono}`}>{stock.texto}</p>
      </div>
    </article>
  );
}

export function TarjetaEsqueleto() {
  return (
    <div className="tarjeta tarjeta--esqueleto" aria-hidden="true">
      <div className="tarjeta__vitrina" />
      <div className="tarjeta__cuerpo">
        <span className="esqueleto esqueleto--corto" />
        <span className="esqueleto" />
        <span className="esqueleto esqueleto--medio" />
      </div>
    </div>
  );
}
