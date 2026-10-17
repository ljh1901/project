import { formatTs } from '../../js/utils/timeUtils.js';
import { useBoardCategoryListM0 } from '../../js/admin/boardCategoryListM0.js';
import { BoardListP0 } from './BoardListP0.jsx';
import '../../css/boardCategoryListM0.css';

function BoardCategoryListM0() {
    const {
        boards, selectedIds, isSaving, error, isModalOpen, setIsModalOpen,
        loadData, deleteCategory, saveSelected, selectCheckBox, selectedCheckBoxes, handleChange,
    } = useBoardCategoryListM0();

    return (
        <main className="user-list">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">관리자 / 게시판</p>
                    <h1>게시판 카테고리</h1>
                    <p className="page-description">카테고리를 만들고 사용 여부를 관리합니다.</p>
                </div>
                <button type="button" className="button-primary" onClick={() => setIsModalOpen(true)}>카테고리 생성</button>
            </div>
            {error && <p role="alert">{error}</p>}
            <section className="panel" aria-label="전체 카테고리">
                <div className="panel-heading">
                    <h2>전체 카테고리 <span className="count-badge">{boards.length.toLocaleString()}</span></h2>
                    <span className="panel-caption">{selectedIds.length > 0 ? `${selectedIds.length}개 선택됨` : '수정할 항목을 선택하세요.'}</span>
                </div>
                <div className="user-table-scroll">
                    <table className="user-table">
                        <caption hidden>게시판 카테고리 관리</caption>
                        <thead>
                            <tr>
                                <th scope="col">
                                    <input type="checkbox" id="checkAll" className="category-checkbox" aria-label="카테고리 전체 선택"
                                        disabled={isSaving} checked={boards.length > 0 && selectedIds.length === boards.length}
                                        onChange={selectCheckBox} />
                                </th>
                                <th scope="col">카테고리 ID</th>
                                <th scope="col">카테고리명</th>
                                <th scope="col">사용 여부</th>
                                <th scope="col">최초 생성자</th>
                                <th scope="col">최초 생성일</th>
                                <th scope="col">최종 수정일</th>
                                <th scope="col">최종 수정자</th>
                                <th scope="col">비고</th>
                            </tr>
                        </thead>
                        <tbody>
                            {boards.map(board => (
                                <tr key={board.brdCtid}>
                                    <td>
                                        <input type="checkbox" className="checkBoxId category-checkbox" aria-label={`${board.brdCtidNm} 선택`}
                                            disabled={isSaving} checked={selectedIds.includes(board.brdCtid)}
                                            onChange={e => selectedCheckBoxes(e, board.brdCtid)} />
                                    </td>
                                    <td>{board.brdCtid}</td>
                                    <td title={board.brdCtidNm}>{board.brdCtidNm}</td>
                                    <td>
                                        <select name="useYn" aria-label={`${board.brdCtidNm} 사용 여부`} value={board.useYn}
                                            disabled={isSaving} onChange={handleChange(board.brdCtid)}>
                                            <option value="Y">사용</option>
                                            <option value="N">미사용</option>
                                        </select>
                                    </td>
                                    <td>{board.brdLsmdFnm}</td>
                                    <td>{formatTs(board.brdFrrgTs)}</td>
                                    <td>{formatTs(board.brdLsmdTs)}</td>
                                    <td>{board.brdLsmdUnm}</td>
                                    <td>
                                        <button type="button" disabled={isSaving}
                                            onClick={() => deleteCategory({ brdCtid: board.brdCtid, useYn: board.useYn })}>삭제</button>
                                    </td>
                                </tr>
                            ))}
                            {boards.length === 0 && (
                                <tr><td colSpan="9" className="empty-state">등록된 카테고리가 없습니다.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="panel-footer">
                    <button type="button" className="button-primary" disabled={isSaving || selectedIds.length === 0}
                        onClick={saveSelected}>선택된 항목 저장</button>
                </div>
            </section>
            {isModalOpen && <BoardListP0 onClose={() => setIsModalOpen(false)} onCreated={loadData} />}
        </main>
    );
}

export { BoardCategoryListM0 };
