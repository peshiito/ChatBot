import { useEffect, useState } from 'react';

/** true mientras el elemento que coincide con `selector` se ve al menos en parte. */
export function useEnPantalla(selector, umbral = 0.15) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = document.querySelector(selector);
    if (!el) return undefined;
    const observador = new IntersectionObserver(([entrada]) => setVisible(entrada.isIntersecting), {
      threshold: umbral,
    });
    observador.observe(el);
    return () => observador.disconnect();
  }, [selector, umbral]);

  return visible;
}
