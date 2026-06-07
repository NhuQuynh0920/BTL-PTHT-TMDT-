import React from 'react';
import ReactMarkdown from 'react-markdown';

const MessageBubble = ({ message }) => {
  const isBot = message.sender === 'bot';
  const timeString = new Date(message.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`message-wrapper ${isBot ? 'bot' : 'user'}`}>
      <div className="message-bubble">
        {isBot ? (
          <ReactMarkdown>{message.text}</ReactMarkdown>
        ) : (
          message.text
        )}
      </div>
      <span className="message-time">{timeString}</span>
    </div>
  );
};

export default MessageBubble;
