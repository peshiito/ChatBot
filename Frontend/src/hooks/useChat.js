import { useCallback, useRef, useState } from 'react';
import { enviarMensaje } from '../api/cliente';

// crypto.randomUUID no existe fuera de HTTPS (ej: probando desde el celular por IP).
let contador = 0;
const nuevoId = () => `m${++contador}`;

/** Lo único que viaja al backend: pares pregunta/respuesta, sin los errores. */
function aHistorial(mensajes) {
  return mensajes
    .filter((m) => m.rol === 'user' || m.rol === 'assistant')
    .map(({ rol, contenido }) => ({ rol, contenido }));
}

export function useChat() {
  const [mensajes, setMensajes] = useState([]);
  const [pensando, setPensando] = useState(false);
  const sesionRef = useRef(null);
  const ocupadoRef = useRef(false);

  const enviarDesde = useCallback(async (base, texto) => {
    const contenido = texto.trim();
    if (!contenido || ocupadoRef.current) return;
    ocupadoRef.current = true;

    const pregunta = { id: nuevoId(), rol: 'user', contenido };
    setMensajes([...base, pregunta]);
    setPensando(true);

    try {
      const r = await enviarMensaje({
        mensaje: contenido,
        historial: aHistorial(base),
        sesionId: sesionRef.current,
      });
      sesionRef.current = r.sesion_id;
      setMensajes((prev) => [
        ...prev,
        { id: nuevoId(), rol: 'assistant', contenido: r.mensaje, productos: r.productos ?? [] },
      ]);
    } catch (err) {
      setMensajes((prev) => [
        ...prev,
        { id: nuevoId(), rol: 'error', contenido: err.message, reintentarEn: err.reintentarEnSegundos, pregunta: contenido },
      ]);
    } finally {
      ocupadoRef.current = false;
      setPensando(false);
    }
  }, []);

  const enviar = useCallback(
    (texto) => enviarDesde(mensajes.filter((m) => m.rol !== 'error'), texto),
    [mensajes, enviarDesde],
  );

  /** Saca la pregunta que falló y su error, y la vuelve a mandar. */
  const reintentar = useCallback(
    (error) => {
      const indice = mensajes.findIndex((m) => m.id === error.id);
      if (indice < 1) return;
      enviarDesde(mensajes.slice(0, indice - 1), error.pregunta);
    },
    [mensajes, enviarDesde],
  );

  return { mensajes, pensando, enviar, reintentar };
}
