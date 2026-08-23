import { useCallback, useEffect, useState } from 'react';

/**
 * Tema claro u oscuro.
 *
 * Tres estados, como manda el patrón: sin elección propia el tema sigue a
 * `prefers-color-scheme` y no se escribe nada en <html>, así que las media
 * queries de `styles/temas.css` deciden. En cuanto alguien toca el botón, la
 * elección se marca en `data-theme` y se guarda — a partir de ahí manda sobre
 * el sistema.
 *
 * El primer valor lo pinta un script en index.html antes del primer frame:
 * sin eso, quien haya elegido claro ve un fogonazo oscuro al cargar.
 */

export type Tema = 'light' | 'dark';

const CLAVE = 'jc:tema';

/** El color de la barra del navegador en móvil, por tema. */
const CROMO: Record<Tema, string> = { light: '#f5f5f7', dark: '#161826' };

function leerGuardado(): Tema | null {
  try {
    const valor = localStorage.getItem(CLAVE);
    return valor === 'light' || valor === 'dark' ? valor : null;
  } catch {
    return null; // modo privado: el tema no se recuerda, pero funciona
  }
}

function temaDelSistema(): Tema {
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export function useTema() {
  const [elegido, setElegido] = useState<Tema | null>(() => leerGuardado());
  const [delSistema, setDelSistema] = useState<Tema>(temaDelSistema);

  const tema = elegido ?? delSistema;

  // Sin elección propia el tema sigue al sistema aunque el usuario lo cambie
  // con la página abierta.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const alCambiar = () => setDelSistema(mq.matches ? 'light' : 'dark');
    mq.addEventListener('change', alCambiar);
    return () => mq.removeEventListener('change', alCambiar);
  }, []);

  useEffect(() => {
    const raiz = document.documentElement;
    if (elegido) raiz.dataset.theme = elegido;
    else delete raiz.dataset.theme;
  }, [elegido]);

  useEffect(() => {
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', CROMO[tema]);
  }, [tema]);

  const alternar = useCallback(() => {
    const siguiente: Tema = tema === 'dark' ? 'light' : 'dark';
    setElegido(siguiente);
    try {
      localStorage.setItem(CLAVE, siguiente);
    } catch {
      // sin almacenamiento: vale para esta visita
    }
  }, [tema]);

  return { tema, alternar };
}
