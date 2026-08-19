import { lazy } from 'react';
import { MODULES, type Module, type Topic } from '../types';

/**
 * El registro de temas — la única fuente de verdad de la app.
 *
 * Sigue el cronograma del curso de Desarrollo Web (25 sesiones). Las sesiones
 * sin página todavía viven aquí con `published: false`: se ven en la home como
 * "próximamente" y no generan ruta.
 *
 * Para publicar un tema:
 *   1. crear `src/topics/<slug>/index.tsx` con un componente por defecto
 *      construido sobre <TopicPage slug="<slug>">
 *   2. en su entrada de abajo: poner `published: true`, la cantidad real de
 *      ejercicios y `Page: lazy(() => import('../topics/<slug>'))`
 */
export const topics: Topic[] = [
  {
    slug: 'introduccion-ia',
    session: 1,
    module: 'Introducción a la IA',
    title: 'Introducción a la IA',
    summary:
      'Qué es realmente la IA, cómo predice un modelo de lenguaje, y cómo escribir prompts que sirvan — con las reglas de uso responsable del curso.',
    level: 'inicial',
    exercises: 18,
    published: true,
    Page: lazy(() => import('../topics/introduccion-ia')),
  },
  {
    slug: 'logica-scratch-1',
    session: 2,
    module: 'Lógica de Programación',
    title: 'Lógica de programación con Scratch',
    summary:
      'Los cuatro bloques de todo programa —secuencia, variable, condicional y bucle— armando un semáforo y un dado, antes de escribir una sola línea de código.',
    level: 'inicial',
    exercises: 18,
    published: true,
    Page: lazy(() => import('../topics/logica-scratch-1')),
  },
  {
    slug: 'logica-scratch-2',
    session: 3,
    module: 'Lógica de Programación',
    title: 'Scratch parte 2: física, clones y colisiones',
    summary:
      'Un clon de Geometry Dash: gravedad con variables, salto con eventos, obstáculos con clones y game over con colisiones.',
    level: 'inicial',
    exercises: 19,
    published: true,
    Page: lazy(() => import('../topics/logica-scratch-2')),
  },
  {
    slug: 'git-y-trabajo-en-equipo',
    session: 4,
    module: 'Git',
    title: 'Git y trabajo en equipo',
    summary:
      'Las cuatro zonas de Git, el flujo init → add → commit → push, mensajes de commit que sirven, y ramas para trabajar sin pisar a nadie.',
    level: 'inicial',
    exercises: 19,
    published: true,
    Page: lazy(() => import('../topics/git-y-trabajo-en-equipo')),
  },
  {
    slug: 'html-semantico',
    session: 5,
    module: 'Fundamentos Web',
    title: 'HTML semántico',
    summary:
      'La estructura de una página con etiquetas que significan algo: header, nav, main, section, article y footer, más las tres reglas de accesibilidad.',
    level: 'inicial',
    exercises: 19,
    published: true,
    Page: lazy(() => import('../topics/html-semantico')),
  },
  {
    slug: 'css-box-model-flexbox',
    session: 6,
    module: 'Fundamentos Web',
    title: 'CSS: box model, Flexbox y Grid',
    summary:
      'Darle identidad a la página: selectores, el box model con demo interactiva, variables de marca, Flexbox para probar en vivo, Grid y responsive.',
    level: 'inicial',
    exercises: 20,
    published: true,
    Page: lazy(() => import('../topics/css-box-model-flexbox')),
  },
  {
    slug: 'sitio-estatico-deploy',
    session: 7,
    module: 'Fundamentos Web',
    title: 'Sitio estático completo y deploy',
    summary:
      'Publicar el sitio en internet: rutas relativas, nombres exactos, auditoría previa y lanzamiento en Netlify o GitHub Pages.',
    level: 'inicial',
    exercises: 19,
    published: true,
    Page: lazy(() => import('../topics/sitio-estatico-deploy')),
  },
  {
    slug: 'repaso-html-css-git',
    session: 8,
    module: 'Fundamentos Web',
    title: 'Repaso: HTML, CSS, Git e IA',
    summary:
      'El mapa de las siete primeras sesiones, las confusiones que más se repiten y 20 ejercicios mezclados antes de entrar a JavaScript.',
    level: 'inicial',
    exercises: 20,
    published: true,
    Page: lazy(() => import('../topics/repaso-html-css-git')),
  },
  {
    slug: 'js-variables-tipos-operadores',
    session: 9,
    module: 'JavaScript',
    title: 'JavaScript: variables, tipos y operadores',
    summary:
      'Guardar datos con let y const, reconocer el tipo de cada valor y entender qué hace JavaScript cuando se mezclan tipos distintos.',
    level: 'inicial',
    exercises: 19,
    published: true,
    Page: lazy(() => import('../topics/js-variables-tipos-operadores')),
  },
  {
    slug: 'dom-eventos-apis',
    session: 10,
    module: 'JavaScript',
    title: 'DOM, eventos, APIs y Node.js',
    summary: 'Que el código controle lo que el usuario ve: seleccionar elementos, escuchar eventos y traer datos.',
    level: 'intermedio',
    exercises: 20,
    published: true,
    Page: lazy(() => import('../topics/dom-eventos-apis')),
  },
  {
    slug: 'api-sencilla-node',
    session: 11,
    module: 'JavaScript',
    title: 'API sencilla con Node.js',
    summary: 'Primer servidor propio: responder peticiones y devolver JSON.',
    level: 'intermedio',
    exercises: 20,
    published: true,
    Page: lazy(() => import('../topics/api-sencilla-node')),
  },
  {
    slug: 'express-rutas-middleware',
    session: 12,
    module: 'Backend',
    title: 'Express: rutas, middleware y JSON',
    summary: 'Organizar el servidor con Express: rutas, middleware y respuestas JSON.',
    level: 'intermedio',
    exercises: 20,
    published: true,
    Page: lazy(() => import('../topics/express-rutas-middleware')),
  },
  {
    slug: 'mongodb-crud',
    session: 13,
    module: 'Backend',
    title: 'MongoDB: instalación y CRUD',
    summary: 'Guardar datos de verdad: crear, leer, actualizar y borrar documentos.',
    level: 'intermedio',
    exercises: 20,
    published: true,
    Page: lazy(() => import('../topics/mongodb-crud')),
  },
  {
    slug: 'mongoose-esquemas',
    session: 14,
    module: 'Backend',
    title: 'Mongoose: esquemas y validaciones',
    summary: 'Darle forma y reglas a los datos antes de que lleguen a la base.',
    level: 'intermedio',
    exercises: 20,
    published: true,
    Page: lazy(() => import('../topics/mongoose-esquemas')),
  },
  {
    slug: 'todo-app-login',
    session: 15,
    module: 'Backend',
    title: 'Todo App con login',
    summary: 'Reto integrador de backend: autenticación y CRUD sobre datos propios.',
    level: 'intermedio',
    exercises: 20,
    published: true,
    Page: lazy(() => import('../topics/todo-app-login')),
  },
  {
    slug: 'react-componentes-props-state',
    session: 16,
    module: 'React',
    title: 'React: componentes, JSX, props y state',
    summary: 'Partir la interfaz en piezas reutilizables y que reaccionen a los datos.',
    level: 'intermedio',
    exercises: 20,
    published: true,
    Page: lazy(() => import('../topics/react-componentes-props-state')),
  },
  {
    slug: 'react-hooks',
    session: 17,
    module: 'React',
    title: 'Hooks: useState y useEffect',
    summary: 'Estado y efectos: cómo un componente recuerda cosas y habla con el mundo exterior.',
    level: 'intermedio',
    exercises: 20,
    published: true,
    Page: lazy(() => import('../topics/react-hooks')),
  },
  {
    slug: 'react-router',
    session: 18,
    module: 'React',
    title: 'React Router: navegación en SPA',
    summary: 'Varias pantallas en una sola aplicación, sin recargar la página.',
    level: 'intermedio',
    exercises: 20,
    published: true,
    Page: lazy(() => import('../topics/react-router')),
  },
  {
    slug: 'reto-todo-app-react',
    session: 19,
    module: 'React',
    title: 'Reto integrador: Todo App con login y CRUD',
    summary: 'Unir frontend y backend en una aplicación completa.',
    level: 'avanzado',
    exercises: 20,
    published: true,
    Page: lazy(() => import('../topics/reto-todo-app-react')),
  },
  {
    slug: 'ia-en-desarrollo',
    session: 20,
    module: 'IA en Desarrollo',
    title: 'IA en desarrollo',
    summary: 'Usar la IA como herramienta real de trabajo: prompts útiles, revisión crítica y límites.',
    level: 'intermedio',
    exercises: 0,
    published: false,
  },
  {
    slug: 'apis-de-ia',
    session: 21,
    module: 'IA en Desarrollo',
    title: 'APIs de IA desde el backend',
    summary: 'Consumir una API de IA desde el servidor y devolver el resultado a la interfaz.',
    level: 'avanzado',
    exercises: 0,
    published: false,
  },
  {
    slug: 'proyecto-inicio',
    session: 22,
    module: 'Proyecto Integrador',
    title: 'Proyecto integrador: inicio',
    summary: 'Planear el proyecto final: alcance, pantallas y datos.',
    level: 'avanzado',
    exercises: 0,
    published: false,
  },
  {
    slug: 'proyecto-backend',
    session: 23,
    module: 'Proyecto Integrador',
    title: 'Proyecto integrador: backend',
    summary: 'Rutas, base de datos y autenticación del proyecto final.',
    level: 'avanzado',
    exercises: 0,
    published: false,
  },
  {
    slug: 'proyecto-cierre-deploy',
    session: 24,
    module: 'Proyecto Integrador',
    title: 'Proyecto integrador: cierre y deploy',
    summary: 'Dejar el proyecto publicado, funcionando y presentable.',
    level: 'avanzado',
    exercises: 0,
    published: false,
  },
  {
    slug: 'defensa-de-proyectos',
    session: 25,
    module: 'Proyecto Integrador',
    title: 'Defensa de proyectos',
    summary: 'Presentar el emprendimiento digital: qué hace, cómo se construyó y qué sigue.',
    level: 'avanzado',
    exercises: 0,
    published: false,
  },
];

export function getTopic(slug: string): Topic | undefined {
  return topics.find((topic) => topic.slug === slug);
}

export const publishedTopics = () => topics.filter((topic) => topic.published && topic.Page);

/** Total de ejercicios publicados — la banda de cifras de la home. */
export const totalExercises = () =>
  topics.reduce((sum, topic) => sum + (topic.published ? topic.exercises : 0), 0);

/** Los temas agrupados por módulo, en el orden del cronograma. */
export function topicsByModule(): { module: Module; topics: Topic[] }[] {
  return MODULES.map((module) => ({
    module,
    topics: topics.filter((topic) => topic.module === module),
  })).filter((group) => group.topics.length > 0);
}

/** El rótulo corto de un tema: "Sesión 09 · JavaScript". */
export const topicKicker = (topic: Topic) =>
  `Sesión ${String(topic.session).padStart(2, '0')} · ${topic.module}`;
