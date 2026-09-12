/*
 * Las fotos de producto son las oficiales de cada fabricante, salvo estas,
 * que vienen de Wikimedia Commons y piden atribución por su licencia.
 */
const CREDITOS_WIKIMEDIA = {
  'noctua-nh-d15': {
    autor: 'Kaleb Kloppe',
    licencia: 'CC BY 2.0',
    url: 'https://commons.wikimedia.org/wiki/File:NH-D15_with_classic_fans.jpg',
  },
  'ryzen-7-5700x': {
    autor: 'Qurren',
    licencia: 'CC BY-SA 4.0',
    url: 'https://commons.wikimedia.org/wiki/File:AMD_Ryzen_7_5700X_1.jpg',
  },
  'i5-13600k': {
    autor: '4300streetcar',
    licencia: 'CC BY 4.0',
    url: 'https://commons.wikimedia.org/wiki/File:Intel_Core_i5_13600K.jpg',
  },
  'i5-12400f': {
    autor: 'Fritzchens Fritz',
    licencia: 'CC0',
    url: 'https://commons.wikimedia.org/wiki/File:Intel@intel7(10nmESF)@AlderLake@ADL-S(6P%2B0E)@i5-12400F@SRL5Z_DSCx01@VIS_(52402436460).jpg',
  },
};

const slugDe = (imagenUrl) => imagenUrl?.split('/').pop()?.replace(/\.\w+$/, '');

/** Crédito de la foto de un producto, o null si no tiene foto. */
export function creditoDe(producto) {
  if (!producto.imagen_url) return null;
  return CREDITOS_WIKIMEDIA[slugDe(producto.imagen_url)] ?? { autor: producto.marca, licencia: null, url: null };
}
