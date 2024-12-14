import { useState, useEffect, useRef } from 'react';
import { Message, Chat } from '@/types';
import api from '@/services/api';

const INITIAL_POLL_INTERVAL = 1000;
const MAX_POLL_INTERVAL = 1000;

export function useChat() {
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastMessageTimestampRef = useRef<string | null>(null);

  const startPolling = (conversationId: string) => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }

    let isPolling = false;
    pollIntervalRef.current = setInterval(async () => {
      if (isPolling || !conversationId) return;

      try {
        isPolling = true;
        const response = await api.getConversationMessages(conversationId);
        
        if (response && Array.isArray(response.messages)) {
          const newMessages = response.messages.filter(msg => {
            const existingMessage = chatHistory.find(existing => 
              existing.timestamp === msg.timestamp && 
              existing.content === msg.content
            );
            return !existingMessage;
          });

          if (newMessages.length > 0) {
            setChatHistory(prev => [...prev, ...newMessages]);
            lastMessageTimestampRef.current = newMessages[newMessages.length - 1].timestamp;
          }
        }
      } catch (error) {
        // Silent handling for expected polling scenarios
        if (!error.message?.includes('polling') && 
            !error.message?.includes('timeout')) {
          console.error('Polling error:', error);
        }
      } finally {
        isPolling = false;
      }
    }, INITIAL_POLL_INTERVAL);
  };

  const stopPolling = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  };

  const sendMessage = async (message: string, files: File[] = [], conversationId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await api.sendMessage(message, files, conversationId);
      
      // Add user message immediately
      const userMessage: Message = {
        type: 'user',
        content: message,
        timestamp: new Date().toISOString()
      };
      
      setChatHistory(prev => [...prev, userMessage]);
      return response;
    } catch (error) {
      setError('Failed to send message');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, []);

  return {
    chatHistory,
    isLoading,
    error,
    sendMessage,
    startPolling,
    stopPolling
  };
}