-- Distribuidores mayoristas. Se asignan a los productos por marca en 11_post_productos.sql.

INSERT INTO proveedores (id, nombre, cuit, contacto, email, telefono) VALUES
  (1, 'Air Computers S.R.L.',      '30-70812345-4', 'Mesa de ventas',    'ventas@aircomputers.demo',   '+54 11 4555-0101'),
  (2, 'Nexxt Distribuciones',      '30-71234567-9', 'Carla Ferreyra',    'pedidos@nexxtdist.demo',     '+54 11 4555-0202'),
  (3, 'Gamer Factory Mayorista',   '30-71987654-2', 'Ruben Ortiz',       'mayorista@gamerfactory.demo','+54 351 455-0303'),
  (4, 'Newbytes Import',           '33-70456789-1', 'Departamento B2B',  'b2b@newbytes.demo',          '+54 11 4555-0404'),
  (5, 'Solutionbox Argentina',     '30-70998877-6', 'Andrea Pini',       'cuentas@solutionbox.demo',   '+54 11 4555-0505');
