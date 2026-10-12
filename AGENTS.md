# AGENTS.md

> AI Coding Agent(Codex 등)와 개발자가 따라야 할 프로젝트 공통 규칙. 구현 전 관련 문서를 확인한다.

## 프로젝트 기본값
- Frontend: React Native, npm, 기존 `app.js` / `router.js` / `appConfig.js` 구조
- Backend: Java 17, Spring Boot 4.1.1, Spring Batch, Spring WebSocket, MyBatis, Gradle
- DB: PostgreSQL
- 라이브러리: Apache POI, Excel.js, pdf.js, AG Grid
- API: REST, `Map<String, Object>` 기반 요청/응답, `ResponseEntity` 사용
- 기본 계층: Controller → Service → ServiceImpl → Mapper → DB
- DTO / VO / Entity / JPA는 도입하지 않는다. 기존 구조가 다르면 기존 구조를 우선한다.

## 최우선 작업 규칙
1. **Existing First:** 관련 코드·공통 모듈·API·DB 스키마를 먼저 조사한다.
2. **Minimal Change:** 요청 기능과 직접 관련된 부분만 수정한다. 불필요한 리팩토링 금지.
3. **Reuse First:** Common Fetch, Popup, JWT, Mapper, 유틸리티를 우선 재사용한다.
4. **Security / Integrity:** 비밀정보 노출, SQL Injection, 인증·권한 누락, 데이터 무결성 훼손을 방지한다. 위험한 요청은 그대로 실행하지 않고 안전한 대안을 제시한다.
5. **Verify:** 가능한 범위에서 테스트·컴파일·빌드를 실행하고 실제 수행 결과만 보고한다.
6. **Explain Why:** 복잡한 규칙, 보안, 예외, 성능상 이유가 있을 때만 주석을 남긴다.

## 코드 규칙
- 클래스: `PascalCase`, 메서드·변수: `camelCase`, 상수: `UPPER_SNAKE_CASE`.
- Controller는 요청·검증·응답을 담당하고 비즈니스 로직은 ServiceImpl에 둔다.
- 요청/응답은 기존 공통 구조를 우선하고 신규 DTO/VO를 만들지 않는다.
- SQL은 MyBatis Mapper에 작성하고 `#{}` 바인딩을 기본으로 한다.
- 환경값은 프로필별 설정으로 관리하고, 비밀값을 프론트엔드에 전달하지 않는다.
- 외부 라이브러리 추가, DB 스키마 변경, 공통 인증·라우팅 변경은 사전 영향 검토가 필요하다.

## 작업별 참조 문서
| 작업 영역 | 필수 참조 |
|---|---|
| 프로젝트 수정 전 무조건 읽어야할 파일 | [docs/RULE.md](docs/RULE.md)|
| 구조·설정·프로필 | [docs/architecture.md](docs/architecture.md) |
| Controller·Service·API·MyBatis | [docs/backend.md](docs/backend.md) |
| React Native·라우팅·Common Fetch·UI | [docs/frontend.md](docs/frontend.md) |
| SQL·PostgreSQL·무결성·동시성 | [docs/database.md](docs/database.md) |
| 날짜·시간·시간대·포맷 | [docs/datetime.md](docs/datetime.md) |
| 이메일·Thymeleaf HTML 템플릿 | [docs/email.md](docs/email.md) |
| 파일·Excel/PDF·배치 | [docs/file-batch.md](docs/file-batch.md) |
| JWT·검증·예외·로그 | [docs/security.md](docs/security.md) |
| 변경 절차·테스트·보고 | [docs/workflow.md](docs/workflow.md) |

## 충돌 시 판단
명시적 사용자 요구 → 프로젝트 기존 계약·구조 → 관련 문서 순으로 검토하되, 보안·데이터 무결성·정상 동작을 해치는 구현은 수행하지 않고 이유를 설명한다.

## 완료 보고
`[변경 내용]` / `[변경 파일]` / `[주요 변경 사항]` / `[검증: 수행·미수행 구분]` / `[주의 사항]` 순으로 간결하게 보고한다.
