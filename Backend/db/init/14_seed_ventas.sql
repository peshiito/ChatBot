-- Ventas de los ultimos tres meses.
-- Los totales no se escriben a mano: se recalculan al final desde venta_items,
-- asi no puede haber una venta con un total que no coincide con sus renglones.

INSERT INTO ventas (id, cliente_id, usuario_id, fecha, estado, metodo_pago, descuento, observaciones) VALUES
  (1,  1,  2, '2026-07-14 11:20:00', 'entregada', 'transferencia',   0,     NULL),
  (2,  3,  3, '2026-07-18 16:05:00', 'entregada', 'tarjeta_credito', 0,     'Factura A.'),
  (3,  2,  2, '2026-07-22 10:41:00', 'entregada', 'mercado_pago',    0,     NULL),
  (4,  5,  3, '2026-07-29 18:33:00', 'entregada', 'efectivo',        5000,  'Descuento por pago en efectivo.'),
  (5,  4,  2, '2026-08-03 12:15:00', 'entregada', 'transferencia',   0,     NULL),
  (6,  6,  3, '2026-08-08 15:50:00', 'entregada', 'tarjeta_debito',  0,     NULL),
  (7,  11, 2, '2026-08-12 09:28:00', 'entregada', 'transferencia',   25000, 'Cliente revendedor.'),
  (8,  7,  3, '2026-08-19 17:02:00', 'entregada', 'mercado_pago',    0,     NULL),
  (9,  8,  2, '2026-08-25 13:44:00', 'enviada',   'tarjeta_credito', 0,     'Envío por Andreani.'),
  (10, 9,  3, '2026-08-30 11:11:00', 'entregada', 'efectivo',        0,     'Retira en sucursal.'),
  (11, 12, 2, '2026-09-02 16:27:00', 'pagada',    'transferencia',   0,     NULL),
  (12, 10, 3, '2026-09-04 10:09:00', 'enviada',   'mercado_pago',    0,     NULL),
  (13, 1,  2, '2026-09-06 12:55:00', 'pagada',    'transferencia',   0,     NULL),
  (14, 6,  3, '2026-09-08 18:20:00', 'pendiente', 'transferencia',   0,     'Espera confirmación de pago.'),
  (15, 5,  2, '2026-09-09 09:47:00', 'cancelada', 'transferencia',   0,     'El cliente se arrepintió.');

INSERT INTO venta_items (venta_id, producto_id, cantidad, precio_unitario) VALUES
  (1,  15, 1, 142900.00), (1,  2,  1, 45900.00),  (1,  31, 1, 54900.00),
  (2,  26, 1, 392000.00), (2,  38, 1, 91500.00),
  (3,  14, 1, 124900.00), (3,  6,  1, 68500.00),
  (4,  30, 2, 52900.00),
  (5,  18, 1, 339000.00), (5,  10, 1, 127000.00), (5,  35, 1, 157000.00),
  (6,  23, 1, 248000.00), (6,  37, 1, 71900.00),
  (7,  2,  4, 45900.00),  (7,  3,  3, 37900.00),
  (8,  21, 1, 143500.00), (8,  24, 1, 353000.00), (8,  39, 1, 143000.00),
  (9,  28, 1, 785000.00), (9,  41, 1, 196000.00),
  (10, 4,  1, 53500.00),
  (11, 20, 1, 459000.00), (11, 13, 1, 369000.00), (11, 33, 1, 124000.00),
  (12, 25, 1, 297000.00), (12, 38, 1, 91500.00),
  (13, 32, 1, 111000.00),
  (14, 29, 1, 639000.00), (14, 40, 1, 183000.00),
  (15, 12, 1, 189000.00);

UPDATE ventas v
SET subtotal = (
  SELECT COALESCE(SUM(i.subtotal), 0) FROM venta_items i WHERE i.venta_id = v.id
);

UPDATE ventas SET total = subtotal - descuento;
