import { createContext, useContext } from 'react';

interface ExerciseContextValue {
  topicSlug: string;
  solved: readonly string[];
  markSolved: (exerciseId: string) => void;
}

export const ExerciseContext = createContext<ExerciseContextValue | null>(null);

/** Exercises read their topic's progress from the surrounding <TopicPage>. */
export function useExerciseContext() {
  const value = useContext(ExerciseContext);
  if (!value) {
    throw new Error('Los ejercicios deben renderizarse dentro de <TopicPage>.');
  }
  return value;
}
