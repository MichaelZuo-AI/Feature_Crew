'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Message {
  id: string;
  role: 'bot' | 'user';
  text: string;
  timestamp: Date;
}

// ---------------------------------------------------------------------------
// Canned responses
// ---------------------------------------------------------------------------
const CANNED_RESPONSES: Record<string, string> = {
  'Order Status':
    "I can help you check your order status! Please share your order number and I'll look it up right away. You can find it in your confirmation email or under My Orders in your profile.",
  'Return Request':
    'To start a return, please have your order number ready. Returns are accepted within 30 days of delivery for most items. Would you like me to initiate the return process for you?',
  'Payment Issue':
    "I'm sorry to hear you're experiencing a payment issue. Could you tell me more about what happened? For example, was your card declined, or is there an unexpected charge? I'll get this sorted for you.",
  Other:
    "Thanks for reaching out! A member of our support team will be with you shortly. In the meantime, feel free to describe your issue and I'll do my best to help.",
};

const DEFAULT_RESPONSE =
  "Thanks for your message! I've noted your concern and a support specialist will follow up within a few minutes. Is there anything else I can help clarify?";

// ---------------------------------------------------------------------------
// Typing indicator
// ---------------------------------------------------------------------------
function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-3">
      <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-white text-sm">support_agent</span>
      </div>
      <div className="bg-[#eef0f6] rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
        <span
          className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
          style={{ animationDelay: '0ms' }}
        />
        <span
          className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
          style={{ animationDelay: '150ms' }}
        />
        <span
          className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
          style={{ animationDelay: '300ms' }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Message bubble
// ---------------------------------------------------------------------------
function MessageBubble({ message }: { message: Message }) {
  const isBot = message.role === 'bot';

  if (isBot) {
    return (
      <div className="flex items-end gap-2 mb-3">
        <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-white text-sm">support_agent</span>
        </div>
        <div className="max-w-[72%]">
          <div className="bg-[#eef0f6] rounded-2xl rounded-bl-sm px-4 py-3">
            <p className="text-sm text-gray-800 leading-relaxed">{message.text}</p>
          </div>
          <p className="text-[10px] text-gray-400 mt-1 ml-1">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end justify-end gap-2 mb-3">
      <div className="max-w-[72%]">
        <div className="gradient-primary rounded-2xl rounded-br-sm px-4 py-3">
          <p className="text-sm text-white leading-relaxed">{message.text}</p>
        </div>
        <p className="text-[10px] text-gray-400 mt-1 text-right mr-1">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
const QUICK_REPLIES = ['Order Status', 'Return Request', 'Payment Issue', 'Other'] as const;

export default function LiveChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'bot',
      text: "Hi there! Welcome to The Curator support. I'm Curator Bot and I'm here to help you today. How can I assist you?",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [quickRepliesVisible, setQuickRepliesVisible] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages or typing state change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setQuickRepliesVisible(false);
    setIsTyping(true);

    // Determine bot response
    const response = CANNED_RESPONSES[text.trim()] ?? DEFAULT_RESPONSE;

    setTimeout(() => {
      setIsTyping(false);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        text: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 1500);
  };

  const handleSend = () => sendMessage(inputText);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#f7f9fc] relative overflow-hidden">
      {/* Header */}
      <header className="glass fixed top-0 left-0 right-0 z-50 mx-auto max-w-md shadow-sm">
        <div className="flex items-center h-16 px-4 gap-3">
          {/* Back button */}
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center justify-center w-10 h-10 -ml-2 rounded-full active:bg-black/5 transition-colors"
            aria-label="Go back"
          >
            <span className="material-symbols-outlined text-gray-700">arrow_back</span>
          </button>

          {/* Bot avatar */}
          <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-white text-lg">support_agent</span>
          </div>

          {/* Title + online indicator */}
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-bold text-gray-900 leading-tight">Live Chat</h1>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-[11px] text-green-600 font-medium">Online</span>
            </div>
          </div>

          {/* More options */}
          <button
            type="button"
            className="flex items-center justify-center w-10 h-10 -mr-2 rounded-full active:bg-black/5 transition-colors"
            aria-label="More options"
          >
            <span className="material-symbols-outlined text-gray-500">more_vert</span>
          </button>
        </div>
      </header>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto pt-20 pb-28 px-4 no-scrollbar">
        {/* Date divider */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-[10px] text-gray-400 font-medium">Today</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {isTyping && <TypingIndicator />}

        {/* Quick reply chips */}
        {quickRepliesVisible && !isTyping && (
          <div className="flex flex-wrap gap-2 mt-2 mb-3">
            {QUICK_REPLIES.map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => sendMessage(label)}
                className="px-3 py-1.5 rounded-full border border-blue-300 bg-white text-xs font-medium text-blue-600 active:bg-blue-50 transition-colors shadow-sm"
              >
                {label}
              </button>
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Sticky input bar */}
      <div className="glass fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-md px-3 py-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          {/* Attach button */}
          <button
            type="button"
            className="flex items-center justify-center w-10 h-10 rounded-full text-gray-400 active:bg-black/5 transition-colors shrink-0"
            aria-label="Attach file"
          >
            <span className="material-symbols-outlined text-xl">attach_file</span>
          </button>

          {/* Text input */}
          <div className="flex-1 bg-gray-100 rounded-full px-4 py-2.5">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
            />
          </div>

          {/* Send button */}
          <button
            type="button"
            onClick={handleSend}
            disabled={!inputText.trim()}
            className={`flex items-center justify-center w-10 h-10 rounded-full shrink-0 transition-all ${
              inputText.trim()
                ? 'gradient-primary shadow-md active:scale-95'
                : 'bg-gray-200 cursor-not-allowed'
            }`}
            aria-label="Send message"
          >
            <span
              className={`material-symbols-outlined text-lg ${
                inputText.trim() ? 'text-white' : 'text-gray-400'
              }`}
            >
              send
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
