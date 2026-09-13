package com.ourcommunity.common;

import java.util.Map;

public final class ApiResult {
    private ApiResult() {}
    public static Map<String, Object> success(Object data) {
        return Map.of("success", true, "message", "success", "data", data);
    }
    public static Map<String, Object> error(String message) {
        return Map.of("success", false, "message", message, "data", Map.of());
    }
}
