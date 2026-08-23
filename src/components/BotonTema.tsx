import { useTema } from '../lib/tema';
import styles from './BotonTema.module.css';

/**
 * El interruptor de tema, en la barra. Los dos glifos viven montados uno sobre
 * otro y se cruzan al alternar: un cambio de icono seco se lee como parpadeo.
 */
export function BotonTema() {
  const { tema, alternar } = useTema();
  const aClaro = tema === 'dark';

  return (
    <button
      type="button"
      className={`btn btn-ghost btn-icon ${styles.boton}`}
      onClick={alternar}
      aria-label={aClaro ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
      title={aClaro ? 'Tema claro' : 'Tema oscuro'}
    >
      <span className={styles.pila} data-claro={aClaro || undefined}>
        <Sol className={styles.sol} />
        <Luna className={styles.luna} />
      </span>
    </button>
  );
}

function Sol({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function Luna({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
    </svg>
  );
}
