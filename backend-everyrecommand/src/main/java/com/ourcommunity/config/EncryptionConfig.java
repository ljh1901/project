package com.ourcommunity.config;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.encrypt.AesGcmBytesEncryptor;
import org.springframework.security.crypto.encrypt.BytesEncryptor;
import org.springframework.security.crypto.encrypt.TextEncryptor;

@Configuration 
public class EncryptionConfig{

    @Bean 
    public TextEncryptor textEncryptor(@Value("${app.encryption.password}")String password, 
                                       @Value("${app.encryption.salt}")String salt){
        BytesEncryptor bytesEncryptor = AesGcmBytesEncryptor.withPassword(password, salt)
                                                            .build();
        return new TextEncryptor() {
            // 1. 암호화
            @Override
            public String encrypt(String text) {
                byte[] encrypted = bytesEncryptor.encrypt(text.getBytes(StandardCharsets.UTF_8));
                return Base64.getEncoder().encodeToString(encrypted);
            }

            // 2. 복호화
            @Override
            public String decrypt(String encryptedText) {
                byte[] decrypted = Base64.getDecoder().decode(encryptedText);
                String decryptText = new String(bytesEncryptor.decrypt(decrypted),StandardCharsets.UTF_8);
                return decryptText;
            }
        };
    }
}