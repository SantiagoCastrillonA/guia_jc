/**
 * Racha de práctica: cuántos días seguidos se resolvió algo.
 *
 * Vive solo en el navegador. El servidor guarda **qué** ejercicios se
 * resolvieron, no **cuándo** (`server/src/models.js`), así que la racha no se
 * puede calcular desde la cuenta todavía. Si algún día se guarda la fecha de
 * cada resolución, esto se reemplaza por una lectura del servidor y la racha
 * pasa a seguir al estudiante entre computadores; mientras tanto es local, y
 * cambiar de equipo la reinicia.
 */

const CLAVE = 'jc:dias-activos:v1';
const DIAS_QUE_SE_MUESTRAN = 7;

/** La fecha local en YYYY-MM-DD. No sirve toISOString: eso es UTC. */
function hoyLocal(d = new Date()) {
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mes}-${dia}`;
}

function leer(): string[] {
  try {
    const bruto = localStorage.getItem(CLAVE);
    const valor = bruto ? JSON.parse(bruto) : [];
    return Array.isArray(valor) ? valor.filter((v) => typeof v === 'string') : [];
  } catch {
    return []; // modo privado o JSON corrupto: la racha es un adorno, no se rompe nada
  }
}

/** Deja constancia de que hoy hubo actividad. Idempotente. */
export function registrarActividad() {
  const hoy = hoyLocal();
  const dias = leer();
  if (dias.includes(hoy)) return;
  // Se conserva un año: de sobra para una racha y no crece sin control.
  const recortado = [...dias, hoy].sort().slice(-366);
  try {
    localStorage.setItem(CLAVE, JSON.stringify(recortado));
  } catch {
    // sin almacenamiento: la racha no se recuerda
  }
}

function menosDias(iso: string, n: number) {
  const [a, m, d] = iso.split('-').map(Number);
  const fecha = new Date(a, m - 1, d);
  fecha.setDate(fecha.getDate() - n);
  return hoyLocal(fecha);
}

export interface Racha {
  /** Días consecutivos hasta hoy (o hasta ayer, si hoy todavía no practica). */
  dias: number;
  /** Los últimos siete días, del más viejo al de hoy. */
  semana: { fecha: string; activo: boolean; esHoy: boolean }[];
}

export function calcularRacha(): Racha {
  const dias = new Set(leer());
  const hoy = hoyLocal();

  // La racha no se rompe por no haber practicado todavía HOY: se cuenta desde
  // ayer si hoy está vacío. Romperla a medianoche sería castigar al madrugador.
  let ancla = dias.has(hoy) ? hoy : menosDias(hoy, 1);
  let cuenta = 0;
  while (dias.has(ancla)) {
    cuenta += 1;
    ancla = menosDias(ancla, 1);
  }

  const semana = Array.from({ length: DIAS_QUE_SE_MUESTRAN }, (_, i) => {
    const fecha = menosDias(hoy, DIAS_QUE_SE_MUESTRAN - 1 - i);
    return { fecha, activo: dias.has(fecha), esHoy: fecha === hoy };
  });

  return { dias: cuenta, semana };
}
