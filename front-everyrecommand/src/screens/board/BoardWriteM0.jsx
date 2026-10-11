import { boardWriteM0, onHandleClick, onHandleInput } from "../../js/boardWriteM0";
import { useState } from 'react';
// import {ag} from 'ag-grid'
function BoardWriteM0() {
    const [params, setParams] = useState({
        brdTitle: '',
        brdContent: '',
        brdCnt: '',
    });

    const fileBtn = (e) => {
        console.log(e.target)
        document.getElementById('file1').click();
    }


    return <>
        <div className="board__container">
            <p className="eyebrow">BoardWriteM0</p>
            <div className="board__body">
                <div>
                     <ul>
                        <li className="board-title-row">
                            제목: <input style={{width: "50rem", flex: "none"}} 
                                        type="text" 
                                        value={params.brdTitle} 
                                        onChange={(e) => {const brdTitle = e.target.value;
                                                          setParams((prev) => ({ ...prev, brdTitle }));
                                                         }}/>
                        </li>
                    </ul>
                    <div
                        className="board-content"
                        contentEditable
                        style={{width: '500px'}}
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
                    <div>
                        <button type="button" onClick={(e) => onHandleClick(e)}>작성하기</button>
                    </div>
                </div>
            </div>
        </div>
    </>
}
export { BoardWriteM0 };
