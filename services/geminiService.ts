

import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// --- Usage Tracking State ---
let apiCallCount = 0;
let estimatedTokens = 0;
type Listener = (stats: { calls: number, tokens: number }) => void;
const listeners: Listener[] = [];

// Helper to notify all subscribers
const notifyListeners = () => {
  const stats = { calls: apiCallCount, tokens: estimatedTokens };
  listeners.forEach(l => l(stats));
};

// Helper to estimate tokens (rough heuristic: 1 token ~= 4 chars)
const trackUsage = (inputText: string, outputText: string) => {
  apiCallCount++;
  const inputTokens = Math.ceil(inputText.length / 4);
  const outputTokens = Math.ceil(outputText.length / 4);
  estimatedTokens += (inputTokens + outputTokens);
  notifyListeners();
};

export const subscribeToUsage = (listener: Listener) => {
  listeners.push(listener);
  // Send current state immediately upon subscription
  listener({ calls: apiCallCount, tokens: estimatedTokens });
  
  return () => {
    const idx = listeners.indexOf(listener);
    if (idx > -1) listeners.splice(idx, 1);
  };
};

export const getUsageStats = () => ({ calls: apiCallCount, tokens: estimatedTokens });

// --- API Functions ---

export const getRulesInsight = async (topic: string, context: string): Promise<string> => {
  if (!apiKey) return "API Key missing. Cannot fetch insights.";

  const prompt = `You are the official Rules Reference for the Daggerheart TTRPG (Open Beta). 
      
      Your goal is to explain mechanics accurately based on these core systems:
      1. **Duality Dice**: All checks use 2d12 (Hope Die & Fear Die). 
         - Hope >= Fear: Success with Hope (gain 1 Hope).
         - Fear > Hope: Success with Fear (GM gains Fear or complicates).
         - Critical: Doubles on the dice (e.g., 5,5).
      2. **Damage Thresholds**: Damage is NOT subtracted from HP. Incoming damage is compared to Minor, Major, and Severe thresholds to determine how many HP (1-3) to mark.
      3. **Armor**: Armor provides a score (e.g., 5). You must spend an Armor Slot to reduce incoming damage by that score.
      4. **Stress**: A resource for pushing abilities or paying costs. If your Stress is full and you must take more, you mark HP instead.
      
      The user has clicked on: "${topic}".
      Context provided: "${context}".
      
      Instructions:
      - Provide a concise (2-3 sentences) mechanical explanation specific to Daggerheart.
      - If it is a Stat/Trait, explain what it is used for (e.g., Agility for Sprinting/Dodging, Strength for Melee).
      - If it is Damage/HP, explain the Threshold comparison.
      - End with a very short flavor sentence.
      - Do not make things up. If it's a custom ability, explain how it likely interacts with the core rules based on the description.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });

    const text = response.text || "No insight available.";
    trackUsage(prompt, text);
    return text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The spirits are silent (Error fetching data).";
  }
};

export const getNarrativeFlavor = async (characterName: string, action: string, result: string): Promise<string> => {
  if (!apiKey) return "";

  const prompt = `In one short sentence, describe ${characterName} performing ${action} with a result of: ${result}. High fantasy style.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    const text = response.text || "";
    trackUsage(prompt, text);
    return text;
  } catch (error) {
    return "";
  }
};

export const sendChatRuleQuery = async (query: string): Promise<string> => {
    if (!apiKey) return "API Key missing.";
    
    const prompt = `You are a helpful rules assistant for Daggerheart TTRPG.
    User Question: "${query}"
    
    Instructions:
    - Look up DaggerHeart core rules.
    - Check the Character Sheet for Ancestry, Class, Subclass and Level.
    - Answer based on standard Daggerheart rules and information in Character Sheet.
    - Check sequence of ability checks, combat rules and dice rolling.
    - Give advice on what the best next action is, if there is a next action required.
    - Keep your answer under 200 tokens.
    - Be friendly but concise.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const text = response.text || "I am unsure.";
        trackUsage(prompt, text);
        return text;
    } catch (error) {
        console.error("Chat Error:", error);
        return "I cannot answer right now.";
    }
};
