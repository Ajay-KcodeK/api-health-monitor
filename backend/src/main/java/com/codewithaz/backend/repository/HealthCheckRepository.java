package com.codewithaz.backend.repository;

import com.codewithaz.backend.model.HealthCheck;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HealthCheckRepository extends JpaRepository<HealthCheck, Long> {

    List<HealthCheck> findByEndpointIdOrderByCheckedAtDesc(Long endpointId);
    List<HealthCheck> findTop20ByEndpointIdOrderByCheckedAtDesc(Long endpointId);
}
