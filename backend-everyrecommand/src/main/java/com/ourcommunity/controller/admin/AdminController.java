package com.ourcommunity.controller.admin;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import com.ourcommunity.service.admin.AdminService;

import org.springframework.web.bind.annotation.GetMapping;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;



@Slf4j 
@RestController 
@RequiredArgsConstructor
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;


    // 사용자 목록 조회
    @GetMapping("/UserListM0")
    public ResponseEntity<List<Map<String, Object>>> userListM0() {
        List<Map<String,Object>> result = adminService.userListM0();
        
        return ResponseEntity.ok(result);
    }

    // 사용자 상세 조회
    @PostMapping("/UserListP0")
    public ResponseEntity<Map<String,Object>> userListP0(@RequestBody Map<String, Object> params) {
        Map<String,Object> result = adminService.userListP0(params);
        
        return ResponseEntity.ok(result);
    }

    // 게시판 카테고리 목록 조회
    @GetMapping("/BoardCategoryM0")
    public ResponseEntity<List<Map<String, Object>>> boardCategoryListM0(Map<String, Object> params) {
        List<Map<String, Object>> result = adminService.boardCategoryM0();
        log.error("result = {} : ", result);
        ResponseEntity<List<Map<String,Object>>> res = new ResponseEntity<>(result, HttpStatus.OK);
        return res;
    }
    // 게시판 카테고리 생성
    @PostMapping("/BoardCategoryP0")
    public ResponseEntity<Integer> boardCategoryP0(@RequestBody Map<String,Object> params) {
        Integer result = adminService.boardCategoryP0(params);
        return ResponseEntity.ok().body(result);
    }
    // 게시판 카테고리 수정
    @PutMapping("path/{id}")
    public String putMethodName(@PathVariable String id, @RequestBody String entity) {
        //TODO: process PUT request
        
        return entity;
    }
    
}
