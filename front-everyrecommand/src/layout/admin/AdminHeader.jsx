import Header from '../user/Header.jsx';

import { NavLink } from 'react-router-dom';

function AdminHeader() {
    return (
        <>
            <Header context="관리자" />
            <nav aria-label="관리자 도구">
                <NavLink to="/admin/AD0001M0">SQL 관리</NavLink>
            </nav>
        </>
    );
}

export default AdminHeader;
