import { Link } from 'react-router-dom';

function BoardListM0() {
    return (
        <main className="page-container">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">커뮤니티 / 게시판</p>
                    <h1>게시판</h1>
                    <p className="page-description">경험과 추천을 나누는 공간입니다.</p>
                </div>
                <Link to="/boards/new" className="button button-primary">게시글 작성</Link>
            </div>
            <section className="panel" aria-label="게시글 목록">
                <div className="panel-heading"><h2>게시글 목록</h2></div>
                <div className="user-table-scroll">
                    <table className="user-table">
                        <caption hidden>게시판 목록</caption>
                        <thead>
                            <tr>
                                <th scope="col">순번</th>
                                <th scope="col">제목</th>
                                <th scope="col">작성자</th>
                                <th scope="col">수정일</th>
                                <th scope="col">조회 수</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td colSpan="5" className="empty-state">표시할 게시글이 없습니다.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    );
}

export { BoardListM0 };
