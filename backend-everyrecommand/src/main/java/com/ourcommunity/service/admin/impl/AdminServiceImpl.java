package com.ourcommunity.service.admin.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.collections4.MapUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ourcommunity.mapper.admin.AdminMapper;
import com.ourcommunity.service.admin.AdminService;
import com.ourcommunity.utils.MaskingUtils;
import com.ourcommunity.utils.PagingUtils;

@Service
public class AdminServiceImpl implements AdminService{

    private final AdminMapper adminMapper;
    private final MaskingUtils maskingUtils;
    
    public AdminServiceImpl(AdminMapper adminMapper, MaskingUtils maskingUtils) {
        this.adminMapper = adminMapper;
        this.maskingUtils = maskingUtils;
    }

    @Override
    public List<Map<String, Object>> userListM0() {
        List<Map<String,Object>> result = adminMapper.userListM0();
        for (Map<String, Object> tmp : result) {
            tmp.put("userName", maskingUtils.maskingCommon(MapUtils.getString(tmp, "userName")));

            String userEmail = maskingUtils.maskingCommon(MapUtils.getString(tmp, "userEmil"));
            if (!userEmail.isEmpty()) {
                tmp.put("userEmil", userEmail);
            }
            
            String prfId = maskingUtils.maskingCommon(MapUtils.getString(tmp, "userPrfid"));
            if(!prfId.isEmpty()){
                tmp.put("userPrfid", prfId);
            }
        }
        return result;
    }

    @Override
    public Map<String, Object> userListP0(Map<String, Object> params) {
        
        Map<String,Object> result = adminMapper.userListP0(params);
        return result;
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
}
