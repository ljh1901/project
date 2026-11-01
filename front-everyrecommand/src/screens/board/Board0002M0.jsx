import { Link } from 'react-router-dom';
import { Board0002P0 } from './Board0002P0.jsx';
import { utils } from '../../js/utils/timeUtils.js';
import { useBoardCategoryListM0} from '../../js/board/board0002M0.js';
function Board0002M0() {
  const {
    boards, 
    selectedIds, 
    isSaving, 
    error, 
    isModalOpen, 
    
    setIsModalOpen,
    loadData, 
    deleteCategory, 
    saveSelected, 
    selectCheckBox, 
    selectedCheckBoxes, 
    handleChange,

    searchBtn, 
    paging, 
    searchObj, 
    setSearchObj
  } = useBoardCategoryListM0();
  const changeSearch = (name, value) => setSearchObj(prev => ({ ...prev, [name]: value }));

  return <>
    <main className="user-list">
      <div className="page-heading">
        <div>
          <p className="eyebrow">관리자 / 게시판</p>
          <h1>카테고리 관리</h1>
          <p className="page-description">게시글에 사용할 카테고리와 사용 여부를 관리합니다.</p>
        </div>
        <Link to="/boards" className="button">게시판 목록</Link>
      </div>
      {error && <p role="alert">{error}</p>}
      <div className="filter-bar">
        <label className="filter-field">목록 개수
          <select value={searchObj.listCount} onChange={(e) => changeSearch('listCount', e.target.value)}>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
          </select>
        </label>
        <label className="filter-field filter-field-grow">카테고리명
        <input type="text" placeholder='카테고리 명으로 검색' value={searchObj.brdCtidNm}
        onChange={(e) => changeSearch('brdCtidNm', e.target.value)}
        onKeyDown={(e) => {if(e.key == 'Enter'){
          e.preventDefault();
          searchBtn(searchObj);
          }}}/>
        </label>
        <label className="filter-field">사용 여부
        <select value={searchObj.useYn} onChange={(e) => changeSearch('useYn', e.target.value)}>
          <option value="">선택</option>
          <option value="Y">사용</option>
          <option value="N">미사용</option>
        </select>
        </label>
        {/* <meter></meter>
      <progress></progress>
      <input type='range'></input> */}
        <label className="filter-field">생성일
          <input type="date" value={searchObj.brdFrrgTs} onChange={(e) => changeSearch('brdFrrgTs', e.target.value)}></input>
        </label>
        <button type="button" className="button-primary" onClick={() => searchBtn(searchObj)}>조회</button>
      </div>
      <div className="table-card table-scroll">
        <table className="user-table">
          <caption className="sr-only">게시판 카테고리 관리</caption>
          <thead>
            <tr>
              <th><input type="checkbox" id="checkAll" className="category-checkbox" aria-label="카테고리 전체 선택"
                disabled={isSaving} checked={boards.length > 0 && selectedIds.length === boards.length}
                onChange={selectCheckBox} />
              </th>
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
                <td>
                  <input type="checkbox"
                    className="checkBoxId 
                   category-checkbox"
                    aria-label={`${board.brdCtidNm} 선택`}
                    disabled={isSaving}
                    checked={selectedIds.includes(board.brdCtid)}
                    onChange={e => selectedCheckBoxes(e, board.brdCtid)} />
                </td>
                <td>{board.brdCtid}</td>
                <td title={board.brdCtidNm}>{board.brdCtidNm}</td>
                <td>
                  <select name="useYn" value={board.useYn} disabled={isSaving} onChange={handleChange(board.brdCtid)}>
                    <option value="Y">사용</option>
                    <option value="N">미사용</option>
                  </select>
                </td>
                <td>{utils.formatTs(board.brdFrrgTs)}</td>
                <td>{board.brdLsmdFnm}</td>
                <td>{utils.formatTs(board.brdLsmdTs)}</td>
                <td>{board.brdLsmdUnm}</td>
                <td>
                  <button className="button-danger" disabled={isSaving} onClick={() => deleteCategory({ brdCtid: board.brdCtid, useYn: board.useYn })}>삭제</button>
                </td>
              </tr>)}
            {boards.length === 0 &&
              <tr>
                <td colSpan="9" className="empty-state">등록된 카테고리가 없습니다.</td>
              </tr>}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="9">
                <button type="button" className="button-primary" disabled={isSaving || selectedIds.length === 0} onClick={saveSelected}>선택된 항목 저장</button>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      {paging?.links.length > 0 && (
        <nav aria-label="카테고리 페이지" className="pagination">
          {paging.links.map(link => (
            <Link key={`${link.label}:${link.to}`} to={link.to} aria-current={link.current ? 'page' : undefined}>
              {link.label}
            </Link>
          ))}
        </nav>
      )}
      {isModalOpen && <Board0002P0 onClose={() => { setIsModalOpen(false) }} onCreated={loadData} />}
    </main>
  </>;
}
export { Board0002M0 };
