import { useRef, useEffect } from 'react';
import { useBoardListP0 } from '../../js/user/boardListP0';

function BoardListP0({ onClose, onCreated }) {
    const dialogRef = useRef(null);
    const { params, handleChange, handleAddCategory } = useBoardListP0(onClose, onCreated);

    useEffect(() => {
        const dialog = dialogRef.current;
        dialog.showModal();
        return () => dialog.close();
    }, []);

    return (
        <dialog ref={dialogRef} aria-labelledby="category-create-title"
            onCancel={event => {
                event.preventDefault();
                onClose();
            }}>
            <div className="modal-heading">
                <h2 id="category-create-title">카테고리 생성</h2>
            </div>
            <div className="modal-body">
                <div className="form-field">
                    <label htmlFor="category-name">카테고리 이름</label>
                    <input id="category-name" type="text" name="brdCtidNm" value={params.brdCtidNm}
                        onChange={handleChange} placeholder="카테고리 이름 입력" maxLength={50} />
                </div>
                <div className="form-field">
                    <label htmlFor="category-use">사용 여부</label>
                    <select id="category-use" name="useYn" value={params.useYn} onChange={handleChange}>
                        <option value="Y">사용</option>
                        <option value="N">미사용</option>
                    </select>
                </div>
            </div>
            <div className="dialog-actions">
                <button type="button" onClick={onClose}>취소</button>
                <button type="button" className="button-primary" onClick={handleAddCategory}>생성</button>
            </div>
        </dialog>
    );
}

export { BoardListP0 };
