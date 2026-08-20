package com.stamptour.backend.controller;

import com.stamptour.backend.entity.Stamp;
import com.stamptour.backend.repository.StampRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/stamps")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor

//스탬프 관리 로직
public class StampController {

    private final StampRepository stampRepository;

    @PostMapping
    public ResponseEntity<Map<String, String>> saveStamp(
        @AuthenticationPrincipal String userId,
        @RequestBody Map<String, String> body) {

        String landmarkId = body.get("landmarkId");

        Map<String, String> response = new HashMap<>();

        try {
            Stamp stamp = new Stamp();
            stamp.setUserId(userId);
            stamp.setLandmarkId(landmarkId);
            stamp.setCollectedAt(LocalDateTime.now());

            stampRepository.save(stamp);

            response.put("message", "스탬프 획득 성공!");
            return ResponseEntity.ok(response);

        } catch (DataIntegrityViolationException e) {
            response.put("error", "이미 획득한 스탬프입니다!");
            return ResponseEntity.status(409).body(response);

        } catch (Exception e) {
            response.put("error", "스탬프 저장에 실패했습니다.");
            return ResponseEntity.status(500).body(response);
        }
    }
}