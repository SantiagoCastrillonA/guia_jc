import { createBrowserRouter } from 'react-router-dom';
import { Layout, PageFallback } from './components/Layout';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import { loadTopicRoute, publishedTopics } from './data/topics';

/** Las rutas de temas salen del registro — nunca se escriben dos veces. */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      // `lazy` en vez de React.lazy: el router espera el módulo COMO PARTE
      // de la navegación (useNavigation() lo refleja al instante), en vez de
      // suspenderse durante el render — ver el comentario en topics.ts.
      // `HydrateFallback` cubre el otro caso: abrir la URL directamente (no
      // navegando desde otra página) — sin esto el router no pinta nada
      // hasta que el módulo cargue, y la página se ve en blanco.
      {
        path: 'entrar',
        lazy: async () => {
          const { default: Component } = await import('./pages/Login');
          return { Component };
        },
        HydrateFallback: PageFallback,
      },
      {
        path: 'admin',
        lazy: async () => {
          const { default: Component } = await import('./pages/Admin');
          return { Component };
        },
        HydrateFallback: PageFallback,
      },
      // Solo los temas con página tienen ruta; el resto son tarjetas
      // "próximamente" en la home.
      ...publishedTopics().map((topic) => ({
        path: `tema/${topic.slug}`,
        lazy: loadTopicRoute(topic.slug),
        HydrateFallback: PageFallback,
      })),
      { path: '*', element: <NotFound /> },
    ],
  },
]);
