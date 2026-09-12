-- Refrigeracion: 8 por aire + 5 liquidas (AIO).
-- specs: tipo, sockets[], tdp_max_w, altura_mm (aire), radiador_mm (liquida),
--        ventiladores, ventilador_mm, rgb, ruido_db.

INSERT INTO productos (nombre, categoria, marca, precio, stock, descripcion, imagen_url, specs) VALUES

('Cooler Master Hyper 212 Black Edition', 'cooler', 'Cooler Master', 52000.00, 14,
 'El disipador por aire más clásico del mercado. Cuatro heatpipes de contacto directo y acabado negro. Buena relación precio/rendimiento para CPUs de gama media.',
 '/img/productos/hyper-212-black.webp',
 '{"tipo":"aire","sockets":["AM4","AM5","LGA1700","LGA1200","LGA1151"],"tdp_max_w":150,"altura_mm":159,"ventiladores":1,"ventilador_mm":120,"rgb":false,"ruido_db":26}'),

('DeepCool AK400', 'cooler', 'DeepCool', 45900.00, 22,
 'Torre compacta de 4 heatpipes con muy buena disipación para lo que sale. Perfil bajo en el lado de la RAM, no tapa los módulos.',
 '/img/productos/deepcool-ak400.webp',
 '{"tipo":"aire","sockets":["AM4","AM5","LGA1700","LGA1200"],"tdp_max_w":220,"altura_mm":155,"ventiladores":1,"ventilador_mm":120,"rgb":false,"ruido_db":29}'),

('DeepCool AG400', 'cooler', 'DeepCool', 37900.00, 18,
 'Opción económica de torre simple. Rinde de sobra para procesadores de 65 W y entra en gabinetes chicos.',
 '/img/productos/deepcool-ag400.webp',
 '{"tipo":"aire","sockets":["AM4","AM5","LGA1700","LGA1200"],"tdp_max_w":220,"altura_mm":150,"ventiladores":1,"ventilador_mm":120,"rgb":false,"ruido_db":31}'),

('Thermalright Peerless Assassin 120 SE', 'cooler', 'Thermalright', 53500.00, 11,
 'Doble torre con 6 heatpipes y dos ventiladores. Rendimiento de gama alta a precio de gama media, es la recomendación típica para overclock moderado.',
 '/img/productos/peerless-assassin-120se.webp',
 '{"tipo":"aire","sockets":["AM4","AM5","LGA1700","LGA1200"],"tdp_max_w":245,"altura_mm":155,"ventiladores":2,"ventilador_mm":120,"rgb":false,"ruido_db":26}'),

('Noctua NH-D15', 'cooler', 'Noctua', 149000.00, 6,
 'El referente de refrigeración por aire. Doble torre con dos ventiladores de 140 mm, muy silencioso y con 6 años de garantía. Es alto: verificar espacio en el gabinete.',
 '/img/productos/noctua-nh-d15.webp',
 '{"tipo":"aire","sockets":["AM4","AM5","LGA1700","LGA1200"],"tdp_max_w":220,"altura_mm":165,"ventiladores":2,"ventilador_mm":140,"rgb":false,"ruido_db":25}'),

('Noctua NH-L9a-AM4', 'cooler', 'Noctua', 68500.00, 9,
 'Disipador de perfil bajo (37 mm de alto) pensado exclusivamente para AM4. Ideal para equipos chicos tipo HTPC con procesadores de hasta 65 W. No tapa ningún slot de RAM.',
 NULL,
 '{"tipo":"aire","sockets":["AM4"],"tdp_max_w":65,"altura_mm":37,"ventiladores":1,"ventilador_mm":92,"rgb":false,"ruido_db":23}'),

('be quiet! Pure Rock 2', 'cooler', 'be quiet!', 59900.00, 8,
 'Torre de 4 heatpipes con ventilador Pure Wings 2. Enfocado en operación silenciosa más que en récords de temperatura.',
 NULL,
 '{"tipo":"aire","sockets":["AM4","AM5","LGA1700","LGA1200"],"tdp_max_w":150,"altura_mm":155,"ventiladores":1,"ventilador_mm":120,"rgb":false,"ruido_db":27}'),

('ARCTIC Freezer 36', 'cooler', 'ARCTIC', 46500.00, 16,
 'Doble ventilador P12 PWM sobre torre simple. Muy buen caudal por el precio y montaje directo sobre los backplates de AMD.',
 '/img/productos/arctic-freezer-36.webp',
 '{"tipo":"aire","sockets":["AM4","AM5","LGA1700","LGA1851"],"tdp_max_w":200,"altura_mm":159,"ventiladores":2,"ventilador_mm":120,"rgb":false,"ruido_db":28}'),

('DeepCool LE500 Marrs', 'cooler', 'DeepCool', 92500.00, 10,
 'Refrigeración líquida todo en uno de 240 mm. Entrada al mundo AIO sin pagar de más, con bomba de bajo ruido.',
 '/img/productos/deepcool-le500.webp',
 '{"tipo":"liquida","sockets":["AM4","AM5","LGA1700","LGA1200"],"tdp_max_w":220,"radiador_mm":240,"ventiladores":2,"ventilador_mm":120,"rgb":false,"ruido_db":30}'),

('ARCTIC Liquid Freezer II 240', 'cooler', 'ARCTIC', 127000.00, 7,
 'AIO de 240 mm con radiador más grueso que el promedio y un ventilador extra que enfría el VRM de la placa madre. Sin RGB, todo enfocado a rendimiento.',
 '/img/productos/liquid-freezer-ii-240.webp',
 '{"tipo":"liquida","sockets":["AM4","AM5","LGA1700","LGA1200"],"tdp_max_w":250,"radiador_mm":240,"ventiladores":2,"ventilador_mm":120,"rgb":false,"ruido_db":27}'),

('NZXT Kraken 240', 'cooler', 'NZXT', 174900.00, 5,
 'AIO de 240 mm con pantalla LCD de 1,54 pulgadas en la bomba para mostrar temperaturas o imágenes. Se configura desde el software CAM.',
 NULL,
 '{"tipo":"liquida","sockets":["AM4","AM5","LGA1700","LGA1200"],"tdp_max_w":250,"radiador_mm":240,"ventiladores":2,"ventilador_mm":120,"rgb":true,"ruido_db":33}'),

('Corsair iCUE H100i Elite Capellix', 'cooler', 'Corsair', 189000.00, 4,
 'AIO de 240 mm con LEDs Capellix en la bomba y ventiladores ML RGB. Se controla junto al resto del equipo desde iCUE.',
 '/img/productos/corsair-h100i-elite.webp',
 '{"tipo":"liquida","sockets":["AM4","AM5","LGA1700","LGA1200"],"tdp_max_w":250,"radiador_mm":240,"ventiladores":2,"ventilador_mm":120,"rgb":true,"ruido_db":36}'),

('Corsair iCUE H150i Elite LCD', 'cooler', 'Corsair', 369000.00, 3,
 'AIO de 360 mm con pantalla IPS a color en la bomba. Pensado para procesadores de alto consumo con overclock; necesita gabinete con soporte para radiador de 360 mm.',
 '/img/productos/corsair-h150i-elite-lcd.webp',
 '{"tipo":"liquida","sockets":["AM4","AM5","LGA1700","LGA1200"],"tdp_max_w":300,"radiador_mm":360,"ventiladores":3,"ventilador_mm":120,"rgb":true,"ruido_db":36}');
