import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import './index.css';

const getDashboardToken = () => localStorage.getItem('vega_dashboard_token')?.trim() ?? '';
const originalFetch = window.fetch.bind(window);

window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
  const token = getDashboardToken();
  const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;

  if (token && url.startsWith('/api')) {
    const headers = new Headers(init?.headers ?? {});
    if (!headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    if (!headers.has('X-Dashboard-Token')) {
      headers.set('X-Dashboard-Token', token);
    }

    return originalFetch(input, { ...init, headers });
  }

  return originalFetch(input, init);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
