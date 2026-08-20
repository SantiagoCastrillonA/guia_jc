/** Carga de rutas con reintentos: un import() que falla dejaba la pantalla en
 *  blanco. Si aun así falla, puede ser un chunk viejo tras un deploy: se
 *  recarga una sola vez para traer el index nuevo. */

const RECARGA_HECHA = 'jc:reload-por-chunk';

const espera = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** ¿El error viene de un módulo que no se pudo bajar? */
function esFalloDeCarga(error: unknown): boolean {
  const mensaje = error instanceof Error ? `${error.name} ${error.message}` : String(error);
  return /Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed|ChunkLoadError/i.test(
    mensaje,
  );
}

export async function importarConReintentos<T>(
  cargar: () => Promise<T>,
  intentos = 3,
): Promise<T> {
  let ultimoError: unknown;

  for (let intento = 1; intento <= intentos; intento++) {
    try {
      const modulo = await cargar();
      sessionStorage.removeItem(RECARGA_HECHA);
      return modulo;
    } catch (error) {
      ultimoError = error;
      if (!esFalloDeCarga(error)) throw error;
      if (intento < intentos) await espera(intento * 400);
    }
  }

  try {
    if (!sessionStorage.getItem(RECARGA_HECHA)) {
      sessionStorage.setItem(RECARGA_HECHA, '1');
      location.reload();
      await new Promise(() => {});
    }
  } catch {
    // sin sessionStorage: mejor mostrar el error que arriesgar un bucle
  }

  throw ultimoError;
}

/** Ruta `lazy` de React Router con reintentos. */
export function rutaLazy(cargar: () => Promise<{ default: React.ComponentType }>) {
  return async () => {
    const { default: Component } = await importarConReintentos(cargar);
    return { Component };
  };
}
