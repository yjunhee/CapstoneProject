package com.stamptour.backend.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LandmarkDTO {
    private String id;
    private String name;
    private String description;
    private String imageUrl;
    private Double lat;
    private Double lng;
    private String region;
    private String category;

    // 프론트에 줄 데이터
    private Double distance;
    private boolean stampCollected;
    private LocalDateTime collectedAt;
}