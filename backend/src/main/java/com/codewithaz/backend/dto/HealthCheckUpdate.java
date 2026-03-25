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
public class HealthCheckUpdate {
    private Long endpointId;
    private String endpointName;
    private String url;
    private String status;           // UP, DOWN, SLOW
    private Long responseTime;
    private Integer statusCode;
    private LocalDateTime checkedAt;
}
