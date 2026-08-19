import { useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { useExerciseContext } from './context';
import { ExerciseShell, Feedback, type Verdict } from './ExerciseShell';
import { settle } from '../../lib/motion';
import styles from './Exercise.module.css';

export interface Step {
  id: string;
  text: ReactNode;
}

interface OrderStepsProps {
  id: string;
  index: number;
  title: string;
  prompt?: ReactNode;
  /** Steps in their correct order — the component shuffles them for display. */
  steps: Step[];
  explanation: ReactNode;
  hint?: ReactNode;
}

/** A deterministic derangement: same start for everyone, never already solved. */
function scramble<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = 0; i < out.length - 1; i += 2) {
    [out[i], out[i + 1]] = [out[i + 1], out[i]];
  }
  if (out.length > 2) out.push(out.shift() as T);
  return out;
}

export function OrderSteps({ id, index, title, prompt, steps, explanation, hint }: OrderStepsProps) {
  const { solved, markSolved } = useExerciseContext();
  const reduce = useReducedMotion();
  const isSolved = solved.includes(id);
  const [order, setOrder] = useState(() => scramble(steps));
  const [verdict, setVerdict] = useState<Verdict>(null);

  function move(from: number, to: number) {
    // Functional update: two swaps fired in the same tick must both land.
    setOrder((prev) => {
      if (to < 0 || to >= prev.length) return prev;
      const next = [...prev];
      [next[from], next[to]] = [next[to], next[from]];
      return next;
    });
    if (verdict === 'no') setVerdict(null);
  }

  function check() {
    const ok = order.every((step, i) => step.id === steps[i].id);
    setVerdict(ok ? 'ok' : 'no');
    if (ok) markSolved(id);
  }

  return (
    <ExerciseShell id={id} index={index} title={title} prompt={prompt} solved={isSolved}>
      <ol className={styles.steps}>
        {order.map((step, i) => (
          // `layout` moves the rows with a transform, so a swap reads as the
          // two rows trading places instead of the text teleporting.
          <motion.li
            key={step.id}
            layout={!reduce}
            transition={settle}
            className={styles.step}
          >
            <span className={styles.stepText}>{step.text}</span>
            <span className={styles.stepControls}>
              <button
                type="button"
                className={styles.iconBtn}
                onClick={() => move(i, i - 1)}
                disabled={i === 0 || verdict === 'ok'}
                aria-label={`Subir el paso ${i + 1}`}
              >
                ↑
              </button>
              <button
                type="button"
                className={styles.iconBtn}
                onClick={() => move(i, i + 1)}
                disabled={i === order.length - 1 || verdict === 'ok'}
                aria-label={`Bajar el paso ${i + 1}`}
              >
                ↓
              </button>
            </span>
          </motion.li>
        ))}
      </ol>

      <div className={styles.actions}>
        <button type="button" className="btn btn-primary" onClick={check} disabled={verdict === 'ok'}>
          Comprobar orden
        </button>
      </div>

      <Feedback verdict={verdict}>
        {verdict === 'ok' ? explanation : (hint ?? 'El orden todavía no es correcto. Piensa qué necesita existir antes de usarse.')}
      </Feedback>
    </ExerciseShell>
  );
}
