package com.codewithaz.backend.controller;

import com.codewithaz.backend.dto.HealthCheckResponse;
import com.codewithaz.backend.repository.HealthCheckRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/health")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class HealthCheckController {

    private final HealthCheckRepository healthCheckRepository;

    // Get last 20 checks for an endpoint — used for the Recharts graph
    @GetMapping("/history/{endpointId}")
    public ResponseEntity<List<HealthCheckResponse>> getHealthChecks(@PathVariable Long endpointId) {

        var checks = healthCheckRepository.findTop20ByEndpointIdOrderByCheckedAtDesc(endpointId)
                .stream()
                .map(check -> HealthCheckResponse.builder()
                        .id(check.getId())
                        .status(check.getStatus())
                        .responseTime(check.getResponseTime())
                        .statusCode(check.getStatusCode())
                        .checkedAt(check.getCheckedAt())
                        .build())
                .toList();
        return ResponseEntity.ok(checks);
    }
}
