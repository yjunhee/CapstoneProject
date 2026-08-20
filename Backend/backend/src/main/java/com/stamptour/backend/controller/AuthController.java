package com.stamptour.backend.controller;

import com.stamptour.backend.entity.User;
import com.stamptour.backend.service.AuthService;
import com.stamptour.backend.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtTokenProvider jwtTokenProvider;

    // POST /api/auth/kakao
    @PostMapping("/kakao")
    public ResponseEntity<Map<String, Object>> kakaoLogin(@RequestBody Map<String, String> body) {
        try {
            User user = authService.kakaoLogin(body.get("code"));
            return createSuccessResponse("카카오 로그인 성공", user);
        } catch (Exception e) {
            e.printStackTrace();
            return createErrorResponse("카카오 서버 통신 실패");
        }
    }

    // POST /api/auth/naver
    @PostMapping("/naver")
    public ResponseEntity<Map<String, Object>> naverLogin(@RequestBody Map<String, String> body) {
        try {
            User user = authService.naverLogin(body.get("code"), body.get("state"));
            return createSuccessResponse("네이버 로그인 성공", user);
        } catch (Exception e) {
            e.printStackTrace();
            return createErrorResponse("네이버 서버 통신 실패");
        }
    }

    // POST /api/auth/google
    @PostMapping("/google")
    public ResponseEntity<Map<String, Object>> googleLogin(@RequestBody Map<String, String> body) {
        try {
            User user = authService.googleLogin(body.get("code"));
            return createSuccessResponse("구글 로그인 성공", user);
        } catch (Exception e) {
            e.printStackTrace();
            return createErrorResponse("구글 서버 통신 실패");
        }
    }

    // jwt 이용 반환 로직
    private ResponseEntity<Map<String, Object>> createSuccessResponse(String message, User user) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", message);
        response.put("user", user);
        
        String jwtToken = jwtTokenProvider.createToken(user.getId());
        response.put("token", jwtToken);
        
        return ResponseEntity.ok(response);
    }

    private ResponseEntity<Map<String, Object>> createErrorResponse(String errorMsg) {
        Map<String, Object> response = new HashMap<>();
        response.put("error", errorMsg);
        return ResponseEntity.status(500).body(response);
    }
}