package com.ourcommunity.controller.admin;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import com.ourcommunity.service.admin.AdminService;
import com.ourcommunity.service.admin.impl.AdminServiceImpl;
import com.ourcommunity.utils.PagingUtils;

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
public class AdminController {

    // 1. @Autowired 사용 가능 
    // 2. @RequiredArgsConstructor 사용 가능
    private final AdminService adminService;
    private final Logger log = LoggerFactory.getLogger(AdminController.class);
    
    public AdminController(AdminServiceImpl adminServiceImpl) {
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

    // 게시판 카테고리 목록 조회
    @GetMapping("/board-categoriesM0")
    public ResponseEntity<List<Map<String, Object>>> boardCategoryListM0(@RequestParam Map<String, Object> params) {
        int totalCount = adminService.boardCategoryM0Cnt(params);
        PagingUtils.pagingAlgorithm("/admin/board-categories", totalCount, 5, MapUtils.getInteger(params, "listCount"),1);
        List<Map<String, Object>> result = adminService.boardCategoryM0(params);
        log.info("result = {}", result);
        ResponseEntity<List<Map<String,Object>>> res = new ResponseEntity<>(result, HttpStatus.OK);
        return res;
    }

    // 게시판 카테고리 생성
    @PostMapping("/board-categories")
    public ResponseEntity<Integer> boardCategoryP0(@RequestBody Map<String,Object> params) {
        Integer result = adminService.boardCategoryP0(params);
        log.info("카테고리 생성결과 result => {}",result);
        log.info("카테고리 생성결과 result => {}",params);
        return ResponseEntity.ok().body(result);
    }

    // 게시판 카테고리 수정
    @PutMapping("/board-categories")
    public ResponseEntity<?> putMethodName(@RequestBody List<Map<String,Object>> params) {
        if (params == null || params.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        adminService.boardCategoryP1(params);
        return ResponseEntity.ok().build();
    }
    
}
