# 로컬 실행

JDK 17과 Node.js를 준비합니다. 처음 내려받았다면 루트에서 `npm run frontend:install`을 한 번 실행합니다.

## Spring Boot와 React 함께 실행

IDE에서 `EveryRecommandApplication`을 실행하거나 다음 명령을 사용합니다.

```powershell
cd C:\project\backend-everyrecommand
.\gradlew.bat bootRun
```

- 기본 프로필은 `local,postgres`입니다. IDE에서 프로필을 직접 지정한다면 두 프로필을 함께 지정합니다.
- 기본 화면: http://127.0.0.1:5446 (사용자 목록 화면)
- 로컬 백엔드: http://127.0.0.1:8081 (8080의 Oracle 리스너와 충돌 방지)
- Spring Boot가 준비되면 Node로 Vite를 시작하고 실제 백엔드 포트를 `/api` 프록시에 연결합니다.
- Spring Boot를 종료하면 함께 실행한 Vite도 종료합니다.
- 함께 실행하는 동안 `npm run dev`를 추가 실행하지 않습니다. 이미 같은 포트에 Vite가 실행 중입니다.
- 백엔드 포트는 `application.yml`의 `server.port` 한 곳에서 관리합니다. 기본값은 8081이며 `SERVER_PORT`로 변경할 수 있습니다.
- 포트를 바꾸려면 `SERVER_PORT`, `FRONTEND_DEV_PORT` 환경 변수를 사용합니다.
- 로그인 검사와 CSRF 검사를 해제한 개발 상태입니다. 사용자 목록은 PostgreSQL의 TB_EVRC_USERS를 조회하며 테이블·계정을 자동 생성하지 않습니다.

## 나중에 따로 실행

서버를 종료한 뒤 **`C:\project\package.json`만 삭제**하면 다음 Spring Boot 실행부터 백엔드만 시작합니다.
`front-everyrecommand/package.json`과 `package-lock.json`은 React 실행·설치에 필요하므로 유지합니다.
파일을 삭제하지 않고 `FRONTEND_AUTO_START=false`로 자동 실행을 끌 수도 있습니다.

백엔드는 위 명령으로 실행하고, 다른 PowerShell에서 프론트를 실행합니다.

```powershell
cd C:\project\front-everyrecommand
$env:BACKEND_PROXY_TARGET = 'http://127.0.0.1:8081'
npm run dev
```

`BACKEND_PROXY_TARGET`은 실제 백엔드 주소로 지정합니다. `.env.example`을 참고해 프론트 `.env`에 저장해도 됩니다.
`dev`, `test`, `prod` 프로필만 사용하는 환경에서는 개발 서버가 자동 실행되지 않습니다.

## 빌드

```powershell
cd C:\project\front-everyrecommand
npm run build
cd C:\project\backend-everyrecommand
.\gradlew.bat build
```

사용자 요청으로 테스트 소스 폴더와 테스트 전용 설정을 제거했습니다. 검증은 빌드와 실제 실행으로 수행합니다.

## userListM0 기본 화면 구성

`src/router.js` → `src/screens/UserListM0.jsx` → 공통 API의 `GET /api/admin/user/list` → `AdminController` → `AdminServiceImpl.userListM0()` → `AdminMapper.xml` 순서입니다.

화면 구성은 `UserListM0.jsx`의 표를 수정하고, 조회 컬럼은 `AdminMapper.xml`에서 지정합니다. JSON 키는 SQL 별칭과 화면의 `user.userId`, `user.name` 등을 맞춥니다. 비밀번호는 조회하지 않습니다. 기존 POST 경로도 유지하되 응답은 공통 `{ success, message, data }` 형식으로 통일했습니다.

로그인 화면 파일은 남아 있지만 현재 라우터에서 사용하지 않고 `/auth/me`도 호출하지 않습니다. 목록 읽기는 GET 요청이므로 CSRF 토큰 조회 없이 실행됩니다. 로그인 관련 서버 코드는 보존하고 SecurityFilterChain의 접근 제한·CSRF 검사를 해제했습니다.
