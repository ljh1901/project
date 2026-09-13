package com.ourcommunity.common;

import java.util.Map;

public final class ApiResult {
    private ApiResult() {}
    // 처리 결과를 공통 성공 응답 형식으로 감쌉니다.
    public static Map<String, Object> success(Object data) {
        return Map.of("success", true, "message", "success", "data", data);
    }
    // 안내 메시지를 공통 오류 응답 형식으로 감쌉니다.
    public static Map<String, Object> error(String message) {
        return Map.of("success", false, "message", message, "data", Map.of());
    }
}
