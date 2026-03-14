"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      text: "🙏 Welcome to Aloukik Axom! I'm your virtual guide to Assam's rich cultural heritage. How can I help you explore our beautiful state today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Limit conversation to last 8 messages (4 pairs) to keep it concise
  const limitConversation = (messageList: Message[]) => {
    if (messageList.length <= 8) return messageList;
    
    // Keep the welcome message and last 7 messages
    const welcomeMessage = messageList.find(msg => msg.id === "welcome-1");
    const recentMessages = messageList.slice(-7);
    
    return welcomeMessage ? [welcomeMessage, ...recentMessages] : recentMessages;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage: Message = {
      id: `${Date.now()}-user`,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    // Add user message and limit conversation size
    setMessages((prev) => limitConversation([...prev, userMessage]));
    const currentInput = inputValue;
    setInputValue("");
    setIsTyping(true);

    try {
      // Only send last 6 messages to keep context concise
      const recentHistory = messages.slice(-6).map(msg => ({
        role: msg.sender as 'user' | 'assistant',
        content: msg.text,
        timestamp: msg.timestamp.toISOString()
      }));

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          message: currentInput,
          conversationHistory: recentHistory 
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const botMessage: Message = {
        id: `${Date.now()}-bot`,
        text: data.response || "I apologize, but I couldn't process your request. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => limitConversation([...prev, botMessage]));
    } catch (error) {
      console.error("Error sending message:", error);
      let errorMessage = "Sorry, I'm having trouble connecting right now. Please try again later.";
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = "Request timed out. Please try again.";
        } else if (error.message.includes('HTTP error')) {
          errorMessage = "Server error. Please try again in a moment.";
        }
      }
      
      const errorBotMessage: Message = {
        id: `${Date.now()}-error`,
        text: errorMessage,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => limitConversation([...prev, errorBotMessage]));
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome-1",
        text: "🙏 Welcome to Aloukik Axom! I'm your virtual guide to Assam's rich cultural heritage. How can I help you explore our beautiful state today?",
        sender: "bot",
        timestamp: new Date(),
      },
    ]);
    setInputValue("");
  };

  // Show message count indicator when conversation is getting long
  const getMessageCountText = () => {
    if (messages.length <= 4) return "";
    return `(${Math.min(messages.length, 8)} msgs)`;
  };

  const quickActions = [
    { text: "Tell me about Assamese festivals", icon: "🎉" },
    { text: "What are the must-visit places in Guwahati?", icon: "📍" },
    { text: "What is Assam famous for?", icon: "✨" },
    { text: "How can I contribute experiences?", icon: "🤝" },
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent-warm)] text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
        aria-label="Open chat"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex w-96 max-h-150 max-w-[calc(100vw-3rem)] flex-col rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border)] bg-gradient-to-r from-[var(--accent-warm)] to-[var(--accent-warm-hover)] p-4 text-white">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-sm">🤖</span>
          </div>
          <div>
            <h3 className="font-medium">Assam Tourism Bot</h3>
            <p className="text-xs opacity-90">Your virtual cultural guide {getMessageCountText()}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={clearChat}
            className="rounded-full p-1 hover:bg-white/20 transition-colors"
            aria-label="Clear chat"
            title="Clear chat history"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-full p-1 hover:bg-white/20 transition-colors"
            aria-label="Close chat"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 max-h-96">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 ${
                  message.sender === "user"
                    ? "bg-[var(--accent-warm)] text-white"
                    : "bg-[var(--surface-elevated)] text-[var(--foreground)]"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender === "user" ? "text-white/70" : "text-[var(--muted)]"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-[var(--surface-elevated)] rounded-lg px-3 py-2">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 bg-[var(--accent-warm)] rounded-full animate-bounce" />
                  <div className="h-2 w-2 bg-[var(--accent-warm)] rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                  <div className="h-2 w-2 bg-[var(--accent-warm)] rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Actions */}
      {messages.length <= 1 && (
        <div className="border-t border-[var(--border)] p-3">
          <p className="text-xs text-[var(--muted)] mb-2">Quick questions:</p>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => {
                  setInputValue(action.text);
                  // Auto-send quick action
                  setTimeout(() => {
                    handleSendMessage();
                  }, 100);
                }}
                className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-xs text-[var(--foreground)] hover:border-[var(--accent-warm)] transition-colors"
              >
                {action.icon} {action.text.length > 20 ? action.text.substring(0, 20) + "..." : action.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-[var(--border)] p-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about Assam's culture..."
            className="flex-1 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] placeholder-[var(--muted)] focus:border-[var(--accent-warm)] focus:outline-none"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="rounded-full bg-[var(--accent-warm)] p-2 text-white transition-colors hover:bg-[var(--accent-warm-hover)] disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
