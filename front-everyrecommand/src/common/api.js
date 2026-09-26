import { appConfig } from './appConfig.js';

export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// 공통 JSON 응답을 검사해 데이터를 반환하거나 API 오류를 발생시킵니다.
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

// 앱 설정을 불러온 뒤 화면에서 직접 호출합니다.
export const fetchApi = {  
  // GetMapping
  get(url) {
    return fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then(res => {
      if(res.ok){
        return res;
      }
    })
    .then(res => res.json())
    .catch(error => {
      throw new ApiError('서버 응답을 확인할 수 없습니다.', error.status);
    })
  },
  //PostMapping
  post(url, params){
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify(params) 
    })
    .then(res => {
      if(res.ok){
        return res;
      }
    })
    .then(res => res.json())
    .catch(e => {
      console.error(e);
    })
    },
  //PutMapping
  put(url, params){
    return fetch(url,{method:"PUT",
                  headers:{
                    "Content-Type":"application/json"
                  },
                  body: JSON.stringify(params),
  })    .then(res => {
      if(res.ok){
        return res;
      }
    })
    .then(res => res.json())
    .catch(e => {
      console.error(e);
    })
  },
  //DeleteMapping
  delete(url, param){
    // "${encodeURIComponent(id)} = url/${param}으로 인식될 수 있도록 사용"
    return fetch(`${url}/${encodeURIComponent(param)}`,{
      method : "DELETE",
      headers:{
        "Content-Type":"application/json"
      }
    })
    .then(res => {
      if(res.ok){
        return res;
      }
    })
    .then(res => res.json())
    .catch(e => {
      console.error(e)
      alert('삭제 중 오류가 발생했습니다.');
    })
  }
};
