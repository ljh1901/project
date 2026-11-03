import { useRef, useState } from 'react';

// 커서를 입력창 맨 끝으로 이동 (브라우저 기본 Selection / Range API)
function moveCaretToEnd(el) {
    // 커서에 초점 주기
    el.focus();
    // 범위 생성
    const range = document.createRange();
    range.selectNodeContents(el);
    // 커서를 끝점으로 옮기기
    range.collapse(false);
    // 화면의 실제 커서 가져오기
    const sel = window.getSelection();
    // 기존 커서 지우기
    sel.removeAllRanges();
    // 만든 위치를 화면에 적용
    sel.addRange(range);
}

function User0002M0() {
    const [params, setParams] = useState({ textData: '' });
    const inputRef = useRef(null);

    function onHandleInput(e) {
        const el = e.currentTarget;
        const text = el.innerText;
        if (text === '' && el.innerHTML !== '') {
            el.textContent = '';
            moveCaretToEnd(el);
        }
        setParams({ textData: text });
    }

    function onHandleKey(e) {
        // 한글 조합 중 Enter는 무시 (안 하면 전송이 두 번 되거나 마지막 글자가 남음)
        if (e.nativeEvent.isComposing) return;
        // Enter = 전송, Shift+Enter = 브라우저 기본 줄바꿈
        if (e.key == 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onHandleSend();
        }
    }

    function onHandlePaste(e) {
        // 서식/HTML 없이 글자만 붙여넣기
        e.preventDefault();
        const el = e.currentTarget;
        const text = e.clipboardData.getData('text/plain');

        // 현재 커서(선택 영역) 자리에 글자 노드를 넣고, 커서를 그 뒤로 옮긴다
        const sel = window.getSelection();
        if (!sel.rangeCount) return;
        const range = sel.getRangeAt(0);
        range.deleteContents();
        const node = document.createTextNode(text);
        range.insertNode(node);
        range.setStartAfter(node);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);

        // 코드로 넣은 내용은 input 이벤트가 안 생기므로 state를 직접 갱신
        setParams({ textData: el.innerText });
    }

    function onHandleSend() {
        const text = params.textData.trim();
        if (!text) return;
        console.log(text); // TODO: 실제 전송 로직

        const el = inputRef.current;
        el.textContent = '';
        setParams({ textData: '' });
        moveCaretToEnd(el);
    }

    return (
        <div className='chat_container'>
            <div
                ref={inputRef}
                className='chatInput'
                contentEditable
                suppressContentEditableWarning
                data-placeholder='내용을 입력해주세요!'
                onInput={onHandleInput}
                onKeyDown={onHandleKey}
                onPaste={onHandlePaste}
            />
            <button type='button' className='handleSend' onClick={onHandleSend} disabled={!params.textData.trim()}>
                전송
            </button>
        </div>
    );
}
export { User0002M0 };
