package com.ourcommunity.controller.common;

import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;


import com.ourcommunity.service.common.CommonService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * 1. RestTemplate
 * 2. WebClient
 * 3. RestClient
 */
@Controller 
@RequiredArgsConstructor 
public class CommonController {
    private final CommonService commonService;

    // 프론트에서 사용할 공개 환경 설정을 응답
    @GetMapping("/api/config")
    public ResponseEntity<Map<String, Object>> getAppConfig() {
        return ResponseEntity.ok(commonService.getAppConfig());
    }

    @GetMapping("/popup/notice")
    public String popup(Model model) {
        return "popup";
    }
    
    
    // 파일 관련 응답
    
}
