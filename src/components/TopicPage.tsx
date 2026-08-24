import { useEffect, useMemo, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { getTopic, topicKicker } from '../data/topics';
import { useAuth } from '../lib/auth';
import { useTopicProgress } from '../lib/progress';
import { useTopicVisibility } from '../lib/topicVisibility';
import { ExerciseContext } from './exercises/context';
import { STAGGER, enter } from '../lib/motion';
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
  const { isAvailable, loading: visLoading } = useTopicVisibility();
  const { user } = useAuth();
  const reduce = useReducedMotion();

  const isAdmin = user?.role === 'admin';
  const available = isAvailable(slug);
  const blocked = !visLoading && !available && !isAdmin;

  useEffect(() => {
    document.title = topic
      ? `${topic.title} — Jóvenes creaTIvos`
      : 'Jóvenes creaTIvos';
  }, [topic]);

  const value = useMemo(() => ({ topicSlug: slug, solved, markSolved }), [slug, solved, markSolved]);

  const total = topic?.exercises ?? 0;

  if (blocked) {
    return (
      <div className="wrap" style={{ padding: 'calc(4 * var(--leading)) 0' }}>
        <span className="kicker">No disponible</span>
        <h1>{topic?.title ?? slug}</h1>
        <p className="text-muted" style={{ maxWidth: 'var(--measure)' }}>
          Tu profe desactivó este tema por ahora. Vuelve más tarde.
        </p>
        <Link to="/#temas" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>
          Volver a los temas
        </Link>
      </div>
    );
  }

  return (
    <div className="wrap">
      <header className={styles.hero}>
        <Link to="/#temas" className={styles.back}>
          ← Todos los temas
        </Link>
        {topic && <span className="kicker">{topicKicker(topic)}</span>}
        <h1 className={styles.title}>{topic?.title ?? slug}</h1>
        {topic && <p className={styles.summary}>{topic.summary}</p>}
        {!available && isAdmin && (
          <p className={styles.previewNote} role="status">
            Desactivado para estudiantes — solo tú lo ves como admin.
          </p>
        )}

        <div className={styles.progress}>
          <div className={styles.progressRow}>
            <span>
              {count} de {total} ejercicios resueltos
            </span>
            {count > 0 && (
              <button type="button" className="btn btn-ghost" onClick={reset}>
                Reiniciar
              </button>
            )}
          </div>
          {total > 0 && (
            <div className={styles.ticks} aria-hidden="true">
              {Array.from({ length: total }, (_, i) => (
                <span key={i} className={i < count ? styles.tickOn : styles.tick} />
              ))}
            </div>
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
        // La entrada mueve, no desvanece. Si el navegador congela la animación
        // —pestaña en segundo plano, motor detenido— se queda en su primer
        // fotograma; con `opacity: 0` eso deja el bloque invisible hasta un F5,
        // y en `translateY` no se nota.
        hidden: { transform: reduce ? 'none' : 'translateY(10px)' },
        shown: { transform: 'translateY(0px)', transition: enter },
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
