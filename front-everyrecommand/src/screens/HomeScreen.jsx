import { useState } from 'react';
import { useApp } from '../common/AppContext.js';
import { usePopup } from '../common/PopupProvider.jsx';

export function HomeScreen() {
  const { user, api, setUser } = useApp();
  const popup = usePopup();
  const [busy, setBusy] = useState(false);
  async function logout() {
    if (busy) return;
    setBusy(true);
    try {
      if (!await popup.confirm('로그아웃하시겠습니까?')) return;
      await api.request('/auth/logout', { method: 'POST' });
      setUser(null);
      location.hash = '/login';
    } catch (error) {
      await popup.error(error.message);
    } finally {
      setBusy(false);
    }
  }
  return <main className="home-card">
    <p className="eyebrow">모두의 추천</p>
    <h1>{user.displayName}님,<br />반갑습니다.</h1>
    <p className="muted">로그인되었습니다. 앞으로 이곳에서 추천을 함께 나눠요.</p>
    <dl><dt>아이디</dt><dd>{user.loginId}</dd></dl>
    <button className="secondary" disabled={busy} onClick={logout}>{busy ? '처리 중…' : '로그아웃'}</button>
  </main>;
}
