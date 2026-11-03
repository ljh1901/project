function chat0001M0(data){
    let ws = new WebSocket("ws://localhost:8081/ws/chat0001");
    // 웹 소켓 시작
    ws.onopen = () => {
        console.log(data);
        ws.send("웹 소켓 시작");
    }
    // 웹소켓으로 부터 온 메세지 받기
    ws.onmessage = (event) => {
        console.log(event.data);
    }
    // // 웹 소켓 종료
    // ws.onclose = () => {
    //     console.log("채팅 종료");
    // }
    return ws;
}
export {chat0001M0};