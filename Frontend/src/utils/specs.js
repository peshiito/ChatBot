/*
 * Traduce el JSON de specs a texto para personas: etiquetas en castellano
 * y unidades. Si aparece una clave nueva en la base, se muestra igual.
 */

const unidad = (u) => (v) => `${v} ${u}`;
const siNo = (v) => (v ? 'Sí' : 'No');
const PALABRAS = { aire: 'Aire', liquida: 'Líquida', no: 'No', total: 'Total', semi: 'Semi' };
const palabra = (v) => PALABRAS[v] ?? v;

const ETIQUETAS = {
  tipo: ['Tipo', palabra],
  sockets: ['Sockets', (v) => v.join(' · ')],
  tdp_max_w: ['TDP que soporta', unidad('W')],
  altura_mm: ['Altura', unidad('mm')],
  radiador_mm: ['Radiador', unidad('mm')],
  ventiladores: ['Ventiladores', String],
  ventilador_mm: ['Tamaño de ventilador', unidad('mm')],
  rgb: ['Iluminación RGB', siNo],
  ruido_db: ['Ruido', unidad('dB')],
  socket: ['Socket', String],
  nucleos: ['Núcleos', String],
  hilos: ['Hilos', String],
  frecuencia_base_ghz: ['Frecuencia base', unidad('GHz')],
  frecuencia_turbo_ghz: ['Frecuencia turbo', unidad('GHz')],
  tdp_w: ['Consumo (TDP)', unidad('W')],
  graficos_integrados: ['Gráficos integrados', (v) => v ?? 'No'],
  cooler_incluido: ['Trae cooler', siNo],
  chipset: ['Chip', String],
  vram_gb: ['Memoria de video', unidad('GB')],
  tipo_memoria: ['Tipo de memoria', String],
  consumo_w: ['Consumo', unidad('W')],
  fuente_recomendada_w: ['Fuente recomendada', unidad('W')],
  conectores_alimentacion: ['Alimentación', String],
  largo_mm: ['Largo', unidad('mm')],
  interfaz: ['Interfaz', String],
  capacidad_gb: ['Capacidad total', unidad('GB')],
  modulos: ['Módulos', String],
  capacidad_modulo_gb: ['Por módulo', unidad('GB')],
  velocidad_mhz: ['Velocidad', unidad('MHz')],
  latencia_cl: ['Latencia', (v) => `CL${v}`],
  perfil: ['Perfil', String],
  potencia_w: ['Potencia', unidad('W')],
  certificacion: ['Certificación', String],
  modular: ['Cables modulares', palabra],
  formato: ['Formato', String],
  conectores_pcie: ['Conectores PCIe', String],
  atx_3: ['ATX 3.0', siNo],
};

// MySQL reordena las claves del JSON; el orden de lectura lo define ETIQUETAS,
// salvo en categorías donde lo importante es otra cosa.
const ORDEN_GENERAL = Object.keys(ETIQUETAS);
const ORDEN_POR_CATEGORIA = {
  memoria_ram: ['tipo', 'capacidad_gb', 'velocidad_mhz', 'latencia_cl', 'modulos', 'capacidad_modulo_gb', 'altura_mm', 'rgb', 'perfil'],
};

/** Filas para la tabla del detalle, de lo más importante a lo accesorio. */
export function filasSpecs(specs, categoria) {
  const orden = ORDEN_POR_CATEGORIA[categoria] ?? ORDEN_GENERAL;
  const posicion = (clave) => (orden.includes(clave) ? orden.indexOf(clave) : orden.length);
  return Object.entries(specs)
    .filter(([, valor]) => valor !== undefined)
    .sort(([a], [b]) => posicion(a) - posicion(b))
    .map(([clave, valor]) => {
      const [etiqueta, formatear] = ETIQUETAS[clave] ?? [clave.replaceAll('_', ' '), String];
      return { clave, etiqueta, valor: formatear(valor) };
    });
}

const RESUMEN = {
  cooler: (s) => [
    s.tipo === 'liquida' ? `Líquida ${s.radiador_mm} mm` : `Aire · ${s.altura_mm} mm`,
    `${s.tdp_max_w} W`,
  ],
  procesador: (s) => [s.socket, `${s.nucleos}N / ${s.hilos}H`, `${s.tdp_w} W`],
  placa_video: (s) => [`${s.vram_gb} GB`, `${s.consumo_w} W`, `${s.largo_mm} mm`],
  memoria_ram: (s) => [s.tipo, `${s.capacidad_gb} GB`, `${s.velocidad_mhz} MHz`],
  fuente: (s) => [`${s.potencia_w} W`, String(s.certificacion).replace('80 PLUS ', '80+ ')],
};

/** Dos o tres datos clave para las tarjetas: lo que alguien mira primero. */
export function resumenSpecs(producto) {
  const armar = RESUMEN[producto.categoria];
  return armar ? armar(producto.specs).filter(Boolean) : [];
}
