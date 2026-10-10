import {useEffect, useState} from 'react';
import { fetchApi } from '../../js/common/api';

function BoardListM0(){
    return <>
    <div>
        <colgroup>
        
        </colgroup>
        <Link to="BoardWriteM0">게시글 작성</Link>
        <table>
            <caption>게시판 목록</caption>
            <thead>
                <th>순번</th>
                <th>제목</th>
                <th>작성자</th>
                <th>수정일</th>
                <th>조회 수</th>
            </thead>
            <tbody>

            </tbody>
        </table>
    </div>
    </>
}
export {BoardListM0};