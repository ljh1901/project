package com.ourcommunity.service.admin.impl;

import java.util.List;
import java.util.Map;

import org.apache.commons.collections4.MapUtils;
import org.springframework.stereotype.Service;

import com.ourcommunity.mapper.admin.AdminMapper;
import com.ourcommunity.service.admin.AdminService;
import com.ourcommunity.utils.MaskingUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService{

    private final AdminMapper adminMapper;
    private final MaskingUtils maskingUtils;

    @Override
    public List<Map<String, Object>> userListM0() {
        List<Map<String,Object>> result = adminMapper.userListM0();
        for (Map<String, Object> tmp : result) {
            tmp.put("userName", maskingUtils.maskingCommon(MapUtils.getString(tmp, "userName")));

            String userEmail = maskingUtils.maskingCommon(MapUtils.getString(tmp, "userEmail"));
            if (!userEmail.isEmpty()) {
                tmp.put("userEmail", userEmail);
            }
            
            String prfId = maskingUtils.maskingCommon(MapUtils.getString(tmp, "prfId"));
            if(!prfId.isEmpty()){
                tmp.put("prfId", prfId);
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
    public List<Map<String, Object>> boardCategoryM0() {
        List<Map<String,Object>> result = adminMapper.boardCategoryM0();
        return result;
    }

    @Override
    public int boardCategoryP0(Map<String, Object> params) {
        // TODO Auto-generated method stub
        return 0;
    }
}
