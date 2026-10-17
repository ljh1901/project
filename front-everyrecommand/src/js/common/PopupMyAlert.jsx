import { useLayoutEffect, useRef, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { subscribePopup, getActivePopup, closePopup } from './popupMyAlert.js';
import '../../css/popupMyAlert.css';

function PopupMyAlert() {
  const active = useSyncExternalStore(subscribePopup, getActivePopup);
  const overlayRef = useRef(null);
  const panelRef = useRef(null);
  const inputRef = useRef(null);
  const confirmRef = useRef(null);

  useLayoutEffect(() => {
    if (!active) return;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const backgrounds = [...document.body.children]
      .filter(element => element !== overlayRef.current)
      .map(element => ({ element, inert: element.inert }));
    backgrounds.forEach(({ element }) => { element.inert = true; });
    document.body.style.overflow = 'hidden';
    if (inputRef.current) {
      inputRef.current.value = active.defaultValue;
      inputRef.current.focus();
      inputRef.current.select();
    } else {
      confirmRef.current.focus();
    }
    return () => {
      backgrounds.forEach(({ element, inert }) => { element.inert = inert; });
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [active]);

  if (!active) return null;
  const cancelValue = active.type === 'confirm' ? false : active.type === 'prompt' ? null : undefined;
  const accept = () => closePopup(active.type === 'prompt'
    ? inputRef.current.value : active.type === 'confirm' ? true : undefined);

  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      closePopup(cancelValue);
    } else if (event.key === 'Enter' && event.target === inputRef.current && !event.nativeEvent.isComposing) {
      event.preventDefault();
      accept();
    } else if (event.key === 'Tab') {
      const controls = [...panelRef.current.querySelectorAll('input, button')];
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  return createPortal(
    <div className="popup-my-alert-overlay" ref={overlayRef} onKeyDown={handleKeyDown}>
      <div className="popup-my-alert-panel" ref={panelRef}
        role={active.type === 'error' ? 'alertdialog' : 'dialog'} aria-modal="true"
        aria-labelledby="popup-my-alert-title" aria-describedby="popup-my-alert-message">
        <h2 id="popup-my-alert-title">{active.type === 'error' ? '오류 안내' : '안내'}</h2>
        <p id="popup-my-alert-message">{active.message}</p>
        {active.type === 'prompt' && <input ref={inputRef} type="text"
          className="popup-my-alert-input" aria-labelledby="popup-my-alert-message" />}
        <div className="popup-my-alert-actions">
          {['confirm', 'prompt'].includes(active.type) &&
            <button type="button" onClick={() => closePopup(cancelValue)}>취소</button>}
          <button type="button" className="popup-my-alert-confirm" ref={confirmRef} onClick={accept}>확인</button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export { PopupMyAlert };
