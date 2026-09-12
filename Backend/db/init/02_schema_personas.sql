-- Personas: usuarios internos del comercio y clientes.
-- `usuarios` son empleados que operan el sistema; `clientes` son quienes compran.

CREATE TABLE usuarios (
  id             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre         VARCHAR(60)  NOT NULL,
  apellido       VARCHAR(60)  NOT NULL,
  email          VARCHAR(160) NOT NULL,
  password_hash  VARCHAR(255) NOT NULL,
  rol            ENUM('admin','vendedor','deposito') NOT NULL DEFAULT 'vendedor',
  activo         TINYINT(1)   NOT NULL DEFAULT 1,
  ultimo_acceso  DATETIME     NULL,
  creado_en      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_usuario_email (email),
  KEY idx_usuario_rol (rol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE clientes (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre      VARCHAR(60)  NOT NULL,
  apellido    VARCHAR(60)  NOT NULL,
  email       VARCHAR(160) NOT NULL,
  telefono    VARCHAR(40)  NULL,
  documento   VARCHAR(20)  NULL,
  direccion   VARCHAR(180) NULL,
  ciudad      VARCHAR(80)  NULL,
  provincia   VARCHAR(80)  NULL,
  notas       TEXT         NULL,
  creado_en   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_cliente_email (email),
  UNIQUE KEY uq_cliente_documento (documento),
  KEY idx_cliente_apellido (apellido)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
