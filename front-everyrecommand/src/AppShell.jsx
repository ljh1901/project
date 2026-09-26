import { PopupProvider } from './common/PopupProvider.jsx';
import { Router } from './router.js';

export function AppShell() {

  return <PopupProvider>
    <header className="site-header">
      <a className="brand" href="/">모두의 추천
      <span>EVERY RECOMMAND</span>
      </a>
    </header>
    <Router />
    <footer>함께 나누는 좋은 선택, 모두의 추천</footer>
  </PopupProvider>;
}
