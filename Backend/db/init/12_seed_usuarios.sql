-- Empleados del comercio. La contrasenia de todos es "demo1234".
-- Formato del hash: scrypt$<salt hex>$<derivado hex> (crypto.scryptSync de Node,
-- sin dependencias externas). Son datos de demo, no credenciales reales.

INSERT INTO usuarios (id, nombre, apellido, email, password_hash, rol, activo, ultimo_acceso) VALUES
  (1, 'Martina', 'Aguirre', 'martina@hardstore.demo',
   'scrypt$49b659bebe667f0e7d1a4c529575391a$4f28a6553f20808ff918968f2ad34530f999071a831899f17cbf389321af5931',
   'admin', 1, '2026-09-08 18:42:11'),

  (2, 'Diego', 'Ramos', 'diego@hardstore.demo',
   'scrypt$a9c2515ac1bd70a01e6fdbb60f8753b1$6cc8db6e94baf33055931d53ad6b28ea82b199c42283919f45bc2c44e7feeb24',
   'vendedor', 1, '2026-09-09 10:05:47'),

  (3, 'Lucía', 'Benítez', 'lucia@hardstore.demo',
   'scrypt$891b9c04c53684b84897311053dc1d77$4f44ade14f3e2a2d561dcacd21da561084bef2265d0ea9d10623336c146c1ff8',
   'vendedor', 1, '2026-09-09 09:12:03'),

  (4, 'Sergio', 'Molina', 'sergio@hardstore.demo',
   'scrypt$8113135c78f54cfd6757c5bbcb97152e$5588ed92eb685a65884030895cbde85b036a5818c0635500e64c8eaaf33cc6ee',
   'deposito', 1, '2026-09-09 08:30:22');
