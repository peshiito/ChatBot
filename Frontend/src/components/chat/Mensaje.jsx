import { FotoProducto, tieneFoto } from '../ui/FotoProducto';
import { IconoReintentar } from '../ui/Iconos';
import { formatearPrecio, estadoStock } from '../../utils/formato';
import { resumenSpecs } from '../../utils/specs';
import { TextoRico } from './TextoRico';
import './chat-cajas.css';

/** Tarjeta de producto dentro de la respuesta: la caja que el asesor pone sobre el mostrador. */
function TarjetaChat({ producto, indice, alAbrir }) {
  const stock = estadoStock(producto.stock);
  return (
    <li className="caja" style={{ '--i': indice }}>
      <button type="button" className="caja__boton" onClick={() => alAbrir(producto)}>
        <span className={`caja__vitrina ${tieneFoto(producto) ? 'vitrina--foto' : ''}`}>
          <FotoProducto producto={producto} className="caja__dibujo" />
          <span className="caja__precio">{formatearPrecio(producto.precio)}</span>
        </span>
        <span className="caja__cuerpo">
          <span className="caja__nombre" translate="no">{producto.nombre}</span>
          <span className="caja__specs datos">
            {resumenSpecs(producto).map((s) => (
              <span key={s}>{s}</span>
            ))}
          </span>
          <span className={`stock stock--${stock.tono} caja__stock`}>{stock.texto}</span>
        </span>
      </button>
    </li>
  );
}

export function Mensaje({ mensaje, alAbrirProducto, alReintentar }) {
  if (mensaje.rol === 'user') {
    return <p className="mensaje mensaje--usuario">{mensaje.contenido}</p>;
  }

  if (mensaje.rol === 'error') {
    return (
      <div className="mensaje mensaje--error" role="alert">
        <p>{mensaje.contenido}</p>
        <button type="button" className="boton" onClick={() => alReintentar(mensaje)}>
          <IconoReintentar />
          Volver a preguntar
        </button>
      </div>
    );
  }

  const productos = mensaje.productos ?? [];
  return (
    <div className="mensaje mensaje--asesor">
      <TextoRico texto={mensaje.contenido} />
      {productos.length > 0 && (
        <ul className="cajas" aria-label={`${productos.length} productos recomendados`}>
          {productos.map((p, i) => (
            <TarjetaChat key={p.id} producto={p} indice={i} alAbrir={alAbrirProducto} />
          ))}
        </ul>
      )}
    </div>
  );
}
