import { createElement, lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import { publishedTopics } from './data/topics';

// Login y panel solo viajan cuando alguien los abre.
const Login = lazy(() => import('./pages/Login'));
const Admin = lazy(() => import('./pages/Admin'));

/** Las rutas de temas salen del registro — nunca se escriben dos veces. */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'entrar', element: <Login /> },
      { path: 'admin', element: <Admin /> },
      // Solo los temas con página tienen ruta; el resto son tarjetas
      // "próximamente" en la home.
      ...publishedTopics().map((topic) => ({
        path: `tema/${topic.slug}`,
        element: createElement(topic.Page!),
      })),
      { path: '*', element: <NotFound /> },
    ],
  },
]);
