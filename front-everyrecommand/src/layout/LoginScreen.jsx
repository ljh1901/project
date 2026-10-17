import { fetchApi } from '../common/api.js';
import { useState } from 'react';
import { createValueChangeHandler } from '../js/common/formUtils.js';

// 아이디와 비밀번호를 입력하는 로그인 화면을 표시합니다.
export function LoginScreen({ setUser }) {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  // 입력값을 확인하고 로그인 성공 시 사용자 상태와 화면을 갱신합니다.
  async function login(event) {
    event.preventDefault();
    if (busy) return;
    if (!loginId.trim() || !password.trim() || new TextEncoder().encode(password).length > 72) {
      await window.PopupMyAlert.error('아이디와 비밀번호를 확인해 주세요. 비밀번호는 72바이트까지 입력할 수 있습니다.');
      return;
    }
    setBusy(true);
    try {
      const user = await fetchApi('/auth/login', {
        method: 'POST', body: { loginId, password }, silentUnauthorized: true,
      });
      setUser(user);
      location.hash = '/';
    } catch (error) {
      await window.PopupMyAlert.error(error.message);
    } finally {
      setPassword('');
      setBusy(false);
    }
  }
  return <main className="login-layout">
    <section className="intro">
      <p className="eyebrow">모두의 추천</p>
      <h1>경험을 나누고,<br />다음 선택을 찾아보세요.</h1>
      <p className="intro-description">로그인하여 게시글을 작성하고 추천을 나눌 수 있습니다.</p>
    </section>
    <section className="login-card" aria-labelledby="login-title">
      <h2 id="login-title">로그인</h2>
      <p className="muted">아이디와 비밀번호를 입력해 주세요.</p>
      <form onSubmit={login}>
        <label htmlFor="login-id">아이디</label>
        <input id="login-id" name="username" autoComplete="username" value={loginId}
          onChange={createValueChangeHandler(setLoginId)} required maxLength={50} disabled={busy} />
        <label htmlFor="password">비밀번호</label>
        <input id="password" name="password" type="password" autoComplete="current-password" value={password}
          onChange={createValueChangeHandler(setPassword)} required maxLength={72} disabled={busy} />
        <button className="login-button button-primary" type="submit" disabled={busy}>{busy ? '로그인 중…' : '로그인'}</button>
      </form>
    </section>
  </main>;
}
