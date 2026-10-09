package com.ourcommunity.common.variable;

import lombok.Getter;

/**
 * Status
 * 상태 값  설정 클래스
 * 
 * 
 *  
 */
@Getter
public enum Status {
   COMPLETE("E200","SUCCESS"),
   INCOMPLETE("E900","FAIL");

   private final String codeValue;
   private final String codeStatus;
   
   Status(String codeValue, String codeStatus){
        this.codeValue = codeValue;
        this.codeStatus = codeStatus;
   }

}
