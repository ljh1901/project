package com.ourcommunity.controller.admin;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping ("/api/admin/admin0001") 
public class Admin0001Controller {

    @PostMapping ("/AD0001M0")
    public ResponseEntity<Map<String,Object>> ad0001M0(Map<String,Object> params){
        return ResponseEntity.ok().build();
    }
}
