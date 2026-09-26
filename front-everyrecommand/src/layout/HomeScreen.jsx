import { fetchApi } from '../common/api.js';
import { useState } from 'react';
import { usePopup } from '../common/PopupProvider.jsx';

// 로그인한 사용자 정보와 로그아웃 버튼을 표시
export function HomeScreen({ user, setUser }) {
  const popup = usePopup();
  const [busy, setBusy] = useState(false);
  // 사용자 확인 후 로그아웃하고 로그인 화면으로 이동
  async function logout() {
    if (busy) return;
    setBusy(true);
    try {
      if (!await popup.confirm('로그아웃하시겠습니까?')) return;
      await fetchApi('/auth/logout', { method: 'POST' });
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
