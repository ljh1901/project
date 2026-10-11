package com.ourcommunity.mapper;

import java.util.HashMap;
/**
 * MybatisMap
 * @param <V> => Object로 받는 Value
 * 
 * DTO로 받은 경우 객체 명을 맵핑
 * mybatis.configuration.map-underscore-to-camel-case=true
 * 
 * Map으로 받을 경우 이름 snake_case DB 컬럼명
 * @Alias("클래스이름") == mybatis.type-aliases-package=패키지명
 * 
 */
// @Alias("MybatisMap")
public class MybatisMap<K, V> extends HashMap<String, V> {

    @Override
    public V put(String key, V value) {
        if(returnKeyCondition(key)){
            key = toCamelCase(key);
        }
        return super.put(key, value);
    }

    private boolean returnKeyCondition(String key){
        // key값이 없을 경우
        if (key == null || key.isEmpty()){
            return false;
        }
        // 이미 camelCase 또는 kebabCase인 경우
        if((key.indexOf('_') < 0 && key.indexOf('-') < 0)){
            return false;
        }
        return true;
    }
    // 변환
    private String toCamelCase(String key) {
        StringBuilder result = new StringBuilder();
        boolean nextUpper = false;

        for (char c : key.toCharArray()) {
            if (c == '_' || c == '-') {
                nextUpper = true;
            } else {
                result.append(nextUpper?Character.toUpperCase(c)
                                       :Character.toLowerCase(c));
                nextUpper = false;
            }
        }
        return result.toString();
    }
}
