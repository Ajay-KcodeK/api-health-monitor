package com.codewithaz.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // /topic = channel prefix for server → client broadcasts
        // Think of /topic like a TV channel — clients subscribe, server broadcasts
        config.enableSimpleBroker("/topic");

        // /app = prefix for client → server messages
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // This is the URL React will connect to
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")  // Allow all origins (React on port 3000)
                .withSockJS();  // SockJS = fallback for browsers that don't support WebSocket
    }
}
