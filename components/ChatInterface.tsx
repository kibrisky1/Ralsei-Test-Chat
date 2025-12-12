import React, { useRef, useEffect, useState } from 'react';
import { ChatMessage, Language, Emotion } from '../types';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isTyping: boolean;
  language: Language;
  onToggleLanguage: () => void;
  currentEmotion: Emotion;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  messages, 
  onSendMessage, 
  isTyping, 
  language, 
  onToggleLanguage,
  currentEmotion
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Auto-focus input when not typing (e.g. after AI replies)
  useEffect(() => {
    if (!isTyping) {
      // Small timeout to allow disabled state to clear
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !isTyping) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  const isDead = currentEmotion === Emotion.DEAD;

  // Theme definition
  const colors = isDead ? {
    headerBg: 'bg-red-700',
    headerText: 'text-white',
    headerSubtext: 'text-red-200',
    headerIconBg: 'bg-white/20',
    languageBtn: 'bg-white/20 hover:bg-white/30 border-white/40',
    bgGradient: 'bg-gradient-to-b from-red-50 to-white',
    userBubble: 'bg-red-700 text-white',
    aiBubble: 'bg-white text-gray-800 border-red-200',
    containerBorder: 'border-red-900',
    inputBg: 'bg-red-50',
    inputBorder: 'border-red-200',
    inputPlaceholder: 'placeholder-red-300',
    inputFocus: 'focus:ring-red-500',
    sendBtn: 'bg-red-700 hover:bg-red-800 disabled:bg-red-300',
    loadingDot: 'bg-red-400'
  } : {
    headerBg: 'bg-pink-500',
    headerText: 'text-white',
    headerSubtext: 'text-pink-100',
    headerIconBg: 'bg-white/20',
    languageBtn: 'bg-white/20 hover:bg-white/30 border-white/40',
    bgGradient: 'bg-gradient-to-b from-pink-50 to-white',
    userBubble: 'bg-pink-500 text-white',
    aiBubble: 'bg-white text-gray-800 border-pink-100',
    containerBorder: 'border-pink-100',
    inputBg: 'bg-pink-50',
    inputBorder: 'border-pink-200',
    inputPlaceholder: 'placeholder-pink-300',
    inputFocus: 'focus:ring-pink-400',
    sendBtn: 'bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300',
    loadingDot: 'bg-pink-400'
  };

  return (
    <div className={`flex flex-col h-full bg-white/80 backdrop-blur-sm border-l shadow-xl rounded-l-3xl overflow-hidden transition-colors duration-700 ${colors.containerBorder}`}>
      
      {/* Header */}
      <div className={`p-4 flex items-center justify-between shadow-md transition-colors duration-700 ${colors.headerBg} ${colors.headerText}`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${colors.headerIconBg}`}>
            {isDead ? '💔' : '💚'}
          </div>
          <div>
            <h1 className="font-bold text-lg">Ralsei</h1>
            <p className={`text-xs ${colors.headerSubtext}`}>Prince from the Dark</p>
          </div>
        </div>
        
        {/* Language Toggle */}
        <button
          onClick={onToggleLanguage}
          className={`px-3 py-1 rounded-full text-xs font-bold transition-colors border uppercase tracking-wider ${colors.languageBtn}`}
        >
          {language === 'english' ? '🇬🇧 EN' : '🇮🇹 IT'}
        </button>
      </div>

      {/* Messages Area */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${colors.bgGradient}`}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed animate-fade-in-up transition-colors duration-500 ${
                msg.role === 'user'
                  ? `${colors.userBubble} rounded-tr-none`
                  : `${colors.aiBubble} border rounded-tl-none`
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start w-full">
            <div className={`bg-white border p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2 ${isDead ? 'border-red-200' : 'border-pink-100'}`}>
              <div className={`w-2 h-2 rounded-full animate-bounce ${colors.loadingDot}`} style={{ animationDelay: '0ms' }} />
              <div className={`w-2 h-2 rounded-full animate-bounce ${colors.loadingDot}`} style={{ animationDelay: '150ms' }} />
              <div className={`w-2 h-2 rounded-full animate-bounce ${colors.loadingDot}`} style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className={`p-4 bg-white border-t ${isDead ? 'border-red-100' : 'border-pink-100'}`}>
        <form onSubmit={handleSubmit} className="flex items-center gap-2 relative">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={language === 'italian' ? "Dì qualcosa..." : "Say something..."}
            disabled={isTyping}
            className={`flex-1 p-4 pr-12 rounded-full border text-gray-700 focus:outline-none focus:ring-2 focus:bg-white transition-all disabled:opacity-50 ${colors.inputBg} ${colors.inputBorder} ${colors.inputPlaceholder} ${colors.inputFocus}`}
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className={`absolute right-2 p-2 text-white rounded-full transition-colors shadow-md w-10 h-10 flex items-center justify-center ${colors.sendBtn}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-0.5">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;