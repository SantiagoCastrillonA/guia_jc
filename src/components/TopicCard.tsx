import { Link } from 'react-router-dom';
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import type { Topic } from '../types';
import { preloadTopic, topicKicker } from '../data/topics';
import { enter, settle } from '../lib/motion';
import styles from './TopicCard.module.css';

const MotionLink = motion.create(Link);

interface Props {
  topic: Topic;
  solved: number;
  /** Falso cuando el profe lo apagó desde el panel de admin. */
  available?: boolean;
}

export function TopicCard({ topic, solved, available = true }: Props) {
  const reduce = useReducedMotion();
  const progress = topic.exercises > 0 ? solved / topic.exercises : 0;
  const done = topic.exercises > 0 && solved >= topic.exercises;
  const locked = !topic.published || !available;

  // Inclinación 3D siguiendo el puntero. Solo con mouse; el resorte evita que
  // el movimiento se sienta pegado al cursor.
  const rx = useSpring(useMotionValue(0), { stiffness: 220, damping: 22 });
  const ry = useSpring(useMotionValue(0), { stiffness: 220, damping: 22 });
  const escala = useSpring(useMotionValue(1), { stiffness: 400, damping: 30 });
  const transform = useMotionTemplate`perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${escala})`;

  const inclinar = (e: React.PointerEvent<HTMLElement>) => {
    if (reduce || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 7);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 7);
  };
  const enderezar = () => {
    rx.set(0);
    ry.set(0);
    escala.set(1);
  };

  const variants = {
    hidden: { opacity: 0, transform: reduce ? 'none' : 'translateY(12px)' },
    shown: { opacity: 1, transform: 'translateY(0px)', transition: enter },
  };

  const body = (
    <>
      <div className={styles.head}>
        <span className="card-kicker">{topicKicker(topic)}</span>
        <span className={`tag ${done ? 'tag-accent' : 'tag-neutral'}`}>
          {!topic.published
            ? 'Próximamente'
            : !available
              ? 'No disponible'
              : done
                ? 'Completado'
                : topic.level}
        </span>
      </div>
      <h3 className={`card-title ${styles.title}`}>{topic.title}</h3>
      <p className={styles.summary}>{topic.summary}</p>
      {topic.exercises > 0 ? (
        <div className={styles.meta}>
          <span>
            {solved}/{topic.exercises} ejercicios
          </span>
          <span className={styles.track} aria-hidden="true">
            <motion.span
              className={styles.fill}
              initial={false}
              animate={{ transform: `scaleX(${progress})` }}
              transition={reduce ? { duration: 0 } : settle}
            />
          </span>
        </div>
      ) : (
        <div className={styles.meta}>
          <span>Sesión del cronograma, todavía sin ejercicios</span>
        </div>
      )}
    </>
  );

  if (locked) {
    return (
      <motion.div
        variants={variants}
        className={`card elev-sm ${styles.card} ${styles.soon}`}
        aria-disabled="true"
      >
        {body}
      </motion.div>
    );
  }

  return (
    <MotionLink
      to={`/tema/${topic.slug}`}
      variants={variants}
      className={`card elev-sm ${styles.card}`}
      style={{ transform, transformStyle: 'preserve-3d' }}
      onMouseEnter={() => preloadTopic(topic.slug)}
      onFocus={() => preloadTopic(topic.slug)}
      onPointerMove={inclinar}
      onPointerLeave={enderezar}
      onPointerDown={() => escala.set(0.985)}
      onPointerUp={() => escala.set(1)}
    >
      {body}
    </MotionLink>
  );
}
