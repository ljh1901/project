package com.ourcommunity.service.auth.impl;

import java.util.Map;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.ourcommunity.mapper.AuthMapper;
import com.ourcommunity.service.auth.AuthService;

@Service
public class AuthServiceImpl implements AuthService, UserDetailsService {
    private final AuthMapper authMapper;
    public AuthServiceImpl(AuthMapper authMapper) { this.authMapper = authMapper; }
    @Override
    public UserDetails loadUserByUsername(String loginId) {
        Map<String, Object> user = authMapper.findUserByLoginId(loginId);
        if (user == null || user.isEmpty()) throw new UsernameNotFoundException("Invalid credentials");
        return User.withUsername((String) user.get("loginId"))
                .password((String) user.get("passwordHash"))
                .authorities((String) user.get("role"))
                .disabled(!Boolean.TRUE.equals(user.get("isActive"))).build();
    }
    @Override
    public Map<String, Object> getCurrentUser(String loginId) {
        Map<String, Object> user = authMapper.findUserByLoginId(loginId);
        if (user == null || !Boolean.TRUE.equals(user.get("isActive"))) {
            throw new BadCredentialsException("Invalid credentials");
        }
        return Map.of("userId", user.get("userId"), "loginId", user.get("loginId"),
                "displayName", user.get("displayName"), "role", user.get("role"));
    }
}
