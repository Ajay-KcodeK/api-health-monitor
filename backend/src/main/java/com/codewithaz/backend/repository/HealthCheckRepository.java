package com.codewithaz.backend.repository;

import com.codewithaz.backend.model.HealthCheck;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HealthCheckRepository extends JpaRepository<HealthCheck, Long> {

    List<HealthCheck> findByEndpointIdOrderByCheckedAtDesc(Long endpointId);
    List<HealthCheck> findTop20ByEndpointIdOrderByCheckedAtDesc(Long endpointId);
    Optional<HealthCheck> findTopByEndpointIdOrderByCheckedAtDesc(Long endpointId);

}
