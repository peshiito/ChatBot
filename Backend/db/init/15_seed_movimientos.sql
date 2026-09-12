-- Historial de stock derivado de los datos que ya existen, no escrito a mano.
-- El stock actual de `productos` es la verdad; aca se reconstruye como se llego a el:
-- una carga inicial (stock actual + todo lo vendido) y un egreso por cada renglon
-- de venta no cancelada.

INSERT INTO movimientos_stock (producto_id, tipo, cantidad, stock_resultante, motivo, usuario_id, fecha)
SELECT p.id,
       'ingreso',
       p.stock + COALESCE(v.total_vendido, 0),
       p.stock + COALESCE(v.total_vendido, 0),
       'Carga inicial de inventario',
       4,
       '2026-07-01 09:00:00'
FROM productos p
LEFT JOIN (
  SELECT i.producto_id, SUM(i.cantidad) AS total_vendido
  FROM venta_items i
  JOIN ventas ve ON ve.id = i.venta_id
  WHERE ve.estado <> 'cancelada'
  GROUP BY i.producto_id
) v ON v.producto_id = p.id;

INSERT INTO movimientos_stock (producto_id, tipo, cantidad, stock_resultante, motivo, venta_id, usuario_id, fecha)
SELECT producto_id,
       'egreso',
       cantidad,
       stock_inicial - acumulado,
       CONCAT('Venta #', venta_id),
       venta_id,
       usuario_id,
       fecha
FROM (
  SELECT i.producto_id,
         i.cantidad,
         p.stock + COALESCE(t.total_vendido, 0) AS stock_inicial,
         SUM(i.cantidad) OVER (
           PARTITION BY i.producto_id
           ORDER BY ve.fecha, i.id
           ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
         ) AS acumulado,
         ve.id AS venta_id,
         ve.usuario_id,
         ve.fecha
  FROM venta_items i
  JOIN ventas ve   ON ve.id = i.venta_id
  JOIN productos p ON p.id = i.producto_id
  LEFT JOIN (
    SELECT i2.producto_id, SUM(i2.cantidad) AS total_vendido
    FROM venta_items i2
    JOIN ventas v2 ON v2.id = i2.venta_id
    WHERE v2.estado <> 'cancelada'
    GROUP BY i2.producto_id
  ) t ON t.producto_id = i.producto_id
  WHERE ve.estado <> 'cancelada'
) egresos;
