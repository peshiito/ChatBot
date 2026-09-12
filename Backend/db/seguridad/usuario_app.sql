-- Usuario de la aplicacion con permisos minimos. Se corre UNA vez, en produccion,
-- conectado como root:
--   docker compose exec -T mysql mysql -uroot -p"$MYSQL_ROOT_PASSWORD" catalogo < db/seguridad/usuario_app.sql
-- Despues se apunta el backend a este usuario en su .env (MYSQL_USER / MYSQL_PASSWORD).
--
-- Cambiar la contrasena antes de usarlo. La idea: si alguien roba las credenciales
-- del backend, no puede borrar el catalogo ni leer usuarios, clientes ni ventas.

CREATE USER IF NOT EXISTS 'catalogo_app'@'%' IDENTIFIED BY 'CAMBIAR_ESTA_CLAVE';

-- Catalogo: solo lectura.
GRANT SELECT ON catalogo.productos   TO 'catalogo_app'@'%';
GRANT SELECT ON catalogo.categorias  TO 'catalogo_app'@'%';
GRANT SELECT ON catalogo.proveedores TO 'catalogo_app'@'%';

-- Conversaciones: la app crea la conversacion y actualiza su ultima actividad.
GRANT SELECT, INSERT, UPDATE ON catalogo.conversaciones TO 'catalogo_app'@'%';
-- Mensajes: solo se agregan. La limpieza por retencion borra conversaciones (cascade).
GRANT SELECT, INSERT ON catalogo.mensajes TO 'catalogo_app'@'%';
GRANT DELETE ON catalogo.conversaciones TO 'catalogo_app'@'%';

-- Sin permisos sobre usuarios, clientes, ventas, venta_items ni movimientos_stock.
FLUSH PRIVILEGES;

-- Para verificar:  SHOW GRANTS FOR 'catalogo_app'@'%';
