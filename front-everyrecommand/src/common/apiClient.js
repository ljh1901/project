export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function readJsonResponse(response) {
  let result;
  try {
    result = await response.json();
  } catch {
    throw new ApiError('서버 응답을 확인할 수 없습니다.', response.status);
  }
  if (!response.ok || result?.success !== true) {
    throw new ApiError(
      typeof result?.message === 'string' ? result.message : '요청을 처리하지 못했습니다.',
      response.status,
    );
  }
  return result.data;
}

export function createApiClient({ apiUrl, onUnauthorized = () => {}, fetchImpl = globalThis.fetch }) {
  const base = apiUrl.replace(/\/$/, '');
  let csrf = null;
  let csrfRequest = null;
  async function send(path, options = {}) {
    let response;
    try {
      response = await fetchImpl(base + path, { ...options, credentials: 'include', cache: 'no-store' });
    } catch {
      throw new ApiError('서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.');
    }
    if (response.status === 401 && !options.silentUnauthorized) onUnauthorized();
    return readJsonResponse(response);
  }
  async function getCsrf() {
    if (csrf) return csrf;
    if (!csrfRequest) {
      csrfRequest = send('/auth/csrf').then(value => { csrf = value; return value; })
        .finally(() => { csrfRequest = null; });
    }
    return csrfRequest;
  }
  return {
    async request(path, { method = 'GET', body, silentUnauthorized = false, signal } = {}) {
      if (!path.startsWith('/') || path.startsWith('//')) throw new Error('API 경로가 올바르지 않습니다.');
      method = method.toUpperCase();
      const headers = {};
      if (body !== undefined) headers['Content-Type'] = 'application/json';
      if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
        const token = await getCsrf();
        headers[token.headerName] = token.token;
      }
      try {
        return await send(path, { method, headers, body: body === undefined ? undefined : JSON.stringify(body),
          silentUnauthorized, signal });
      } catch (error) {
        if (error.status === 403) csrf = null;
        throw error;
      } finally {
        // 로그인·로그아웃 후 서버가 폐기한 토큰을 다음 요청에서 재사용하지 않습니다.
        if (path === '/auth/login' || path === '/auth/logout') csrf = null;
      }
    },
  };
}
