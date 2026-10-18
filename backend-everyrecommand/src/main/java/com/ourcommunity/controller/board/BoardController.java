package com.ourcommunity.controller.board;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ourcommunity.service.board.BoardService;

@RestController
@RequestMapping("/api/boards")
public class BoardController {
    private final BoardService boardSerivce;
    public BoardController(BoardService boardSerivce){
        this.boardSerivce = boardSerivce;
    }

    @GetMapping("/boardListM0")
    public ResponseEntity<Map<String,Object>> boardListM0(Map<String,Object> params){
        Map<String,Object> result = boardSerivce.boardListM0(params);
        return ResponseEntity.ok(result);
    }
}
