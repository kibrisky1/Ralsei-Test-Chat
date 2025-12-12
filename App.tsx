import React, { useState } from 'react';
import CharacterDisplay from './components/CharacterDisplay';
import ChatInterface from './components/ChatInterface';
import DeathCutscene from './components/DeathCutscene';
import { Emotion, ChatMessage, Language } from './types';
import { sendMessageToRalsei, resetHistory } from './services/geminiService';
import { getInitialMessage } from './constants';

function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [isIntro, setIsIntro] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<Emotion>(Emotion.WAVING);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [language, setLanguage] = useState<Language>('english');
  const [isDying, setIsDying] = useState(false);

  const startExperience = () => {
    // Start Intro Sequence
    setHasStarted(true);
    setIsIntro(true);
    resetHistory(language);

    // After animation delay, show UI and initial message
    setTimeout(() => {
      const initialMsg: ChatMessage = {
        id: 'init-1',
        role: 'model',
        text: getInitialMessage(language),
        timestamp: Date.now()
      };
      setMessages([initialMsg]);
      setIsIntro(false); 
    }, 2000);
  };

  const handleSendMessage = async (text: string) => {
    // User Message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: Date.now()
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Call API
    const response = await sendMessageToRalsei(text, language);

    setIsTyping(false);
    
    // Model Message
    const modelMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: response.text,
      timestamp: Date.now()
    };
    
    setMessages((prev) => [...prev, modelMsg]);
    
    // Handle Emotion & Death Trigger
    if (response.emotion === Emotion.DEAD && currentEmotion !== Emotion.DEAD) {
      setIsDying(true);
    }
    setCurrentEmotion(response.emotion);
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'english' ? 'italian' : 'english');
  };

  // Pre-load logic or intro screen
  if (!hasStarted) {
    return (
      <div className="w-full h-screen bg-black flex flex-col items-center justify-center text-white p-6 transition-all duration-1000">
        <div className="max-w-md text-center space-y-6">
          <div className="w-24 h-24 mx-auto bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.6)] animate-pulse">
            <span className="text-4xl">💚</span>
          </div>
          <h1 className="text-3xl font-bold font-serif tracking-wider">Ralsei Chat</h1>
          <p className="text-gray-300">
            {language === 'english' ? "A lonely prince is waiting to meet you in the void..." : "Un principe solitario aspetta di incontrarti nel vuoto..."}
          </p>
          
          <div className="flex flex-col gap-4 items-center">
            <button 
                onClick={startExperience}
                className="px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform duration-300 shadow-lg w-full max-w-xs"
            >
                {language === 'english' ? "Start Chat" : "Inizia Chat"}
            </button>
            
            <button 
                onClick={toggleLanguage}
                className="text-sm text-gray-400 hover:text-white transition-colors"
            >
                Language: {language === 'english' ? "English" : "Italiano"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Determine background color based on mood
  const isDead = currentEmotion === Emotion.DEAD;
  const isDarkMood = [Emotion.MAD, Emotion.YANDERE].includes(currentEmotion); 
  
  let bgClass = 'bg-pink-50';
  if (isIntro) {
    bgClass = 'bg-pink-300';
  } else if (isDead) {
    bgClass = 'bg-white';
  } else if (isDarkMood) {
    bgClass = 'bg-black';
  }

  const textColor = isDarkMood ? 'text-white' : 'text-gray-800';

  return (
    <>
      {/* Death Cutscene Overlay */}
      {isDying && (
        <DeathCutscene onComplete={() => setIsDying(false)} />
      )}

      <div className={`w-full h-screen overflow-hidden flex flex-col md:flex-row transition-colors duration-1000 ${bgClass} ${textColor}`}>
        
        {/* Intro Overlay Flash */}
        <div 
          className={`absolute inset-0 z-50 bg-pink-400 pointer-events-none transition-opacity duration-[2000ms] ease-out ${isIntro ? 'opacity-100' : 'opacity-0'}`} 
        />

        {/* Left / Top: Character Visual */}
        <div className="flex-1 h-[45%] md:h-full relative transition-all duration-1000">
          <CharacterDisplay currentEmotion={currentEmotion} isIntro={isIntro} />
        </div>

        {/* Right / Bottom: Chat Interface */}
        <div className="flex-1 h-[55%] md:h-full md:max-w-lg relative z-20">
          <ChatInterface 
            messages={messages} 
            onSendMessage={handleSendMessage}
            isTyping={isTyping}
            language={language}
            onToggleLanguage={toggleLanguage}
            currentEmotion={currentEmotion}
          />
        </div>
      </div>
    </>
  );
}

export default App;