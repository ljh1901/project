package com.ourcommunity.controller.board;

import java.util.List;
import java.util.Map;

import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ourcommunity.exception.CommonException;
import com.ourcommunity.service.board.Board0001Service;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/boards")
public class Board0001Controller {
    private final Board0001Service boardSerivce;
    public Board0001Controller(Board0001Service boardSerivce){
        this.boardSerivce = boardSerivce;
    }

    @GetMapping("/boardListM0")
    public ResponseEntity<Map<String,Object>> boardListM0(Map<String,Object> params){
        Map<String,Object> result = boardSerivce.boardListM0(params);
        return ResponseEntity.ok(result);
    }
    
    @PostMapping("/boardWriteM0")
    public ResponseEntity<Map<String,Object>> boardWriteM0(Map<String,Object> params) {
        if(MapUtils.isEmpty(params)){
            throw new CommonException("게시글 생성 중 오류가 발생했습니다.","[E999]");
        }
        return ResponseEntity.ok(null);
    }
    
}
