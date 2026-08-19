import type { ComponentType } from 'react';

export type Level = 'inicial' | 'intermedio' | 'avanzado';

/** Los módulos del cronograma del curso, en orden. */
export const MODULES = [
  'Introducción a la IA',
  'Lógica de Programación',
  'Git',
  'Fundamentos Web',
  'JavaScript',
  'Backend',
  'React',
  'IA en Desarrollo',
  'Proyecto Integrador',
] as const;

export type Module = (typeof MODULES)[number];

/**
 * Un tema = una sesión del cronograma = una subpágina.
 * Agregar un tema es crear una carpeta en `src/topics/` y una entrada en
 * `src/data/topics.ts`; nada más en la app conoce la lista.
 */
export interface Topic {
  /** Segmento de URL: /tema/:slug */
  slug: string;
  /** Número de sesión en el cronograma. */
  session: number;
  module: Module;
  title: string;
  /** Una o dos frases: se muestran en la tarjeta y en el encabezado del tema. */
  summary: string;
  level: Level;
  /** Cuántos ejercicios interactivos tiene la página. */
  exercises: number;
  /** Los temas anunciados sin página todavía se ven deshabilitados. */
  published: boolean;
  /** Carga diferida: el código del tema solo viaja cuando se visita su ruta. */
  Page?: ComponentType;
}
