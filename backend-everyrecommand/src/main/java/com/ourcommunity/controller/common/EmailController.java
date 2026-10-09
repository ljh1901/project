package com.ourcommunity.controller.common;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

/**
 * @EmailController
 * Email 발송 컨트롤러
 * 프론트 요청 => /api/email/send 호출 => JavaMailSender 사용 => SMTP 발송 => 이메일
 *  
 */
@Controller 
@RequestMapping("/api/email")
public class EmailController {
    @PostMapping("/send")
    public String postMethodName(@RequestBody String entity) {
        //TODO: process POST request
        
        return entity;
    }
    
}
