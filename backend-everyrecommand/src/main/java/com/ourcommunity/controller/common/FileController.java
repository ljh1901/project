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
    public ResponseEntity<Map<String, Object>> fileUpload(
            @RequestParam("file") MultipartFile file, Authentication authentication) throws IOException {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResult.success(fileService.fileUpload(file, authentication.getName())));
    }

    @GetMapping("/fileDownload/{fileId}")
    public ResponseEntity<Resource> fileDownload(
            @PathVariable String fileId, Authentication authentication) throws IOException {
        Map<String, Object> result = fileService.fileDownload(fileId, authentication.getName());
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .contentLength((Long) result.get("size"))
                .cacheControl(CacheControl.noStore())
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment()
                        .filename((String) result.get("fileName"), StandardCharsets.UTF_8).build().toString())
                .body((Resource) result.get("resource"));
    }
}