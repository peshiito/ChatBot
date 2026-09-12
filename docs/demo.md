# Mostrar el demo

Dos caminos: **grabar un video** (para el portafolio, LinkedIn o mandarlo por WhatsApp) o
**mostrarlo en vivo** (entrevista, reunión con un comercio). El guion es el mismo.

---

## El guion, en 60 segundos

La idea que tiene que quedar: *esto se le agrega a la web que ya tenés y responde con tu stock*.

| Tiempo | Qué se muestra | Qué se dice |
|---|---|---|
| 0:00 | La página, sin tocar nada | «Una tienda de componentes común y corriente.» |
| 0:08 | Se escribe la pregunta de referencia | «El cliente pregunta como le preguntaría a un vendedor: *¿qué water cooling le pongo a un Ryzen 5 4600G?*» |
| 0:15 | El asesor piensa | «Nadie escribió AM4 ni 65 W: eso lo deduce solo.» |
| 0:20 | Llega la respuesta | «Primero el criterio: socket, consumo, que no hace falta una AIO de 360.» |
| 0:30 | Aparecen las tarjetas | «Y estos productos salen de la base de datos de la tienda, con su precio y su stock real.» |
| 0:40 | Se abre una ficha | «Desde el chat se va directo al producto.» |
| 0:48 | Se repregunta «¿y el más barato?» | «Mantiene el contexto: sabe de qué estamos hablando.» |
| 0:58 | Cierre | «Es un agregado: la tienda sigue siendo la misma, con un vendedor que atiende siempre.» |

Preguntas de respaldo si hay tiempo o alguien pide otra cosa:

- «Quiero jugar en 1080p y tengo $400.000» → arma un combo con criterio de compatibilidad.
- «¿Qué placa de video le pongo a una B450?» → explica que la placa no depende del socket.
- «¿Tenés un Intel i9?» → muestra que **solo habla del stock de la tienda**, sin inventar.

## Grabarlo automáticamente

```bash
# Con el backend y Vite levantados:
cd Frontend
npm run demo                  # graba con la IA de verdad
SIN_IA=1 npm run demo         # ensayo, sin gastar cupo
```

Sale un `.webm` de unos 30 segundos en `docs/demo/`, con el guion completo: escribe la pregunta,
espera la respuesta real, recorre las tarjetas, abre una ficha y repregunta.

Para publicarlo conviene pasarlo a mp4:

```bash
ffmpeg -i docs/demo/demo-AAAA-MM-DD.webm -c:v libx264 -crf 23 -pix_fmt yuv420p docs/demo/demo.mp4
```

> El guion está en `Frontend/scripts/grabar-demo.mjs`: los tiempos y la pregunta se cambian ahí.

## Grabarlo a mano (con voz)

En CachyOS con Wayland:

- **Kooha** o **GPU Screen Recorder** para la pantalla (ambos en el repo o en Flathub).
- **OBS Studio** si se quiere cámara, voz y zoom.

Recomendaciones:

- Grabar la ventana del navegador sola, en 1280×800, no el escritorio entero.
- Zoom del navegador al 110 %: el texto del chat se lee en el celular de quien mira.
- Modo incógnito: sin barras de favoritos ni extensiones.
- Si se graba con voz, hablar sobre lo que hace el asesor, no sobre el código.

## Mostrarlo en vivo

- Levantar todo **antes** (`docker compose up -d`, los dos `npm run dev`) y hacer una pregunta de
  prueba: la primera consulta del día siempre es la más lenta.
- Tener el celular a mano: abrir la misma URL en el teléfono muestra que es responsive.
- Si la IA queda sin cupo, el asesor lo dice con una frase clara. Igual, revisar el cupo del día
  antes de la reunión.
- Plan B: tener el video grabado a mano por si no hay internet.
