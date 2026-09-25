package com.ourcommunity;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.ourcommunity.mapper")
public class EveryRecommandApplication {
    // Spring Boot 백엔드 애플리케이션을 시작합니다.
    public static void main(String[] args) {
        SpringApplication.run(EveryRecommandApplication.class, args);
    }
}
