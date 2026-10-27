/**
 * 1. Error 공통 처리
 * 2. fetch API 방식
 * 3. XHR API 방식
 * 
 * 
 */

export class ApiError extends Error {
  constructor(message, status = 0, body = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}
/**
 * ===========================================================
 * 2. fetch API 공통
 * ===========================================================
 * @param url 
 * @param options
 *  
 * headers : 
 * {
 *    'Content-Type' : options.contentType = 
 *                     application/x-www-urlencoded => 전통적 방식(FormData()로 보낼 경우 사용)
 *                     application/json => 일반 JSON Data 
 *                     application/pdf => PDF 미리보기
 *                     application/octet-stream => 파일 다운로드
 *                     multipart/form-data => 파일 업로드
 * }
 * options = {
 *  contentType: '',
 * } 
 * method :{GET, POST, PUT, DELETE}
 * body 파일 처리 필요
 * 
 */
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

const fetchApi = {
  get(url) {
    return request(url, { method: 'GET' });
  },
  post(url, params, options = {}) {
    if(options?.contentType == null){
      return request(url, {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify(params),
      });
    }else{
      // formData 방식일때 생각
      let formData = new FormData();
      return request(url, {method: 'POST',
                           headers: {
                            'Content-Type': 'multipart/form-data'
                           },
                           body: formData,
                          })
    }
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
/**
 * ==============================================
 * 3. XmlHttpRequest API 사용
 * ==============================================
 */
const xhrApi = (url, params, options = {}) => {
  const xhr = new XMLHttpRequest();

  return new Promise((resolve, reject) => {
    const method = (options.method ?? 'GET').toUpperCase();

    xhr.open(method, url, true);
    xhr.onreadystatechange = () => xhrResponse(xhr, resolve, reject);
    xhr.onerror = () => {
      reject(new ApiError('네트워크 오류가 발생했습니다.'));
    };
    xhr.setRequestHeader('Content-Type', options.contentType ?? 'application/json');
    method !== 'GET'?xhr.send(JSON.stringify(params)):xhr.send(null);
  
  });
};

function xhrResponse(xhr, resolve, reject) {
  if (xhr.readyState !== 4) return;

  if (xhr.status >= 200 && xhr.status < 300) {
    try {
      const data = xhr.responseText;
      resolve(data ? JSON.parse(data) : null);
    } catch {
      reject(new ApiError('응답 JSON 형식이 올바르지 않습니다.', xhr.status));
    }
  } else {
    reject(new ApiError('요청에 실패했습니다.', xhr.status));
  }
}

export {fetchApi, xhrApi};
