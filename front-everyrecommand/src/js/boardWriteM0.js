import { fetchApi } from "./common/api";
import { useEffect, useState } from 'react';
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
function onHandleInput(){
    document.querySelector('.textCount').innerHTML = document.querySelector('.board-content').textContent.length+'/3000';
}
function onHandleClick(e){
    console.log(e.target);
}
export { boardWriteM0, onHandleClick, onHandleInput }