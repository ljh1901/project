package com.ourcommunity.service.common;

import java.io.IOException;
import java.util.Map;
import org.springframework.web.multipart.MultipartFile;

public interface FileService {
    // 사용자 파일을 업로드하는 서비스 메서드를 정의합니다.
    Map<String, Object> fileUpload(MultipartFile file, String owner) throws IOException;
    // 파일 다운로드를 위한 서비스 메서드를 정의합니다.
    Map<String, Object> fileDownload(String fileId, String owner, MultipartFile upload) throws IOException;
}