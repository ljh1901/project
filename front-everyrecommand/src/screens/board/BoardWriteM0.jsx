import { boardWriteM0, onHandleClick, onHandleInput } from "../../js/boardWriteM0";
import { useState } from 'react';
import { createChangeHandler } from '../../js/utils/formUtils.js';
// import {ag} from 'ag-grid'
function BoardWriteM0() {
    const [params, setParams] = useState({
        brdTitle: '',
        brdContent: '',
        brdCnt: '',
    });

    const handleChange = createChangeHandler(setParams);

    const fileBtn = (e) => {
        console.log(e.target)
        document.getElementById('file1').click();
    }


    return <>
        <main className="board__container">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">커뮤니티 / 게시판</p>
                    <h1>게시글 작성</h1>
                </div>
            </div>
            <div className="board__body panel">
                <div>
                     <div className="form-field">
                        <label htmlFor="board-title">제목</label>
                        <div className="board-title-row">
                            <input id="board-title"
                                        type="text" name="brdTitle"
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
                            onHandleInput();
                        }}
                    />
                    <div className="textCount">0/0</div>
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
export { BoardWriteM0 };
