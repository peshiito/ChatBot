/**
 * Textos legales del demo. Están acá y no en la base porque no cambian con el
 * catálogo: son sobre el sitio, no sobre los productos.
 *
 * ⚠️ Antes de publicar: poner un mail de contacto real en CONTACTO.
 */
export const CONTACTO = 'tu-mail@ejemplo.com';

export const ACTUALIZADO = '2026-09-12';

export const SECCIONES = [
  {
    id: 'demo',
    tab: 'Sobre el demo',
    titulo: 'Sobre este demo',
    bloques: [
      {
        texto:
          'HardStore no es un comercio real: es una tienda de ejemplo hecha para mostrar cómo funciona el asesor con IA sobre un catálogo propio.',
      },
      {
        titulo: 'Los productos son reales, los precios no',
        lista: [
          'Los componentes y sus especificaciones técnicas son reales y verificables.',
          'Los precios son de referencia, en pesos argentinos, y no son una oferta comercial.',
          'Acá no se vende nada: no hay carrito, ni pagos, ni envíos. Nadie te va a cobrar.',
        ],
      },
      {
        titulo: 'Marcas y fotos',
        lista: [
          'AMD, Intel, NVIDIA, Noctua y las demás marcas que aparecen pertenecen a sus titulares. Se nombran solo para identificar los productos; no hay relación comercial ni patrocinio.',
          'Las fotos son de los fabricantes o de Wikimedia Commons, con el crédito y la licencia en cada ficha.',
          'Si sos titular de una imagen y no querés que esté acá, escribinos y la sacamos.',
        ],
      },
      {
        titulo: 'Quién lo hizo',
        texto:
          'Es una pieza de portafolio: catálogo web + asistente de ventas con IA que responde con el stock real de la tienda. Consultas y contacto: ',
        contacto: true,
      },
    ],
  },
  {
    id: 'privacidad',
    tab: 'Privacidad',
    titulo: 'Privacidad',
    bloques: [
      {
        titulo: 'Qué se guarda',
        lista: [
          'Las preguntas y las respuestas del chat, junto a un identificador de sesión generado al azar.',
          'Nada más: no se pide ni se guarda nombre, mail, teléfono, dirección ni datos de pago.',
          'El identificador de sesión vive en la memoria de la pestaña. Si la cerrás, se pierde: no hay cookies, ni analítica, ni publicidad, ni seguimiento entre sitios.',
        ],
      },
      {
        titulo: 'Por qué se guarda',
        texto:
          'Para poder auditar qué recomendó el asesor y ver qué pregunta la gente. Las conversaciones se borran a los 30 días.',
      },
      {
        titulo: 'Con quién se comparte',
        lista: [
          'El texto de la conversación se envía a Groq, el proveedor de IA que genera las respuestas, en servidores fuera de Argentina. Se manda lo que escribís, no quién sos.',
          'No se comparte con nadie más, ni se vende, ni se usa para publicidad.',
          'El servidor guarda la dirección IP unos minutos, solamente para frenar el abuso del chat (límite de preguntas por minuto).',
        ],
      },
      {
        titulo: 'Pedido importante',
        texto:
          'No escribas datos personales en el chat: no hacen falta para que el asesor te recomiende un componente.',
      },
      {
        titulo: 'Tus derechos',
        texto:
          'Podés pedir acceso, rectificación o supresión de lo que quedó guardado (Ley 25.326 de Protección de Datos Personales). La autoridad de control es la Agencia de Acceso a la Información Pública. Escribinos a ',
        contacto: true,
      },
    ],
  },
  {
    id: 'ia',
    tab: 'Cómo funciona la IA',
    titulo: 'Cómo funciona el asesor',
    bloques: [
      {
        texto:
          'Estás hablando con un asistente automático, no con una persona. Lo aclaramos siempre, en el chat y acá.',
      },
      {
        titulo: 'Qué hace',
        lista: [
          'Entiende tu pregunta en lenguaje natural y deduce los datos técnicos que no dijiste (el socket de tu procesador, por ejemplo).',
          'Con eso busca en la base de datos real de la tienda y te muestra los productos que encajan.',
          'Solo habla de lo que hay en el catálogo: no recomienda productos de otros negocios.',
        ],
      },
      {
        titulo: 'Qué no hace',
        lista: [
          'No confirma compras, reservas, envíos ni descuentos. Para eso hablás con una persona.',
          'No accede a tus datos ni a tu equipo: solo lee lo que escribís en el chat.',
        ],
      },
      {
        titulo: 'Puede equivocarse',
        texto:
          'Las respuestas las genera un modelo de lenguaje y pueden tener errores. Verificá la compatibilidad y las medidas antes de comprar; el asesor no reemplaza a un técnico.',
      },
    ],
  },
];
