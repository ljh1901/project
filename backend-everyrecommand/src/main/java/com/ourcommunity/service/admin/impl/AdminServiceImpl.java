package com.ourcommunity.service.admin.impl;

import java.util.List;
import java.util.Map;

import org.apache.commons.collections4.MapUtils;
import org.springframework.stereotype.Service;

import com.ourcommunity.common.utils.MaskingUtils;
import com.ourcommunity.mapper.admin.AdminMapper;
import com.ourcommunity.service.admin.AdminService;

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
            tmp.put("name", maskingUtils.maskingCommon(MapUtils.getString(tmp, "name")));

            String maskedId = maskingUtils.maskingCommon(MapUtils.getString(tmp, "prfId"));
            if (!maskedId.isEmpty()) {
                tmp.put("prfId", maskedId);
            }
        }
        return result;
    }
}
