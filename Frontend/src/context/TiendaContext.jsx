import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useCatalogo } from '../hooks/useCatalogo';
import { useChat } from '../hooks/useChat';

const TiendaContext = createContext(null);

/**
 * Estado compartido entre el catálogo y el asesor: desde una tarjeta se puede
 * abrir el chat, y desde una respuesta del chat se puede abrir un producto.
 */
export function TiendaProvider({ children }) {
  const catalogo = useCatalogo();
  const chat = useChat();
  const [productoAbierto, setProductoAbierto] = useState(null);
  const [chatAbierto, setChatAbierto] = useState(false);
  // Id de la sección legal abierta, o null.
  const [legalAbierto, setLegalAbierto] = useState(null);
  const [borrador, setBorrador] = useState('');
  // Cambia en cada apertura, aunque el chat ya estuviera abierto: dispara el foco.
  const [pedidoFoco, setPedidoFoco] = useState(0);

  const abrirChat = useCallback(
    ({ pregunta = '', enviar = false } = {}) => {
      setChatAbierto(true);
      setPedidoFoco((n) => n + 1);
      if (enviar && pregunta) {
        setBorrador('');
        chat.enviar(pregunta);
      } else if (pregunta) {
        setBorrador(pregunta);
      }
    },
    [chat],
  );

  const valor = useMemo(
    () => ({
      catalogo,
      chat,
      chatAbierto,
      pedidoFoco,
      abrirChat,
      cerrarChat: () => setChatAbierto(false),
      borrador,
      setBorrador,
      productoAbierto,
      abrirDetalle: setProductoAbierto,
      cerrarDetalle: () => setProductoAbierto(null),
      legalAbierto,
      abrirLegal: setLegalAbierto,
      cerrarLegal: () => setLegalAbierto(null),
    }),
    [catalogo, chat, chatAbierto, pedidoFoco, abrirChat, borrador, productoAbierto, legalAbierto],
  );

  return <TiendaContext.Provider value={valor}>{children}</TiendaContext.Provider>;
}

export function useTienda() {
  const valor = useContext(TiendaContext);
  if (!valor) throw new Error('useTienda tiene que usarse dentro de <TiendaProvider>.');
  return valor;
}
