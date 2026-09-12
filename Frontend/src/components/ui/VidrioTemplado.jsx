import './vidrio.css';

const ESQUINAS = ['arriba-izq', 'arriba-der', 'abajo-izq', 'abajo-der'];

/**
 * El panel de vidrio templado de un gabinete: vidrio esmerilado, marco grueso,
 * cuatro tornillos y, opcionalmente, la tira RGB del borde superior.
 * `encendida` hace correr la luz: es el indicador de que el asesor está buscando.
 */
export function VidrioTemplado({ as: Etiqueta = 'div', className = '', tira = false, encendida = false, children, ...resto }) {
  return (
    <Etiqueta className={`vidrio ${className}`} {...resto}>
      {tira && (
        <span className="vidrio__tira" data-encendida={encendida} aria-hidden="true">
          <span className="vidrio__luz" />
        </span>
      )}
      {ESQUINAS.map((esquina) => (
        <span key={esquina} className={`vidrio__tornillo vidrio__tornillo--${esquina}`} aria-hidden="true" />
      ))}
      {children}
    </Etiqueta>
  );
}
