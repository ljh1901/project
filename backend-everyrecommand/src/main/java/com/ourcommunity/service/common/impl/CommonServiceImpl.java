package com.ourcommunity.service.common.impl;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import com.ourcommunity.service.common.CommonService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommonServiceImpl implements CommonService {

    private final Environment environment;
    @Override
    // 실행 프로필과 프런트용 API 주소 등 공개 설정을 구성합니다.
    public Map<String, Object> getAppConfig() {
        String[] profiles = environment.getActiveProfiles();
        if (profiles.length == 0)
            profiles = environment.getDefaultProfiles();
        // 공개할 항목만 선택해 DB·서버 비밀 설정이 프론트로 전달되지 않게 합니다.
        return Map.of("appName", "모두의 추천", "profile", String.join(",", profiles),
                "apiUrl", environment.getProperty("app.frontend.api-url", "/api"),
                "websocketUrl", environment.getProperty("app.frontend.websocket-url", ""));
    }
}
