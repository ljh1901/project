package com.ourcommunity.security;

import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.session.ChangeSessionIdAuthenticationStrategy;
import org.springframework.security.web.authentication.session.CompositeSessionAuthenticationStrategy;
import org.springframework.security.web.authentication.session.SessionAuthenticationStrategy;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.csrf.CsrfAuthenticationStrategy;
import org.springframework.security.web.csrf.CsrfTokenRepository;
import org.springframework.security.web.csrf.HttpSessionCsrfTokenRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import com.ourcommunity.common.ApiResult;
import tools.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {
    @Bean
    // 비밀번호 저장과 검증에 사용할 BCrypt 인코더를 등록합니다.
    PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(12); }

    @Bean
    // 사용자 조회와 비밀번호 검증을 수행할 인증 관리자를 등록합니다.
    AuthenticationManager authenticationManager(UserDetailsService userDetailsService, PasswordEncoder encoder) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);
        provider.setPasswordEncoder(encoder);
        return new ProviderManager(provider);
    }

    @Bean
    // 로그인 인증 정보를 HTTP 세션에 보관하도록 설정합니다.
    SecurityContextRepository securityContextRepository() {
        return new HttpSessionSecurityContextRepository();
    }

    @Bean
    // CSRF 토큰을 HTTP 세션에 보관하도록 설정합니다.
    CsrfTokenRepository csrfTokenRepository() { return new HttpSessionCsrfTokenRepository(); }

    @Bean
    // 로그인 성공 시 세션 ID와 CSRF 토큰을 갱신하도록 설정합니다.
    SessionAuthenticationStrategy sessionAuthenticationStrategy(CsrfTokenRepository csrfRepository) {
        // 수동 JSON 로그인도 세션 ID와 CSRF 토큰을 갱신해야 합니다.
        return new CompositeSessionAuthenticationStrategy(List.of(
                new ChangeSessionIdAuthenticationStrategy(), new CsrfAuthenticationStrategy(csrfRepository)));
    }

    @Bean
    // 허용할 프런트 출처와 API 요청의 CORS 규칙을 설정합니다.
    UrlBasedCorsConfigurationSource corsConfigurationSource(Environment environment) {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.stream(environment.getProperty("app.cors.allowed-origins", "")
                .split(",")).map(String::trim).filter(value -> !value.isEmpty()).toList());
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Content-Type", "X-CSRF-TOKEN"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        return source;
    }

    @Bean
    // API 접근 권한, 세션 인증, CSRF 및 로그아웃 규칙을 설정합니다.
    SecurityFilterChain securityFilterChain(HttpSecurity http, SecurityContextRepository repository,
            CsrfTokenRepository csrfRepository, UrlBasedCorsConfigurationSource corsSource,
            ObjectMapper objectMapper) throws Exception {
        http.cors(cors -> cors.configurationSource(corsSource))
                .csrf(csrf -> csrf.disable())
                .securityContext(context -> context.securityContextRepository(repository))
                .requestCache(cache -> cache.disable())
                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable())
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll())
                .exceptionHandling(errors -> errors
                        .authenticationEntryPoint((request, response, exception) ->
                                writeError(response, objectMapper, 401, "로그인이 필요합니다."))
                        .accessDeniedHandler((request, response, exception) ->
                                writeError(response, objectMapper, 403, "접근 권한 또는 보안 토큰을 확인해 주세요.")))
                .logout(logout -> logout.logoutUrl("/api/auth/logout")
                        .invalidateHttpSession(true).clearAuthentication(true).deleteCookies("JSESSIONID")
                        .logoutSuccessHandler((request, response, authentication) -> {
                            response.setContentType("application/json");
                            response.setCharacterEncoding(StandardCharsets.UTF_8.name());
                            objectMapper.writeValue(response.getWriter(), ApiResult.success(java.util.Map.of()));
                        }));
        return http.build();
    }

    // 보안 필터에서 발생한 오류를 공통 JSON 응답으로 전송합니다.
    private static void writeError(HttpServletResponse response, ObjectMapper mapper,
            int status, String message) throws java.io.IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        mapper.writeValue(response.getWriter(), ApiResult.error(message));
    }
}
