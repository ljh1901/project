import { Outlet } from 'react-router-dom';
import Header from './layout/Header.jsx';
import Footer from './layout/Footer.jsx';
function Main() {
  return <>
    <Header />
    <Outlet />
    <Footer/>
  </>;
}
export default Main;
