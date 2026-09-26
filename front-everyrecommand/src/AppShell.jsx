import { Router } from './router.js';
import { BrowserRouter, Link } from 'react-router-dom';
import { PopupProvider } from './common/PopupProvider.jsx';
export function AppShell() {

  return <BrowserRouter>
  <PopupProvider>
    <header className="site-header">
      <Link className="brand" to="/">모두의 추천
      <span>EVERY RECOMMAND</span>
      </Link>
    <Link to="/boards">게시판 카테고리 관리</Link>
    </header>
    <Router />
    <footer>함께 나누는 좋은 선택, 모두의 추천</footer>
  </PopupProvider>
  </BrowserRouter>;
}
