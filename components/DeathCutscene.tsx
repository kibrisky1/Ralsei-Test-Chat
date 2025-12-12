import React, { useEffect, useState, useRef } from 'react';

interface DeathCutsceneProps {
  onComplete: () => void;
}

const DeathCutscene: React.FC<DeathCutsceneProps> = ({ onComplete }) => {
  const [fadingOut, setFadingOut] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Preload and play sounds manually to ensure they play even if video is muted/silent
    // Timings are approximated to match the standard Undertale death animation
    const breakSound = new Audio('https://raw.githubusercontent.com/kyle1373/Undertale-Web/master/audio/snd_break1.wav');
    const shatterSound = new Audio('https://raw.githubusercontent.com/kyle1373/Undertale-Web/master/audio/snd_break2.wav');
    breakSound.volume = 0.8;
    shatterSound.volume = 0.8;

    const sequence = async () => {
      // Small delay before crack to match video start
      await new Promise(r => setTimeout(r, 600)); 
      breakSound.play().catch(e => console.warn("Audio play failed:", e));

      // Delay before shatter
      await new Promise(r => setTimeout(r, 1600)); 
      shatterSound.play().catch(e => console.warn("Audio play failed:", e));
    };

    sequence();
  }, []);

  const handleVideoEnd = () => {
    // Start fade out sequence when video finishes
    setFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  return (
    <div className={`fixed inset-0 z-[100] bg-black flex items-center justify-center transition-opacity duration-[2000ms] ${fadingOut ? 'opacity-0' : 'opacity-100'}`}>
      {/* 
        Using object-contain to ensure the pixel art doesn't stretch weirdly, 
        but it fills the available screen space against the black background.
        'muted' ensures autoplay works on most browsers; we play sound manually.
      */}
      <video 
        ref={videoRef}
        src="https://i.imgur.com/PLHVzeB.mp4" 
        autoPlay 
        playsInline
        muted 
        onEnded={handleVideoEnd}
        className="w-full h-full object-contain pointer-events-none"
      />
    </div>
  );
};

export default DeathCutscene;