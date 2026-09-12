import { useEffect, useRef } from 'react';
import { useTienda } from '../../context/TiendaContext';
import { useEnPantalla } from '../../hooks/useEnPantalla';
import { VidrioTemplado } from '../ui/VidrioTemplado';
import { IconoChat, IconoCerrar } from '../ui/Iconos';
import { ListaMensajes } from './ListaMensajes';
import { Compositor } from './Compositor';
import './chat-lanzador.css';
import './chat-panel.css';

/**
 * El asesor: botón flotante + panel de vidrio templado. El panel queda montado
 * (inerte cuando está cerrado) para que abrir y cerrar sea una transición y
 * la conversación no se pierda.
 */
export function ChatWidget() {
  const { chat, chatAbierto, pedidoFoco, cerrarChat, abrirChat, abrirLegal } = useTienda();
  const lanzador = useRef(null);
  const campo = useRef(null);
  const titulo = useRef(null);
  const estabaAbierto = useRef(false);
  // Mientras se ve el panel del hero ya hay dónde preguntar: el botón flotante sobra.
  const heroEnPantalla = useEnPantalla('.hero__panel');
  const pensando = useRef(chat.pensando);
  pensando.current = chat.pensando;

  useEffect(() => {
    if (chatAbierto) {
      // Si ya se mandó una pregunta, el teclado del celular taparía la respuesta.
      const destino = pensando.current ? titulo.current : campo.current;
      destino?.focus({ preventScroll: true });
      // Si el borrador vino de la ficha de un producto, se sigue escribiendo al final.
      if (destino === campo.current) destino.setSelectionRange(destino.value.length, destino.value.length);
    } else if (estabaAbierto.current) {
      lanzador.current?.focus({ preventScroll: true });
    }
    estabaAbierto.current = chatAbierto;
  }, [chatAbierto, pedidoFoco]);

  const alTeclear = (e) => {
    if (e.key === 'Escape') cerrarChat();
  };

  return (
    <>
      <button
        ref={lanzador}
        type="button"
        className="lanzador boton boton--accion boton--grande"
        data-oculto={chatAbierto || heroEnPantalla}
        aria-expanded={chatAbierto}
        aria-controls="chat-panel"
        onClick={() => abrirChat()}
      >
        <IconoChat />
        <span className="lanzador__texto">Preguntale al asesor</span>
        <span className="lanzador__texto-corto">Asesor</span>
      </button>

      <VidrioTemplado
        id="chat-panel"
        className="chat"
        role="dialog"
        aria-modal="false"
        aria-labelledby="chat-titulo"
        data-abierto={chatAbierto}
        inert={!chatAbierto}
        tira
        encendida={chat.pensando}
        onKeyDown={alTeclear}
      >
        <header className="chat__cabecera">
          <div>
            <h2 id="chat-titulo" ref={titulo} tabIndex={-1} className="chat__titulo">
              Asesor HardStore
            </h2>
            <p className="chat__estado datos">
              <span className="chat__led" data-pensando={chat.pensando} aria-hidden="true" />
              {chat.pensando ? 'Buscando en el catálogo…' : 'Responde con el stock real'}
            </p>
          </div>
          <button type="button" className="boton boton--icono" onClick={cerrarChat} aria-label="Cerrar el asesor">
            <IconoCerrar />
          </button>
        </header>

        <ListaMensajes />
        <Compositor ref={campo} />
        <p className="chat__aviso">
          Respuestas generadas por IA: pueden tener errores, verificá antes de comprar.{' '}
          <button type="button" className="chat__aviso-enlace" onClick={() => abrirLegal('ia')}>
            Cómo funciona
          </button>
        </p>
      </VidrioTemplado>
    </>
  );
}
