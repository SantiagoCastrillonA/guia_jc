import { useEffect, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { BotonTema } from './BotonTema';
import styles from './SiteNav.module.css';

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  async function salir() {
    await logout();
    navigate('/');
  }

  return (
    <header className={`nav ${styles.bar} ${scrolled ? styles.scrolled : ''}`}>
      <Link to="/" className={`nav-brand ${styles.brand}`}>
        <span className={styles.brandMark}>Jóvenes creaTIvos</span>
        <span className={styles.brandSub}>Guía de programación</span>
      </Link>

      <NavLink to="/" end className={styles.link}>
        Inicio
      </NavLink>

      <NavLink to="/recursos" className={styles.link}>
        Recursos
      </NavLink>

      <BotonTema />

      {!loading &&
        (user ? (
          <>
            {user.role === 'admin' && (
              <NavLink to="/admin" className={styles.link}>
                Panel
              </NavLink>
            )}
            <span className={styles.who} title={user.username}>
              {user.name.split(' ')[0]}
            </span>
            <button type="button" className={`btn btn-ghost ${styles.link}`} onClick={salir}>
              Salir
            </button>
          </>
        ) : (
          <NavLink to="/entrar" className={`btn btn-primary ${styles.link}`}>
            Entrar
          </NavLink>
        ))}
    </header>
  );
}
