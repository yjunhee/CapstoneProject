package com.stamptour.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.stamptour.backend.entity.User;
import com.stamptour.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    // 카카오 로그인
    public User kakaoLogin(String code) throws Exception {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", "f03731266c0fae4f844f404a0ffc1e10");
        params.add("redirect_uri", "http://localhost:5173/kakaologin");
        params.add("code", code);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

        ResponseEntity<String> tokenResponse = restTemplate.postForEntity("https://kauth.kakao.com/oauth/token", request, String.class);
        JsonNode tokenNode = objectMapper.readTree(tokenResponse.getBody());
        String accessToken = tokenNode.get("access_token").asText();

        // 유저 정보 조회
        HttpHeaders userHeaders = new HttpHeaders();
        userHeaders.setBearerAuth(accessToken);
        userHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        HttpEntity<Void> userRequest = new HttpEntity<>(userHeaders);

        ResponseEntity<String> userResponse = restTemplate.exchange("https://kapi.kakao.com/v2/user/me", HttpMethod.GET, userRequest, String.class);
        JsonNode kakaoData = objectMapper.readTree(userResponse.getBody());

        // 데이터 추출
        String id = "kakao_" + kakaoData.get("id").asText();
        String name = kakaoData.path("kakao_account").path("profile").path("nickname").asText("카카오유저");
        String email = kakaoData.path("kakao_account").path("email").asText("이메일없음");
        String avatar = kakaoData.path("kakao_account").path("profile").path("profile_image_url").asText("https://via.placeholder.com/150");

        // DB에 저장/업데이트
        return saveOrUpdateUser(id, name, email, avatar, "kakao");
    }

    // 네이버
    public User naverLogin(String code, String state) throws Exception {
        String tokenUrl = String.format("https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=%s&client_secret=%s&code=%s&state=%s",
                "OU5On9cK56h1zUDeUaAe", "h5WeC06E1q", code, state);

        ResponseEntity<String> tokenResponse = restTemplate.getForEntity(tokenUrl, String.class);
        JsonNode tokenNode = objectMapper.readTree(tokenResponse.getBody());
        String accessToken = tokenNode.get("access_token").asText();

        HttpHeaders userHeaders = new HttpHeaders();
        userHeaders.setBearerAuth(accessToken);
        HttpEntity<Void> userRequest = new HttpEntity<>(userHeaders);

        ResponseEntity<String> userResponse = restTemplate.exchange("https://openapi.naver.com/v1/nid/me", HttpMethod.GET, userRequest, String.class);
        JsonNode naverData = objectMapper.readTree(userResponse.getBody()).path("response");

        String id = "naver_" + naverData.path("id").asText();
        String name = naverData.path("name").asText(naverData.path("nickname").asText("네이버유저"));
        String email = naverData.path("email").asText("이메일없음");
        String avatar = naverData.path("profile_image").asText("https://via.placeholder.com/150");

        return saveOrUpdateUser(id, name, email, avatar, "naver");
    }

    // 구글
    public User googleLogin(String code) throws Exception {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("client_id", "147281860929-h7ovf71ou4ggb1jve6coujee7fgkqer1.apps.googleusercontent.com");
        params.add("client_secret", "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");
        params.add("code", code);
        params.add("grant_type", "authorization_code");
        params.add("redirect_uri", "http://localhost:5173/googlelogin");

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

        ResponseEntity<String> tokenResponse = restTemplate.postForEntity("https://oauth2.googleapis.com/token", request, String.class);
        JsonNode tokenNode = objectMapper.readTree(tokenResponse.getBody());
        String accessToken = tokenNode.get("access_token").asText();

        HttpHeaders userHeaders = new HttpHeaders();
        userHeaders.setBearerAuth(accessToken);
        HttpEntity<Void> userRequest = new HttpEntity<>(userHeaders);

        ResponseEntity<String> userResponse = restTemplate.exchange("https://www.googleapis.com/oauth2/v2/userinfo", HttpMethod.GET, userRequest, String.class);
        JsonNode googleData = objectMapper.readTree(userResponse.getBody());

        String id = "google_" + googleData.path("id").asText();
        String name = googleData.path("name").asText("구글유저");
        String email = googleData.path("email").asText("이메일없음");
        String avatar = googleData.path("picture").asText("https://via.placeholder.com/150");

        return saveOrUpdateUser(id, name, email, avatar, "google");
    }

    private User saveOrUpdateUser(String id, String name, String email, String avatar, String provider) {
        User user = userRepository.findById(id).orElse(new User());

        user.setId(id);
        user.setName(name);
        user.setEmail(email);
        user.setAvatar(avatar);
        user.setProvider(provider);
        user.setLoginAt(LocalDateTime.now());

        return userRepository.save(user);
    }
}