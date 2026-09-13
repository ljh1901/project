# 모두의 추천

React 웹 프론트엔드와 Spring Boot REST API를 분리한 아이디·비밀번호 로그인 기반 프로젝트입니다.
카카오·네이버 등 소셜 인증은 구현 범위에 포함하지 않았습니다.

## 프로젝트 구조

```text
C:\project
├─ front-everyrecommand/     React 웹 애플리케이션
│  ├─ AGENTS.md
│  ├─ README.md
│  ├─ src/
│  └─ package.json
└─ backend-everyrecommand/   Spring Boot REST API
   ├─ AGENTS.md
   ├─ README.md
   ├─ src/
   ├─ database/001-auth.sql
   └─ build.gradle
```

기존 `ocp`의 공통 계층, 프로필 확인, 파일 크기 제한, Gradle Wrapper와 Git 속성을 새 백엔드에 통합하고 `ocp` 폴더는 제거했습니다. 새 프로젝트에서는 PostgreSQL을 사용하며 기존 MySQL·Thymeleaf·Redis 의존성은 제외했습니다. 기존 WAR/ServletInitializer는 분리 배포에 맞춰 실행형 JAR로 전환했습니다. 잘못된 DB 설정과 평문 접속 값은 환경 변수 방식으로 대체했습니다.

## 사용 기술과 버전

| 구분 | 기술 | 버전 / 적용 |
|---|---|---|
| Frontend | React / React DOM | 19.3.0 |
| Frontend | Vite | 8.3.0 |
| Frontend | @vitejs/plugin-react | 6.1.1 |
| Frontend | JavaScript / CSS | ES modules, 반응형 CSS |
| Frontend | 라우팅 | `src/router.js`의 해시 라우팅 |
| Frontend | HTTP | 브라우저 Fetch 기반 공통 모듈 |
| 패키지 관리 | npm | 검증 환경 10.8.2, package-lock.json으로 고정 |
| 실행 환경 | Node.js | 검증 환경 20.19.0 |
| Backend | Java | OpenJDK 17 |
| Backend | Spring Boot | 4.1.1 |
| Backend | Spring Security | 7.1.1 (Boot BOM 관리) |
| Backend | MyBatis Spring Boot Starter | 4.0.0 |
| Backend | MyBatis / MyBatis Spring | 3.5.19 / 4.0.0 |
| Backend | Spring Framework | 7.0.9 (Boot BOM 관리) |
| Backend | PostgreSQL JDBC | 42.7.13 (Boot BOM 관리) |
| Backend | Gradle | 기존 Wrapper 9.7.1 재사용 |
| Backend | dependency-management plugin | 1.1.7 |
| Database | PostgreSQL | 실제 서버 미연결, 서버 버전 미확인 |
| 테스트 | Spring Boot Test / Spring Security Test | Spring Boot BOM 관리 |
| 테스트 | Node 내장 테스트 러너 | Node.js에 포함 |

React Native가 아닌 **React 웹** 프로젝트입니다. DTO·VO·Entity·JPA·Axios는 사용하지 않습니다.
관리형 의존성의 실제 해석 버전은 다음 명령으로 확인할 수 있습니다.

```powershell
cd C:\project\backend-everyrecommand
.\gradlew.bat dependencyInsight --dependency spring-security-core --configuration runtimeClasspath
.\gradlew.bat dependencyInsight --dependency postgresql --configuration runtimeClasspath
```

## 공통 기능

### Frontend

```text
Spring Environment → GET /api/config → appConfig.js
                                          ↓
                              app.js → AppContext 전역 등록
                                          ↓
                                      router.js
                                          ↓
                              Screen → 공통 API → Backend
```

- `src/appConfig.js`: 공개 설정을 서버에서 받아 보관합니다.
- `src/app.js`: 설정 로딩 후 애플리케이션을 시작합니다.
- `src/AppShell.jsx`: 전역 설정·공통 API·로그인 상태를 Context로 제공합니다.
- `src/common/apiClient.js`: JSON, 쿠키, CSRF, HTTP 오류, 인증 만료를 처리합니다.
- `src/common/PopupProvider.jsx`: ALERT·CONFIRM·ERROR·PROMPT를 공통 다이얼로그로 제공합니다.
- `src/router.js`: 로그인 상태에 따라 `#/login`, `#/` 화면을 연결합니다.
- 설정을 화면별로 만들거나 비밀번호·토큰을 localStorage에 저장하지 않습니다.

### Backend

```text
Controller → Service → ServiceImpl → Mapper XML → PostgreSQL
     ↓
ResponseEntity<Map<String, Object>>
```

- `common/ApiResult.java`: 기존 구현에 공통 응답이 없어서 추가한 응답 생성 도구입니다.
- `common/ApiExceptionHandler.java`: 입력 오류·인증 오류·서버 오류를 공통 처리합니다.
- `service/common/impl/CommonServiceImpl.java`: Spring Environment에서 공개 가능한 설정만 반환합니다.
- `security/SecurityConfig.java`: 세션 인증, BCrypt, CSRF, CORS, API 접근 제어를 담당합니다.
- `service/auth/impl/AuthServiceImpl.java`: MyBatis 조회 결과를 Spring Security 인증과 사용자 정보 응답에 사용합니다.

```json
{
  "success": true,
  "message": "success",
  "data": {}
}
```

## 인증 흐름

JWT의 기존 구현이 없으므로 Spring Security의 서버 세션을 사용합니다.

```text
[React]
   │ ① GET /api/auth/csrf
   ▼
[서버] ─── 세션 쿠키 + CSRF 토큰 ──→ [React 메모리]
   ▲                                      │
   │ ② POST /api/auth/login                │
   │    JSON: loginId, password            │
   │    쿠키 + X-CSRF-TOKEN 헤더            │
   └──────────────────────────────────────┘
   │
[AuthenticationManager]
   ↓
[AuthServiceImpl → AuthMapper → app_user]
   ↓ BCrypt 검증 / 활성 계정 확인
[세션 ID 변경 + CSRF 토큰 폐기 + 인증 상태 저장]
   ↓
[GET /api/auth/me → 로그인 사용자 정보]
   ↓
[POST /api/auth/logout → 세션 무효화]
```

로그인·로그아웃 후 다음 변경 요청에서 새 CSRF 토큰을 받습니다.
일반적인 인증 실패는 동일한 메시지로 응답하며 비밀번호 해시는 응답에 포함하지 않습니다.
비밀번호는 BCrypt 입력 제한에 맞춰 UTF-8 72바이트 이하인지 검사합니다.
계정 생성·회원가입·비밀번호 재설정·소셜 인증은 아직 구현하지 않았습니다.

| Method | API | 인증 | 설명 |
|---|---|---|---|
| GET | /api/config | 불필요 | 공개 앱 설정 |
| GET | /api/auth/csrf | 불필요 | CSRF 토큰 발급 |
| POST | /api/auth/login | 불필요, CSRF 필수 | 아이디·비밀번호 로그인 |
| GET | /api/auth/me | 필요 | 현재 사용자 조회 |
| POST | /api/auth/logout | CSRF 필수 | 세션 종료 |

`ROLE_USER`, `ROLE_ADMIN`을 인증 권한으로 로딩하고 메서드 권한 검사를 활성화했습니다.
관리자 업무 API는 아직 없으며, 추가할 때 `@PreAuthorize("hasRole('ADMIN')")` 등으로 제한합니다.

## 테이블 설계

로그인에 필요한 사용자 테이블 하나로 시작합니다.
추천·카테고리·댓글과 소셜 계정 테이블은 업무 요구사항이 정해지지 않아 생성하지 않았습니다.

```text
┌──────────────────────────────────────────────────────────┐
│ app_user : 아이디·비밀번호 로그인 계정                   │
├──────────────────┬────────────────────┬──────────────────┤
│ 컬럼             │ 자료형             │ 제약 / 용도      │
├──────────────────┼────────────────────┼──────────────────┤
│ user_id          │ BIGINT IDENTITY    │ PK, 자동 생성    │
│ login_id         │ VARCHAR(50)        │ UNIQUE, NOT NULL │
│ password_hash    │ VARCHAR(60)        │ BCrypt, NOT NULL │
│ display_name     │ VARCHAR(100)       │ 표시명, NOT NULL │
│ role             │ VARCHAR(20)        │ USER 또는 ADMIN  │
│ is_active        │ BOOLEAN            │ 기본 TRUE        │
│ created_at       │ TIMESTAMPTZ        │ 기본 현재 시각   │
└──────────────────┴────────────────────┴──────────────────┘
                │
                └─ login_id UNIQUE 인덱스로 단건 로그인 조회

현재 다른 업무 테이블과의 관계(FK)는 없습니다.
세션은 서버 메모리에서 관리하므로 세션 DB 테이블도 없습니다.
```

- `database/001-auth.sql`을 검토 후 대상 DB에 수동 적용합니다.
- `spring.sql.init.mode=never`로 자동 DDL 실행을 막았습니다.
- `login_id`는 대소문자를 구분합니다. 중복은 DB UNIQUE 제약으로 방지합니다.
- 비밀번호 해시 형식, 역할(`ROLE_USER` / `ROLE_ADMIN`), 빈 아이디·표시명을 DB에서도 검사합니다.
- 기본 계정·평문 비밀번호·실제 DB 접속 정보는 새 소스에 넣지 않았습니다.
- 현재 쓰기 업무가 없으므로 로그인 조회에 별도 트랜잭션을 적용하지 않았습니다.

### 최초 계정 준비

가입 API가 없으므로 관리자가 계정을 등록해야 합니다.
먼저 터미널에서 해시 도구를 준비하고 실행합니다.

```powershell
cd C:\project\backend-everyrecommand
.\gradlew.bat preparePasswordHash
java -cp "build/classes/java/main;build/password-hash-libs/*" com.ourcommunity.security.PasswordHashTool
```

비밀번호는 터미널의 숨김 입력으로 받습니다. 출력된 BCrypt 해시를 DB 관리 도구의 바인딩 값으로 사용합니다.

```sql
INSERT INTO app_user (login_id, password_hash, display_name)
VALUES (:loginId, :bcryptHash, :displayName);
```

위 SQL의 `:이름`은 DB 도구에서 바인딩할 값을 뜻합니다. 그대로 psql에서 실행하는 명령이 아닙니다.


## Spring Boot 실행 시 프론트 자동 실행

최초 1회 프론트 의존성을 준비합니다.

```powershell
cd C:\project\front-everyrecommand
npm ci
```

그다음 DB 환경 변수를 설정하고 백엔드만 실행합니다.

```powershell
cd C:\project\backend-everyrecommand
$env:SPRING_PROFILES_ACTIVE = "local"
.\gradlew.bat bootRun
```

- IDE에서 Spring Boot 메인 클래스를 실행해도 local 프로필이면 같은 방식으로 동작합니다.
- `config/FrontendDevServer.java`가 Spring Boot 준비 완료 후 Node로 Vite를 시작합니다.
- 실행 중인 백엔드 포트를 개발 프록시에 자동 전달합니다.
- 백엔드 종료 시 직접 시작한 프론트 프로세스만 종료합니다.
- 첫 실행 전에 `npm ci`가 필요합니다. 앱 실행 중 의존성을 자동 다운로드하지 않습니다.
- 프론트 포트가 사용 중이면 다른 포트로 몰래 바꾸지 않고 시작 오류를 알려줍니다.
- `dev/test/prod`에서는 개발 서버를 자동 시작하지 않습니다.
- IDE의 작업 폴더가 프로젝트 루트나 백엔드 폴더와 다르면 `FRONTEND_DIRECTORY`에 절대 경로를 지정합니다.

| 환경 변수 | 기본값 | 설명 |
|---|---|---|
| FRONTEND_AUTO_START | local에서 true | false이면 백엔드만 실행 |
| FRONTEND_DIRECTORY | front-everyrecommand | 프론트 폴더 이름 또는 절대 경로 |
| FRONTEND_NODE_EXECUTABLE | node | 필요하면 node.exe 절대 경로 |
| FRONTEND_DEV_HOST | 127.0.0.1 | 개발 서버 바인딩 주소 |
| FRONTEND_DEV_PORT | 5173 | 개발 서버 포트 |
| FRONTEND_BACKEND_HOST | 127.0.0.1 | 자동 프록시 대상 호스트 |
| FRONTEND_BACKEND_PROXY_TARGET | 빈 값 | 특수한 프록시 주소를 직접 지정할 때 사용 |

프론트를 별도로 실행하려면 백엔드의 `FRONTEND_AUTO_START=false`를 지정한 후
프론트에서 `npm run dev`를 실행합니다. 자동 실행과 수동 실행을 동시에 사용하지 않습니다.

## 환경 설정과 실행

### Backend

JDK 17을 설치하고 `JAVA_HOME`이 유효한 JDK를 가리키도록 설정합니다.

```powershell
cd C:\project\backend-everyrecommand
$env:SPRING_PROFILES_ACTIVE = "local"
$env:DB_URL = "jdbc:postgresql://<DB호스트>:5432/<DB이름>"
$env:DB_USERNAME = "<DB사용자>"
$env:DB_PASSWORD = "<DB비밀번호>"
.\gradlew.bat bootRun
```

| 환경 변수 | 기본값 | 설명 |
|---|---|---|
| SPRING_PROFILES_ACTIVE | local | local / dev / test / prod |
| DB_URL / DB_USERNAME / DB_PASSWORD | 없음, 필수 | 서버 전용 DB 설정 |
| SERVER_PORT | 8080 | 백엔드 포트 |
| DB_POOL_SIZE | 10 | DB 커넥션 풀 크기 |
| SESSION_TIMEOUT | 30m | 세션 만료 시간 |
| PUBLIC_API_URL | /api | 브라우저가 접근하는 API 주소 |
| PUBLIC_WEBSOCKET_URL | 빈 값 | 향후 WebSocket용 공개 설정, 기능 미구현 |
| FRONTEND_ORIGINS | 빈 값 | 직접 교차 출처 호출 시 허용할 정확한 Origin, 쉼표 구분 |

`src/main/resources/application.yml`에 공통 설정, `application-{profile}.yml`에 환경별 설정이 있습니다.
local에서만 HTTP 개발을 위해 Secure 쿠키를 해제합니다. dev/test/prod는 HTTPS를 사용합니다.
별도 출처로 직접 호출할 때는 `PUBLIC_API_URL`, `FRONTEND_ORIGINS`, `VITE_CONFIG_URL`을 함께 설정합니다.
기본 SameSite=Lax 쿠키는 서로 다른 사이트 간 배포를 지원하지 않습니다. 기본 배포는 동일 사이트의 `/api` 역방향 프록시 구성을 권장합니다.

### Frontend

```powershell
cd C:\project\front-everyrecommand
Copy-Item .env.example .env
npm ci
npm run dev
```

`.env`의 `BACKEND_PROXY_TARGET`을 실제 백엔드 주소로 설정합니다.
브라우저는 Vite가 출력하는 주소로 접속하며 `/api` 요청은 개발 프록시를 통해 백엔드로 전달됩니다.
`VITE_*` 값은 브라우저에 공개되므로 비밀 정보를 넣지 않습니다.

### 배포

```powershell
# Frontend: dist 생성
npm run build

# Backend: 실행 가능한 JAR 생성
.\gradlew.bat build
```

프론트의 `dist/`는 정적 웹 서버에 배포하고 `/api`는 Spring Boot로 프록시합니다.
`npm run preview`는 로컬 빌드 확인용입니다.
서버 세션은 단일 인스턴스 메모리에 저장됩니다. 서버 재시작 시 로그인이 해제됩니다.
다중 인스턴스로 확장할 때는 세션 공유 전략을 별도로 구성해야 합니다.

## 배치 설정은 어디에 사용했는가?

**새 백엔드에는 아직 Spring Batch를 적용하지 않았습니다.**

| 위치 | 현재 상태 |
|---|---|
| 통합 전 `ocp/build.gradle` | Batch 의존성만 있었으며 Job/Step 구현은 없었음. 해당 폴더는 통합 후 삭제 |
| `backend-everyrecommand/build.gradle` | 로그인에 불필요하므로 Batch 의존성 미추가 |
| 새 백엔드 Job / Step / Scheduler | 없음 |
| Batch 메타데이터 테이블 | 생성하지 않음 |

임시 파일 삭제·주기적인 파일 정리는 파일 업로드 기능이 추가될 때 배치 적용 대상으로 고려합니다.
그때 보관 기간, 저장 경로, 사용 중인 파일 제외 조건, 실행 주기, 중복 실행 방지를 정한 후
`batch/` 아래 Job/Step을 구현하고 환경별 설정 파일에 실행 설정을 둡니다.
이 경로는 **향후 설계 방향**이며 현재 파일이나 스케줄이 존재한다는 의미가 아닙니다.
파일 크기 제한(개별 20MB, 요청 2GB)만 공통 설정에 반영했으며 업로드 API는 아직 없습니다.

## 검증

```powershell
cd C:\project\front-everyrecommand
npm test
npm run build

cd C:\project\backend-everyrecommand
.\gradlew.bat test build
```

백엔드 통합 테스트는 실제 Security 필터·비밀번호 검증·세션·CSRF를 거치며 Mapper를 모킹합니다.
실제 PostgreSQL 연결 및 DDL 적용은 포함하지 않습니다.
프론트 테스트는 공통 Fetch의 CSRF 갱신·동시 요청·인증 만료·오류 처리를 검증합니다.
자동 실행 프로세스 테스트에는 Node.js도 필요합니다.


### 최종 검증 결과

| 검증 | 결과 |
|---|---|
| Frontend 공통 API 테스트 | 5개 통과 |
| Frontend 프로덕션 빌드 | 통과 |
| npm 의존성 감사 | 설치 시 알려진 취약점 0건 |
| Backend 인증·권한 통합 테스트 | 11개 통과 |
| 프론트 자동 실행 프로세스 테스트 | 2개 통과 |
| Backend JDK 17 컴파일·테스트·JAR 빌드 | 통과 |
| 실제 Spring Boot → Vite 자동 시작 | 확인 |
| Vite 프록시 → 설정·CSRF API | 200 응답 확인 |
| 미인증 사용자 조회 | 401 응답 확인 |
| Edge 브라우저 로그인 화면 | 실제 렌더링 확인 |
| 백엔드 종료 → 프론트 종료 | 확인 |
| 실제 PostgreSQL 로그인 / DDL 적용 | 미실행 |

검증에는 Temurin OpenJDK **17.0.20.1**을 임시 폴더에서 사용했습니다.
PC의 기본 Java 실행 경로가 손상되어 있었으며 시스템 `JAVA_HOME`은 변경하지 않았습니다.
직접 실행할 때 유효한 JDK 17 경로를 설정해야 합니다.
실제 DB 환경 변수·테이블·최초 계정을 준비한 뒤 DB 연동 로그인을 확인해 주세요.
검증용 서버는 종료했습니다.

## 참고한 공식 문서

- [Spring Security 세션 인증](https://docs.spring.io/spring-security/reference/servlet/authentication/session-management.html)
- [Spring Security CSRF](https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html)
- [MyBatis Spring Boot 4 호환성](https://mybatis.org/spring-boot-starter/mybatis-spring-boot-autoconfigure/)
- [Vite 실행 환경](https://vite.dev/guide/)
