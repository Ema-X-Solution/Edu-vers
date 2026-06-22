import React from 'react';
import AppRouter from '@/app/router';
import ErrorBoundary from '@/app/providers/ErrorBoundary';

import { Toaster } from 'react-hot-toast';

/**
 * App — the root composition layer.
 * Keeps routing, providers, and error boundaries here so
 * individual pages stay completely free of global concerns.
 */
const App = () => (
  <ErrorBoundary>
    <AppRouter />
    <Toaster position="top-right" />
  </ErrorBoundary>
);

export default App;
