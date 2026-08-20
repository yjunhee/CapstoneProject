package com.stamptour.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    private String email;
    private String avatar;
    private String provider;

    @Column(name = "login_at")
    private LocalDateTime loginAt;
}