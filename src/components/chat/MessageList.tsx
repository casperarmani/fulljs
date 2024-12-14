import React, { useEffect, useRef } from 'react';
import { Message } from '@/types';
import { formatDate, sanitizeHTML } from '@/utils/formatters';

interface MessageListProps {
  messages: Message[];
  className?: string;
}

export function MessageList({ messages, className }: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100');
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      const wasScrolledToBottom = 
        containerRef.current.scrollHeight - containerRef.current.scrollTop <= 
        containerRef.current.clientHeight + 10;

      if (wasScrolledToBottom) {
        requestAnimationFrame(() => {
          if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
          }
        });
      }
    }
  }, [messages]);

  return (
    <div 
      ref={containerRef}
      className={`overflow-auto ${className || ''}`}
    >
      {messages.map((message, index) => (
        <div
          key={`${message.timestamp}-${index}`}
          className={`message ${message.type} opacity-0 transition-opacity duration-300`}
          ref={(el) => {
            if (el && observerRef.current) {
              observerRef.current.observe(el);
            }
          }}
        >
          <div className="message-content">
            {sanitizeHTML(message.content)}
          </div>
          <div 
            className="message-timestamp" 
            title={formatDate(message.timestamp)}
          >
            {formatDate(message.timestamp)}
          </div>
        </div>
      ))}
    </div>
  );
}