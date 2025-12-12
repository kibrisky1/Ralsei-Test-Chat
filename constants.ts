import { Emotion, Language } from './types';

export const EMOTION_IMAGES: Record<Emotion, string> = {
  [Emotion.WAVING]: 'https://imgur.com/5p03SMs.png',
  [Emotion.NEUTRAL]: 'https://imgur.com/9K4aTR9.png',
  [Emotion.SAD]: 'https://imgur.com/popSt9R.png',
  [Emotion.INTRUSIVE]: 'https://imgur.com/F43gtVp.png',
  [Emotion.SHOCKED]: 'https://imgur.com/FKyAtqw.png',
  [Emotion.SLIGHT_COMPLIMENT]: 'https://imgur.com/yHZAoav.png',
  [Emotion.MEDIUM_COMPLIMENT]: 'https://imgur.com/Dmczyic.png',
  [Emotion.HIGH_COMPLIMENT]: 'https://imgur.com/dEjz1QB.png',
  [Emotion.FLUSTERED_TALKING]: 'https://imgur.com/LLhUf7d.png',
  
  // New Moods
  [Emotion.MAD]: 'https://imgur.com/Hya70KN.png',
  [Emotion.LOVE_1]: 'https://imgur.com/7k62sBu.png',
  [Emotion.LOVE_2]: 'https://imgur.com/rTq1Nus.png',
  [Emotion.LOVE_3]: 'https://imgur.com/8ho4oP4.png',
  [Emotion.YANDERE]: 'https://imgur.com/gGqBpP9.png',
  [Emotion.DEAD]: 'https://imgur.com/VMICoHw.png',
};

export const INITIAL_MESSAGE_EN: string = "O-oh! Hello there! I didn't expect to see anyone here in the dark... I'm Ralsei! It's so nice to meet you! *smiles sweetly*";
export const INITIAL_MESSAGE_IT: string = "O-oh! Ciao! Non mi aspettavo di vedere nessuno qui nel buio... Io sono Ralsei! È un piacere conoscerti! *sorride dolcemente*";

export const getInitialMessage = (language: Language) => 
  language === 'italian' ? INITIAL_MESSAGE_IT : INITIAL_MESSAGE_EN;