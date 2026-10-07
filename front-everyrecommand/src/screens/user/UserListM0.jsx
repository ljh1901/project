import { useEffect, useState } from 'react';
import {UserListP0} from './UserListP0.jsx';
import { fetchApi } from '../../js/common/api.js';

export function UserListM0() {
  const [users, setUsers] = useState([]);       // 사용자 목록
  const [selectedUser, setSelectedUser] = useState(null);
  useEffect(() => {
  fetchApi.get('/api/admin/UserListM0')
  .then(result => {
    setUsers(result);
    console.log(result);
  })
  }, []);

  return <main className="user-list">
    <div className="user-list-heading">
      <div>
        <p className="eyebrow">
          사용자 관리
        </p>
        <h1>사용자 목록</h1>
      </div>
    </div>
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
          {users.map(user => <tr key={user.seq}>
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
          {users.length === 0 &&
            <tr>
              <td colSpan="6">등록된 사용자가 없습니다.</td>
            </tr>}
        </tbody>
      </table>
    </div>
    {selectedUser && (
  <UserListP0 userInfo={selectedUser} onClose={() => setSelectedUser(null)}/>
  )}
  </main>;
}
