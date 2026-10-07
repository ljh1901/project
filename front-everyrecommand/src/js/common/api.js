export class ApiError extends Error {
  constructor(message, status = 0, body = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

async function request(url, options) {
  const response = await fetch(url, options);
  const text = await response.text();
  let body = text;
  if (text && response.headers.get('content-type')?.includes('json')) {
    body = JSON.parse(text);
  }
  if (!response.ok) {
    throw new ApiError(body?.message || body?.error || `HTTP ${response.status}: ${url}`, response.status, body);
  }
  return body || null;
}

export const fetchApi = {
  get(url) {
    return request(url, { method: 'GET' });
  },
  post(url, params) {
    return request(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
  },
  put(url, params) {
    return request(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
  },
  delete(url, param) {
    return request(`${url}/${encodeURIComponent(param)}`, { method: 'DELETE' });
  },
};
