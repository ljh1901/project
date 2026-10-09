# React 개발에서 자주 쓰는 JavaScript와 브라우저 API

JavaScript 기본 함수와 브라우저의 `window`, `location` 등을 정리한 참고 문서입니다. 예제는 **웹 React** 기준입니다. React Native에는 브라우저의 `window.location`, DOM 등이 동일하게 제공되지 않습니다.

## 1. JavaScript 기본 기능과 브라우저 기능 구분

| 구분 | 예시 | 의미 |
|---|---|---|
| JavaScript 기본 기능 | `encodeURIComponent`, `JSON.parse`, 배열 `map` | React 없이도 사용하는 언어 기능 |
| 브라우저 API | `window`, `location`, `document`, `localStorage` | 브라우저가 제공하는 기능 |
| React 기능 | `useState`, `useEffect` | React에서 import해서 사용하는 기능 |
| React Router 기능 | `Link`, `useNavigate`, `useLocation` | 라우터에서 import해서 사용하는 기능 |

`window.location`과 브라우저 코드의 `location`은 같은 주소 객체를 가리킵니다. 아래에서는 출처를 명확히 하기 위해 `window.location`으로 표기합니다. 서버에서 실행되는 코드에는 `window`가 없으므로 SSR에서는 브라우저에서만 실행해야 합니다.

## 2. location: 현재 주소 읽기

다음 주소를 브라우저로 열었다고 가정합니다. 설명용 주소이며 실제 환경 설정값이 아닙니다.

```text
https://example.com:8443/board/list?page=2&keyword=react#comments
```

| 속성 | 위 주소에서의 값 | 용도 |
|---|---|---|
| `location.href` | 주소 전체 | 현재 전체 URL 조회 |
| `location.origin` | `https://example.com:8443` | 프로토콜 + 호스트 + 포트 |
| `location.protocol` | `https:` | 프로토콜, 콜론 포함 |
| `location.host` | `example.com:8443` | 호스트와 포트 |
| `location.hostname` | `example.com` | 호스트 이름 |
| `location.port` | `8443` | 명시된 포트. 기본 포트는 빈 문자열일 수 있음 |
| `location.pathname` | `/board/list` | 경로. 쿼리와 해시 제외 |
| `location.search` | `?page=2&keyword=react` | 쿼리 문자열, 물음표 포함 |
| `location.hash` | `#comments` | 해시, 샵 포함 |

```javascript
const currentPath = window.location.pathname;
const currentOrigin = window.location.origin;
```

**`location.uri`는 표준 속성이 아닙니다.** 전체 주소는 `href`로 읽습니다. `pathname`은 API 서버 주소가 아니라 현재 화면의 경로입니다. `origin`도 프론트가 열린 출처이므로 Backend 주소와 같다고 가정하면 안 됩니다.

## 3. location: 이동과 새로고침

| 사용법 | 동작 |
|---|---|
| `window.location.href = '/main'` | 해당 주소로 브라우저 이동 |
| `window.location.assign('/main')` | 이동하고 이전 페이지를 방문 기록에 남김 |
| `window.location.replace('/main')` | 현재 방문 기록을 대체하며 이동 |
| `window.location.reload()` | 현재 페이지 새로고침 |

브라우저 이동은 일반적으로 페이지를 다시 불러오므로 React의 메모리 상태가 초기화됩니다. 같은 문서의 해시만 변경하는 경우에는 전체 페이지를 다시 불러오지 않을 수 있습니다.

React 내부 화면 이동에는 기존 React Router를 사용합니다.

```jsx
import { Link, useNavigate } from 'react-router-dom';

function BoardButton() {
  const navigate = useNavigate();

  return (
    <>
      <Link to="/main/board">게시판</Link>
      <button onClick={() => navigate('/main/board')}>게시판 이동</button>
      <button onClick={() => navigate('/main/board', { replace: true })}>
        현재 방문 기록을 대체하며 이동
      </button>
    </>
  );
}
```

`Link`는 일반적인 내부 링크, `navigate()`는 저장 완료 후 이동처럼 코드에서 이동할 때 사용합니다. 외부 사이트 이동이나 서버 파일 다운로드에는 일반 `<a>`를 사용할 수 있습니다.

### React에서 주소 변경 감지

`window.location` 값을 읽는 것만으로 컴포넌트가 주소 변경을 구독하지는 않습니다. 라우터 안에서는 `useLocation()`을 사용합니다.

```jsx
import { useLocation } from 'react-router-dom';

function CurrentPath() {
  const location = useLocation();
  return <p>현재 경로: {location.pathname}</p>;
}
```

## 4. encodeURIComponent / decodeURIComponent

둘 다 JavaScript 기본 전역 함수이므로 설치나 import 없이 사용합니다.

`encodeURIComponent()`는 **URL에 넣을 개별 값**을 인코딩합니다. 공백, 한글, `&`, `#` 등이 URL 구조로 해석되지 않도록 합니다.

```javascript
const fileName = 'report & memo.pdf';
const encodedName = encodeURIComponent(fileName);
// 'report%20%26%20memo.pdf'

const query = `fileName=${encodedName}`;
// 'fileName=report%20%26%20memo.pdf'

decodeURIComponent(encodedName);
// 'report & memo.pdf'
```

`&`를 그대로 붙이면 다른 파라미터의 시작으로, `#`는 해시의 시작으로 해석될 수 있습니다. 다운로드 URL 전체를 `encodeURIComponent()`에 넣으면 `/`, `?`, `=`까지 인코딩되므로 **파일명 같은 값에만 적용**하세요.

`encodeURI()`는 URL 전체를 위한 함수이며 `&`, `#` 등 URL 구조 문자를 남깁니다. 파일명 파라미터 처리에는 `encodeURIComponent()`가 적합합니다.

Spring의 `@RequestParam`이나 `URLSearchParams.get()`은 이미 디코딩된 값을 제공합니다. 이 값을 다시 디코딩하지 마세요. `decodeURIComponent()`는 잘못된 인코딩 문자열에 `URIError`를 던질 수 있습니다. 인코딩은 암호화나 서버의 입력값 검증을 대신하지 않습니다.

## 5. URLSearchParams: 쿼리 조회와 생성

문자열을 직접 자르고 붙이는 대신 쿼리 전용 객체를 사용하면 편리합니다.

```javascript
const params = new URLSearchParams(window.location.search);

const keyword = params.get('keyword'); // 없으면 null
const page = params.get('page') ?? '1'; // 조회 결과는 문자열
const hasKeyword = params.has('keyword');
const tags = params.getAll('tag'); // 같은 이름으로 전달된 여러 값
```

```javascript
const params = new URLSearchParams();
params.set('fileName', 'report & memo.pdf');
params.set('page', '1');

params.toString();
// 'fileName=report+%26+memo.pdf&page=1'

params.delete('page');
```

`URLSearchParams`는 값을 자동 인코딩하므로 `encodeURIComponent()`를 먼저 적용하지 않습니다. 공백이 `+`로 표현되는 것도 정상입니다. `toString()`에는 앞의 `?`가 포함되지 않습니다.

## 6. URL: 주소를 객체로 다루기

```javascript
const url = new URL('/api/file/download', window.location.origin);
url.searchParams.set('fileName', '보고서.pdf');

const downloadUrl = url.href;
const path = url.pathname;
```

상대 주소로 `new URL()`을 만들 때는 기준 주소가 필요합니다. 또한 `/`로 시작하는 경로는 기준 주소의 기존 경로를 대체합니다.

```javascript
new URL('/file/download', 'https://example.com/api/').pathname;
// '/file/download' — '/api'는 유지되지 않음
```

## 7. 프로젝트 appConfig와 다운로드 링크

현재 프로젝트는 `src/js/common/appConfig.js`의 `loadAppConfig()`로 공개 설정을 조회하고, `src/js/common/app.js`에서 설정을 불러온 뒤 React를 렌더링합니다. 컴포넌트에서 별도 환경 설정 객체를 만들지 않습니다.

`appConfig.apiUrl`은 전체 주소일 수도 있고 `/api` 같은 상대 경로일 수도 있습니다. **현재 기본 설정처럼 `/api`를 포함하면 뒤에 `/api`를 또 붙이지 않습니다.**

```jsx
// src/screens/... 아래 컴포넌트 기준. 실제 위치에 따라 import 경로 조정
import { appConfig } from '../../js/common/appConfig.js';

function DownloadLink({ file }) {
  const apiBase = appConfig.apiUrl.replace(/\/+$/, '');
  const params = new URLSearchParams({ fileName: file.savedName });
  const downloadUrl = `${apiBase}/file/download?${params.toString()}`;

  return <a href={downloadUrl}>{file.originalName}</a>;
}
```

위 `/file/download`와 파일 객체의 필드는 설명용 예시이며 실제 API 계약에 맞춰야 합니다. `apiUrl`이 `/api`이면 결과는 `/api/file/download?...`입니다. 프록시를 쓰면 브라우저는 같은 출처로 요청하고 프록시가 Backend로 전달합니다.

```text
React 다운로드 링크 클릭
    → Backend 다운로드 API
    → 인증·권한·파일 경로 검증
    → 파일 내용과 Content-Disposition 헤더 반환
    → 브라우저 다운로드
```

`<a href>`는 임의의 `Authorization` 헤더를 넣을 수 없습니다. JWT 헤더가 필요한 다운로드는 기존 Common Fetch 구조에 맞춰 파일 응답을 처리해야 합니다. 쿠키 인증은 쿠키 정책이 허용하는 경우 브라우저가 쿠키를 보냅니다. 목록 조회 등 일반 API 호출도 기존 `src/js/common/api.js`를 우선 사용합니다.

환경 설정은 Spring의 활성 프로필과 공개 설정 API를 통해 전달합니다. React가 `application.yml`을 직접 읽거나, `location.pathname`에서 프로필을 알아내는 것은 아닙니다. 프론트 설정에는 비밀키나 DB 비밀번호를 포함하지 않습니다.

## 8. window.open: 새 탭 열기

```javascript
window.open('https://example.com/help', '_blank', 'noopener,noreferrer');
```

`_blank`는 새 탭 또는 창을 요청합니다. `noopener`는 열린 페이지가 원래 페이지의 `opener`에 접근하지 못하게 하고, `noreferrer`는 Referer 전달도 막습니다.

사용자의 클릭 핸들러 안에서 실행해야 팝업 차단 가능성을 줄일 수 있습니다. 새 탭/창 여부는 브라우저 설정에 따라 달라집니다. 일반 링크라면 다음 형태가 더 간단합니다.

```jsx
<a href="https://example.com/help" target="_blank" rel="noopener noreferrer">
  도움말
</a>
```

## 9. history: 방문 기록

| 메서드 | 동작 |
|---|---|
| `window.history.back()` | 이전 방문 기록으로 이동 |
| `window.history.forward()` | 다음 방문 기록으로 이동 |
| `window.history.go(-2)` | 두 기록 이전으로 이동 |
| `window.history.pushState(null, '', '/main')` | 페이지를 다시 읽지 않고 URL과 방문 기록 추가 |
| `window.history.replaceState(null, '', '/main')` | 페이지를 다시 읽지 않고 현재 URL과 기록 대체 |

**`pushState()`는 새로고침을 하지 않습니다.** 두 State 메서드는 같은 출처의 URL로만 변경할 수 있고, 호출 자체로 `popstate` 이벤트를 발생시키지 않습니다. React Router 화면 이동은 `navigate()`로 처리하세요. 주소만 직접 변경하면 라우터의 화면과 주소가 어긋날 수 있습니다.

뒤로 가기는 외부 사이트로 이동할 수도 있습니다. 반드시 특정 화면으로 돌아가야 하는 버튼은 명시적인 라우트로 이동시키세요.

## 10. localStorage / sessionStorage

| 기능 | localStorage | sessionStorage |
|---|---|---|
| 저장 범위 | 같은 출처에서 공유 | 같은 출처 + 탭별 세션 |
| 일반적인 유지 기간 | 브라우저를 닫아도 유지 | 탭 세션 종료 시 제거 |
| 저장 가능한 값 | 문자열 | 문자열 |

브라우저 정책이나 사용자 설정에 따라 사용이 제한될 수 있습니다. 저장 용량도 무제한이 아닙니다.

```javascript
localStorage.setItem('preferredTheme', 'dark');
const theme = localStorage.getItem('preferredTheme'); // 없으면 null
localStorage.removeItem('preferredTheme');

sessionStorage.setItem('boardFilter', JSON.stringify({ keyword: 'react' }));
const savedFilter = sessionStorage.getItem('boardFilter');
```

전체 저장소를 지우는 `clear()`는 다른 기능의 데이터도 삭제하므로 필요한 키만 `removeItem()`으로 지우는 편이 안전합니다. 저장소를 변경해도 React가 자동으로 다시 렌더링하지 않습니다. 화면 상태는 `useState` 등으로 관리하세요.

비밀번호·서버 비밀키를 저장하지 않으며, 기존 프로젝트의 인증 토큰 저장 위치도 임의로 변경하지 않습니다.

## 11. JSON.stringify / JSON.parse

```javascript
const filter = { keyword: 'react', page: 1 };
const text = JSON.stringify(filter); // 객체 → JSON 문자열
const restored = JSON.parse(text);  // JSON 문자열 → JavaScript 값
```

JSON은 함수 등을 보존하지 않으며, 순환 참조가 있으면 `stringify()`가 실패합니다. `parse()`는 잘못된 JSON에 예외를 던집니다. 저장소 값도 사용자가 변경할 수 있으므로 형식과 내용을 확인해야 합니다.

```javascript
function readBoardFilter() {
  try {
    const saved = sessionStorage.getItem('boardFilter');
    if (saved === null) return { keyword: '' };

    const value = JSON.parse(saved);
    if (value && typeof value.keyword === 'string') {
      return { keyword: value.keyword };
    }
    return { keyword: '' };
  } catch {
    // 선택적인 화면 설정은 읽기 실패 시 기본값으로 복구
    return { keyword: '' };
  }
}
```

## 12. setTimeout / setInterval과 React 정리

| 메서드 | 용도 | 해제 |
|---|---|---|
| `setTimeout(callback, 1000)` | 지정 시간 후 한 번 실행 | `clearTimeout(id)` |
| `setInterval(callback, 1000)` | 지정 간격으로 반복 실행 | `clearInterval(id)` |

시간 단위는 밀리초이며 `1000ms = 1초`입니다. 지정 시간은 정확한 실행 시각을 보장하지 않습니다. 비활성 탭에서는 실행이 지연될 수 있습니다.

```jsx
import { useEffect, useState } from 'react';

function ElapsedSeconds() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setSeconds(previous => previous + 1);
    }, 1000);

    return () => window.clearInterval(timerId);
  }, []);

  return <p>{seconds}초</p>;
}
```

정리 함수는 컴포넌트가 사라지거나 Effect가 다시 설정될 때 이전 타이머를 해제합니다. 렌더링 본문에서 타이머를 만들면 렌더링마다 중복 등록될 수 있습니다. 위 예시는 카운터이며 정확한 시간 측정이 필요하면 실제 경과 시간을 기준으로 계산하세요.

## 13. addEventListener / removeEventListener

React 요소의 클릭에는 `onClick`을 사용하고, 브라우저 전체의 이벤트는 필요할 때 구독합니다.

```jsx
import { useEffect, useState } from 'react';

function WindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <p>뷰포트 너비: {width}px</p>;
}
```

해제할 때 등록했던 **동일한 함수**를 전달해야 합니다. `innerWidth`, `innerHeight`는 브라우저 뷰포트 크기이며 모니터 해상도와 다릅니다. 단순 반응형 디자인은 JavaScript보다 기존 CSS 미디어 쿼리를 우선 사용합니다.

## 14. scrollTo / scrollIntoView

```javascript
window.scrollTo({ top: 0, behavior: 'smooth' });
```

특정 React 요소로 이동하려면 `useRef`를 사용합니다.

```jsx
import { useRef } from 'react';

function Comments() {
  const commentsRef = useRef(null);

  return (
    <>
      <button onClick={() => commentsRef.current?.scrollIntoView({
        behavior: 'smooth', block: 'start',
      })}>
        댓글로 이동
      </button>
      <section ref={commentsRef}>댓글 목록</section>
    </>
  );
}
```

`window.scrollTo()`는 문서 스크롤을 움직입니다. 별도 스크롤 컨테이너가 있으면 해당 요소의 `scrollTo()`가 필요합니다. React가 관리하는 요소를 직접 찾아 내용을 변경하기보다 state와 ref를 사용하세요.

## 15. 배열과 문자열에서 자주 쓰는 메서드

| 메서드 | 용도 | 예시 |
|---|---|---|
| `map()` | 각 항목을 새로운 값으로 변환 | `files.map(file => file.fileName)` |
| `filter()` | 조건을 만족하는 항목만 선택 | `files.filter(file => file.size > 0)` |
| `find()` | 첫 번째 일치 항목. 없으면 undefined | `files.find(file => file.id === id)` |
| `some()` | 하나라도 조건을 만족하면 true | `files.some(file => file.size > limit)` |
| `every()` | 모두 조건을 만족하면 true | `files.every(file => file.size <= limit)` |
| `includes()` | 배열에 값이 있는지 확인 | `['pdf', 'txt'].includes(extension)` |
| `trim()` | 문자열 양 끝 공백 제거 | `' hello '.trim()` |
| `toLowerCase()` | 소문자로 변환 | `'PDF'.toLowerCase()` |
| `lastIndexOf()` | 마지막 위치 조회. 없으면 -1 | `'report.final.pdf'.lastIndexOf('.')` |
| `slice()` | 문자열 또는 배열 일부 추출 | `'report.pdf'.slice(-3)` |

React 목록에는 안정적인 고유 `key`를 지정합니다. `map()`은 원본 배열을 변경하지 않고 새 배열을 반환합니다.

```jsx
<ul>
  {files.map(file => (
    <li key={file.id}>{file.originalName}</li>
  ))}
</ul>
```

`sort()`는 원본 배열을 변경하므로 React state 배열에 직접 사용하지 마세요.

```javascript
const sortedFiles = [...files].sort((a, b) =>
  a.originalName.localeCompare(b.originalName)
);
```

## 16. 자주 쓰는 문법: ?. / ?? / 구조 분해

```javascript
const name = file?.originalName; // file이 null/undefined이면 undefined
const page = searchParams.get('page') ?? '1'; // null/undefined일 때만 기본값
const { originalName, savedName } = file; // 객체의 속성을 변수로 꺼내기
```

`||`는 `0`, `false`, 빈 문자열도 기본값으로 바꿉니다. 이런 값을 유지하려면 `??`가 적합합니다. 구조 분해 대상이 null/undefined이면 예외가 나므로 먼저 확인해야 합니다.

## 17. 숫자 변환과 확인

```javascript
const params = new URLSearchParams(window.location.search);
const pageText = params.get('page') ?? '1';
const page = Number(pageText);
const isValidPage = pageText.trim() !== ''
  && Number.isInteger(page)
  && page >= 1;
```

`Number()`는 문자열을 숫자로 변환하며 변환 실패 시 `NaN`이 됩니다. 빈 문자열은 `0`으로 변환되므로 별도 확인이 필요합니다. `parseInt('12abc', 10)`은 `12`가 되므로 엄격한 입력 검증에는 주의하세요. 프론트 검증과 별개로 Backend에서도 값을 검증합니다.

## 18. 빠르게 고르는 기준

| 하고 싶은 일 | 먼저 사용할 기능 |
|---|---|
| 현재 화면 경로 읽기 | React Router `useLocation()` |
| 브라우저 전체 주소 읽기 | `window.location.href` |
| 쿼리 값 조회·생성 | `URLSearchParams` |
| 직접 붙일 파라미터 값 인코딩 | `encodeURIComponent()` |
| React 내부 화면 이동 | `Link`, `useNavigate()` |
| 브라우저 새로고침 | `window.location.reload()` |
| 파일 목록 출력 | 배열 `map()` |
| Backend API 호출 | 기존 Common Fetch |
| 안내·확인·오류·입력 팝업 | 기존 Custom Popup |
| 타이머·전역 이벤트 등록 | `useEffect()`와 정리 함수 |

브라우저의 `alert()`, `confirm()`, `prompt()` 대신 프로젝트의 기존 Custom Popup을 재사용합니다. 예제 때문에 환경 설정, 인증 방식, 라우터 구조를 별도로 변경하지 않습니다.
