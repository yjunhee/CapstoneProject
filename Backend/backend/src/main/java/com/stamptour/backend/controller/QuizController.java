package com.stamptour.backend.controller;

import com.stamptour.backend.entity.Quiz;
import com.stamptour.backend.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/quizzes")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;

    @GetMapping("/{landmarkId}")
    public ResponseEntity<Quiz> getQuizByLandmark(@PathVariable("landmarkId") String landmarkId) {
        try {
            Quiz quiz = quizService.getQuizByLandmarkId(landmarkId);
            return ResponseEntity.ok(quiz);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}