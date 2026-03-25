import { useEffect, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { HealthCheckUpdate } from '../types';

// onUpdate = callback function called every time a health check arrives
const useWebSocket = (onUpdate: (update: HealthCheckUpdate) => void) => {
  // useRef keeps the STOMP client across renders without causing re-renders
  const clientRef = useRef<Client | null>(null);

  // useCallback prevents unnecessary re-subscriptions
  const stableOnUpdate = useCallback(onUpdate, []);

  useEffect(() => {
    // Create STOMP client
    const client = new Client({
      // SockJS creates the WebSocket connection to your Spring Boot app
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),

      // Retry connection every 5 seconds if disconnected
      reconnectDelay: 5000,

      onConnect: () => {
        console.log('WebSocket connected ✅');

        // Subscribe to the topic Spring is broadcasting to
        client.subscribe('/topic/health-updates', (message) => {
          // message.body is a JSON string — parse it to object
          const update: HealthCheckUpdate = JSON.parse(message.body);
          stableOnUpdate(update);  // call the callback with new data
        });
      },

      onDisconnect: () => {
        console.log('WebSocket disconnected');
      },

      onStompError: (frame) => {
        console.error('WebSocket error:', frame);
      },
    });

    // Activate the connection
    client.activate();
    clientRef.current = client;

    // Cleanup — disconnect when component unmounts
    return () => {
      client.deactivate();
    };
  }, [stableOnUpdate]);
};

export default useWebSocket;