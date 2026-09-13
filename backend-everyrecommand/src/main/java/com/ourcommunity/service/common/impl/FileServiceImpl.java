package com.ourcommunity.service.common.impl;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartRequest;

import com.ourcommunity.service.common.FileService;

public class FileServiceImpl implements FileService{
    
    @Override
    public Map<String, Object> fileDownload(String fileId, String owner, MultipartFile upload) throws IOException {
        try{
            File f = new File("/upload");
            if(f.isDirectory()){
                for(File getFile:f.listFiles()){
                    if(getFile.getName()==fileId){
                        FileOutputStream fos = new FileOutputStream(f);
                        fos.write(upload.getBytes());
                        fos.close();
                    }
                }
            }
        }
        catch(Exception e){

        }
        return null;
    }
    @Override
    public Map<String, Object> fileUpload(MultipartFile file, String owner) throws IOException {
        // TODO Auto-generated method stub
        return null;
    }
}
