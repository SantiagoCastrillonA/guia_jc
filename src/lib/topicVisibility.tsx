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

/**
 * Qué temas apagó el profe desde el panel de admin. `topics.ts` sigue siendo
 * la fuente de qué temas EXISTEN (`published`); esto solo decide cuáles están
 * visibles ahora mismo, sin necesitar un deploy.
 */

interface VisibilityValue {
  loading: boolean;
  isAvailable: (slug: string) => boolean;
  setEnabled: (slug: string, enabled: boolean) => Promise<void>;
  disabled: Set<string>;
}

const VisibilityContext = createContext<VisibilityValue | null>(null);

export function TopicVisibilityProvider({ children }: { children: ReactNode }) {
  const [disabled, setDisabled] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api<{ disabled: string[] }>('/topics/visibility')
      .then((data) => {
        if (!cancelled) setDisabled(new Set(data.disabled));
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

  const value = useMemo(
    () => ({ loading, isAvailable, setEnabled, disabled }),
    [loading, isAvailable, setEnabled, disabled],
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
