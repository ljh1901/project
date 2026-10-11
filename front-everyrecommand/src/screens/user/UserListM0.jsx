import { useEffect, useState } from 'react';
import {UserListP0} from './UserListP0.jsx';
import { fetchApi } from '../../js/common/api.js';

export function UserListM0() {
  const [users, setUsers] = useState([]);       // 사용자 목록
  const [selectedUser, setSelectedUser] = useState(null);
  useEffect(() => {
  fetchApi.get('/api/admin/users')
  .then(result => {
    console.log(result);
    setUsers(result);
  })
  }, []);

  return <main className="user-list">
    <div className="user-list-heading">
      <div>
        <p className="eyebrow">
          UserListM0
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
          {users.map(user => <tr key={user.seqTbEvrcUsers}>
              <td>{user.seqTbEvrcUsers}</td>
              <td>{user.userId}</td>
              <td>{user.userName}</td>
              <td>{user.userBrth.substring(0,user.userBrth.indexOf('T'))}</td>
              <td>{user.userEmil}</td>
              <td>{user.userPrfid || '-'}</td>
              <td>{user.userCret.substring(0,user.userCret.indexOf('T'))}</td>
              <td>{user.userUpet.substring(0,user.userUpet.indexOf('T'))}</td>
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
