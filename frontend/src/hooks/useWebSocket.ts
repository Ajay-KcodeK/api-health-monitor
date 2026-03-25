import { useEffect, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import { HealthCheckUpdate } from '../types';

const useWebSocket = (onUpdate: (update: HealthCheckUpdate) => void) => {
  const clientRef = useRef<Client | null>(null);
  const stableOnUpdate = useCallback(onUpdate, []);

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';

    const client = new Client({
      // Use brokerURL directly instead of SockJS factory
      // This uses native WebSocket — more reliable for local dev
      brokerURL: `ws://localhost:8080/ws/websocket`,

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