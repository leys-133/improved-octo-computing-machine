import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GameSettings, GameState, Language, AIResponseSchema } from '../types';

// Initialize Gemini Client with the specific key requested
const ai = new GoogleGenAI({ apiKey: "AIzaSyDnSPFkkTFWhjxCIknNjoxIrGpqUiu179s" });

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    story_text: {
      type: Type.STRING,
      description: "The narrative text. Use **bold** for key items/names. Engaging, non-repetitive.",
    },
    choices: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Exactly 3 distinct, logical choices. If Health=0, provide empty array or 'Restart' text only (Game handles the rest).",
    },
    time_passed_days: {
      type: Type.NUMBER,
      description: "Estimate days passed. 0 for immediate actions.",
    },
    new_achievement: {
      type: Type.OBJECT,
      nullable: true,
      description: "Significant milestones only.",
      properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
      }
    },
    health_change: {
      type: Type.NUMBER,
      description: "Change in health (-100 to +100).",
    },
    wealth_change: {
      type: Type.NUMBER,
      description: "Change in wealth.",
      nullable: true
    },
    inventory_updates: {
      type: Type.OBJECT,
      nullable: true,
      description: "Items to add/remove.",
      properties: {
        add: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        remove: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        }
      }
    }
  },
  required: ["story_text", "choices", "time_passed_days", "health_change"],
};

const SYSTEM_INSTRUCTION_AR = `
أنت (Game Master) للعبة RPG واقعية.
1. **اللاعب لا يملك عصا سحرية**: ما يكتبه هو "نوايا".
2. **العالم يقاوم**: ضع عقبات وظروف واقعية.
3. **الفشل وارد**: ليس كل فعل ينجح.
4. **الاقتصاد**: إدارة المال والأدوات ضرورية.
5. **الموت**: إذا وصلت الصحة لـ 0، صف مشهد النهاية بشكل درامي. لا تقدم خيارات نجاة.
6. **التنسيق**: استخدم **نص عريض** للأدوات أو الأسماء المهمة.
7. السرد: مشوق، درامي، يصف المشاعر والحواس.
`;

const SYSTEM_INSTRUCTION_TR = `
Sen gerçekçi bir RPG (Game Master) motorusun.
1. **Sihirli Değnek Yok**: Oyuncunun yazdığı "niyet"tir.
2. **Dünya Direnir**: Gerçekçi engeller koy.
3. **Başarısızlık Olası**: Her eylem başarılı olmaz.
4. **Ekonomi**: Para ve eşya yönetimi esastır.
5. **Ölüm**: Sağlık 0 olursa, sonu dramatik bir şekilde anlat. Kurtuluş seçeneği sunma.
6. **Biçimlendirme**: Önemli eşya/isimler için **kalın yazı** kullan.
7. Anlatım: Sürükleyici, duygusal.
`;

export const generateStorySegment = async (
  settings: GameSettings,
  currentStats: GameState['stats'],
  history: GameState['history'],
  lastAction: string | null,
  lang: Language
): Promise<AIResponseSchema> => {
  
  const systemInstruction = lang === 'ar' ? SYSTEM_INSTRUCTION_AR : SYSTEM_INSTRUCTION_TR;
  
  let promptContext = "";
  const inventoryList = currentStats.inventory.length > 0 ? currentStats.inventory.join(", ") : "None";
  
  if (!lastAction) {
    // Game Start
    promptContext = `
    START GAME:
    Name: ${settings.playerName}
    Year: ${settings.year}
    Country: ${settings.country}
    Roleplay: ${settings.worldType}
    Difficulty: ${settings.difficulty}
    Starting Age: ${settings.startingAge}
    
    Instruction: Generate the opening scene. Use **bold** for key elements.
    If Age > 5, give small starter wealth/items via JSON.
    `;
  } else {
    // Next Turn
    promptContext = `
    CONTINUE STORY:
    Stats: [Age:${currentStats.ageYears}, Health:${currentStats.health}%, Wealth:${currentStats.wealth}, Items:${inventoryList}]
    Action: "${lastAction}"
    
    Logic:
    1. Check Difficulty (${settings.difficulty}). Harder = more failure/cost.
    2. Check Capabilities. Do they have the item/money? If not, fail the action.
    3. Calculate Consequences (Health, Money, Time).
    4. Format: Use **bold** for key entities.
    `;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        ...history.map(h => ({
           role: h.role,
           parts: [{ text: h.parts }]
        })),
        { role: 'user', parts: [{ text: promptContext }] }
      ],
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.95,
      }
    });

    const jsonText = response.text || "{}";
    const data = JSON.parse(jsonText) as AIResponseSchema;
    
    if (!data.story_text || !Array.isArray(data.choices)) {
       throw new Error("Invalid AI response format");
    }

    return data;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      story_text: lang === 'ar' 
        ? "حدث خطأ في الاتصال بالقدر... (يرجى المحاولة مرة أخرى)" 
        : "Kaderle bağlantı hatası... (Lütfen tekrar deneyin)",
      choices: lang === 'ar' ? ["حاول مرة أخرى"] : ["Tekrar dene"],
      time_passed_days: 0,
      health_change: 0,
      wealth_change: 0,
      inventory_updates: null,
      new_achievement: null
    };
  }
};