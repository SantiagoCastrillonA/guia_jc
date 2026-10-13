import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import styles from './ReproductorEscenas.module.css';

/*
 * Reproductor de escenas animadas: el formato de "video que se lee" de las
 * explicaciones del curso (MongoDB vs SQL, Mongoose…).
 *
 * Cada escena es HTML sobre un lienzo fijo de 1280 × 720 que se escala al
 * ancho. Sus piezas traen `data-t` (a qué milisegundo aparecen), a veces
 * `data-type` (texto que se teclea), `data-at="ms:clase,ms:clase"` (a qué
 * milisegundo cambian de estado) y `data-seq="ms:texto|ms:texto"` (a qué
 * milisegundo cambia su texto). El reproductor programa esos tiempos, lleva
 * la barra de progreso y, si está en "reproducir", pasa solo a la siguiente.
 *
 * Aquí viven el motor y el marco (controles, narración). El aspecto de las
 * piezas lo pone cada tema con su propio módulo CSS, a través de
 * `claseEscenas`: cada video tiene medidas y colores afinados para su lienzo.
 *
 * Las escenas son HTML escrito como cadenas constantes del tema y se montan
 * con `innerHTML`: nada viene de un usuario.
 */

export interface Escena {
  titulo: string;
  /** Narración bajo el reproductor. Admite <b> y <code>. */
  texto: string;
  /** Cuánto se queda la escena completa en pantalla antes de pasar. */
  pausa: number;
  html: string;
}

interface Props {
  /** El comando del rótulo, sin el `$` (lo pone el CSS). */
  prompt: string;
  titulo: string;
  leyenda: readonly { color: string; texto: string }[];
  escenas: readonly Escena[];
  /** Clase del módulo CSS del tema con las variables y piezas de sus escenas. */
  claseEscenas: string;
  /** Color de la barra, el botón principal y los puntos. */
  acento: string;
}

const ANCHO_LIENZO = 1280;

export function ReproductorEscenas({ prompt, titulo, leyenda, escenas, claseEscenas, acento }: Props) {
  const [escena, setEscena] = useState(0);
  const [reproduciendo, setReproduciendo] = useState(true);
  /** Subirlo repite la escena actual. */
  const [vuelta, setVuelta] = useState(0);
  /** No arranca hasta que el reproductor se ve por primera vez. */
  const [activo, setActivo] = useState(false);

  const raizRef = useRef<HTMLDivElement>(null);
  const vistaRef = useRef<HTMLDivElement>(null);
  const lienzoRef = useRef<HTMLDivElement>(null);
  const barraRef = useRef<HTMLElement>(null);
  const reproduciendoRef = useRef(reproduciendo);
  const visibleRef = useRef(false);
  const finRef = useRef(0);

  useEffect(() => {
    reproduciendoRef.current = reproduciendo;
  }, [reproduciendo]);

  // El lienzo mide 1280 px de diseño y se escala al ancho que haya.
  useEffect(() => {
    const vista = vistaRef.current;
    const lienzo = lienzoRef.current;
    if (!vista || !lienzo) return;
    const ajustar = () => {
      lienzo.style.transform = `scale(${vista.clientWidth / ANCHO_LIENZO})`;
    };
    ajustar();
    const observador = new ResizeObserver(ajustar);
    observador.observe(vista);
    return () => observador.disconnect();
  }, []);

  // Arranca al verse y no avanza de escena mientras está fuera de pantalla: en
  // una lección larga, si corriera desde que carga la página, el estudiante
  // llegaría a la mitad de la explicación.
  useEffect(() => {
    const raiz = raizRef.current;
    if (!raiz) return;
    const observador = new IntersectionObserver(
      ([entrada]) => {
        visibleRef.current = entrada.isIntersecting;
        if (entrada.isIntersecting) setActivo(true);
      },
      { threshold: 0.4 },
    );
    observador.observe(raiz);
    return () => observador.disconnect();
  }, []);

  // La línea de tiempo de la escena: programa cada pieza y lleva la barra.
  useEffect(() => {
    const lienzo = lienzoRef.current;
    if (!activo || !lienzo) return;
    const rapido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const temporizadores: number[] = [];
    let cuadro = 0;
    const en = (ms: number, fn: () => void) =>
      temporizadores.push(window.setTimeout(fn, rapido ? 0 : ms));

    const teclear = (el: HTMLElement, texto: string) => {
      if (rapido) {
        el.textContent = texto;
        el.classList.add('done');
        return;
      }
      let i = 0;
      el.textContent = '';
      const paso = () => {
        el.textContent = texto.slice(0, ++i);
        if (i < texto.length) temporizadores.push(window.setTimeout(paso, 45));
        else el.classList.add('done');
      };
      paso();
    };

    const sc = escenas[escena];
    lienzo.innerHTML = sc.html;
    let maxT = 0;
    lienzo.querySelectorAll<HTMLElement>('[data-t]').forEach((el) => {
      const t = Number(el.dataset.t);
      maxT = Math.max(maxT, t);
      const texto = el.dataset.type;
      if (texto) en(t, () => teclear(el, texto));
      else en(t, () => el.classList.add('in'));
    });
    lienzo.querySelectorAll<HTMLElement>('[data-at]').forEach((el) => {
      (el.dataset.at ?? '').split(',').forEach((par) => {
        const [ms, clase] = par.split(':');
        maxT = Math.max(maxT, Number(ms));
        en(Number(ms), () => el.classList.add(clase));
      });
    });
    // Textos que cambian con el tiempo (un contador que sube, un hueco que se
    // llena): data-seq="ms:texto|ms:texto". El de 0 ms es el texto inicial.
    lienzo.querySelectorAll<HTMLElement>('[data-seq]').forEach((el) => {
      (el.dataset.seq ?? '').split('|').forEach((par) => {
        const k = par.indexOf(':');
        const ms = Number(par.slice(0, k));
        const texto = par.slice(k + 1);
        maxT = Math.max(maxT, ms);
        if (ms === 0) el.innerHTML = texto;
        else
          en(ms, () => {
            el.innerHTML = texto;
          });
      });
    });

    const inicio = performance.now();
    const fin = inicio + maxT + sc.pausa;
    finRef.current = fin;

    const avanzar = () => {
      const p = Math.min(1, (performance.now() - inicio) / (fin - inicio));
      if (barraRef.current) {
        barraRef.current.style.transform = `scaleX(${(escena + p) / escenas.length})`;
      }
      if (p < 1) {
        cuadro = requestAnimationFrame(avanzar);
        return;
      }
      if (escena === escenas.length - 1) {
        setReproduciendo(false);
        return;
      }
      if (!reproduciendoRef.current) return;
      // Terminó la escena pero el reproductor no se ve: espera a que vuelva.
      if (!visibleRef.current) {
        cuadro = requestAnimationFrame(avanzar);
        return;
      }
      setEscena(escena + 1);
    };
    avanzar();

    return () => {
      temporizadores.forEach(clearTimeout);
      cancelAnimationFrame(cuadro);
    };
  }, [activo, escenas, escena, vuelta]);

  function ir(k: number) {
    setEscena(Math.max(0, Math.min(escenas.length - 1, k)));
    setVuelta((n) => n + 1);
  }

  function alternar() {
    const nuevo = !reproduciendo;
    setReproduciendo(nuevo);
    // Si la escena ya había terminado, "reproducir" sigue con la próxima; en la
    // última, vuelve a empezar.
    if (nuevo && performance.now() >= finRef.current) {
      ir(escena === escenas.length - 1 ? 0 : escena + 1);
    }
  }

  // Teclas solo con el foco dentro del reproductor: a nivel de documento, la
  // R y el Espacio les robarían teclas a los ejercicios de la página.
  function alTeclado(e: KeyboardEvent<HTMLDivElement>) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const destino = e.target as HTMLElement;
    if (destino.closest('input, textarea, [contenteditable="true"]')) return;
    // Sobre un botón, Espacio y Enter lo activan: no se toca.
    if (destino.closest('button') && (e.key === ' ' || e.key === 'Enter')) return;
    if (e.key === ' ') {
      e.preventDefault();
      alternar();
    } else if (e.key === 'ArrowRight') ir(escena + 1);
    else if (e.key === 'ArrowLeft') ir(escena - 1);
    else if (e.key.toLowerCase() === 'r') ir(escena);
  }

  const sc = escenas[escena];

  return (
    <div
      className={styles.raiz}
      ref={raizRef}
      tabIndex={-1}
      onKeyDown={alTeclado}
      style={{ '--acento': acento } as CSSProperties}
    >
      <div className={styles.cabecera}>
        <div>
          <div className={styles.prompt}>{prompt}</div>
          <p className={styles.titulo}>{titulo}</p>
        </div>
        <div className={styles.leyenda}>
          {leyenda.map((l) => (
            <span key={l.texto} style={{ '--c': l.color } as CSSProperties}>
              {l.texto}
            </span>
          ))}
        </div>
      </div>

      <section className={styles.reproductor}>
        <div className={styles.vista} ref={vistaRef} role="img" aria-label={`Escena: ${sc.titulo}`}>
          <div className={`${styles.lienzo} ${claseEscenas}`} ref={lienzoRef} />
        </div>
        <div className={styles.progreso}>
          <i ref={barraRef} />
        </div>
        <div className={styles.controles}>
          <button type="button" className={styles.boton} onClick={() => ir(escena - 1)} disabled={escena === 0}>
            ← Anterior
          </button>
          <button type="button" className={`${styles.boton} ${styles.botonPri}`} onClick={alternar}>
            {reproduciendo ? '❚❚ Pausa' : '▶ Reproducir'}
          </button>
          <button type="button" className={styles.boton} onClick={() => ir(escena)}>
            ↻ Repetir escena
          </button>
          <button
            type="button"
            className={styles.boton}
            onClick={() => ir(escena + 1)}
            disabled={escena === escenas.length - 1}
          >
            Siguiente →
          </button>
          <div className={styles.puntos}>
            {escenas.map((s, k) => (
              <button
                key={k}
                type="button"
                data-estado={k === escena ? 'actual' : k < escena ? 'hecho' : undefined}
                aria-label={`Escena ${k + 1}: ${s.titulo}`}
                aria-current={k === escena ? 'step' : undefined}
                title={s.titulo}
                onClick={() => ir(k)}
              >
                {k + 1}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.narracion} aria-live="polite">
        <div className={styles.numero}>
          Escena {escena + 1} de {escenas.length}
        </div>
        <h3 className={styles.tituloEscena}>{sc.titulo}</h3>
        <p className={styles.texto} dangerouslySetInnerHTML={{ __html: sc.texto }} />
        <div className={styles.pista}>Espacio: pausa/continúa · ← → cambiar de escena · R repetir</div>
      </section>
    </div>
  );
}
