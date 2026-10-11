import { useEffect, useRef, useState } from 'react';
import { fetchApi } from '../../js/common/api';
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
  useEffect(() => {
    let active = true;
    fetchApi.post("/api/admin/users/detail", {
      seq: userInfo.seqTbEvrcUsers,
      userId: userInfo.userId
    }).then(result => {
      console.log(result);
       setUser(result || {});
    })
    return () => { active = false; };
  }, [userInfo.seqTbEvrcUsers, userInfo.userId]);

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
      <p className="eyebrow">UserListP0</p>
      <h2 id="user-detail-title">사용자 상세보기</h2>
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
          <tr><th scope="row">생년월일</th><td>{user.userBrth?.split('T')[0] || '-'}</td></tr>
          <tr><th scope="row">이메일</th><td>{user.userEmil || '-'}</td></tr>
          <tr><th scope="row">전화번호</th><td>{user.userPrfid || '-'}</td></tr>
          <tr><th scope="row">최초 생성일</th><td>{user.userCret?.split('T')[0] || '-'}</td></tr>
          <tr><th scope="row">최종 수정일</th><td>{user.userUpet?.split('T')[0] || '-'}</td></tr>
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
