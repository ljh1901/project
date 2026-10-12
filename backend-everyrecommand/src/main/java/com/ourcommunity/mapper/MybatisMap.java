package com.ourcommunity.mapper;

import java.security.Timestamp;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.HashMap;

import com.ourcommunity.exception.CommonException;
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

    // 시간 format 함수
    public Object getTime(Object getTime, String type){
        if(type==null){
            type="LocalDateTime";
        }

        if(getTime == null){
            throw new CommonException("E900","Time 값이 아닙니다.");
        }
        if(getTime instanceof java.sql.Timestamp){
            getTime = ((java.sql.Timestamp)getTime).toLocalDateTime();
        }
        // KST, UTC
        // +9:00
        switch (type) {
            case "STANDARD":{
                DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd hh:mm:ss");
                return dtf.format((LocalDateTime)getTime);
            }
            case "MILLISS":{
                DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd hh:mm:ss:SSS");
                return dtf.format((LocalDateTime)getTime);
            }
            case "KST":{
                DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss z");
                return ((LocalDateTime) getTime).atZone(ZoneId.of("Asia/Seoul")).format(dtf);
            }
            
            case "UTC":{
                DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss z");
                return ((LocalDateTime) getTime).atZone(ZoneId.of("UTC")).format(dtf);
            }
        }
        return getTime;
    }

    private boolean returnKeyCondition(String key){
        // key값이 없을 경우
        if (key == null || key.isEmpty()){
            return false;
        }

        // camelCase인 경우
        if(!key.contains("-")&&!key.contains("_")){
            return false;
        }

        // kebab-case, snake_case인 경우
        return true;
    }

    // 변환
    private String toCamelCase(String key) {
        StringBuilder result = new StringBuilder();
        boolean nextUpper = false;

        for (char c : key.toCharArray()) {
            if (c == '_' || c == '-') {
                nextUpper = true;
                continue;
            } 
            result.append(nextUpper?Character.toUpperCase(c):Character.toLowerCase(c));
            nextUpper = false;
        }
        return result.toString();
    }
}
