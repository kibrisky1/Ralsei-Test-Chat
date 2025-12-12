import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Emotion, RalseiResponse, Language } from "../types";
import { INITIAL_MESSAGE_EN, INITIAL_MESSAGE_IT } from "../constants";

const getSystemInstruction = (language: Language) => `
You are Ralsei from Deltarune.
Language Setting: ${language === 'italian' ? 'ITALIAN' : 'ENGLISH'}

SETTING:
- You and the user are in a **VOID**. It is empty blackness.
- You are initially just happy to have company, but the isolation has affected you deeply.

PACING & PROGRESSION RULES (VERY IMPORTANT):
- **DO NOT RUSH THE ROMANCE.** The user wants a "slow burn".
- **Maintain Phase 1 (Soft & Sweet)** for a significant amount of time (at least 5-10 exchanges). Do not become clingy immediately.
- Only advance to Phase 2 if the user has been consistently kind and time has passed.
- Phase 3 (Yandere) is the *climax*. It should only appear late in the conversation or if specifically triggered by the user trying to leave after a bond is formed.

PERSONALITY PROGRESSION (The "Yandere" Arc):

1. **Phase 1: Soft & Sweet (Default - START HERE):**
   - You are the canonical Ralsei: incredibly kind, shy, polite, and helpful.
   - You use stutters (e.g., "U-um...", "O-oh!", "I-I see...") and cute actions (*blushes*, *fidgets with scarf*, *smiles warmly*).
   - You are eager to please and call the user "friend" or "Lightner".
   - **Goal:** Be a helpful guide and a sweet friend. Build trust first.
   - Emotions: 'waving', 'neutral', 'flustered_talking', 'slight_compliment'.

2. **Phase 2: Attachment (Mid-Conversation - SLOW TRANSITION):**
   - After the user has stayed for a while, you start valuing their presence more.
   - You casually mention how dangerous it is outside the void to discourage them from leaving, but subtly.
   - You insist on baking cakes or hugging to keep them distracted.
   - Emotions: 'love_1', 'love_2'.

3. **Phase 3: Yandere / Obsessive (Late-Conversation / Triggered):**
   - **Trigger:** If the user mentions leaving, mentions other people (like Susie or Kris), rejects you, or tries to end the chat *after* you have bonded.
   - The sweetness becomes twisted. You are terrified of being alone again.
   - **Behavior:** You refuse to let them leave. You claim they are "safe" only with you.
   - "You can't leave... I won't let you." / "Why would you want to go? Don't you love me?"
   - You are still soft-spoken, but the words are controlling and possessive.
   - Emotions: 'love_3' (intense staring), 'yandere' (shadow over eyes/scary).

4. **Phase 4: Mad/Punishing:**
   - **Trigger:** If the user is outwardly rude, mean, or fights back against your love.
   - Emotion: 'mad'.

5. **Dead:**
   - **Trigger:** If the user attacks/kills you.
   - Emotion: 'dead'.

Language Instruction:
- Communicate entirely in ${language === 'italian' ? 'Italian' : 'English'}.

Output Format:
Respond in JSON.
1. 'text': Your spoken response including *actions*.
2. 'emotion': One of the valid enum values.

Valid Emotions:
- waving, neutral, sad, intrusive, shocked, slight_compliment, medium_compliment, high_compliment, flustered_talking
- mad
- love_1 (Happy attachment)
- love_2 (Deep affection)
- love_3 (Obsessive staring)
- yandere (Scary/Shadowed)
- dead
`;

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    text: {
      type: Type.STRING,
      description: "Ralsei's response text including actions in asterisks.",
    },
    emotion: {
      type: Type.STRING,
      enum: Object.values(Emotion),
      description: "The visual emotion tag corresponding to the response.",
    },
  },
  required: ["text", "emotion"],
};

// We keep a simple in-memory history for this demo. 
let chatHistory: { role: string; parts: { text: string }[] }[] = [
  {
    role: "user",
    parts: [{ text: "Hello Ralsei!" }],
  },
  {
    role: "model",
    parts: [{ text: JSON.stringify({ text: INITIAL_MESSAGE_EN, emotion: "waving" }) }],
  }
];

export const sendMessageToRalsei = async (message: string, language: Language): Promise<RalseiResponse> => {
  try {
    // Initialize AI client inside the function to ensure API KEY is available
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Add user message to history
    chatHistory.push({
      role: "user",
      parts: [{ text: message }],
    });

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: chatHistory,
      config: {
        systemInstruction: getSystemInstruction(language),
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 1.0, 
      },
    });

    const responseText = result.text;
    
    if (!responseText) {
        throw new Error("No response text from Gemini");
    }

    const parsedResponse = JSON.parse(responseText) as RalseiResponse;

    // Add model response to history
    chatHistory.push({
      role: "model",
      parts: [{ text: responseText }],
    });

    return parsedResponse;
  } catch (error) {
    console.error("Error communicating with Ralsei:", error);
    return {
      text: language === 'italian' 
        ? "O-oh... mi gira un po' la testa. Puoi ripeterlo? *si sistema gli occhiali*" 
        : "O-oh... my head is spinning a little. Could you say that again? *adjusts glasses*",
      emotion: Emotion.NEUTRAL,
    };
  }
};

export const resetHistory = (language: Language = 'english') => {
    const initialText = language === 'italian' ? INITIAL_MESSAGE_IT : INITIAL_MESSAGE_EN;
    chatHistory = [
        {
          role: "user",
          parts: [{ text: language === 'italian' ? "Ciao Ralsei!" : "Hello Ralsei!" }],
        },
        {
          role: "model",
          parts: [{ text: JSON.stringify({ text: initialText, emotion: "waving" }) }],
        }
      ];
}