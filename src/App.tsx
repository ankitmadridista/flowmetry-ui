import { useState, useEffect } from 'react';
import { apiClient } from './api';

type Status = 'loading' | 'connected' | 'error';

export default function App() {
  const [status, setStatus] = useState<Status>('loading');
  const apiUrl = import.meta.env.VITE_API_URL || '(relative)';

  useEffect(() => {
    apiClient
      .get('/health')
      .then((res) => setStatus(res.ok ? 'connected' : 'error'))
      .catch(() => setStatus('error'));
  }, []);

  return (
    <main style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <h1>Flowmetry</h1>
      <p>API URL: <code>{apiUrl}</code></p>
      {status === 'loading' && <p>Checking connection…</p>}
      {status === 'connected' && <p>Connected ✓</p>}
      {status === 'error' && <p>Error ✗</p>}
    </main>
  );
}
