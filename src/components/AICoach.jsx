// components/AICoach.jsx - FIXED with working APIs
import { useState, useEffect } from "react";
import { geminiService } from "../services/geminiService";
import AIChatbot from "./AIChatbot";

export default function AICoach({ streak, justRelapsed = false }) {
  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("daily");
  const [retryCount, setRetryCount] = useState(0);
  
  const [inspirationalQuote, setInspirationalQuote] = useState({ text: "", author: "" });
  const [inspireLoading, setInspireLoading] = useState(false);
  const [inspireError, setInspireError] = useState(null);

  useEffect(() => {
    loadDailyQuote();
  }, [streak, retryCount]);

  // ✅ FIXED: Working APIs - No CORS issues
  const loadInspirationalQuote = async () => {
    setInspireLoading(true);
    setInspireError(null);
    
    // ✅ Multiple APIs that support CORS
    const apis = [
      {
        // API 1: Quotable (No CORS, 1500+ quotes)
        url: 'https://api.quotable.io/random',
        parser: (data) => ({ 
          text: data.content, 
          author: data.author 
        })
      },
      {
        // API 2: DummyJSON (No CORS, 100+ quotes)
        url: 'https://dummyjson.com/quotes/random',
        parser: (data) => ({ 
          text: data.quote, 
          author: data.author 
        })
      }
    ];
    
    // Random API select karo
    const randomApi = apis[Math.floor(Math.random() * apis.length)];
    
    try {
      console.log('Fetching from:', randomApi.url);
      const response = await fetch(randomApi.url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Quote received:', data);
      
      const quote = randomApi.parser(data);
      setInspirationalQuote(quote);
      
    } catch (err) {
      console.error('Quote fetch failed:', err);
      
      // ❌ Try second API if first fails
      try {
        const secondApi = apis[1]; // Dusra API try karo
        const response = await fetch(secondApi.url);
        const data = await response.json();
        const quote = secondApi.parser(data);
        setInspirationalQuote(quote);
      } catch (secondErr) {
        setInspireError("Failed to fetch quote. Please try again.");
        setInspirationalQuote({ text: "", author: "" });
      }
    } finally {
      setInspireLoading(false);
    }
  };

  const loadDailyQuote = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const newQuote = await geminiService.getMotivationQuote(streak);
      setQuote(newQuote);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  useEffect(() => {
    if (activeTab === "inspire") {
      loadInspirationalQuote();
    }
  }, [activeTab]);

  return (
    <div className="ai-coach-card">
      {/* THREE TABS */}
      <div className="ai-coach-tabs">
        <button 
          className={activeTab === "daily" ? "active" : ""}
          onClick={() => setActiveTab("daily")}
        >
          📊 Daily
        </button>
        <button 
          className={activeTab === "inspire" ? "active" : ""}
          onClick={() => setActiveTab("inspire")}
        >
          💭 Inspire
        </button>
        <button 
          className={activeTab === "chat" ? "active" : ""}
          onClick={() => setActiveTab("chat")}
        >
          💬 Chat
        </button>
      </div>

      {/* TAB 1: Daily Motivation */}
      {activeTab === "daily" && (
        <div className="ai-dashboard">
          <div className="ai-header">
            <span className="ai-avatar">🤖</span>
            <div className="ai-title">
              <h3>AI Coach</h3>
              <span className="ai-badge">
                {justRelapsed ? "💪 Fresh Start" : `🔥 ${streak}d`}
              </span>
            </div>
            <button 
              className="ai-refresh" 
              onClick={handleRetry}
              disabled={loading}
              title="New Quote"
            >
              {loading ? "⏳" : "🔄"}
            </button>
          </div>

          <div className="quote-card">
            {loading ? (
              <div className="quote-loading">
                <span className="loading-emoji">🤔</span>
                <p>Thinking...</p>
              </div>
            ) : error ? (
              <div className="quote-error">
                <span className="error-emoji">😕</span>
                <p>{error}</p>
                <button onClick={handleRetry} className="retry-btn">
                  🔄 Retry
                </button>
              </div>
            ) : (
              <>
                <div className="quote-icon">"</div>
                <p className="quote-text">{quote}</p>
                <div className="quote-footer">
                  <span className="streak-badge">🔥 {streak}d</span>
                  <span className="update-time">✨ AI</span>
                </div>
              </>
            )}
          </div>

          <button 
            className="quick-chat-btn"
            onClick={() => setActiveTab("chat")}
          >
            💬 Chat with AI
          </button>
        </div>
      )}

      {/* TAB 2: Inspiration Quotes - FIXED */}
      {activeTab === "inspire" && (
        <div className="inspire-dashboard">
          <div className="ai-header">
            <span className="ai-avatar">💭</span>
            <div className="ai-title">
              <h3>Daily Inspiration</h3>
              <span className="ai-badge">✨ Wisdom</span>
            </div>
            <button 
              className="ai-refresh" 
              onClick={loadInspirationalQuote}
              disabled={inspireLoading}
              title="New Quote"
            >
              {inspireLoading ? "⏳" : "🔄"}
            </button>
          </div>

          <div className="inspire-quote-card">
            {inspireLoading ? (
              <div className="inspire-loading">
                <span className="loading-emoji">📖</span>
                <p>Loading quote...</p>
              </div>
            ) : inspireError ? (
              <div className="inspire-error">
                <span className="error-emoji">😕</span>
                <p>{inspireError}</p>
                <button 
                  onClick={loadInspirationalQuote} 
                  className="retry-btn"
                >
                  🔄 Try Again
                </button>
              </div>
            ) : (
              inspirationalQuote.text && (
                <>
                  <div className="inspire-icon">“</div>
                  <p className="inspire-text">{inspirationalQuote.text}</p>
                  <p className="inspire-author">— {inspirationalQuote.author}</p>
                </>
              )
            )}
          </div>

          <div className="inspire-footer">
            <span className="inspire-tip">💡 Tap refresh for new quote</span>
          </div>
        </div>
      )}

      {/* TAB 3: Chat with AI */}
      {activeTab === "chat" && (
        <AIChatbot 
          streak={streak} 
          onClose={() => setActiveTab("daily")}
        />
      )}
    </div>
  );
}