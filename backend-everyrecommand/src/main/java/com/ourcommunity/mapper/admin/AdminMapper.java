package com.ourcommunity.mapper.admin;

import java.util.List;
import java.util.Map;
import org.apache.ibatis.annotations.Param;

public interface AdminMapper {
    public List<Map<String, Object>> userListM0();
    public Map<String,Object> userListP0(Map<String, Object> params);
    public List<Map<String,Object>> boardCategoryM0();
    public int boardCategoryP0(Map<String,Object> params);
     int boardCategoryP1(@Param("params") List<Map<String, Object>> params);
}
