import { fetchApi } from '../../common/api.js';
import { useEffect, useState } from 'react';
import {UserListP0} from './UserListP0.jsx';



export function UserListM0() {
  const [users, setUsers] = useState([]);       // 사용자 목록
  const [loading, setLoading] = useState(true); // 조회 중인지
  const [error, setError] = useState('');       // 오류 메시지
  const [revision, setRevision] = useState(0);  // 재조회 실행용 숫자

  const [selectedUser, setSelectedUser] = useState(null);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
fetchApi.get('/api/admin/UserListM0')
  .then(result => {
    if (!active) return;
    if (!result.success || !Array.isArray(result.data)) {
      throw new Error(result.message || '목록을 불러오지 못했습니다.');
    }
    setUsers(result.data);
  })
  .catch(error => {
    if (active) setError(error.message);
  })
  .finally(() => {
    if (active) setLoading(false);
  });
  }, [revision]);

  return <main className="user-list">
    <div className="user-list-heading">
      <div>
        <p className="eyebrow">
          사용자 관리
        </p>
        <h1>사용자 목록</h1>
      </div>
    </div>
    {loading ?
      <p role="status">
        사용자 목록을 불러오고 있습니다.
      </p> : error ?
        <p role="alert">
          {error}
        </p> :
        <p className="muted">
          전체 {users.length}명
        </p>}
    <div className="user-table-scroll">
      <table className="user-table">
        <thead>
          <tr>
            <th>사용자 번호</th>
            <th>아이디</th>
            <th>이름</th>
            <th>생년월일</th>
            <th>이메일</th>
            <th>전화번호</th>
            <th>최초 생성일</th>
            <th>최종 수정일</th>
            <th>비고</th>
          </tr>
        </thead>
        <tbody>
          {!loading && !error && users.map(user =>
            <tr key={user.seq}>
              <td>{user.seq}</td>
              <td>{user.userId}</td>
              <td>{user.userName}</td>
              <td>{user.birthDate.substring(0,user.birthDate.indexOf('T'))}</td>
              <td>{user.userEmail}</td>
              <td>{user.prfId || '-'}</td>
              <td>{user.createdAt.substring(0,user.createdAt.indexOf('T'))}</td>
              <td>{user.updatedAt.substring(0,user.updatedAt.indexOf('T'))}</td>
              <td>
                <button type="button" onClick={() => setSelectedUser(user)}>
                  상세보기
                </button>
              </td>
            </tr>)}
          {!loading && !error && users.length === 0 &&
            <tr>
              <td colSpan="6">등록된 사용자가 없습니다.</td>
            </tr>}
        </tbody>
      </table>
    </div>
    {selectedUser && (
  <UserListP0
    userInfo={selectedUser}
    onClose={() => setSelectedUser(null)}
  />
  )}
  </main>;
}
