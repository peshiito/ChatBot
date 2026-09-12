-- Procesadores AMD e Intel.
-- specs: socket, nucleos, hilos, frecuencia_base_ghz, frecuencia_turbo_ghz,
--        tdp_w, graficos_integrados, cooler_incluido.

INSERT INTO productos (nombre, categoria, marca, precio, stock, descripcion, imagen_url, specs) VALUES

('AMD Ryzen 5 4600G', 'procesador', 'AMD', 124900.00, 12,
 'Seis núcleos con gráficos Radeon integrados. Permite armar un equipo completo sin placa de video y sumarla después. Consumo bajo: 65 W.',
 NULL,
 '{"socket":"AM4","nucleos":6,"hilos":12,"frecuencia_base_ghz":3.7,"frecuencia_turbo_ghz":4.2,"tdp_w":65,"graficos_integrados":"Radeon Graphics","cooler_incluido":true}'),

('AMD Ryzen 5 5600', 'procesador', 'AMD', 142900.00, 15,
 'Seis núcleos Zen 3 sin gráficos integrados. El punto dulce de precio/rendimiento en AM4 para gaming.',
 NULL,
 '{"socket":"AM4","nucleos":6,"hilos":12,"frecuencia_base_ghz":3.5,"frecuencia_turbo_ghz":4.4,"tdp_w":65,"graficos_integrados":null,"cooler_incluido":true}'),

('AMD Ryzen 5 5600X', 'procesador', 'AMD', 168000.00, 9,
 'Versión de mayor frecuencia del 5600. Mismo consumo de 65 W y cooler Wraith Stealth incluido.',
 '/img/productos/ryzen-5-5600x.webp',
 '{"socket":"AM4","nucleos":6,"hilos":12,"frecuencia_base_ghz":3.7,"frecuencia_turbo_ghz":4.6,"tdp_w":65,"graficos_integrados":null,"cooler_incluido":true}'),

('AMD Ryzen 7 5700X', 'procesador', 'AMD', 209000.00, 7,
 'Ocho núcleos a 65 W. Buena opción para edición de video y streaming manteniendo consumo contenido. No trae cooler.',
 '/img/productos/ryzen-7-5700x.webp',
 '{"socket":"AM4","nucleos":8,"hilos":16,"frecuencia_base_ghz":3.4,"frecuencia_turbo_ghz":4.6,"tdp_w":65,"graficos_integrados":null,"cooler_incluido":false}'),

('AMD Ryzen 7 5800X3D', 'procesador', 'AMD', 339000.00, 4,
 'Ocho núcleos con 96 MB de caché 3D V-Cache. El mejor procesador de gaming del socket AM4. Calienta bastante: pide buena refrigeración y no trae cooler.',
 '/img/productos/ryzen-7-5800x3d.webp',
 '{"socket":"AM4","nucleos":8,"hilos":16,"frecuencia_base_ghz":3.4,"frecuencia_turbo_ghz":4.5,"tdp_w":105,"graficos_integrados":null,"cooler_incluido":false}'),

('AMD Ryzen 5 7600X', 'procesador', 'AMD', 262000.00, 8,
 'Seis núcleos Zen 4 en socket AM5, con memoria DDR5 y gráficos Radeon básicos integrados. Sin cooler de fábrica.',
 '/img/productos/ryzen-5-7600x.webp',
 '{"socket":"AM5","nucleos":6,"hilos":12,"frecuencia_base_ghz":4.7,"frecuencia_turbo_ghz":5.3,"tdp_w":105,"graficos_integrados":"Radeon Graphics","cooler_incluido":false}'),

('AMD Ryzen 7 7800X3D', 'procesador', 'AMD', 459000.00, 3,
 'Ocho núcleos Zen 4 con 3D V-Cache. Referencia de rendimiento en juegos. Requiere placa AM5 y refrigeración sólida.',
 '/img/productos/ryzen-7-7800x3d.webp',
 '{"socket":"AM5","nucleos":8,"hilos":16,"frecuencia_base_ghz":4.2,"frecuencia_turbo_ghz":5.0,"tdp_w":120,"graficos_integrados":"Radeon Graphics","cooler_incluido":false}'),

('Intel Core i5-12400F', 'procesador', 'Intel', 143500.00, 11,
 'Seis núcleos de rendimiento sin gráficos integrados. Muy eficiente y económico para armar un equipo de juegos con placa de video dedicada.',
 '/img/productos/i5-12400f.webp',
 '{"socket":"LGA1700","nucleos":6,"hilos":12,"frecuencia_base_ghz":2.5,"frecuencia_turbo_ghz":4.4,"tdp_w":65,"graficos_integrados":null,"cooler_incluido":true}'),

('Intel Core i5-13600K', 'procesador', 'Intel', 325000.00, 6,
 'Catorce núcleos (6 de rendimiento + 8 de eficiencia) desbloqueado para overclock. Con carga completa supera los 125 W: no usar el cooler mínimo.',
 '/img/productos/i5-13600k.webp',
 '{"socket":"LGA1700","nucleos":14,"hilos":20,"frecuencia_base_ghz":3.5,"frecuencia_turbo_ghz":5.1,"tdp_w":125,"graficos_integrados":"Intel UHD 770","cooler_incluido":false}');
