import { Link } from 'react-router-dom';
function Footer(){
    return <footer>
        <div className="footer__container">
            <div>
                <a href="/AD/adminLogin">관리자 모드</a>
            </div>
            <div>
                <label>&copy; EveryRecommand</label>
            </div>
        </div>
    </footer>
}
export default Footer;
