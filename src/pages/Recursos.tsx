import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ETIQUETA_TIPO,
  GRUPOS,
  RECURSOS,
  dominioDe,
  type Recurso,
  type TipoRecurso,
} from '../data/recursos';
import { topics } from '../data/topics';
import styles from './Recursos.module.css';

/**
 * Los enlaces de fuera del curso. La página no escribe ninguno: todos salen de
 * `src/data/recursos.ts`, igual que las sesiones salen de `topics.ts`.
 */

const TIPOS: (TipoRecurso | 'todos')[] = [
  'todos',
  'referencia',
  'practica',
  'video',
  'herramienta',
  'servicio',
];

/** Sin tildes ni mayúsculas: buscar "practica" tiene que encontrar "práctica". */
function normalizar(texto: string) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

export default function Recursos() {
  const [busqueda, setBusqueda] = useState('');
  const [tipo, setTipo] = useState<TipoRecurso | 'todos'>('todos');

  useEffect(() => {
    document.title = 'Recursos — Jóvenes creaTIvos';
  }, []);

  const grupos = useMemo(() => {
    const q = normalizar(busqueda.trim());
    return GRUPOS.map((grupo) => ({
      ...grupo,
      recursos: grupo.recursos.filter((r) => {
        if (tipo !== 'todos' && r.tipo !== tipo) return false;
        if (!q) return true;
        return (
          normalizar(r.nombre).includes(q) ||
          normalizar(r.descripcion).includes(q) ||
          normalizar(dominioDe(r.url)).includes(q)
        );
      }),
    })).filter((grupo) => grupo.recursos.length > 0);
  }, [busqueda, tipo]);

  const encontrados = grupos.reduce((n, g) => n + g.recursos.length, 0);
  const filtrando = busqueda.trim() !== '' || tipo !== 'todos';

  return (
    <div className={styles.pagina}>
      <div className={styles.ancho}>
        <header className={styles.hero}>
          <Link to="/" className={styles.volver}>
            ← Volver al inicio
          </Link>
          <span className="kicker">Fuera de clase</span>
          <h1 className={styles.titular}>Dónde seguir aprendiendo</h1>
          <p className={styles.entrada}>
            {RECURSOS.length} sitios escogidos a mano: para consultar lo que se te olvidó, para
            practicar hasta que salga solo, y para cuando algo no funciona y no sabes por qué.
            Todos son gratis o tienen una parte gratis de verdad.
          </p>
        </header>

        <div className={styles.controles}>
          <label className={styles.buscador}>
            <Lupa />
            <input
              type="search"
              className={styles.entradaBusqueda}
              placeholder="Buscar: flexbox, git, react, api…"
              aria-label="Buscar un recurso"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </label>

          <div className={styles.filtros} role="group" aria-label="Filtrar por tipo">
            {TIPOS.map((t) => (
              <button
                key={t}
                type="button"
                className={`${styles.filtro} ${t === tipo ? styles.filtroOn : ''}`}
                aria-pressed={t === tipo}
                onClick={() => setTipo(t)}
              >
                {t === 'todos' ? 'Todos' : ETIQUETA_TIPO[t]}
              </button>
            ))}
          </div>
        </div>

        {filtrando && (
          <p className={styles.cuenta} role="status">
            {encontrados === 0
              ? 'Ningún recurso coincide.'
              : `${encontrados} ${encontrados === 1 ? 'recurso' : 'recursos'}.`}
          </p>
        )}

        {grupos.map((grupo) => (
          <section key={grupo.id} className={styles.grupo} aria-labelledby={`g-${grupo.id}`}>
            <div className={styles.grupoCabeza}>
              <h2 id={`g-${grupo.id}`} className={styles.grupoTitulo}>
                {grupo.titulo}
              </h2>
              <p className={styles.grupoResumen}>{grupo.resumen}</p>
            </div>
            <div className={styles.rejilla}>
              {grupo.recursos.map((recurso) => (
                <Tarjeta key={recurso.url} recurso={recurso} />
              ))}
            </div>
          </section>
        ))}

        {grupos.length === 0 && (
          <p className={styles.vacio}>
            Nada con esa búsqueda. Prueba con una palabra más corta, o quita el filtro de tipo.
          </p>
        )}

        <aside className={styles.nota}>
          <h2 className={styles.notaTitulo}>¿Conoces uno que falte?</h2>
          <p>
            Dile a tu profe y lo agregamos. Un enlace entra si es gratis, si sigue vivo y si un
            estudiante de este curso puede abrirlo hoy y entender algo.
          </p>
        </aside>
      </div>
    </div>
  );
}

/** Solo se nombra una sesión si además existe y está publicada. */
const SESIONES_PUBLICADAS = new Set(topics.filter((t) => t.published).map((t) => t.session));

function Tarjeta({ recurso }: { recurso: Recurso }) {
  const sesiones = (recurso.sesiones ?? []).filter((n) => SESIONES_PUBLICADAS.has(n));

  return (
    <a
      className={styles.tarjeta}
      href={recurso.url}
      target="_blank"
      rel="noopener noreferrer"
      /* Abre en otra pestaña: el estudiante está a mitad de una sesión y no
         queremos sacarlo de ella. `noopener` es obligatorio con `_blank`. */
    >
      <div className={styles.tarjetaCabeza}>
        <h3 className={styles.tarjetaNombre}>
          {recurso.nombre}
          {recurso.destacado && (
            <span className={styles.estrella} title="Empieza por aquí" aria-label="Recomendado">
              ★
            </span>
          )}
        </h3>
        <span className={styles.flecha} aria-hidden="true">
          ↗
        </span>
      </div>

      <p className={styles.tarjetaTexto}>{recurso.descripcion}</p>

      <div className={styles.tarjetaPie}>
        <span className={styles.dominio}>{dominioDe(recurso.url)}</span>
        <span className={styles.etiqueta}>{ETIQUETA_TIPO[recurso.tipo]}</span>
        {recurso.idioma === 'es' && <span className={styles.etiqueta}>Español</span>}
        {sesiones.length > 0 && (
          <span className={styles.etiquetaSesion}>
            {sesiones.length === 1 ? 'Sesión' : 'Sesiones'}{' '}
            {sesiones.map((n) => String(n).padStart(2, '0')).join(', ')}
          </span>
        )}
      </div>
    </a>
  );
}

function Lupa() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10 10L13.5 13.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
