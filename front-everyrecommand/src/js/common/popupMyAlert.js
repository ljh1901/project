const queue = [];
const listeners = new Set();

function notify() {
  listeners.forEach(listener => listener());
}

function open(type, message, defaultValue = '') {
  return new Promise(resolve => {
    queue.push({ type, message: String(message ?? ''), defaultValue: String(defaultValue ?? ''), resolve });
    notify();
  });
}

function subscribePopup(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getActivePopup() {
  return queue[0] || null;
}

function closePopup(value) {
  const item = queue.shift();
  if (!item) return;
  item.resolve(value);
  notify();
}

const PopupMyAlert = {
  info: message => open('info', message),
  error: message => open('error', message),
  confirm: message => open('confirm', message),
  prompt: (message, defaultValue = '') => open('prompt', message, defaultValue),
};

window.PopupMyAlert = PopupMyAlert;

export { PopupMyAlert, subscribePopup, getActivePopup, closePopup };
