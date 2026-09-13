package com.ourcommunity.security;

import java.io.Console;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public final class PasswordHashTool {
    private PasswordHashTool() {}
    public static void main(String[] args) {
        Console console = System.console();
        if (console == null) {
            throw new IllegalStateException("터미널에서 java -cp <runtime classpath> com.ourcommunity.security.PasswordHashTool을 실행하세요.");
        }
        char[] password = console.readPassword("Password: ");
        if (password == null) throw new IllegalArgumentException("비밀번호 입력이 필요합니다.");
        try {
            String value = new String(password);
            if (value.isBlank() || value.getBytes(StandardCharsets.UTF_8).length > 72) {
                throw new IllegalArgumentException("비밀번호는 비어 있지 않은 UTF-8 72바이트 이하여야 합니다.");
            }
            console.printf("%s%n", new BCryptPasswordEncoder(12).encode(value));
        } finally {
            Arrays.fill(password, '\0');
        }
    }
}
