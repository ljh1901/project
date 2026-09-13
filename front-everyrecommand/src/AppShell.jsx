import { useEffect, useMemo, useState } from 'react';
import { AppContext } from './common/AppContext.js';
import { createApiClient } from './common/apiClient.js';
import { PopupProvider, usePopup } from './common/PopupProvider.jsx';
import { Router } from './router.js';

export function AppShell({ config }) {
  return <PopupProvider><Application config={config} /></PopupProvider>;
}

function Application({ config }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const popup = usePopup();
  const api = useMemo(() => createApiClient({
    apiUrl: config.apiUrl,
    onUnauthorized: () => { setUser(null); location.hash = '/login'; },
  }), [config.apiUrl]);

  useEffect(() => {
    let active = true;
    api.request('/auth/me', { silentUnauthorized: true })
      .then(value => { if (active) setUser(value); })
      .catch(error => { if (active && error.status !== 401) popup.error(error.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [api, popup]);

  const app = useMemo(() => ({ config, api, user, setUser }), [config, api, user]);
  return <AppContext.Provider value={app}>
    <header className="site-header"><a className="brand" href="#/">모두의 추천<span>EVERY RECOMMAND</span></a></header>
    {loading ? <p className="loading" role="status">로그인 상태를 확인하고 있습니다.</p> : <Router />}
    <footer>함께 나누는 좋은 선택, 모두의 추천</footer>
  </AppContext.Provider>;
}
