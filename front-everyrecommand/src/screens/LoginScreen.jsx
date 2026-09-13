import { useState } from 'react';
import { useApp } from '../common/AppContext.js';
import { usePopup } from '../common/PopupProvider.jsx';

export function LoginScreen() {
  const { api, setUser } = useApp();
  const popup = usePopup();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  async function login(event) {
    event.preventDefault();
    if (busy) return;
    if (!loginId.trim() || !password.trim() || new TextEncoder().encode(password).length > 72) {
      await popup.error('아이디와 비밀번호를 확인해 주세요. 비밀번호는 72바이트까지 입력할 수 있습니다.');
      return;
    }
    setBusy(true);
    try {
      const user = await api.request('/auth/login', {
        method: 'POST', body: { loginId, password }, silentUnauthorized: true,
      });
      setUser(user);
      location.hash = '/';
    } catch (error) {
      await popup.error(error.message);
    } finally {
      setPassword('');
      setBusy(false);
    }
  }
  return <main className="login-layout">
    <section className="intro">
      <p className="eyebrow">좋은 선택의 시작</p>
      <h1>당신의 다음 선택에<br /><em>모두의 추천.</em></h1>
      <p className="intro-description">함께 나누는 경험이 더 좋은 선택을 만듭니다.<br />로그인하고 모두의 추천을 만나보세요.</p>
      <div className="intro-note"><span className="note-mark">✳</span><p>나에게 좋은 발견이<br />누군가에게 좋은 추천으로.</p></div>
    </section>
    <section className="login-card" aria-labelledby="login-title">
      <p className="eyebrow">다시 만나 반갑습니다</p>
      <h2 id="login-title">로그인</h2>
      <p className="muted">아이디와 비밀번호를 입력해 주세요.</p>
      <form onSubmit={login}>
        <label htmlFor="login-id">아이디</label>
        <input id="login-id" name="username" autoComplete="username" value={loginId}
          onChange={event => setLoginId(event.target.value)} required maxLength={50} disabled={busy} />
        <label htmlFor="password">비밀번호</label>
        <input id="password" name="password" type="password" autoComplete="current-password" value={password}
          onChange={event => setPassword(event.target.value)} required maxLength={72} disabled={busy} />
        <button className="login-button" type="submit" disabled={busy}>{busy ? '로그인 중…' : '로그인'}</button>
      </form>
    </section>
  </main>;
}
