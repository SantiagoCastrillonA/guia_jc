import type { ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { enter } from '../../lib/motion';
import styles from './Exercise.module.css';

export type Verdict = 'ok' | 'no' | null;

interface ShellProps {
  id: string;
  index: number;
  title: string;
  prompt?: ReactNode;
  solved: boolean;
  children: ReactNode;
}

/** The frame every exercise shares: number, title, prompt, body. */
export function ExerciseShell({ id, index, title, prompt, solved, children }: ShellProps) {
  return (
    <section id={id} className={`card elev-sm ${styles.shell}`} aria-labelledby={`${id}-title`}>
      <div className={styles.head}>
        <span className={styles.num}>Ejercicio {String(index).padStart(2, '0')}</span>
        {solved && <span className="tag tag-accent">Resuelto</span>}
      </div>
      <h3 id={`${id}-title`} className={styles.title}>
        {title}
      </h3>
      {prompt && <p className={styles.prompt}>{prompt}</p>}
      {children}
    </section>
  );
}

interface CodeBlockProps {
  code: string;
  /** Numbered lines help when the prompt refers to "la línea 3". */
  numbered?: boolean;
  label?: string;
}

export function CodeBlock({ code, numbered = false, label }: CodeBlockProps) {
  const lines = code.replace(/\n$/, '').split('\n');
  return (
    <pre className={styles.code} aria-label={label} tabIndex={0}>
      <code>
        {lines.map((line, i) => (
          <span key={i}>
            {numbered && <span className={styles.lineNo}>{i + 1}</span>}
            {line}
            {i < lines.length - 1 ? '\n' : ''}
          </span>
        ))}
      </code>
    </pre>
  );
}

interface FeedbackProps {
  verdict: Verdict;
  children: ReactNode;
}

/** One feedback line, cross-fading in place when the verdict changes. */
export function Feedback({ verdict, children }: FeedbackProps) {
  const reduce = useReducedMotion();
  return (
    <AnimatePresence initial={false} mode="wait">
      {verdict && (
        <motion.p
          key={verdict}
          role="status"
          className={`${styles.feedback} ${verdict === 'ok' ? styles.feedbackOk : styles.feedbackNo}`}
          initial={{ opacity: 0, transform: reduce ? 'none' : 'translateY(6px)' }}
          animate={{ opacity: 1, transform: 'translateY(0px)' }}
          exit={{ opacity: 0 }}
          transition={enter}
        >
          <span className={styles.feedbackMark} aria-hidden="true">
            {verdict === 'ok' ? '✓' : '↺'}
          </span>
          <span>{children}</span>
        </motion.p>
      )}
    </AnimatePresence>
  );
}
