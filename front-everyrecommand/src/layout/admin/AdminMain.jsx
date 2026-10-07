import AdminHeader from './AdminHeader.jsx';
import AdminFooter from './AdminFooter.jsx';
import {Outlet} from 'react-router-dom';
function AdminMain(){
    return<>
    <AdminHeader/>
    <Outlet />
    <AdminFooter/>
    </>
}
export default AdminMain;