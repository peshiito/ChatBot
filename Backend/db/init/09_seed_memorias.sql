-- Memorias RAM.
-- specs: tipo, capacidad_gb, modulos, capacidad_modulo_gb, velocidad_mhz,
--        latencia_cl, altura_mm, rgb, perfil (XMP/EXPO).

INSERT INTO productos (nombre, categoria, marca, precio, stock, descripcion, imagen_url, specs) VALUES

('Corsair Vengeance LPX 16GB (2x8) DDR4 3200', 'memoria_ram', 'Corsair', 52900.00, 20,
 'Perfil bajo de 34 mm: no choca con disipadores grandes. La opción segura para cualquier equipo AM4 o LGA1200.',
 '/img/productos/vengeance-lpx-16.webp',
 '{"tipo":"DDR4","capacidad_gb":16,"modulos":2,"capacidad_modulo_gb":8,"velocidad_mhz":3200,"latencia_cl":16,"altura_mm":34,"rgb":false,"perfil":"XMP 2.0"}'),

('Kingston FURY Beast 16GB (2x8) DDR4 3200', 'memoria_ram', 'Kingston', 54900.00, 17,
 'Disipador bajo de 34,9 mm y compatibilidad amplia. Alternativa directa al Vengeance LPX.',
 '/img/productos/fury-beast-ddr4-16.webp',
 '{"tipo":"DDR4","capacidad_gb":16,"modulos":2,"capacidad_modulo_gb":8,"velocidad_mhz":3200,"latencia_cl":16,"altura_mm":35,"rgb":false,"perfil":"XMP 2.0"}'),

('Corsair Vengeance RGB Pro 32GB (2x16) DDR4 3600', 'memoria_ram', 'Corsair', 111000.00, 8,
 'Iluminación RGB direccionable. Atención: mide 51 mm de alto, puede chocar con disipadores por aire de doble torre.',
 '/img/productos/vengeance-rgb-pro-32.webp',
 '{"tipo":"DDR4","capacidad_gb":32,"modulos":2,"capacidad_modulo_gb":16,"velocidad_mhz":3600,"latencia_cl":18,"altura_mm":51,"rgb":true,"perfil":"XMP 2.0"}'),

('Kingston FURY Beast 32GB (2x16) DDR5 5600', 'memoria_ram', 'Kingston', 124000.00, 10,
 'DDR5 para plataformas AM5 y LGA1700. Perfil bajo de 34,9 mm, sin problemas de espacio con coolers grandes.',
 '/img/productos/fury-beast-ddr5-32.webp',
 '{"tipo":"DDR5","capacidad_gb":32,"modulos":2,"capacidad_modulo_gb":16,"velocidad_mhz":5600,"latencia_cl":40,"altura_mm":35,"rgb":false,"perfil":"XMP 3.0 / EXPO"}'),

('Crucial Pro 32GB (2x16) DDR5 5600', 'memoria_ram', 'Crucial', 117500.00, 12,
 'Kit DDR5 sin disipador alto (31 mm). Opción económica y confiable, chips Micron.',
 '/img/productos/crucial-pro-ddr5-32.webp',
 '{"tipo":"DDR5","capacidad_gb":32,"modulos":2,"capacidad_modulo_gb":16,"velocidad_mhz":5600,"latencia_cl":46,"altura_mm":31,"rgb":false,"perfil":"XMP 3.0"}'),

('G.SKILL Trident Z5 RGB 32GB (2x16) DDR5 6000 CL30', 'memoria_ram', 'G.SKILL', 157000.00, 6,
 'Kit rápido de baja latencia, el combo típico para Ryzen 7000. Iluminación RGB y 42 mm de alto.',
 '/img/productos/trident-z5-rgb-32.webp',
 '{"tipo":"DDR5","capacidad_gb":32,"modulos":2,"capacidad_modulo_gb":16,"velocidad_mhz":6000,"latencia_cl":30,"altura_mm":42,"rgb":true,"perfil":"XMP 3.0 / EXPO"}');
