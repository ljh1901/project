package com.ourcommunity.controller.common;

import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;


import com.ourcommunity.service.common.CommonService;

import lombok.RequiredArgsConstructor;

@Controller 
@RequiredArgsConstructor 
public class CommonController {
    private final CommonService commonService;

    // 프런트에서 사용할 공개 환경 설정을 응답합니다.
    @GetMapping("/api/config")
    public ResponseEntity<Map<String, Object>> getAppConfig() {
        return ResponseEntity.ok(commonService.getAppConfig());
    }

    // 파일 관련 응답
    
}
