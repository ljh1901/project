import {useEffect} from 'react';
function popUpOpen(){
    window.open('http://localhost:8081/popup/notice','boardPopUp','width=600, height=500');
}
export {popUpOpen};