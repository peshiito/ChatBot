import { useEffect, useRef } from 'react';
import { useTienda } from '../../context/TiendaContext';
import { Mensaje } from './Mensaje';
import { SUGERENCIAS } from './preguntas';
import './chat-mensajes.css';

const reducirMovimiento = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function Bienvenida({ alElegir }) {
  return (
    <div className="bienvenida">
      <p className="bienvenida__texto">
        Contame qué equipo tenés y qué querés hacer. Te digo qué te sirve, por qué, y qué hay en la tienda.
      </p>
      <p className="bienvenida__etiqueta datos">Para empezar</p>
      <ul className="chips chips--columna">
        {SUGERENCIAS.map((texto) => (
          <li key={texto}>
            <button type="button" className="chip" onClick={() => alElegir(texto)}>
              {texto}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ListaMensajes() {
  const { chat, abrirDetalle } = useTienda();
  const { mensajes, pensando, enviar, reintentar } = chat;
  const lista = useRef(null);

  // Una respuesta nueva se muestra desde su comienzo: se lee de arriba hacia abajo.
  // Para la pregunta propia y el "pensando", alcanza con bajar hasta el final.
  useEffect(() => {
    const el = lista.current;
    if (!el) return;
    const comportamiento = reducirMovimiento() ? 'auto' : 'smooth';
    const ultimo = el.querySelector('.mensaje:last-child');
    if (ultimo?.classList.contains('mensaje--asesor')) {
      el.scrollTo({ top: ultimo.offsetTop - el.offsetTop - 12, behavior: comportamiento });
    } else {
      el.scrollTo({ top: el.scrollHeight, behavior: comportamiento });
    }
  }, [mensajes.length, pensando]);

  return (
    <div ref={lista} className="mensajes" role="log" aria-live="polite" aria-relevant="additions" aria-busy={pensando}>
      {mensajes.length === 0 && <Bienvenida alElegir={enviar} />}

      {mensajes.map((m) => (
        <Mensaje key={m.id} mensaje={m} alAbrirProducto={abrirDetalle} alReintentar={reintentar} />
      ))}

      {pensando && (
        <p className="mensaje mensaje--pensando datos">
          <span className="solo-lectores">El asesor está buscando en el catálogo</span>
          <span className="puntos" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </p>
      )}
    </div>
  );
}
