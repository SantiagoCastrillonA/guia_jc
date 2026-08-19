import { useMemo, useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { useExerciseContext } from './context';
import { ExerciseShell, Feedback, type Verdict } from './ExerciseShell';
import { settle, springy } from '../../lib/motion';
import styles from './Exercise.module.css';

// ── Completar el espacio en blanco ────────────────────────────────────────

interface FillBlankProps {
  id: string;
  index: number;
  title: string;
  prompt?: ReactNode;
  /** El código con `___` donde va el hueco (uno solo por ejercicio). */
  code: string;
  /** Fichas para elegir. Solo una es la correcta. */
  options: string[];
  answer: string;
  explanation: ReactNode;
  hint?: ReactNode;
}

/** Un hueco en el código y fichas para llenarlo. Se corrige al soltar la ficha. */
export function FillBlank({
  id,
  index,
  title,
  prompt,
  code,
  options,
  answer,
  explanation,
  hint,
}: FillBlankProps) {
  const { solved, markSolved } = useExerciseContext();
  const reduce = useReducedMotion();
  const isSolved = solved.includes(id);
  const [picked, setPicked] = useState<string | null>(null);

  const verdict: Verdict = picked === null ? null : picked === answer ? 'ok' : 'no';
  const [antes, despues] = useMemo(() => {
    const at = code.indexOf('___');
    return at === -1 ? [code, ''] : [code.slice(0, at), code.slice(at + 3)];
  }, [code]);

  function choose(value: string) {
    setPicked(value);
    if (value === answer) markSolved(id);
  }

  return (
    <ExerciseShell id={id} index={index} title={title} prompt={prompt} solved={isSolved}>
      <pre className={styles.code}>
        <code className={styles.blankCode}>
          {antes}
          <motion.span
            className={`${styles.blank} ${picked ? styles.blankFilled : ''}`}
            // La ficha aterriza en el hueco: pequeño rebote, solo al colocarla.
            animate={picked && !reduce ? { transform: ['scale(0.92)', 'scale(1)'] } : undefined}
            transition={springy}
          >
            {picked ?? '?'}
          </motion.span>
          {despues}
        </code>
      </pre>

      <div className={styles.chips}>
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className={`${styles.chip} ${picked === option ? styles.chipUsed : ''}`}
            onClick={() => choose(option)}
            disabled={verdict === 'ok'}
          >
            {option}
          </button>
        ))}
      </div>

      <Feedback verdict={verdict}>
        {verdict === 'ok' ? explanation : (hint ?? 'Esa no encaja. Prueba con otra.')}
      </Feedback>
    </ExerciseShell>
  );
}

// ── Emparejar ─────────────────────────────────────────────────────────────

export interface Pair {
  id: string;
  izquierda: ReactNode;
  derecha: ReactNode;
}

interface MatchPairsProps {
  id: string;
  index: number;
  title: string;
  prompt?: ReactNode;
  /** Cada pareja: el componente baraja la columna derecha. */
  pairs: Pair[];
  explanation: ReactNode;
  hint?: ReactNode;
}

/** Dos columnas: se toca a la izquierda y luego su pareja a la derecha. */
export function MatchPairs({ id, index, title, prompt, pairs, explanation, hint }: MatchPairsProps) {
  const { solved, markSolved } = useExerciseContext();
  const reduce = useReducedMotion();
  const isSolved = solved.includes(id);

  // Barajado determinista: la misma disposición para todo el mundo.
  const derecha = useMemo(() => {
    const out = [...pairs];
    for (let i = 0; i < out.length - 1; i += 2) [out[i], out[i + 1]] = [out[i + 1], out[i]];
    if (out.length > 2) out.push(out.shift()!);
    return out;
  }, [pairs]);

  const [activa, setActiva] = useState<string | null>(null);
  const [hechas, setHechas] = useState<string[]>([]);
  const [fallo, setFallo] = useState(false);

  const completo = hechas.length === pairs.length;
  const verdict: Verdict = completo ? 'ok' : fallo ? 'no' : null;

  function tocarDerecha(pairId: string) {
    if (!activa || hechas.includes(pairId)) return;
    if (activa === pairId) {
      const next = [...hechas, pairId];
      setHechas(next);
      setActiva(null);
      setFallo(false);
      if (next.length === pairs.length) markSolved(id);
    } else {
      setFallo(true);
      setActiva(null);
    }
  }

  return (
    <ExerciseShell id={id} index={index} title={title} prompt={prompt} solved={isSolved}>
      <div className={styles.pairs}>
        <div className={styles.pairCol}>
          {pairs.map((pair, i) => {
            const done = hechas.includes(pair.id);
            return (
              <motion.button
                key={pair.id}
                type="button"
                layout={!reduce}
                transition={settle}
                className={`${styles.pairItem} ${done ? styles.pairDone : ''} ${
                  activa === pair.id ? styles.pairActive : ''
                }`}
                onClick={() => !done && setActiva(pair.id)}
                disabled={done}
              >
                <span className={styles.pairBadge} aria-hidden="true">
                  {done ? '✓' : i + 1}
                </span>
                {pair.izquierda}
              </motion.button>
            );
          })}
        </div>
        <div className={styles.pairCol}>
          {derecha.map((pair) => {
            const done = hechas.includes(pair.id);
            return (
              <motion.button
                key={pair.id}
                type="button"
                layout={!reduce}
                transition={settle}
                className={`${styles.pairItem} ${done ? styles.pairDone : ''}`}
                onClick={() => tocarDerecha(pair.id)}
                disabled={done || !activa}
              >
                {pair.derecha}
              </motion.button>
            );
          })}
        </div>
      </div>

      <p className="text-muted" style={{ fontSize: 13, margin: 0 }}>
        {completo
          ? 'Todas emparejadas.'
          : activa
            ? 'Ahora toca su pareja en la columna derecha.'
            : `Faltan ${pairs.length - hechas.length}. Empieza tocando algo de la izquierda.`}
      </p>

      <Feedback verdict={verdict}>
        {verdict === 'ok'
          ? explanation
          : (hint ?? 'Esa pareja no era. Intenta con otra combinación.')}
      </Feedback>
    </ExerciseShell>
  );
}
