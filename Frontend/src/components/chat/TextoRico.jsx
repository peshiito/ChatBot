/*
 * El modelo escribe con un markdown mínimo: **negrita**, listas con guiones
 * y alguna cita con ">". Se arma con elementos de React, nunca con HTML
 * crudo, así el texto del modelo no puede inyectar nada en la página.
 */

function enLinea(texto, clave) {
  return texto.split(/(\*\*[^*]+\*\*)/g).map((parte, i) =>
    parte.length > 4 && parte.startsWith('**') && parte.endsWith('**') ? (
      <strong key={`${clave}-${i}`}>{parte.slice(2, -2)}</strong>
    ) : (
      parte
    ),
  );
}

function tipoDeLinea(linea) {
  if (/^[-*•]\s+/.test(linea)) return 'lista';
  if (/^>\s?/.test(linea)) return 'nota';
  return 'parrafo';
}

// Cada tipo saca solo su propio prefijo: "**Criterio:**" no es una viñeta.
const PREFIJOS = { lista: /^[-*•]\s+/, nota: /^>\s?/, parrafo: /^#{1,6}\s+/ };

function limpiar(linea, tipo) {
  return linea.replace(PREFIJOS[tipo], '');
}

/** Agrupa líneas consecutivas del mismo tipo: varios "- " forman una sola lista. */
function enBloques(texto) {
  const bloques = [];
  for (const cruda of texto.split('\n')) {
    const linea = cruda.trim();
    if (!linea) {
      bloques.push(null);
      continue;
    }
    const tipo = tipoDeLinea(linea);
    const anterior = bloques.at(-1);
    if (anterior && anterior.tipo === tipo && tipo !== 'parrafo') {
      anterior.lineas.push(limpiar(linea, tipo));
    } else {
      bloques.push({ tipo, lineas: [limpiar(linea, tipo)] });
    }
  }
  return bloques.filter(Boolean);
}

export function TextoRico({ texto }) {
  return (
    <div className="texto-rico">
      {enBloques(texto).map((bloque, i) => {
        if (bloque.tipo === 'lista') {
          return (
            <ul key={i}>
              {bloque.lineas.map((l, j) => (
                <li key={j}>{enLinea(l, `${i}-${j}`)}</li>
              ))}
            </ul>
          );
        }
        if (bloque.tipo === 'nota') {
          return (
            <p key={i} className="texto-rico__nota">
              {enLinea(bloque.lineas.join(' '), i)}
            </p>
          );
        }
        return <p key={i}>{enLinea(bloque.lineas[0], i)}</p>;
      })}
    </div>
  );
}
