package com.ourcommunity.service.board.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.collections4.MapUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ourcommunity.mapper.board.Board0002Mapper;
import com.ourcommunity.service.board.Board0002Service;
import com.ourcommunity.utils.MaskingUtils;
import com.ourcommunity.utils.PagingUtils;

@Service
public class Board0002ServiceImpl implements Board0002Service {
    private final Board0002Mapper adminMapper;

    public Board0002ServiceImpl(Board0002Mapper adminMapper) {
        this.adminMapper = adminMapper;
    }

    @Override
    public Map<String, Object> boardCategoryM0(Map<String, Object> params) {
        int totalCount = adminMapper.boardCategoryM0Cnt(params);
        Map<String, Object> searchParams = new HashMap<>();
        for (String key : List.of("useYn", "brdCtidNm", "brdFrrgTs")) {
            if (params.get(key) != null) {
                searchParams.put(key, params.get(key));
            }
        }
        Map<String, Object> paging = PagingUtils.pagingAlgorithm("/admin/board-categories", searchParams, totalCount, 5,
                        MapUtils.getIntValue(params, "listCount"), 
                        MapUtils.getIntValue(params, "currentPage"));
        params.putAll(paging);
        return Map.of("list", adminMapper.boardCategoryM0(params), 
                      "paging", paging);
    }

    @Override
    public int boardCategoryP0(Map<String, Object> params) {
        int result = adminMapper.boardCategoryP0(params);
        return result;
    }

    @Override
    @Transactional
    public int boardCategoryP1(List<Map<String, Object>> params) {
        return adminMapper.boardCategoryP1(params);
    }
    @Override
    public int boardCategoryM0Cnt(Map<String, Object> params) {
        int totalCnt =  adminMapper.boardCategoryM0Cnt(params);
        return totalCnt;
    }

    @Override
    public List<Map<String, Object>> boardCategoryM0() {
        List<Map<String,Object>> result = adminMapper.boardCategoryNames();
        return result;
    }
}
