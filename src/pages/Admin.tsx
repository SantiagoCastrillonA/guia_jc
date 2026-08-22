import { Fragment, useCallback, useEffect, useId, useState, type FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ThinkingOrb } from 'thinking-orbs';
import { PageFallback } from '../components/Layout';
import { ApiError, api, del, patch, post } from '../lib/api';
import { useAuth, type AuthUser } from '../lib/auth';
import { topics, topicKicker, topicsByModule } from '../data/topics';
import { useTopicVisibility } from '../lib/topicVisibility';
import { enter, settle } from '../lib/motion';
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

export default function Admin() {
  const { user, loading: authLoading } = useAuth();
  const { isAvailable, setEnabled } = useTopicVisibility();
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dialog, setDialog] = useState<Dialog>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

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

  // Sin esto la pantalla queda en blanco mientras responde /auth/me.
  if (authLoading) return <PageFallback />;
  if (!user) return <Navigate to="/entrar" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;

  async function run(action: () => Promise<unknown>) {
    setError(null);
    try {
      await action();
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo completar la acción.');
    }
  }

  const totalSolved = users?.reduce((sum, u) => sum + u.solvedTotal, 0) ?? 0;
  const publishedExercises = topics.reduce((s, t) => s + (t.published ? t.exercises : 0), 0);
  const students = users?.filter((u) => u.role === 'student') ?? [];

  return (
    <div className="wrap">
      <section className={styles.page}>
        <div className={styles.pageHead}>
          <div>
            <span className="kicker">Administración</span>
            <h1>Estudiantes y progreso</h1>
          </div>
          <button type="button" className="btn btn-primary" onClick={() => setDialog({ kind: 'create' })}>
            Nueva cuenta
          </button>
        </div>

        <div className={styles.summary}>
          <div>
            <p className={styles.summaryNum}>{users?.length ?? '—'}</p>
            <p className={styles.summaryLabel}>Cuentas</p>
          </div>
          <div>
            <p className={styles.summaryNum}>{students.length}</p>
            <p className={styles.summaryLabel}>Estudiantes</p>
          </div>
          <div>
            <p className={styles.summaryNum}>{totalSolved}</p>
            <p className={styles.summaryLabel}>Ejercicios resueltos</p>
          </div>
          <div>
            <p className={styles.summaryNum}>{publishedExercises}</p>
            <p className={styles.summaryLabel}>Ejercicios disponibles</p>
          </div>
        </div>

        {error && <p className={styles.error} role="alert">{error}</p>}

        {!users ? (
          <div className={styles.loading}>
            <ThinkingOrb state="searching" size={20} theme="dark" aria-label="Cargando" />
            <p className="text-muted">Cargando…</p>
          </div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={`table ${styles.table}`}>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Usuario</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Progreso</th>
                  <th>Último ingreso</th>
                  <th aria-label="Acciones" />
                </tr>
              </thead>
              <tbody>
                {users.map((row) => (
                  <Fragment key={row.id}>
                    <tr className={row.active ? undefined : styles.inactive}>
                      <td className={styles.name}>{row.name}</td>
                      <td className={styles.user}>{row.username}</td>
                      <td>
                        <span className={`tag ${row.role === 'admin' ? 'tag-accent' : 'tag-neutral'}`}>
                          {row.role === 'admin' ? 'admin' : 'estudiante'}
                        </span>
                      </td>
                      <td>
                        <Estado activo={row.active} textoOn="Activa" textoOff="Desactivada" />
                      </td>
                      <td>
                        <BarraProgreso resueltos={row.solvedTotal} total={publishedExercises} progreso={row.progress} />
                      </td>
                      <td className={styles.num}>
                        {row.lastLoginAt
                          ? new Date(row.lastLoginAt).toLocaleDateString('es-CO', {
                              day: '2-digit',
                              month: 'short',
                            })
                          : '—'}
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={() => setExpandedId(expandedId === row.id ? null : row.id)}
                          >
                            {expandedId === row.id ? 'Ocultar' : 'Ver progreso'}
                          </button>
                          <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={() =>
                              run(() =>
                                patch(`/admin/users/${row.id}`, {
                                  role: row.role === 'admin' ? 'student' : 'admin',
                                }),
                              )
                            }
                          >
                            {row.role === 'admin' ? 'Quitar admin' : 'Hacer admin'}
                          </button>
                          <button
                            type="button"
                            className={`btn ${row.active ? styles.btnApagar : styles.btnActivar}`}
                            onClick={() =>
                              run(() => patch(`/admin/users/${row.id}`, { active: !row.active }))
                            }
                          >
                            {row.active ? 'Desactivar' : 'Activar'}
                          </button>
                          <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={() => setDialog({ kind: 'password', user: row })}
                          >
                            Contraseña
                          </button>
                          {row.id !== user.id && (
                            <button
                              type="button"
                              className="btn btn-ghost"
                              onClick={() => setDialog({ kind: 'delete', user: row })}
                            >
                              Borrar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {expandedId === row.id && (
                      <tr>
                        <td colSpan={7}>
                          <StudentProgress user={row} />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className={styles.page}>
        <span className="kicker">Administración</span>
        <h2>Temas disponibles</h2>
        <p className="text-muted">
          Apaga un tema para que los estudiantes no puedan entrar todavía, sin necesidad de un
          deploy. Los cambios se ven al instante.
        </p>

        <div className={styles.tableWrap}>
          <table className={`table ${styles.table}`}>
            <thead>
              <tr>
                <th>Sesión</th>
                <th>Tema</th>
                <th>Estado</th>
                <th aria-label="Acciones" />
              </tr>
            </thead>
            <tbody>
              {topics
                .filter((topic) => topic.published)
                .map((topic) => {
                  const available = isAvailable(topic.slug);
                  return (
                    <tr key={topic.slug}>
                      <td className={styles.num}>{topicKicker(topic)}</td>
                      <td className={styles.name}>{topic.title}</td>
                      <td>
                        <Estado activo={available} textoOn="Disponible" textoOff="Apagado" />
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <button
                            type="button"
                            className={`btn ${available ? styles.btnApagar : styles.btnActivar}`}
                            onClick={() => run(() => setEnabled(topic.slug, !available))}
                          >
                            {available ? 'Apagar tema' : 'Activar tema'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </section>

      <AdminDialog
        dialog={dialog}
        onClose={() => setDialog(null)}
        onPassword={(target, newPassword) =>
          run(() => patch(`/admin/users/${target.id}`, { newPassword })).then(() => setDialog(null))
        }
        onDelete={(target) =>
          run(() => del(`/admin/users/${target.id}`)).then(() => setDialog(null))
        }
        onCreate={(account) =>
          run(() => post('/admin/users', account)).then(() => setDialog(null))
        }
      />
    </div>
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
