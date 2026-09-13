package com.ourcommunity.service.auth;
import java.util.Map;
public interface AuthService {
    Map<String, Object> getCurrentUser(String loginId);
}
