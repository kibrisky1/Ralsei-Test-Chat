import React, { useState, useEffect } from 'react';
import { Emotion } from '../types';
import { EMOTION_IMAGES } from '../constants';

interface CharacterDisplayProps {
  currentEmotion: Emotion;
  isIntro: boolean;
}

const CharacterDisplay: React.FC<CharacterDisplayProps> = ({ currentEmotion, isIntro }) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  // Preload images to avoid flickering
  useEffect(() => {
    Object.values(EMOTION_IMAGES).forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setLoadedImages((prev) => new Set(prev).add(src));
      };
    });
  }, []);

  const isDead = currentEmotion === Emotion.DEAD;
  const isDarkMood = [Emotion.MAD, Emotion.YANDERE].includes(currentEmotion); 

  return (
    <div className={`relative w-full h-full flex items-center justify-center transition-colors duration-1000 ${isIntro ? 'bg-pink-100' : (isDarkMood ? 'bg-black' : 'bg-white')}`}>
      
      {/* Decorative Circle Background - Hide in dark mood or dead */}
      <div className={`absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full bg-pink-200 blur-3xl opacity-50 transition-all duration-1000 ${isIntro ? 'scale-110' : 'scale-100'} ${(isDarkMood || isDead) ? 'hidden' : 'block'}`} />

      {/* Dark Mood Aura (Only for Mad/Yandere) */}
      {isDarkMood && (
        <div className="absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full bg-red-900 blur-3xl opacity-20 animate-pulse" />
      )}

      {/* Dead Aura - A subtle red puddle/aura */}
      {isDead && (
         <div className="absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full bg-red-100 blur-3xl opacity-30 animate-pulse-slow" />
      )}

      {/* Character Image Container */}
      <div className="relative z-10 w-full h-full flex items-center justify-center p-8">
        {Object.values(Emotion).map((emotion) => {
            const isActive = emotion === currentEmotion;
            
            // Custom animation for the Dead sprite
            // It fades in slowly and has a grayscale/contrast effect
            const deadClasses = (isActive && emotion === Emotion.DEAD) 
                ? 'grayscale contrast-125 animate-fade-in-slow' 
                : '';

            return (
                <img
                    key={emotion}
                    src={EMOTION_IMAGES[emotion]}
                    alt={`Ralsei ${emotion}`}
                    className={`
                        absolute max-w-full max-h-full object-contain transition-all duration-500 ease-in-out filter drop-shadow-xl
                        ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
                        ${deadClasses}
                    `}
                    style={{ maxHeight: '80vh' }}
                />
            );
        })}
      </div>
      
      <style>{`
        @keyframes fadeInSlow {
            0% { opacity: 0; filter: blur(10px) grayscale(100%); }
            100% { opacity: 1; filter: blur(0px) grayscale(100%) contrast(1.25); }
        }
        .animate-fade-in-slow {
            animation: fadeInSlow 3s ease-out forwards;
        }
        .animate-pulse-slow {
            animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default CharacterDisplay;