import React from 'react';
import AppRouter from '@/app/router';
import ErrorBoundary from '@/app/providers/ErrorBoundary';

/**
 * App — the root composition layer.
 * Keeps routing, providers, and error boundaries here so
 * individual pages stay completely free of global concerns.
 */
const App = () => (
  <ErrorBoundary>
    <AppRouter />
  </ErrorBoundary>
);

export default App;
