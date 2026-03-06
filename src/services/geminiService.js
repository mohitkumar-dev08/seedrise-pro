// services/geminiService.js
const GEMINI_API_KEY = "AIzaSyCQ_w7fP_KbOV1_sMUorNu80rRF0atG0So";

// Use Gemini 2.0 Flash for high quota
const MODEL_NAME = "gemini-2.5-flash-lite";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent`;

// Rate limiting - sirf API overuse rokne ke liye
let requestTimestamps = [];
const MAX_REQUESTS_PER_MINUTE = 50; // 2.0 flash allows 1500, safe limit

function checkRateLimit() {
  const now = Date.now();
  requestTimestamps = requestTimestamps.filter(
    timestamp => now - timestamp < 60000
  );
  
  if (requestTimestamps.length >= MAX_REQUESTS_PER_MINUTE) {
    const oldestRequest = requestTimestamps[0];
    const waitTime = 60000 - (now - oldestRequest);
    throw new Error(`RATE_LIMIT:${Math.ceil(waitTime / 1000)}`);
  }
  
  requestTimestamps.push(now);
}

// Queue system
const requestQueue = [];
let isProcessing = false;

async function processQueue() {
  if (isProcessing || requestQueue.length === 0) return;
  
  isProcessing = true;
  const { resolve, reject, request } = requestQueue.shift();
  
  try {
    const result = await request();
    resolve(result);
  } catch (error) {
    reject(error);
  } finally {
    isProcessing = false;
    setTimeout(() => processQueue(), 100);
  }
}

function queueRequest(request) {
  return new Promise((resolve, reject) => {
    requestQueue.push({ resolve, reject, request });
    processQueue();
  });
}

export const geminiService = {
  // Motivational quote - PURE API RESPONSE
  getMotivationQuote: async (streak) => {
    // Special case for day 0
    if (streak === 0) {
      return "Start your journey today! Every master was once a beginner. 🌱";
    }
    
    return queueRequest(async () => {
      try {
        checkRateLimit();
        
        // Pure prompt - no predefined answers
        const prompt = `Generate a unique, motivational quote for someone who has maintained a ${streak}-day streak. The quote should be original, encouraging, and include an emoji. Max 15 words. Return only the quote.`;
        
        const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }],
            generationConfig: {
              temperature: 0.9, // High temperature = more creativity
              maxOutputTokens: 50,
              topK: 40,
              topP: 0.95
            }
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("API Error:", errorData);
          
          // Only throw error - no fallback quotes
          throw new Error(errorData.error?.message || "API request failed");
        }

        const data = await response.json();
        const quote = data.candidates[0].content.parts[0].text.trim();
        
        // Agar empty response aaya to error throw karo
        if (!quote) {
          throw new Error("Empty response from API");
        }
        
        return quote;
        
      } catch (error) {
        console.error("Quote error:", error);
        
        // Error ko throw karo - UI handle karega
        if (error.message.includes("RATE_LIMIT")) {
          const waitTime = error.message.split(':')[1];
          throw new Error(`⏳ API limit reached. Wait ${waitTime} seconds.`);
        } else {
          throw new Error("😕 API response failed. Retry.");
        }
      }
    });
  },

  // Chat with AI - PURE API RESPONSE
  chatWithAI: async (userMessage, streak = 0, chatHistory = []) => {
    return queueRequest(async () => {
      try {
        checkRateLimit();
        
        // Build context from chat history
        let context = "";
        if (chatHistory.length > 0) {
          const recentChats = chatHistory.slice(-4).map(msg => 
            `${msg.type === 'user' ? 'User' : 'Assistant'}: ${msg.text}`
          ).join('\n');
          context = `Previous conversation:\n${recentChats}\n\n`;
        }
        
        // Pure prompt - no predefined responses
        const prompt = `${context}Current user streak: ${streak} days. The user is using a habit tracking app. Respond to their message naturally and helpfully. Be concise (max 3 sentences), use emojis occasionally, and make it personal. User message: "${userMessage}"`;
        
        const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }],
            generationConfig: {
              temperature: 0.9,
              maxOutputTokens: 200,
              topK: 40,
              topP: 0.95
            }
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Chat API Error:", errorData);
          
          // Only throw error - no fallback responses
          throw new Error(errorData.error?.message || "API request failed");
        }

        const data = await response.json();
        const reply = data.candidates[0].content.parts[0].text.trim();
        
        if (!reply) {
          throw new Error("Empty response from API");
        }
        
        return reply;
        
      } catch (error) {
        console.error("Chat error:", error);
        
        // Error ko throw karo - UI handle karega
        if (error.message.includes("RATE_LIMIT")) {
          const waitTime = error.message.split(':')[1];
          throw new Error(`⏳ API limit reached. Wait ${waitTime} seconds.`);
        } else {
          throw new Error("😕 AI couldn’t think. Try again.");
        }
      }
    });
  },

  // Check API status
  checkAPIStatus: async () => {
    try {
      const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: "Say 'OK' if you're working."
            }]
          }]
        })
      });
      
      return response.ok;
    } catch {
      return false;
    }
  }
};