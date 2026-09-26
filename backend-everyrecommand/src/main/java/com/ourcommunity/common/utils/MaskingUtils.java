package com.ourcommunity.common.utils;


import java.util.Iterator;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component 
public class MaskingUtils {
    // @Value static X
    @Value("${pattern.email}")
    private String EMAIL_PATTERN;
    @Value("${pattern.phone}")
    private String PHONE_PATTERN;
    @Value("${pattern.name}")
    private String NAME_PATTERN;

    public  String maskingCommon(String params) {
        if (StringUtils.isBlank(params)) return "";
        // 1. pattern 저장
        Map<String, Object> patternChk = Map.of("EMAIL_PATTERN", EMAIL_PATTERN,
                "PHONE_PATTERN", PHONE_PATTERN,
                "NAME_PATTERN", NAME_PATTERN);
        Iterator tmpIt = patternChk.keySet().iterator();
        // 2. pattern 검사
        while (tmpIt.hasNext()) {
            String key = (String) tmpIt.next();
            if (params.matches(String.valueOf(patternChk.get(key)))) {
                // 1. 이메일 마스킹
                if (key.equals("EMAIL_PATTERN")) {
                    String[] temp = params.split("@", 2);
                    if (temp[0].length() > 3) {
                        temp[0] = temp[0].substring(0, 3)
                                + "*".repeat(temp[0].substring(3).length());
                        params = temp[0] + "@" + temp[1];
                    }
                } // end of email_pattern

                // 2. 이름 마스킹
                if (params.matches(String.valueOf(patternChk.get(key)))) {
                    if (key.equals("NAME_PATTERN")) {
                        switch (params.length()) {
                            case 2: {
                                params = params.substring(0, 1) + "*";
                                break;
                            }
                            case 3: {
                                params = params.substring(0, 1) + "*" + params.substring(2);
                                break;
                            }
                            case 4: {
                                params = params.substring(0, 1) + "**" + params.substring(3);
                                break;
                            }
                        }
                    }
                } // end of name_pattern

                // 3. 폰번호 마스킹
                if(params.matches(String.valueOf(patternChk.get(key)))){
                    if(key.equals("PHONE_PATTERN")){
                        // 하이픈('-') 제거
                        params.replaceAll("-", "");
                        params = params.substring(0,2)+"*".repeat(4)+params.substring(7);
                    }
                }
                // 4. 아이디 마스킹
                // if(params.matches(String.valueOf(patternChk.get(key)))){
                //     if(key.equals("ID_PATTERN")){
                //         // 하이픈('-') 제거
                //         params.replaceAll("-", "");
                //         params = params.substring(0,2)+"*".repeat(4)+params.substring(7);
                //     }
                // }
            }
        } // end of while
        System.out.println(params);
        return params;
    } // end of maskingCommon
}
