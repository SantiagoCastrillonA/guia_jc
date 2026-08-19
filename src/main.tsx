import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { AuthProvider } from './lib/auth';
import { ProgressProvider } from './lib/progress';
import { TopicVisibilityProvider } from './lib/topicVisibility';
import './styles/nocturne.css';
import './styles/layout.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <TopicVisibilityProvider>
        <ProgressProvider>
          <RouterProvider router={router} />
        </ProgressProvider>
      </TopicVisibilityProvider>
    </AuthProvider>
  </StrictMode>,
);
