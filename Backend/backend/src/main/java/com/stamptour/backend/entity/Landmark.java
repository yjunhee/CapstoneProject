package com.stamptour.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "landmarks")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Landmark {
    @Id
    private String id;

    private String name;
    private String description;
    private String imageUrl;
    private Double lat;
    private Double lng;
    private String region;
    private String category;
}