package com.ourcommunity.controller.common;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.ourcommunity.common.ApiResult;
import com.ourcommunity.service.common.FileService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/upload")
public class FileController {
    private final FileService fileService;

    @PostMapping(value = "/fileUpload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    // 업로드 요청을 로그인 사용자 정보와 함께 파일 서비스에 전달합니다.
    public ResponseEntity<Map<String, Object>> fileUpload(
            @RequestParam("file") MultipartFile file, Authentication authentication) throws IOException {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResult.success(fileService.fileUpload(file, authentication.getName())));
    }
}