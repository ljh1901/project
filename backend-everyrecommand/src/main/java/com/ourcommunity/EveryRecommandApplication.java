package com.ourcommunity;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.ourcommunity.common.security.SecurityEncryptor;
/**
 * 기본 SpringBoot 진입점
 * 
 * MapperScan("package") 
 * Mapper.class Path를 읽기 위한 경로
 * Spring의 Bean 읽기 / Component / AutoScan 역할
 */
@SpringBootApplication
@MapperScan("com.ourcommunity.mapper")
public class EveryRecommandApplication {
    public static void main(String[] args) {
        SpringApplication.run(EveryRecommandApplication.class, args);
    }
}
