import { useEffect, useState } from 'react';
import { useApp } from '../common/AppContext.js';

export function UserListM0() {
  const { api } = useApp();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    api.request('/admin/user/list')
      .then(data => { if (active) setUsers(data); })
      .catch(error => { if (active) setError(error.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [api, revision]);

  return <main className="user-list">
    <div className="user-list-heading">
      <div><p className="eyebrow">사용자 관리</p><h1>사용자 목록</h1></div>
      <button disabled={loading} onClick={() => setRevision(value => value + 1)}>새로고침</button>
    </div>
    {loading ? <p role="status">사용자 목록을 불러오고 있습니다.</p>
      : error ? <p role="alert">{error}</p>
      : <p className="muted">전체 {users.length}명</p>}
    <div className="user-table-scroll"><table className="user-table">
      <thead><tr><th>순번</th><th>아이디</th><th>이름</th><th>생년월일</th><th>이메일</th><th>전화번호</th></tr></thead>
      <tbody>{!loading && !error && users.map(user => <tr key={user.seq}>
        <td>{user.seq}</td><td>{user.userId}</td><td>{user.name}</td>
        <td>{user.birthDate || '-'}</td><td>{user.email || '-'}</td><td>{user.prfId || '-'}</td>
      </tr>)}
      {!loading && !error && users.length === 0 && <tr><td colSpan="6">등록된 사용자가 없습니다.</td></tr>}
      </tbody>
    </table></div>
  </main>;
}
