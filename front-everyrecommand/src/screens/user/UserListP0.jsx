import { useEffect, useRef } from 'react';
export function UserListP0({ userInfo, onClose }) {
  const dialogRef = useRef(null);

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
      <table>
        <tbody>
          <tr>
            <th>아이디</th>
            <td>{userInfo.userId}</td>
          </tr>
          <tr>
            <th>이름</th>
            <td>{userInfo.userName}</td>
          </tr>
          <tr><th scope="row">생년월일</th><td>{userInfo.birthDate?.split('T')[0] || '-'}</td></tr>
          <tr><th scope="row">이메일</th><td>{userInfo.userEmail || '-'}</td></tr>
          <tr><th scope="row">전화번호</th><td>{userInfo.prfId || '-'}</td></tr>
          <tr><th scope="row">최초 생성일</th><td>{userInfo.createdAt?.split('T')[0] || '-'}</td></tr>
          <tr><th scope="row">최종 수정일</th><td>{userInfo.updatedAt?.split('T')[0] || '-'}</td></tr>
        </tbody>
      </table>

      <div className="dialog-actions">
      <button type="button" autoFocus onClick={onClose}>
        닫기
      </button>
      </div>
    </dialog>
  );
}
