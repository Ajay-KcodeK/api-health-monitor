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
public class EndpointResponse {
    private Long id;
    private String name;
    private String url;
    private String lastStatus;   // UP, DOWN, SLOW — latest check result
    private Long lastResponseTime;
    private LocalDateTime createdAt;
}