import { useTienda } from '../../context/TiendaContext';
import { IconoChat } from '../ui/Iconos';
import './layout.css';

export function BandaDemo() {
  return (
    <p className="banda-demo">
      <span className="banda-demo__marca datos">Demo</span>
      Este asesor se suma a la web que ya tenés y responde con tu propio catálogo.
    </p>
  );
}

export function Encabezado() {
  const { abrirChat } = useTienda();

  return (
    <header className="encabezado">
      <a className="logo" href="#contenido" aria-label="HardStore, ir al inicio">
        <span className="logo__chip" aria-hidden="true" />
        <span className="logo__texto" translate="no">HardStore</span>
      </a>
      <nav className="encabezado__nav" aria-label="Principal">
        <a className="encabezado__link" href="#catalogo">Catálogo</a>
        <button type="button" className="boton" onClick={() => abrirChat()}>
          <IconoChat />
          <span>Asesor</span>
        </button>
      </nav>
    </header>
  );
}

export function Pie() {
  return (
    <footer className="pie">
      <p>
        <strong>HardStore</strong> es una tienda de ejemplo para mostrar el asesor. Los productos y
        sus specs son reales; los precios son de referencia, en pesos. Fotos de los fabricantes y de
        Wikimedia Commons (el crédito está en cada ficha).
      </p>
    </footer>
  );
}
