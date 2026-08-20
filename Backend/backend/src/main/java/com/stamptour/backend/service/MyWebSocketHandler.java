package com.stamptour.backend.service;

import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.stereotype.Component;

@Component
public class MyWebSocketHandler extends TextWebSocketHandler {

    private WebSocketSession browserSession;
    private WebSocketSession pythonSession;

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();

        if (payload.contains("\"score\"") || payload.contains("\"status\"") || payload.contains("\"type\":\"init\"")) {
            this.pythonSession = session; 

            if (browserSession != null && browserSession.isOpen()) {
                browserSession.sendMessage(new TextMessage(payload));
            }
        } 
        else if (payload.contains("image") || payload.startsWith("data:image")) {
            this.browserSession = session; 

            if (pythonSession != null && pythonSession.isOpen()) {
                pythonSession.sendMessage(new TextMessage(payload));
            } else {
                System.out.println("대기 중: 파이썬 서버가 아직 연결되지 않았습니다.");
            }
        }
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        System.out.println("웹소켓 연결 성공: " + session.getId());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, org.springframework.web.socket.CloseStatus status) {
        if (session == browserSession) {
            System.out.println("브라우저 연결 종료");
            browserSession = null;
        }
        if (session == pythonSession) {
            System.out.println("파이썬 연결 종료");
            pythonSession = null;
        }
    }
}