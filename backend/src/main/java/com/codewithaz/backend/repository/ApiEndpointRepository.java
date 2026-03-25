package com.codewithaz.backend.repository;

import com.codewithaz.backend.model.ApiEndpoint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ApiEndpointRepository extends JpaRepository<ApiEndpoint, Long> {

    List<ApiEndpoint> findByUserId(Long userId);

    // Eagerly fetch user with endpoint — needed for email alerts in scheduler
    @Query("SELECT e FROM ApiEndpoint e JOIN FETCH e.user")
    List<ApiEndpoint> findAllWithUser();

}
