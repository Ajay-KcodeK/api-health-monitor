import { useEffect, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import { HealthCheckUpdate } from '../types';

const useWebSocket = (onUpdate: (update: HealthCheckUpdate) => void) => {
  const clientRef = useRef<Client | null>(null);
  const stableOnUpdate = useCallback(onUpdate, []);

  useEffect(() => {
    // Read API URL from environment variable
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';

    // Convert http/https → ws/wss for WebSocket protocol
    // http://localhost:8080  → ws://localhost:8080
    // https://app.onrender.com → wss://app.onrender.com
    const wsUrl = apiUrl
      .replace('https://', 'wss://')
      .replace('http://', 'ws://');

    const client = new Client({
      brokerURL: `${wsUrl}/ws/websocket`,  // ← dynamic now

      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      onConnect: () => {
        console.log('WebSocket connected ✅');
        client.subscribe('/topic/health-updates', (message) => {
          const update: HealthCheckUpdate = JSON.parse(message.body);
          stableOnUpdate(update);
        });
      },

      onDisconnect: () => {
        console.log('WebSocket disconnected');
      },

      onStompError: (frame) => {
        console.error('STOMP error:', frame.headers['message']);
      },

      onWebSocketError: (error) => {
        console.error('WebSocket error:', error);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [stableOnUpdate]);
};

export default useWebSocket;