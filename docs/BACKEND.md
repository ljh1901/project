# Backend & REST API

## 계층 및 API
- Controller → Service → ServiceImpl → Mapper; 기존 프로젝트 구현 우선.
- Controller는 `ResponseEntity`를 기본으로 반환한다.
- Request/Response는 기존 공통 응답 규약 및 `Map<String, Object>` / `List<Map<String, Object>>` 사용.
- DTO, VO, Entity, Repository, JPA를 임의로 추가하지 않는다.
- REST 메서드: GET 조회, POST 생성, PUT 전체 수정, PATCH 부분 수정, DELETE 삭제. 기존 URL 규칙 우선.

```java
@PostMapping("/users")
public ResponseEntity<Map<String, Object>> saveUser(
        @RequestBody Map<String, Object> param) {
    return ResponseEntity.ok(userService.saveUser(param));
}
```

- 공통 응답 형식(`success`, `message`, `data` 등)이 있으면 그대로 따른다.
- `Map` 입력은 타입·필수값·길이·범위·권한을 명시적으로 검증한다.
- 여러 DB 변경이 하나의 작업이면 ServiceImpl에서 `@Transactional`을 검토한다. 트랜잭션은 필요한 범위로 최소화한다.
- 예외는 기존 전역 예외 처리기를 활용하며 내부 오류·스택 트레이스를 API에 노출하지 않는다.
- 파일·메일·외부 API 작업은 트랜잭션과 외부 부작용의 일관성을 고려한다.
