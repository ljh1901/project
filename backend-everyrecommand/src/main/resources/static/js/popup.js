const popupChk = document.getElementById('popupChk');
const closePopup = document.getElementById('closePopup')
        console.log({
    url: location.href,
    origin: location.origin,
    cookie: document.cookie,
});
closePopup.addEventListener('click', () => {
    if(popupChk.checked){
        /**
            | Strict | 다른 사이트에서 넘어오는 요청에는 쿠키를 보내지 않음 |
            | Lax | 일반적으로 차단하되, 링크 클릭으로 이동하는 최상위 GET 요청 등에는 전송 |
         */
        document.cookie='closePopup=true; Max-Age=360000; Path=/; SameSite=Lax;'
    }
    window.close();
});
