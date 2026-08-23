import { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { settle, springy } from '../../lib/motion';
import styles from '../css-box-model-flexbox/Demos.module.css';

/**
 * Demo de props y estado: el estudiante cambia un valor y ve al instante
 * qué se vuelve a dibujar. El contador de renders es la parte importante —
 * hace visible algo que normalmente es invisible.
 */

interface TarjetaProps {
  nombre: string;
  precio: number;
  destacado: boolean;
}

function TarjetaProducto({ nombre, precio, destacado }: TarjetaProps) {
  const renders = useRef(0);
  renders.current += 1;
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={styles.demo}
      style={{ margin: 0, padding: 'var(--space-6)' }}
      animate={
        reduce ? undefined : { transform: ['scale(0.99)', 'scale(1)'] }
      }
      key={`${nombre}-${precio}-${destacado}`}
      transition={springy}
    >
      <p style={{ margin: 0, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-accent-text)' }}>
        {destacado ? 'Destacado' : 'Producto'}
      </p>
      <p style={{ margin: '6px 0 0', fontSize: 20, fontFamily: 'var(--font-heading)' }}>{nombre}</p>
      <p style={{ margin: '4px 0 0', fontSize: 15, opacity: 0.75, fontFeatureSettings: '"tnum" 1' }}>
        ${precio.toLocaleString('es-CO')}
      </p>
      <p style={{ margin: '12px 0 0', fontSize: 12, opacity: 0.5, fontFeatureSettings: '"tnum" 1' }}>
        Este componente se dibujó {renders.current} {renders.current === 1 ? 'vez' : 'veces'}
      </p>
    </motion.div>
  );
}

/** Cambia las props desde el padre y observa el componente hijo. */
export function PropsDemo() {
  const [nombre, setNombre] = useState('Café 250g');
  const [precio, setPrecio] = useState(18000);
  const [destacado, setDestacado] = useState(false);

  return (
    <div className={styles.demo}>
      <div className={styles.controls}>
        <div className={styles.control}>
          <span className={styles.controlLabel}>nombre</span>
          <div className={styles.row}>
            {['Café 250g', 'Café 500g', 'Té verde'].map((v) => (
              <button
                key={v}
                type="button"
                className={`${styles.opt} ${v === nombre ? styles.optOn : ''}`}
                onClick={() => setNombre(v)}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.control}>
          <span className={styles.controlLabel}>precio</span>
          <div className={styles.row}>
            {[18000, 32000, 15000].map((v) => (
              <button
                key={v}
                type="button"
                className={`${styles.opt} ${v === precio ? styles.optOn : ''}`}
                onClick={() => setPrecio(v)}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.control}>
          <span className={styles.controlLabel}>destacado</span>
          <div className={styles.row}>
            {[true, false].map((v) => (
              <button
                key={String(v)}
                type="button"
                className={`${styles.opt} ${v === destacado ? styles.optOn : ''}`}
                onClick={() => setDestacado(v)}
              >
                {String(v)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <TarjetaProducto nombre={nombre} precio={precio} destacado={destacado} />

      <pre className={styles.code}>
        <code>
          {'<TarjetaProducto\n  '}
          <span className={styles.prop}>nombre</span>
          {`="${nombre}"\n  `}
          <span className={styles.prop}>precio</span>
          {`={${precio}}\n  `}
          <span className={styles.prop}>destacado</span>
          {`={${destacado}}\n/>`}
        </code>
      </pre>
    </div>
  );
}

/** El estado en acción: mismo componente, valor que sobrevive entre renders. */
export function EstadoDemo() {
  const [cantidad, setCantidad] = useState(0);
  const reduce = useReducedMotion();

  return (
    <div className={styles.demo}>
      <div className={styles.controls}>
        <div className={styles.control}>
          <span className={styles.controlLabel}>useState</span>
          <div className={styles.row}>
            <button type="button" className={styles.opt} onClick={() => setCantidad((c) => Math.max(0, c - 1))}>
              −1
            </button>
            <button type="button" className={styles.opt} onClick={() => setCantidad((c) => c + 1)}>
              +1
            </button>
            <button type="button" className={styles.opt} onClick={() => setCantidad(0)}>
              reiniciar
            </button>
          </div>
        </div>
      </div>

      <div className={styles.stage} style={{ alignItems: 'center', justifyContent: 'center', minHeight: 120 }}>
        <motion.span
          key={cantidad}
          initial={reduce ? false : { opacity: 0, transform: 'translateY(6px)' }}
          animate={{ opacity: 1, transform: 'translateY(0px)' }}
          transition={settle}
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 56,
            color: 'var(--color-accent-text)',
            fontFeatureSettings: '"tnum" 1',
          }}
        >
          {cantidad}
        </motion.span>
      </div>

      <pre className={styles.code}>
        <code>
          {'const [cantidad, setCantidad] = '}
          <span className={styles.prop}>useState</span>
          {`(0);   // ahora vale ${cantidad}`}
        </code>
      </pre>
    </div>
  );
}
