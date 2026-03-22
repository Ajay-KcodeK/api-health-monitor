package com.codewithaz.backend.repository;

import com.codewithaz.backend.model.ApiEndpoint;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApiEndpointRepository extends JpaRepository<ApiEndpoint, Long> {

    List<ApiEndpoint> findByUserId(Long userId);

}
