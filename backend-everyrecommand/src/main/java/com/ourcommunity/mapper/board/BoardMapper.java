package com.ourcommunity.mapper.board;

import java.util.List;
import java.util.Map;

public interface BoardMapper {
    public List<Map<String,Object>> boardListM0(Map<String,Object> params);
    public int boardListM0Count(Map<String,Object> params);
}
