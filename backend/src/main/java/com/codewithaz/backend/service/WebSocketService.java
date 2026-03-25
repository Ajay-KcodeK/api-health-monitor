package com.codewithaz.backend.service;

import com.codewithaz.backend.dto.HealthCheckUpdate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class WebSocketService {

    // SimpMessagingTemplate = Spring's WebSocket message sender
    private final SimpMessagingTemplate messagingTemplate;

    public void sendHealthUpdate(HealthCheckUpdate update) {
        // Send to /topic/health-updates
        // Every React client subscribed to this topic gets this message instantly
        messagingTemplate.convertAndSend("/topic/health-updates", update);

        log.info("WebSocket update sent for endpoint: {} → {}",
                update.getEndpointName(), update.getStatus());
    }
}
