package com.codewithaz.backend.service;

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

import java.util.List;

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

    public void deleteEndpoint(Long id) {
        User user = getCurrentUser();
        ApiEndpoint endpoint = apiEndpointRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Endpoint not found"));

        if (!endpoint.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized: this endpoint doesn't belong to you");
        }

        apiEndpointRepository.delete(endpoint);
    }
}
