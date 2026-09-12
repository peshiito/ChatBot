import { useEffect, useRef } from 'react';
import { useTienda } from '../../context/TiendaContext';
import { IconoCerrar } from '../ui/Iconos';
import { SECCIONES, CONTACTO, ACTUALIZADO } from '../../contenido/legales';
import './legal.css';

function Contacto() {
  return (
    <a className="legal__contacto" href={`mailto:${CONTACTO}`}>
      {CONTACTO}
    </a>
  );
}

function Bloque({ bloque }) {
  return (
    <>
      {bloque.titulo && <h3 className="legal__subtitulo">{bloque.titulo}</h3>}
      {bloque.texto && (
        <p className="legal__parrafo">
          {bloque.texto}
          {bloque.contacto && <Contacto />}
          {bloque.contacto && '.'}
        </p>
      )}
      {bloque.lista && (
        <ul className="legal__lista">
          {bloque.lista.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </>
  );
}

/**
 * Los textos legales, sobre el mismo <dialog> nativo que la ficha de producto.
 * Se abre en la pestaña que pidió el enlace del pie.
 */
export function Legales() {
  const { legalAbierto, abrirLegal, cerrarLegal } = useTienda();
  const dialogo = useRef(null);
  const tabs = useRef(null);
  const activa = SECCIONES.find((s) => s.id === legalAbierto) ?? SECCIONES[0];

  useEffect(() => {
    const d = dialogo.current;
    if (legalAbierto && !d.open) d.showModal();
    if (!legalAbierto && d.open) d.close();
  }, [legalAbierto]);

  // Al abrir (y al cambiar de sección) el foco queda en la pestaña activa:
  // desde ahí se navega con las flechas y se lee el panel con el lector de pantalla.
  useEffect(() => {
    if (!legalAbierto) return;
    tabs.current?.querySelector('[aria-selected="true"]')?.focus({ preventScroll: true });
  }, [legalAbierto, activa.id]);

  const alClickearFondo = (e) => {
    if (e.target === dialogo.current) cerrarLegal();
  };

  // Flechas para moverse entre pestañas, como espera un lector de pantalla.
  const alTeclear = (e) => {
    const paso = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!paso) return;
    e.preventDefault();
    const i = SECCIONES.indexOf(activa);
    abrirLegal(SECCIONES[(i + paso + SECCIONES.length) % SECCIONES.length].id);
  };

  return (
    <dialog
      ref={dialogo}
      className="legal"
      aria-labelledby="legal-titulo"
      onClose={cerrarLegal}
      onClick={alClickearFondo}
    >
      <div className="legal__hoja">
        <div className="legal__barra">
          <h2 id="legal-titulo" className="legal__titulo">
            {activa.titulo}
          </h2>
          <button type="button" className="boton boton--icono" onClick={cerrarLegal} aria-label="Cerrar">
            <IconoCerrar />
          </button>
        </div>

        <div ref={tabs} className="legal__tabs" role="tablist" aria-label="Información legal" onKeyDown={alTeclear}>
          {SECCIONES.map((seccion) => (
            <button
              key={seccion.id}
              type="button"
              role="tab"
              id={`tab-${seccion.id}`}
              aria-selected={seccion.id === activa.id}
              aria-controls={`panel-${seccion.id}`}
              tabIndex={seccion.id === activa.id ? 0 : -1}
              className="legal__tab"
              onClick={() => abrirLegal(seccion.id)}
            >
              {seccion.tab}
            </button>
          ))}
        </div>

        <div
          className="legal__panel"
          role="tabpanel"
          id={`panel-${activa.id}`}
          aria-labelledby={`tab-${activa.id}`}
          tabIndex={0}
        >
          {activa.bloques.map((bloque, i) => (
            <Bloque key={bloque.titulo ?? i} bloque={bloque} />
          ))}
          <p className="legal__fecha datos">
            Última actualización:{' '}
            <time dateTime={ACTUALIZADO}>
              {new Intl.DateTimeFormat('es-AR', { dateStyle: 'long' }).format(new Date(`${ACTUALIZADO}T12:00:00`))}
            </time>
          </p>
        </div>
      </div>
    </dialog>
  );
}
