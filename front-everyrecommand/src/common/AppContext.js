import { createContext, useContext } from 'react';

export const AppContext = createContext(null);
// 공유된 앱 설정, API 클라이언트와 로그인 상태를 가져옵니다.
export function useApp() {
  const app = useContext(AppContext);
  if (!app) throw new Error('AppContext가 필요합니다.');
  return app;
}
