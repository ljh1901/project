import { ApiError, readJsonResponse } from './common/apiClient.js';

export async function loadAppConfig() {
  let response;
  try {
    response = await fetch(import.meta.env.VITE_CONFIG_URL || '/api/config', {
      credentials: 'include', cache: 'no-store',
    });
  } catch {
    throw new ApiError('설정을 불러오지 못했습니다. 백엔드 연결을 확인해 주세요.');
  }
  const config = await readJsonResponse(response);
  if (!config || typeof config.apiUrl !== 'string' || !config.apiUrl) {
    throw new ApiError('서버의 API 설정을 확인해 주세요.');
  }
  return Object.freeze(config);
}
