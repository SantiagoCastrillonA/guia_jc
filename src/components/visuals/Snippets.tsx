import { useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { enter } from '../../lib/motion';
import styles from './Snippets.module.css';

/**
 * Un recetario de fragmentos para copiar.
 *
 * No es un bloque de código más: es material de consulta. Por eso cada
 * fragmento trae su nombre, su explicación dentro del propio código —los
 * comentarios se copian con él, que es como se aprende— y un botón para
 * llevárselo al editor sin seleccionar a mano.
 *
 * Los grupos se filtran en vez de solo enlazarse: una lección larga no
 * necesita veinte tarjetas más de scroll cuando el estudiante ya sabe que
 * busca algo de clases.
 */

export interface Fragmento {
  /** El método o la propiedad. Es el título de la tarjeta. */
  nombre: string;
  /** El código tal cual se copia, comentarios incluidos. */
  codigo: string;
}

export interface GrupoFragmentos {
  id: string;
  titulo: string;
  fragmentos: Fragmento[];
}

interface SnippetsProps {
  grupos: GrupoFragmentos[];
  /** Nota al pie: la letra pequeña que conviene leer una vez. */
  nota?: ReactNode;
}

export function Snippets({ grupos, nota }: SnippetsProps) {
  const [grupoActivo, setGrupoActivo] = useState<string>('todos');
  const reduce = useReducedMotion();

  const visibles = grupoActivo === 'todos' ? grupos : grupos.filter((g) => g.id === grupoActivo);
  const total = grupos.reduce((n, g) => n + g.fragmentos.length, 0);

  return (
    <div className={styles.recetario}>
      <div className={styles.filtros} role="group" aria-label="Filtrar por grupo">
        <button
          type="button"
          className={`${styles.filtro} ${grupoActivo === 'todos' ? styles.filtroOn : ''}`}
          aria-pressed={grupoActivo === 'todos'}
          onClick={() => setGrupoActivo('todos')}
        >
          Todo ({total})
        </button>
        {grupos.map((grupo) => (
          <button
            key={grupo.id}
            type="button"
            className={`${styles.filtro} ${grupoActivo === grupo.id ? styles.filtroOn : ''}`}
            aria-pressed={grupoActivo === grupo.id}
            onClick={() => setGrupoActivo(grupo.id)}
          >
            {grupo.titulo}
          </button>
        ))}
      </div>

      {visibles.map((grupo) => (
        <section key={grupo.id} className={styles.grupo} aria-labelledby={`frag-${grupo.id}`}>
          <h4 id={`frag-${grupo.id}`} className={styles.grupoTitulo}>
            {grupo.titulo}
          </h4>
          <div className={styles.lista}>
            {grupo.fragmentos.map((fragmento) => (
              <motion.article
                key={fragmento.nombre}
                className={styles.tarjeta}
                initial={reduce ? false : { transform: 'translateY(6px)' }}
                animate={{ transform: 'translateY(0px)' }}
                transition={enter}
              >
                <header className={styles.cabeza}>
                  <code className={styles.nombre}>{fragmento.nombre}</code>
                  <BotonCopiar codigo={fragmento.codigo} nombre={fragmento.nombre} />
                </header>
                <pre className={styles.codigo}>
                  <code>{pintar(fragmento.codigo)}</code>
                </pre>
              </motion.article>
            ))}
          </div>
        </section>
      ))}

      {nota && <p className={styles.nota}>{nota}</p>}
    </div>
  );
}

type EstadoCopia = 'listo' | 'copiado' | 'falla';

function BotonCopiar({ codigo, nombre }: { codigo: string; nombre: string }) {
  const [estado, setEstado] = useState<EstadoCopia>('listo');

  async function copiar() {
    try {
      await escribirEnPortapapeles(codigo);
      setEstado('copiado');
      window.setTimeout(() => setEstado('listo'), 1400);
    } catch {
      // Sin permiso de portapapeles (o sin HTTPS): se dice qué hacer en vez de
      // fallar en silencio.
      setEstado('falla');
    }
  }

  const rotulo =
    estado === 'copiado' ? '¡Copiado!' : estado === 'falla' ? 'Selecciónalo y cópialo' : 'Copiar';

  return (
    <button
      type="button"
      className={`${styles.copiar} ${estado === 'copiado' ? styles.copiado : ''}`}
      onClick={copiar}
      aria-label={`${rotulo} — ${nombre}`}
      aria-live="polite"
    >
      {rotulo}
    </button>
  );
}

/** El portapapeles moderno, con la salida de emergencia de siempre. */
function escribirEnPortapapeles(texto: string) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(texto);

  return new Promise<void>((resolve, reject) => {
    try {
      const campo = document.createElement('textarea');
      campo.value = texto;
      campo.setAttribute('readonly', '');
      // Fuera de la vista pero enfocable: si se le pone display:none, el
      // navegador no deja seleccionar su contenido.
      campo.style.position = 'fixed';
      campo.style.top = '-1000px';
      campo.style.opacity = '0';
      document.body.appendChild(campo);
      campo.select();
      const salio = document.execCommand('copy');
      document.body.removeChild(campo);
      if (salio) resolve();
      else reject(new Error('El navegador no dejó copiar.'));
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Coloreado mínimo: comentario y cadena, nada más.
 *
 * No es un resaltador de sintaxis y no pretende serlo — traer uno entero para
 * esto pesaría más que toda la lección. Lo que hace falta es separar la
 * explicación del código, y eso son dos colores.
 */
function pintar(codigo: string): ReactNode[] {
  return codigo.split('\n').flatMap((linea, i) => {
    const partes = trocear(linea).map((trozo, j) =>
      trozo.tipo === 'texto' ? (
        trozo.valor
      ) : (
        <span key={j} className={trozo.tipo === 'comentario' ? styles.comentario : styles.cadena}>
          {trozo.valor}
        </span>
      ),
    );
    return [<span key={i}>{partes}</span>, i < codigo.split('\n').length - 1 ? '\n' : null];
  });
}

interface Trozo {
  tipo: 'texto' | 'comentario' | 'cadena';
  valor: string;
}

/**
 * Recorre la línea carácter a carácter llevando la cuenta de si va dentro de
 * comillas. Hace falta: un `//` dentro de una cadena —una URL, sin ir más
 * lejos— no abre un comentario.
 */
function trocear(linea: string): Trozo[] {
  const trozos: Trozo[] = [];
  let acumulado = '';
  let comilla: string | null = null;

  const soltar = (tipo: Trozo['tipo']) => {
    if (acumulado) trozos.push({ tipo, valor: acumulado });
    acumulado = '';
  };

  for (let i = 0; i < linea.length; i++) {
    const c = linea[i];

    if (comilla) {
      acumulado += c;
      if (c === comilla && linea[i - 1] !== '\\') {
        soltar('cadena');
        comilla = null;
      }
      continue;
    }

    if (c === '/' && linea[i + 1] === '/') {
      soltar('texto');
      trozos.push({ tipo: 'comentario', valor: linea.slice(i) });
      return trozos;
    }

    if (c === "'" || c === '"' || c === '`') {
      soltar('texto');
      comilla = c;
      acumulado = c;
      continue;
    }

    acumulado += c;
  }

  soltar(comilla ? 'cadena' : 'texto');
  return trozos;
}
