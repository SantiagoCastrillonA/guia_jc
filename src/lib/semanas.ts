import { topics } from '../data/topics';
import type { Topic } from '../types';

/**
 * En qué semana se dicta cada sesión.
 *
 * El curso avanza normalmente dos sesiones por semana —una básica y una
 * avanzada— pero a veces se atrasa por clases de refuerzo. Por eso la fecha de
 * cada sesión se puede editar desde el panel: lo que calcula este archivo es
 * solo el valor por defecto, y cualquier fecha guardada en el servidor manda
 * sobre él.
 *
 * El ancla es un hecho, no una suposición: la semana del lunes 17 de agosto de
 * 2026 corresponde a las sesiones 09 y 10 (JavaScript y DOM).
 */

/** Lunes de la semana de la sesión 09. */
const ANCLA_LUNES = '2026-08-17';
const ANCLA_SESION = 9;
const SESIONES_POR_SEMANA = 2;

/** Una fecha local en YYYY-MM-DD. `toISOString` no sirve: eso es UTC. */
export function aISO(d: Date) {
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mes}-${dia}`;
}

function deISO(iso: string) {
  const [a, m, d] = iso.split('-').map(Number);
  return new Date(a, m - 1, d);
}

function sumarDias(iso: string, n: number) {
  const f = deISO(iso);
  f.setDate(f.getDate() + n);
  return aISO(f);
}

/**
 * El lunes de la semana en curso.
 *
 * Las semanas van de lunes a sábado. El domingo no pertenece a ninguna, así que
 * se cuenta como la antesala de la siguiente: quien entra el domingo ve lo que
 * empieza mañana.
 */
export function lunesDeLaSemana(hoy = new Date()) {
  const dia = hoy.getDay(); // 0 = domingo
  const desplazamiento = dia === 0 ? 1 : 1 - dia;
  const lunes = new Date(hoy);
  lunes.setDate(lunes.getDate() + desplazamiento);
  return aISO(lunes);
}

/** La semana que le toca a una sesión si nadie la movió a mano. */
export function semanaPorDefecto(session: number) {
  const semanasDeDiferencia = Math.floor(
    (session - ANCLA_SESION) / SESIONES_POR_SEMANA,
  );
  return sumarDias(ANCLA_LUNES, semanasDeDiferencia * 7);
}

/** La semana de una sesión: la guardada si existe, si no la calculada. */
export function semanaDe(tema: Topic, guardadas: Record<string, string>) {
  return guardadas[tema.slug] ?? semanaPorDefecto(tema.session);
}

/** El sábado de la semana que empieza en `inicio`, si nadie lo movió a mano. */
export function finPorDefecto(inicio: string) {
  return sumarDias(inicio, 5); // lunes a sábado
}

/**
 * El fin de una sesión: el guardado si existe, si no el sábado de la semana
 * en que empieza. Depende del inicio ya resuelto —no de un sábado fijo— para
 * que una sesión atrasada a otra semana siga durando lo mismo.
 */
export function finDe(
  tema: Topic,
  inicios: Record<string, string>,
  fines: Record<string, string>,
) {
  return fines[tema.slug] ?? finPorDefecto(semanaDe(tema, inicios));
}

/** Los temas que se dictan en una semana dada, en orden de sesión. */
export function temasDeLaSemana(lunes: string, guardadas: Record<string, string>) {
  return topics
    .filter((t) => semanaDe(t, guardadas) === lunes)
    .sort((a, b) => a.session - b.session);
}

/** «18 al 23 de agosto», para el banner. */
export function rangoLegible(inicioISO: string, finISO: string) {
  const inicio = deISO(inicioISO);
  const fin = deISO(finISO);
  const mesInicio = inicio.toLocaleDateString('es-CO', { month: 'long' });
  const mesFin = fin.toLocaleDateString('es-CO', { month: 'long' });
  return mesInicio === mesFin
    ? `${inicio.getDate()} al ${fin.getDate()} de ${mesFin}`
    : `${inicio.getDate()} de ${mesInicio} al ${fin.getDate()} de ${mesFin}`;
}
