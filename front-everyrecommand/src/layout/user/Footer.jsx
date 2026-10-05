import { Link } from 'react-router-dom';
function Footer(){
    return <footer>
        <div className="footer__container">
            <div>
                <Link to="/AD/adminLogin">관리자 모드</Link>
            </div>
            <div>
                <label>&copy; EveryRecommand</label>
            </div>
        </div>
    </footer>
}
export default Footer;
