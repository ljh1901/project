import { useEffect, useState } from 'react';
import { fetchApi } from '../../common/api.js';

export function BoardListM0() {
  const [boards, setBoards] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    fetchApi.get('/api/admin/BoardCategoryM0')
      .then(result => {
        if (!Array.isArray(result)) throw new Error('목록 응답 형식을 확인해 주세요.');
        if (active) setBoards(result);
      })
      .catch(error => {
        console.error('게시판 카테고리 조회 실패', error);
        if (active) setError(error.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [revision]);

  return <main className="user-list">
    <h1>게시판 카테고리 관리</h1>
    <button type="button" disabled={loading} onClick={() => setRevision(value => value + 1)}>조회</button>
    {loading && <p role="status">목록을 불러오고 있습니다.</p>}
    {error && <p role="alert">{error}</p>}
    <table className="user-table">
      <thead><tr><th>카테고리 ID</th><th>카테고리명</th><th>사용 여부</th></tr></thead>
      <tbody>
        {!loading && !error && boards.map(board => <tr key={board.brd_ctid}>
          <td>{board.brd_ctid}</td><td>{board.brd_ctid_nm}</td><td>{board.use_yn}</td>
        </tr>)}
        {!loading && !error && boards.length === 0 && <tr><td colSpan="3">등록된 카테고리가 없습니다.</td></tr>}
      </tbody>
    </table>
  </main>;
}
