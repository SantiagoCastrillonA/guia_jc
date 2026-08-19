import { useEffect, useId, useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useAuth } from '../lib/auth';
import { ApiError } from '../lib/api';
import { enter } from '../lib/motion';
import styles from './Login.module.css';

type Mode = 'login' | 'register';

export default function Login() {
  const { user, loading, login, register } = useAuth();
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const ids = { name: useId(), user: useId(), pass: useId() };

  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    document.title = 'Entrar — Jóvenes creaTIvos';
  }, []);

  if (!loading && user) return <Navigate to="/" replace />;

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (mode === 'login') await login(username, password);
      else await register(name, username, password);
      navigate('/');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo completar la acción.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="wrap">
      <section className={styles.page}>
        <span className="kicker">Tu cuenta</span>
        <h1>{mode === 'login' ? 'Entra a tu progreso' : 'Crea tu cuenta'}</h1>
        <p className="text-muted">
          Con una cuenta tu progreso se guarda en el servidor y lo puedes seguir desde cualquier
          computador del salón.
        </p>

        <div className={`card elev-sm ${styles.card}`}>
          <div className={`seg ${styles.tabs}`}>
            <label className="seg-opt">
              <input
                type="radio"
                name="modo"
                checked={mode === 'login'}
                onChange={() => {
                  setMode('login');
                  setError(null);
                }}
              />
              Entrar
            </label>
            <label className="seg-opt">
              <input
                type="radio"
                name="modo"
                checked={mode === 'register'}
                onChange={() => {
                  setMode('register');
                  setError(null);
                }}
              />
              Crear cuenta
            </label>
          </div>

          <form className={styles.form} onSubmit={submit}>
            {mode === 'register' && (
              <div className="field">
                <label htmlFor={ids.name}>Tu nombre</label>
                <input
                  id={ids.name}
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  required
                />
              </div>
            )}

            <div className="field">
              <label htmlFor={ids.user}>Usuario</label>
              <input
                id={ids.user}
                className="input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                required
              />
            </div>

            <div className="field">
              <label htmlFor={ids.pass}>Contraseña</label>
              <input
                id={ids.pass}
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                required
                minLength={8}
              />
              {mode === 'register' && <p className={styles.hint}>Mínimo 8 caracteres.</p>}
            </div>

            <AnimatePresence initial={false}>
              {error && (
                <motion.p
                  className={styles.error}
                  role="alert"
                  initial={{ opacity: 0, transform: reduce ? 'none' : 'translateY(6px)' }}
                  animate={{ opacity: 1, transform: 'translateY(0px)' }}
                  exit={{ opacity: 0 }}
                  transition={enter}
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
              {busy ? 'Un momento…' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
