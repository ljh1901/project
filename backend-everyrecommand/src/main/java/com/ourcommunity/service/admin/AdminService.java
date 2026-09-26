package com.ourcommunity.service.admin;

import java.util.List;
import java.util.Map;

public interface AdminService {
    
    List<Map<String,Object>> userListM0();
    Map<String,Object> userListP0(Map<String, Object> params);

    List<Map<String,Object>> boardCategoryM0();
    int boardCategoryP0(Map<String,Object> params);
}
