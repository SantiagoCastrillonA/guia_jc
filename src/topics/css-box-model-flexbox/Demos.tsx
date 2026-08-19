import { useId, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { settle } from '../../lib/motion';
import styles from './Demos.module.css';

/**
 * Demos interactivas de la sesión de CSS. La idea es que el estudiante mueva
 * un valor y vea la consecuencia al instante: es mucho más rápido que
 * explicarlo, y las cajas se reacomodan con animación de layout para que se
 * entienda qué se movió y hacia dónde.
 */

interface OpcionesProps<T extends string> {
  etiqueta: string;
  valores: readonly T[];
  valor: T;
  onChange: (valor: T) => void;
}

function Opciones<T extends string>({ etiqueta, valores, valor, onChange }: OpcionesProps<T>) {
  return (
    <div className={styles.control}>
      <span className={styles.controlLabel}>{etiqueta}</span>
      <div className={styles.row}>
        {valores.map((v) => (
          <button
            key={v}
            type="button"
            className={`${styles.opt} ${v === valor ? styles.optOn : ''}`}
            onClick={() => onChange(v)}
            aria-pressed={v === valor}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}

const JUSTIFY = ['flex-start', 'center', 'flex-end', 'space-between', 'space-around'] as const;
const ALIGN = ['stretch', 'flex-start', 'center', 'flex-end'] as const;
const DIRECTION = ['row', 'column'] as const;

/** Flexbox en vivo: cambia una propiedad y mira a dónde se van las cajas. */
export function FlexPlayground() {
  const reduce = useReducedMotion();
  const [justify, setJustify] = useState<(typeof JUSTIFY)[number]>('flex-start');
  const [align, setAlign] = useState<(typeof ALIGN)[number]>('stretch');
  const [direction, setDirection] = useState<(typeof DIRECTION)[number]>('row');

  return (
    <div className={styles.demo}>
      <div className={styles.controls}>
        <Opciones etiqueta="flex-direction" valores={DIRECTION} valor={direction} onChange={setDirection} />
        <Opciones etiqueta="justify-content" valores={JUSTIFY} valor={justify} onChange={setJustify} />
        <Opciones etiqueta="align-items" valores={ALIGN} valor={align} onChange={setAlign} />
      </div>

      <div
        className={styles.stage}
        style={{ flexDirection: direction, justifyContent: justify, alignItems: align }}
      >
        {[1, 2, 3].map((n) => (
          // `layout` anima la reubicación: la caja viaja a su nueva posición
          // en vez de aparecer allá, y así se ve QUÉ hizo la propiedad.
          <motion.div key={n} layout={!reduce} transition={settle} className={styles.box}>
            {n}
          </motion.div>
        ))}
      </div>

      <pre className={styles.code}>
        <code>
          {'.contenedor {\n  display: flex;\n  '}
          <span className={styles.prop}>flex-direction</span>
          {`: ${direction};\n  `}
          <span className={styles.prop}>justify-content</span>
          {`: ${justify};\n  `}
          <span className={styles.prop}>align-items</span>
          {`: ${align};\n}`}
        </code>
      </pre>
    </div>
  );
}

/** Box model en vivo: mueve padding, borde y margen y mira el ancho total. */
export function BoxModelDemo() {
  const reduce = useReducedMotion();
  const ids = { p: useId(), b: useId(), m: useId() };
  const [padding, setPadding] = useState(16);
  const [border, setBorder] = useState(4);
  const [margin, setMargin] = useState(12);
  const [borderBox, setBorderBox] = useState(false);

  const anchoDeclarado = 200;
  const anchoReal = borderBox ? anchoDeclarado : anchoDeclarado + padding * 2 + border * 2;
  const espacioTotal = anchoReal + margin * 2;

  return (
    <div className={styles.demo}>
      <div className={styles.controls}>
        <div className={styles.control}>
          <label className={styles.controlLabel} htmlFor={ids.p}>
            padding: {padding}px
          </label>
          <input
            id={ids.p}
            className={styles.slider}
            type="range"
            min={0}
            max={40}
            value={padding}
            onChange={(e) => setPadding(Number(e.target.value))}
          />
        </div>
        <div className={styles.control}>
          <label className={styles.controlLabel} htmlFor={ids.b}>
            border: {border}px
          </label>
          <input
            id={ids.b}
            className={styles.slider}
            type="range"
            min={0}
            max={16}
            value={border}
            onChange={(e) => setBorder(Number(e.target.value))}
          />
        </div>
        <div className={styles.control}>
          <label className={styles.controlLabel} htmlFor={ids.m}>
            margin: {margin}px
          </label>
          <input
            id={ids.m}
            className={styles.slider}
            type="range"
            min={0}
            max={40}
            value={margin}
            onChange={(e) => setMargin(Number(e.target.value))}
          />
        </div>
        <div className={styles.control}>
          <span className={styles.controlLabel}>box-sizing</span>
          <div className={styles.row}>
            {(['content-box', 'border-box'] as const).map((v) => (
              <button
                key={v}
                type="button"
                className={`${styles.opt} ${(v === 'border-box') === borderBox ? styles.optOn : ''}`}
                onClick={() => setBorderBox(v === 'border-box')}
                aria-pressed={(v === 'border-box') === borderBox}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.boxModel}>
        <motion.div
          className={styles.marginBox}
          style={{ padding: margin }}
          animate={{ padding: margin }}
          transition={reduce ? { duration: 0 } : settle}
        >
          <span className={styles.tag}>margin</span>
          <div className={styles.borderBox} style={{ borderWidth: border }}>
            <div className={styles.paddingBox} style={{ padding }}>
              <div
                className={styles.contentBox}
                style={{
                  width: borderBox
                    ? Math.max(anchoDeclarado - padding * 2 - border * 2, 40)
                    : anchoDeclarado,
                }}
              >
                content
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <p className={styles.total}>
        <code>width: 200px</code> declarado ·{' '}
        <strong className={styles.totalNum}>{anchoReal}px</strong> de caja real ·{' '}
        <strong className={styles.totalNum}>{espacioTotal}px</strong> de espacio ocupado
        {borderBox
          ? ' — con border-box, el padding y el borde caben dentro de los 200px.'
          : ' — con content-box, el padding y el borde se SUMAN a los 200px.'}
      </p>
    </div>
  );
}
