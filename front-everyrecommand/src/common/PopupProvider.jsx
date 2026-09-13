import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';

const PopupContext = createContext(null);
// 공통 팝업을 호출할 수 있는 함수를 가져옵니다.
export const usePopup = () => useContext(PopupContext);

// 알림·확인·입력 팝업을 요청 순서대로 표시합니다.
export function PopupProvider({ children }) {
  const [items, setItems] = useState([]);
  const pending = useRef(new Set());
  const dialog = useRef(null);
  const input = useRef(null);
  const active = items[0];
  const popup = useMemo(() => {
    // 팝업을 대기열에 추가하고 사용자의 응답을 기다립니다.
    const open = (type, message, defaultValue = '') => new Promise(resolve => {
      const item = { type, message, defaultValue, resolve };
      pending.current.add(item);
      setItems(current => [...current, item]);
    });
    return {
      alert: message => open('alert', message),
      error: message => open('error', message),
      confirm: message => open('confirm', message),
      prompt: (message, defaultValue) => open('prompt', message, defaultValue),
    };
  }, []);
  useEffect(() => {
    const requests = pending.current;
    return () => { requests.forEach(item => item.resolve(null)); requests.clear(); };
  }, []);
  useEffect(() => {
    if (active) {
      dialog.current.showModal();
      if (input.current) { input.current.value = active.defaultValue; input.current.focus(); }
    } else {
      dialog.current?.close();
    }
  }, [active]);
  // 현재 팝업의 응답을 전달하고 다음 팝업으로 넘어갑니다.
  function close(value) {
    pending.current.delete(active);
    active.resolve(value);
    setItems(current => current.slice(1));
  }
  return <PopupContext.Provider value={popup}>
    {children}
    <dialog ref={dialog} aria-labelledby="popup-title" aria-describedby="popup-message"
      onCancel={event => { event.preventDefault(); close(null); }}>
      {active && <form onSubmit={event => { event.preventDefault(); close(active.type === 'prompt' ? input.current.value : true); }}>
        <h2 id="popup-title">{active.type === 'error' ? '오류 안내' : '안내'}</h2>
        <p id="popup-message">{active.message}</p>
        {active.type === 'prompt' && <input ref={input} aria-label="입력값" />}
        <div className="dialog-actions">
          {['confirm', 'prompt'].includes(active.type) && <button type="button" className="secondary" onClick={() => close(null)}>취소</button>}
          <button type="submit" autoFocus={active.type !== 'prompt'}>확인</button>
        </div>
      </form>}
    </dialog>
  </PopupContext.Provider>;
}
