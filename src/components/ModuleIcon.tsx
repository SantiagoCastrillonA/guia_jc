import type { ReactNode } from 'react';
import type { Module } from '../types';

interface Props {
  module: Module;
  className?: string;
}

/**
 * Un ícono de trazo por módulo — mismo lenguaje que el resto de Nocturne
 * (el acento como línea, nunca como relleno grande). Puramente decorativo.
 */
export function ModuleIcon({ module, className }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {PATHS[module]}
    </svg>
  );
}

const PATHS: Record<Module, ReactNode> = {
  // chispa — introducción al tema
  'Introducción a la IA': (
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6.5 6.5l2 2M15.5 15.5l2 2M17.5 6.5l-2 2M6.5 17.5l2-2" />
  ),
  // nodo de decisión — lógica
  'Lógica de Programación': (
    <>
      <path d="M12 3l5 5-5 5-5-5z" />
      <path d="M12 13v3M9 19h6" />
    </>
  ),
  // rama — control de versiones
  Git: (
    <>
      <circle cx="6" cy="6" r="2" />
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="12" r="2" />
      <path d="M6 8v8M8 7c4 0 4 5 8 5" />
    </>
  ),
  // </> — la web
  'Fundamentos Web': <path d="M8 6L3 12l5 6M16 6l5 6-5 6" />,
  // { } — el lenguaje
  JavaScript: (
    <path d="M9 4c-2 0-3 1-3 3v2.5c0 1.2-.9 2.2-2 2.5 1.1.3 2 1.3 2 2.5V17c0 2 1 3 3 3M15 4c2 0 3 1 3 3v2.5c0 1.2.9 2.2 2 2.5-1.1.3-2 1.3-2 2.5V17c0 2-1 3-3 3" />
  ),
  // capas — el servidor
  Backend: (
    <>
      <rect x="4" y="4" width="16" height="4.5" rx="1" />
      <rect x="4" y="10" width="16" height="4.5" rx="1" />
      <rect x="4" y="15.5" width="16" height="4.5" rx="1" />
    </>
  ),
  // órbitas — componentes
  React: (
    <>
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(120 12 12)" />
    </>
  ),
  // chip — IA aplicada
  'IA en Desarrollo': (
    <>
      <rect x="8" y="8" width="8" height="8" rx="1" />
      <path d="M12 3.5v3.5M12 17v3.5M3.5 12H7M17 12h3.5M6.8 6.8l1.8 1.8M15.4 15.4l1.8 1.8M17.2 6.8l-1.8 1.8M6.8 17.2l1.8-1.8" />
    </>
  ),
  // bandera — cierre del curso
  'Proyecto Integrador': (
    <>
      <path d="M6 3v18" />
      <path d="M6 4h11l-3 3.5L17 11H6" />
    </>
  ),
};
