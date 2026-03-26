package com.codewithaz.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OpenAiRequest {

    private String model;
    private List<Message> messages;

    @JsonProperty("max_tokens")      // explicit JSON field name
    private int max_tokens;
    private double temperature;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Message {
        private String role;    // "system" or "user"
        private String content;
    }
}