import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom';
import styles from './Layout.module.css';

/** Pantalla cuando una ruta falla al cargar o al pintarse. */
export function RouteError() {
  const error = useRouteError();

  const esDeRed =
    error instanceof Error &&
    /Failed to fetch|dynamically imported module|NetworkError|Load failed/i.test(error.message);

  const titulo = isRouteErrorResponse(error)
    ? `Error ${error.status}`
    : esDeRed
      ? 'No se pudo cargar esta página'
      : 'Algo se rompió al abrir esta página';

  const detalle = esDeRed
    ? 'Parece un problema de conexión. Revisa tu internet y vuelve a intentarlo.'
    : 'El error quedó registrado en la consola del navegador. Puedes reintentar o volver a los temas.';

  return (
    <div className={`wrap ${styles.routeError}`} role="alert">
      <span className="kicker">Ups</span>
      <h1>{titulo}</h1>
      <p className="text-muted">{detalle}</p>
      <div className={styles.routeErrorActions}>
        <button type="button" className="btn btn-primary" onClick={() => location.reload()}>
          Reintentar
        </button>
        <Link to="/#temas" className="btn btn-secondary">
          Volver a los temas
        </Link>
      </div>
    </div>
  );
}
