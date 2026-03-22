package com.codewithaz.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class EndpointRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "URL is required")
    @Pattern(
            regexp = "^(https?://).+",
            message = "URL must start with http:// or https://"
    )
    private String url;
}