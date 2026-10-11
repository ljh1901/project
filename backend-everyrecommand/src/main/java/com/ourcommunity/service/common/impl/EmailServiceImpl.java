package com.ourcommunity.service.common.impl;

import java.util.Map;

import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.encrypt.TextEncryptor;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import com.ourcommunity.common.VO.EmailSend;
import com.ourcommunity.exception.CommonException;
import com.ourcommunity.service.common.EmailService;


import jakarta.mail.internet.MimeMessage;
import tools.jackson.databind.deser.ContextualKeyDeserializer;

@Service 
public class EmailServiceImpl implements EmailService{

    @Value ("${email.channel.code}")
    private String CHANNEL_CODE;

    public static final Logger log = LogManager.getLogger(EmailService.class);
    // 이메일 전송
    // JavaMailSender 이용
    private final JavaMailSender javaMailSender;
    private final SpringTemplateEngine templateEngine;
    private TextEncryptor textEncryptor;

    public EmailServiceImpl(JavaMailSender javaMailSender, SpringTemplateEngine templateEngine){
        this.javaMailSender = javaMailSender;
        this.templateEngine = templateEngine;
    }

    @Override
    public void emailSender(Map<String, Object> params) {
        if(!"01".equals(CHANNEL_CODE)){
            throw new CommonException("E900","채널코드가 올바르지 않습니다.");
        }   
        else{
            if(EmailSend.TEMPLATE.equals(MapUtils.getString(params, "sendKind"))){
                sendEmailWithTemplate(params);
            }
            if(EmailSend.TEXTEMAIL.equals(MapUtils.getString(params, "sendKind"))){
                sendEmailText(params);
            }
        }
    }
    // 1. HTML Template 전송
    private void sendEmailWithTemplate(Map<String, Object> params){
        /**
         * 
         * 
         * 
         */
        // 1. 전달할 데이터 저장 객체
        Context context = new Context();
        // 2. 변수 값 세팅
        context.setVariables(params);
        // 2. HTML 템플릿 렌더링
        String template = templateEngine.process("emailForm.html",context);


        // template 전송 시 이용
        MimeMessage html = javaMailSender.createMimeMessage();
        try {
            // 1. html 본문, 파일 여부, 인코딩
            MimeMessageHelper helper = new MimeMessageHelper(html, false, "UTF-8");
            // 1-1. 발신자 설정
            helper.setFrom("everyrecommand@ourcommunity.com");
            // 1-2. 수신자 설정
            textEncryptor.decrypt(MapUtils.getString(params, "userEmail"));
            helper.setTo(textEncryptor.decrypt(MapUtils.getString(params, "userEmail")));
            // 1-3. 제목 설정
            helper.setSubject(String.valueOf(params.get("subject")));
            // 1-4. 내용 설정 => false로 하면 SimpleMailMessage와 같은 역할
            helper.setText(template, true);
            javaMailSender.send(html);
        } catch (Exception e) {
            log.error(e.getStackTrace());
            throw new CommonException("E999", e.getMessage());
        }
    }

    // 2. Text 전송
    private void sendEmailText(Map<String, Object> params){
        // text 전송 시 이용
        SimpleMailMessage msg = new SimpleMailMessage();
        try {
            msg.setFrom(CHANNEL_CODE);
            msg.setTo(String.valueOf(params.get("userEmail")));
            msg.setSubject(CHANNEL_CODE);
            msg.setText("완료");
            javaMailSender.send(msg);
        } catch (Exception e) {
            log.error(e.getStackTrace());
            throw new CommonException("E999", e.getMessage());
        }
    }

}
