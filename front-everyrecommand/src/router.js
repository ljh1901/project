import { createElement } from 'react';
import { UserListM0 } from './screens/UserListM0.jsx';

// 기본 진입 화면은 사용자 목록입니다.
export function Router() {
  return createElement(UserListM0);
}
