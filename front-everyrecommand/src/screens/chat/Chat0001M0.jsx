import { useEffect } from "react";
import 'ag-grid-react';
import { chat0001M0 } from "../../js/chat/chat0001M0";
function Chat0001M0 (){
    useEffect(() => {
        chat0001M0();
    },[])
    return (
        <div>
            <caption hidden>채팅 목록</caption>
            <table>
                <colgroup>
                
                </colgroup>
                <thead>
                    <th>아이디</th>
                    <th>이름</th>
                    <th>비고</th>
                </thead>
                <tbody>
                    <td></td>
                    <td></td>
                    <td>     
                        <button>연결</button>
                    </td>
                </tbody>
            </table>
        </div>
    );
}
export {Chat0001M0};