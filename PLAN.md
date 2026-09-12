# Plan de acción — Chatbot IA para catálogo web

> Documento de trabajo para una sesión de Claude Cowork.
> Lee este archivo completo antes de escribir código.

---

## 1. Qué se está construyendo

Un **asistente de ventas con IA** que se agrega a la web de un comercio. El usuario
pregunta en lenguaje natural, la IA da consejo técnico correcto **y además** busca en
el catálogo real del comercio y ofrece los productos que encajan.

Caso de uso de referencia (usarlo como test end-to-end):

> "¿Qué water cooling le pongo a un Ryzen 5 4600G?"

La respuesta esperada combina dos cosas:

1. **Criterio de compra** — socket AM4, TDP 65 W, que con ese TDP no hace falta una AIO
   de 360 mm, que hay que mirar altura del disipador y espacio para la RAM.
2. **Productos concretos del catálogo** — 2 o 3 opciones compatibles, y si no hay match
   exacto, lo más parecido explicando la diferencia.

**Este no es un chatbot de FAQ ni un buscador con filtros.** Lo que lo hace valioso es
que el modelo *extrae specs implícitas* de una pregunta en lenguaje natural (el usuario
nunca escribió "AM4" ni "65W") y con eso consulta la base de datos.

### Contexto del portafolio

Este proyecto es la categoría **"agregados / implementaciones sobre webs existentes"**
del portafolio. Eso tiene una consecuencia de diseño importante:

- El demo **NO** es una tienda completa. Nada de carrito, checkout, auth, órdenes ni
  pagos.
- Es una **página de catálogo simple y bien hecha** con el widget de chat encima.
- Tiene que comunicar: *"esto se le puede agregar a la web que ya tenés"*.

El público que lo va a ver son dueños de comercio sin conocimiento técnico. Se prueba
en 10 segundos y tiene que sorprender.

---

## 2. Stack

| Capa | Tecnología |
|---|---|
| Base de datos | MySQL 8 en Docker |
| Admin DB | phpMyAdmin en Docker |
| Backend | Node.js + Express + TypeScript |
| IA | Groq (API compatible con OpenAI) |
| Frontend | React + Vite (JSX, sin TypeScript) |

Notas de stack:

- **El backend es obligatorio**, no opcional. Tres razones: la API key no puede vivir en
  el frontend; el loop de tool use necesita un orquestador; y el navegador no habla
  MySQL.
- **Groq** se eligió porque su free tier no pide tarjeta y es compatible con la API de
  OpenAI, así que cambiar de proveedor después toca muy poco código. La key va en `.env`,
  nunca commiteada.
- **Nada de Python.** Acá "IA" es una llamada HTTP; Node la hace igual y mantiene un
  solo lenguaje en el proyecto.
- **Nada de Tailwind ni librerías de componentes** en el frontend. CSS propio.

---

## 3. Cómo funciona (tool use / function calling)

Este es el corazón del proyecto. El ciclo:

1. El frontend manda la pregunta a `POST /api/chat`.
2. El backend llama al modelo, pasándole la definición de una herramienta
   `buscar_productos`.
3. El modelo **no responde texto todavía**: devuelve una *tool call* con los criterios
   que dedujo (`{ categoria: "cooler", socket: "AM4", tdp_minimo: 65 }`).
4. El backend ejecuta `buscarProductos(criterios)` contra MySQL.
5. El backend le devuelve los resultados al modelo en un mensaje de rol `tool`.
6. El modelo ahora sí redacta la respuesta final, mezclando consejo + productos reales.
7. El backend devuelve al frontend: `{ mensaje, productos[] }`.

Puntos que suelen romperse y hay que contemplar desde el inicio:

- El modelo puede pedir **varias tool calls seguidas** (ej: busca coolers, después busca
  pasta térmica). El loop tiene que soportar N iteraciones, con un **tope de 5** para no
  quedar colgado.
- Si la búsqueda **no devuelve nada**, no responder "no hay stock". Hay que reintentar
  con criterios más laxos y explicar la diferencia ("no tengo con RGB, pero este es
  compatible y más silencioso").
- El modelo **no debe inventar productos**. Va explícito en el system prompt: solo puede
  ofrecer lo que devolvió la herramienta.
- El historial de conversación se manda completo en cada request (el modelo no tiene
  memoria entre llamadas).

---

## 4. Orden de trabajo

**Regla: primero toda la lógica, después lo visual.** No se toca el frontend hasta que
el backend responda bien probado por consola o Postman.

Cada etapa termina con una prueba concreta. **No avanzar a la siguiente sin que Pedro
confirme.**

### Etapa 1 — Infraestructura y datos

- `docker-compose.yml` con MySQL 8 + phpMyAdmin, volumen persistente, variables desde
  `.env`.
- Esquema de la tabla `productos`. Campos mínimos: `id`, `nombre`, `categoria`, `marca`,
  `precio`, `stock`, `descripcion`, `imagen_url`, y un campo `specs` tipo JSON para los
  datos técnicos variables (socket, TDP, altura, tamaño de radiador).
- Seed con **30 a 40 productos de hardware reales y verificables**, con specs correctas.
  Coolers, procesadores, placas de video, memorias, fuentes. Las specs tienen que ser
  ciertas — si están mal, el demo miente y se nota.

> **Prueba:** los contenedores levantan, phpMyAdmin abre, y la tabla tiene los productos
> cargados.

### Etapa 2 — Backend base y buscador

- Proyecto Node + Express + TypeScript, con estructura por capas (ver sección 5).
- Conexión a MySQL con pool.
- La función `buscarProductos(criterios)`: filtra por categoría, marca, rango de precio,
  stock y specs del JSON. Devuelve resultados ordenados por relevancia.
- Endpoint `GET /api/productos` para listar y filtrar.

> **Prueba:** llamar a `buscarProductos` desde un script y verificar que
> `{ categoria: "cooler", socket: "AM4" }` devuelve solo coolers AM4. Sin IA todavía.

### Etapa 3 — Integración con la IA

- Cliente de Groq aislado en su propio módulo (para poder cambiar de proveedor sin tocar
  el resto).
- Definición del schema de la herramienta `buscar_productos`.
- System prompt: rol de asesor de la tienda, tono claro para no-técnicos, prohibido
  inventar productos, siempre explicar *por qué* recomienda algo.
- El loop de tool use, con tope de iteraciones.

> **Prueba:** desde consola, mandar la pregunta del Ryzen 5 4600G y ver que la respuesta
> incluye criterio técnico + productos que existen en la base.

### Etapa 4 — Endpoint de chat

- `POST /api/chat` recibiendo `{ mensaje, historial }`.
- Manejo de errores: si Groq falla o llega un 429 por rate limit, devolver un mensaje
  útil, no un stack trace.
- Rate limiting básico por IP (el free tier de Groq es 30 requests por minuto — un demo
  público se abusa fácil).
- Validación de entrada: largo máximo del mensaje, largo máximo del historial.

> **Prueba:** conversación de varios turnos por Postman, incluyendo repreguntas del tipo
> "¿y el más barato?".

### Etapa 5 — Frontend

Recién acá se empieza lo visual.

- React + Vite.
- Página de catálogo: grilla de productos, filtro por categoría, vista de detalle.
- Widget de chat: burbuja flotante que se abre, historial de mensajes, indicador de
  "escribiendo", y **tarjetas de producto embebidas en la respuesta** (esto es lo que
  hace el efecto).
- Responsive. La mayoría lo va a ver en el celular.

> **Prueba:** hacer la pregunta desde la interfaz y ver la respuesta con las tarjetas
> renderizadas.

### Etapa 6 — Pulido (solo si hay tiempo)

- Estados de carga y vacío bien resueltos.
- Sugerencias de preguntas iniciales (para que el visitante sepa qué preguntar).
- README con capturas.
- Fotos para los 5 productos que todavía muestran el dibujo (NH-L9a-AM4, Pure Rock 2,
  Kraken 240, Ryzen 5 4600G, Ryzen 5 5600): solo con foto del modelo exacto.
- Sumar respaldos de modelo (qwen 27b) para estirar el cupo diario de Groq, probándolos antes.

#### Pulido de seguridad

Punto de partida: la API key de Groq vive solo en el `.env` del backend y nunca llega al
navegador. Quien intercepte un pedido desde DevTools ve `/api/chat` con la pregunta y la
respuesta, no la key. Lo que falta blindar:

- **Secretos:** regenerar la key de Groq (quedó expuesta en el chat de desarrollo), confirmar
  que `.env` nunca se commitea y revisar el historial de git. En producción, la key en las
  variables de entorno del hosting, no en archivos.
- **Headers HTTP:** `helmet` o equivalente — CSP estricta, `X-Content-Type-Options`,
  `Referrer-Policy`, HSTS detrás de HTTPS.
- **CORS:** solo el dominio real del frontend en producción (hoy acepta `localhost:5173`).
- **Abuso del chat:** rate limit también por tokens/día y global (no solo por IP), tope de
  conversaciones por sesión, y detección de pedidos automatizados. Evaluar un captcha
  invisible (Cloudflare Turnstile) si el demo es público.
- **Prompt injection:** probar intentos de "ignorá tus instrucciones" y de sacar el system
  prompt; que el asesor no revele configuración interna ni ejecute nada fuera de la búsqueda.
- **Validación de la herramienta:** los criterios que emite la IA ya se normalizan y el SQL es
  parametrizado; agregar tests de inyección SQL en `texto`, `marca` y `socket`.
- **Errores:** confirmar que en producción ningún error devuelve stack traces ni `detalle`
  (`NODE_ENV=production`).
- **Base de datos:** el usuario de la app con permisos mínimos (SELECT sobre catálogo, INSERT
  en conversaciones/mensajes), contraseñas fuertes, MySQL y phpMyAdmin sin exponer a internet
  (phpMyAdmin fuera de producción).
- **Datos de conversaciones:** política de retención (borrar mensajes viejos) y no guardar
  datos personales que el usuario escriba sin necesidad.
- **Dependencias:** `npm audit` en backend y frontend, y versiones fijadas.
- **Frontend:** el texto del asesor ya se arma sin HTML crudo (no hay XSS por
  `dangerouslySetInnerHTML`); verificar que siga así y sumar CSP.

---

## 5. Reglas de código

**Requisito explícito de Pedro: nada de archivos de 700 líneas.** El código tiene que ser
modular, con funciones chicas exportadas, para que escale sin volverse inmanejable.

- **Techo de ~150 líneas por archivo.** Si algo lo pasa, se parte.
- **Una responsabilidad por módulo.** El archivo que arma el prompt no consulta la base;
  el que consulta la base no llama a la IA.
- Funciones chicas y exportadas nombradas, no un default gigante.
- Todo lo configurable en `.env`, nada hardcodeado.
- Tipos de TypeScript en su propio archivo, compartidos.

Estructura sugerida del backend:

```
Backend/
├── src/
│   ├── config/          env, conexión a MySQL
│   ├── types/           interfaces compartidas
│   ├── db/              queries — nada de lógica de negocio acá
│   ├── services/
│   │   ├── productos/   buscarProductos y su lógica de matching
│   │   └── ia/          cliente Groq, schema de la tool, prompt, loop
│   ├── controllers/     handlers de Express
│   ├── routes/          definición de rutas
│   └── middlewares/     errores, rate limit, validación
├── docker-compose.yml
└── .env.example
```

---

## 6. Sobre el diseño (Etapa 5)

**Usar la skill de frontend-design** antes de escribir la interfaz.

El objetivo visual: que un dueño de comercio lo mire y piense *"quiero esto para mi
negocio"*. Nada de plantilla genérica de Bootstrap.

- Identidad visual propia y decidida, no defaults.
- El widget de chat tiene que verse **integrado a la web**, no pegado encima.
- Las tarjetas de producto dentro del chat son el momento clave del demo. Que se vean
  bien.
- Mobile first.

---

## 7. Cómo trabajar con Pedro

- **Trabaja por etapas y espera confirmación antes de avanzar.** No adelantarse.
- **Entregar archivos completos**, no fragmentos ni parches parciales. Si un archivo
  cambia, se manda entero.
- **Ser conciso.** Explicar lo necesario, no escribir ensayos.
- Si algo es ambiguo, preguntar antes de asumir.

Entorno de la máquina:

- CachyOS (Arch Linux), shell **fish** — la sintaxis bash (`var=$(...)`, `if/fi`) falla,
  hay que envolverla en `bash -c '...'`.
- Terminal kitty. Docker disponible.
- Proyectos en `~/Escritorio/Programacion/`.
