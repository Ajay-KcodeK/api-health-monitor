package com.codewithaz.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InsightResponse {
    private Long endpointId;
    private String endpointName;
    private String url;
    private String insight;     // AI generated text
    private String generatedAt;
}