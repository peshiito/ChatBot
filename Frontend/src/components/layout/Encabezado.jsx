import { useTienda } from '../../context/TiendaContext';
import { IconoChat } from '../ui/Iconos';
import './layout.css';

const ENLACES_LEGALES = [
  ['demo', 'Sobre el demo'],
  ['privacidad', 'Privacidad'],
  ['ia', 'Cómo funciona la IA'],
];

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
  const { abrirLegal } = useTienda();

  return (
    <footer className="pie">
      <p>
        <strong>HardStore</strong> es una tienda de ejemplo para mostrar el asesor. Los productos y
        sus specs son reales; los precios son de referencia, en pesos, y no son una oferta comercial.
        Fotos de los fabricantes y de Wikimedia Commons (el crédito está en cada ficha).
      </p>
      <nav className="pie__enlaces" aria-label="Información legal">
        {ENLACES_LEGALES.map(([id, texto]) => (
          <button key={id} type="button" className="pie__enlace" onClick={() => abrirLegal(id)}>
            {texto}
          </button>
        ))}
      </nav>
    </footer>
  );
}
