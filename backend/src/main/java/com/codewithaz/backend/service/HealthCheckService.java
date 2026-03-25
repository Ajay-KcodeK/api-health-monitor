package com.codewithaz.backend.service;

import com.codewithaz.backend.dto.HealthCheckUpdate;
import com.codewithaz.backend.model.ApiEndpoint;
import com.codewithaz.backend.model.HealthCheck;
import com.codewithaz.backend.repository.ApiEndpointRepository;
import com.codewithaz.backend.repository.HealthCheckRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class HealthCheckService {

    private final ApiEndpointRepository apiEndpointRepository;
    private final HealthCheckRepository healthCheckRepository;
    private final RestTemplate restTemplate;
    private final WebSocketService webSocketService;


    // fixedDelay = wait 60 seconds AFTER last execution finishes before running again
    // This is safer than fixedRate which could overlap if a check takes too long
    @Scheduled(fixedDelay = 60000)
    public void checkAllEndpoints() {
        var endpoints = apiEndpointRepository.findAll();
        log.info("Starting health check for {} endpoints at {}",
                endpoints.size(), LocalDateTime.now());
        for(ApiEndpoint endpoint : endpoints) {
            checkEndpoint(endpoint);
        }
    }

    public HealthCheck checkEndpoint(ApiEndpoint endpoint) {
        String status;
        Long responseTime = null;
        Integer statusCode = null;

        long startTime = System.currentTimeMillis();
        try{
            var response = restTemplate.getForEntity(endpoint.getUrl(), String.class);
            responseTime = System.currentTimeMillis() - startTime;
            statusCode = response.getStatusCode().value();

            if(response.getStatusCode().is2xxSuccessful()) {
                status = responseTime >= 2000 ? "SLOW" : "UP";
            }else  {
                status =  "DOWN";
            }
        }catch (Exception e){
            responseTime = System.currentTimeMillis() - startTime;
            status = "DOWN";
            log.warn("Health check failed for {}: {}", endpoint.getUrl(), e.getMessage());
        }

        HealthCheck  healthCheck = HealthCheck.builder()
                .endpoint(endpoint)
                .status(status)
                .responseTime(responseTime)
                .statusCode(statusCode)
                .build();

        HealthCheck savedCheck = healthCheckRepository.save(healthCheck);
        log.info("Checked {} → {} ({}ms)", endpoint.getUrl(), status, responseTime);

        // Build WebSocket update message
        HealthCheckUpdate update = HealthCheckUpdate.builder()
                .endpointId(endpoint.getId())
                .endpointName(endpoint.getName())
                .url(endpoint.getUrl())
                .status(status)
                .responseTime(responseTime)
                .statusCode(statusCode)
                .checkedAt(savedCheck.getCheckedAt())
                .build();

        // Push to all connected browsers instantly
        webSocketService.sendHealthUpdate(update);
        return savedCheck;
    }
}
