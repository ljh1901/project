package com.ourcommunity.controller.common;

import java.util.HashMap;
import java.util.Map;

import org.springframework.core.env.Environment;
import org.springframework.stereotype.Controller;

@Controller
public class CommonController {
    public Map<String, Object> getProfile(Environment env){
        Map<String, Object> params = new HashMap<>();
        params.put("profiles", env);
        return params;
    }
}
