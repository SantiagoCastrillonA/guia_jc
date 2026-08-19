import { useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { useExerciseContext } from './context';
import { CodeBlock, ExerciseShell, Feedback, type Verdict } from './ExerciseShell';
import { springy } from '../../lib/motion';
import styles from './Exercise.module.css';

export interface QuizOption {
  id: string;
  label: ReactNode;
}

interface QuizProps {
  id: string;
  index: number;
  title: string;
  prompt?: ReactNode;
  code?: string;
  numbered?: boolean;
  options: QuizOption[];
  /** id of the correct option */
  answer: string;
  /** Shown once the student answers correctly — the point of the exercise. */
  explanation: ReactNode;
  /** Shown after a wrong answer. Nudge, don't reveal. */
  hint?: ReactNode;
}

const KEYS = ['A', 'B', 'C', 'D', 'E', 'F'];

export function Quiz({
  id,
  index,
  title,
  prompt,
  code,
  numbered,
  options,
  answer,
  explanation,
  hint,
}: QuizProps) {
  const { solved, markSolved } = useExerciseContext();
  const reduce = useReducedMotion();
  const isSolved = solved.includes(id);
  const [picked, setPicked] = useState<string | null>(null);

  const verdict: Verdict = picked === null ? null : picked === answer ? 'ok' : 'no';

  function choose(optionId: string) {
    setPicked(optionId);
    if (optionId === answer) markSolved(id);
  }

  return (
    <ExerciseShell id={id} index={index} title={title} prompt={prompt} solved={isSolved}>
      {code && <CodeBlock code={code} numbered={numbered} label="Código del ejercicio" />}

      <div className={styles.options} role="group" aria-label="Opciones de respuesta">
        {options.map((option, i) => {
          const isPicked = picked === option.id;
          const state =
            isPicked && option.id === answer
              ? styles.correct
              : isPicked
                ? styles.wrong
                : verdict === 'ok' && option.id === answer
                  ? styles.correct
                  : '';

          return (
            <motion.button
              key={option.id}
              type="button"
              className={`${styles.option} ${state}`}
              onClick={() => choose(option.id)}
              disabled={verdict === 'ok'}
              aria-pressed={isPicked}
              // The commit pops: a correct pick carries momentum, a wrong one
              // settles back without bounce.
              animate={
                reduce || !isPicked
                  ? { transform: 'scale(1)' }
                  : option.id === answer
                    ? { transform: ['scale(0.98)', 'scale(1)'] }
                    : { transform: ['translateX(-4px)', 'translateX(4px)', 'translateX(0px)'] }
              }
              transition={springy}
            >
              <span className={styles.optionKey} aria-hidden="true">
                {KEYS[i] ?? i + 1}
              </span>
              <span>{option.label}</span>
            </motion.button>
          );
        })}
      </div>

      <Feedback verdict={verdict}>
        {verdict === 'ok' ? explanation : (hint ?? 'Todavía no. Revisa el código y prueba otra vez.')}
      </Feedback>
    </ExerciseShell>
  );
}
