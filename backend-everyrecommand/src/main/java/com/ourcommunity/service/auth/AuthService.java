package com.ourcommunity.service.auth;
import java.util.Map;
public interface AuthService {
    // 로그인 아이디에 해당하는 사용자의 공개 정보를 조회합니다.
    Map<String, Object> getCurrentUser(String loginId);
}
