package com.ourcommunity.controller.board;

import org.springframework.web.bind.annotation.RestController;
import com.ourcommunity.service.board.Board0002Service;
import com.ourcommunity.service.board.impl.Board0002ServiceImpl;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;


@RestController 
public class Board0002Controller {
    private final Board0002Service adminService;
    private final Logger log = LoggerFactory.getLogger(Board0002Controller.class);

    public Board0002Controller(Board0002ServiceImpl adminServiceImpl) {
        this.adminService = adminServiceImpl;
    }

    // 게시판 카테고리 목록 조회
    @GetMapping("/api/admin/board-categoriesM0")
    public ResponseEntity<Map<String, Object>> boardCategoryListM0(@RequestParam Map<String, Object> params) {
        try {
            int currentPage = Integer.parseInt(params.getOrDefault("currentPage", "1").toString());
            int listCount = Integer.parseInt(params.getOrDefault("listCount", "5").toString());
            if (currentPage < 1 || listCount < 1 || listCount > 100) {
                return ResponseEntity.badRequest().body(Map.of("message", "페이지 조회 조건이 올바르지 않습니다."));
            }
            params.put("currentPage", currentPage);
            params.put("listCount", listCount);
        } catch (NumberFormatException exception) {
            return ResponseEntity.badRequest().body(Map.of("message", "페이지 조회 조건은 정수여야 합니다."));
        }
        return ResponseEntity.ok(adminService.boardCategoryM0(params));
    }

    // 게시판 카테고리 생성
    @PostMapping("/api/admin/board-categories")
    public ResponseEntity<Integer> boardCategoryP0(@RequestBody Map<String,Object> params) {
        Integer result = adminService.boardCategoryP0(params);
        log.info("카테고리 생성결과 result => {}",result);
        log.info("카테고리 생성결과 result => {}",params);
        return ResponseEntity.ok().body(result);
    }

    // 게시판 카테고리 수정
    @PutMapping("/api/admin/board-categories")
    public ResponseEntity<?> putMethodName(@RequestBody List<Map<String,Object>> params) {
        if (params == null || params.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        adminService.boardCategoryP1(params);
        return ResponseEntity.ok().build();
    }
    

    @PostMapping("/api/boards/boardCategoryList")
    public ResponseEntity<?> getBoardCategory(){
        List<Map<String,Object>> result = adminService.boardCategoryM0();
        return ResponseEntity.ok(result);
    }

}
