package com.codewithaz.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "health_checks")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HealthCheck {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "endpoint_id", nullable = false)
    private ApiEndpoint endpoint;

    @Column(nullable = false)
    private String status; // UP, DOWN, SLOW

    @Column(name = "response_time")
    private Long responseTime; // in milliseconds

    @Column(name = "status_code")
    private Integer statusCode;

    @Column(name = "checked_at")
    private LocalDateTime checkedAt;

    @PrePersist
    public void prePersist() {
        this.checkedAt = LocalDateTime.now();
    }
}