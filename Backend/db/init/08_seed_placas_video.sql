-- Placas de video.
-- specs: chipset, vram_gb, tipo_memoria, consumo_w, fuente_recomendada_w,
--        conectores_alimentacion, largo_mm, interfaz.

INSERT INTO productos (nombre, categoria, marca, precio, stock, descripcion, imagen_url, specs) VALUES

('Sapphire Pulse Radeon RX 6600 8GB', 'placa_video', 'Sapphire', 248000.00, 9,
 'Placa de entrada para 1080p con muy bajo consumo: 132 W y un solo conector de 8 pines. Anda con fuentes de 500 W.',
 '/img/productos/rx-6600-pulse.webp',
 '{"chipset":"AMD Radeon RX 6600","vram_gb":8,"tipo_memoria":"GDDR6","consumo_w":132,"fuente_recomendada_w":500,"conectores_alimentacion":"1x 8 pines","largo_mm":193,"interfaz":"PCIe 4.0 x8"}'),

('Gigabyte GeForce RTX 3060 Eagle OC 12GB', 'placa_video', 'Gigabyte', 353000.00, 6,
 'Doce GB de VRAM, útil para edición y modelos locales además de juegos en 1080p. Consumo de 170 W.',
 '/img/productos/rtx-3060-eagle.webp',
 '{"chipset":"NVIDIA GeForce RTX 3060","vram_gb":12,"tipo_memoria":"GDDR6","consumo_w":170,"fuente_recomendada_w":550,"conectores_alimentacion":"1x 8 pines","largo_mm":242,"interfaz":"PCIe 4.0 x16"}'),

('XFX Speedster SWFT 210 Radeon RX 7600 8GB', 'placa_video', 'XFX', 297000.00, 7,
 'Generación RDNA 3 para 1080p a alta tasa de cuadros. 165 W de consumo y dos ventiladores.',
 '/img/productos/rx-7600-swft210.webp',
 '{"chipset":"AMD Radeon RX 7600","vram_gb":8,"tipo_memoria":"GDDR6","consumo_w":165,"fuente_recomendada_w":550,"conectores_alimentacion":"1x 8 pines","largo_mm":240,"interfaz":"PCIe 4.0 x8"}'),

('Gigabyte GeForce RTX 4060 WINDFORCE OC 8GB', 'placa_video', 'Gigabyte', 392000.00, 10,
 'Muy eficiente: 115 W de consumo y soporte de DLSS 3 con generación de cuadros. Corta, entra en gabinetes compactos.',
 '/img/productos/rtx-4060-windforce.webp',
 '{"chipset":"NVIDIA GeForce RTX 4060","vram_gb":8,"tipo_memoria":"GDDR6","consumo_w":115,"fuente_recomendada_w":550,"conectores_alimentacion":"1x 8 pines","largo_mm":192,"interfaz":"PCIe 4.0 x8"}'),

('MSI GeForce RTX 4060 Ti VENTUS 2X BLACK 8G OC', 'placa_video', 'MSI', 496000.00, 5,
 'Escalón arriba de la 4060 para 1080p exigente y 1440p con DLSS. Consume 160 W.',
 '/img/productos/rtx-4060ti-ventus.webp',
 '{"chipset":"NVIDIA GeForce RTX 4060 Ti","vram_gb":8,"tipo_memoria":"GDDR6","consumo_w":160,"fuente_recomendada_w":600,"conectores_alimentacion":"1x 8 pines","largo_mm":200,"interfaz":"PCIe 4.0 x8"}'),

('ASUS Dual GeForce RTX 4070 SUPER OC 12GB', 'placa_video', 'ASUS', 785000.00, 4,
 'Placa de 1440p con margen para 4K con DLSS. 220 W de consumo, pide fuente de 650 W en adelante.',
 '/img/productos/rtx-4070-super-dual.webp',
 '{"chipset":"NVIDIA GeForce RTX 4070 SUPER","vram_gb":12,"tipo_memoria":"GDDR6X","consumo_w":220,"fuente_recomendada_w":650,"conectores_alimentacion":"1x 16 pines (12VHPWR)","largo_mm":227,"interfaz":"PCIe 4.0 x16"}'),

('Sapphire Pulse Radeon RX 7800 XT 16GB', 'placa_video', 'Sapphire', 639000.00, 3,
 'Dieciséis GB de VRAM para 1440p en calidad alta. Consume 263 W y mide 320 mm: verificar largo del gabinete.',
 '/img/productos/rx-7800xt-pulse.webp',
 '{"chipset":"AMD Radeon RX 7800 XT","vram_gb":16,"tipo_memoria":"GDDR6","consumo_w":263,"fuente_recomendada_w":700,"conectores_alimentacion":"2x 8 pines","largo_mm":320,"interfaz":"PCIe 4.0 x16"}');
