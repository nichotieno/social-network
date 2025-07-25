'use client';

import { useEffect, useRef, useCallback } from 'react';
import { Message, Notification } from '../lib/types';

interface WebSocketMessage {
  type: 'message_received' | 'notification' | 'user_online' | 'user_offline';
  data: any;
}

interface UseWebSocketOptions {
  onMessage?: (message: Message) => void;
  onNotification?: (notification: Notification) => void;
  onUserOnline?: (userId: string) => void;
  onUserOffline?: (userId: string) => void;
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const { onMessage, onNotification, onUserOnline, onUserOffline } = options;

  const connect = useCallback(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080/ws';
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.current.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        
        switch (message.type) {
          case 'message_received':
            onMessage?.(message.data);
            break;
          case 'notification':
            onNotification?.(message.data);
            break;
          case 'user_online':
            onUserOnline?.(message.data.userId);
            break;
          case 'user_offline':
            onUserOffline?.(message.data.userId);
            break;
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
      // Reconnect after 3 seconds
      reconnectTimeout.current = setTimeout(connect, 3000);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }, [onMessage, onNotification, onUserOnline, onUserOffline]);

  const sendMessage = useCallback((message: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  }, []);

  const disconnect = useCallback(() => {
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
    }
    ws.current?.close();
  }, []);

  useEffect(() => {
    connect();
    return disconnect;
  }, [connect, disconnect]);

  return { sendMessage, disconnect };
}
