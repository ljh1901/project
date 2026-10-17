import { Link, NavLink, useMatches } from 'react-router-dom';

function Header({ context = '커뮤니티' }) {
    const navClass = ({ isActive }) => isActive ? 'active' : undefined;
    const matches = useMatches();
    console.log(matches)
    const screenName = matches[matches.length - 1]?.handle?.screenName;

    return (
        <header className="site-header">
            <div className="site-header-inner">
                <div className="site-brand-row">
                    <Link to="/boards" className="site-brand-mark" aria-label="모두의 추천 홈">M</Link>
                    <Link to="/boards" className="brand">모두의 추천</Link>
                    <span className="site-context">{context}{screenName}</span>
                </div>
            </div>
            <nav className="site-nav" aria-label="주 메뉴">
                <NavLink to="/admin/users" className={navClass}>
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                        <circle cx="6" cy="5" r="2.5" /><path d="M1.5 14v-2a4.5 4.5 0 0 1 9 0v2M11 3a2.5 2.5 0 0 1 0 5m1 2a4 4 0 0 1 2.5 4" />
                    </svg>
                    사용자
                </NavLink>
                <NavLink to="/admin/board-categories" className={navClass}>
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                        <rect x="2" y="2" width="4.5" height="4.5" rx=".8" /><rect x="9.5" y="2" width="4.5" height="4.5" rx=".8" />
                        <rect x="2" y="9.5" width="4.5" height="4.5" rx=".8" /><rect x="9.5" y="9.5" width="4.5" height="4.5" rx=".8" />
                    </svg>
                    게시판 카테고리
                </NavLink>
                <NavLink to="/boards" className={navClass}>
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                        <rect x="2" y="2" width="12" height="12" rx="1.5" /><path d="M5 5h6M5 8h6M5 11h4" />
                    </svg>
                    게시판
                </NavLink>
            </nav>
        </header>
    );
}

export default Header;
