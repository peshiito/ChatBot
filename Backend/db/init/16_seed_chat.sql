-- Dos conversaciones de ejemplo para que las tablas del asistente no queden vacias.
-- A partir de la Etapa 4 las escribe el backend.

INSERT INTO conversaciones (id, sesion_id, cliente_id, origen, iniciada_en, ultima_actividad) VALUES
  (1, 'ses_8f2a1c4b9de07351', 1,    'web', '2026-09-06 12:41:00', '2026-09-06 12:47:30'),
  (2, 'ses_c17d9be402a6f885', NULL, 'web', '2026-09-08 18:02:00', '2026-09-08 18:06:12');

INSERT INTO mensajes (conversacion_id, rol, contenido, productos_sugeridos, creado_en) VALUES
  (1, 'user',
   'Tengo un Ryzen 5 5600 y la RAM que quiero comprar es RGB, me entra con el cooler que tengo?',
   NULL, '2026-09-06 12:41:00'),
  (1, 'assistant',
   'Depende de la altura del cooler. El kit Vengeance RGB Pro mide 51 mm de alto, bastante mas que una memoria comun de 34 mm. Con un DeepCool AK400 entra sin problema porque tiene el lado de la RAM despejado, pero con un disipador de doble torre puede chocar. Contame que cooler tenes y lo confirmamos.',
   '[32]', '2026-09-06 12:42:18'),
  (1, 'user', 'Tengo el AK400', NULL, '2026-09-06 12:46:05'),
  (1, 'assistant',
   'Entonces si, entra. El AK400 deja libre el primer slot de memoria justamente para permitir modulos altos.',
   '[32, 2]', '2026-09-06 12:47:30'),

  (2, 'user',
   'quiero una placa de video para jugar en 1440p, tengo una fuente de 650w',
   NULL, '2026-09-08 18:02:00'),
  (2, 'assistant',
   'Con 650 W tenes margen para una RTX 4070 SUPER, que consume 220 W y es la opcion mas equilibrada para 1440p. Si preferis mas memoria de video, la RX 7800 XT trae 16 GB, pero consume 263 W y recomiendan fuente de 700 W: ahi estarias justo. Fijate tambien el largo del gabinete, la 7800 XT mide 320 mm.',
   '[28, 29]', '2026-09-08 18:04:41'),
  (2, 'user', 'y si sumo tambien una fuente mas grande cuanto me sale?',
   NULL, '2026-09-08 18:05:30'),
  (2, 'assistant',
   'Tengo la be quiet! Pure Power 12 M de 850 W a $183.000, modular y compatible con ATX 3.0. Sumada a la RX 7800 XT quedaria en $822.000.',
   '[29, 40]', '2026-09-08 18:06:12');
