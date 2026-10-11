import { useEffect, useState } from 'react';
import { fetchApi } from '../../js/common/api';
import { Link } from 'react-router-dom';
function BoardListM0() {
    return <>
        <div>
            <p className="eyebrow">BoardListM0</p>
            <colgroup>

            </colgroup>
            <Link to="/boards/new">게시글 작성하기</Link>
            <table>
                <caption>게시판 목록</caption>
                <thead>
                    <tr>
                        <th>순번</th>
                        <th>제목</th>
                        <th>작성자</th>
                        <th>수정일</th>
                        <th>조회 수</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </>
}
export { BoardListM0 };
