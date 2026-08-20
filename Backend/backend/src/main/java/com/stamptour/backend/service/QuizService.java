package com.stamptour.backend.service;

import com.stamptour.backend.entity.Quiz;
import com.stamptour.backend.repository.QuizRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class QuizService {

    private final QuizRepository quizRepository;

    public Quiz getQuizByLandmarkId(String landmarkId) {
        // 퀴즈가 없을 경우
        return quizRepository.findByLandmarkId(landmarkId)
                .orElseThrow(() -> new RuntimeException("퀴즈를 찾을 수 없습니다."));
    }
}