package com.ourcommunity.mapper.auth;
import java.util.Map;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface Auth0001Mapper {
    // 로그인 아이디로 사용자 인증 정보를 데이터베이스에서 조회합니다.
    Map<String, Object> findUserByLoginId(@Param("loginId") String loginId);
}
