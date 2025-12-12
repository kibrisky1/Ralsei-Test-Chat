export enum Emotion {
  WAVING = 'waving',
  NEUTRAL = 'neutral',
  SAD = 'sad',
  INTRUSIVE = 'intrusive',
  SHOCKED = 'shocked',
  SLIGHT_COMPLIMENT = 'slight_compliment',
  MEDIUM_COMPLIMENT = 'medium_compliment',
  HIGH_COMPLIMENT = 'high_compliment',
  FLUSTERED_TALKING = 'flustered_talking',
  
  // New Moods
  MAD = 'mad',
  LOVE_1 = 'love_1',
  LOVE_2 = 'love_2',
  LOVE_3 = 'love_3',
  YANDERE = 'yandere',
  DEAD = 'dead'
}

export type Language = 'english' | 'italian';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface RalseiResponse {
  text: string;
  emotion: Emotion;
}