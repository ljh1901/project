package com.ourcommunity.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

import com.ourcommunity.common.handler.chat.Chat0001Handler;

import lombok.RequiredArgsConstructor;

@Configuration 
@EnableWebSocket
@RequiredArgsConstructor 
public class WebSocketConfig implements WebSocketConfigurer{
    private final Chat0001Handler webSocketHandler;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(webSocketHandler, "/ws/*").setAllowedOrigins("http://127.0.0.1:5446");
    }
}
