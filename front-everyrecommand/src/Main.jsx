import { Outlet } from 'react-router-dom';
import Header from './layout/user/Header.jsx';
import Footer from './layout/user/Footer.jsx';
function Main() {
  return <>
    <Header />
    <Outlet />
    <Footer/>
  </>;
}
export default Main;
