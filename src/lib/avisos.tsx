import { Toaster, sileo } from 'sileo';

/**
 * Avisos flotantes, sobre sileo.
 *
 * Todo pasa por aquí a propósito: el tono de los mensajes, la posición y los
 * colores salen de un solo sitio y no de cada pantalla. Los colores se leen de
 * los tokens de Nocturne para no repetir hex sueltos.
 */

/** Lee un token del sistema de diseño. */
function token(nombre: string) {
  if (typeof document === 'undefined') return undefined;
  return getComputedStyle(document.documentElement).getPropertyValue(nombre).trim() || undefined;
}

/** Se monta una sola vez, en la raíz de la app. */
export function AvisosToaster() {
  return (
    <Toaster
      position="bottom-right"
      theme="dark"
      offset={{ bottom: 24, right: 24 }}
      options={{ fill: token('--color-surface'), duration: 4500 }}
    />
  );
}

export const avisar = {
  exito: (title: string, description?: string) => sileo.success({ title, description }),
  error: (title: string, description?: string) => sileo.error({ title, description }),
  info: (title: string, description?: string) => sileo.info({ title, description }),

  /** Alguien terminó todos los ejercicios de una sesión. */
  sesionCompleta: (titulo: string) =>
    sileo.success({
      title: '¡Sesión completa!',
      description: `Resolviste todos los ejercicios de «${titulo}».`,
      duration: 6500,
    }),

  /** El profe habilitó una sesión que antes estaba apagada. */
  sesionNueva: (titulo: string, alEntrar: () => void) =>
    sileo.action({
      title: 'Nueva sesión disponible',
      description: titulo,
      duration: 8000,
      button: { title: 'Abrir', onClick: alEntrar },
    }),
};
