package com.codewithaz.backend.controller;

import com.codewithaz.backend.dto.InsightResponse;
import com.codewithaz.backend.service.OpenAiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/insights")
@RequiredArgsConstructor
public class InsightController {

    private final OpenAiService openAiService;

    @GetMapping("/{endpointId}")
    public ResponseEntity<InsightResponse> getInsights(
            @PathVariable Long endpointId) {
        return ResponseEntity.ok(openAiService.getInsights(endpointId));
    }
}