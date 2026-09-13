package com.ourcommunity.mapper;
import java.util.Map;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface AuthMapper {
    Map<String, Object> findUserByLoginId(@Param("loginId") String loginId);
}
