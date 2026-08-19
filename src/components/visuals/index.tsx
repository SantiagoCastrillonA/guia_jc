import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { STAGGER, enter } from '../../lib/motion';
import styles from './Visual.module.css';

/**
 * Piezas visuales para las lecciones: figuras, pasos, notas y comparaciones.
 *
 * Todas entran al hacer scroll con un desplazamiento corto y una sola vez
 * (`once`), nunca en bucle: el movimiento sirve para guiar la lectura, no
 * para adornar. Con `prefers-reduced-motion` queda solo el fundido.
 */

function useReveal() {
  const reduce = useReducedMotion();
  return {
    initial: { opacity: 0, transform: reduce ? 'none' : 'translateY(10px)' },
    whileInView: { opacity: 1, transform: 'translateY(0px)' },
    viewport: { once: true, amount: 0.25 },
    transition: enter,
  } as const;
}

interface FigureProps {
  children: ReactNode;
  caption?: ReactNode;
  label?: string;
}

/** Marco de una ilustración SVG, con su descripción debajo. */
export function Figure({ children, caption, label }: FigureProps) {
  const reveal = useReveal();
  return (
    <motion.figure className={styles.figure} role="img" aria-label={label} {...reveal}>
      {children}
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </motion.figure>
  );
}

/** Lista de pasos numerados: la explicación de un procedimiento. */
export function Steps({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.ol
      className={styles.steps}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.1 }}
      variants={{ shown: { transition: { staggerChildren: reduce ? 0 : STAGGER } } }}
    >
      {children}
    </motion.ol>
  );
}

export function Step({ title, children }: { title: string; children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.li
      className={styles.step}
      variants={{
        hidden: { opacity: 0, transform: reduce ? 'none' : 'translateY(8px)' },
        shown: { opacity: 1, transform: 'translateY(0px)', transition: enter },
      }}
    >
      <h4 className={styles.stepTitle}>{title}</h4>
      <div className={styles.stepBody}>{children}</div>
    </motion.li>
  );
}

interface CalloutProps {
  children: ReactNode;
  tipo?: 'idea' | 'ojo';
  mark?: string;
}

/** Nota corta: una idea que conviene recordar, o una advertencia. */
export function Callout({ children, tipo = 'idea', mark }: CalloutProps) {
  const reveal = useReveal();
  return (
    <motion.aside
      className={`${styles.callout} ${tipo === 'ojo' ? styles.calloutWarn : ''}`}
      {...reveal}
    >
      <span className={styles.calloutMark} aria-hidden="true">
        {mark ?? (tipo === 'ojo' ? '⚠' : '◆')}
      </span>
      <div className={styles.calloutBody}>{children}</div>
    </motion.aside>
  );
}

interface CompareProps {
  bien: { titulo: string; items: ReactNode[] };
  mal: { titulo: string; items: ReactNode[] };
}

/** Dos columnas: lo que se hace y lo que no. */
export function Compare({ bien, mal }: CompareProps) {
  const reveal = useReveal();
  return (
    <motion.div className={styles.compare} {...reveal}>
      <div className={`${styles.compareCol} ${styles.compareGood}`}>
        <p className={styles.compareHead}>✓ {bien.titulo}</p>
        <ul className={styles.compareList}>
          {bien.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
      <div className={styles.compareCol}>
        <p className={styles.compareHead}>✕ {mal.titulo}</p>
        <ul className={styles.compareList}>
          {mal.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

interface RefTableProps {
  cabeceras: string[];
  filas: ReactNode[][];
}

/** Tabla de referencia rápida (etiquetas, comandos, operadores). */
export function RefTable({ cabeceras, filas }: RefTableProps) {
  const reveal = useReveal();
  return (
    <motion.div className={styles.refTable} {...reveal}>
      <table className="table">
        <thead>
          <tr>
            {cabeceras.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map((fila, i) => (
            <tr key={i}>
              {fila.map((celda, j) => (
                <td key={j}>{celda}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}

interface TerminalProps {
  titulo?: string;
  /** Cada línea: si empieza con "$" se pinta el prompt; con "#", comentario. */
  lineas: string[];
}

/** Bloque de terminal, para los comandos que se escriben en clase. */
export function Terminal({ titulo = 'Terminal', lineas }: TerminalProps) {
  const reveal = useReveal();
  return (
    <motion.div className={styles.terminal} {...reveal}>
      <div className={styles.terminalBar}>{titulo}</div>
      <pre className={styles.terminalBody}>
        <code>
          {lineas.map((linea, i) => {
            const esComando = linea.startsWith('$');
            const esComentario = linea.trimStart().startsWith('#');
            return (
              <span key={i}>
                {esComando ? (
                  <>
                    <span className={styles.prompt}>$ </span>
                    {linea.slice(1).trimStart()}
                  </>
                ) : esComentario ? (
                  <span className={styles.comment}>{linea}</span>
                ) : (
                  linea
                )}
                {i < lineas.length - 1 ? '\n' : ''}
              </span>
            );
          })}
        </code>
      </pre>
    </motion.div>
  );
}
