import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
function Main() {
  return <>
    <Header />
    <Outlet />
    <Footer/>
  </>;
}
export default Main;
