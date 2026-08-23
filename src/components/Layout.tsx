import { Suspense, useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ThinkingOrb } from 'thinking-orbs';
import { SiteNav } from './SiteNav';
import { useAuth } from '../lib/auth';
import { enter } from '../lib/motion';
import styles from './Layout.module.css';

/** Routes land at the top; an in-page hash still wins. */
function useRouteScroll() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    window.scrollTo({ top: 0 });
  }, [pathname, hash]);
}

/** true solo si `active` sigue siéndolo pasado `delay` — así una navegación
 *  que ya estaba precargada (hover) no dispara el spinner por un instante. */
function useDelayedFlag(active: boolean, delay: number) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (!active) {
      setShown(false);
      return;
    }
    const id = setTimeout(() => setShown(true), delay);
    return () => clearTimeout(id);
  }, [active, delay]);
  return shown;
}

export function Layout() {
  const { pathname } = useLocation();
  const { user, loading } = useAuth();
  const navigation = useNavigation();
  const reduce = useReducedMotion();
  // navigation.state cambia apenas se hace clic — a diferencia de Suspense
  // dentro de una transición, no se queda pegado mostrando la página vieja.
  const showLoading = useDelayedFlag(navigation.state !== 'idle', 150);
  useRouteScroll();

  return (
    <>
      <SiteNav />
      {!loading && !user && (
        <div className={styles.anonBar} role="status">
          <div className="wrap">
            <span>
              No has iniciado sesión: tu progreso solo se guarda en este navegador y se
              pierde si lo borras o cambias de equipo.
            </span>
            <Link to="/entrar" className={styles.anonBarLink}>
              Crear cuenta o entrar →
            </Link>
          </div>
        </div>
      )}
      <main className={styles.main}>
        {/* Route change: a short cross-fade that lifts in. Reduced motion keeps
            the fade and drops the travel. */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            className={styles.mainInner}
            key={showLoading ? 'loading' : pathname}
            initial={{ opacity: 0, transform: reduce ? 'none' : 'translateY(8px)' }}
            animate={{ opacity: 1, transform: 'translateY(0px)' }}
            exit={{ opacity: 0, transform: reduce ? 'none' : 'translateY(-4px)' }}
            transition={enter}
          >
            {showLoading ? (
              <PageFallback />
            ) : (
              <Suspense fallback={<PageFallback />}>
                <Outlet />
              </Suspense>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
      {/* El panel de admin es un armazon a sangre con su propio pie en la
          barra lateral: el pie del sitio le dejaba una franja del fondo debajo. */}
      {!pathname.startsWith('/admin') && (
      <div className="wrap">
        <footer className={styles.footer}>
          <span>Jóvenes creaTIvos — ejercicios interactivos de programación.</span>
          <span>
            {user ? 'Tu progreso se guarda en tu cuenta.' : 'Tu progreso se guarda en este navegador.'}
          </span>
        </footer>
      </div>
      )}
    </>
  );
}

/** Exportado para servir de `HydrateFallback` a las rutas `lazy`: sin esto,
 *  al abrir una URL de tema directamente (no navegando desde otra página),
 *  el router no pinta nada hasta que el módulo termine de cargar — pantalla
 *  en blanco hasta un F5, que "arregla" el problema solo porque el módulo
 *  ya quedó en caché. */
export function PageFallback() {
  return (
    <div className={`wrap ${styles.fallback}`}>
      {/* Solo 64/20 son tamaños "afinados" por la librería; se escala por
          CSS para que se vea grande sin salirse del diseño de sus puntos. */}
      <div className={styles.orbScale}>
        <ThinkingOrb state="working" size={64} theme="dark" aria-label="Cargando tema" />
      </div>
      <p className="text-muted">Cargando tema…</p>
    </div>
  );
}
