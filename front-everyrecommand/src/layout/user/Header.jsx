import { Link } from 'react-router-dom';
function Header(){
    return <header className="site-header">
        <div>
            <Link to="/admin">사용자 관리</Link>
            {' | '}
            <Link to="/main/board">게시판 관리</Link>
        </div>
    </header>
}
export default Header;
