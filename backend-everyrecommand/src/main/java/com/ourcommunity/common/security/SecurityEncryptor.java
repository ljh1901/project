package com.ourcommunity.common.security;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.HexFormat;

public class SecurityEncryptor {
    public void securityEncryptor() {
        SecureRandom secureRandom = new SecureRandom();
        // 1. DB 저장용 Password 값 생성
        byte[] randomBytes = new byte[32];
        secureRandom.nextBytes(randomBytes);
        String password = Base64.getEncoder().encodeToString(randomBytes);

        // 2. salt 값 생성 => 최소 8 ~ 16바이트 난수 16진수 값
        byte[] randomSalt = new byte[16];
        secureRandom.nextBytes(randomSalt);
        String salt = HexFormat.of().formatHex(randomSalt);
    }
}
