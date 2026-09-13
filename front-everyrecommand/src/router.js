import { createElement, useEffect, useState } from 'react';
import { useApp } from './common/AppContext.js';
import { LoginScreen } from './screens/LoginScreen.jsx';
import { HomeScreen } from './screens/HomeScreen.jsx';

// 로그인 상태에 따라 홈 또는 로그인 화면으로 이동합니다.
export function Router() {
  const { user } = useApp();
  const [path, setPath] = useState(() => location.hash.slice(1) || '/');
  useEffect(() => {
    const update = () => setPath(location.hash.slice(1) || '/');
    addEventListener('hashchange', update);
    return () => removeEventListener('hashchange', update);
  }, []);
  useEffect(() => {
    if (!user && path !== '/login') location.hash = '/login';
    if (user && path === '/login') location.hash = '/';
  }, [user, path]);
  return createElement(user ? HomeScreen : LoginScreen);
}
