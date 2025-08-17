import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Send, Wifi, WifiOff } from 'lucide-react';
import { useChat } from '../context/ChatContext';

const ChatContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-4);
  height: calc(100vh - 160px);
  display: flex;
  flex-direction: column;
`;

const ChatHeader = styled.div`
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-4);
  margin-bottom: var(--spacing-4);
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
`;

const MessagesContainer = styled.div`
  flex: 1;
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-4);
  margin-bottom: var(--spacing-4);
  box-shadow: var(--shadow-sm);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
`;

const Message = styled.div`
  display: flex;
  gap: var(--spacing-3);
  align-items: flex-start;
  
  ${props => props.isUser ? `
    flex-direction: row-reverse;
    
    .message-content {
      background: var(--primary);
      color: var(--white);
      border-radius: var(--radius-xl) var(--radius-xl) var(--radius-sm) var(--radius-xl);
    }
  ` : `
    .message-content {
      background: var(--gray-100);
      color: var(--gray-900);
      border-radius: var(--radius-xl) var(--radius-xl) var(--radius-xl) var(--radius-sm);
    }
  `}
`;

const MessageContent = styled.div`
  max-width: 70%;
  padding: var(--spacing-3) var(--spacing-4);
  line-height: 1.5;
`;

const InputContainer = styled.div`
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-4);
  box-shadow: var(--shadow-sm);
  display: flex;
  gap: var(--spacing-3);
  align-items: center;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: var(--spacing-3) var(--spacing-4);
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-base);
  outline: none;
  
  &:focus {
    border-color: var(--primary);
  }
`;

const SendButton = styled.button`
  width: 44px;
  height: 44px;
  border: none;
  border-radius: var(--radius-lg);
  background: var(--primary);
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:hover {
    background: var(--primary-dark);
  }
`;

const ChatPage = () => {
  const [message, setMessage] = useState('');
  const { messages, isTyping, sendMessage, isOffline, language } = useChat();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <ChatContainer>
      <ChatHeader>
        <div>🤖</div>
        <div>
          <h2>{language === 'rw' ? 'Umufasha wawe' : 'Your Assistant'}</h2>
          <div>
            {isOffline ? <WifiOff size={14} /> : <Wifi size={14} />}
            <span>{isOffline ? 'Offline' : 'Online'}</span>
          </div>
        </div>
      </ChatHeader>

      <MessagesContainer>
        {messages.map((msg) => (
          <Message key={msg.id} isUser={msg.type === 'user'}>
            <MessageContent className="message-content">
              {msg.content}
            </MessageContent>
          </Message>
        ))}
        
        {isTyping && (
          <Message isUser={false}>
            <MessageContent className="message-content">
              {language === 'rw' ? 'Ndi gusoma...' : 'Typing...'}
            </MessageContent>
          </Message>
        )}
        
        <div ref={messagesEndRef} />
      </MessagesContainer>

      <InputContainer>
        <MessageInput
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={language === 'rw' ? 'Andika ubutumwa...' : 'Type message...'}
        />
        <SendButton onClick={handleSendMessage}>
          <Send size={20} />
        </SendButton>
      </InputContainer>
    </ChatContainer>
  );
};

export default ChatPage;
