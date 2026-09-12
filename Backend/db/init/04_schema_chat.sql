-- Registro de las conversaciones del asistente.
-- Sirve para dos cosas: auditar que recomendo la IA, y ver que pregunta la gente
-- (que productos faltan en el catalogo, que dudas se repiten).

CREATE TABLE conversaciones (
  id                INT UNSIGNED NOT NULL AUTO_INCREMENT,
  sesion_id         VARCHAR(64)  NOT NULL,
  cliente_id        INT UNSIGNED NULL,
  origen            VARCHAR(40)  NOT NULL DEFAULT 'web',
  iniciada_en       DATETIME     NOT NULL,
  ultima_actividad  DATETIME     NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_conversacion_sesion (sesion_id),
  KEY idx_conversacion_actividad (ultima_actividad),
  CONSTRAINT fk_conversacion_cliente FOREIGN KEY (cliente_id)
    REFERENCES clientes (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE mensajes (
  id                   INT UNSIGNED NOT NULL AUTO_INCREMENT,
  conversacion_id      INT UNSIGNED NOT NULL,
  rol                  ENUM('user','assistant','tool','system') NOT NULL,
  contenido            TEXT         NOT NULL,
  productos_sugeridos  JSON         NULL,
  creado_en            DATETIME     NOT NULL,
  PRIMARY KEY (id),
  KEY idx_mensaje_conversacion (conversacion_id),
  CONSTRAINT fk_mensaje_conversacion FOREIGN KEY (conversacion_id)
    REFERENCES conversaciones (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
