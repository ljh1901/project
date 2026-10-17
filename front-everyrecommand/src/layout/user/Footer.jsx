import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="site-footer">
            <div className="footer__container">
                <span>&copy; EveryRecommand</span>
                <Link to="/admin/users">관리자 페이지</Link>
            </div>
        </footer>
    );
}

export default Footer;
