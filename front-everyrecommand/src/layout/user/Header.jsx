import { Link } from 'react-router-dom';
function Header(){
    return <header className="site-header">
        <div>
            <Link to="/admin/users">사용자 관리</Link>
            {' | '}
            <Link to="/admin/board-categories">게시판 관리</Link>
            {' | '}
            <Link to="/boards">게시판 목록</Link>
        </div>
    </header>
}
export default Header;
