package com.codewithaz.backend.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class DashboardSummary {

    private int total;
    private long up;
    private long down;
    private long slow;
    private long pending;
    private List<EndpointResponse> endpoints;
}