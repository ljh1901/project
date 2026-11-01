package com.ourcommunity.mapper.board;

import java.util.List;
import java.util.Map;
import org.apache.ibatis.annotations.Param;

public interface Board0002Mapper {
    public List<Map<String,Object>> boardCategoryM0(Map<String, Object> params);
    public int boardCategoryP0(Map<String,Object> params);
    int boardCategoryP1(@Param("params") List<Map<String, Object>> params);
    public int boardCategoryM0Cnt(Map<String, Object> params);
    public List<Map<String,Object>> boardCategoryNames();
}
