package com.ourcommunity.exception;


public class CommonException extends RuntimeException {
      private final String code;

      public CommonException(String message, String code) {
          super(message);
          this.code = code;
      }

      public String getCode() {
          return code;
      }
  }

