import { createContext, useContext } from 'react';

export const AppContext = createContext(null);
export function useApp() {
  const app = useContext(AppContext);
  if (!app) throw new Error('AppContext가 필요합니다.');
  return app;
}
