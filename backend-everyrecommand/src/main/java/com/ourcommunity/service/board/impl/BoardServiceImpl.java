package com.ourcommunity.service.board.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.collections4.MapUtils;
import org.springframework.stereotype.Service;

import com.ourcommunity.mapper.board.BoardMapper;
import com.ourcommunity.service.board.BoardService;
import com.ourcommunity.utils.PagingUtils;

import jakarta.servlet.http.HttpServletRequest;
@Service 
public class BoardServiceImpl implements BoardService{
    private final BoardMapper boardMapper;
    
    public BoardServiceImpl(BoardMapper boardMapper){
        this.boardMapper = boardMapper;
    }

    @Override
    public int boardListM0Count(Map<String, Object> params) {
        int result = boardMapper.boardListM0Count(params);
        return result;
    }

    @Override
    public Map<String, Object> boardListM0(Map<String, Object> params) {
        Map<String,Object> result = new HashMap<>();
        List<Map<String, Object>> resultList = boardMapper.boardListM0(params);
        result.put("list", resultList);
        result.put("paging", PagingUtils.pagingAlgorithm("/api/boards//boardListM0",
                                                             params,                                                             
                                                             boardListM0Count(params), 
                                                             5, 
                                                             MapUtils.getInteger(params, "listCount",5), 
                                                             MapUtils.getIntValue(params, "currentPage",1))
                                                            );
        return result;
    }
}
