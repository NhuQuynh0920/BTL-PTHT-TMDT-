import React, { useRef, useEffect } from 'react';
import { Send, X, Sparkles } from 'lucide-react';
import MessageBubble from './MessageBubble.jsx';
import TypingIndicator from './TypingIndicator.jsx';

const ChatWindow = ({
  isClosing,
  onClose,
  messages,
  isTyping,
  typingStatus,
  inputText,
  setInputText,
  handleSendMessage,
  inputRef
}) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Focus input when window opens
  useEffect(() => {
    if (!isClosing && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 300);
    }
  }, [isClosing, inputRef]);

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`chat-window ${isClosing ? 'closing' : ''}`}>
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="chat-avatar">
            <Sparkles size={22} />
            <div className="chat-online-dot"></div>
          </div>
          <div className="chat-title-group">
            <h3 className="chat-title">MoRa Bot</h3>
            <p className="chat-subtitle">Trợ lý ảo thông minh</p>
          </div>
        </div>
        <button className="chat-close-btn" onClick={onClose} aria-label="Đóng chat">
          <X size={24} />
        </button>
      </div>

      {/* Body / Messages List */}
      <div className="chat-body">
        {messages.map((msg, index) => (
          <MessageBubble key={index} message={msg} />
        ))}
        {isTyping && <TypingIndicator status={typingStatus} />}
        <div ref={messagesEndRef} />
      </div>

      {/* Footer / Input Area */}
      <div className="chat-footer">
        <textarea
          ref={inputRef}
          className="chat-input"
          placeholder="Nhập câu hỏi của bạn..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={onKeyDown}
          rows={1}
          disabled={isTyping && typingStatus !== 'Đang tra cứu hệ thống...'} // don't disable completely if just fetching
        />
        <button
          className="chat-send-btn"
          onClick={handleSendMessage}
          disabled={!inputText.trim() || isTyping}
          aria-label="Gửi tin nhắn"
        >
          <Send size={18} style={{ marginLeft: '2px' }} />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
