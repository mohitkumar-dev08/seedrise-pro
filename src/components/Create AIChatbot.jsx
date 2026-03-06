import { useState, useEffect, useRef } from "react";
import { geminiService } from "../services/geminiService";

export default function AIChatbot({ streak, onClose }) {
  const [messages, setMessages] = useState(() => {
    // Load chat history from localStorage
    const saved = localStorage.getItem("chatHistory");
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        type: "bot",
        text: "Hi! I'm your AI Coach. How can I help you today? 💭",
        timestamp: new Date().toISOString()
      }
    ];
  });
  
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Save messages to localStorage
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(messages));
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: "user",
      text: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Get AI response with context
      const response = await geminiService.chatWithAI(input, streak, messages);
      
      const botMessage = {
        id: Date.now() + 1,
        type: "bot",
        text: response,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      
      // Fallback response
      const errorMessage = {
        id: Date.now() + 1,
        type: "bot",
        text: "😅 I'm having trouble connecting. Please try again!",
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearHistory = () => {
    if (window.confirm("Clear all chat history?")) {
      setMessages([
        {
          id: 1,
          type: "bot",
          text: "Hi! I'm your AI Coach. How can I help you today? 💭",
          timestamp: new Date().toISOString()
        }
      ]);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="ai-chatbot-container">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="chat-header-left">
          <span className="chat-avatar">🤖</span>
          <div className="chat-title">
            <h4>AI Coach Chat</h4>
            <span className="chat-status">Online • Gemini 2.5</span>
          </div>
        </div>
        <div className="chat-header-right">
          <button 
            className="chat-history-btn"
            onClick={() => setShowHistory(!showHistory)}
            title="Chat History"
          >
            📋
          </button>
          <button className="chat-clear-btn" onClick={clearHistory} title="Clear Chat">
            🗑️
          </button>
          <button className="chat-close-btn" onClick={onClose} title="Close">
            ✕
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-main-area">
        {/* Messages Container */}
        <div className="chat-messages" ref={chatContainerRef}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`chat-message ${msg.type === "user" ? "user-message" : "bot-message"}`}
            >
              <div className="message-avatar">
                {msg.type === "user" ? "👤" : "🤖"}
              </div>
              <div className="message-content">
                <div className="message-bubble">{msg.text}</div>
                <span className="message-time">{formatTime(msg.timestamp)}</span>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="chat-message bot-message">
              <div className="message-avatar">🤖</div>
              <div className="message-content">
                <div className="message-bubble typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* History Sidebar */}
        {showHistory && (
          <div className="chat-history-sidebar">
            <div className="history-header">
              <h5>📋 Recent Chats</h5>
              <button onClick={() => setShowHistory(false)}>✕</button>
            </div>
            <div className="history-list">
              {messages.slice(-10).reverse().map((msg, index) => (
                <div key={index} className="history-item">
                  <span className="history-icon">{msg.type === "user" ? "👤" : "🤖"}</span>
                  <div className="history-text">
                    <p>{msg.text.substring(0, 30)}...</p>
                    <small>{formatTime(msg.timestamp)}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="chat-input-area">
        <div className="streak-context">
          🔥 Current streak: {streak} days
        </div>
        <div className="input-wrapper">
          <textarea
            className="chat-input"
            placeholder="Ask me anything... (Shift+Enter for new line)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            rows="1"
          />
          <button 
            className="chat-send-btn"
            onClick={handleSendMessage}
            disabled={!input.trim() || loading}
          >
            {loading ? "⏳" : "📤"}
          </button>
        </div>
        <div className="chat-suggestions">
          <button onClick={() => setInput("How to stay motivated?")}>💪 Motivation</button>
          <button onClick={() => setInput("Tips for {streak} days")}>🎯 Tips</button>
          <button onClick={() => setInput("I'm struggling today")}>😔 Help</button>
          <button onClick={() => setInput("What's next milestone?")}>🏆 Milestone</button>
        </div>
      </div>
    </div>
  );
}