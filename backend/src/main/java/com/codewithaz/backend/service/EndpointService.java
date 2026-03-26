package com.codewithaz.backend.service;

import com.codewithaz.backend.dto.DashboardSummary;
import com.codewithaz.backend.dto.EndpointRequest;
import com.codewithaz.backend.dto.EndpointResponse;
import com.codewithaz.backend.model.ApiEndpoint;
import com.codewithaz.backend.model.HealthCheck;
import com.codewithaz.backend.model.User;
import com.codewithaz.backend.repository.ApiEndpointRepository;
import com.codewithaz.backend.repository.HealthCheckRepository;
import com.codewithaz.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EndpointService {

    private final UserRepository userRepository;
    private final HealthCheckRepository healthCheckRepository;
    private final ApiEndpointRepository apiEndpointRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private EndpointResponse toResponse(ApiEndpoint endpoint) {
        var lastCheck = healthCheckRepository.findTopByEndpointIdOrderByCheckedAtDesc(endpoint.getId());
        return EndpointResponse.builder()
                .id(endpoint.getId())
                .name(endpoint.getName())
                .url(endpoint.getUrl())
                .createdAt(endpoint.getCreatedAt())
                .lastStatus(lastCheck.map(HealthCheck::getStatus).orElse("PENDING"))
                .lastResponseTime(lastCheck.map(HealthCheck::getResponseTime).orElse(null))
                .build();
    }

    public EndpointResponse addEndpoint(EndpointRequest request) {
        User user = getCurrentUser();

        ApiEndpoint endpoint = ApiEndpoint.builder()
                .name(request.getName())
                .url(request.getUrl())
                .user(user)
                .build();

        return toResponse(apiEndpointRepository.save(endpoint));
    }

     public List<EndpointResponse> getAllEndpoints() {
        User user = getCurrentUser();
        return apiEndpointRepository.findByUserId(user.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public void deleteEndpoint(Long id) {
        User user = getCurrentUser();
        ApiEndpoint endpoint = apiEndpointRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Endpoint not found"));

        if (!endpoint.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized: this endpoint doesn't belong to you");
        }

        healthCheckRepository.deleteByEndpointId(id);
        apiEndpointRepository.delete(endpoint);
    }

    public DashboardSummary getDashboardSummary() {
        User user = getCurrentUser();

        List<EndpointResponse> endpoints = apiEndpointRepository
                .findByUserId(user.getId())
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

        // Count each status using Java streams
        // This is like SQL: SELECT status, COUNT(*) GROUP BY status
        long up      = endpoints.stream().filter(e -> "UP".equals(e.getLastStatus())).count();
        long down    = endpoints.stream().filter(e -> "DOWN".equals(e.getLastStatus())).count();
        long slow    = endpoints.stream().filter(e -> "SLOW".equals(e.getLastStatus())).count();
        long pending = endpoints.stream().filter(e -> "PENDING".equals(e.getLastStatus())).count();

        return DashboardSummary.builder()
                .total(endpoints.size())
                .up(up)
                .down(down)
                .slow(slow)
                .pending(pending)
                .endpoints(endpoints)
                .build();
    }
}
