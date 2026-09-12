import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { topics, preloadTopic } from '../data/topics';
import { Callout, Compare, Figure, RefTable } from '../components/visuals';
import styles from './ProyectoFormativo.module.css';

/**
 * Referencia fija de qué lleva el proyecto integrador — no depende del
 * cronograma ni de la visibilidad de temas: un estudiante debe poder
 * consultarla desde el primer día, mucho antes de llegar a la sesión 22.
 * El contenido es el mismo que ya se enseña en las sesiones 22 y 25; esto
 * es el resumen para volver a mirar cuando haga falta.
 */

const SESIONES_DETALLE = [
  { slug: 'proyecto-inicio', titulo: 'Arrancar el proyecto: alcance y planeación' },
  { slug: 'proyecto-backend', titulo: 'El backend del proyecto' },
  { slug: 'proyecto-cierre-deploy', titulo: 'Dejarlo publicado y presentable' },
  { slug: 'defensa-de-proyectos', titulo: 'La defensa final' },
] as const;

export default function ProyectoFormativo() {
  useEffect(() => {
    document.title = 'Proyecto formativo — Jóvenes creaTIvos';
  }, []);

  const disponibles = SESIONES_DETALLE.filter((s) =>
    topics.some((t) => t.slug === s.slug && t.published),
  );

  return (
    <div className={styles.pagina}>
      <div className={styles.ancho}>
        <header className={styles.hero}>
          <Link to="/" className={styles.volver}>
            ← Volver al inicio
          </Link>
          <span className="kicker">Proyecto integrador</span>
          <h1 className={styles.titular}>Qué debe llevar tu proyecto formativo</h1>
          <p className={styles.entrada}>
            «Mi emprendimiento digital»: una aplicación full stack, funcionando y publicada en
            internet. Esta página resume qué se entrega y cómo se evalúa; el paso a paso completo
            está en las sesiones del final del cronograma.
          </p>
        </header>

        <hr className="rule" />

        <section className={styles.seccion}>
          <h2>Lo que se entrega</h2>
          <Figure
            label="Boceto: las siete piezas dentro de una sola aplicación publicada"
            caption="No son siete pantallas sueltas: son piezas de una misma app, con una URL pública."
          >
            <svg viewBox="0 0 640 200" xmlns="http://www.w3.org/2000/svg">
              {/* barra del navegador */}
              <rect x="0" y="0" width="640" height="24" rx="6" fill="var(--color-text)" opacity="0.05" />
              {[16, 34, 52].map((cx) => (
                <circle key={cx} cx={cx} cy="12" r="4" fill="var(--color-text)" opacity="0.25" />
              ))}
              <rect x="76" y="6" width="300" height="13" rx="6.5" fill="var(--color-text)" opacity="0.08" />
              <text x="86" y="16" fontSize="9" fontFamily="ui-monospace, monospace" fill="var(--color-text-2)">
                tu-proyecto.duckdns.org
              </text>

              {/* franja de marca */}
              <rect x="12" y="34" width="616" height="38" rx="6" fill="var(--color-accent)" opacity="0.12" />
              <text x="26" y="58" fontSize="13" fill="var(--color-text)">
                Marca propia — tu negocio, tus colores
              </text>
              <rect x="558" y="42" width="70" height="22" rx="11" fill="var(--color-accent-fill)" />
              <text x="571" y="57" fontSize="11" fill="#fff">
                ✨ IA
              </text>

              {/* tres bloques */}
              {[
                { t: 'Catálogo', d: 'viene de la base de datos', x: 12 },
                { t: 'Contacto', d: 'guarda o envía de verdad', x: 221 },
                { t: 'Panel admin', d: 'solo tú entras, con login', x: 430 },
              ].map(({ t, d, x }) => (
                <g key={t}>
                  <rect x={x} y="84" width="197" height="66" rx="8" fill="var(--color-text)" opacity="0.06" />
                  <text x={x + 14} y="112" fontSize="13" fill="var(--color-text)">
                    {t}
                  </text>
                  <text x={x + 14} y="132" fontSize="11" fill="var(--color-text-2)">
                    {d}
                  </text>
                </g>
              ))}

              <text x="12" y="182" fontSize="11" fill="var(--color-text-2)">
                Código organizado por debajo · cómoda en el teléfono y en el computador
              </text>
            </svg>
          </Figure>
          <RefTable
            cabeceras={['Pieza', 'Qué significa']}
            filas={[
              ['Página de inicio con marca propia', 'Nombre, colores y tipografía de tu negocio'],
              [
                'Catálogo de productos o servicios',
                'Datos que vienen de tu base de datos, no escritos a mano',
              ],
              ['Formulario de contacto real', 'Que guarda o envía de verdad'],
              ['Panel de administrador con login', 'Solo tú puedes gestionar el contenido'],
              ['Una funcionalidad con IA', 'El asistente de la sesión 21 o algo equivalente'],
              [
                'Código limpio y organizado',
                'Carpetas claras, nombres con sentido, sin código muerto',
              ],
              [
                'UX profesional en móvil y escritorio',
                'Se usa cómodo en el teléfono, no solo se ve',
              ],
            ]}
          />
        </section>

        <section className={styles.seccion}>
          <h2>El alcance: la decisión que salva el proyecto</h2>
          <p className="text-muted">
            El error más común no es técnico: es prometer demasiado. Una app pequeña y terminada
            vale mucho más que una grande a medias.
          </p>
          <Compare
            bien={{
              titulo: 'Alcance sano',
              items: [
                'Una funcionalidad principal, bien hecha',
                'Todo lo mínimo funciona de punta a punta',
                'Las ideas extra quedan anotadas como «después»',
                'Se puede demostrar en cinco minutos',
              ],
            }}
            mal={{
              titulo: 'Alcance que hunde',
              items: [
                'Pasarela de pagos, chat en vivo y app móvil',
                'Cinco pantallas a medio hacer',
                'Nada se puede mostrar completo',
                'La demo se cae en la presentación',
              ],
            }}
          />
          <Callout>
            Criterio para decidir: <strong>si lo quitas, ¿el proyecto deja de tener sentido?</strong>{' '}
            Si la respuesta es no, va a la lista de después.
          </Callout>
        </section>

        <section className={styles.seccion}>
          <h2>Cómo se evalúa</h2>
          <Figure
            label="Boceto: las cinco preguntas que responde una buena defensa"
            caption="El resumen en una frase. El desglose exacto en puntos está en la tabla de abajo."
          >
            <svg viewBox="0 0 640 66" xmlns="http://www.w3.org/2000/svg">
              {[
                { x: 5, t: 'Funciona' },
                { x: 133, t: 'Se entiende' },
                { x: 261, t: 'Está cuidado' },
                { x: 389, t: 'Se cuenta bien' },
                { x: 517, t: 'Sabe qué falta' },
              ].map(({ x, t }) => (
                <g key={t}>
                  <rect
                    x={x}
                    y="12"
                    width="118"
                    height="40"
                    rx="20"
                    fill="var(--color-text)"
                    opacity="0.06"
                  />
                  <circle cx={x + 20} cy="32" r="10" fill="var(--color-accent)" opacity="0.85" />
                  <path
                    d={`M${x + 15.5} 32 l3.2 3.2 l6 -6.4`}
                    fill="none"
                    stroke="#fff"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <text x={x + 38} y="36" fontSize="12" fill="var(--color-text)">
                    {t}
                  </text>
                </g>
              ))}
            </svg>
          </Figure>
          <RefTable
            cabeceras={['Criterio', 'Puntos', 'Qué se mira']}
            filas={[
              ['Funcionalidad', '30', 'Catálogo, contacto, login e IA funcionando. Publicado y accesible'],
              [
                'Código limpio y buenos hábitos',
                '20',
                'Archivos separados, nombres claros, sin secretos en el repo, commits ordenados',
              ],
              ['UX y diseño responsive', '15', 'Se ve bien en móvil y escritorio; marca coherente'],
              [
                'Presentación / defensa',
                '15',
                'Claridad, demo, dominio del «por qué», manejo de preguntas',
              ],
              [
                'Seguridad básica',
                '10',
                'Contraseñas hasheadas, llave de IA en el backend, .env fuera de Git',
              ],
              ['Integración full stack', '10', 'Frontend, backend y base de datos bien conectados'],
            ]}
          />
        </section>

        {disponibles.length > 0 && (
          <aside className={styles.detalle}>
            <h2 className={styles.detalleTitulo}>El paso a paso completo</h2>
            <p>Cada pieza de esta página se explica con calma, y con ejercicios, en su sesión:</p>
            <div className={styles.detalleLista}>
              {disponibles.map((s) => (
                <Link
                  key={s.slug}
                  to={`/tema/${s.slug}`}
                  className={styles.detalleEnlace}
                  onMouseEnter={() => preloadTopic(s.slug)}
                  onFocus={() => preloadTopic(s.slug)}
                >
                  {s.titulo} →
                </Link>
              ))}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
