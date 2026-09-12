import { useTienda } from '../../context/TiendaContext';
import { TarjetaProducto, TarjetaEsqueleto } from './TarjetaProducto';
import './catalogo.css';

const ESQUELETOS = Array.from({ length: 8 }, (_, i) => i);

function FiltroCategorias({ categorias, conteo, actual, alCambiar }) {
  const opciones = [{ slug: 'todas', etiqueta: 'Todo' }, ...categorias];

  return (
    <div className="filtros" role="group" aria-label="Filtrar por categoría">
      {opciones.map((c) => (
        <button
          key={c.slug}
          type="button"
          className="filtro"
          aria-pressed={actual === c.slug}
          onClick={() => alCambiar(c.slug)}
        >
          {c.etiqueta}
          <span className="filtro__cantidad datos">{conteo[c.slug] ?? 0}</span>
        </button>
      ))}
    </div>
  );
}

export function Catalogo() {
  const { catalogo, abrirDetalle } = useTienda();
  const { productos, categorias, conteo, categoria, setCategoria, estado, error, recargar } = catalogo;

  return (
    <section id="catalogo" className="catalogo" aria-labelledby="catalogo-titulo">
      <div className="catalogo__cabecera">
        <h2 id="catalogo-titulo" className="catalogo__titulo">Catálogo</h2>
        {estado === 'listo' && (
          <p className="catalogo__total datos" aria-live="polite">
            {productos.length} {productos.length === 1 ? 'producto' : 'productos'}
          </p>
        )}
      </div>

      {estado === 'listo' && (
        <FiltroCategorias categorias={categorias} conteo={conteo} actual={categoria} alCambiar={setCategoria} />
      )}

      {estado === 'error' && (
        <div className="catalogo__aviso" role="alert">
          <p>
            <strong>No se pudo cargar el catálogo.</strong> {error}
          </p>
          <button type="button" className="boton boton--accion" onClick={recargar}>
            Volver a cargar
          </button>
        </div>
      )}

      {/* La key remonta la grilla al filtrar: dispara un fundido corto en vez de un salto. */}
      <div key={categoria} className="grilla" aria-busy={estado === 'cargando'}>
        {estado === 'cargando' && ESQUELETOS.map((i) => <TarjetaEsqueleto key={i} />)}
        {estado === 'listo' &&
          productos.map((p) => <TarjetaProducto key={p.id} producto={p} alAbrir={abrirDetalle} />)}
      </div>

      {estado === 'listo' && productos.length === 0 && (
        <div className="catalogo__aviso">
          <p>No hay productos en esta categoría.</p>
          <button type="button" className="boton" onClick={() => setCategoria('todas')}>
            Ver todo el catálogo
          </button>
        </div>
      )}
    </section>
  );
}
