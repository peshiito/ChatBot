import { useLayoutEffect, useRef } from 'react';
import { useTienda } from '../../context/TiendaContext';
import { IconoEnviar } from '../ui/Iconos';
import './compositor.css';

const MAXIMO = 500;
const AVISO_DESDE = 400;

/** Campo de texto que crece hasta 4 líneas. Enter envía; Shift+Enter baja de línea. */
export function Compositor({ ref }) {
  const { chat, borrador, setBorrador } = useTienda();
  const campo = useRef(null);

  const asignar = (el) => {
    campo.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) ref.current = el;
  };

  useLayoutEffect(() => {
    const el = campo.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 4 * 24 + 22)}px`;
  }, [borrador]);

  const vacio = borrador.trim().length === 0;

  const enviar = () => {
    if (vacio || chat.pensando) return;
    chat.enviar(borrador);
    setBorrador('');
  };

  const alTeclear = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      enviar();
    }
  };

  return (
    <form
      className="compositor"
      onSubmit={(e) => {
        e.preventDefault();
        enviar();
      }}
    >
      <label htmlFor="chat-campo" className="solo-lectores">
        Tu pregunta para el asesor
      </label>
      <textarea
        id="chat-campo"
        name="pregunta"
        autoComplete="off"
        ref={asignar}
        className="compositor__campo"
        rows={1}
        maxLength={MAXIMO}
        placeholder="Escribí tu pregunta…"
        value={borrador}
        onChange={(e) => setBorrador(e.target.value)}
        onKeyDown={alTeclear}
      />
      {borrador.length >= AVISO_DESDE && (
        <span className="compositor__contador datos" aria-live="polite">
          {borrador.length}/{MAXIMO}
        </span>
      )}
      <button
        type="submit"
        className="boton boton--accion boton--icono compositor__enviar"
        disabled={vacio || chat.pensando}
        aria-label="Enviar pregunta"
      >
        <IconoEnviar />
      </button>
    </form>
  );
}
