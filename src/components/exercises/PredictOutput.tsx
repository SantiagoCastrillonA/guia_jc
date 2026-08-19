import { useId, useState, type FormEvent, type ReactNode } from 'react';
import { useExerciseContext } from './context';
import { CodeBlock, ExerciseShell, Feedback, type Verdict } from './ExerciseShell';
import styles from './Exercise.module.css';

interface PredictOutputProps {
  id: string;
  index: number;
  title: string;
  prompt?: ReactNode;
  code: string;
  numbered?: boolean;
  /** Every spelling that counts as right. Compared case- and space-insensitive. */
  answers: string[];
  explanation: ReactNode;
  hint?: ReactNode;
  placeholder?: string;
  label?: string;
}

const normalize = (value: string) =>
  value.trim().toLowerCase().replace(/\s+/g, ' ').replace(/["']/g, '');

/** "¿Qué imprime este código?" — a free-text answer, checked on submit. */
export function PredictOutput({
  id,
  index,
  title,
  prompt,
  code,
  numbered,
  answers,
  explanation,
  hint,
  placeholder = 'Escribe la salida exacta',
  label = '¿Qué imprime este código?',
}: PredictOutputProps) {
  const { solved, markSolved } = useExerciseContext();
  const inputId = useId();
  const isSolved = solved.includes(id);
  const [value, setValue] = useState('');
  const [verdict, setVerdict] = useState<Verdict>(null);

  function check(event: FormEvent) {
    event.preventDefault();
    if (!value.trim()) return;
    const ok = answers.some((a) => normalize(a) === normalize(value));
    setVerdict(ok ? 'ok' : 'no');
    if (ok) markSolved(id);
  }

  return (
    <ExerciseShell id={id} index={index} title={title} prompt={prompt} solved={isSolved}>
      <CodeBlock code={code} numbered={numbered} label="Código del ejercicio" />

      <form onSubmit={check} className="field">
        <label htmlFor={inputId}>{label}</label>
        <div className={styles.answerRow}>
          <input
            id={inputId}
            className={`input mono ${styles.grow}`}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (verdict === 'no') setVerdict(null); // clear the miss as soon as they retype
            }}
            placeholder={placeholder}
            autoComplete="off"
            spellCheck={false}
            disabled={verdict === 'ok'}
          />
          <button type="submit" className="btn btn-primary" disabled={verdict === 'ok'}>
            Comprobar
          </button>
        </div>
      </form>

      <Feedback verdict={verdict}>
        {verdict === 'ok' ? explanation : (hint ?? 'Esa no es la salida. Sigue el código línea por línea.')}
      </Feedback>
    </ExerciseShell>
  );
}
