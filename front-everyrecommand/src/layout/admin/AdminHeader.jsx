import Header from '../user/Header.jsx';

import { NavLink, Link } from 'react-router-dom';

function AdminHeader() {
    return (
        <>
            <Header context="관리자" />
            <nav aria-label="관리자 도구" className="admin-nav">
                <NavLink to="/admin/AD0001M0">SQL 관리</NavLink>
                <Link to="/boards/Chat0001M0">채팅</Link>
            </nav>
        </>
    );
}

export default AdminHeader;
