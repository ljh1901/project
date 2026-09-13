# AGENTS.md
* 나는 시니어 개발자 입니다.
* 초보자도 쉽게 이해할 수 있도록 합니다.
> 프로젝트 개발 및 코드 수정 시 적용되는 공통 개발 규칙입니다.
>
> AI Coding Agent(Codex 등)가 프로젝트를 분석하거나 코드를 수정할 때도 본 문서를 우선적으로 준수합니다
---

# 1. Project Overview

## Tech Stack

### Frontend

* React Native
* npm 기반 패키지 관리
* router.js
* app.js (앱 전역)
* appConfig.js(앱 설정)
### Backend

* OpenJDK 17
* Spring Boot 4.1.1
* Spring Batch

  * 임시 파일 삭제
  * 주기적인 파일 정리
* Spring WebSocket

  * 웹 채팅
  * 실시간 통신
* MyBatis

  * SQL Mapper 기반 데이터 접근

### Database

* PostgreSQL

### Library

* Apache POI

  * Excel 문서 처리
* pdf.js

  * PDF 조회 및 렌더링
* AG Grid

  * 데이터 그리드
* Excel.js

  * Excel 생성 및 처리

### Build

* Gradle

### AI Coding Tool

* Codex AI

---

# 2. Architecture

## Backend

기본 Backend 구조는 다음 계층 구조를 사용합니다.

```text
Controller
    ↓
Service
    ↓
ServiceImpl
    ↓
Mapper
    ↓
Database
```

### Controller

Controller는 HTTP 요청과 응답을 담당합니다.

담당:

* HTTP 요청 수신
* Request Parameter / Request Body 처리
* 기본 입력값 검증
* 인증 / 권한 확인
* Service 호출
* HTTP Status 및 ResponseEntity 반환

Controller에는 비즈니스 로직을 작성하지 않습니다.

---

### Service

Service는 비즈니스 로직의 인터페이스를 정의합니다.

담당:

* Service 메서드 정의
* Controller와 ServiceImpl 간 결합도 감소

---

### ServiceImpl

ServiceImpl은 실제 비즈니스 로직을 구현합니다.

담당:

* 비즈니스 로직 처리
* 여러 Mapper 호출 및 결과 조합
* Transaction 처리
* 데이터 검증 및 업무 규칙 처리

---

### Mapper

Mapper는 MyBatis를 이용한 Database 접근을 담당합니다.

담당:

* SELECT
* INSERT
* UPDATE
* DELETE
* SQL 작성
* Database 결과 조회

Mapper에 비즈니스 로직을 작성하지 않습니다.

---

# 3. Frontend Architecture

Frontend는 다음 구조를 기본으로 사용합니다.

```text
appConfig.js
      ↓
app.js
      ↓
router.js
      ↓
Component / Screen
      ↓
Common Fetch
      ↓
Backend REST API
```

### appConfig.js

Application에서 사용하는 공통 환경 및 설정 정보를 관리합니다.

예:

```text
API URL
WebSocket URL
Profile
Environment
Application Configuration
```

---

### app.js

Application Entry Point 역할을 담당합니다.

담당:

* Application 초기화
* `appConfig.js` 등록
* 전역 설정 등록
* 공통 기능 초기화

---

### router.js

Frontend Route를 관리합니다.

담당:

* Route 등록
* Route Path 관리
* Component 연결
* Navigation 설정

Route와 관계없는 전역 설정은 `router.js`에 작성하지 않습니다.

---

# 4. Environment Configuration

환경에 따라 Application 설정을 분리합니다.

기본 Profile:

```text
local
dev
test
prod
```

Spring Boot의 `Environment`를 이용하여 현재 Active Profile을 확인합니다.

```text
Spring Boot
    ↓
Environment
    ↓
Active Profile
    ↓
Application Configuration
    ↓
appConfig.js
    ↓
app.js Global Registration
```

## 원칙

환경별 값을 소스 코드에 직접 하드코딩하지 않습니다.

### 금지

```javascript
const profile = "prod";
```

```javascript
const apiUrl = "http://localhost:8080";
```

### 권장

```text
Spring Environment
        ↓
Profile / Configuration
        ↓
appConfig.js
        ↓
app.js
```

환경에 따라 변경되는 값은 Configuration을 통해 관리합니다.

예:

```text
API URL
WebSocket URL
File Server URL
Profile
External API URL
Application Configuration
```

---

# 5. appConfig.js / app.js Global Configuration

`appConfig.js`는 Frontend에서 사용하는 공통 Configuration을 관리합니다.

예:

```javascript
const appConfig = {
    profile: "...",
    apiUrl: "...",
    websocketUrl: "..."
};
```

실제 구현은 프로젝트의 기존 `appConfig.js` 구조를 우선합니다.

`appConfig.js`의 설정값은 `app.js`에서 Application 전역으로 등록하여 Component / Screen에서 사용할 수 있도록 합니다.

```text
appConfig.js
      ↓
app.js
      ↓
Global Configuration
      ↓
Component / Screen
```

각 Component에서 환경 설정 객체를 별도로 생성하지 않습니다.

---

# 6. Configuration Security

Frontend에서 사용하는 Configuration은 **공개되어도 문제가 없는 값만** 포함합니다.

Frontend에 전달된 값은 사용자가 확인할 수 있다고 가정합니다.

따라서 다음 정보를 `appConfig.js`에 등록하지 않습니다.

```text
DB Password
JWT Secret
Private Key
Encryption Key
Server Secret
API Secret
Cloud Credential
```

다음과 같은 정보는 Server Side에서 관리합니다.

```text
API Secret
JWT Secret
DB Credential
Encryption Key
Private Key
```

---

# 7. Code Modification Scope

## 가장 중요한 규칙

> **요청받은 기능과 직접적으로 관련된 코드만 수정합니다.**

AI Agent는 작업 전에 현재 프로젝트 구조와 관련 코드를 확인해야 합니다.

### 명시적인 요청이 없는 경우 수정하지 않는 항목

```text
기존 정상 기능
관련 없는 Controller
관련 없는 Service
관련 없는 ServiceImpl
관련 없는 Mapper
공통 모듈
공통 Utility
공통 Component
설정 파일
Dependency
Build 설정
기존 API
기존 Database 구조
JWT 구조
Common Fetch
app.js
appConfig.js
router.js
```

단, 요청한 기능 구현을 위해 반드시 변경해야 하는 경우에는 변경 이유와 영향 범위를 확인합니다.

---

# 8. Existing Code First

새로운 코드를 작성하기 전에 기존 프로젝트를 먼저 확인합니다.

최소한 다음 항목을 확인합니다.

```text
1. 기존 Controller 구조
2. 기존 Service 구조
3. 기존 ServiceImpl 구조
4. 기존 Mapper 구조
5. 기존 API 구조
6. 기존 Response 구조
7. 기존 Exception 처리
8. 기존 공통 Utility
9. 기존 JWT 처리
10. 기존 Common Fetch
11. 기존 Popup
12. 기존 app.js
13. 기존 appConfig.js
14. 기존 router.js
15. 기존 Database 구조
```

이미 존재하는 기능은 새로 만들지 않고 기존 기능을 재사용합니다.

---

# 9. Naming Convention

## Class

`PascalCase`

```text
UserController
UserService
UserServiceImpl
UserMapper
```

## Method

`camelCase`

```text
getUser()
saveUser()
deleteUser()
findUserList()
```

## Parameter / Variable

`camelCase`

```text
userId
userName
fileName
requestData
```

## Constant

`UPPER_SNAKE_CASE`

```text
MAX_FILE_SIZE
DEFAULT_PAGE_SIZE
TOKEN_EXPIRE_TIME
```

## Boolean

의미가 명확한 이름을 사용합니다.

```text
isActive
hasPermission
canAccess
existsUser
```

---

# 10. DTO / VO Policy

## DTO / VO 사용 금지

본 프로젝트에서는 **DTO와 VO를 사용하지 않습니다.**

REST API Request / Response 데이터는 기본적으로 `Map`을 사용합니다.

### Request

```java
Map<String, Object> param
```

### Response

```java
ResponseEntity<Map<String, Object>>
```

목록 데이터가 필요한 경우:

```java
List<Map<String, Object>>
```

또는 프로젝트의 기존 공통 Response 구조를 사용합니다.

## 금지

AI Agent는 새로운 기능을 구현하면서 다음과 같은 클래스를 생성하지 않습니다.

```text
UserDto
UserRequestDto
UserResponseDto
UserVo
UserRequest
UserResponse
```

또한 DTO 사용을 전제로 다음 구조를 임의로 적용하지 않습니다.

```text
Entity
DTO
Repository
JPA
```

본 프로젝트의 기본 데이터 전달 방식은 `Map`입니다.

---

# 11. REST API

Backend API는 REST API 형식을 기본으로 사용합니다.

## HTTP Method

```text
GET       조회
POST      생성
PUT       전체 수정
PATCH     부분 수정
DELETE    삭제
```

## URL

가능한 경우 Resource 중심으로 작성합니다.

```text
GET     /api/users
GET     /api/users/{userId}

POST    /api/users

PUT     /api/users/{userId}

PATCH   /api/users/{userId}

DELETE  /api/users/{userId}
```

기존 프로젝트에서 사용하는 URL 규칙이 있다면 기존 규칙을 우선합니다.

---

# 12. Request Rules

REST API의 Request 데이터는 기본적으로 `Map`으로 받습니다.

## JSON Body

```java
@PostMapping("/users")
public ResponseEntity<Map<String, Object>> saveUser(
        @RequestBody Map<String, Object> param) {

    return ResponseEntity.ok(userService.saveUser(param));
}
```

## Query Parameter

필요한 경우:

```java
@RequestParam Map<String, Object> param
```

또는 단일 Parameter:

```java
@RequestParam String userId
```

를 사용할 수 있습니다.

단, 기존 프로젝트에서 일관되게 사용하는 방식이 있다면 기존 방식을 우선합니다.

---

# 13. Response Rules

Controller의 API Response는 기본적으로 `ResponseEntity`를 사용합니다.

```java
ResponseEntity<Map<String, Object>>
```

예:

```java
return ResponseEntity.ok(result);
```

필요한 경우 HTTP Status에 맞게 반환합니다.

```java
ResponseEntity.ok()
ResponseEntity.created()
ResponseEntity.badRequest()
ResponseEntity.status()
```

HTTP Status와 Response Body의 역할을 명확하게 구분합니다.

---

# 14. API Response Structure

기존 프로젝트에 공통 Response 구조가 존재하는 경우 반드시 기존 구조를 사용합니다.

예:

```json
{
    "success": true,
    "message": "success",
    "data": {}
}
```

또는:

```json
{
    "result": true,
    "message": "success",
    "data": {}
}
```

AI Agent가 새로운 Response 구조를 임의로 생성하지 않습니다.

---

# 15. Service / ServiceImpl Rules

새로운 Backend 기능은 기본적으로 다음 구조를 사용합니다.

```text
Controller
    ↓
Service
    ↓
ServiceImpl
    ↓
Mapper
```

### Controller

```text
Request
 ↓
기본 Validation
 ↓
Service 호출
 ↓
ResponseEntity
```

### ServiceImpl

```text
Business Logic
 ↓
Validation
 ↓
Transaction
 ↓
Mapper 호출
 ↓
Result 생성
```

ServiceImpl에서 여러 Mapper를 조합할 수 있습니다.

---

# 16. Mapper / SQL Rules

MyBatis를 사용하여 Database에 접근합니다.

### 기본 원칙

* 필요한 컬럼만 조회
* `SELECT *` 지양
* 조건 없는 `UPDATE` 금지
* 조건 없는 `DELETE` 금지
* SQL Injection 방지
* 동적 SQL 사용 시 입력값 검증
* 대량 조회 시 Pagination 고려
* Index 필요 여부 확인

### Database 흐름

```text
ServiceImpl
    ↓
Mapper
    ↓
MyBatis
    ↓
PostgreSQL
```

---

# 17. Transaction

여러 Database 작업이 하나의 논리적인 작업이라면 Transaction을 사용합니다.

예:

```text
Transaction Start
      ↓
INSERT
      ↓
UPDATE
      ↓
DELETE
      ↓
Commit
```

오류 발생 시 Rollback되어야 합니다.

Transaction 범위는 필요한 작업으로 최소화합니다.

---

# 18. Database Integrity

Database의 무결성을 중요하게 고려합니다.

필요한 경우 다음을 활용합니다.

```text
Primary Key
Foreign Key
Unique Constraint
Not Null
Check Constraint
Index
```

Application에서만 중복을 검사하지 않고 Database 수준의 무결성도 고려합니다.

Database 구조를 임의로 변경하지 않습니다.

---

# 19. Validation

사용자가 전달하는 모든 입력값을 신뢰하지 않습니다.

다음 항목을 검증합니다.

```text
Null
Empty
길이
타입
범위
형식
권한
파일 크기
파일 확장자
MIME Type
```

Frontend에서 검증하더라도 Backend에서 다시 검증합니다.

```text
Frontend Validation
        +
Backend Validation
```

---

# 20. Common Fetch API

Frontend의 Backend API 호출은 **Common Fetch API를 우선 사용합니다.**

```text
Component
    ↓
Common Fetch
    ↓
appConfig.apiUrl
    ↓
REST API
```

Common Fetch에서는 가능한 경우 다음 기능을 공통 처리합니다.

```text
Request Header
JWT
Content-Type
JSON Parsing
HTTP Status
Error Handling
Authentication Expiration
```

Component에서 반복적으로 동일한 Fetch 로직을 작성하지 않습니다.

## 금지

```javascript
fetch("http://localhost:8080/api/users");
```

## 권장

```javascript
fetch(`${appConfig.apiUrl}/api/users`);
```

실제 프로젝트의 Common Fetch 구현 방식이 있다면 해당 방식을 우선합니다.

---

# 21. JWT Authentication

JWT 인증을 사용하는 경우 기존 `JwtUtil` 및 프로젝트의 인증 구조를 우선 사용합니다.

기본 흐름:

```text
Login
  ↓
JWT 발급
  ↓
Client
  ↓
Common Fetch
  ↓
Authorization
  ↓
Backend
  ↓
JWT Validation
  ↓
Controller
```

AI Agent는 명시적인 요청 없이 JWT 구조를 변경하지 않습니다.

다음 항목을 임의로 변경하지 않습니다.

```text
Token 저장 위치
Token 생성 방식
Token 검증 방식
Token 만료 시간
Refresh Token 구조
Authorization Header
```

---

# 22. JWT / Secret Security

다음 정보를 Source Code에 직접 작성하지 않습니다.

```text
JWT Secret
API Key
API Secret
DB Password
Access Token
Refresh Token
Private Key
Encryption Key
Cloud Credential
```

또한 다음 정보를 로그에 출력하지 않습니다.

```text
Password
JWT
Access Token
Refresh Token
API Key
Secret Key
DB Password
```

---

# 23. Error Handling

예외를 무시하지 않습니다.

### 금지

```java
catch (Exception e) {
}
```

```java
catch (Exception e) {
    e.printStackTrace();
}
```

프로젝트에 기존 Exception 처리 구조가 있다면 기존 구조를 사용합니다.

사용자에게 내부 Exception이나 Stack Trace를 직접 노출하지 않습니다.

로그에는 문제 추적에 필요한 Exception 정보를 기록합니다.

---

# 24. Logging

로그는 문제를 추적할 수 있도록 필요한 정보를 포함합니다.

가능한 경우:

```text
요청 기능
요청 ID
사용자 식별 정보
처리 결과
오류 원인
Exception Stack Trace
```

단, 개인정보 및 민감정보는 마스킹합니다.

민감한 인증 정보는 로그에 출력하지 않습니다.

---

# 25. File Processing

## File Size

```text
개별 파일 최대 크기 : 20MB
한 번의 요청 최대 크기 : 2GB
```

파일 처리 시 다음 사항을 확인합니다.

```text
□ 파일 크기 검증
□ 확장자 검증
□ MIME Type 검증
□ 파일명 검증
□ Path Traversal 방지
□ 임시 파일 관리
□ 예외 발생 시 임시 파일 삭제
□ 대용량 파일 Memory 사용량 확인
```

사용자가 전달한 파일명을 서버 경로에 그대로 사용하지 않습니다.

---

# 26. Temporary File

임시 파일은 작업 완료 후 삭제되어야 합니다.

```text
Upload
   ↓
Temporary File
   ↓
Processing
   ↓
Success / Failure
   ↓
Temporary File Delete
```

Spring Batch를 이용하여 오래된 임시 파일을 주기적으로 정리할 수 있습니다.

단, 현재 사용 중인 파일을 삭제하지 않도록 삭제 조건을 명확하게 정의합니다.

---

# 27. Excel / PDF

## Excel

Excel 처리에는 다음 Library를 사용합니다.

```text
Apache POI
Excel.js
```

대용량 Excel 처리 시 Memory 사용량을 고려합니다.

필요한 경우 Streaming 방식을 사용합니다.

## PDF

PDF 처리는 `pdf.js`를 사용합니다.

PDF 처리 시 다음 사항을 확인합니다.

```text
파일 크기
MIME Type
파일 확장자
파일 처리 방식
Memory 사용량
```

---

# 28. WebSocket

실시간 통신에는 Spring WebSocket을 사용합니다.

WebSocket 구현 시 다음을 고려합니다.

```text
연결 인증
사용자 식별
Session 관리
메시지 검증
권한 검증
연결 종료 처리
예외 처리
중복 연결 처리
```

사용자가 입력하는 채팅 메시지는 신뢰하지 않습니다.

XSS 등 입력값 관련 보안 문제를 고려합니다.

---

# 29. Common UI

기본 UI 기능은 기존 공통 Component를 우선 사용합니다.

다음 Popup은 Custom Popup을 사용합니다.

```text
ALERT
CONFIRM
ERROR
PROMPT
```

브라우저 기본 Popup을 임의로 사용하지 않습니다.

```javascript
alert()
confirm()
prompt()
```

기존 Custom Popup이 존재하는 경우 반드시 재사용합니다.

---

# 30. Frontend Component Rules

Component는 가능한 한 재사용 가능한 형태로 작성합니다.

반복되는 UI와 로직은 공통 Component 또는 Utility로 분리합니다.

Component에서 다음을 과도하게 담당하지 않습니다.

```text
API 처리
복잡한 Business Logic
환경 설정
JWT 처리
공통 Error 처리
```

공통 기능은 해당 공통 모듈을 사용합니다.

---

# 31. Dependency Rules

새로운 Dependency를 추가하기 전에 기존 Dependency로 해결할 수 있는지 확인합니다.

새로운 Library 추가가 필요한 경우 다음을 확인합니다.

```text
1. 기존 Library로 해결 가능한지
2. 추가 필요성
3. 프로젝트 호환성
4. 버전
5. 보안 취약점
6. Bundle / Build 영향
```

다음과 같은 Library를 AI Agent가 임의로 추가하지 않습니다.

```text
Axios
JPA
Hibernate
새로운 ORM
새로운 상태관리 Library
새로운 HTTP Client
```

단, 사용자가 명시적으로 요청한 경우 예외입니다.

---

# 32. Configuration Rules

환경별 설정은 분리하여 관리합니다.

```text
local
dev
test
prod
```

환경에 따라 달라질 수 있는 값:

```text
Database
API URL
WebSocket URL
Storage
File Path
External API
Logging
Profile
```

환경별 값을 Source Code에 하드코딩하지 않습니다.

---

# 33. Git Rules

Commit 전에 다음 항목을 확인합니다.

```text
□ Debug Code 제거
□ System.out.println 제거
□ 불필요한 주석 제거
□ Secret 제거
□ 불필요한 파일 제거
□ Test
□ Compile
□ Build
□ 변경 범위 확인
```

Repository에 불필요한 파일을 추가하지 않습니다.

예:

```text
.idea/
*.iml
build/
node_modules/
.env
*.log
```

단, 기존 `.gitignore` 정책을 우선합니다.

---

# 34. Testing

기능 구현 후 가능한 범위에서 다음을 확인합니다.

```text
1. 정상 요청
2. 잘못된 요청
3. Null / Empty
4. 잘못된 Parameter
5. 권한 없는 요청
6. 존재하지 않는 데이터
7. 중복 요청
8. 예외 발생
9. 대량 데이터
10. 파일 크기 제한
11. 인증 만료
```

가능한 경우 Unit Test / Integration Test를 작성합니다.

기존 Test Code가 있다면 기존 Test Style을 따릅니다.

---

# 35. Build Verification

코드 수정 후 가능한 경우 실제 프로젝트에서 사용하는 명령어를 기준으로 검증합니다.

## Backend

```text
Gradle Build
Compile
Test
```

## Frontend

```text
npm install
npm run build
npm test
```

단, 프로젝트에 실제로 존재하는 Script만 실행합니다.

존재하지 않는 명령어를 임의로 추가하거나 실행하지 않습니다.

---

# 36. Performance

기능 구현 시 기본적인 성능을 고려합니다.

```text
□ 불필요한 DB Query 방지
□ N+1 Query 방지
□ 불필요한 API 호출 방지
□ Pagination
□ 대용량 File Streaming
□ 불필요한 객체 생성 최소화
□ DB Index 확인
□ Transaction 범위 최소화
```

단순한 성능 개선을 위해 기존 코드를 임의로 리팩토링하지 않습니다.

실제 병목이 확인된 경우 필요한 범위에서 수정합니다.

---

# 37. Concurrency

동시에 동일한 데이터가 변경될 가능성이 있는 경우 동시성 문제를 고려합니다.

필요한 경우:

```text
Transaction
Optimistic Lock
Pessimistic Lock
Unique Constraint
Database Constraint
```

Application에서만 중복을 검사하지 않고 Database 수준에서도 무결성을 확보합니다.

---

# 38. Backward Compatibility

기존 기능에 영향을 줄 수 있는 변경은 신중하게 처리합니다.

특히 다음 항목은 영향 범위를 확인합니다.

```text
기존 API
API Parameter
API Response
Mapper
Database Column
Common Fetch
JWT
Common Popup
app.js
appConfig.js
router.js
```

기존 기능이 깨질 가능성이 있는 경우 변경 전에 영향 범위를 확인합니다.

---

# 39. New Feature Rules

새로운 기능을 추가할 때 다음 구조를 기본으로 고려합니다.

```text
Frontend
    ↓
router.js
    ↓
Component / Screen
    ↓
Common Fetch
    ↓
REST API
    ↓
Controller
    ↓
Service
    ↓
ServiceImpl
    ↓
Mapper
    ↓
PostgreSQL
```

필요한 경우 다음 파일을 새로 생성할 수 있습니다.

```text
Controller
Service
ServiceImpl
Mapper
Utility
Component
Config
Exception
```

단, DTO / VO / Entity는 생성하지 않습니다.

기존 프로젝트의 구조가 다르면 기존 구조를 우선합니다.

---

# 40. Database Change Rules

Database 구조를 임의로 변경하지 않습니다.

변경이 필요한 경우 다음 항목을 먼저 확인합니다.

```text
Table
Column
Primary Key
Foreign Key
Index
Constraint
Sequence
Trigger
```

DB 변경이 필요한 경우 변경 내용과 영향 범위를 명확하게 확인합니다.

---

# 41. AI Coding Agent Workflow

Codex 등 AI Coding Agent는 다음 순서로 작업합니다.

```text
1. 사용자 요청 확인
        ↓
2. 관련 파일 탐색
        ↓
3. 기존 구현 방식 확인
        ↓
4. 영향 범위 확인
        ↓
5. 최소 변경 계획 수립
        ↓
6. 코드 수정
        ↓
7. 필요한 주석 작성
        ↓
8. 관련 기능 Test
        ↓
9. Compile / Build
        ↓
10. 변경 사항 보고
```

## 핵심 원칙

### Existing First

새로운 구현보다 기존 구현을 먼저 확인합니다.

### Minimal Change

요청한 기능에 필요한 최소한의 코드만 수정합니다.

### No Unrequested Refactoring

사용자가 요청하지 않은 리팩토링을 수행하지 않습니다.

### Reuse First

기존 공통 기능을 우선 재사용합니다.

---

# 42. Comment Rules

주석은 단순히 코드의 동작을 설명하기보다 **왜 해당 방식으로 구현했는지** 설명합니다.

### 권장

```java
// 대용량 파일 처리 시 Memory 사용량 증가를 방지하기 위해 Stream 방식으로 처리
```

### 지양

```java
// 파일을 처리한다.
```

다음과 같은 경우에는 주석을 적극적으로 작성합니다.

```text
복잡한 Business Rule
보안 관련 처리
특수한 예외 처리
성능을 위한 특수 구현
외부 시스템 연동 이유
Workaround
```

단순한 코드 설명을 위한 불필요한 주석은 작성하지 않습니다.

---

# 43. Security Checklist

기능 구현 후 다음 항목을 확인합니다.

```text
□ 인증 확인
□ 권한 확인
□ Input Validation
□ SQL Injection 방지
□ XSS 방지
□ CSRF 고려
□ Path Traversal 방지
□ 민감정보 노출 방지
□ File Upload 검증
□ Log 민감정보 제거
□ API Key / Secret 외부화
□ JWT 검증
□ 환경 설정 보안
```

---

# 44. Final Response Rules

AI Agent가 작업을 완료한 경우 다음 형식으로 간단하게 보고합니다.

```text
[변경 내용]
- 추가 / 수정한 기능

[변경 파일]
- 수정한 파일
- 생성한 파일

[주요 변경 사항]
- 핵심 구현 내용

[검증]
- Compile
- Build
- Test

[주의 사항]
- 추가 설정
- DB 변경
- 사용자 추가 작업
```

실제로 변경하지 않은 파일을 변경했다고 보고하지 않습니다.

검증하지 않은 항목을 검증했다고 보고하지 않습니다.

---

# 45. File Size Rules

## Upload

```text
개별 파일 최대 크기 : 20MB
한 번의 요청 최대 크기 : 2GB
```

파일 업로드 / 다운로드 기능 구현 시 반드시 해당 제한을 고려합니다.

## Source Code

소스 코드 파일은 기능과 책임이 과도하게 커지지 않도록 관리합니다.

하나의 클래스가 지나치게 많은 책임을 가지는 경우 적절하게 분리합니다.

---

# 46. Priority

규칙 간 충돌이 발생하는 경우 다음 우선순위를 따릅니다.

```text
1. 사용자 요청
2. 프로젝트의 기존 구조 및 규칙
3. Security
4. Data Integrity
5. 정상적인 기능 동작
6. Performance
7. Code Quality
8. 개인적인 개선 사항
```

사용자가 명시적으로 기존 규칙과 다른 구현을 요구한 경우 사용자 요청을 우선합니다.

단, 보안상 위험한 구현은 위험성을 알리고 안전한 방법을 우선합니다.

---

# 47. Final Checklist

AI Agent는 작업 완료 전에 다음을 확인합니다.

```text
┌──────────────────────────────────────────┐
│              FINAL CHECK                 │
├──────────────────────────────────────────┤
│ □ 기존 코드 확인                         │
│ □ 요청 범위 확인                         │
│ □ 최소 범위 수정                         │
│ □ DTO / VO 생성하지 않음                 │
│ □ REST API 규칙 준수                     │
│ □ Map Request / Response 사용            │
│ □ ResponseEntity 사용                    │
│ □ 기존 Common Fetch 재사용               │
│ □ 기존 Popup 재사용                      │
│ □ 기존 JWT 구조 유지                     │
│ □ Environment / Profile 구조 유지        │
│ □ appConfig.js 구조 유지                 │
│ □ app.js 전역 등록 구조 유지             │
│ □ router.js 구조 유지                    │
│ □ Input Validation                       │
│ □ Security 확인                          │
│ □ Secret 노출 여부 확인                  │
│ □ Exception 처리 확인                    │
│ □ SQL 확인                               │
│ □ Transaction 확인                       │
│ □ File 처리 확인                         │
│ □ Test                                   │
│ □ Compile                                │
│ □ Build                                  │
│ □ 변경 파일 확인                         │
└──────────────────────────────────────────┘
```

---

# 48. Core Principles

> **기존 코드를 먼저 확인합니다.**
>
> **요청받은 범위만 최소한으로 수정합니다.**
>
> **REST API를 기본으로 사용합니다.**
>
> **Request / Response는 Map 기반으로 처리합니다.**
>
> **Controller Response는 ResponseEntity를 기본으로 사용합니다.**
>
> **DTO / VO / Entity를 사용하지 않습니다.**
>
> **기존 Common Fetch와 Common UI를 재사용합니다.**
>
> **Spring Environment / Profile을 기준으로 환경을 관리합니다.**
>
> **appConfig.js에서 Frontend Configuration을 관리하고 app.js에서 전역 등록합니다.**
>
> **JWT 및 보안 설정은 기존 구조를 유지하며 Secret을 Client에 노출하지 않습니다.**
>
> **Database 무결성과 Security를 우선합니다.**
>
> **테스트와 Build 확인 후 작업을 완료합니다.**

```text
Existing First
Minimal Change
REST API
Map Based API
ResponseEntity
No DTO / VO / Entity
Reuse Common Code
Environment Based Configuration
Global appConfig
JWT Authentication
Security First
Validate Input
Data Integrity
Test Before Complete
Verify Before Report
```
