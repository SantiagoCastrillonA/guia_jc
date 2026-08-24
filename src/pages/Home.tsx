import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { ModuleIcon } from '../components/ModuleIcon';
import { topics, topicsByModule, totalExercises, preloadTopic } from '../data/topics';
import type { Topic } from '../types';
import { useAllProgress } from '../lib/progress';
import { useTopicVisibility } from '../lib/topicVisibility';
import { calcularRacha } from '../lib/racha';
import { lunesDeLaSemana, temasDeLaSemana, rangoLegible } from '../lib/semanas';
import { STAGGER, enter, settle } from '../lib/motion';
import styles from './Home.module.css';

const SUGERENCIAS = ['flexbox', 'fetch', 'commit', 'useState', 'MongoDB'];

/** Sin tildes ni mayúsculas: buscar "practica" tiene que encontrar "práctica". */
function normalizar(texto: string) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

export default function Home() {
  const progress = useAllProgress();
  const { isAvailable, semanas } = useTopicVisibility();
  const reduce = useReducedMotion();
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    document.title = 'Jóvenes creaTIvos — Guía de programación';
  }, []);

  const resueltos = Object.values(progress).reduce((sum, ids) => sum + ids.length, 0);
  const total = totalExercises();

  const visibles = useMemo(
    () => topics.filter((t) => t.published && isAvailable(t.slug)),
    [isAvailable],
  );

  const completas = visibles.filter(
    (t) => (progress[t.slug]?.length ?? 0) >= t.exercises && t.exercises > 0,
  ).length;

  /** Dónde quedó: la primera empezada sin terminar; si no hay, la primera sin empezar. */
  const actual = useMemo(() => {
    const empezada = visibles.find((t) => {
      const hechos = progress[t.slug]?.length ?? 0;
      return hechos > 0 && hechos < t.exercises;
    });
    return empezada ?? visibles.find((t) => (progress[t.slug]?.length ?? 0) === 0) ?? null;
  }, [visibles, progress]);

  // La racha se recalcula cuando cambia el progreso: resolver algo la mueve.
  const racha = useMemo(() => calcularRacha(), [progress]);

  const encontrados = useMemo(() => {
    const q = normalizar(busqueda.trim());
    if (!q) return null;
    return topics.filter(
      (t) =>
        t.published &&
        (normalizar(t.title).includes(q) ||
          normalizar(t.module).includes(q) ||
          normalizar(t.summary).includes(q)),
    );
  }, [busqueda]);

  function alBuscar(e: React.FormEvent) {
    e.preventDefault();
    const primero = encontrados?.[0];
    if (primero && isAvailable(primero.slug)) navigate(`/tema/${primero.slug}`);
  }

  // Lunes a sabado. El domingo ya apunta a la semana que arranca manana.
  const lunes = lunesDeLaSemana();
  const deLaSemana = temasDeLaSemana(lunes, semanas).filter((t) => t.published);

  const grupos = topicsByModule();

  return (
    <div className={styles.pagina}>
      <div className={styles.ancho}>
        <section className={styles.hero}>
          <h1 className={styles.titular}>
            <span className={styles.titularLinea}>Aprende programando.</span>
            <span className={`${styles.titularLinea} ${styles.titularApagado}`}>
              Un ejercicio a la vez.
            </span>
          </h1>
          <p className={styles.entrada}>
            Esta es la guía de ejercicios interactivos del curso de Desarrollo Web de Jóvenes
            creaTIvos. Cada sesión del cronograma tiene su página: una explicación corta y
            ejercicios que se resuelven aquí mismo.
          </p>
          <div className={styles.acciones}>
            {actual && (
              <Link
                to={`/tema/${actual.slug}`}
                className={styles.pastilla}
                onMouseEnter={() => preloadTopic(actual.slug)}
                onFocus={() => preloadTopic(actual.slug)}
                onPointerDown={() => preloadTopic(actual.slug)}
              >
                {(progress[actual.slug]?.length ?? 0) > 0 ? 'Continuar' : 'Empezar'} sesión{' '}
                {String(actual.session).padStart(2, '0')}
              </Link>
            )}
            <a href="#cronograma" className={styles.enlaceAccion}>
              Ver el cronograma ›
            </a>
          </div>
        </section>

        {deLaSemana.length > 0 && (
          <section className={styles.bannerSemana} aria-label="Tema de la semana">
            <div className={styles.semanaEncabezado}>
              <span className={styles.semanaRotulo}>
                {deLaSemana.length === 1 ? 'Tema de la semana' : 'Temas de la semana'}
              </span>
              <span className={styles.semanaFechas}>{rangoLegible(lunes)}</span>
            </div>
            <div className={styles.semanaTemas}>
              {deLaSemana.map((tema) => {
                const puedeEntrar = isAvailable(tema.slug);
                const hechos = progress[tema.slug]?.length ?? 0;
                const contenido = (
                  <>
                    <span className={styles.semanaSesion}>
                      Sesión {String(tema.session).padStart(2, '0')}
                    </span>
                    <span className={styles.semanaTitulo}>{tema.title}</span>
                    <span className={styles.semanaCuenta}>
                      {puedeEntrar
                        ? `${hechos} de ${tema.exercises} ejercicios`
                        : 'Todavía no disponible'}
                    </span>
                  </>
                );
                return puedeEntrar ? (
                  <Link
                    key={tema.slug}
                    to={`/tema/${tema.slug}`}
                    className={styles.semanaTema}
                    onMouseEnter={() => preloadTopic(tema.slug)}
                    onFocus={() => preloadTopic(tema.slug)}
                    onPointerDown={() => preloadTopic(tema.slug)}
                  >
                    {contenido}
                  </Link>
                ) : (
                  <span key={tema.slug} className={`${styles.semanaTema} ${styles.semanaApagado}`}>
                    {contenido}
                  </span>
                );
              })}
            </div>
          </section>
        )}

        <section className={styles.banda} aria-label="Tu avance">
          <div className={styles.celdaBanda}>
            <p className={styles.cifra}>
              {resueltos}
              <span className={styles.cifraDe}> / {total}</span>
            </p>
            <p className={styles.rotulo}>Ejercicios resueltos</p>
            <span className={styles.pista}>
              <motion.span
                className={styles.relleno}
                initial={false}
                animate={{ transform: `scaleX(${total ? Math.min(resueltos / total, 1) : 0})` }}
                transition={reduce ? { duration: 0 } : settle}
              />
            </span>
          </div>

          <div className={styles.celdaBanda}>
            <p className={styles.cifra}>
              {racha.dias}
              <span className={styles.cifraUnidad}> {racha.dias === 1 ? 'día' : 'días'}</span>
            </p>
            <p className={styles.rotulo}>Racha de práctica</p>
            <span className={styles.semana}>
              {racha.semana.map((d) => (
                <span
                  key={d.fecha}
                  className={`${styles.dia} ${d.activo ? styles.diaActivo : ''} ${
                    d.esHoy ? styles.diaHoy : ''
                  }`}
                  title={d.fecha}
                />
              ))}
            </span>
          </div>

          <div className={styles.celdaBanda}>
            <p className={styles.cifra}>
              {completas}
              <span className={styles.cifraUnidad}> de {topics.length}</span>
            </p>
            <p className={styles.rotulo}>Sesiones completas</p>
            <span className={styles.segmentos}>
              {topics.map((t) => {
                const hechos = progress[t.slug]?.length ?? 0;
                const estado =
                  hechos >= t.exercises && t.exercises > 0
                    ? styles.segHecho
                    : hechos > 0
                      ? styles.segCurso
                      : '';
                return <span key={t.slug} className={`${styles.seg} ${estado}`} />;
              })}
            </span>
          </div>
        </section>

        <section className={styles.zonaBuscador} aria-label="Buscar un tema">
          <form className={styles.buscador} onSubmit={alBuscar} role="search">
            <Lupa />
            <input
              type="search"
              className={styles.entradaBusqueda}
              placeholder="Busca un tema: flexbox, fetch, commit…"
              aria-label="Busca un tema"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </form>
          <div className={styles.sugerencias}>
            {SUGERENCIAS.map((s) => (
              <button
                key={s}
                type="button"
                className={styles.sugerencia}
                onClick={() => setBusqueda(s)}
              >
                {s}
              </button>
            ))}
          </div>
          {encontrados && (
            <p className={styles.resultado} role="status">
              {encontrados.length === 0
                ? 'Ningún tema coincide.'
                : `${encontrados.length} tema${encontrados.length === 1 ? '' : 's'}: ${encontrados
                    .slice(0, 3)
                    .map((t) => t.title)
                    .join(' · ')}${encontrados.length > 3 ? '…' : ''}`}
            </p>
          )}
        </section>

        <section id="cronograma" className={styles.ruta}>
          <span className={styles.kicker}>Cronograma</span>
          <h2 className={styles.tituloRuta}>Elige por dónde empezar</h2>

          {grupos.map((grupo) => (
            <div key={grupo.module} className={styles.modulo}>
              <div className={styles.cabeceraModulo}>
                <ModuleIcon module={grupo.module} className={styles.iconoModulo} />
                <span className={styles.nombreModulo}>{grupo.module}</span>
                <span className={styles.cuentaModulo}>
                  {grupo.topics.length} {grupo.topics.length === 1 ? 'sesión' : 'sesiones'}
                </span>
              </div>

              <motion.div
                className={styles.tarjetaModulo}
                initial="oculto"
                whileInView="visible"
                viewport={{ once: true, amount: 0.12 }}
                variants={{ visible: { transition: { staggerChildren: reduce ? 0 : STAGGER } } }}
              >
                {grupo.topics.map((tema) => (
                  <FilaSesion
                    key={tema.slug}
                    tema={tema}
                    hechos={progress[tema.slug]?.length ?? 0}
                    disponible={tema.published && isAvailable(tema.slug)}
                    esActual={actual?.slug === tema.slug}
                    reduce={!!reduce}
                  />
                ))}
              </motion.div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

interface FilaProps {
  tema: Topic;
  hechos: number;
  disponible: boolean;
  esActual: boolean;
  reduce: boolean;
}

function FilaSesion({ tema, hechos, disponible, esActual, reduce }: FilaProps) {
  const completa = tema.exercises > 0 && hechos >= tema.exercises;
  const fraccion = tema.exercises > 0 ? Math.min(hechos / tema.exercises, 1) : 0;

  // Desplaza, no desvanece: congelada en su primer fotograma —lo que hace el
  // navegador con una pestaña en segundo plano— una entrada desde `opacity: 0`
  // deja la fila invisible hasta recargar.
  const variantes = {
    oculto: { transform: reduce ? 'none' : 'translateY(8px)' },
    visible: { transform: 'translateY(0px)' },
  };

  const cuerpo = (
    <>
      <span
        className={`${styles.marca} ${
          completa ? styles.marcaHecha : esActual ? styles.marcaActual : ''
        }`}
        aria-hidden="true"
      >
        {completa ? <Check /> : String(tema.session).padStart(2, '0')}
      </span>

      <span className={styles.textoFila}>
        <span className={styles.tituloFila}>{tema.title}</span>
        <span className={styles.resumenFila}>{tema.summary}</span>
        {esActual && disponible && (
          <span className={styles.avanceFila}>
            <span className={styles.pistaCorta}>
              <span className={styles.relleno} style={{ transform: `scaleX(${fraccion})` }} />
            </span>
            <span className={styles.vasAqui}>Vas por aquí</span>
          </span>
        )}
      </span>

      <span className={styles.finFila}>
        {!disponible ? (
          <span className={styles.proximamente}>
            {tema.published ? 'No disponible' : 'Próximamente'}
          </span>
        ) : esActual ? (
          <span className={styles.pastillaChica}>Continuar</span>
        ) : (
          <>
            <span className={styles.cuentaFila}>
              {completa ? `${hechos} / ${tema.exercises}` : `${tema.exercises} ejercicios`}
            </span>
            <Chevron />
          </>
        )}
      </span>
    </>
  );

  const clases = `${styles.fila} ${esActual && disponible ? styles.filaActual : ''} ${
    disponible ? '' : styles.filaApagada
  }`;

  if (!disponible) {
    return (
      <motion.div variants={variantes} transition={enter} className={clases} aria-disabled="true">
        {cuerpo}
      </motion.div>
    );
  }

  return (
    <motion.div variants={variantes} transition={enter}>
      <Link
        to={`/tema/${tema.slug}`}
        className={clases}
        onMouseEnter={() => preloadTopic(tema.slug)}
        onFocus={() => preloadTopic(tema.slug)}
        onPointerDown={() => preloadTopic(tema.slug)}
      >
        {cuerpo}
      </Link>
    </motion.div>
  );
}

function Lupa() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      className={styles.lupa}
      aria-hidden="true"
    >
      <circle cx="7" cy="7" r="4.5" />
      <path d="M10.5 10.5 14 14" />
    </svg>
  );
}

function Check() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m3.5 8.5 3 3 6-7" />
    </svg>
  );
}

function Chevron() {
  return (
    <svg
      viewBox="0 0 8 14"
      width="8"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={styles.chevron}
      aria-hidden="true"
    >
      <path d="m1 1 6 6-6 6" />
    </svg>
  );
}
