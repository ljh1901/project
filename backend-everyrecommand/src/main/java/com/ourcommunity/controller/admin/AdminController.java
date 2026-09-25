package com.ourcommunity.controller.admin;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ourcommunity.service.admin.AdminService;
import com.ourcommunity.common.ApiResult;
import org.springframework.web.bind.annotation.GetMapping;

import io.micrometer.core.ipc.http.HttpSender.Response;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Map;

import org.apache.poi.ss.formula.functions.T;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController 
@RequiredArgsConstructor
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    @PostMapping("/user/list")
    public ResponseEntity<Map<String,Object>> userListM0() {

        // 사용자 목록
        List<Map<String,Object>> result = adminService.userListM0();
        
        return ResponseEntity.ok(ApiResult.success(result));
    }
    @GetMapping("/user/list")
    public ResponseEntity<Map<String, Object>> getUserList() {
        return userListM0();
    }
    
}
