import { useEffect, useState } from 'react';
import { fetchApi } from '../../js/common/api.js';
import { BoardListP0 } from './BoardListP0.jsx';
import { formatTs } from '../../js/common/timeUtils.js';
import { popUpOpen } from '../../js/user/popUp.js';
function BoardCategoryListM0() {
  const [boards, setBoards] = useState([]);
  // 팝업 창 오픈
  const [isModalOpen, setIsModalOpen] = useState(false);
  const loadData = async () =>{
    const boardList = await fetchApi.get('/api/admin/BoardCategoryM0');
    setBoards(boardList);
  }  
  const deleteCategory = async (params) => {
    console.log(params);
    const result = await fetchApi.put('/api/admin/BoardCategoryM0', params);
  }
  useEffect(() => {
    loadData();
    popUpOpen();
  }, []);
  return <>
  <main className="user-list">
    <caption style={{display:'none'}}>게시판 카테고리 관리</caption>
    <table className="user-table">
      <thead>
        <tr>
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
        <tr key={board.brd_ctid}>
          <td>{board.brd_ctid}</td>
          <td>{board.brd_ctid_nm}</td>
          <td>{board.use_yn}</td>
          <td>{formatTs(board.brd_frrg_ts)}</td>
          <td>{board.brd_lsmd_fnm}</td>
          <td>{formatTs(board.brd_lsmd_ts)}</td>
          <td>{board.brd_lsmd_unm}</td>
          <td>
            <button onClick={() => deleteCategory({ brdCtid: board.brd_ctid })}>삭제</button>
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
