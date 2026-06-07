import React, { useState, useRef } from 'react';
import FloatingButton from './FloatingButton.jsx';
import ChatWindow from './ChatWindow.jsx';
import './chatbot.css';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Chào bạn! Mình là trợ lý ảo của MoRa Tea 🧋\nBạn cần hỗ trợ gì về đồ uống hay đơn hàng không ạ?', timestamp: Date.now() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingStatus, setTypingStatus] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  const inputRef = useRef(null);

  const toggleChat = () => {
    if (isOpen) {
      setIsClosing(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsClosing(false);
      }, 300); // Wait for closing animation
    } else {
      setIsOpen(true);
      setUnreadCount(0); // Clear unread badge
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isTyping) return;

    const userMsg = { sender: 'user', text: inputText.trim(), timestamp: Date.now() };
    const newMessages = [...messages, userMsg];

    setMessages(newMessages);
    setInputText('');
    setIsTyping(true);
    setTypingStatus('');

    try {
      // Create a placeholder for the bot's response
      const botMsgId = Date.now();
      let currentBotText = '';

      setMessages(prev => [...prev, { id: botMsgId, sender: 'bot', text: '', timestamp: Date.now() }]);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunkStr = decoder.decode(value, { stream: true });
        // The SSE chunks can contain multiple 'data: {...}\n\n' separated by newlines
        const lines = chunkStr.split('\n\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.substring(6).trim();
            if (dataStr === '[DONE]') {
              setIsTyping(false);
              break;
            }

            if (dataStr) {
              try {
                const parsed = JSON.parse(dataStr);

                if (parsed.error) {
                  currentBotText = parsed.error;
                  setIsTyping(false);
                } else if (parsed.isTyping) {
                  setTypingStatus(parsed.status);
                } else if (parsed.text) {
                  setTypingStatus(''); // hide typing status since we have text
                  currentBotText += parsed.text;
                }

                // Update the last bot message in the state
                setMessages(prev => {
                  const updated = [...prev];
                  const lastIndex = updated.length - 1;
                  if (updated[lastIndex].sender === 'bot') {
                    updated[lastIndex].text = currentBotText;
                  }
                  return updated;
                });

                // If chat is closed, increment unread badge
                if (!isOpen) {
                  setUnreadCount(prev => prev + 1);
                }

              } catch (e) {
                console.error("Error parsing chunk:", e, "Chunk:", dataStr);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat API Error:", error);
      setIsTyping(false);
      setMessages(prev => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        if (updated[lastIndex].sender === 'bot' && !updated[lastIndex].text) {
          updated[lastIndex].text = "Xin lỗi, đã có lỗi kết nối xảy ra. Bạn thử lại nhé!";
        } else {
          updated.push({ sender: 'bot', text: "Xin lỗi, đã có lỗi kết nối xảy ra. Bạn thử lại nhé!", timestamp: Date.now() });
        }
        return updated;
      });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="chatbot-wrapper">
      {(isOpen || isClosing) && (
        <ChatWindow
          isClosing={isClosing}
          onClose={toggleChat}
          messages={messages}
          isTyping={isTyping}
          typingStatus={typingStatus}
          inputText={inputText}
          setInputText={setInputText}
          handleSendMessage={handleSendMessage}
          inputRef={inputRef}
        />
      )}

      <FloatingButton
        isOpen={isOpen && !isClosing}
        toggleChat={toggleChat}
        unreadCount={unreadCount}
      />
    </div>
  );
};

export default ChatWidget;
