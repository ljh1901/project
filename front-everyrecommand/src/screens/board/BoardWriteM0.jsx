export function BoardWirteM0(){
    const {params,
        list,

    } = loadData();
    
    
    
    return <div class="board__container">
        <div class="board__body">
            <div>
                <div name="boardContent" contentEditable="true">
                    <span style={{color:"gray"}}>내용을 입력해주세요!</span>
                </div>
            </div>
        </div>
        </div>;
}