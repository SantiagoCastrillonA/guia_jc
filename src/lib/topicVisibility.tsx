import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { api, patch } from './api';
import { avisar } from './avisos';
import { topics } from '../data/topics';

/**
 * Qué temas apagó el profe desde el panel de admin. `topics.ts` sigue siendo
 * la fuente de qué temas EXISTEN (`published`); esto solo decide cuáles están
 * visibles ahora mismo, sin necesitar un deploy.
 */

interface VisibilityValue {
  loading: boolean;
  /** slug -> lunes de su semana, solo los que el profe movio a mano. */
  semanas: Record<string, string>;
  setSemana: (slug: string, lunes: string | null) => Promise<void>;
  isAvailable: (slug: string) => boolean;
  setEnabled: (slug: string, enabled: boolean) => Promise<void>;
  disabled: Set<string>;
}

const VisibilityContext = createContext<VisibilityValue | null>(null);

const CLAVE_VISTAS = 'jc:temas-vistos:v1';

function leerVistas(): string[] | null {
  try {
    const bruto = localStorage.getItem(CLAVE_VISTAS);
    return bruto ? (JSON.parse(bruto) as string[]) : null;
  } catch {
    return null; // modo privado o JSON corrupto: se calla y sigue
  }
}

function guardarVistas(slugs: string[]) {
  try {
    localStorage.setItem(CLAVE_VISTAS, JSON.stringify(slugs));
  } catch {
    // sin almacenamiento: no se avisa, pero nada se rompe
  }
}

/**
 * Compara los temas disponibles ahora con los de la última visita y avisa de
 * los que aparecieron. La primera visita solo guarda la foto, sin avisar.
 */
function avisarDeTemasNuevos(apagados: Set<string>) {
  const disponibles = topics
    .filter((tema) => tema.published && !apagados.has(tema.slug))
    .map((tema) => tema.slug);
  const vistas = leerVistas();
  guardarVistas(disponibles);
  if (!vistas) return;

  const nuevas = disponibles.filter((slug) => !vistas.includes(slug));
  // Si se publicaron varias de golpe, se resume en un solo aviso.
  if (nuevas.length === 1) {
    const tema = topics.find((t) => t.slug === nuevas[0]);
    if (tema) {
      avisar.sesionNueva(tema.title, () => {
        window.location.assign(`/tema/${tema.slug}`);
      });
    }
  } else if (nuevas.length > 1) {
    avisar.info('Hay sesiones nuevas', `Se habilitaron ${nuevas.length} sesiones.`);
  }
}

export function TopicVisibilityProvider({ children }: { children: ReactNode }) {
  const [disabled, setDisabled] = useState<Set<string>>(new Set());
  const [semanas, setSemanas] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api<{ disabled: string[]; semanas?: Record<string, string> }>('/topics/visibility')
      .then((data) => {
        if (cancelled) return;
        const apagados = new Set(data.disabled);
        setDisabled(apagados);
        setSemanas(data.semanas ?? {});
        avisarDeTemasNuevos(apagados);
      })
      .catch(() => {
        // sin backend: todo se ve disponible según topics.ts
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const isAvailable = useCallback((slug: string) => !disabled.has(slug), [disabled]);

  const setEnabled = useCallback(async (slug: string, enabled: boolean) => {
    await patch<{ slug: string; enabled: boolean }>(`/admin/topics/${slug}`, { enabled });
    setDisabled((prev) => {
      const next = new Set(prev);
      if (enabled) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }, []);

  const setSemana = useCallback(async (slug: string, lunes: string | null) => {
    await patch(`/admin/topics/${slug}`, { weekStart: lunes });
    setSemanas((prev) => {
      const next = { ...prev };
      if (lunes) next[slug] = lunes;
      else delete next[slug]; // vuelve a la fecha calculada
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ loading, isAvailable, setEnabled, disabled, semanas, setSemana }),
    [loading, isAvailable, setEnabled, disabled, semanas, setSemana],
  );

  return <VisibilityContext.Provider value={value}>{children}</VisibilityContext.Provider>;
}

export function useTopicVisibility() {
  const value = useContext(VisibilityContext);
  if (!value) {
    throw new Error('useTopicVisibility necesita estar dentro de <TopicVisibilityProvider>.');
  }
  return value;
}
