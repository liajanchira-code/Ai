import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Sparkles, Loader2 } from 'lucide-react';

const STATIC_TIPS = [
  "Consistency is the key to building wealth over time. Start small, dream big!",
  "Your financial future starts with smart choices today. Keep growing!",
  "Billionaires didn't start in a day. Patience and discipline lead to success.",
  "Diversify your investments to manage risk effectively. Don't put all eggs in one basket.",
  "Save first, spend later. That's the secret to long-term financial freedom.",
  "Money works for you when you invest it wisely. Start your journey with brac_trading!",
  "Knowledge is the best investment. Learn about markets while you earn."
];

const AIAssistant: React.FC = () => {
  const [advice, setAdvice] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAdvice = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: 'Give a one-sentence encouraging financial investment tip for someone using a trading/investment app called brac_trading. Keep it short and motivating.',
        config: {
          systemInstruction: 'You are a helpful financial assistant for a Bangladeshi mobile banking user.',
          temperature: 0.7,
        },
      });
      setAdvice(response.text || STATIC_TIPS[Math.floor(Math.random() * STATIC_TIPS.length)]);
    } catch (error) {
      console.warn('Gemini Quota/Error (using fallback):', error);
      // Fallback to a random static tip if quota is exhausted
      setAdvice(STATIC_TIPS[Math.floor(Math.random() * STATIC_TIPS.length)]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative overflow-hidden">
      {loading ? (
        <div className="flex items-center space-x-2 text-sm text-gray-400 animate-pulse">
           <Loader2 className="w-4 h-4 animate-spin" />
           <span>Thinking...</span>
        </div>
      ) : (
        <div className="flex items-start space-x-2">
           <Sparkles className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
           <p className="text-sm text-gray-600 italic leading-snug">
             "{advice}"
           </p>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
