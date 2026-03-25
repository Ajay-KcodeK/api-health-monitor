package com.codewithaz.backend.controller;


import com.codewithaz.backend.dto.DashboardSummary;
import com.codewithaz.backend.dto.EndpointRequest;
import com.codewithaz.backend.dto.EndpointResponse;
import com.codewithaz.backend.service.EndpointService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/endpoints")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EndpointController {

    private final EndpointService endpointService;

    @PostMapping
    public ResponseEntity<EndpointResponse> add(
            @Valid @RequestBody EndpointRequest request) {
        return ResponseEntity.ok(endpointService.addEndpoint(request));
    }

    @GetMapping
    public ResponseEntity<List<EndpointResponse>> getAll() {
        return ResponseEntity.ok(endpointService.getAllEndpoints());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        // @PathVariable extracts {id} from the URL
        endpointService.deleteEndpoint(id);
        return ResponseEntity.noContent().build(); // 204 No Content = success, nothing to return
    }

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummary> getSummary() {
        return ResponseEntity.ok(endpointService.getDashboardSummary());
    }
}