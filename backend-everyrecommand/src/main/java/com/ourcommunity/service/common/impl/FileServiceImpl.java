package com.ourcommunity.service.common.impl;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ourcommunity.service.common.FileService;

@Service
public class FileServiceImpl implements FileService{
    @Value("${file.upload.dir}")
    String UPLOAD_URL;

    @Override
    // 파일 다운로드 처리용 메서드로, 현재 파일 쓰기 코드가 들어 있는 작성 중 상태입니다.
    public Map<String, Object> fileDownload(String fileId, String owner, MultipartFile upload) throws IOException {
        try{

        }
        catch(Exception e){

        }
        return null;
    }


    // 파일 업로드 처리용 메서드
    @Override
    public int fileUpload(MultipartFile[] params) throws IOException {
        File fileDir = new File(UPLOAD_URL);
        String[] extArr = new String[]{"hwp","docx","pdf","hwpx","txt","xlsx"};
        if(fileDir.exists()){
            if(fileDir.isDirectory()){
                for(MultipartFile tmpFile : params){
                    for(String ext : extArr){
                        String extension = tmpFile.getOriginalFilename().substring(tmpFile.getOriginalFilename().lastIndexOf(".")+1);
                        if(!ext.equals(extension)){
                            throw new IOException("hwp, docx, pdf, hwpx, txt, xlsx 파일만 첨부 가능합니다.");
                        }
                    }
                    // 1. 복사용지 생성    
                    File copyFile = new File(fileDir,UUID.randomUUID().toString());
                    // 2. 복사기 생성 및 복사
                    FileOutputStream fos = new FileOutputStream(copyFile);
                    // 3. 복사
                    fos.write(tmpFile.getBytes());
                    // 4. 복사기 전원 종료
                    fos.close();
                }
            }
        }
        else{
            fileDir.mkdir();
            return fileUpload(params);
        }
        return params.length;
    };
}
