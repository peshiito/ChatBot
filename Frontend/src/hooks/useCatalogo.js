import { useCallback, useEffect, useMemo, useState } from 'react';
import { obtenerCategorias, obtenerProductos } from '../api/cliente';

const leerCategoriaDeUrl = () => new URLSearchParams(window.location.search).get('categoria') ?? 'todas';

/** La categoría vive en la URL (?categoria=placa_video) para poder compartir el link. */
function escribirCategoriaEnUrl(slug) {
  const url = new URL(window.location.href);
  if (slug === 'todas') url.searchParams.delete('categoria');
  else url.searchParams.set('categoria', slug);
  window.history.replaceState(null, '', url);
}

/** Carga el catálogo una vez; el filtro por categoría es local (son pocos productos). */
export function useCatalogo() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [estado, setEstado] = useState('cargando');
  const [error, setError] = useState(null);
  const [categoria, setCategoriaEstado] = useState(leerCategoriaDeUrl);

  const setCategoria = useCallback((slug) => {
    setCategoriaEstado(slug);
    escribirCategoriaEnUrl(slug);
  }, []);

  const cargar = useCallback(async () => {
    setEstado('cargando');
    setError(null);
    try {
      const [listado, cats] = await Promise.all([obtenerProductos(), obtenerCategorias()]);
      setProductos(listado.productos);
      setCategorias(cats);
      setEstado('listo');
    } catch (err) {
      setError(err.message);
      setEstado('error');
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const visibles = useMemo(
    () => (categoria === 'todas' ? productos : productos.filter((p) => p.categoria === categoria)),
    [productos, categoria],
  );

  const conteo = useMemo(() => {
    const porCategoria = { todas: productos.length };
    for (const p of productos) porCategoria[p.categoria] = (porCategoria[p.categoria] ?? 0) + 1;
    return porCategoria;
  }, [productos]);

  return { productos: visibles, categorias, conteo, categoria, setCategoria, estado, error, recargar: cargar };
}
