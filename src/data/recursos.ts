/**
 * Los sitios que le recomendamos a un estudiante que quiere seguir por su
 * cuenta. Este archivo es el registro: la página `/recursos` no trae ningún
 * enlace escrito a mano, así que agregar uno nuevo es agregar una entrada aquí
 * y nada más.
 *
 * Criterio para que un enlace entre: que sea gratis o tenga una parte gratis
 * de verdad, que siga vivo, y que un estudiante de este curso pueda abrirlo
 * hoy y entender algo. Si hay versión en español, va la versión en español.
 *
 * `sesiones` conecta el recurso con el cronograma: es lo que permite decir
 * «esto te sirve para la sesión 10» sin mantener una segunda lista.
 */

export type TipoRecurso = 'referencia' | 'practica' | 'video' | 'herramienta' | 'servicio';

export interface Recurso {
  nombre: string;
  url: string;
  /** Una línea: qué vas a encontrar y para qué te sirve. */
  descripcion: string;
  idioma: 'es' | 'en';
  tipo: TipoRecurso;
  /** Sesiones del cronograma con las que se conecta. */
  sesiones?: number[];
  /** Lo que abrirías primero si nunca has entrado. */
  destacado?: boolean;
}

export interface GrupoRecursos {
  id: string;
  titulo: string;
  /** Para qué momento sirve este grupo. */
  resumen: string;
  recursos: Recurso[];
}

export const GRUPOS: GrupoRecursos[] = [
  {
    id: 'consultar',
    titulo: 'Para consultar cuando se te olvide algo',
    resumen:
      'Nadie se acuerda de todo. Un programador con experiencia no es el que memorizó la sintaxis: es el que sabe dónde buscarla rápido.',
    recursos: [
      {
        nombre: 'MDN Web Docs',
        url: 'https://developer.mozilla.org/es/',
        descripcion:
          'La documentación oficial de HTML, CSS y JavaScript, escrita por Mozilla. Si una etiqueta o una función existe, aquí está explicada con ejemplos.',
        idioma: 'es',
        tipo: 'referencia',
        destacado: true,
      },
      {
        nombre: 'MDN — Aprende desarrollo web',
        url: 'https://developer.mozilla.org/es/docs/Learn_web_development',
        descripcion:
          'El mismo MDN pero en modo curso, de cero y en orden. Cubre casi todo nuestro cronograma con más profundidad.',
        idioma: 'es',
        tipo: 'referencia',
        sesiones: [5, 6, 9, 10],
      },
      {
        nombre: 'JavaScript.info en español',
        url: 'https://es.javascript.info/',
        descripcion:
          'El mejor tutorial de JavaScript moderno que hay gratis. Empieza desde variables y llega hasta promesas y clases, con ejercicios resueltos.',
        idioma: 'es',
        tipo: 'referencia',
        sesiones: [9, 10],
        destacado: true,
      },
      {
        nombre: 'Lenguaje JS — Manz',
        url: 'https://lenguajejs.com/',
        descripcion:
          'Manual de JavaScript en español, muy bien explicado y con buscador. Su hermano lenguajecss.com hace lo mismo con CSS.',
        idioma: 'es',
        tipo: 'referencia',
        sesiones: [6, 9, 10],
      },
      {
        nombre: 'DevDocs',
        url: 'https://devdocs.io/',
        descripcion:
          'Todas las documentaciones (HTML, CSS, JS, Node, Express, React, Mongo) en un solo buscador, y funciona sin internet una vez cargada.',
        idioma: 'en',
        tipo: 'herramienta',
      },
      {
        nombre: 'CSS Reference',
        url: 'https://cssreference.io/',
        descripcion:
          'Cada propiedad de CSS con una animación que muestra qué hace. Cuando no te acuerdes qué era align-items, míralo aquí.',
        idioma: 'en',
        tipo: 'referencia',
        sesiones: [6],
      },
      {
        nombre: 'Can I use',
        url: 'https://caniuse.com/',
        descripcion:
          '¿Esto funciona en el navegador de mi celular? Buscas la propiedad y te muestra qué navegadores la soportan.',
        idioma: 'en',
        tipo: 'referencia',
      },
    ],
  },

  {
    id: 'practicar',
    titulo: 'Para practicar hasta que salga solo',
    resumen:
      'Leer código no enseña a escribirlo. Estos sitios te ponen a resolver cosas pequeñas, con la respuesta a la mano si te atascas.',
    recursos: [
      {
        nombre: 'freeCodeCamp en español',
        url: 'https://www.freecodecamp.org/espanol/',
        descripcion:
          'Curso completo y gratuito, con certificados. Escribes el código en el navegador y te dice al instante si pasó la prueba.',
        idioma: 'es',
        tipo: 'practica',
        destacado: true,
      },
      {
        nombre: 'Flexbox Froggy',
        url: 'https://flexboxfroggy.com/#es',
        descripcion:
          'Un juego de 24 niveles para aprender Flexbox moviendo ranas a su nenúfar. En media hora te queda claro justify-content.',
        idioma: 'es',
        tipo: 'practica',
        sesiones: [6],
        destacado: true,
      },
      {
        nombre: 'Grid Garden',
        url: 'https://cssgridgarden.com/#es',
        descripcion:
          'Lo mismo que Froggy pero para CSS Grid: riegas zanahorias escribiendo grid-column y grid-row.',
        idioma: 'es',
        tipo: 'practica',
        sesiones: [6],
      },
      {
        nombre: 'CSS Diner',
        url: 'https://flukeout.github.io/',
        descripcion:
          'Practica selectores de CSS —los mismos que usa querySelector— sirviendo platos en un restaurante.',
        idioma: 'en',
        tipo: 'practica',
        sesiones: [6, 10],
      },
      {
        nombre: 'Learn Git Branching',
        url: 'https://learngitbranching.js.org/?locale=es_ES',
        descripcion:
          'Git visual e interactivo: escribes el comando y ves cómo se mueven las ramas. Es la forma más rápida de entender merge y rebase.',
        idioma: 'es',
        tipo: 'practica',
        sesiones: [4],
        destacado: true,
      },
      {
        nombre: 'Scratch',
        url: 'https://scratch.mit.edu/',
        descripcion:
          'Donde empezamos el curso. Sigue sirviendo para probar una idea de lógica en dos minutos sin escribir una línea.',
        idioma: 'es',
        tipo: 'practica',
        sesiones: [2, 3],
      },
      {
        nombre: 'Codewars',
        url: 'https://www.codewars.com/',
        descripcion:
          'Retos cortos de lógica ordenados por dificultad. Al resolver uno puedes ver cómo lo hicieron los demás, que es donde más se aprende.',
        idioma: 'en',
        tipo: 'practica',
        sesiones: [9],
      },
      {
        nombre: 'Exercism',
        url: 'https://exercism.org/tracks/javascript',
        descripcion:
          'Ejercicios de JavaScript con mentores humanos que te comentan el código gratis. Más lento que Codewars, pero enseña más.',
        idioma: 'en',
        tipo: 'practica',
        sesiones: [9],
      },
      {
        nombre: 'JavaScript30',
        url: 'https://javascript30.com/',
        descripcion:
          '30 proyectos pequeños de JavaScript con DOM puro, sin librerías. Es exactamente lo que practicamos en la sesión 10.',
        idioma: 'en',
        tipo: 'practica',
        sesiones: [10],
      },
      {
        nombre: 'Frontend Mentor',
        url: 'https://www.frontendmentor.io/challenges',
        descripcion:
          'Te dan el diseño terminado y tú lo construyes. Perfecto para practicar HTML y CSS con algo que se ve profesional.',
        idioma: 'en',
        tipo: 'practica',
        sesiones: [5, 6, 7],
      },
    ],
  },

  {
    id: 'ver',
    titulo: 'Para ver y seguir en español',
    resumen:
      'Canales que explican bien y en nuestro idioma. Sirven para repasar una sesión que se te enredó o para adelantarte.',
    recursos: [
      {
        nombre: 'midudev',
        url: 'https://www.youtube.com/@midudev',
        descripcion:
          'JavaScript y React explicados al día, con proyectos completos en vivo. Es la referencia en español para frontend moderno.',
        idioma: 'es',
        tipo: 'video',
        sesiones: [9, 16, 17, 18],
        destacado: true,
      },
      {
        nombre: 'Fazt Code',
        url: 'https://www.youtube.com/@FaztTech',
        descripcion:
          'Tutoriales de proyecto completo: Node, Express, MongoDB, React. Muy útil cuando llegues a la parte de backend.',
        idioma: 'es',
        tipo: 'video',
        sesiones: [11, 12, 13, 14],
      },
      {
        nombre: 'MoureDev',
        url: 'https://www.youtube.com/@mouredev',
        descripcion:
          'Cursos desde cero y consejos de carrera. Bueno si te preguntas cómo pasar de aprender a trabajar de esto.',
        idioma: 'es',
        tipo: 'video',
      },
      {
        nombre: 'HolaMundo',
        url: 'https://www.youtube.com/@HolaMundoDev',
        descripcion:
          'Explica los conceptos difíciles —asincronía, promesas, algoritmos— con mucha calma y buenas analogías.',
        idioma: 'es',
        tipo: 'video',
        sesiones: [10],
      },
      {
        nombre: 'jonmircha',
        url: 'https://www.youtube.com/@jonmircha',
        descripcion:
          'Cursos largos y ordenados de JavaScript, CSS y accesibilidad. Si quieres un curso entero y no un video suelto, aquí está.',
        idioma: 'es',
        tipo: 'video',
        sesiones: [6, 9],
      },
    ],
  },

  {
    id: 'herramientas',
    titulo: 'Para escribir y probar código',
    resumen:
      'Cosas que vas a abrir mientras trabajas: para probar una idea suelta, para mirar un JSON, para dibujar cómo va a ser algo.',
    recursos: [
      {
        nombre: 'CodePen',
        url: 'https://codepen.io/',
        descripcion:
          'HTML, CSS y JS en el navegador, con el resultado al lado. Ideal para probar una idea sin crear un proyecto entero.',
        idioma: 'en',
        tipo: 'herramienta',
        sesiones: [5, 6, 9, 10],
        destacado: true,
      },
      {
        nombre: 'StackBlitz',
        url: 'https://stackblitz.com/',
        descripcion:
          'Un proyecto completo de Node o React corriendo dentro del navegador, sin instalar nada. Sirve cuando no estás en tu computador.',
        idioma: 'en',
        tipo: 'herramienta',
        sesiones: [16, 17, 18],
      },
      {
        nombre: 'Visual Studio Code',
        url: 'https://code.visualstudio.com/',
        descripcion:
          'El editor que usamos en clase. Gratis, para Windows, Mac y Linux.',
        idioma: 'en',
        tipo: 'herramienta',
        sesiones: [1],
      },
      {
        nombre: 'Hoppscotch',
        url: 'https://hoppscotch.io/',
        descripcion:
          'Para probar tu API sin escribir una página: escribes la URL, eliges GET o POST y ves qué responde el servidor.',
        idioma: 'en',
        tipo: 'herramienta',
        sesiones: [11, 12, 13],
        destacado: true,
      },
      {
        nombre: 'JSON Crack',
        url: 'https://jsoncrack.com/editor',
        descripcion:
          'Pegas un JSON y te lo dibuja como un árbol. Muy útil para entender la respuesta de una API antes de programarla.',
        idioma: 'en',
        tipo: 'herramienta',
        sesiones: [10, 11],
      },
      {
        nombre: 'regex101',
        url: 'https://regex101.com/',
        descripcion:
          'Prueba expresiones regulares y te explica en palabras qué hace cada parte. Con eso dejan de dar miedo.',
        idioma: 'en',
        tipo: 'herramienta',
      },
      {
        nombre: 'Excalidraw',
        url: 'https://excalidraw.com/',
        descripcion:
          'Pizarra para dibujar cómo va a funcionar algo antes de escribirlo. Dibujar el plan ahorra horas de código.',
        idioma: 'en',
        tipo: 'herramienta',
        sesiones: [22],
      },
      {
        nombre: 'Squoosh',
        url: 'https://squoosh.app/',
        descripcion:
          'Comprime imágenes en el navegador. Una foto de 4 MB en tu sitio lo vuelve lentísimo; aquí baja a 200 KB sin verse mal.',
        idioma: 'en',
        tipo: 'herramienta',
        sesiones: [7],
      },
    ],
  },

  {
    id: 'atascado',
    titulo: 'Cuando algo no funciona',
    resumen:
      'Atascarse es parte del trabajo, no señal de que no sirves para esto. Lo que cambia es cuánto tardas en salir.',
    recursos: [
      {
        nombre: 'Stack Overflow en español',
        url: 'https://es.stackoverflow.com/',
        descripcion:
          'Casi cualquier error que veas ya le pasó a alguien y está preguntado aquí. Busca el mensaje de error tal cual, entre comillas.',
        idioma: 'es',
        tipo: 'referencia',
        destacado: true,
      },
      {
        nombre: 'MDN — Errores de JavaScript',
        url: 'https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Errors',
        descripcion:
          'La lista de los mensajes de error de JavaScript, uno por uno, con qué significan y cómo se arreglan.',
        idioma: 'es',
        tipo: 'referencia',
        sesiones: [9, 10],
      },
      {
        nombre: 'DevTools de Chrome',
        url: 'https://developer.chrome.com/docs/devtools?hl=es',
        descripcion:
          'Cómo usar la consola, el inspector y la pestaña Network. Aprender esto bien te vuelve el doble de rápido depurando.',
        idioma: 'es',
        tipo: 'referencia',
        sesiones: [10],
        destacado: true,
      },
    ],
  },

  {
    id: 'diseno',
    titulo: 'Para que se vea bien',
    resumen:
      'Un proyecto que funciona pero se ve descuidado se defiende peor. Estos sitios resuelven color, tipografía e íconos sin ser diseñador.',
    recursos: [
      {
        nombre: 'Google Fonts',
        url: 'https://fonts.google.com/',
        descripcion:
          'Tipografías gratis y libres de usar, con el código para pegar en tu HTML. Cambiar la fuente es lo que más rápido mejora un sitio.',
        idioma: 'en',
        tipo: 'servicio',
        sesiones: [6, 7],
      },
      {
        nombre: 'Coolors',
        url: 'https://coolors.co/',
        descripcion:
          'Genera paletas de color con la barra espaciadora. Elige tres o cuatro colores y no más: los sitios feos suelen tener demasiados.',
        idioma: 'en',
        tipo: 'herramienta',
        sesiones: [6],
      },
      {
        nombre: 'Lucide',
        url: 'https://lucide.dev/icons/',
        descripcion:
          'Íconos gratis y coherentes entre sí, en SVG. Copias el código y lo pegas en tu HTML.',
        idioma: 'en',
        tipo: 'servicio',
      },
      {
        nombre: 'Unsplash',
        url: 'https://unsplash.com/es',
        descripcion:
          'Fotos gratis de buena calidad, con permiso de uso. Sirve para llenar tu proyecto sin robar imágenes de Google.',
        idioma: 'es',
        tipo: 'servicio',
        sesiones: [7],
      },
      {
        nombre: 'Verificador de contraste de WebAIM',
        url: 'https://webaim.org/resources/contrastchecker/',
        descripcion:
          'Le das dos colores y te dice si el texto se lee de verdad. Un gris bonito sobre blanco puede ser ilegible para mucha gente.',
        idioma: 'en',
        tipo: 'herramienta',
        sesiones: [6],
      },
    ],
  },

  {
    id: 'proyecto',
    titulo: 'Para tu proyecto: backend, React y publicar',
    resumen:
      'La documentación oficial de lo que usamos en la segunda mitad del curso, más los servicios donde vas a publicar.',
    recursos: [
      {
        nombre: 'Node.js',
        url: 'https://nodejs.org/es',
        descripcion:
          'De aquí se descarga Node. Instala siempre la versión que dice LTS: es la estable.',
        idioma: 'es',
        tipo: 'servicio',
        sesiones: [11],
      },
      {
        nombre: 'Express',
        url: 'https://expressjs.com/es/',
        descripcion:
          'La guía oficial de Express en español: rutas, middleware y manejo de errores.',
        idioma: 'es',
        tipo: 'referencia',
        sesiones: [12],
      },
      {
        nombre: 'MongoDB Atlas',
        url: 'https://www.mongodb.com/atlas',
        descripcion:
          'Base de datos MongoDB en la nube, con un plan gratuito que alcanza de sobra para el proyecto del curso.',
        idioma: 'en',
        tipo: 'servicio',
        sesiones: [13, 14],
      },
      {
        nombre: 'Mongoose',
        url: 'https://mongoosejs.com/docs/guide.html',
        descripcion:
          'Documentación de esquemas, validaciones y consultas: lo que usamos para hablarle a Mongo desde Node.',
        idioma: 'en',
        tipo: 'referencia',
        sesiones: [14],
      },
      {
        nombre: 'React',
        url: 'https://es.react.dev/learn',
        descripcion:
          'La documentación oficial de React en español, reescrita hace poco y con ejemplos editables en la misma página.',
        idioma: 'es',
        tipo: 'referencia',
        sesiones: [16, 17],
        destacado: true,
      },
      {
        nombre: 'React Router',
        url: 'https://reactrouter.com/',
        descripcion:
          'Cómo se arman las rutas de una aplicación de React. Es lo mismo que hace funcionar esta guía que estás leyendo.',
        idioma: 'en',
        tipo: 'referencia',
        sesiones: [18],
      },
      {
        nombre: 'Vite',
        url: 'https://vite.dev/guide/',
        descripcion:
          'La herramienta que arranca el proyecto y lo compila para publicarlo. Un comando para desarrollar y otro para construir.',
        idioma: 'en',
        tipo: 'referencia',
        sesiones: [16, 24],
      },
      {
        nombre: 'Vercel',
        url: 'https://vercel.com/',
        descripcion:
          'Publica tu sitio conectando el repositorio de GitHub: cada push queda en línea solo. Plan gratuito generoso.',
        idioma: 'en',
        tipo: 'servicio',
        sesiones: [7, 24],
        destacado: true,
      },
      {
        nombre: 'Netlify',
        url: 'https://www.netlify.com/',
        descripcion:
          'Alternativa a Vercel, con la misma idea. Muy bueno para sitios de HTML y CSS puro.',
        idioma: 'en',
        tipo: 'servicio',
        sesiones: [7, 24],
      },
      {
        nombre: 'Render',
        url: 'https://render.com/',
        descripcion:
          'Para publicar el backend de Node, no solo la parte visual. Tiene plan gratuito con la máquina que se duerme si nadie entra.',
        idioma: 'en',
        tipo: 'servicio',
        sesiones: [24],
      },
      {
        nombre: 'GitHub Pages',
        url: 'https://pages.github.com/',
        descripcion:
          'Publica un sitio estático directo desde tu repositorio, sin cuenta en ningún otro lado.',
        idioma: 'en',
        tipo: 'servicio',
        sesiones: [7],
      },
    ],
  },

  {
    id: 'ia',
    titulo: 'Inteligencia artificial, usada bien',
    resumen:
      'La IA sirve para explicarte un error o discutir una idea. Copiar y pegar sin entender es lo único que no vale — en clase y en el trabajo.',
    recursos: [
      {
        nombre: 'Claude',
        url: 'https://claude.ai/',
        descripcion:
          'Pídele que te explique un error línea por línea, o que revise tu código y te diga qué mejorarías. No le pidas la tarea hecha.',
        idioma: 'es',
        tipo: 'servicio',
        sesiones: [1, 20, 21],
        destacado: true,
      },
      {
        nombre: 'Guía de prompting',
        url: 'https://www.promptingguide.ai/es',
        descripcion:
          'Cómo pedirle bien las cosas a un modelo de lenguaje: dar contexto, dar ejemplos, pedir el formato de la respuesta.',
        idioma: 'es',
        tipo: 'referencia',
        sesiones: [1, 20],
      },
      {
        nombre: 'GitHub Copilot para estudiantes',
        url: 'https://education.github.com/pack',
        descripcion:
          'El paquete de estudiante de GitHub regala herramientas de pago, Copilot entre ellas, si compruebas que estudias.',
        idioma: 'en',
        tipo: 'servicio',
        sesiones: [20],
      },
    ],
  },
];

/** Todos los recursos en una sola lista — para buscar y para contar. */
export const RECURSOS: Recurso[] = GRUPOS.flatMap((grupo) => grupo.recursos);

/** El dominio, que es lo que la gente reconoce de un enlace. */
export function dominioDe(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

export const ETIQUETA_TIPO: Record<TipoRecurso, string> = {
  referencia: 'Referencia',
  practica: 'Práctica',
  video: 'Video',
  herramienta: 'Herramienta',
  servicio: 'Servicio',
};
