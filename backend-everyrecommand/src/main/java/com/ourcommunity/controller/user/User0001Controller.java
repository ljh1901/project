package com.ourcommunity.controller.user;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import com.ourcommunity.service.user.User0001Service;
import com.ourcommunity.service.user.impl.User0001ServiceImpl;

import org.springframework.web.bind.annotation.GetMapping;


import lombok.RequiredArgsConstructor;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Map;

import org.apache.commons.collections4.MapUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;


@RestController 
@RequestMapping("/api/admin")
public class User0001Controller {
    private final User0001Service adminService;
    private final Logger log = LoggerFactory.getLogger(User0001Controller.class);

    public User0001Controller(User0001ServiceImpl adminServiceImpl) {
        this.adminService = adminServiceImpl;
    }

    // 사용자 목록 조회
    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> userListM0() {
        List<Map<String,Object>> result = adminService.userListM0();
        log.info("1. result 개수 조회 시작");
        log.info("==================================================================");
        log.info("result 개수 출력 : {}", result.size());
        log.info("==================================================================");
        return ResponseEntity.ok(result);
    }

    // 사용자 상세 조회
    @PostMapping("/users/detail")
    public ResponseEntity<Map<String,Object>> userListP0(@RequestBody Map<String, Object> params) {
        Map<String,Object> result = adminService.userListP0(params);
        
        return ResponseEntity.ok(result);
    }

}
