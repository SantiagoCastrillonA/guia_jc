import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { enter } from '../lib/motion';
import styles from './MenuAcciones.module.css';

export interface Accion {
  texto: string;
  onElegir: () => void;
  /** Pinta la acción como destructiva. */
  peligro?: boolean;
}

interface Props {
  acciones: Accion[];
  /** De quién son estas acciones, para el lector de pantalla. */
  etiqueta: string;
}

/**
 * El menú «···» de cada fila.
 *
 * Cinco botones en fila ensuciaban la tabla; el diseño los recoge aquí. Se
 * cierra al elegir, con Escape, o al hacer clic fuera. El panel se ancla al
 * botón que lo abrió, así que crece desde él y no desde su propio centro.
 */
export function MenuAcciones({ acciones, etiqueta }: Props) {
  const [abierto, setAbierto] = useState(false);
  const caja = useRef<HTMLDivElement>(null);
  const disparador = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();
  const id = useId();

  useEffect(() => {
    if (!abierto) return;

    const alTocarFuera = (e: PointerEvent) => {
      if (!caja.current?.contains(e.target as Node)) setAbierto(false);
    };
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAbierto(false);
        disparador.current?.focus(); // el foco vuelve de donde salió
      }
    };

    document.addEventListener('pointerdown', alTocarFuera);
    document.addEventListener('keydown', alTeclear);
    return () => {
      document.removeEventListener('pointerdown', alTocarFuera);
      document.removeEventListener('keydown', alTeclear);
    };
  }, [abierto]);

  return (
    <div className={styles.caja} ref={caja}>
      <button
        type="button"
        ref={disparador}
        className={styles.disparador}
        aria-label={`Acciones de ${etiqueta}`}
        aria-haspopup="menu"
        aria-expanded={abierto}
        aria-controls={abierto ? id : undefined}
        onClick={() => setAbierto((v) => !v)}
      >
        <Puntos />
      </button>

      <AnimatePresence>
        {abierto && (
          <motion.div
            id={id}
            role="menu"
            className={styles.panel}
            initial={{ opacity: 0, transform: reduce ? 'none' : 'scale(0.96)' }}
            animate={{ opacity: 1, transform: 'scale(1)' }}
            exit={{ opacity: 0, transform: reduce ? 'none' : 'scale(0.97)' }}
            transition={reduce ? { duration: 0 } : enter}
          >
            {acciones.map((accion) => (
              <button
                key={accion.texto}
                type="button"
                role="menuitem"
                className={accion.peligro ? `${styles.opcion} ${styles.peligro}` : styles.opcion}
                onClick={() => {
                  setAbierto(false);
                  accion.onElegir();
                }}
              >
                {accion.texto}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Puntos(): ReactNode {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" fill="currentColor" aria-hidden="true">
      <circle cx="3" cy="8" r="1.4" />
      <circle cx="8" cy="8" r="1.4" />
      <circle cx="13" cy="8" r="1.4" />
    </svg>
  );
}
