package com.codewithaz.backend.service;

import com.codewithaz.backend.dto.HealthCheckUpdate;
import com.codewithaz.backend.model.ApiEndpoint;
import com.codewithaz.backend.model.HealthCheck;
import com.codewithaz.backend.repository.ApiEndpointRepository;
import com.codewithaz.backend.repository.HealthCheckRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class HealthCheckService {

    private final ApiEndpointRepository endpointRepository;
    private final HealthCheckRepository healthCheckRepository;
    private final RestTemplate restTemplate;
    private final WebSocketService webSocketService;
    private final EmailService emailService;

    // Tracks last known status per endpoint — key: endpointId, value: status
    // Used to detect status CHANGES and avoid email spam
    private final Map<Long, String> previousStatusMap = new HashMap<>();

    @PostConstruct
    public void init() {
        log.info("HealthCheckService started — scheduler is active");
    }

    @Scheduled(fixedDelay = 60000)
    public void checkAllEndpoints() {
        List<ApiEndpoint> endpoints = endpointRepository.findAllWithUser();
        log.info("=== Scheduler triggered at {} — checking {} endpoints ===",
                LocalDateTime.now(), endpoints.size());

        if (endpoints.isEmpty()) {
            log.info("No endpoints to check");
            return;
        }

        for (ApiEndpoint endpoint : endpoints) {
            checkEndpoint(endpoint);
        }

        log.info("=== Health check cycle complete ===");
    }

    public HealthCheck checkEndpoint(ApiEndpoint endpoint) {
        String status;
        Long responseTime = null;
        Integer statusCode = null;

        long startTime = System.currentTimeMillis();

        try {
            var response = restTemplate.getForEntity(endpoint.getUrl(), String.class);
            responseTime = System.currentTimeMillis() - startTime;
            statusCode = response.getStatusCode().value();

            if (response.getStatusCode().is2xxSuccessful()) {
                status = responseTime >= 2000 ? "SLOW" : "UP";
            } else {
                status = "DOWN";
            }

        } catch (Exception e) {
            responseTime = System.currentTimeMillis() - startTime;
            status = "DOWN";
            log.warn("Health check failed for {}: {}", endpoint.getUrl(), e.getMessage());
        }

        // Save to DB
        HealthCheck healthCheck = HealthCheck.builder()
                .endpoint(endpoint)
                .status(status)
                .responseTime(responseTime)
                .statusCode(statusCode)
                .build();

        HealthCheck saved = healthCheckRepository.save(healthCheck);
        log.info("Checked {} → {} ({}ms)", endpoint.getUrl(), status, responseTime);

        // Handle email alerts based on status CHANGE only
        handleEmailAlert(endpoint, status, responseTime);

        // Push WebSocket update
        HealthCheckUpdate update = HealthCheckUpdate.builder()
                .endpointId(endpoint.getId())
                .endpointName(endpoint.getName())
                .url(endpoint.getUrl())
                .status(status)
                .responseTime(responseTime)
                .statusCode(statusCode)
                .checkedAt(saved.getCheckedAt())
                .build();

        webSocketService.sendHealthUpdate(update);

        return saved;
    }

    private void handleEmailAlert(ApiEndpoint endpoint, String currentStatus, Long responseTime) {
        String previousStatus = previousStatusMap.get(endpoint.getId());
        String userEmail = endpoint.getUser().getEmail();

        // Case 1: Status just became DOWN (was UP/SLOW/PENDING before, or first check)
        if ("DOWN".equals(currentStatus) && !"DOWN".equals(previousStatus)) {
            log.info("ALERT: {} just went DOWN — sending email to {}",
                    endpoint.getName(), userEmail);
            emailService.sendDownAlert(
                    userEmail,
                    endpoint.getName(),
                    endpoint.getUrl(),
                    responseTime
            );
        }

        // Case 2: Status recovered from DOWN to UP or SLOW
        if (!"DOWN".equals(currentStatus) && "DOWN".equals(previousStatus)) {
            log.info("RECOVERY: {} is back {} — sending email to {}",
                    endpoint.getName(), currentStatus, userEmail);
            emailService.sendRecoveryAlert(
                    userEmail,
                    endpoint.getName(),
                    endpoint.getUrl(),
                    responseTime
            );
        }

        // Update previous status map for next check
        previousStatusMap.put(endpoint.getId(), currentStatus);
    }
}
