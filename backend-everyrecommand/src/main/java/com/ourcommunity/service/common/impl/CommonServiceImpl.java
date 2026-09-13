package com.ourcommunity.service.common.impl;

import java.util.Map;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import com.ourcommunity.service.common.CommonService;

@Service
public class CommonServiceImpl implements CommonService {
    private final Environment environment;
    public CommonServiceImpl(Environment environment) { this.environment = environment; }
    @Override
    public Map<String, Object> getAppConfig() {
        String[] profiles = environment.getActiveProfiles();
        if (profiles.length == 0) profiles = environment.getDefaultProfiles();
        // 공개할 항목만 선택해 DB·서버 비밀 설정이 프론트로 전달되지 않게 합니다.
        return Map.of("appName", "모두의 추천", "profile", String.join(",", profiles),
                "apiUrl", environment.getProperty("app.frontend.api-url", "/api"),
                "websocketUrl", environment.getProperty("app.frontend.websocket-url", ""));
    }
}
