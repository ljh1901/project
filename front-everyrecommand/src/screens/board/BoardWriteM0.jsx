export function BoardWirteM0(){
    const {
        params,
        list,
    } = loadData();
    
    
    
    return <>
    <div className="board__container">
        <div className="board__body">
            <div>
                <div name="boardContent" contentEditable="true">
                    <span style={{color:"gray"}}>내용을 입력해주세요!</span>
                </div>
            </div>
        </div>
        </div>
        </>
}