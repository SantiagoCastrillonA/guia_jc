import styles from './Interruptor.module.css';

interface Props {
  encendido: boolean;
  onCambiar: () => void;
  /** Qué se enciende o apaga. Va al lector de pantalla, no a la vista. */
  etiqueta: string;
  disabled?: boolean;
}

/**
 * Interruptor de encendido/apagado, al estilo del rediseño.
 *
 * Es un <button role="switch"> y no un checkbox porque no viaja en ningún
 * formulario: dispara una acción y ya. `aria-checked` es lo que un lector de
 * pantalla anuncia.
 */
export function Interruptor({ encendido, onCambiar, etiqueta, disabled }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={encendido}
      aria-label={etiqueta}
      disabled={disabled}
      className={styles.pista}
      onClick={onCambiar}
    >
      <span className={styles.perilla} aria-hidden="true" />
    </button>
  );
}
