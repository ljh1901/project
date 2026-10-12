# Architecture & Configuration

## 기술 스택
- React Native + npm; 진입·전역 초기화 `app.js`, 라우팅 `router.js`, 공개 설정 `appConfig.js`.
- OpenJDK 17
- Spring Boot 4.1.1
- Spring Batch
- Spring WebSocket
- MyBatis
- PostgreSQL
- Gradle
- Apache POI, Excel.js, pdf.js, AG Grid는 기존 사용 방식에 맞춘다.
- JasperReports(pdf 보고서 생성)
## 요청 흐름
`Component / Screen → Common Fetch → REST Controller → Service → ServiceImpl → Mapper → PostgreSQL`

- Controller: 요청·기본 검증·HTTP 응답. 업무 로직 금지.
- Service: 인터페이스.
- ServiceImpl: 업무 규칙·트랜잭션·Mapper 조합.
- Mapper: SQL 및 DB 접근. 업무 로직 금지.

## 환경 분리
- 프로필: `local`, `dev`, `test`, `prod`.
- Spring `Environment` / 외부 설정으로 활성 프로필과 서버 설정을 관리한다.
- 프론트 설정은 실제 프로젝트의 `appConfig.js` 초기화 흐름을 우선한다. **Spring 프로필이 자동으로 React Native 설정에 전달되는 것은 아니다.** 별도 빌드 설정 또는 안전한 설정 제공 API가 필요하다.
- API URL, WebSocket URL, 파일 서버 URL 등 환경값을 소스에 하드코딩하지 않는다.
- 프론트 설정은 사용자에게 공개된다고 가정하며 DB 비밀번호·JWT Secret·Private Key·API Secret을 넣지 않는다.
- `app.js`, `router.js`, `appConfig.js`, Gradle 및 의존성은 요청 없이 수정하지 않는다.
