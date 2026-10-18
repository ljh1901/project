import { fetchApi } from "../common/api";
import { useEffect, useState } from 'react';
import { PopupMyAlert } from "../common/popupMyAlert";
var count = 1;
function boardWriteM0() {
    if (document.querySelectorAll('.attachFiles').length <= 10) {
        const attachFile = document.createElement('input');
        attachFile.type = "file";
        attachFile.hidden = true;
        attachFile.id = "file" + count++;
        attachFile.className = "attachFiles";
        attachFile.onchange = boardWriteM0;
        document.querySelector('.attach-file-container').appendChild(attachFile);
    }
}
function onHandleInput(e){
    const editor = e.currentTarget;
    const textCount = document.querySelector('.textCount');
    const exceeded = editor.textContent.length > 1000;

    if (exceeded) {
        editor.textContent = editor.textContent.substring(0, 1000);
    }
    textCount.textContent = editor.textContent.length + '/1000';

    if (exceeded) {
        PopupMyAlert.error('게시글 내용은 최대 1000자까지 입력할 수 있습니다.');
    }
    
    
}
function onHandleClick(e){
    console.log(e.target);
}
export { boardWriteM0, onHandleClick, onHandleInput }