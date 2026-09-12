-- Fuentes de alimentacion.
-- specs: potencia_w, certificacion, modular, formato, ventilador_mm,
--        conectores_pcie, atx_3.

INSERT INTO productos (nombre, categoria, marca, precio, stock, descripcion, imagen_url, specs) VALUES

('Thermaltake Smart 500W 80 PLUS White', 'fuente', 'Thermaltake', 58500.00, 14,
 'Fuente de entrada certificada 80 PLUS White. Alcanza para equipos con placa de video de bajo consumo tipo RX 6600.',
 '/img/productos/thermaltake-smart-500.webp',
 '{"potencia_w":500,"certificacion":"80 PLUS White","modular":"no","formato":"ATX","ventilador_mm":120,"conectores_pcie":1,"atx_3":false}'),

('Cooler Master MWE Bronze 550 V2', 'fuente', 'Cooler Master', 71900.00, 13,
 'Certificación 80 PLUS Bronze y protección completa OVP/OCP/OPP. Buen piso de calidad para un equipo de gama media.',
 '/img/productos/mwe-bronze-550-v2.webp',
 '{"potencia_w":550,"certificacion":"80 PLUS Bronze","modular":"no","formato":"ATX","ventilador_mm":120,"conectores_pcie":2,"atx_3":false}'),

('Corsair CX650 80 PLUS Bronze', 'fuente', 'Corsair', 91500.00, 11,
 'Seiscientos cincuenta watts con certificación Bronze. Margen de sobra para una RTX 4060 o una RX 7600.',
 '/img/productos/corsair-cx650.webp',
 '{"potencia_w":650,"certificacion":"80 PLUS Bronze","modular":"no","formato":"ATX","ventilador_mm":120,"conectores_pcie":2,"atx_3":false}'),

('Corsair RM750e 80 PLUS Gold', 'fuente', 'Corsair', 143000.00, 8,
 'Totalmente modular y certificada Gold. Cumple ATX 3.0 e incluye cable 12VHPWR para las placas nuevas de NVIDIA.',
 '/img/productos/corsair-rm750e.webp',
 '{"potencia_w":750,"certificacion":"80 PLUS Gold","modular":"total","formato":"ATX","ventilador_mm":120,"conectores_pcie":4,"atx_3":true}'),

('be quiet! Pure Power 12 M 850W 80 PLUS Gold', 'fuente', 'be quiet!', 183000.00, 5,
 'Modular, silenciosa y compatible con ATX 3.0. Pensada para equipos con placas de video de 250 W o más.',
 '/img/productos/pure-power-12m-850.webp',
 '{"potencia_w":850,"certificacion":"80 PLUS Gold","modular":"total","formato":"ATX","ventilador_mm":120,"conectores_pcie":4,"atx_3":true}'),

('Seasonic FOCUS GX-850 80 PLUS Gold', 'fuente', 'Seasonic', 196000.00, 4,
 'Fuente de referencia por confiabilidad, con 10 años de garantía y modo semi-fanless. Totalmente modular.',
 '/img/productos/seasonic-focus-gx-850.webp',
 '{"potencia_w":850,"certificacion":"80 PLUS Gold","modular":"total","formato":"ATX","ventilador_mm":120,"conectores_pcie":4,"atx_3":false}');
