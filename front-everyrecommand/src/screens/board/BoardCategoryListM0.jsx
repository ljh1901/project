import { useEffect, useState } from 'react';
import { fetchApi } from '../../js/common/api.js';
import { Link } from 'react-router-dom';
import { BoardListP0 } from './BoardListP0.jsx';
import { formatTs } from '../../js/common/timeUtils.js';
import { popUpOpen } from '../../js/user/popUp.js';
import '../../css/boardCategoryListM0.css';
function BoardCategoryListM0() {
  const [boards, setBoards] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  // 팝업 창 오픈
  const [isModalOpen, setIsModalOpen] = useState(false);
  const loadData = async () =>{
    const boardList = await fetchApi.get('/api/admin/board-categories');
    setBoards(boardList);
    setSelectedIds([]);
  }  
  const deleteCategory = async (params) => {
    await saveCategories([params]);
  }
  const saveCategories = async (params) => {
    if (params.length === 0 || isSaving) return;
    setIsSaving(true);
    setError('');
    try {
      await fetchApi.put('/api/admin/board-categories', params);
      await loadData();
    } catch {
      setError('저장에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsSaving(false);
    }
  };
  const saveSelected = () => saveCategories(boards
    .filter(board => selectedIds.includes(board.brdCtid))
    .map(({ brdCtid, useYn }) => ({ brdCtid, useYn })));
  useEffect(() => {
    loadData();
    popUpOpen();
  }, []);
  return <>
  <main className="user-list">
    <p className="eyebrow">BoardCategoryListM0</p>
    <Link to="/boards">게시판 목록</Link>
    {error && <p role="alert">{error}</p>}
    <caption style={{display:'none'}}>게시판 카테고리 관리</caption>
    <table className="user-table">
      <thead>
        <tr>
          <th><input type="checkbox" id="checkAll" className="category-checkbox" aria-label="카테고리 전체 선택"
            disabled={isSaving} checked={boards.length > 0 && selectedIds.length === boards.length}
            onChange={e => setSelectedIds(e.target.checked ? boards.map(board => board.brdCtid) : [])}></input></th>
          <th>카테고리 ID</th>
          <th>카테고리명</th>
          <th>사용 여부</th>
          <th>최초 생성자</th>
          <th>최초 생성일</th>
          <th>최종 수정일</th>
          <th>최종 수정자</th>
          <th>
            <button type="button" onClick={() => setIsModalOpen(true)}>카테고리 생성</button>
          </th>
        </tr>
      </thead>
      <tbody>
        {boards.map(board => 
        <tr key={board.brdCtid}>
          <td><input type="checkbox" className="checkBoxId category-checkbox" aria-label={`${board.brdCtidNm} 선택`}
            disabled={isSaving} checked={selectedIds.includes(board.brdCtid)}
            onChange={e => {
              const checked = e.target.checked;
              setSelectedIds(prev => checked ? [...prev, board.brdCtid] : prev.filter(id => id !== board.brdCtid));
            }}></input></td>
          <td>{board.brdCtid}</td>
          <td title={board.brdCtidNm}>{board.brdCtidNm}</td>
          <td>
            <select value={board.useYn} disabled={isSaving} onChange={(e) => {
              const useYn = e.target.value;
              setBoards(prev => prev.map(item => item.brdCtid === board.brdCtid ? {...item, useYn}:item))
            }}>
              <option value="Y">사용</option>
              <option value="N">미사용</option>
            </select>
          </td>
          <td>{formatTs(board.brdFrrgTs)}</td>
          <td>{board.brdLsmdFnm}</td>
          <td>{formatTs(board.brdLsmdTs)}</td>
          <td>{board.brdLsmdUnm}</td>
          <td>
            <button disabled={isSaving} onClick={() => deleteCategory({ brdCtid: board.brdCtid, useYn: board.useYn })}>삭제</button>
          </td>
        </tr>)}
        {boards.length === 0 && 
        <tr>
          <td colSpan="3">등록된 카테고리가 없습니다.</td>
          </tr>}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan="9">
            <button type="button" disabled={isSaving || selectedIds.length === 0} onClick={saveSelected}>선택된 항목 저장</button>
        </td>
        </tr>
      </tfoot>
    </table>
    {isModalOpen &&<BoardListP0 onClose={() => {setIsModalOpen(false)}} onCreated={loadData}/>}
  </main>
  </>;
}
export {BoardCategoryListM0};
