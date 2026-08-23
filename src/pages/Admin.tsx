import { useCallback, useEffect, useId, useMemo, useState, type FormEvent } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ThinkingOrb } from 'thinking-orbs';
import { PageFallback } from '../components/Layout';
import { Interruptor } from '../components/Interruptor';
import { MenuAcciones, type Accion } from '../components/MenuAcciones';
import { ApiError, api, del, patch, post } from '../lib/api';
import { useAuth, type AuthUser } from '../lib/auth';
import { topics, topicKicker, topicsByModule } from '../data/topics';
import { useTopicVisibility } from '../lib/topicVisibility';
import { semanaDe, semanaPorDefecto, rangoLegible } from '../lib/semanas';
import { enter, settle } from '../lib/motion';
import { avisar } from '../lib/avisos';
import styles from './Admin.module.css';

interface AdminUser extends AuthUser {
  solvedTotal: number;
  progress: Record<string, string[]>;
}

type Dialog =
  | { kind: 'password'; user: AdminUser }
  | { kind: 'delete'; user: AdminUser }
  | { kind: 'create' }
  | null;

interface Orden<T extends string> {
  clave: T;
  asc: boolean;
}

type Columna = 'name' | 'role' | 'active' | 'solvedTotal' | 'lastLoginAt';

const COLUMNAS: { clave: Columna; titulo: string }[] = [
  { clave: 'name', titulo: 'Nombre' },
  { clave: 'role', titulo: 'Rol' },
  { clave: 'active', titulo: 'Estado' },
  { clave: 'solvedTotal', titulo: 'Progreso' },
  { clave: 'lastLoginAt', titulo: 'Último ingreso' },
];

const TAMANOS = [10, 25, 50];

/** Los filtros del control segmentado. */
type Filtro = 'todas' | 'estudiantes' | 'admins' | 'desactivadas';

const FILTROS: { clave: Filtro; texto: string }[] = [
  { clave: 'todas', texto: 'Todas' },
  { clave: 'estudiantes', texto: 'Estudiantes' },
  { clave: 'admins', texto: 'Admins' },
  { clave: 'desactivadas', texto: 'Desactivadas' },
];

function pasaFiltro(u: AdminUser, filtro: Filtro) {
  if (filtro === 'estudiantes') return u.role === 'student';
  if (filtro === 'admins') return u.role === 'admin';
  if (filtro === 'desactivadas') return !u.active;
  return true;
}

/** Compara dos cuentas por una columna, siempre en orden ascendente. */
function comparar(a: AdminUser, b: AdminUser, clave: Columna) {
  switch (clave) {
    case 'name':
    case 'role':
      return a[clave].localeCompare(b[clave], 'es');
    case 'active':
      return Number(a.active) - Number(b.active);
    case 'solvedTotal':
      return a.solvedTotal - b.solvedTotal;
    case 'lastLoginAt': {
      // Quien nunca entró queda al final cuando se ordena de más viejo a más nuevo.
      const ta = a.lastLoginAt ? Date.parse(a.lastLoginAt) : -Infinity;
      const tb = b.lastLoginAt ? Date.parse(b.lastLoginAt) : -Infinity;
      return ta - tb;
    }
  }
}

/** Las iniciales que van en el avatar. Dos como mucho. */
function iniciales(nombre: string) {
  return nombre
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

function fechaCorta(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' });
}

/* ── piezas del panel ──────────────────────────────────────────────────── */

interface SegmentadoProps<T extends string> {
  opciones: { clave: T; texto: string }[];
  valor: T;
  onElegir: (clave: T) => void;
  etiqueta: string;
}

/** Control segmentado: la pastilla blanca marca la opción viva. */
function Segmentado<T extends string>({ opciones, valor, onElegir, etiqueta }: SegmentadoProps<T>) {
  return (
    <div className={styles.segmentado} role="tablist" aria-label={etiqueta}>
      {opciones.map((o) => (
        <button
          key={o.clave}
          type="button"
          role="tab"
          aria-selected={valor === o.clave}
          className={styles.segmento}
          onClick={() => onElegir(o.clave)}
        >
          {o.texto}
        </button>
      ))}
    </div>
  );
}

interface HerramientasProps {
  busqueda: string;
  onBuscar: (texto: string) => void;
  porPagina: number;
  onPorPagina: (n: number) => void;
  etiqueta: string;
  children?: React.ReactNode;
}

/** Buscador, filtros y tamaño de página, encima de una lista. */
function Herramientas({
  busqueda,
  onBuscar,
  porPagina,
  onPorPagina,
  etiqueta,
  children,
}: HerramientasProps) {
  const id = useId();
  return (
    <div className={styles.herramientas}>
      <div className={styles.campoBusqueda}>
        <Lupa />
        <input
          id={id}
          type="search"
          className={styles.buscar}
          placeholder={etiqueta}
          aria-label={etiqueta}
          value={busqueda}
          onChange={(e) => onBuscar(e.target.value)}
        />
      </div>

      {children}

      <label className={styles.porPagina}>
        Ver
        <select
          className={styles.selectPagina}
          value={porPagina}
          onChange={(e) => onPorPagina(Number(e.target.value))}
        >
          {TAMANOS.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        por página
      </label>
    </div>
  );
}

function Lupa() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="15"
      height="15"
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

interface CabeceraProps<T extends string> {
  columnas: { clave: T; titulo: string }[];
  orden: Orden<T>;
  onOrdenar: (clave: T) => void;
}

/** La fila de encabezados: mismos carriles que las filas, pero pulsable. */
function Cabecera<T extends string>({ columnas, orden, onOrdenar }: CabeceraProps<T>) {
  return (
    <div className={styles.cabecera} role="row">
      {columnas.map((col) => {
        const activa = orden.clave === col.clave;
        return (
          <div
            key={col.clave}
            role="columnheader"
            aria-sort={activa ? (orden.asc ? 'ascending' : 'descending') : 'none'}
          >
            <button type="button" className={styles.ordenar} onClick={() => onOrdenar(col.clave)}>
              {col.titulo}
              <span aria-hidden="true" className={styles.flecha}>
                {activa ? (orden.asc ? '↑' : '↓') : '↕'}
              </span>
            </button>
          </div>
        );
      })}
      <div aria-hidden="true" />
    </div>
  );
}

interface PaginadorProps {
  desde: number;
  mostradas: number;
  total: number;
  pagina: number;
  totalPaginas: number;
  onPagina: (n: number) => void;
  unidad: string;
  vacio: string;
}

function Paginador({
  desde,
  mostradas,
  total,
  pagina,
  totalPaginas,
  onPagina,
  unidad,
  vacio,
}: PaginadorProps) {
  return (
    <div className={styles.pie}>
      <p className={styles.conteo}>
        {total === 0 ? vacio : `${desde + 1}–${desde + mostradas} de ${total} ${unidad}`}
      </p>
      <div className={styles.paginador}>
        <button
          type="button"
          className={styles.botonPagina}
          onClick={() => onPagina(pagina - 1)}
          disabled={pagina <= 1}
        >
          Anterior
        </button>
        <span className={styles.num}>
          {pagina} / {totalPaginas}
        </span>
        <button
          type="button"
          className={styles.botonPagina}
          onClick={() => onPagina(pagina + 1)}
          disabled={pagina >= totalPaginas}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

/* ── sesiones y temas ──────────────────────────────────────────────────── */

/**
 * La lista de sesiones, cada una con su interruptor. Sustituye al botón
 * "Apagar tema": encender y apagar es un estado, no una acción suelta.
 */
function SesionesYTemas({
  run,
}: {
  run: (accion: () => Promise<unknown>, exito?: string) => Promise<void>;
}) {
  const { isAvailable, setEnabled, semanas, setSemana } = useTopicVisibility();
  const [busqueda, setBusqueda] = useState('');

  const publicados = useMemo(() => topics.filter((t) => t.published), []);
  const filtrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    if (!texto) return publicados;
    return publicados.filter(
      (t) => t.title.toLowerCase().includes(texto) || t.module.toLowerCase().includes(texto),
    );
  }, [publicados, busqueda]);

  const disponibles = publicados.filter((t) => isAvailable(t.slug)).length;

  return (
    <>
      <div className={styles.encabezadoSeccion}>
        <div>
          <h2 className={styles.tituloSeccion}>Sesiones y temas</h2>
          <p className={styles.subtituloSeccion}>
            Apaga una sesión para que los estudiantes no puedan entrar todavía. El cambio se ve al
            instante, sin deploy.
          </p>
        </div>
        <span className={styles.conteoSeccion}>
          {disponibles} de {publicados.length} disponibles
        </span>
      </div>

      <div className={styles.herramientas}>
        <div className={styles.campoBusqueda}>
          <Lupa />
          <input
            type="search"
            className={styles.buscar}
            placeholder="Buscar por tema o módulo"
            aria-label="Buscar por tema o módulo"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.tarjetaLista}>
        {filtrados.length === 0 && <p className={styles.vacio}>Ningún tema coincide.</p>}
        {filtrados.map((tema) => {
          const disponible = isAvailable(tema.slug);
          return (
            <div
              key={tema.slug}
              className={`${styles.filaSesion} ${disponible ? '' : styles.filaApagada}`}
            >
              <span className={styles.sesionKicker}>{topicKicker(tema)}</span>
              <span className={styles.sesionTitulo}>{tema.title}</span>
              <label className={styles.campoSemana}>
                <span className={styles.rotuloSemana}>Semana del</span>
                <input
                  type="date"
                  className={styles.fechaSemana}
                  value={semanaDe(tema, semanas)}
                  aria-label={`Semana en que se dicta ${tema.title}`}
                  onChange={(e) =>
                    run(
                      () => setSemana(tema.slug, e.target.value || null),
                      `${tema.title} queda en la semana del ${rangoLegible(e.target.value)}`,
                    )
                  }
                />
                {semanas[tema.slug] && semanas[tema.slug] !== semanaPorDefecto(tema.session) && (
                  <button
                    type="button"
                    className={styles.limpiarSemana}
                    onClick={() =>
                      run(
                        () => setSemana(tema.slug, null),
                        `${tema.title} vuelve a su semana por defecto`,
                      )
                    }
                  >
                    Restablecer
                  </button>
                )}
              </label>
              <span className={disponible ? styles.sesionOn : styles.sesionOff}>
                {disponible ? 'Disponible' : 'Apagado'}
              </span>
              <Interruptor
                encendido={disponible}
                etiqueta={`${disponible ? 'Apagar' : 'Activar'} ${tema.title}`}
                onCambiar={() =>
                  run(
                    () => setEnabled(tema.slug, !disponible),
                    disponible ? `${tema.title} quedó oculto` : `${tema.title} ya está disponible`,
                  )
                }
              />
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ── el panel ──────────────────────────────────────────────────────────── */

type Vista = 'estudiantes' | 'sesiones';

export default function Admin() {
  const { user, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dialog, setDialog] = useState<Dialog>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [vista, setVista] = useState<Vista>('estudiantes');
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState<Filtro>('todas');
  const [orden, setOrden] = useState<Orden<Columna>>({ clave: 'name', asc: true });
  const [porPagina, setPorPagina] = useState(TAMANOS[0]);
  const [pagina, setPagina] = useState(1);
  const reduce = useReducedMotion();

  useEffect(() => {
    document.title = 'Panel de admin — Jóvenes creaTIvos';
  }, []);

  const load = useCallback(() => {
    api<{ users: AdminUser[] }>('/admin/users')
      .then((data) => setUsers(data.users))
      .catch((err) => setError(err instanceof ApiError ? err.message : 'No se pudo cargar.'));
  }, []);

  useEffect(() => {
    if (user?.role === 'admin') load();
  }, [user, load]);

  const filtradas = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    const base = (users ?? []).filter(
      (u) =>
        pasaFiltro(u, filtro) &&
        (!texto ||
          u.name.toLowerCase().includes(texto) ||
          u.username.toLowerCase().includes(texto)),
    );
    const signo = orden.asc ? 1 : -1;
    return [...base].sort((a, b) => comparar(a, b, orden.clave) * signo);
  }, [users, busqueda, filtro, orden]);

  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / porPagina));
  // Se recorta aquí y no con un efecto: al filtrar, la página vieja puede ya no existir.
  const paginaActual = Math.min(pagina, totalPaginas);
  const desde = (paginaActual - 1) * porPagina;
  const visibles = filtradas.slice(desde, desde + porPagina);

  // Sin esto la pantalla queda en blanco mientras responde /auth/me.
  if (authLoading) return <PageFallback />;
  if (!user) return <Navigate to="/entrar" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;

  async function run(action: () => Promise<unknown>, exito?: string) {
    setError(null);
    try {
      await action();
      load();
      if (exito) avisar.exito(exito);
    } catch (err) {
      const mensaje = err instanceof ApiError ? err.message : 'No se pudo completar la acción.';
      setError(mensaje);
      avisar.error('No se pudo completar', mensaje);
    }
  }

  function ordenarPor(clave: Columna) {
    setOrden((prev) => (prev.clave === clave ? { clave, asc: !prev.asc } : { clave, asc: true }));
    setPagina(1);
  }

  function accionesDe(fila: AdminUser): Accion[] {
    const lista: Accion[] = [
      {
        texto: expandedId === fila.id ? 'Ocultar progreso' : 'Ver progreso',
        onElegir: () => setExpandedId(expandedId === fila.id ? null : fila.id),
      },
      {
        texto: fila.role === 'admin' ? 'Quitar admin' : 'Hacer admin',
        onElegir: () =>
          run(
            () =>
              patch(`/admin/users/${fila.id}`, {
                role: fila.role === 'admin' ? 'student' : 'admin',
              }),
            fila.role === 'admin' ? `${fila.name} ya no es admin` : `${fila.name} ahora es admin`,
          ),
      },
      {
        texto: fila.active ? 'Desactivar cuenta' : 'Activar cuenta',
        onElegir: () =>
          run(
            () => patch(`/admin/users/${fila.id}`, { active: !fila.active }),
            fila.active
              ? `Cuenta de ${fila.name} desactivada`
              : `Cuenta de ${fila.name} activada`,
          ),
      },
      { texto: 'Cambiar contraseña', onElegir: () => setDialog({ kind: 'password', user: fila }) },
    ];
    // Nadie se borra a sí mismo: dejaría la instalación sin quien entre.
    if (fila.id !== user!.id) {
      lista.push({
        texto: 'Borrar cuenta',
        peligro: true,
        onElegir: () => setDialog({ kind: 'delete', user: fila }),
      });
    }
    return lista;
  }

  const totalSolved = users?.reduce((sum, u) => sum + u.solvedTotal, 0) ?? 0;
  const publishedExercises = topics.reduce((s, t) => s + (t.published ? t.exercises : 0), 0);
  const students = users?.filter((u) => u.role === 'student') ?? [];

  const cifras = [
    { rotulo: 'Cuentas', valor: users?.length ?? '—' },
    { rotulo: 'Estudiantes', valor: students.length },
    { rotulo: 'Ejercicios resueltos', valor: totalSolved.toLocaleString('es-CO') },
    { rotulo: 'Ejercicios disponibles', valor: publishedExercises },
  ];

  return (
    <div className={styles.marco}>
      <aside className={styles.lateral}>
        <Link to="/" className={styles.marca}>
          <img src="/favicon.svg" alt="" width="18" height="18" />
          <span>
            <span className={styles.marcaNombre}>Jóvenes creaTIvos</span>
            <span className={styles.marcaSub}>Panel del profe</span>
          </span>
        </Link>

        <nav className={styles.menu} aria-label="Secciones del panel">
          <button
            type="button"
            className={styles.itemMenu}
            aria-current={vista === 'estudiantes' ? 'page' : undefined}
            onClick={() => setVista('estudiantes')}
          >
            <IconoPersonas />
            Estudiantes
          </button>
          <button
            type="button"
            className={styles.itemMenu}
            aria-current={vista === 'sesiones' ? 'page' : undefined}
            onClick={() => setVista('sesiones')}
          >
            <IconoLista />
            Sesiones y temas
          </button>
        </nav>

        <div className={styles.pieLateral}>
          <span className={styles.notaLateral}>
            {topics.length} sesiones · {publishedExercises} ejercicios
          </span>
          <span className={styles.quien}>
            <span className={styles.avatarLateral} aria-hidden="true">
              {iniciales(user.name)}
            </span>
            <span className={styles.quienTexto}>
              <span className={styles.quienNombre}>{user.name}</span>
              <span className={styles.quienRol}>admin</span>
            </span>
          </span>
        </div>
      </aside>

      <main className={styles.principal}>
        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        {vista === 'estudiantes' ? (
          <>
            <div className={styles.encabezadoSeccion}>
              <div>
                <span className={styles.kicker}>Administración</span>
                <h1 className={styles.titulo}>Estudiantes y progreso</h1>
              </div>
              <button
                type="button"
                className={styles.botonPastilla}
                onClick={() => setDialog({ kind: 'create' })}
              >
                Nueva cuenta
              </button>
            </div>

            <div className={styles.cifras}>
              {cifras.map((c) => (
                <div key={c.rotulo} className={styles.tarjetaCifra}>
                  <p className={styles.cifraRotulo}>{c.rotulo}</p>
                  <p className={styles.cifraValor}>{c.valor}</p>
                </div>
              ))}
            </div>

            {!users ? (
              <div className={styles.cargando}>
                <ThinkingOrb state="searching" size={20} theme="dark" aria-label="Cargando" />
                <p className={styles.conteo}>Cargando…</p>
              </div>
            ) : (
              <>
                <Herramientas
                  busqueda={busqueda}
                  onBuscar={(t) => {
                    setBusqueda(t);
                    setPagina(1);
                  }}
                  porPagina={porPagina}
                  onPorPagina={(n) => {
                    setPorPagina(n);
                    setPagina(1);
                  }}
                  etiqueta="Buscar por nombre o usuario"
                >
                  <Segmentado
                    opciones={FILTROS}
                    valor={filtro}
                    etiqueta="Filtrar cuentas"
                    onElegir={(f) => {
                      setFiltro(f);
                      setPagina(1);
                    }}
                  />
                </Herramientas>

                <div className={styles.lista} role="table" aria-label="Cuentas">
                  <Cabecera columnas={COLUMNAS} orden={orden} onOrdenar={ordenarPor} />

                  {visibles.length === 0 && (
                    <p className={styles.vacio}>Ninguna cuenta coincide.</p>
                  )}

                  {visibles.map((fila) => {
                    const abierta = expandedId === fila.id;
                    return (
                      <div
                        key={fila.id}
                        className={`${styles.grupoFila} ${abierta ? styles.grupoAbierto : ''}`}
                      >
                        <div className={styles.fila} role="row">
                          <span className={styles.celdaNombre}>
                            <span className={styles.avatar} aria-hidden="true">
                              {iniciales(fila.name)}
                            </span>
                            <span className={styles.nombreTexto}>
                              <span className={styles.nombre}>{fila.name}</span>
                              <span className={styles.usuario}>{fila.username}</span>
                            </span>
                          </span>

                          <span>
                            <span className={styles.rol}>
                              {fila.role === 'admin' ? 'admin' : 'estudiante'}
                            </span>
                          </span>

                          <span>
                            <Estado
                              activo={fila.active}
                              textoOn="Activa"
                              textoOff="Desactivada"
                            />
                          </span>

                          <BarraProgreso
                            resueltos={fila.solvedTotal}
                            total={publishedExercises}
                            progreso={fila.progress}
                          />

                          <span className={styles.num}>{fechaCorta(fila.lastLoginAt)}</span>

                          <MenuAcciones acciones={accionesDe(fila)} etiqueta={fila.name} />
                        </div>

                        <AnimatePresence initial={false}>
                          {abierta && (
                            <motion.div
                              className={styles.detalleCaja}
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={reduce ? { duration: 0 } : enter}
                            >
                              <StudentProgress user={fila} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}

                  <Paginador
                    desde={desde}
                    mostradas={visibles.length}
                    total={filtradas.length}
                    pagina={paginaActual}
                    totalPaginas={totalPaginas}
                    onPagina={setPagina}
                    unidad="cuentas"
                    vacio="Ninguna cuenta coincide"
                  />
                </div>
              </>
            )}
          </>
        ) : (
          <SesionesYTemas run={run} />
        )}
      </main>

      <AdminDialog
        dialog={dialog}
        onClose={() => setDialog(null)}
        onPassword={(target, newPassword) =>
          run(
            () => patch(`/admin/users/${target.id}`, { newPassword }),
            `Contraseña de ${target.name} cambiada`,
          ).then(() => setDialog(null))
        }
        onDelete={(target) =>
          run(() => del(`/admin/users/${target.id}`), `Cuenta de ${target.name} borrada`).then(() =>
            setDialog(null),
          )
        }
        onCreate={(account) =>
          run(() => post('/admin/users', account), `Cuenta ${account.username} creada`).then(() =>
            setDialog(null),
          )
        }
      />
    </div>
  );
}

function IconoPersonas() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 19v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 17.5V19" />
      <circle cx="10" cy="8" r="3.2" />
      <path d="M20 19v-1.4a3.4 3.4 0 0 0-2.6-3.3M15.4 5.2a3.2 3.2 0 0 1 0 5.9" />
    </svg>
  );
}

function IconoLista() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 6h11M9 12h11M9 18h11" />
      <circle cx="4.5" cy="6" r="1.2" />
      <circle cx="4.5" cy="12" r="1.2" />
      <circle cx="4.5" cy="18" r="1.2" />
    </svg>
  );
}

/** Estado encendido/apagado: color y forma, para distinguirlo de un vistazo. */
function Estado({ activo, textoOn, textoOff }: { activo: boolean; textoOn: string; textoOff: string }) {
  return (
    <span className={`${styles.estado} ${activo ? styles.estadoOn : styles.estadoOff}`}>
      <span
        className={`${styles.punto} ${activo ? styles.puntoOn : styles.puntoOff}`}
        aria-hidden="true"
      />
      {activo ? textoOn : textoOff}
    </span>
  );
}

/** Cuántos temas empezó y cuántos terminó, a partir del mapa de progreso. */
function contarTemas(progreso: Record<string, string[]>) {
  let completos = 0;
  let empezados = 0;
  for (const topic of topics) {
    if (!topic.published || topic.exercises === 0) continue;
    const resueltos = progreso[topic.slug]?.length ?? 0;
    if (resueltos >= topic.exercises) completos += 1;
    else if (resueltos > 0) empezados += 1;
  }
  return { completos, empezados };
}

/** El progreso de un estudiante en una celda: proporción, porcentaje y temas. */
function BarraProgreso({
  resueltos,
  total,
  progreso,
}: {
  resueltos: number;
  total: number;
  progreso: Record<string, string[]>;
}) {
  const reduce = useReducedMotion();
  const fraccion = total > 0 ? Math.min(resueltos / total, 1) : 0;
  const { completos, empezados } = contarTemas(progreso);

  return (
    <div className={styles.progreso}>
      <div className={styles.progresoCifras}>
        <span className={styles.progresoPct}>{Math.round(fraccion * 100)}%</span>
        <span className={styles.progresoDetalle}>
          {resueltos} de {total} ejercicios
        </span>
      </div>
      <span className={`${styles.barra} ${fraccion >= 1 ? styles.barraCompleta : ''}`}>
        <motion.span
          className={styles.barraFill}
          initial={false}
          animate={{ transform: `scaleX(${fraccion})` }}
          transition={reduce ? { duration: 0 } : settle}
          style={{ width: '100%' }}
        />
      </span>
      <span className={styles.progresoDetalle}>
        {completos > 0 || empezados > 0
          ? `${completos} tema${completos === 1 ? '' : 's'} completo${completos === 1 ? '' : 's'}` +
            (empezados > 0 ? ` · ${empezados} en curso` : '')
          : 'Todavía no empieza'}
      </span>
    </div>
  );
}

/** El detalle de progreso de un estudiante, módulo por módulo. */
function StudentProgress({ user }: { user: AdminUser }) {
  const reduce = useReducedMotion();
  const groups = topicsByModule()
    .map((group) => ({
      module: group.module,
      topics: group.topics.filter((topic) => topic.published && topic.exercises > 0),
    }))
    .filter((group) => group.topics.length > 0);

  const algoHecho = Object.values(user.progress).some((ids) => ids.length > 0);
  if (!algoHecho) {
    return (
      <p className={styles.detalleVacio}>
        {user.name} todavía no ha resuelto ningún ejercicio.
      </p>
    );
  }

  return (
    <div className={styles.detalle}>
      {groups.map((group) => {
        const totalModulo = group.topics.reduce((sum, t) => sum + t.exercises, 0);
        const hechosModulo = group.topics.reduce(
          (sum, t) => sum + Math.min(user.progress[t.slug]?.length ?? 0, t.exercises),
          0,
        );
        const temasCompletos = group.topics.filter(
          (t) => (user.progress[t.slug]?.length ?? 0) >= t.exercises,
        ).length;
        const fraccion = totalModulo > 0 ? hechosModulo / totalModulo : 0;

        return (
          <div key={group.module} className={styles.modulo}>
            <div className={styles.moduloHead}>
              <p className={styles.moduloNombre}>{group.module}</p>
              <span className={`${styles.barra} ${styles.moduloBarra}`}>
                <motion.span
                  className={styles.barraFill}
                  initial={false}
                  animate={{ transform: `scaleX(${fraccion})` }}
                  transition={reduce ? { duration: 0 } : settle}
                  style={{ width: '100%' }}
                />
              </span>
              <span className={styles.moduloCifra}>
                {temasCompletos}/{group.topics.length} temas · {hechosModulo}/{totalModulo} ejercicios
              </span>
            </div>

            <ul className={styles.temas}>
              {group.topics.map((topic) => {
                const resueltos = Math.min(user.progress[topic.slug]?.length ?? 0, topic.exercises);
                const completo = resueltos >= topic.exercises;
                const empezado = resueltos > 0 && !completo;
                return (
                  <li
                    key={topic.slug}
                    className={`${styles.tema} ${
                      completo ? styles.temaCompleto : empezado ? styles.temaEmpezado : ''
                    }`}
                    title={`${topic.title}: ${resueltos} de ${topic.exercises}`}
                  >
                    <span aria-hidden="true">{completo ? '●' : empezado ? '◐' : '○'}</span>
                    <span>{topic.title}</span>
                    <span className={styles.temaCifra}>
                      {resueltos}/{topic.exercises}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

interface NewAccount {
  name: string;
  username: string;
  password: string;
  role: 'student' | 'admin';
}

interface DialogProps {
  dialog: Dialog;
  onClose: () => void;
  onPassword: (user: AdminUser, password: string) => void;
  onDelete: (user: AdminUser) => void;
  onCreate: (account: NewAccount) => void;
}

function AdminDialog({ dialog, onClose, onPassword, onDelete, onCreate }: DialogProps) {
  const reduce = useReducedMotion();
  const [password, setPassword] = useState('');

  useEffect(() => {
    setPassword('');
  }, [dialog]);

  useEffect(() => {
    if (!dialog) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dialog, onClose]);

  return (
    <AnimatePresence>
      {dialog && (
        <motion.div
          className="dialog-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={enter}
          onClick={onClose}
        >
          {/* La tarjeta se materializa: escala y opacidad juntas, sin rebote. */}
          <motion.div
            className="dialog"
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, transform: reduce ? 'none' : 'scale(0.96)' }}
            animate={{ opacity: 1, transform: 'scale(1)' }}
            exit={{ opacity: 0, transform: reduce ? 'none' : 'scale(0.98)' }}
            transition={settle}
            onClick={(e) => e.stopPropagation()}
          >
            {dialog.kind === 'create' ? (
              <CreateAccountFields onCancel={onClose} onCreate={onCreate} />
            ) : dialog.kind === 'password' ? (
              <>
                <h2 className="dialog-title">Nueva contraseña</h2>
                <p className="dialog-body">
                  Para <strong>{dialog.user.name}</strong> ({dialog.user.username}). Entrégasela en
                  persona y pídele que la cambie.
                </p>
                <div className="field">
                  <label htmlFor="admin-new-password">Contraseña nueva</label>
                  <input
                    id="admin-new-password"
                    className="input"
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={8}
                    autoComplete="off"
                  />
                </div>
                <div className="dialog-actions">
                  <button type="button" className="btn btn-secondary" onClick={onClose}>
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={password.length < 8}
                    onClick={() => onPassword(dialog.user, password)}
                  >
                    Cambiar
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="dialog-title">Borrar la cuenta</h2>
                <p className="dialog-body">
                  Se borra <strong>{dialog.user.name}</strong> ({dialog.user.username}) y todo su
                  progreso. Esta acción no se puede deshacer.
                </p>
                <div className="dialog-actions">
                  <button type="button" className="btn btn-secondary" onClick={onClose}>
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => onDelete(dialog.user)}
                  >
                    Borrar
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface CreateAccountFieldsProps {
  onCancel: () => void;
  onCreate: (account: NewAccount) => void;
}

// Sin caracteres que se confundan al dictarlos: ni 0/O, ni 1/l/I.
const ALFABETO = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/** Contraseña al azar para una cuenta nueva. */
function generarContrasena() {
  const limite = 256 - (256 % ALFABETO.length); // descarta el sesgo del módulo
  const letras: string[] = [];
  const bytes = new Uint8Array(32);
  while (letras.length < 16) {
    crypto.getRandomValues(bytes);
    for (const b of bytes) {
      if (b < limite && letras.length < 16) letras.push(ALFABETO[b % ALFABETO.length]);
    }
  }
  return [0, 4, 8, 12].map((i) => letras.slice(i, i + 4).join('')).join('-');
}

/** Formulario para que el profe cree cuentas directamente: estudiantes o colegas admin. */
function CreateAccountFields({ onCancel, onCreate }: CreateAccountFieldsProps) {
  const ids = { name: useId(), user: useId(), pass: useId() };
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<NewAccount['role']>('student');

  const valid = name.trim().length >= 2 && username.trim().length >= 3 && password.length >= 8;

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!valid) return;
    onCreate({ name, username, password, role });
  }

  return (
    <form onSubmit={submit}>
      <h2 className="dialog-title">Nueva cuenta</h2>
      <p className="dialog-body">
        Se crea directamente, sin pasar por el registro. Sirve tanto para un estudiante como para
        un colega profe.
      </p>

      <div className="field">
        <label htmlFor={ids.name}>Nombre</label>
        <input
          id={ids.name}
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="off"
          required
        />
      </div>

      <div className="field">
        <label htmlFor={ids.user}>Usuario</label>
        <input
          id={ids.user}
          className="input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          required
        />
      </div>

      <div className="field">
        <label htmlFor={ids.pass}>Contraseña</label>
        <div className={styles.filaClave}>
          <input
            id={ids.pass}
            className="input"
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            autoComplete="off"
            required
          />
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setPassword(generarContrasena())}
          >
            Generar
          </button>
        </div>
        <p className={styles.ayudaClave}>
          Cópiala antes de crear la cuenta: después no se vuelve a mostrar. Quien la reciba
          puede cambiarla desde su perfil.
        </p>
      </div>

      <div className="seg">
        <label className="seg-opt">
          <input
            type="radio"
            name="rol-nueva-cuenta"
            checked={role === 'student'}
            onChange={() => setRole('student')}
          />
          Estudiante
        </label>
        <label className="seg-opt">
          <input
            type="radio"
            name="rol-nueva-cuenta"
            checked={role === 'admin'}
            onChange={() => setRole('admin')}
          />
          Admin
        </label>
      </div>

      <div className="dialog-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={!valid}>
          Crear
        </button>
      </div>
    </form>
  );
}
