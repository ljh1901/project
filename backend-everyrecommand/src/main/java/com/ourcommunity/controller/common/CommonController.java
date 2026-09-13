package com.ourcommunity.controller.common;

import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import com.ourcommunity.common.ApiResult;
import com.ourcommunity.service.common.CommonService;

@RestController
public class CommonController {
    private final CommonService commonService;
    public CommonController(CommonService commonService) { this.commonService = commonService; }
    @GetMapping("/api/config")
    // 프런트에서 사용할 공개 환경 설정을 응답합니다.
    public ResponseEntity<Map<String, Object>> getAppConfig() {
        return ResponseEntity.ok(ApiResult.success(commonService.getAppConfig()));
    }
}
