import React, { useState, useRef, useEffect } from 'react';
import { ScrollArea } from './ui/scroll-area';
import { ChatHeader } from './chat/ChatHeader';
import { ChatWelcome } from './chat/ChatWelcome';
import { ChatMessage } from './chat/ChatMessage';
import { ChatInput } from './chat/ChatInput';
import { Upload, X } from 'lucide-react';
import api from '@/services/api';
import { Message } from '@/types';

interface ChatContainerProps {
  chatId?: string | null;
  initialMessages?: Message[];
  onMessageSent?: (messages: Message[], chatId: string) => void;
}

function ChatContainer({ chatId, initialMessages = [], onMessageSent }: ChatContainerProps) {
  const [message, setMessage] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    if (initialMessages.length > 0 && chatMessages.length === 0) {
      setChatMessages(initialMessages);
    }
  }, [initialMessages]);

  useEffect(() => {
    fetchChatHistory();
  }, []);

  const fetchChatHistory = async () => {
    try {
      const data = await api.getChatHistory();
      
      if (data.history && Array.isArray(data.history)) {
        const formattedMessages: Message[] = data.history.map((msg) => ({
          type: msg.chat_type === 'bot' ? 'bot' : 'user',
          content: msg.message,
        }));
        
        setChatMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
      setError('Failed to load chat history');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!message.trim() && files.length === 0) || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.sendMessage(message.trim(), files, chatId || null);

      const newUserMessage: Message = {
        type: 'user',
        content: message.trim(),
      };

      const newBotMessage: Message = {
        type: 'bot',
        content: response.response,
      };
      
      setChatMessages(prev => [...prev, newUserMessage, newBotMessage]);
      
      if (chatId && onMessageSent) {
        onMessageSent([...chatMessages, newUserMessage, newBotMessage], chatId);
      }
      
      setMessage('');
      setFiles([]);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ... rest of the component code remains the same ...

  return (
    // ... existing JSX remains the same ...
  );
}

export default ChatContainer;