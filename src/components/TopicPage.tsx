import { useEffect, useMemo, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { getTopic, topicKicker } from '../data/topics';
import { useTopicProgress } from '../lib/progress';
import { ExerciseContext } from './exercises/context';
import { STAGGER, enter, settle } from '../lib/motion';
import styles from './TopicPage.module.css';

interface TopicPageProps {
  /** Must match the slug registered in src/data/topics.ts */
  slug: string;
  children: ReactNode;
}

/**
 * The frame every topic page shares: hero, progress, exercise context.
 * A topic page is then only its lesson prose and its exercises.
 */
export function TopicPage({ slug, children }: TopicPageProps) {
  const topic = getTopic(slug);
  const { solved, count, markSolved, reset } = useTopicProgress(slug);
  const reduce = useReducedMotion();

  useEffect(() => {
    document.title = topic
      ? `${topic.title} — Jóvenes creaTIvos`
      : 'Jóvenes creaTIvos';
  }, [topic]);

  const value = useMemo(() => ({ topicSlug: slug, solved, markSolved }), [slug, solved, markSolved]);

  const total = topic?.exercises ?? 0;
  const progress = total > 0 ? Math.min(count / total, 1) : 0;

  return (
    <div className="wrap">
      <header className={styles.hero}>
        <Link to="/#temas" className={styles.back}>
          ← Todos los temas
        </Link>
        {topic && <span className="kicker">{topicKicker(topic)}</span>}
        <h1 className={styles.title}>{topic?.title ?? slug}</h1>
        {topic && <p className={styles.summary}>{topic.summary}</p>}

        <div className={styles.progress}>
          <span>
            {count} de {total} ejercicios resueltos
          </span>
          <span className={styles.track} aria-hidden="true">
            <motion.span
              className={styles.fill}
              initial={false}
              animate={{ transform: `scaleX(${progress})` }}
              transition={reduce ? { duration: 0 } : settle}
            />
          </span>
          {count > 0 && (
            <button type="button" className="btn btn-ghost" onClick={reset}>
              Reiniciar
            </button>
          )}
        </div>
      </header>

      <hr className="rule" />

      <ExerciseContext.Provider value={value}>
        {/* Blocks enter in sequence so the page reads top-down instead of
            arriving all at once. */}
        <motion.div
          className={styles.body}
          initial="hidden"
          animate="shown"
          variants={{ shown: { transition: { staggerChildren: reduce ? 0 : STAGGER } } }}
        >
          {children}
        </motion.div>
      </ExerciseContext.Provider>
    </div>
  );
}

interface BlockProps {
  children: ReactNode;
  className?: string;
}

/** A staggered child of <TopicPage>. Wrap prose or an exercise group. */
export function TopicBlock({ children, className }: BlockProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, transform: reduce ? 'none' : 'translateY(10px)' },
        shown: { opacity: 1, transform: 'translateY(0px)', transition: enter },
      }}
    >
      {children}
    </motion.div>
  );
}

interface LessonProps {
  title: string;
  children: ReactNode;
}

/** Explanatory prose above the exercises. */
export function Lesson({ title, children }: LessonProps) {
  return (
    <TopicBlock className={styles.section}>
      <h2>{title}</h2>
      {children}
    </TopicBlock>
  );
}

/** The exercise stack. Children are the exercise components. */
export function Exercises({ children }: { children: ReactNode }) {
  return <TopicBlock className={styles.exercises}>{children}</TopicBlock>;
}
