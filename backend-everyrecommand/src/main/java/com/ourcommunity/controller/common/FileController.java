package com.ourcommunity.controller.common;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.ourcommunity.service.common.FileService;

/**
 * @FileController
 * @ResponseBody + @Controller
 * Front에서 FormData() 또는 blob으로 파일을 받기
 * 
 * */
@RestController 
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