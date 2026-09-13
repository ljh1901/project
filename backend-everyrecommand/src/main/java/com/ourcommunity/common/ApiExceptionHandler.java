package com.ourcommunity.common;

import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {
    private static final Logger log = LoggerFactory.getLogger(ApiExceptionHandler.class);

    @ExceptionHandler({IllegalArgumentException.class, HttpMessageNotReadableException.class})
    // 잘못된 입력이나 JSON 형식에 대해 400 응답을 반환합니다.
    public ResponseEntity<Map<String, Object>> badRequest(Exception exception) {
        return ResponseEntity.badRequest().body(ApiResult.error("입력값을 확인해 주세요."));
    }

    @ExceptionHandler(AuthenticationException.class)
    // 인증 실패를 처리하고 인증 시스템 오류는 서버 오류로 전달합니다.
    public ResponseEntity<Map<String, Object>> unauthorized(AuthenticationException exception) {
        if (exception instanceof org.springframework.security.authentication.AuthenticationServiceException) {
            return unexpected(exception);
        }
        return ResponseEntity.status(401).body(ApiResult.error("아이디 또는 비밀번호를 확인해 주세요."));
    }

    @ExceptionHandler(AccessDeniedException.class)
    // 접근 권한이 없는 요청에 403 응답을 반환합니다.
    public ResponseEntity<Map<String, Object>> forbidden(AccessDeniedException exception) {
        return ResponseEntity.status(403).body(ApiResult.error("접근 권한이 없습니다."));
    }

    @ExceptionHandler(Exception.class)
    // 예외의 HTTP 상태를 반영하고 예상하지 못한 오류를 기록합니다.
    public ResponseEntity<Map<String, Object>> unexpected(Exception exception) {
        if (exception instanceof org.springframework.web.ErrorResponse error) {
            return ResponseEntity.status(error.getStatusCode()).body(ApiResult.error("요청 경로와 형식을 확인해 주세요."));
        }
        // 예외 메시지에는 SQL·접속 정보가 포함될 수 있어 타입과 발생 위치만 기록합니다.
        log.error("API 처리 실패: type={}, location={}", exception.getClass().getName(),
                exception.getStackTrace().length > 0 ? exception.getStackTrace()[0] : "unknown");
        return ResponseEntity.internalServerError().body(ApiResult.error("요청을 처리하지 못했습니다."));
    }
}
