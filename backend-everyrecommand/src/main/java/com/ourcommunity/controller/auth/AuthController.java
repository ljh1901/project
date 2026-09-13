package com.ourcommunity.controller.auth;

import java.nio.charset.StandardCharsets;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.session.SessionAuthenticationStrategy;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.ourcommunity.common.ApiResult;
import com.ourcommunity.service.auth.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final SecurityContextRepository contextRepository;
    private final SessionAuthenticationStrategy sessionStrategy;
    private final AuthService authService;

    public AuthController(AuthenticationManager authenticationManager, SecurityContextRepository contextRepository,
            SessionAuthenticationStrategy sessionStrategy, AuthService authService) {
        this.authenticationManager = authenticationManager;
        this.contextRepository = contextRepository;
        this.sessionStrategy = sessionStrategy;
        this.authService = authService;
    }

    @GetMapping("/csrf")
    public ResponseEntity<Map<String, Object>> getCsrf(CsrfToken token) {
        return ResponseEntity.ok(ApiResult.success(Map.of("headerName", token.getHeaderName(), "token", token.getToken())));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, Object> param,
            HttpServletRequest request, HttpServletResponse response) {
        if (!(param.get("loginId") instanceof String loginId) || loginId.isBlank() || loginId.length() > 50
                || !(param.get("password") instanceof String password) || password.isBlank()
                || password.getBytes(StandardCharsets.UTF_8).length > 72) {
            throw new IllegalArgumentException("Invalid login input");
        }
        Authentication authentication = authenticationManager.authenticate(
                UsernamePasswordAuthenticationToken.unauthenticated(loginId, password));
        Map<String, Object> user = authService.getCurrentUser(authentication.getName());
        sessionStrategy.onAuthentication(authentication, request, response);
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);
        contextRepository.saveContext(context, request, response);
        return ResponseEntity.ok(ApiResult.success(user));
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(Authentication authentication) {
        return ResponseEntity.ok(ApiResult.success(authService.getCurrentUser(authentication.getName())));
    }
}
