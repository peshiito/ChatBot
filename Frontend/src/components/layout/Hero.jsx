import { useState } from 'react';
import { useTienda } from '../../context/TiendaContext';
import { VidrioTemplado } from '../ui/VidrioTemplado';
import { IconoEnviar } from '../ui/Iconos';
import { PREGUNTA_REFERENCIA, OTRAS_PREGUNTAS } from '../chat/preguntas';
import './hero.css';

/**
 * El hero es el demo: la pregunta ya está escrita, un toque y el asesor responde.
 * El panel usa el mismo vidrio templado que el chat, así se lee como la misma pieza.
 */
export function Hero() {
  const { abrirChat } = useTienda();
  const [pregunta, setPregunta] = useState(PREGUNTA_REFERENCIA);

  const preguntar = (texto) => abrirChat({ pregunta: texto, enviar: true });

  const alEnviar = (e) => {
    e.preventDefault();
    if (pregunta.trim()) preguntar(pregunta);
  };

  return (
    <section className="hero" aria-labelledby="hero-titulo">
      <div className="hero__texto">
        <p className="hero__ojo datos">Asesor con IA · consulta el stock real</p>
        <h1 id="hero-titulo" className="hero__titulo">
          Preguntá como en el <span className="hero__resaltado">mostrador.</span>
        </h1>
        <p className="hero__bajada">
          Contale qué equipo tenés y qué querés hacer. Te explica qué te sirve y por qué, y te muestra
          lo que hay en la tienda.
        </p>
      </div>

      <div className="hero__escena">
        <VidrioTemplado as="form" className="hero__panel" tira onSubmit={alEnviar}>
          <label htmlFor="hero-pregunta" className="hero__etiqueta datos">
            Probá con esta pregunta
          </label>
          <textarea
            id="hero-pregunta"
            name="pregunta"
            autoComplete="off"
            required
            className="hero__campo"
            rows={3}
            maxLength={500}
            value={pregunta}
            onChange={(e) => setPregunta(e.target.value)}
          />
          <button type="submit" className="boton boton--accion boton--grande hero__enviar">
            Preguntar al asesor
            <IconoEnviar />
          </button>
          <div className="hero__otras">
            <p className="hero__etiqueta datos">O alguna de estas</p>
            <ul className="chips">
              {OTRAS_PREGUNTAS.map((texto) => (
                <li key={texto}>
                  <button type="button" className="chip" onClick={() => preguntar(texto)}>
                    {texto}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </VidrioTemplado>
      </div>
    </section>
  );
}
