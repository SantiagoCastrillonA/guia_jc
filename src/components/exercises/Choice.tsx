import { useState, type ReactNode } from 'react';
import { useExerciseContext } from './context';
import { CodeBlock, ExerciseShell, Feedback, type Verdict } from './ExerciseShell';
import styles from './Exercise.module.css';

// ── Verdadero o falso ─────────────────────────────────────────────────────

interface TrueFalseProps {
  id: string;
  index: number;
  title: string;
  /** La afirmación que hay que juzgar. */
  statement: ReactNode;
  code?: string;
  answer: boolean;
  explanation: ReactNode;
  hint?: ReactNode;
}

/** Una afirmación y dos botones. El más rápido de responder de todos. */
export function TrueFalse({
  id,
  index,
  title,
  statement,
  code,
  answer,
  explanation,
  hint,
}: TrueFalseProps) {
  const { solved, markSolved } = useExerciseContext();
  const isSolved = solved.includes(id);
  const [picked, setPicked] = useState<boolean | null>(null);

  const verdict: Verdict = picked === null ? null : picked === answer ? 'ok' : 'no';

  function choose(value: boolean) {
    setPicked(value);
    if (value === answer) markSolved(id);
  }

  return (
    <ExerciseShell id={id} index={index} title={title} prompt={statement} solved={isSolved}>
      {code && <CodeBlock code={code} label="Código del ejercicio" />}
      <div className={styles.tfRow}>
        {[true, false].map((value) => {
          const isPicked = picked === value;
          const state = isPicked ? (value === answer ? styles.correct : styles.wrong) : '';
          return (
            <button
              key={String(value)}
              type="button"
              className={`${styles.option} ${styles.tfBtn} ${state}`}
              onClick={() => choose(value)}
              disabled={verdict === 'ok'}
            >
              {value ? 'Verdadero' : 'Falso'}
            </button>
          );
        })}
      </div>
      <Feedback verdict={verdict}>
        {verdict === 'ok' ? explanation : (hint ?? 'No es esa. Vuelve a leer la afirmación con calma.')}
      </Feedback>
    </ExerciseShell>
  );
}

// ── Selección múltiple ────────────────────────────────────────────────────

interface MultiSelectProps {
  id: string;
  index: number;
  title: string;
  prompt?: ReactNode;
  code?: string;
  options: { id: string; label: ReactNode }[];
  /** Los ids correctos: hay que marcarlos todos y ninguno de más. */
  answers: string[];
  explanation: ReactNode;
  hint?: ReactNode;
}

/** "Marca todas las que apliquen": se corrige al comprobar, no al marcar. */
export function MultiSelect({
  id,
  index,
  title,
  prompt,
  code,
  options,
  answers,
  explanation,
  hint,
}: MultiSelectProps) {
  const { solved, markSolved } = useExerciseContext();
  const isSolved = solved.includes(id);
  const [picked, setPicked] = useState<string[]>([]);
  const [verdict, setVerdict] = useState<Verdict>(null);

  function toggle(optionId: string) {
    setPicked((prev) =>
      prev.includes(optionId) ? prev.filter((x) => x !== optionId) : [...prev, optionId],
    );
    if (verdict === 'no') setVerdict(null);
  }

  function check() {
    const ok =
      picked.length === answers.length && answers.every((answerId) => picked.includes(answerId));
    setVerdict(ok ? 'ok' : 'no');
    if (ok) markSolved(id);
  }

  return (
    <ExerciseShell id={id} index={index} title={title} prompt={prompt} solved={isSolved}>
      {code && <CodeBlock code={code} label="Código del ejercicio" />}
      <div className={styles.options} role="group" aria-label="Opciones">
        {options.map((option) => {
          const isPicked = picked.includes(option.id);
          const revealed = verdict === 'ok' && answers.includes(option.id);
          return (
            <button
              key={option.id}
              type="button"
              className={`${styles.option} ${revealed || isPicked ? styles.correct : ''}`}
              onClick={() => toggle(option.id)}
              disabled={verdict === 'ok'}
              aria-pressed={isPicked}
            >
              <span className={styles.optionKey} aria-hidden="true">
                {isPicked ? '✓' : ''}
              </span>
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
      <div className={styles.actions}>
        <button
          type="button"
          className="btn btn-primary"
          onClick={check}
          disabled={verdict === 'ok' || picked.length === 0}
        >
          Comprobar
        </button>
      </div>
      <Feedback verdict={verdict}>
        {verdict === 'ok'
          ? explanation
          : (hint ?? 'Falta alguna, o sobra alguna. Revisa una por una.')}
      </Feedback>
    </ExerciseShell>
  );
}
