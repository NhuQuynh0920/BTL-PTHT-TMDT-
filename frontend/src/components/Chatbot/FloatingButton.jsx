import React from 'react';
import { MessageCircle, X } from 'lucide-react';

const FloatingButton = ({ isOpen, toggleChat, unreadCount }) => {
  return (
    <button
      className={`chat-floating-btn ${isOpen ? 'active' : ''}`}
      onClick={toggleChat}
      aria-label="Mở/Đóng trợ lý ảo"
    >
      {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      {!isOpen && unreadCount > 0 && (
        <span className="chat-unread-badge">{unreadCount}</span>
      )}
    </button>
  );
};

export default FloatingButton;
