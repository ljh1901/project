import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { loadAppConfig } from './appConfig.js';
import { AppShell } from '../AppShell.jsx';
import '../styles.css';

const root = createRoot(document.getElementById('root'));
root.render(createElement('p', { className: 'loading', role: 'status' }, '모두의 추천을 준비하고 있습니다.'));
loadAppConfig()
  .then(() => root.render(createElement(AppShell)))
  .catch(error => root.render(
    createElement('main', { className: 'startup-error' },
    createElement('h1', null, '연결을 확인해 주세요'),
    createElement('p', { role: 'alert' }, error.message),
    createElement('button', { onClick: () => location.reload() }, '다시 시도'))
    )   
    );
