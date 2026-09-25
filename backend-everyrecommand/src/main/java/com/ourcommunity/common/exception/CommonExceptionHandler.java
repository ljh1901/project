package com.ourcommunity.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class CommonExceptionHandler {

    @ExceptionHandler(CommonException.class)
    public ResponseEntity<String> handleCommonException(CommonException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        .body("[" + e.getCode() + "] " + e.getMessage());
    }
}
