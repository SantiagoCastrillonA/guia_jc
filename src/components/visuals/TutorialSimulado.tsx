import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import styles from './TutorialSimulado.module.css';

/*
 * Tutorial animado paso a paso: instalar MongoDB, configurar Atlas, crear un
 * proyecto de React con Vite…
 *
 * A la izquierda, una pantalla simulada sobre un lienzo fijo de 880 × 540 que
 * se escala al ancho disponible, con un cursor que hace cada clic. A la
 * derecha, el paso explicado en texto: la simulación es apoyo, el texto es la
 * instrucción. Puede tener varias rutas (pestañas): Windows o macOS, en el
 * navegador o en el computador.
 *
 * Aquí viven el motor y el marco. Las pantallas (HTML como cadenas) y su
 * aspecto los pone cada tema: `clasePantalla` es la clase de su módulo CSS,
 * con la paleta de las apps que imita y sus piezas bajo `:global(...)`.
 *
 * Las pantallas se montan con `innerHTML`. Son constantes de cada tema —nada
 * viene de un usuario—, así que no hay nada que escapar. Van en cadenas y no
 * en JSX porque el motor las manipula a mano (escribe letra por letra, marca
 * casillas, mueve el cursor) y eso con React sería re-renderizar a cada letra.
 *
 * Acciones del motor, `[op, selector, arg, arg2]`:
 *   move · click · type (campo `.in`) · typeplain · set · text · mark · unmark
 *   paste · replace · show · hide · add · rm · wait (ms) · key (tecla en
 *   pantalla) · cmd (comando en la terminal: usa el `data-prompt` del
 *   `.term-body`) · prompt (cambia ese `data-prompt`) · out · drag
 */

export type Accion = readonly [op: string, sel?: string | number, arg?: string, arg2?: string];

export interface Paso {
  nombre: string;
  etiqueta: string;
  titulo: string;
  cuerpo: string[];
  nota: readonly [tipo: 'tip' | 'warn' | 'info', titulo: string, texto: string];
  pantalla: () => string;
  acciones: readonly Accion[];
}

export interface Ruta {
  id: string;
  nombre: string;
  detalle: string;
  pasos: Paso[];
}
const CURSOR = `<svg class="cursor" id="cur" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 2l15 11-6.5 1.2L16 21l-3 1.4-3.4-6.8L4 20z" fill="#fff" stroke="#111" stroke-width="1.4" stroke-linejoin="round"/></svg>`;
const ANCHO_ESCENA = 880;

/* ── motor de animación ─────────────────────────────────────────────────── */

interface Motor {
  escena: HTMLDivElement;
  escala: () => number;
  /** Con movimiento reducido todo pasa de golpe: sin esperas ni tecleo. */
  rapido: boolean;
  /** Falso en cuanto el paso cambia o el componente se desmonta. */
  vivo: () => boolean;
}

const dormir = (m: Motor, ms: number) =>
  m.rapido ? Promise.resolve() : new Promise<void>((r) => setTimeout(r, ms));

const buscar = (m: Motor, sel: string) => m.escena.querySelector<HTMLElement>(sel);

function escapar(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function posicion(m: Motor, el: HTMLElement) {
  const a = el.getBoundingClientRect();
  const b = m.escena.getBoundingClientRect();
  const k = m.escala();
  return { x: (a.left - b.left + a.width / 2) / k, y: (a.top - b.top + a.height / 2) / k };
}

async function moverA(m: Motor, el: HTMLElement | null) {
  const cursor = buscar(m, '#cur');
  if (!cursor || !el) return;
  const p = posicion(m, el);
  cursor.style.transform = `translate(${p.x - 4}px, ${p.y - 2}px)`;
  await dormir(m, 760);
}

async function presionar(m: Motor, el: HTMLElement | null) {
  if (!el) return;
  if (!m.rapido) {
    const p = posicion(m, el);
    const onda = document.createElement('div');
    onda.className = 'ripple';
    onda.style.left = `${p.x}px`;
    onda.style.top = `${p.y}px`;
    m.escena.appendChild(onda);
    setTimeout(() => onda.remove(), 520);
  }
  el.classList.add('pressed');
  await dormir(m, 180);
  el.classList.remove('pressed');
}

function enfocar(m: Motor, el: HTMLElement | null) {
  m.escena.querySelectorAll('.in.focus').forEach((f) => f.classList.remove('focus'));
  el?.classList.add('focus');
}

function agregarSalida(el: HTMLElement, texto: string) {
  const linea = document.createElement('div');
  linea.className = 'ou';
  // Se deja pasar solo <g> (verde, éxito) y <u> (enlace): el resto se escapa.
  linea.innerHTML = escapar(texto).replace(/&lt;(\/?)(g|u)&gt;/g, '<$1$2>');
  el.appendChild(linea);
}

async function teclear(m: Motor, span: Element | null, texto: string, velocidad: number) {
  if (!span) return;
  if (m.rapido) {
    span.textContent = texto;
    return;
  }
  for (const letra of texto) {
    if (!m.vivo()) return;
    span.textContent += letra;
    await dormir(m, velocidad);
  }
}

async function ejecutar(m: Motor, [op, sel, arg = '', arg2]: Accion) {
  // En 'key' el segundo valor es la tecla ("Ctrl + S"), no un selector.
  const el = typeof sel === 'string' && op !== 'key' ? buscar(m, sel) : null;
  switch (op) {
    case 'move':
      await moverA(m, el);
      break;
    case 'click':
      await moverA(m, el);
      await presionar(m, el);
      if (el?.classList.contains('in')) enfocar(m, el);
      break;
    case 'type':
      await moverA(m, el);
      await presionar(m, el);
      enfocar(m, el);
      await teclear(m, el?.querySelector('.v') ?? null, arg, 55);
      break;
    case 'typeplain':
      await teclear(m, el, arg, 90);
      break;
    case 'set': {
      const v = el?.querySelector('.v');
      if (v) v.textContent = arg;
      break;
    }
    case 'text':
      if (el) el.textContent = arg;
      break;
    case 'mark': {
      const v = el?.querySelector('.v');
      if (v)
        v.innerHTML = escapar(v.textContent ?? '').replace(
          escapar(arg),
          `<span class="hl">${escapar(arg)}</span>`,
        );
      break;
    }
    case 'unmark': {
      const v = el?.querySelector('.v');
      if (v) v.textContent = v.textContent ?? '';
      break;
    }
    case 'paste': {
      enfocar(m, el);
      const v = el?.querySelector('.v');
      if (v) v.textContent = arg;
      await dormir(m, 200);
      break;
    }
    case 'replace': {
      const v = el?.querySelector('.v');
      if (v) v.textContent = (v.textContent ?? '').replace(arg, arg2 ?? '');
      break;
    }
    case 'show':
      if (el) el.hidden = false;
      await dormir(m, 250);
      break;
    case 'hide':
      if (el) el.hidden = true;
      break;
    case 'add':
      el?.classList.add(arg);
      break;
    case 'rm':
      el?.classList.remove(arg);
      break;
    case 'wait':
      await dormir(m, typeof sel === 'number' ? sel : 0);
      break;
    case 'cmd': {
      if (!el) break;
      const linea = document.createElement('div');
      linea.innerHTML = `<span class="pr"></span><span class="c"></span><span class="caret"></span>`;
      const prompt = linea.querySelector('.pr');
      if (prompt) prompt.textContent = el.dataset.prompt ?? '';
      el.appendChild(linea);
      await teclear(m, linea.querySelector('.c'), arg, arg.length > 40 ? 12 : 55);
      linea.querySelector('.caret')?.remove();
      await dormir(m, 350);
      if (arg2) agregarSalida(el, arg2);
      await dormir(m, 500);
      break;
    }
    case 'prompt':
      if (el) el.dataset.prompt = arg;
      break;
    case 'out':
      if (el) agregarSalida(el, arg);
      await dormir(m, 400);
      break;
    case 'key': {
      // La tecla o el atajo aparece un momento sobre la pantalla.
      enfocar(m, null);
      const tecla = document.createElement('div');
      tecla.className = 'keycap';
      tecla.textContent = typeof sel === 'string' ? sel : '';
      m.escena.appendChild(tecla);
      await dormir(m, 900);
      tecla.remove();
      break;
    }
    case 'drag': {
      const hacia = buscar(m, arg);
      if (!el || !hacia) break;
      const a = posicion(m, el);
      const b = posicion(m, hacia);
      const fantasma = document.createElement('div');
      fantasma.className = 'ghost';
      fantasma.style.transform = `translate(${a.x - 24}px, ${a.y - 24}px)`;
      m.escena.appendChild(fantasma);
      fantasma.getBoundingClientRect();
      fantasma.style.transform = `translate(${b.x - 24}px, ${b.y - 24}px)`;
      await moverA(m, hacia);
      await dormir(m, 200);
      fantasma.remove();
      break;
    }
  }
}

/* ── componente ─────────────────────────────────────────────────────────── */

interface PropsTutorial {
  /** El comando del rótulo, sin el `$` (lo pone el CSS). */
  prompt: string;
  titulo: string;
  /** Una ruta por pestaña. Con una sola, la pestaña se muestra como rótulo. */
  rutas: readonly Ruta[];
  /** Qué eligen las pestañas, para lectores de pantalla ("Sistema operativo"). */
  etiquetaRutas?: string;
  mensajeFin: string;
  /** Clase del módulo CSS del tema con la paleta y las piezas de sus pantallas. */
  clasePantalla: string;
  /** Color del rótulo, del botón principal, del paso en curso y del clic. */
  acento?: string;
  /** Baja la etiqueta "simulación" a la esquina inferior: en las pantallas de
   *  Atlas, arriba a la derecha tapaba el nombre del usuario. */
  simAbajo?: boolean;
}

export function TutorialSimulado({
  prompt,
  titulo,
  rutas,
  etiquetaRutas = 'Ruta del tutorial',
  mensajeFin,
  clasePantalla,
  acento = 'var(--color-accent)',
  simAbajo,
}: PropsTutorial) {
  const idBase = useId();
  const [ruta, setRuta] = useState(rutas[0].id);
  const [paso, setPaso] = useState(0);
  const [auto, setAuto] = useState(false);
  const [terminado, setTerminado] = useState(false);
  /** Subirlo repite el paso actual (botón "Repetir" o tecla R). */
  const [vuelta, setVuelta] = useState(0);

  const vistaRef = useRef<HTMLDivElement>(null);
  const escenaRef = useRef<HTMLDivElement>(null);
  const pasosRef = useRef<HTMLOListElement>(null);
  const escalaRef = useRef(1);
  const autoRef = useRef(auto);

  const pasos = (rutas.find((r) => r.id === ruta) ?? rutas[0]).pasos;
  const actual = pasos[paso];

  useEffect(() => {
    autoRef.current = auto;
  }, [auto]);

  // El lienzo mide 880 px de diseño y se escala al ancho que haya.
  useEffect(() => {
    const vista = vistaRef.current;
    const escena = escenaRef.current;
    if (!vista || !escena) return;
    const ajustar = () => {
      escalaRef.current = vista.clientWidth / ANCHO_ESCENA;
      escena.style.transform = `scale(${escalaRef.current})`;
    };
    ajustar();
    const observador = new ResizeObserver(ajustar);
    observador.observe(vista);
    return () => observador.disconnect();
  }, []);

  // Cada cambio de ruta, de paso o de "vuelta" monta la pantalla y la anima.
  useEffect(() => {
    const escena = escenaRef.current;
    if (!escena) return;
    let vivo = true;
    let temporizador = 0;
    const lista = (rutas.find((r) => r.id === ruta) ?? rutas[0]).pasos;
    const p = lista[paso];

    const motor: Motor = {
      escena,
      escala: () => escalaRef.current,
      rapido: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      vivo: () => vivo,
    };

    escena.innerHTML = `${p.pantalla()}${CURSOR}<div class="sim">simulación</div>`;
    const cursor = buscar(motor, '#cur');
    if (cursor) {
      // El cursor arranca abajo a la derecha, sin animar ese primer salto.
      cursor.style.transition = 'none';
      cursor.style.transform = 'translate(700px, 470px)';
      cursor.getBoundingClientRect();
      cursor.style.transition = '';
    }

    (async () => {
      await dormir(motor, 350);
      for (const accion of p.acciones) {
        if (!vivo) return;
        await ejecutar(motor, accion);
      }
      if (!vivo) return;
      enfocar(motor, null);
      if (autoRef.current) {
        temporizador = window.setTimeout(() => {
          if (!autoRef.current) return;
          if (paso < lista.length - 1) setPaso(paso + 1);
          else setAuto(false);
        }, 2600);
      }
    })();

    return () => {
      vivo = false;
      clearTimeout(temporizador);
    };
  }, [rutas, ruta, paso, vuelta]);

  // En pantallas angostas la fila de pasos se desliza de lado: se centra en el
  // paso actual. Se mueve el `scrollLeft` de la fila y no se usa
  // `scrollIntoView`, que además desplazaría la página hacia arriba o abajo.
  useEffect(() => {
    const fila = pasosRef.current;
    const actualLi = fila?.querySelector<HTMLElement>('[aria-current="step"]');
    if (!fila || !actualLi || fila.scrollWidth <= fila.clientWidth) return;
    // Medido contra la propia fila: `offsetLeft` se mide contra el ancestro
    // posicionado más cercano, que aquí es la sección de la lección.
    const caja = fila.getBoundingClientRect();
    const item = actualLi.getBoundingClientRect();
    fila.scrollTo({
      left: fila.scrollLeft + item.left - caja.left - caja.width / 2 + item.width / 2,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  }, [paso, ruta]);

  function ir(k: number) {
    setTerminado(false);
    setPaso(Math.max(0, Math.min(pasos.length - 1, k)));
  }

  function cambiarRuta(r: string) {
    setRuta(r);
    setTerminado(false);
    setPaso(0);
  }

  function siguiente() {
    if (paso === pasos.length - 1) {
      setAuto(false);
      setTerminado(true);
      return;
    }
    ir(paso + 1);
  }

  function alternarAuto() {
    const nuevo = !auto;
    setAuto(nuevo);
    // Al encenderlo, el paso actual se repite y luego sigue solo.
    if (nuevo) setVuelta((n) => n + 1);
  }

  // Las teclas solo cuentan con el foco dentro del tutorial: a nivel de
  // documento, la R le robaría letras a cualquier ejercicio de la página.
  function alTeclado(e: KeyboardEvent<HTMLDivElement>) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const destino = e.target as HTMLElement;
    if (destino.closest('input, textarea, [contenteditable="true"]')) return;
    if (e.key === 'ArrowRight') ir(paso + 1);
    else if (e.key === 'ArrowLeft') ir(paso - 1);
    else if (e.key.toLowerCase() === 'r') setVuelta((n) => n + 1);
  }

  const [tipoNota, tituloNota, textoNota] = actual.nota;

  return (
    <div
      className={styles.raiz}
      tabIndex={-1}
      onKeyDown={alTeclado}
      style={{ '--acento': acento } as CSSProperties}
    >
      <div className={styles.cabecera}>
        <div>
          <div className={styles.prompt}>{prompt}</div>
          <p className={styles.titulo}>{titulo}</p>
        </div>
        {rutas.length > 1 ? (
          <div className={styles.pestanas} role="tablist" aria-label={etiquetaRutas}>
            {rutas.map((r) => (
              <button
                key={r.id}
                type="button"
                role="tab"
                id={`${idBase}-tab-${r.id}`}
                aria-selected={ruta === r.id}
                aria-controls={`${idBase}-panel`}
                className={styles.pestana}
                onClick={() => cambiarRuta(r.id)}
              >
                {r.nombre}
                <small>{r.detalle}</small>
              </button>
            ))}
          </div>
        ) : (
          <div className={styles.pestanas}>
            <span className={styles.pestana} aria-selected="true">
              {rutas[0].nombre}
              <small>{rutas[0].detalle}</small>
            </span>
          </div>
        )}
      </div>

      <div
        className={styles.cuerpo}
        id={`${idBase}-panel`}
        role={rutas.length > 1 ? 'tabpanel' : undefined}
        aria-labelledby={rutas.length > 1 ? `${idBase}-tab-${ruta}` : undefined}
      >
        {/* Los controles van bajo la pantalla, como los de un video, y no en la
            tarjeta del paso: dentro de ella la alargaban hasta 200 px más que
            la pantalla en un portátil de 1366 px, y quedaba un hueco abajo. */}
        <div className={styles.columnaPantalla}>
          <section className={styles.ventana}>
            <div className={styles.ventanaBarra}>
              <span className={styles.punto} data-c="rojo" />
              <span className={styles.punto} data-c="amarillo" />
              <span className={styles.punto} data-c="verde" />
              <span className={styles.ventanaEtiqueta}>{actual.etiqueta}</span>
            </div>
            <div
              className={`${styles.vista} ${clasePantalla}`}
              ref={vistaRef}
              role="img"
              aria-label={`Simulación: ${actual.titulo}`}
            >
              <div
                className={styles.escena}
                ref={escenaRef}
                data-sim={simAbajo ? 'abajo' : undefined}
              />
            </div>
          </section>

          <div className={styles.controles}>
            <button type="button" className={styles.boton} onClick={() => ir(paso - 1)} disabled={paso === 0}>
              ← Anterior
            </button>
            <button type="button" className={styles.boton} onClick={() => setVuelta((n) => n + 1)}>
              ↻ Repetir
            </button>
            <button type="button" className={`${styles.boton} ${styles.botonPri}`} onClick={siguiente}>
              {paso === pasos.length - 1 ? 'Terminar ✓' : 'Siguiente →'}
            </button>
            <button type="button" className={styles.boton} aria-pressed={auto} onClick={alternarAuto}>
              {auto ? 'Avanzando solo…' : 'Avanzar solo'}
            </button>
            <span className={styles.pista}>← → para moverte · R para repetir</span>
          </div>
        </div>

        <aside className={styles.panel}>
          <div className={styles.tarjeta} aria-live="polite">
            <div className={styles.numero}>
              {terminado ? mensajeFin : `Paso ${paso + 1} de ${pasos.length}`}
            </div>
            <h3 className={styles.tituloPaso}>{actual.titulo}</h3>
            <ol className={styles.lista}>
              {actual.cuerpo.map((linea, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: linea }} />
              ))}
            </ol>
            <div className={styles.nota} data-tipo={tipoNota}>
              <b>{tituloNota}</b>
              <span dangerouslySetInnerHTML={{ __html: textoNota }} />
            </div>
          </div>
        </aside>
      </div>

      {/* El progreso va en fila y a todo el ancho, no como lista junto al
          panel: vertical, sus ocho renglones alargaban la columna derecha y
          dejaban un hueco enorme bajo la pantalla simulada. */}
      <ol className={styles.pasos} ref={pasosRef} aria-label="Pasos del tutorial">
        {pasos.map((s, k) => {
          const hecho = terminado || k < paso;
          const esActual = !terminado && k === paso;
          return (
            <li
              key={k}
              data-estado={esActual ? 'actual' : hecho ? 'hecho' : undefined}
              aria-current={esActual ? 'step' : undefined}
            >
              <button type="button" onClick={() => ir(k)}>
                <span className={styles.circulo}>{hecho ? '✓' : k + 1}</span>
                <span className={styles.nombrePaso}>{s.nombre}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
