import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import type { Topic } from '../types';
import { topicKicker } from '../data/topics';
import { enter, settle } from '../lib/motion';
import styles from './TopicCard.module.css';

const MotionLink = motion.create(Link);

interface Props {
  topic: Topic;
  solved: number;
}

export function TopicCard({ topic, solved }: Props) {
  const reduce = useReducedMotion();
  const progress = topic.exercises > 0 ? solved / topic.exercises : 0;
  const done = topic.exercises > 0 && solved >= topic.exercises;

  const variants = {
    hidden: { opacity: 0, transform: reduce ? 'none' : 'translateY(12px)' },
    shown: { opacity: 1, transform: 'translateY(0px)', transition: enter },
  };

  const body = (
    <>
      <div className={styles.head}>
        <span className="card-kicker">{topicKicker(topic)}</span>
        <span className={`tag ${done ? 'tag-accent' : 'tag-neutral'}`}>
          {!topic.published ? 'Próximamente' : done ? 'Completado' : topic.level}
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

  if (!topic.published) {
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
    >
      {body}
    </MotionLink>
  );
}
