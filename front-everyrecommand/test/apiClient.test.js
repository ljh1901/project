import test from 'node:test';
import assert from 'node:assert/strict';
import { createApiClient, ApiError } from '../src/common/apiClient.js';

const response = (data, status = 200) => new Response(JSON.stringify({
  success: status < 400, message: status < 400 ? 'success' : '요청 실패', data,
}), { status, headers: { 'Content-Type': 'application/json' } });

test('로그인 후 CSRF 토큰을 새로 받아 로그아웃하고 쿠키를 전달한다', async () => {
  const calls = [];
  let count = 0;
  const api = createApiClient({ apiUrl: '/api', fetchImpl: async (url, options) => {
    calls.push({ url, options });
    return url.endsWith('/csrf') ? response({ headerName: 'X-CSRF-TOKEN', token: 'token-' + ++count }) : response({});
  } });
  await api.request('/auth/login', { method: 'POST', body: { loginId: 'user', password: 'test' } });
  await api.request('/auth/logout', { method: 'POST' });
  assert.equal(count, 2);
  assert.equal(calls[1].options.headers['X-CSRF-TOKEN'], 'token-1');
  assert.equal(calls[3].options.headers['X-CSRF-TOKEN'], 'token-2');
  assert.ok(calls.every(call => call.options.credentials === 'include'));
  assert.deepEqual(JSON.parse(calls[1].options.body), { loginId: 'user', password: 'test' });
});

test('401은 인증 만료 처리를 호출하고 초기 로그인 조회는 조용히 처리한다', async () => {
  let expired = 0;
  const api = createApiClient({ apiUrl: '/api', onUnauthorized: () => expired++, fetchImpl: async () => response({}, 401) });
  await assert.rejects(api.request('/auth/me'), error => error instanceof ApiError && error.status === 401);
  await assert.rejects(api.request('/auth/me', { silentUnauthorized: true }));
  assert.equal(expired, 1);
});

test('403 변경 요청은 자동 재실행하지 않고 다음 요청에서 토큰을 갱신한다', async () => {
  let tokens = 0;
  let writes = 0;
  const api = createApiClient({ apiUrl: '/api', fetchImpl: async url => {
    if (url.endsWith('/csrf')) return response({ headerName: 'X-CSRF-TOKEN', token: String(++tokens) });
    writes++;
    return response({}, 403);
  } });
  await assert.rejects(api.request('/items', { method: 'POST' }));
  assert.equal(writes, 1);
  await assert.rejects(api.request('/items', { method: 'POST' }));
  assert.equal(tokens, 2);
});

test('동시 변경 요청은 CSRF 조회를 공유한다', async () => {
  let tokens = 0;
  const api = createApiClient({ apiUrl: '/api', fetchImpl: async url => {
    if (url.endsWith('/csrf')) return response({ headerName: 'X-CSRF-TOKEN', token: String(++tokens) });
    return response({});
  } });
  await Promise.all([api.request('/one', { method: 'POST' }), api.request('/two', { method: 'POST' })]);
  assert.equal(tokens, 1);
});

test('JSON이 아닌 서버 응답과 네트워크 오류는 안전한 메시지로 처리한다', async () => {
  const invalid = createApiClient({ apiUrl: '/api', fetchImpl: async () => new Response('<html>proxy error</html>', { status: 502 }) });
  await assert.rejects(invalid.request('/auth/me'), error => error.status === 502 && !error.message.includes('<html>'));
  const offline = createApiClient({ apiUrl: '/api', fetchImpl: async () => { throw new Error('internal network details'); } });
  await assert.rejects(offline.request('/auth/me'), error => error.status === 0 && !error.message.includes('internal'));
});
