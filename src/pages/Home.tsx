import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { ModuleIcon } from '../components/ModuleIcon';
import { topics, topicsByModule, totalExercises, preloadTopic } from '../data/topics';
import type { Topic } from '../types';
import { useAllProgress } from '../lib/progress';
import { useTopicVisibility } from '../lib/topicVisibility';
import { calcularRacha } from '../lib/racha';
import { lunesDeLaSemana, temasDeLaSemana, finDe, rangoLegible } from '../lib/semanas';
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

/** El retraso de una entrada, como variable CSS. */
function retraso(valor: string) {
  return { '--retraso': valor } as React.CSSProperties;
}

export default function Home() {
  const progress = useAllProgress();
  const { isAvailable, semanas, fines } = useTopicVisibility();
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
          <div className={styles.heroTexto}>
            <span
              className={`${styles.rotuloSeccion} ${styles.rotuloPrompt} ${styles.entraDespues}`}
            >
              desarrollo-web --sesiones {topics.length} --ejercicios {total}
            </span>
            <h1 className={styles.titular}>
              <span className={styles.linea}>
                <span className={styles.lineaTexto} style={retraso('0.06s')}>
                  Aprende programando.
                </span>
              </span>
              <span className={`${styles.linea} ${styles.titularApagado}`}>
                <span className={styles.lineaTexto} style={retraso('0.15s')}>
                  Un ejercicio a la vez.
                  <span className={styles.cursorTerminal} aria-hidden="true" />
                </span>
              </span>
            </h1>
            <p className={`${styles.entrada} ${styles.entraDespues}`} style={retraso('0.26s')}>
              La guía de ejercicios interactivos de Jóvenes creaTIvos. Cada sesión del
              cronograma tiene su página: la explicación paso a paso, diagramas, demos que se
              tocan y ejercicios que se resuelven aquí mismo.
            </p>
            <div className={`${styles.acciones} ${styles.entraDespues}`} style={retraso('0.3s')}>
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
                Ver el cronograma
              </a>
              <Link to="/proyecto" className={styles.enlaceAccion}>
                El proyecto formativo
              </Link>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <Constelacion reduce={!!reduce} />
          </div>
        </section>

        {deLaSemana.length > 0 && (
          <section className={styles.bannerSemana} aria-label="Tema de la semana">
            <div className={styles.semanaEncabezado}>
              <span className={styles.rotuloSeccion}>
                {deLaSemana.length === 1 ? 'tema de la semana' : 'temas de la semana'}
              </span>
              <span className={styles.semanaFechas}>
                {rangoLegible(lunes, finDe(deLaSemana[0], semanas, fines))}
              </span>
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
          <span className={styles.rotuloSeccion}>cronograma</span>
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

/* ── constelación del hero ───────────────────────────────────────────────
   Miles de triángulos diminutos formando una silueta orgánica: el gesto que
   define la portada. Es decorativa (`aria-hidden`), así que no dice nada que
   no esté ya escrito al lado. */

/** PRNG con semilla fija. La constelación tiene que ser la misma en cada
 *  render: si se sorteara de nuevo, cada navegación a la portada repintaría
 *  un cielo distinto y se notaría como un parpadeo. */
function mulberry32(semilla: number) {
  let a = semilla;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Los acentos de la plantilla terminal, en el orden en que se reparten. Se
 *  leen del CSS (Home.module.css / temas.css) y no se escriben aquí. */
const TINTES = ['--term-verde', '--term-amarillo', '--color-text', '--term-azul', '--term-morado'];

/** Niveles de opacidad en que se agrupan las partículas para dibujarlas. */
const CUBOS = 6;

/** Lienzo de diseño. Todo se calcula aquí y se escala al tamaño real. */
const LIENZO_ANCHO = 620;
const LIENZO_ALTO = 560;
/** Partículas dentro de la figura, y las sueltas que flotan alrededor. */
const EN_FIGURA = 1150;
const AMBIENTE = 80;

/** Reparto de tintes: manda el verde de los prompts, el blanco y el amarillo
 *  puntean, y el azul y el morado —los de la sintaxis— salpican. Un sorteo
 *  uniforme entre los cinco deja la figura con aire de confeti. */
const REPARTO = [0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 3, 4];

/** Centro y radios de la figura en el lienzo de diseño: los usan el halo y
 *  el anillo de partículas sueltas. */
const FIGURA_CX = 310;
const FIGURA_CY = 280;
const FIGURA_RX = 240;
const FIGURA_RY = 175;

/** Grosor de los trazos de `</>`, en píxeles del lienzo de diseño. */
const GROSOR = 46;

/**
 * Dibuja `</>` en un lienzo aparte, que nunca se muestra: sirve de molde.
 * Después se siembran las partículas donde ese molde tiene tinta, así que la
 * figura sale de aquí y no de ajustar posiciones a mano.
 *
 * Son trazos geométricos y no la letra de la fuente a propósito: el molde se
 * arma una vez, al montar la portada, y en ese momento la fuente web puede no
 * haber cargado todavía — el `</>` saldría en la letra de reserva.
 *
 * Lo que se dibuja con más alfa termina con más partículas. El borde de cada
 * trazo va a tope y el interior a media tinta: así la figura tiene contorno
 * nítido, que es lo que la hace legible, en vez de ser una banda pareja.
 */
function moldeDeLaFigura(): ImageData | null {
  const molde = document.createElement('canvas');
  molde.width = LIENZO_ANCHO;
  molde.height = LIENZO_ALTO;
  const c = molde.getContext('2d');
  if (!c) return null;

  const figura = new Path2D();
  // <
  figura.moveTo(210, 150);
  figura.lineTo(80, FIGURA_CY);
  figura.lineTo(210, 410);
  // /
  figura.moveTo(365, 112);
  figura.lineTo(255, 448);
  // >
  figura.moveTo(410, 150);
  figura.lineTo(540, FIGURA_CY);
  figura.lineTo(410, 410);

  c.strokeStyle = '#fff';
  c.lineJoin = 'round';
  c.lineCap = 'round';

  // Trazo grueso a tope…
  c.lineWidth = GROSOR;
  c.stroke(figura);

  // …y se le vacía el centro a medias: queda un borde de 5 px a plena tinta y
  // el interior al 35%.
  c.globalCompositeOperation = 'destination-out';
  c.globalAlpha = 0.65;
  c.lineWidth = GROSOR - 10;
  c.stroke(figura);

  return c.getImageData(0, 0, LIENZO_ANCHO, LIENZO_ALTO);
}

interface Particula {
  /** Posición de reposo en coordenadas del lienzo de diseño. */
  hx: number;
  hy: number;
  /** Los tres vértices del triángulo, ya rotados. Se calculan una vez. */
  v: number[];
  tinte: number;
  /** Opacidad de reposo y fase/velocidad de su parpadeo. */
  o: number;
  fase: number;
  vel: number;
  /** Deriva propia: amplitud, velocidad y fase en cada eje. */
  amp: number;
  vx: number;
  vy: number;
  fx: number;
  fy: number;
  /** Profundidad para el parallax. */
  z: number;
}

function nuevaParticula(azar: () => number, hx: number, hy: number, dentro: boolean): Particula {
  const s = (dentro ? 1.5 : 1.2) + azar() * (dentro ? 2.1 : 1.4);
  const rot = azar() * Math.PI * 2;
  const cos = Math.cos(rot);
  const sen = Math.sin(rot);
  // Triángulo: punta arriba y dos vértices abajo, girado de una vez para no
  // tener que rotar el lienzo en cada cuadro.
  const base: number[] = [0, -s, s * 0.87, s * 0.5, -s * 0.87, s * 0.5];
  const v: number[] = [];
  for (let i = 0; i < 6; i += 2) {
    v.push(base[i] * cos - base[i + 1] * sen, base[i] * sen + base[i + 1] * cos);
  }

  return {
    hx,
    hy,
    v,
    tinte: REPARTO[Math.floor(azar() * REPARTO.length)],
    o: (dentro ? 0.45 : 0.18) + azar() * (dentro ? 0.55 : 0.26),
    fase: azar() * Math.PI * 2,
    vel: 0.45 + azar() * 1.1,
    // La deriva es corta a propósito: si se pasa, la figura se deshace.
    amp: (dentro ? 1.4 : 4) + azar() * (dentro ? 2.2 : 6),
    vx: 0.18 + azar() * 0.4,
    vy: 0.18 + azar() * 0.4,
    fx: azar() * Math.PI * 2,
    fy: azar() * Math.PI * 2,
    z: dentro ? 0.35 + azar() * 0.45 : 0.9 + azar() * 0.6,
  };
}

function generarParticulas(): Particula[] {
  const azar = mulberry32(20260918);
  const salida: Particula[] = [];
  const molde = moldeDeLaFigura();

  if (molde) {
    // Muestreo por rechazo: se tira un punto al azar y se acepta con la
    // probabilidad que marque el alfa del molde en ese píxel.
    let intentos = 0;
    while (salida.length < EN_FIGURA && intentos < EN_FIGURA * 400) {
      intentos++;
      const x = azar() * LIENZO_ANCHO;
      const y = azar() * LIENZO_ALTO;
      const alfa = molde.data[((y | 0) * LIENZO_ANCHO + (x | 0)) * 4 + 3];
      if (alfa > 8 && azar() < alfa / 255) salida.push(nuevaParticula(azar, x, y, true));
    }
  }

  // Partículas sueltas alrededor: le dan atmósfera y evitan que la figura
  // quede recortada contra el fondo como una calcomanía.
  for (let i = 0; i < AMBIENTE; i++) {
    const a = azar() * Math.PI * 2;
    // Bien afuera: si se acercan al contorno lo emborronan y la silueta,
    // que es lo que cuesta conseguir, se pierde.
    const r = 1.05 + azar() * 0.42;
    salida.push(
      nuevaParticula(
        azar,
        FIGURA_CX + Math.cos(a) * FIGURA_RX * r,
        FIGURA_CY + Math.sin(a) * FIGURA_RY * r,
        false,
      ),
    );
  }

  return salida;
}

/**
 * La constelación del hero.
 *
 * Va en canvas y no en SVG a propósito: son 250 partículas que derivan,
 * giran y parpadean a la vez, y en SVG eso son 250 nodos con su propia
 * animación — en los equipos del salón se nota. En canvas es un solo
 * elemento y un bucle de dibujo.
 *
 * Con `prefers-reduced-motion` dibuja un fotograma y se detiene: la figura
 * se ve igual, simplemente no se mueve. También se para cuando la pestaña
 * pasa a segundo plano o la portada sale de pantalla, para no gastar batería
 * animando algo que nadie está viendo.
 */
function Constelacion({ reduce }: { reduce: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const particulas = useMemo(() => generarParticulas(), []);

  useEffect(() => {
    const lienzo = ref.current;
    if (!lienzo) return;
    const ctx = lienzo.getContext('2d');
    if (!ctx) return;

    let ancho = 0;
    let alto = 0;
    let escala = 1;
    let tintes: string[] = [];
    let cuadro = 0;
    let visible = true;
    let enPantalla = true;

    // Parallax: el puntero mueve la nube unos pocos píxeles. `actual` persigue
    // a `destino` con un lerp para que no dé saltos.
    const destino = { x: 0, y: 0 };
    const actual = { x: 0, y: 0 };

    function leerTintes() {
      const estilo = getComputedStyle(lienzo!);
      tintes = TINTES.map((t) => estilo.getPropertyValue(t).trim() || '#6cc24a');
    }

    function medir() {
      const caja = lienzo!.getBoundingClientRect();
      if (!caja.width || !caja.height) return;
      // Tope de 2: en pantallas 3x el lienzo se vuelve enorme sin verse mejor.
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      lienzo!.width = Math.round(caja.width * dpr);
      lienzo!.height = Math.round(caja.height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ancho = caja.width;
      alto = caja.height;
      escala = Math.min(ancho / LIENZO_ANCHO, alto / LIENZO_ALTO);
    }

    function dibujar(t: number) {
      if (!ancho || !alto) return;
      ctx!.clearRect(0, 0, ancho, alto);

      actual.x += (destino.x - actual.x) * 0.06;
      actual.y += (destino.y - actual.y) * 0.06;

      // El lienzo de diseño se centra en el espacio disponible.
      const ox = (ancho - LIENZO_ANCHO * escala) / 2;
      const oy = (alto - LIENZO_ALTO * escala) / 2;

      // Halo: lo único degradado de la portada. Va solo aquí, en la
      // visualización de partículas, y nunca en los componentes.
      // Respira muy lento para que la figura no se vea plana.
      const hx = ox + FIGURA_CX * escala + actual.x * 0.4;
      const hy = oy + FIGURA_CY * escala + actual.y * 0.4;
      const halo = 250 * escala * (1 + 0.04 * Math.sin(t * 0.35));
      if (halo > 0) {
        const brillo = ctx!.createRadialGradient(hx, hy, 0, hx, hy, halo);
        brillo.addColorStop(0, tintes[0]);
        brillo.addColorStop(1, 'transparent');
        ctx!.save();
        ctx!.globalAlpha = 0.12;
        ctx!.fillStyle = brillo;
        ctx!.beginPath();
        ctx!.arc(hx, hy, halo, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.restore();
      }

      // Las partículas se agrupan por tinte y nivel de opacidad, y cada grupo
      // se traza de una vez. Con mil partículas, un `stroke` por partícula son
      // mil llamadas por cuadro; así son 36, y el parpadeo se sigue viendo
      // porque cada una va cambiando de grupo.
      const rutas: Path2D[] = [];
      for (let i = 0; i < TINTES.length * CUBOS; i++) rutas.push(new Path2D());

      for (const p of particulas) {
        const x =
          ox + (p.hx + p.amp * Math.sin(t * p.vx + p.fx)) * escala + actual.x * p.z;
        const y =
          oy + (p.hy + p.amp * Math.sin(t * p.vy + p.fy)) * escala + actual.y * p.z;

        // El parpadeo oscila alrededor de la opacidad de reposo y nunca llega
        // a cero: una partícula apagada del todo se lee como un hueco.
        const alfa = p.o * (0.62 + 0.38 * Math.sin(t * p.vel + p.fase));
        let nivel = (alfa * CUBOS) | 0;
        if (nivel > CUBOS - 1) nivel = CUBOS - 1;
        else if (nivel < 0) nivel = 0;

        const r = rutas[p.tinte * CUBOS + nivel];
        const v = p.v;
        r.moveTo(x + v[0] * escala, y + v[1] * escala);
        r.lineTo(x + v[2] * escala, y + v[3] * escala);
        r.lineTo(x + v[4] * escala, y + v[5] * escala);
        r.closePath();
      }

      ctx!.lineWidth = 1.1;
      for (let ti = 0; ti < TINTES.length; ti++) {
        ctx!.strokeStyle = tintes[ti];
        for (let n = 0; n < CUBOS; n++) {
          ctx!.globalAlpha = (n + 0.5) / CUBOS;
          ctx!.stroke(rutas[ti * CUBOS + n]);
        }
      }
      ctx!.globalAlpha = 1;
    }

    function bucle(ms: number) {
      dibujar(ms / 1000);
      cuadro = requestAnimationFrame(bucle);
    }

    function arrancar() {
      if (cuadro || reduce || !visible || !enPantalla) return;
      cuadro = requestAnimationFrame(bucle);
    }
    function parar() {
      if (!cuadro) return;
      cancelAnimationFrame(cuadro);
      cuadro = 0;
    }

    function alMover(e: PointerEvent) {
      destino.x = (e.clientX / window.innerWidth - 0.5) * 26;
      destino.y = (e.clientY / window.innerHeight - 0.5) * 26;
    }

    function alCambiarVisibilidad() {
      visible = document.visibilityState === 'visible';
      if (visible) arrancar();
      else parar();
    }

    leerTintes();
    medir();

    const observadorTamano = new ResizeObserver(() => {
      medir();
      // Un solo fotograma tras el cambio de tamaño: sin esto, con movimiento
      // reducido el lienzo queda en blanco al redimensionar.
      dibujar(performance.now() / 1000);
    });
    observadorTamano.observe(lienzo);

    const observadorPantalla = new IntersectionObserver((entradas) => {
      enPantalla = entradas.some((x) => x.isIntersecting);
      if (enPantalla) arrancar();
      else parar();
    });
    observadorPantalla.observe(lienzo);

    document.addEventListener('visibilitychange', alCambiarVisibilidad);
    if (!reduce) window.addEventListener('pointermove', alMover, { passive: true });

    dibujar(performance.now() / 1000);
    arrancar();

    return () => {
      parar();
      observadorTamano.disconnect();
      observadorPantalla.disconnect();
      document.removeEventListener('visibilitychange', alCambiarVisibilidad);
      window.removeEventListener('pointermove', alMover);
    };
  }, [particulas, reduce]);

  return <canvas ref={ref} className={styles.constelacion} aria-hidden="true" />;
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
