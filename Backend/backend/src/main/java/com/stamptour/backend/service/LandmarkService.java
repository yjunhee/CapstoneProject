package com.stamptour.backend.service;

import com.stamptour.backend.dto.LandmarkDTO;
import com.stamptour.backend.entity.Landmark;
import com.stamptour.backend.entity.Stamp;
import com.stamptour.backend.repository.LandmarkRepository;
import com.stamptour.backend.repository.StampRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LandmarkService {

    private final LandmarkRepository landmarkRepository;
    private final StampRepository stampRepository;

    public List<LandmarkDTO> getLandmarksWithStampInfo(String userId) {
        List<Landmark> landmarks = landmarkRepository.findAll();

        List<Stamp> userStamps = stampRepository.findByUserId(userId);

        Map<String, Stamp> stampMap = userStamps.stream()
                .collect(Collectors.toMap(Stamp::getLandmarkId, stamp -> stamp));

        return landmarks.stream().map(landmark -> {
            Stamp stamp = stampMap.get(landmark.getId());
            boolean isCollected = (stamp != null);

            return LandmarkDTO.builder()
                    .id(landmark.getId())
                    .name(landmark.getName())
                    .description(landmark.getDescription())
                    .imageUrl(landmark.getImageUrl())
                    .lat(landmark.getLat())
                    .lng(landmark.getLng())
                    .region(landmark.getRegion())
                    .category(landmark.getCategory())
                    .distance(0.0) // 나중에 GPS 로직 추가할 자리
                    .stampCollected(isCollected)
                    .collectedAt(isCollected ? stamp.getCollectedAt() : null)
                    .build();
        }).collect(Collectors.toList());
    }
}