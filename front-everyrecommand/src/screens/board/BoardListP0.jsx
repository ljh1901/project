import { fetchApi } from "../../common/api";
import { useRef, useEffect } from 'react';
export function BoardListP0({onClose}) {
    const dialogRef = useRef(null);

    // vue : watch(() => {},[]) == React : useEffect(() => {},[])
    useEffect(() => {
        const dialog = dialogRef.current;
        dialog.showModal();
        return () => dialog.close();
    }, []);
    return (<dialog ref={dialogRef}
        onCancel={event => {
            event.preventDefault();
            onClose();
        }}>
        <div>
            <caption style={{ display: 'none' }}>게시판 카테고리 생성 팝업</caption>
            <table>
                <thead>
                    <tr>
                        <th>카테고리 이름</th>
                        <th>
                            <input type="text" name="brdCtidNm" placeholder="카테고리 이름 입력" max="50" />
                        </th>
                        <th>사용여부</th>
                        <th>
                            <select name="useYn">
                                <option value="Y">사용</option>
                                <option value="N">미사용</option>
                            </select>
                        </th>
                    </tr>
                </thead>
            </table>
        </div>
        <div className="dialog-actions">
            <button type="button" onClick={onClose}>생성</button>
            <button type="button" onClick={onClose}>취소</button>
        </div>
    </dialog>);
}