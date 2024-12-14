import { useState, useEffect } from 'react';
import { Chat } from '@/types';
import api from '@/services/api';

export function useConversations() {
  const [conversations, setConversations] = useState<Chat[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.getConversations();
      setConversations(response?.conversations || []);

      if (response?.conversations?.length > 0 && !currentConversationId) {
        setCurrentConversationId(response.conversations[0].id);
      }
    } catch (error) {
      setError('Failed to load conversations');
      console.error('Failed to load conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewConversation = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const title = `Conversation ${new Date().toLocaleString()}`;
      const response = await api.createConversation(title);
      
      if (response && response.success && response.conversation) {
        await loadConversations();
        setCurrentConversationId(response.conversation.id);
        return response.conversation.id;
      }
    } catch (error) {
      setError('Failed to create conversation');
      console.error('Error creating conversation:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteConversation = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.deleteConversation(id);
      
      if (response && response.success) {
        setConversations(prev => prev.filter(conv => conv.id !== id));
        if (currentConversationId === id) {
          setCurrentConversationId(conversations[0]?.id || null);
        }
      }
    } catch (error) {
      setError('Failed to delete conversation');
      console.error('Error deleting conversation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateConversationTitle = async (id: string, newTitle: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.updateConversationTitle(id, newTitle);
      
      if (response && response.conversation) {
        setConversations(prev => 
          prev.map(conv => 
            conv.id === id ? response.conversation : conv
          )
        );
      }
    } catch (error) {
      setError('Failed to update conversation title');
      console.error('Error updating conversation title:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  return {
    conversations,
    currentConversationId,
    isLoading,
    error,
    setCurrentConversationId,
    createNewConversation,
    deleteConversation,
    updateConversationTitle,
    loadConversations
  };
}