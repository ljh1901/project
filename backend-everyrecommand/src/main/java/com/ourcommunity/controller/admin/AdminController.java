package com.ourcommunity.controller.admin;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ourcommunity.service.admin.AdminService;
import com.ourcommunity.common.ApiResult;
import org.springframework.web.bind.annotation.GetMapping;


import lombok.RequiredArgsConstructor;
import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController 
@RequiredArgsConstructor
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/UserListM0")
    public ResponseEntity<Map<String, Object>> userListM0() {
        // 사용자 목록
        List<Map<String,Object>> result = adminService.userListM0();
        
        return ResponseEntity.ok(ApiResult.success(result));
    }
    @PostMapping("/UserListP0")
    public ResponseEntity<Map<String,Object>> userListP0(@RequestBody Map<String, Object> params) {
        // 사용자 상세보기
        Map<String,Object> result = adminService.userListP0(params);
        
        return ResponseEntity.ok(ApiResult.success(result));
    }
    
}
