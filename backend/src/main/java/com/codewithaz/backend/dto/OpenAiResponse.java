package com.codewithaz.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class OpenAiResponse {
    private List<Choice> choices;

    @Data
    public static class Choice {
        private Message message;

        @Data
        public static class Message {
            private String content;
        }
    }

    // Helper to extract text directly
    public String getInsightText() {
        if (choices != null && !choices.isEmpty()) {
            return choices.get(0).getMessage().getContent();
        }
        return "No insights available";
    }
}