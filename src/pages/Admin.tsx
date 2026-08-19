import { useCallback, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ApiError, api, del, patch } from '../lib/api';
import { useAuth, type AuthUser } from '../lib/auth';
import { topics } from '../data/topics';
import { enter, settle } from '../lib/motion';
import styles from './Admin.module.css';

interface AdminUser extends AuthUser {
  solvedTotal: number;
  progress: Record<string, string[]>;
}

type Dialog =
  | { kind: 'password'; user: AdminUser }
  | { kind: 'delete'; user: AdminUser }
  | null;

export default function Admin() {
  const { user, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dialog, setDialog] = useState<Dialog>(null);

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

  if (authLoading) return null;
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
        <span className="kicker">Administración</span>
        <h1>Estudiantes y progreso</h1>

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
          <p className="text-muted">Cargando…</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={`table ${styles.table}`}>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Usuario</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Resueltos</th>
                  <th>Último ingreso</th>
                  <th aria-label="Acciones" />
                </tr>
              </thead>
              <tbody>
                {users.map((row) => (
                  <tr key={row.id} className={row.active ? undefined : styles.inactive}>
                    <td className={styles.name}>{row.name}</td>
                    <td className={styles.user}>{row.username}</td>
                    <td>
                      <span className={`tag ${row.role === 'admin' ? 'tag-accent' : 'tag-neutral'}`}>
                        {row.role === 'admin' ? 'admin' : 'estudiante'}
                      </span>
                    </td>
                    <td>{row.active ? 'Activa' : 'Desactivada'}</td>
                    <td className={styles.num}>
                      {row.solvedTotal}/{publishedExercises}
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
                          className="btn btn-ghost"
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
                ))}
              </tbody>
            </table>
          </div>
        )}
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
      />
    </div>
  );
}

interface DialogProps {
  dialog: Dialog;
  onClose: () => void;
  onPassword: (user: AdminUser, password: string) => void;
  onDelete: (user: AdminUser) => void;
}

function AdminDialog({ dialog, onClose, onPassword, onDelete }: DialogProps) {
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
            {dialog.kind === 'password' ? (
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
