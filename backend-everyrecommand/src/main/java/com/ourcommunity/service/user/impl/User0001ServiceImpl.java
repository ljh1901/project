package com.ourcommunity.service.user.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.collections4.MapUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ourcommunity.mapper.user.User0001Mapper;
import com.ourcommunity.service.user.User0001Service;
import com.ourcommunity.utils.MaskingUtils;
import com.ourcommunity.utils.PagingUtils;

@Service
public class User0001ServiceImpl implements User0001Service {
    private final User0001Mapper adminMapper;
    private final MaskingUtils maskingUtils;

    public User0001ServiceImpl(User0001Mapper adminMapper, MaskingUtils maskingUtils) {
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

}
