// components/AIChatbot.jsx
import { useState, useEffect, useRef } from "react";
import { geminiService } from "../services/geminiService";

export default function AIChatbot({ streak, onClose }) {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("geminiChatHistory");
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        type: "bot",
        text: "Hi bhai! Kya puchhna chahte ho? Main AI hoon, kuch bhi puchho! 🤗",
        timestamp: new Date().toISOString()
      }
    ];
  });
  
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Save messages to localStorage
  useEffect(() => {
    localStorage.setItem("geminiChatHistory", JSON.stringify(messages));
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

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
      // Get AI response
      const response = await geminiService.chatWithAI(input, streak, messages);
      
      const botMessage = {
        id: Date.now() + 1,
        type: "bot",
        text: response,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      // Error message
      const errorMessage = {
        id: Date.now() + 1,
        type: "bot",
        text: `❌ ${error.message || "Kuch gadbad ho gayi!"}`,
        timestamp: new Date().toISOString(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
      
      // Log error for debugging
      console.error("Chat Error:", error);
    } finally {
      setLoading(false);
      // Focus input after response
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    if (window.confirm("Saari chat delete karein?")) {
      setMessages([
        {
          id: 1,
          type: "bot",
          text: "Chat clear ho gayi! Naye sawaal puchho! 🤗",
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
            <h4>AI Chat - Ask me anything!</h4>
            <span className="chat-status">
              {loading ? "🤔 Soch raha hoon..." : "⚡ Online"}
            </span>
          </div>
        </div>
        <div className="chat-header-right">
          <button 
            className="chat-clear-btn" 
            onClick={clearChat}
            title="Clear Chat"
          >
            🗑️
          </button>
          <button 
            className="chat-close-btn" 
            onClick={onClose}
            title="Close"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="chat-messages">
        {/* Streak Banner */}
        <div className="streak-context-banner">
          🔥 Teri streak: {streak} days
        </div>

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-message ${msg.type === "user" ? "user-message" : "bot-message"} ${msg.isError ? 'error-message' : ''}`}
          >
            <div className="message-avatar">
              {msg.type === "user" ? "👤" : "🤖"}
            </div>
            <div className="message-content">
              <div className="message-bubble">{msg.text}</div>
              <span className="message-time">
                {formatTime(msg.timestamp)}
              </span>
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

      {/* Input Area */}
      <div className="chat-input-area">
        <div className="input-wrapper">
          <textarea
            ref={inputRef}
            className="chat-input"
            placeholder="Yahan type karo... (Enter bhejo, Shift+Enter new line)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            rows="1"
            disabled={loading}
          />
          <button 
            className="chat-send-btn"
            onClick={handleSendMessage}
            disabled={!input.trim() || loading}
          >
            {loading ? "⏳" : "📤"}
          </button>
        </div>

        {/* Quick Suggestions */}
        <div className="chat-suggestions">
          <button 
            onClick={() => setInput("Mujhe motivation do")} 
            disabled={loading}
          >
            💪 Motivation
          </button>
          <button 
            onClick={() => setInput("Urge ko kaise control karun?")} 
            disabled={loading}
          >
            🎯 Urge Control
          </button>
          <button 
            onClick={() => setInput("Aaj kya karun?")} 
            disabled={loading}
          >
            📅 Today's Plan
          </button>
          <button 
            onClick={() => setInput("Mera streak ${streak} hai, kaisa hai?")} 
            disabled={loading}
          >
            🔥 Streak Review
          </button>
        </div>
      </div>
    </div>
  );
}