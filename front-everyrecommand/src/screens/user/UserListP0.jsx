import { useEffect, useRef, useState } from 'react';
import { fetchApi } from '../../common/api.js';
export function UserListP0({ userInfo, onClose }) {

  const dialogRef = useRef(null);
  /**
   * @Parameter
   * 
   * Reactive 데이터
   * Vue : ref({}) == React : useState({})
   * 
   * @Setter
   * user에 대한 Setter
   * 
   * String userName;
   * public void setUser(String userName, ...){
   *      this.userName = userName;
   *      ...
   * }
   * const [user, setUser] = useState({});
   *
   */
  const [user, setUser] = useState({});
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    setError('');
    fetchApi.post("/api/admin/UserListP0", {
      seq: userInfo.seq,
      userId: userInfo.userId
    }).then(result => {
      if (active) setUser(result || {});
    }).catch(error => {
      if (active) setError(error.message);
    });
    return () => { active = false; };
  }, [userInfo.seq, userInfo.userId]);
  // vue : watch(() => {},[]) == React : useEffect(() => {},[])
  useEffect(() => {
    const dialog = dialogRef.current;
    dialog.showModal();
    return () => dialog.close();
  }, []);
  return (
    <dialog ref={dialogRef} aria-labelledby="user-detail-title"
      onCancel={event => {
        event.preventDefault();
        onClose();
      }}>
      <h2 id="user-detail-title">사용자 상세보기</h2>
      {error && <p role="alert">{error}</p>}
      <table>
        <tbody>
          <tr>
            <th>아이디</th>
            <td>{user.userId}</td>
          </tr>
          <tr>
            <th>이름</th>
            <td>{user.userName}</td>
          </tr>
          <tr><th scope="row">생년월일</th><td>{user.birthDate?.split('T')[0] || '-'}</td></tr>
          <tr><th scope="row">이메일</th><td>{user.userEmail || '-'}</td></tr>
          <tr><th scope="row">전화번호</th><td>{user.prfId || '-'}</td></tr>
          <tr><th scope="row">최초 생성일</th><td>{user.createdAt?.split('T')[0] || '-'}</td></tr>
          <tr><th scope="row">최종 수정일</th><td>{user.updatedAt?.split('T')[0] || '-'}</td></tr>
        </tbody>
      </table>

      <div className="dialog-actions">
        <button type="button" onClick={onClose}>
          닫기
        </button>
      </div>
    </dialog>
  );
}
