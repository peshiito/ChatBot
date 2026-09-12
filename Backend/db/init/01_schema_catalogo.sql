-- Catalogo: categorias, proveedores y productos.
-- Los datos tecnicos variables por categoria viven en `specs` (JSON), asi no hay
-- que migrar la tabla cada vez que aparece una categoria nueva.

CREATE TABLE categorias (
  slug      VARCHAR(40)  NOT NULL,
  etiqueta  VARCHAR(60)  NOT NULL,
  orden     TINYINT      NOT NULL DEFAULT 0,
  PRIMARY KEY (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO categorias (slug, etiqueta, orden) VALUES
  ('cooler',      'Refrigeración',    1),
  ('procesador',  'Procesadores',     2),
  ('placa_video', 'Placas de video',  3),
  ('memoria_ram', 'Memorias RAM',     4),
  ('fuente',      'Fuentes',          5);

CREATE TABLE proveedores (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre     VARCHAR(120) NOT NULL,
  cuit       VARCHAR(15)  NULL,
  contacto   VARCHAR(120) NULL,
  email      VARCHAR(160) NULL,
  telefono   VARCHAR(40)  NULL,
  activo     TINYINT(1)   NOT NULL DEFAULT 1,
  creado_en  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_proveedor_cuit (cuit)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE productos (
  id            INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  sku           VARCHAR(40)   NULL,
  nombre        VARCHAR(160)  NOT NULL,
  categoria     VARCHAR(40)   NOT NULL,
  marca         VARCHAR(40)   NOT NULL,
  proveedor_id  INT UNSIGNED  NULL,
  costo         DECIMAL(12,2) NULL,
  precio        DECIMAL(12,2) NOT NULL,
  stock         INT           NOT NULL DEFAULT 0,
  stock_minimo  INT           NOT NULL DEFAULT 3,
  descripcion   TEXT          NULL,
  imagen_url    VARCHAR(500)  NULL,
  specs         JSON          NOT NULL,
  activo        TINYINT(1)    NOT NULL DEFAULT 1,
  creado_en     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_producto_sku (sku),
  KEY idx_categoria (categoria),
  KEY idx_marca (marca),
  KEY idx_precio (precio),
  KEY idx_categoria_precio (categoria, precio),
  FULLTEXT KEY ft_busqueda (nombre, descripcion),
  CONSTRAINT fk_producto_categoria FOREIGN KEY (categoria)
    REFERENCES categorias (slug) ON UPDATE CASCADE,
  CONSTRAINT fk_producto_proveedor FOREIGN KEY (proveedor_id)
    REFERENCES proveedores (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
