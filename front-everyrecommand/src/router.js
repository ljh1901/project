import { createElement, useEffect, useState } from 'react';
import { useApp } from './common/AppContext.js';
import { LoginScreen } from './screens/LoginScreen.jsx';
import { HomeScreen } from './screens/HomeScreen.jsx';

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
