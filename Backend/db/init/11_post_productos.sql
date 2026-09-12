-- Se corre despues de cargar todos los productos.
-- Deriva los campos administrativos en vez de repetirlos en cada seed:
-- SKU a partir de categoria + id, costo con un margen del 39% y proveedor por marca.

UPDATE productos
SET sku = CONCAT(UPPER(LEFT(categoria, 3)), '-', LPAD(id, 4, '0'));

UPDATE productos
SET costo = ROUND(precio * 0.72, 2);

UPDATE productos SET proveedor_id = 1
WHERE marca IN ('Corsair', 'Kingston', 'Thermaltake', 'Cooler Master');

UPDATE productos SET proveedor_id = 2
WHERE marca IN ('Gigabyte', 'ASUS', 'MSI', 'Crucial');

UPDATE productos SET proveedor_id = 3
WHERE marca IN ('DeepCool', 'NZXT', 'Thermalright', 'ARCTIC', 'G.SKILL');

UPDATE productos SET proveedor_id = 4
WHERE marca IN ('AMD', 'Intel', 'Sapphire', 'XFX');

UPDATE productos SET proveedor_id = 5
WHERE marca IN ('Noctua', 'be quiet!', 'Seasonic');

-- Los articulos de rotacion lenta y precio alto se reponen de a uno.
UPDATE productos SET stock_minimo = 1 WHERE precio > 300000;
UPDATE productos SET stock_minimo = 5 WHERE precio < 60000;
