import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './Demos.module.css';

/**
 * Demos de la sesión de DOM.
 *
 * Las tres corren sobre DOM de verdad —un `ref` a un contenedor y las mismas
 * llamadas que el estudiante va a escribir— y no sobre una imitación en React.
 * Eso importa: lo que se ve aquí es exactamente lo que va a pasar en su
 * archivo, incluido `outerHTML` y el objeto `event` reales.
 */

/* ── 1. Selectores ─────────────────────────────────────────────────────── */

const MUESTRA = `<h3 id="titulo">Mis tareas</h3>
<ul>
  <li class="hecha">Estudiar el DOM</li>
  <li>Hacer la to-do list</li>
  <li class="hecha">Instalar Node</li>
</ul>
<p>Quedan tareas por hacer. <button type="button">Agregar</button></p>`;

const SELECTORES = [
  { sel: 'li', explica: 'todos los <li>, sin importar dónde estén' },
  { sel: '.hecha', explica: 'los que tienen class="hecha"' },
  { sel: '#titulo', explica: 'el único elemento con id="titulo"' },
  { sel: 'ul li', explica: 'los <li> que estén dentro de un <ul>' },
  { sel: 'li.hecha', explica: 'los <li> que además tengan class="hecha"' },
  { sel: 'button', explica: 'todos los botones' },
];

/**
 * Escribe un selector y mira qué agarra. Es el mismo lenguaje de CSS de la
 * sesión 6: quien ya sabe pintar con `.clase` ya sabe buscar con `.clase`.
 */
export function CazadorDeSelectores() {
  const zona = useRef<HTMLDivElement>(null);
  const [selector, setSelector] = useState('li');
  const [resultado, setResultado] = useState<{ n: number; primero: string | null; error?: string }>(
    { n: 0, primero: null },
  );

  // El marcado se escribe una sola vez y de forma imperativa. Con
  // `dangerouslySetInnerHTML` React vuelve a montar estos nodos en cada render
  // y se lleva por delante las clases que pone el demo — comprobado: el nodo
  // que devuelve querySelector deja de ser el mismo objeto.
  useEffect(() => {
    const raiz = zona.current;
    if (raiz && !raiz.hasChildNodes()) raiz.innerHTML = MUESTRA;
  }, []);

  useEffect(() => {
    const raiz = zona.current;
    if (!raiz) return;

    raiz.querySelectorAll(`.${styles.marcado}`).forEach((el) => el.classList.remove(styles.marcado));

    if (!selector.trim()) {
      setResultado({ n: 0, primero: null });
      return;
    }
    try {
      const encontrados = raiz.querySelectorAll(selector);
      encontrados.forEach((el) => el.classList.add(styles.marcado));
      const primero = raiz.querySelector(selector);
      setResultado({
        n: encontrados.length,
        primero: primero ? resumirNodo(primero) : null,
      });
    } catch {
      // Un selector a medio escribir ("li." o "#") lanza: no es un error del
      // estudiante, es que todavía no terminó de escribirlo.
      setResultado({ n: 0, primero: null, error: 'Ese selector todavía no es válido.' });
    }
  }, [selector]);

  return (
    <div className={styles.demo}>
      <div className={styles.controles}>
        <label className={styles.campo}>
          <span className={styles.rotulo}>document.querySelectorAll(</span>
          <input
            className={styles.entrada}
            value={selector}
            onChange={(e) => setSelector(e.target.value)}
            spellCheck={false}
            aria-label="Selector CSS"
          />
          <span className={styles.rotulo}>)</span>
        </label>
        <div className={styles.fichas}>
          {SELECTORES.map(({ sel }) => (
            <button
              key={sel}
              type="button"
              className={`${styles.ficha} ${sel === selector ? styles.fichaOn : ''}`}
              onClick={() => setSelector(sel)}
            >
              {sel}
            </button>
          ))}
        </div>
      </div>

      {/* Vacío a propósito: lo llena el efecto de arriba. React no conoce a
          estos hijos y por eso no los toca. */}
      <div className={styles.paginaFalsa} ref={zona} />

      <output className={styles.salida}>
        {resultado.error ? (
          <span className={styles.salidaFlojo}>{resultado.error}</span>
        ) : (
          <>
            <strong>querySelectorAll</strong> encontró{' '}
            <strong>
              {resultado.n} {resultado.n === 1 ? 'elemento' : 'elementos'}
            </strong>
            {'. '}
            <strong>querySelector</strong> devolvería{' '}
            {resultado.primero ? (
              <code>{resultado.primero}</code>
            ) : (
              <code className={styles.nulo}>null</code>
            )}
            {resultado.primero ? ' (solo el primero).' : ' — no hay ninguno que coincida.'}
          </>
        )}
      </output>
    </div>
  );
}

function resumirNodo(el: Element) {
  const texto = (el.textContent ?? '').trim();
  const corto = texto.length > 22 ? `${texto.slice(0, 22)}…` : texto;
  return `<${el.tagName.toLowerCase()}>${corto}`;
}

/* ── 2. Taller: cambiar la página desde JavaScript ─────────────────────── */

interface Operacion {
  etiqueta: string;
  codigo: string;
  /** Corre sobre el contenedor real. Devuelve `false` si no había nada que hacer. */
  aplicar: (raiz: HTMLElement) => boolean;
}

const OPERACIONES: Operacion[] = [
  {
    etiqueta: 'Cambiar el texto',
    codigo: "document.querySelector('#saludo').textContent = 'Hola, curso'",
    aplicar: (raiz) => {
      const h = raiz.querySelector('#saludo');
      if (!h) return false;
      h.textContent = 'Hola, curso';
      return true;
    },
  },
  {
    etiqueta: 'Poner y quitar una clase',
    codigo: "document.querySelector('#saludo').classList.toggle('resaltado')",
    aplicar: (raiz) => {
      const h = raiz.querySelector('#saludo');
      if (!h) return false;
      h.classList.toggle('resaltado');
      return true;
    },
  },
  {
    etiqueta: 'Crear un <li> y montarlo',
    codigo:
      "const item = document.createElement('li');\nitem.textContent = 'Tarea nueva';\ndocument.querySelector('#lista').appendChild(item);",
    aplicar: (raiz) => {
      const lista = raiz.querySelector('#lista');
      if (!lista) return false;
      const item = document.createElement('li');
      item.textContent = 'Tarea nueva';
      lista.appendChild(item);
      return true;
    },
  },
  {
    etiqueta: 'Borrar el último',
    codigo: "document.querySelector('#lista').lastElementChild.remove()",
    aplicar: (raiz) => {
      const ultimo = raiz.querySelector('#lista')?.lastElementChild;
      if (!ultimo) return false;
      ultimo.remove();
      return true;
    },
  },
  {
    etiqueta: 'innerHTML: interpreta etiquetas',
    codigo: "document.querySelector('#saludo').innerHTML = 'Hola <em>curso</em>'",
    aplicar: (raiz) => {
      const h = raiz.querySelector('#saludo');
      if (!h) return false;
      h.innerHTML = 'Hola <em>curso</em>';
      return true;
    },
  },
  {
    etiqueta: 'textContent: NO interpreta',
    codigo: "document.querySelector('#saludo').textContent = 'Hola <em>curso</em>'",
    aplicar: (raiz) => {
      const h = raiz.querySelector('#saludo');
      if (!h) return false;
      h.textContent = 'Hola <em>curso</em>';
      return true;
    },
  },
];

const HTML_INICIAL =
  '<h3 id="saludo">Hola</h3>\n<ul id="lista">\n  <li>Estudiar el DOM</li>\n  <li>Hacer la to-do list</li>\n</ul>';

/**
 * Aprieta una instrucción y mira las dos cosas a la vez: la página cambiando y
 * el HTML que resulta. Ver los dos paneles moverse juntos es lo que hace clic:
 * el DOM no es «otro archivo», es la página misma.
 */
export function TallerDom() {
  const zona = useRef<HTMLDivElement>(null);
  const [html, setHtml] = useState('');
  const [historial, setHistorial] = useState<string[]>([]);

  const leerHtml = useCallback(() => {
    const raiz = zona.current;
    if (raiz) setHtml(sangrar(raiz.innerHTML));
  }, []);

  const reiniciar = useCallback(() => {
    const raiz = zona.current;
    if (!raiz) return;
    raiz.innerHTML = HTML_INICIAL;
    setHistorial([]);
    leerHtml();
  }, [leerHtml]);

  useEffect(() => {
    reiniciar();
  }, [reiniciar]);

  function correr(op: Operacion) {
    const raiz = zona.current;
    if (!raiz) return;
    const hizo = op.aplicar(raiz);
    leerHtml();
    setHistorial((prev) => [...prev.slice(-4), hizo ? op.codigo : `// ${op.codigo} → no había nada`]);
  }

  return (
    <div className={styles.demo}>
      <div className={styles.fichas}>
        {OPERACIONES.map((op) => (
          <button key={op.etiqueta} type="button" className={styles.ficha} onClick={() => correr(op)}>
            {op.etiqueta}
          </button>
        ))}
        <button type="button" className={styles.fichaSuave} onClick={reiniciar}>
          Volver a empezar
        </button>
      </div>

      <div className={styles.dosPaneles}>
        <div className={styles.panel}>
          <p className={styles.panelTitulo}>Lo que ve el usuario</p>
          <div className={`${styles.paginaFalsa} ${styles.tallerZona}`} ref={zona} />
        </div>
        <div className={styles.panel}>
          <p className={styles.panelTitulo}>El DOM ahora mismo</p>
          <pre className={styles.codigo}>
            <code>{html}</code>
          </pre>
        </div>
      </div>

      {historial.length > 0 && (
        <div className={styles.panel}>
          <p className={styles.panelTitulo}>Lo que se ejecutó</p>
          <pre className={styles.codigo}>
            <code>{historial.join('\n')}</code>
          </pre>
        </div>
      )}
    </div>
  );
}

/** Una sangría mínima para que el HTML del panel se lea como código. */
function sangrar(html: string) {
  return html
    .replace(/></g, '>\n<')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .reduce<{ nivel: number; lineas: string[] }>(
      (acc, linea) => {
        if (/^<\//.test(linea)) acc.nivel = Math.max(0, acc.nivel - 1);
        acc.lineas.push('  '.repeat(acc.nivel) + linea);
        if (/^<[a-z]/i.test(linea) && !/^<\//.test(linea) && !/\/>$/.test(linea) && !/<\/[a-z]+>$/i.test(linea)) {
          acc.nivel += 1;
        }
        return acc;
      },
      { nivel: 0, lineas: [] },
    )
    .lineas.join('\n');
}

/* ── 3. El objeto event ────────────────────────────────────────────────── */

interface Registro {
  type: string;
  target: string;
  currentTarget: string;
  extra?: string;
}

/**
 * Un solo `addEventListener`, puesto en la lista entera. Al hacer clic en
 * cualquier hijo se ve que `currentTarget` siempre es la lista y `target` es lo
 * que se tocó: eso es delegación, y es la respuesta a «¿y cómo le pongo el
 * listener a algo que todavía no existe?».
 */
export function MiradorDeEventos() {
  const [ultimo, setUltimo] = useState<Registro | null>(null);
  const [evitarEnvio, setEvitarEnvio] = useState(true);
  const [aviso, setAviso] = useState<string | null>(null);

  function anotar(e: React.SyntheticEvent, extra?: string) {
    const target = e.target as HTMLElement;
    const currentTarget = e.currentTarget as HTMLElement;
    setUltimo({
      type: e.type,
      target: `<${target.tagName.toLowerCase()}>${(target.textContent ?? '').trim().slice(0, 18)}`,
      currentTarget: `<${currentTarget.tagName.toLowerCase()}>`,
      extra,
    });
  }

  return (
    <div className={styles.demo}>
      <div className={styles.dosPaneles}>
        <div className={styles.panel}>
          <p className={styles.panelTitulo}>Un solo listener, en el &lt;ul&gt;</p>
          <ul
            className={styles.listaEventos}
            onClick={(e) => {
              anotar(e);
              setAviso(null);
            }}
          >
            <li>
              Estudiar el DOM <button type="button">✕</button>
            </li>
            <li>
              Hacer la to-do list <button type="button">✕</button>
            </li>
            <li>
              Instalar Node <button type="button">✕</button>
            </li>
          </ul>

          <form
            className={styles.formulario}
            onSubmit={(e) => {
              e.preventDefault(); // siempre: si no, esta página se recargaría
              anotar(e);
              setAviso(
                evitarEnvio
                  ? 'preventDefault() puesto: la página no se recarga y tu JavaScript sigue mandando.'
                  : 'Sin preventDefault() el navegador recargaría la página aquí mismo, y perderías todo lo que llevabas.',
              );
            }}
          >
            <input
              className={styles.entrada}
              placeholder="Escribe algo y dale Enter"
              onKeyDown={(e) => {
                if (e.key !== 'Enter') anotar(e, `event.key           → ${e.key}`);
              }}
              aria-label="Campo de prueba"
            />
            <button type="submit" className={styles.ficha}>
              Enviar
            </button>
          </form>

          <label className={styles.interruptor}>
            <input
              type="checkbox"
              checked={evitarEnvio}
              onChange={(e) => setEvitarEnvio(e.target.checked)}
            />
            <span>Usar e.preventDefault() en el submit</span>
          </label>
        </div>

        <div className={styles.panel}>
          <p className={styles.panelTitulo}>El objeto event</p>
          {ultimo ? (
            <pre className={styles.codigo}>
              <code>
                {`event.type          → ${ultimo.type}\n`}
                {`event.target        → ${ultimo.target}\n`}
                {`event.currentTarget → ${ultimo.currentTarget}`}
                {ultimo.extra ? `\n${ultimo.extra}` : ''}
              </code>
            </pre>
          ) : (
            <p className={styles.salidaFlojo}>
              Haz clic en una tarea, en una ✕, o escribe en el campo.
            </p>
          )}
          {aviso && <p className={styles.aviso}>{aviso}</p>}
          <p className={styles.notaPanel}>
            <code>target</code> es lo que tocaste. <code>currentTarget</code> es dónde está puesto
            el listener — y siempre es el mismo, aunque hagas clic en la ✕.
          </p>
        </div>
      </div>
    </div>
  );
}
