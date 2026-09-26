import { createElement } from 'react';
import { Route, Routes } from 'react-router-dom';
import { UserListM0 } from './screens/user/UserListM0.jsx';
import { BoardListM0 } from './screens/board/BoardListM0.jsx';
// 기본 진입 화면은 사용자 목록입니다.
export function Router() {
  return createElement(Routes, null,
    createElement(Route, { path: '/', element: createElement(UserListM0) }),
    createElement(Route, { path: '/boards', element: createElement(BoardListM0) })
  );
}
