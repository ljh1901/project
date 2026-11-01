import { boardWriteM0, onHandleClick, onHandleInput, getCategory} from "../../js/board/board0001M1";
import { useEffect, useState } from 'react';
import { createChangeHandler } from '../../js/utils/formUtils.js';
// import {ag} from 'ag-grid'
function Board0001M1() {
    const [params, setParams] = useState({
        brdTitle: '',
        brdContent: '',
        brdCnt: '',
    });
    const [categoryList, setCategoryList] = useState([]);
    const [categoryError, setCategoryError] = useState('');

    useEffect(() => {
        let active = true;

        const loadCategory = async () => {
            try {
                const result = await getCategory();
                if (active) {
                    setCategoryList(result);
                }
            } catch (error) {
                if (active) {
                    setCategoryError('카테고리 목록을 불러오지 못했습니다.');
                }
            }
        };

        loadCategory();
        return () => {
            active = false;
        };
    }, []);

    const handleChange = createChangeHandler(setParams);
    const fileBtn = (e) => {
        console.log(e.target)
        document.getElementById('file1').click();
    }


    return <>
        <main className="board__container editor-page">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">커뮤니티 / 게시판</p>
                    <h1>게시글 작성</h1>
                    <p className="page-description">나누고 싶은 경험이나 궁금한 이야기를 남겨 주세요.</p>
                </div>
            </div>
            <div className="board__body panel">
                <div>
                     <div className="form-field">
                        <label htmlFor="board-category">카테고리</label>
                        <div className="board-title-row">
                            <select id="board-category" className="w_100" defaultValue="">
                                <option value="">카테고리를 선택해주세요</option>
                                {categoryList.map((category, index) => (
                                    <option key={`${category.brdCtidNm}:${index}`} value={category.brdCtidNm}>
                                        {category.brdCtidNm}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {categoryError && <p role="alert">{categoryError}</p>}
                        <label htmlFor="board-title">제목</label>
                        <div className="board-title-row">
                            <input id="board-title"
                                        type="text" name="brdTitle" placeholder="제목을 입력해 주세요"
                                        value={params.brdTitle} 
                                        onChange={handleChange}/>
                        </div>
                    </div>
                    <div
                        className="board-content"
                        contentEditable
                        data-placeholder="내용을 입력해주세요!"
                        data-empty="true"
                        role="textbox"
                        aria-label="게시글 내용"
                        aria-multiline="true"
                        onInput={(e) => {
                            const editor = e.currentTarget;
                            editor.dataset.empty = String(!editor.textContent);
                                    onHandleInput(e);
                        }}
                    />
                    <div className="textCount" 
                        onInput={onHandleInput}
                        onCompositionEnd={onHandleInput}>0/0</div>
                    <div className="attach-file-container">
                        <input type="file" className="attachFiles" id="file1" onChange={boardWriteM0} multiple hidden />
                        <button type="button" className="fileBtn" onClick={fileBtn}>파일첨부</button>
                    </div>
                    <div className="editor-actions">
                        <button type="button" className="button-primary" onClick={(e) => onHandleClick(e)}>작성하기</button>
                    </div>
                </div>
            </div>
        </main>
    </>
}
export { Board0001M1 };
