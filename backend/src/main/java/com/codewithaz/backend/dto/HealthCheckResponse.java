package com.codewithaz.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class HealthCheckResponse {
    private Long id;
    private String status;
    private Long responseTime;
    private Integer statusCode;
    private LocalDateTime checkedAt;
}