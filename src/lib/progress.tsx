import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { api, del, post } from './api';
import { useAuth } from './auth';

/**
 * El progreso de ejercicios.
 *
 * - Sin sesión: vive en localStorage, para que quien entre a mirar no pierda
 *   lo que resolvió.
 * - Con sesión: vive en el servidor, atado al usuario. Al iniciar sesión, lo
 *   que se resolvió como anónimo se fusiona con la cuenta y se limpia el
 *   almacenamiento local.
 */

export type ProgressMap = Record<string, string[]>;

const KEY = 'jc:progress:v1';

function readLocal(): ProgressMap {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ProgressMap) : {};
  } catch {
    return {}; // modo privado o JSON corrupto: el progreso es opcional
  }
}

function writeLocal(value: ProgressMap) {
  try {
    localStorage.setItem(KEY, JSON.stringify(value));
  } catch {
    // sin almacenamiento: el estado en memoria alcanza para la sesión actual
  }
}

interface ProgressValue {
  progress: ProgressMap;
  /** true mientras se trae el progreso del servidor. */
  loading: boolean;
  markSolved: (topicSlug: string, exerciseId: string) => void;
  resetTopic: (topicSlug: string) => void;
}

const ProgressContext = createContext<ProgressValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [progress, setProgress] = useState<ProgressMap>(() => readLocal());
  const [loading, setLoading] = useState(false);
  const syncedFor = useRef<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      syncedFor.current = null;
      setProgress(readLocal());
      return;
    }
    if (syncedFor.current === user.id) return;
    syncedFor.current = user.id;

    const local = readLocal();
    const hasLocal = Object.values(local).some((ids) => ids.length > 0);
    setLoading(true);

    // Al entrar: si había progreso anónimo se fusiona; si no, solo se lee.
    const request = hasLocal
      ? post<{ progress: ProgressMap }>('/progress/merge', { progress: local })
      : api<{ progress: ProgressMap }>('/progress');

    request
      .then((data) => {
        setProgress(data.progress);
        if (hasLocal) writeLocal({}); // ya vive en la cuenta
      })
      .catch(() => {
        setProgress(local); // el servidor no respondió: no se pierde nada
      })
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  const markSolved = useCallback(
    (topicSlug: string, exerciseId: string) => {
      setProgress((prev) => {
        if (prev[topicSlug]?.includes(exerciseId)) return prev;
        const next = { ...prev, [topicSlug]: [...(prev[topicSlug] ?? []), exerciseId] };
        if (!user) writeLocal(next);
        return next;
      });
      // El servidor se actualiza en segundo plano: la UI no espera la red.
      if (user) {
        post<{ progress: ProgressMap }>('/progress', { topicSlug, exerciseId })
          .then((data) => setProgress(data.progress))
          .catch(() => {
            /* se reintenta la próxima vez que resuelva algo */
          });
      }
    },
    [user],
  );

  const resetTopic = useCallback(
    (topicSlug: string) => {
      setProgress((prev) => {
        const { [topicSlug]: _removed, ...rest } = prev;
        if (!user) writeLocal(rest);
        return rest;
      });
      if (user) {
        del<{ progress: ProgressMap }>(`/progress/${encodeURIComponent(topicSlug)}`)
          .then((data) => setProgress(data.progress))
          .catch(() => {});
      }
    },
    [user],
  );

  const value = useMemo(
    () => ({ progress, loading, markSolved, resetTopic }),
    [progress, loading, markSolved, resetTopic],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

function useProgressContext() {
  const value = useContext(ProgressContext);
  if (!value) throw new Error('El progreso necesita estar dentro de <ProgressProvider>.');
  return value;
}

const EMPTY: string[] = [];

export function useTopicProgress(topicSlug: string) {
  const { progress, markSolved, resetTopic } = useProgressContext();
  const solved = progress[topicSlug] ?? EMPTY;

  return {
    solved,
    count: solved.length,
    markSolved: useCallback(
      (exerciseId: string) => markSolved(topicSlug, exerciseId),
      [markSolved, topicSlug],
    ),
    reset: useCallback(() => resetTopic(topicSlug), [resetTopic, topicSlug]),
  };
}

/** El progreso completo, para las tarjetas de la home. */
export function useAllProgress() {
  return useProgressContext().progress;
}
