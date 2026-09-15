import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import { makeRouter } from './router';
import { ContentProvider, useContent } from './data/ContentContext';
import { AppErrorBoundary } from './components/AppErrorBoundary';
import './styles.css';

const RoboticsSite = () => {
  const { content } = useContent();

  const router = React.useMemo(() => makeRouter(content), [content]);

  return <RouterProvider router={router} />;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <ContentProvider>
        <RoboticsSite />
      </ContentProvider>
    </AppErrorBoundary>
  </React.StrictMode>
);
