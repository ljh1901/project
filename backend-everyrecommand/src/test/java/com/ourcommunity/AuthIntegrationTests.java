package com.ourcommunity;

import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import com.ourcommunity.mapper.AuthMapper;
import tools.jackson.databind.ObjectMapper;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = {
    "spring.autoconfigure.exclude=org.springframework.boot.jdbc.autoconfigure.DataSourceAutoConfiguration",
    "app.cors.allowed-origins=https://frontend.example",
    "spring.profiles.active=test"
})
@AutoConfigureMockMvc
@org.springframework.context.annotation.Import(AuthIntegrationTests.PermissionTestConfig.class)
class AuthIntegrationTests {
    private static final String PASSWORD = "test-password-only";
    private static final String HASH = new BCryptPasswordEncoder(4).encode(PASSWORD);
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper json;
    @MockitoBean AuthMapper authMapper;

    @BeforeEach
    void setUp() {
        when(authMapper.findUserByLoginId("tester")).thenReturn(Map.of(
                "userId", 1L, "loginId", "tester", "passwordHash", HASH,
                "displayName", "테스터", "role", "ROLE_USER", "isActive", true));
    }

    @Test
    void configExposesOnlyPublicSettings() throws Exception {
        mvc.perform(get("/api/config")).andExpect(status().isOk())
                .andExpect(jsonPath("$.data.appName").value("모두의 추천"))
                .andExpect(jsonPath("$.data.profile").value("test"))
                .andExpect(jsonPath("$.data.password").doesNotExist())
                .andExpect(jsonPath("$.data").value(org.hamcrest.Matchers.aMapWithSize(4)));
    }

    @Test
    void unauthenticatedRequestReturnsJson401() throws Exception {
        mvc.perform(get("/api/auth/me")).andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void loginRequiresCsrf() throws Exception {
        mvc.perform(post("/api/auth/login").contentType("application/json")
                .content(loginBody(PASSWORD))).andExpect(status().isForbidden());
        verifyNoInteractions(authMapper);
    }

    @Test
    void loginPersistsSessionRotatesIdAndSupportsLogout() throws Exception {
        MvcResult tokenResponse = mvc.perform(get("/api/auth/csrf")).andExpect(status().isOk()).andReturn();
        MockHttpSession session = (MockHttpSession) tokenResponse.getRequest().getSession(false);
        String previousId = session.getId();
        String previousToken = json.readTree(tokenResponse.getResponse().getContentAsString()).at("/data/token").asText();
        mvc.perform(post("/api/auth/login").session(session).header("X-CSRF-TOKEN", previousToken)
                .contentType("application/json").content(loginBody(PASSWORD)))
                .andExpect(status().isOk()).andExpect(jsonPath("$.data.loginId").value("tester"))
                .andExpect(jsonPath("$.data.passwordHash").doesNotExist());
        assertThat(session.getId()).isNotEqualTo(previousId);
        mvc.perform(get("/api/auth/me").session(session)).andExpect(status().isOk())
                .andExpect(jsonPath("$.data.displayName").value("테스터"));
        mvc.perform(post("/api/auth/logout").session(session).header("X-CSRF-TOKEN", previousToken))
                .andExpect(status().isForbidden());
        mvc.perform(post("/api/auth/logout").session(session)).andExpect(status().isForbidden());
        MvcResult newTokenResponse = mvc.perform(get("/api/auth/csrf").session(session)).andReturn();
        String newToken = json.readTree(newTokenResponse.getResponse().getContentAsString()).at("/data/token").asText();
        mvc.perform(post("/api/auth/logout").session(session).header("X-CSRF-TOKEN", newToken))
                .andExpect(status().isOk()).andExpect(jsonPath("$.success").value(true));
        assertThat(session.isInvalid()).isTrue();
        mvc.perform(get("/api/auth/me")).andExpect(status().isUnauthorized());
    }

    @Test
    void wrongPasswordAndUnknownUserReturnSameMessage() throws Exception {
        String wrongPassword = mvc.perform(post("/api/auth/login").with(csrf()).contentType("application/json")
                .content(loginBody("wrong"))).andExpect(status().isUnauthorized())
                .andReturn().getResponse().getContentAsString();
        String unknownUser = mvc.perform(post("/api/auth/login").with(csrf()).contentType("application/json")
                .content("{\"loginId\":\"unknown\",\"password\":\"wrong\"}"))
                .andExpect(status().isUnauthorized()).andReturn().getResponse().getContentAsString();
        assertThat(wrongPassword).isEqualTo(unknownUser);
    }

    @Test
    void disabledAccountCannotLogin() throws Exception {
        when(authMapper.findUserByLoginId("disabled")).thenReturn(Map.of(
                "loginId", "disabled", "passwordHash", HASH, "role", "ROLE_USER", "isActive", false));
        mvc.perform(post("/api/auth/login").with(csrf()).contentType("application/json")
                .content("{\"loginId\":\"disabled\",\"password\":\"test-password-only\"}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void invalidInputsReturn400WithoutDatabaseAccess() throws Exception {
        for (String body : new String[]{"{}", "null", "{", "{\"loginId\":42,\"password\":\"x\"}",
                "{\"loginId\":\" \",\"password\":\"x\"}",
                json.writeValueAsString(Map.of("loginId", "tester", "password", "가".repeat(25))),
                json.writeValueAsString(Map.of("loginId", "x".repeat(51), "password", "x"))}) {
            mvc.perform(post("/api/auth/login").with(csrf()).contentType("application/json")
                    .content(body)).andExpect(status().isBadRequest());
        }
        verifyNoInteractions(authMapper);
    }

    @Test
    void allowedOriginSupportsCredentialsAndUnknownOriginIsRejected() throws Exception {
        mvc.perform(options("/api/auth/login").header("Origin", "https://frontend.example")
                .header("Access-Control-Request-Method", "POST")
                .header("Access-Control-Request-Headers", "content-type,x-csrf-token"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "https://frontend.example"))
                .andExpect(header().string("Access-Control-Allow-Credentials", "true"));
        mvc.perform(options("/api/auth/login").header("Origin", "https://unknown.example")
                .header("Access-Control-Request-Method", "POST")).andExpect(status().isForbidden());
    }

    @Test
    void databaseFailureDoesNotExposeDetails() throws Exception {
        when(authMapper.findUserByLoginId("tester"))
                .thenThrow(new org.springframework.dao.DataAccessResourceFailureException("private connection details"));
        mvc.perform(post("/api/auth/login").with(csrf()).contentType("application/json")
                .content(loginBody(PASSWORD)))
                .andExpect(status().is5xxServerError())
                .andExpect(content().string(org.hamcrest.Matchers.not(org.hamcrest.Matchers.containsString("private connection"))));
    }


    @Autowired PermissionProbe permissions;

    @Test
    @org.springframework.security.test.context.support.WithMockUser(roles = "USER")
    void userCannotCallAdminMethod() {
        org.assertj.core.api.Assertions.assertThatThrownBy(() -> permissions.adminOnly())
                .isInstanceOf(org.springframework.security.access.AccessDeniedException.class);
    }

    @Test
    @org.springframework.security.test.context.support.WithMockUser(roles = "ADMIN")
    void adminCanCallAdminMethod() {
        assertThat(permissions.adminOnly()).isEqualTo("allowed");
    }

    @org.springframework.boot.test.context.TestConfiguration
    static class PermissionTestConfig {
        @org.springframework.context.annotation.Bean
        PermissionProbe permissions() { return new PermissionProbe(); }
    }

    static class PermissionProbe {
        @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
        public String adminOnly() { return "allowed"; }
    }

    private String loginBody(String password) {
        return json.writeValueAsString(Map.of("loginId", "tester", "password", password));
    }
}
