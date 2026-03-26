package com.codewithaz.backend.service;

import com.codewithaz.backend.dto.InsightResponse;
import com.codewithaz.backend.dto.OpenAiRequest;
import com.codewithaz.backend.dto.OpenAiResponse;
import com.codewithaz.backend.model.ApiEndpoint;
import com.codewithaz.backend.model.HealthCheck;
import com.codewithaz.backend.repository.ApiEndpointRepository;
import com.codewithaz.backend.repository.HealthCheckRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class OpenAiService {

    private final ApiEndpointRepository endpointRepository;
    private final HealthCheckRepository healthCheckRepository;

    @Value("${openai.api.key}")
    private String apiKey;

    @Value("${openai.api.url}")
    private String apiUrl;

    @Value("${openai.model}")
    private String model;

    public InsightResponse getInsights(Long endpointId) {
        // Get endpoint details
        ApiEndpoint endpoint = endpointRepository.findById(endpointId)
                .orElseThrow(() -> new RuntimeException("Endpoint not found"));

        // Get last 20 health checks
        List<HealthCheck> checks = healthCheckRepository
                .findTop20ByEndpointIdOrderByCheckedAtDesc(endpointId);

        if (checks.isEmpty()) {
            return InsightResponse.builder()
                    .endpointId(endpointId)
                    .endpointName(endpoint.getName())
                    .url(endpoint.getUrl())
                    .insight("No health check data available yet. " +
                            "Please wait for the scheduler to run at least once.")
                    .generatedAt(LocalDateTime.now().toString())
                    .build();
        }

        // Build data summary for OpenAI
        String dataSummary = buildDataSummary(endpoint, checks);

        // Call OpenAI
        String insight = callOpenAI(dataSummary);

        return InsightResponse.builder()
                .endpointId(endpointId)
                .endpointName(endpoint.getName())
                .url(endpoint.getUrl())
                .insight(insight)
                .generatedAt(LocalDateTime.now()
                        .format(DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm:ss")))
                .build();
    }

    private String buildDataSummary(ApiEndpoint endpoint, List<HealthCheck> checks) {
        // Calculate statistics
        long upCount   = checks.stream().filter(c -> "UP".equals(c.getStatus())).count();
        long downCount = checks.stream().filter(c -> "DOWN".equals(c.getStatus())).count();
        long slowCount = checks.stream().filter(c -> "SLOW".equals(c.getStatus())).count();

        double uptimePercent = (upCount * 100.0) / checks.size();

        // Average response time for UP checks only
        double avgResponseTime = checks.stream()
                .filter(c -> "UP".equals(c.getStatus()) && c.getResponseTime() != null)
                .mapToLong(HealthCheck::getResponseTime)
                .average()
                .orElse(0);

        // Max response time
        long maxResponseTime = checks.stream()
                .filter(c -> c.getResponseTime() != null)
                .mapToLong(HealthCheck::getResponseTime)
                .max()
                .orElse(0);

        // Build the prompt data
        return String.format("""
                API Endpoint Analysis Data:
                - Name: %s
                - URL: %s
                - Total checks analyzed: %d (last 20)
                - UP count: %d
                - DOWN count: %d
                - SLOW count: %d (response > 2000ms)
                - Uptime percentage: %.1f%%
                - Average response time: %.0fms
                - Max response time: %dms
                - Latest status: %s
                """,
                endpoint.getName(),
                endpoint.getUrl(),
                checks.size(),
                upCount, downCount, slowCount,
                uptimePercent,
                avgResponseTime,
                maxResponseTime,
                checks.get(0).getStatus()
        );
    }

    private String callOpenAI(String dataSummary) {
        try {
            // Build the request
            OpenAiRequest request = OpenAiRequest.builder()
                    .model(model)
                    .max_tokens(300)
                    .temperature(0.7)
                    .messages(List.of(
                            // System message — tells AI its role
                            new OpenAiRequest.Message(
                                    "system",
                                    "You are an expert API reliability engineer. " +
                                            "Analyze the provided API health data and give " +
                                            "concise, actionable insights in 3-4 sentences. " +
                                            "Focus on: uptime quality, performance patterns, " +
                                            "and specific recommendations to improve reliability."
                            ),
                            // User message — the actual data
                            new OpenAiRequest.Message("user", dataSummary)
                    ))
                    .build();

            // Make HTTP call to OpenAI using WebClient
            WebClient webClient = WebClient.create();

            OpenAiResponse response = webClient.post()
                    .uri(apiUrl)
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(OpenAiResponse.class)
                    .block(); // block = wait for response (synchronous)

            if (response != null) {
                return response.getInsightText();
            }

            return "Unable to generate insights at this time.";

        } catch (Exception e) {
            log.error("OpenAI API call failed: {}", e.getMessage());
            return "AI insights temporarily unavailable. " +
                    "Please try again later.";
        }
    }
}