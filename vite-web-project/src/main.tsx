import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

import { searchHighlighter } from './searchBar';
import { setupShowHideToggle, setupCommentForm } from './comments';
import { loadBears } from './bearContentAPI';

searchHighlighter();
setupShowHideToggle();
setupCommentForm();
void loadBears();

const rootElement = document.getElementById('root');

if (rootElement === null) {
  throw new Error('Root element not found.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
