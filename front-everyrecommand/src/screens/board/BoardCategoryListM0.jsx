import { useEffect, useState } from 'react';
import { fetchApi } from '../../js/common/api.js';
import { Link } from 'react-router-dom';
import { BoardListP0 } from './BoardListP0.jsx';
import { formatTs } from '../../js/common/timeUtils.js';
import { popUpOpen } from '../../js/user/popUp.js';
import { selectCheckBox } from '../../js/admin/boardCategoryListM0.js';
import '../../css/boardCategoryListM0.css';
function BoardCategoryListM0() {
  const [boards, setBoards] = useState([]);
  // 팝업 창 오픈
  const [isModalOpen, setIsModalOpen] = useState(false);
  const loadData = async () =>{
    const boardList = await fetchApi.get('/api/admin/board-categories');
    setBoards(boardList);
  }  
  const deleteCategory = async (params) => {
    const result = await fetchApi.put('/api/admin/board-categories', params);
  }
  useEffect(() => {
    loadData();
    popUpOpen();
  }, []);
  return <>
  <main className="user-list">
    <p className="eyebrow">BoardCategoryListM0</p>
    <Link to="/boards">게시판 목록</Link>
    <caption style={{display:'none'}}>게시판 카테고리 관리</caption>
    <table className="user-table">
      <thead>
        <tr>
          <th><input type="checkbox" id="checkAll" className="category-checkbox" aria-label="카테고리 전체 선택" onChange={selectCheckBox}></input></th>
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
          <td><input type="checkbox" className="checkBoxId category-checkbox" aria-label={`${board.brdCtidNm} 선택`}></input></td>
          <td>{board.brdCtid}</td>
          <td title={board.brdCtidNm}>{board.brdCtidNm}</td>
          <td>
            <select>
              <option value={board.useYn=='Y'}>사용</option>
              <option value={board.useYn=='N'}>미사용</option>
            </select>
          </td>
          <td>{formatTs(board.brdFrrgTs)}</td>
          <td>{board.brdLsmdFnm}</td>
          <td>{formatTs(board.brdLsmdTs)}</td>
          <td>{board.brdLsmdUnm}</td>
          <td>
            <button onClick={() => deleteCategory({ brdCtid: board.brdCtid })}>삭제</button>
          </td>
        </tr>)}
        {boards.length === 0 && 
        <tr>
          <td colSpan="3">등록된 카테고리가 없습니다.</td>
          </tr>}
      </tbody>
    </table>
    {isModalOpen &&<BoardListP0 onClose={() => {setIsModalOpen(false)}} onCreated={loadData}/>}
  </main>
  </>;
}
export {BoardCategoryListM0};
