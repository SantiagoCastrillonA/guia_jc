import { useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ThinkingOrb } from 'thinking-orbs';
import { ModuleIcon } from '../components/ModuleIcon';
import { TopicCard } from '../components/TopicCard';
import { topics, topicsByModule, totalExercises } from '../data/topics';
import { useAllProgress } from '../lib/progress';
import { useTopicVisibility } from '../lib/topicVisibility';
import { STAGGER } from '../lib/motion';
import styles from './Home.module.css';

export default function Home() {
  const progress = useAllProgress();
  const { isAvailable } = useTopicVisibility();
  const reduce = useReducedMotion();

  useEffect(() => {
    document.title = 'Jóvenes creaTIvos — Guía de programación';
  }, []);

  const solvedTotal = Object.values(progress).reduce((sum, ids) => sum + ids.length, 0);
  const publishedCount = topics.filter((topic) => topic.published && isAvailable(topic.slug)).length;
  const groups = topicsByModule();

  return (
    <>
      <div className="wrap">
        <section className={styles.hero}>
          <div className={styles.heroText}>
            <h1 className="display">
              <span className="line">Aprende programando.</span>
              <span className="line">Un ejercicio a la vez.</span>
            </h1>
            <p className={styles.sub}>
              Esta es la guía de ejercicios interactivos del curso de Desarrollo Web de Jóvenes
              creaTIvos. Cada sesión del cronograma tiene su página: una explicación corta y
              ejercicios que se resuelven aquí mismo. Eliges, escribes, ordenas, y el ejercicio te
              responde al instante.
            </p>
            <div className={styles.row}>
              <a href="#temas" className="btn btn-primary">
                Ver los temas
              </a>
            </div>
          </div>
          <div className={styles.heroOrb} aria-hidden="true">
            <ThinkingOrb state="weaving" size={64} theme="dark" speed={reduce ? 0 : 1} />
          </div>
        </section>
      </div>

      <section className={styles.stats} aria-label="Resumen de la guía">
        <div className="wrap">
          <div className={styles.statGrid}>
            <div>
              <p className={styles.statNum}>
                {publishedCount}
                <span className={styles.statOf}>/{topics.length}</span>
              </p>
              <p className={styles.statLabel}>Sesiones publicadas</p>
            </div>
            <div>
              <p className={styles.statNum}>{totalExercises()}</p>
              <p className={styles.statLabel}>Ejercicios interactivos</p>
            </div>
            <div>
              <p className={styles.statNum}>{solvedTotal}</p>
              <p className={styles.statLabel}>Resueltos por ti</p>
            </div>
          </div>
        </div>
      </section>

      <div className="wrap">
        <section id="temas" className={styles.topics}>
          <span className="kicker">Cronograma</span>
          <h2>Elige por dónde empezar</h2>

          {groups.map((group) => (
            <div key={group.module} className={styles.module}>
              <h3 className={styles.moduleTitle}>
                <ModuleIcon module={group.module} className={styles.moduleIcon} />
                {group.module}
              </h3>
              <motion.div
                className={styles.grid}
                initial="hidden"
                whileInView="shown"
                viewport={{ once: true, amount: 0.15 }}
                variants={{ shown: { transition: { staggerChildren: reduce ? 0 : STAGGER } } }}
              >
                {group.topics.map((topic) => (
                  <TopicCard
                    key={topic.slug}
                    topic={topic}
                    solved={progress[topic.slug]?.length ?? 0}
                    available={isAvailable(topic.slug)}
                  />
                ))}
              </motion.div>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}
