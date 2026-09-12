-- Ventas, sus items y el historial de movimientos de stock.
-- `venta_items.subtotal` es una columna generada: no se puede desincronizar
-- de cantidad x precio_unitario.

CREATE TABLE ventas (
  id           INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  cliente_id   INT UNSIGNED  NOT NULL,
  usuario_id   INT UNSIGNED  NULL,
  fecha        DATETIME      NOT NULL,
  estado       ENUM('pendiente','pagada','enviada','entregada','cancelada')
                             NOT NULL DEFAULT 'pendiente',
  metodo_pago  ENUM('efectivo','transferencia','tarjeta_credito','tarjeta_debito','mercado_pago')
                             NOT NULL DEFAULT 'transferencia',
  subtotal     DECIMAL(12,2) NOT NULL DEFAULT 0,
  descuento    DECIMAL(12,2) NOT NULL DEFAULT 0,
  total        DECIMAL(12,2) NOT NULL DEFAULT 0,
  observaciones TEXT         NULL,
  creado_en    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_venta_cliente (cliente_id),
  KEY idx_venta_fecha (fecha),
  KEY idx_venta_estado (estado),
  CONSTRAINT fk_venta_cliente FOREIGN KEY (cliente_id)
    REFERENCES clientes (id) ON DELETE RESTRICT,
  CONSTRAINT fk_venta_usuario FOREIGN KEY (usuario_id)
    REFERENCES usuarios (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE venta_items (
  id               INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  venta_id         INT UNSIGNED  NOT NULL,
  producto_id      INT UNSIGNED  NOT NULL,
  cantidad         INT           NOT NULL,
  precio_unitario  DECIMAL(12,2) NOT NULL,
  subtotal         DECIMAL(12,2) AS (cantidad * precio_unitario) STORED,
  PRIMARY KEY (id),
  KEY idx_item_venta (venta_id),
  KEY idx_item_producto (producto_id),
  CONSTRAINT fk_item_venta FOREIGN KEY (venta_id)
    REFERENCES ventas (id) ON DELETE CASCADE,
  CONSTRAINT fk_item_producto FOREIGN KEY (producto_id)
    REFERENCES productos (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE movimientos_stock (
  id                INT UNSIGNED NOT NULL AUTO_INCREMENT,
  producto_id       INT UNSIGNED NOT NULL,
  tipo              ENUM('ingreso','egreso','ajuste') NOT NULL,
  cantidad          INT          NOT NULL,
  stock_resultante  INT          NOT NULL,
  motivo            VARCHAR(160) NULL,
  venta_id          INT UNSIGNED NULL,
  usuario_id        INT UNSIGNED NULL,
  fecha             DATETIME     NOT NULL,
  PRIMARY KEY (id),
  KEY idx_mov_producto (producto_id),
  KEY idx_mov_fecha (fecha),
  CONSTRAINT fk_mov_producto FOREIGN KEY (producto_id)
    REFERENCES productos (id) ON DELETE CASCADE,
  CONSTRAINT fk_mov_venta FOREIGN KEY (venta_id)
    REFERENCES ventas (id) ON DELETE SET NULL,
  CONSTRAINT fk_mov_usuario FOREIGN KEY (usuario_id)
    REFERENCES usuarios (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
