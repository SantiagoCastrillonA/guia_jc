import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="wrap" style={{ padding: 'calc(4 * var(--leading)) 0' }}>
      <span className="kicker">Error 404</span>
      <h1>Esta página no existe</h1>
      <p className="text-muted" style={{ maxWidth: 'var(--measure)' }}>
        El tema que buscas no está publicado todavía, o el enlace cambió.
      </p>
      <Link to="/#temas" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>
        Volver a los temas
      </Link>
    </div>
  );
}
