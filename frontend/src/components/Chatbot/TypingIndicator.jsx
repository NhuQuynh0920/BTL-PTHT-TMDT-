import React from 'react';

const TypingIndicator = ({ status }) => {
  return (
    <div className="typing-indicator">
      <div style={{ display: 'flex', gap: '4px', padding: '4px' }}>
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
      </div>
      {status && <span className="typing-status">{status}</span>}
    </div>
  );
};

export default TypingIndicator;
