package com.ourcommunity.controller.common;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import com.ourcommunity.service.common.FileService;
import lombok.RequiredArgsConstructor;

@Controller 
@RequestMapping("/api/file")
public class FileController {
    private final FileService fileService;

    public FileController(FileService fileService){
        this.fileService = fileService;
    }

    @PostMapping(value = "/upload")
    public void fileUpload(@RequestPart(required = false) MultipartFile[] params) throws Exception{
        int result = fileService.fileUpload(params);
    }
}