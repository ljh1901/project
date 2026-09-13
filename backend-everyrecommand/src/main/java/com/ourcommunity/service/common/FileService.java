package com.ourcommunity.service.common;

import java.io.IOException;
import java.util.Map;
import org.springframework.web.multipart.MultipartFile;

public interface FileService {
    Map<String, Object> fileUpload(MultipartFile file, String owner) throws IOException;
    Map<String, Object> fileDownload(String fileId, String owner, MultipartFile upload) throws IOException;
}