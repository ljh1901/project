import { ApiError} from './api.js';

export let appConfig = null;

// 백엔드에서 공개 환경 설정을 불러오고 API 주소를 확인합니다.
export async function loadAppConfig() {
  let response;
  try {
    response = await fetch(import.meta.env.VITE_CONFIG_URL || '/api/config', {
      credentials: 'include', cache: 'no-store',
    });
  } catch {
    throw new ApiError('설정을 불러오지 못했습니다. 백엔드 연결을 확인해 주세요.');
  }
  if (!response.ok) {
    throw new ApiError('설정을 불러오지 못했습니다.', response.status);
  }
  appConfig = await response.json();
  return appConfig;
}
