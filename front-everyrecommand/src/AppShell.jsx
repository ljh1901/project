import { useMemo } from 'react';
import { AppContext } from './common/AppContext.js';
import { createApiClient } from './common/apiClient.js';
import { PopupProvider } from './common/PopupProvider.jsx';
import { Router } from './router.js';

export function AppShell({ config }) {
  const api = useMemo(() => createApiClient({ apiUrl: config.apiUrl }), [config.apiUrl]);
  const app = useMemo(() => ({ config, api }), [config, api]);
  return <PopupProvider><AppContext.Provider value={app}>
    <header className="site-header"><a className="brand" href="#/">모두의 추천<span>EVERY RECOMMAND</span></a></header>
    <Router />
    <footer>함께 나누는 좋은 선택, 모두의 추천</footer>
  </AppContext.Provider></PopupProvider>;
}
