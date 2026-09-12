/*
 * Dibujos de línea de cada tipo de componente. Reemplazan fotos de producto:
 * se leen igual de rápido y no dependen de imágenes de terceros.
 * Cada uno tiene un solo detalle amarillo, como el sticker de control de calidad.
 */
const trazo = { fill: 'none', stroke: 'var(--tinta)', strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round' };
const sticker = { fill: 'var(--etiqueta)', stroke: 'var(--tinta)', strokeWidth: 2.5 };

function Ventilador({ cx, cy, r }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} {...trazo} />
      {[0, 90, 180, 270].map((a) => (
        <path
          key={a}
          d={`M${cx} ${cy} C ${cx} ${cy - r * 0.62}, ${cx + r * 0.52} ${cy - r * 0.8}, ${cx + r * 0.7} ${cy - r * 0.42} C ${cx + r * 0.42} ${cy - r * 0.3}, ${cx + r * 0.22} ${cy - r * 0.14}, ${cx} ${cy}`}
          transform={`rotate(${a} ${cx} ${cy})`}
          {...trazo}
          strokeWidth={2.5}
        />
      ))}
    </g>
  );
}

const DIBUJOS = {
  cooler: (
    <>
      <rect x="22" y="4" width="56" height="56" rx="7" {...trazo} />
      <Ventilador cx={50} cy={32} r={21} />
      <circle cx="50" cy="32" r="5" {...sticker} />
    </>
  ),
  procesador: (
    <>
      {[30, 40, 50, 60, 70].map((x) => (
        <path key={`p${x}`} d={`M${x} 4v6M${x} 54v6`} {...trazo} strokeWidth={2.5} />
      ))}
      {[16, 26, 36, 46].map((y) => (
        <path key={`l${y}`} d={`M16 ${y + 2}h6M78 ${y + 2}h6`} {...trazo} strokeWidth={2.5} />
      ))}
      <rect x="22" y="10" width="56" height="44" rx="5" {...trazo} />
      <rect x="35" y="20" width="30" height="24" rx="3" fill="var(--tinta)" />
      <path d="M26 50l6-6v6z" {...sticker} strokeWidth={1.5} />
    </>
  ),
  placa_video: (
    <>
      <path d="M6 8v46" {...trazo} />
      <rect x="10" y="10" width="84" height="36" rx="5" {...trazo} />
      <Ventilador cx={34} cy={28} r={13} />
      <Ventilador cx={70} cy={28} r={13} />
      <path d="M30 46v8h40v-8M38 50h24" {...trazo} strokeWidth={2.5} />
      <rect x="78" y="38" width="12" height="5" rx="1" {...sticker} strokeWidth={1.5} />
    </>
  ),
  memoria_ram: (
    <>
      <rect x="4" y="14" width="92" height="28" rx="3" {...trazo} />
      {[11, 30, 49, 68].map((x) => (
        <rect key={x} x={x} y="20" width="14" height="12" rx="1.5" fill="var(--tinta)" />
      ))}
      <path d="M10 42v8M18 42v8M26 42v8M34 42v8M42 42v8M58 42v8M66 42v8M74 42v8M82 42v8M90 42v8" {...trazo} strokeWidth={2} />
      <rect x="84" y="20" width="7" height="12" rx="1" {...sticker} strokeWidth={1.5} />
    </>
  ),
  fuente: (
    <>
      <rect x="14" y="6" width="72" height="52" rx="5" {...trazo} />
      <circle cx="42" cy="32" r="18" {...trazo} />
      <circle cx="42" cy="32" r="11" {...trazo} strokeWidth={2.5} />
      <path d="M24 32h36M42 14v36" {...trazo} strokeWidth={2} />
      <rect x="68" y="14" width="10" height="12" rx="2" {...sticker} />
      <rect x="67" y="36" width="12" height="14" rx="2" {...trazo} strokeWidth={2.5} />
    </>
  ),
};

export function Pictograma({ categoria, className }) {
  return (
    <svg viewBox="0 0 100 64" className={className} aria-hidden="true" focusable="false">
      {DIBUJOS[categoria] ?? DIBUJOS.procesador}
    </svg>
  );
}
