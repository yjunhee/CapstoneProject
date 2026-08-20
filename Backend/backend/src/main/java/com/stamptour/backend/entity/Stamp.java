package com.stamptour.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "stamps")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Stamp {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private String userId;

    @Column(name = "landmark_id")
    private String landmarkId;

    @Column(name = "collected_at")
    private LocalDateTime collectedAt;
}