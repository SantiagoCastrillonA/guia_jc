import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { SiteNav } from './SiteNav';
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

export function Layout() {
  const { pathname } = useLocation();
  const reduce = useReducedMotion();
  useRouteScroll();

  return (
    <>
      <SiteNav />
      <main className={styles.main}>
        {/* Route change: a short cross-fade that lifts in. Reduced motion keeps
            the fade and drops the travel. */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pathname}
            initial={{ opacity: 0, transform: reduce ? 'none' : 'translateY(8px)' }}
            animate={{ opacity: 1, transform: 'translateY(0px)' }}
            exit={{ opacity: 0, transform: reduce ? 'none' : 'translateY(-4px)' }}
            transition={enter}
          >
            <Suspense fallback={<PageFallback />}>
              <Outlet />
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>
      <div className="wrap">
        <footer className={styles.footer}>
          <span>Jóvenes creaTIvos — ejercicios interactivos de programación.</span>
          <span>Tu progreso se guarda en este navegador.</span>
        </footer>
      </div>
    </>
  );
}

function PageFallback() {
  return (
    <div className="wrap" style={{ paddingBlock: 'calc(3 * var(--leading))' }}>
      <p className="text-muted">Cargando tema…</p>
    </div>
  );
}
