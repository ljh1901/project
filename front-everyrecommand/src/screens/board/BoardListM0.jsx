import { useEffect, useState } from 'react';
import { fetchApi } from '../../common/api.js';
import { BoardListP0 } from './BoardListP0.jsx';

export function BoardListM0() {
  const [boards, setBoards] = useState([]);
  // 팝업 창 오픈
  const [isModalOpen, setIsModalOpen] = useState(false);
  const loadData = async () =>{
    const boardList = await fetchApi.get('/api/admin/BoardCategoryM0')
    setBoards(boardList);
  }
  useEffect(() => {
    loadData();
  }, []);

  return <main className="user-list">
    <caption style={{display:'none'}}>게시판 카테고리 관리</caption>
    <table className="user-table">
      <thead>
        <tr>
          <th>카테고리 ID</th>
          <th>카테고리명</th>
          <th>사용 여부</th>
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
        </tr>)}
        {boards.length === 0 && 
        <tr>
          <td colSpan="3">등록된 카테고리가 없습니다.</td>
          </tr>}
      </tbody>
    </table>
    {isModalOpen &&<BoardListP0  onClose={() => {setIsModalOpen(false)}}/>}
  </main>;
}
