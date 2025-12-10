import React, { useState, useEffect, useRef } from 'react';
import { GameState, Language, Achievement } from '../types';
import { TRANSLATIONS } from '../constants';
import { generateStorySegment } from '../services/geminiService';

// --- Utility Components ---

// Simple Markdown Parser (Bold only)
const FormattedText = ({ text }: { text: string }) => {
  if (!text) return null;
  // Split by **bold**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span>
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={index} className="text-primary font-bold text-shadow-sm">{part.slice(2, -2)}</strong>;
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
};

// Typewriter Component (Types raw text, then switches to formatted view on complete to avoid parsing issues during typing)
const TypewriterText = ({ text, speed = 15, onComplete }: { text: string, speed?: number, onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState('');
  const indexRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setDisplayedText('');
    indexRef.current = 0;
    
    // Faster speed for longer text
    const dynamicSpeed = text.length > 300 ? 5 : speed;

    const typeChar = () => {
      if (indexRef.current < text.length) {
        setDisplayedText((prev) => prev + text.charAt(indexRef.current));
        indexRef.current++;
        timeoutRef.current = setTimeout(typeChar, dynamicSpeed);
      } else {
        if (onComplete) onComplete();
      }
    };

    timeoutRef.current = setTimeout(typeChar, dynamicSpeed);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, speed]);

  // While typing, show raw text (including **), but we can try to strip them for cleaner look if needed.
  // For now, raw is fine, it looks "computery".
  return <span className="whitespace-pre-wrap">{displayedText}</span>;
};

// Achievement Toast
const AchievementToast = ({ achievement, onClose, lang }: { achievement: Achievement, onClose: () => void, lang: Language }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 6000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const t = TRANSLATIONS[lang];

  return (
    <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 animate-slide-up w-[90%] max-w-md pointer-events-none">
      <div className="bg-slate-900/95 border border-primary/40 text-white p-4 rounded-xl shadow-[0_0_30px_rgba(217,119,6,0.2)] flex items-center gap-4 backdrop-blur-xl relative overflow-hidden group pointer-events-auto ring-1 ring-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
        <div className="text-4xl animate-bounce">🏆</div>
        <div className="relative z-10 flex-1">
          <h4 className="font-bold text-primary text-xs uppercase tracking-widest mb-1">{t.newAchievementUnlocked}</h4>
          <p className="font-bold text-lg font-serif leading-tight text-slate-100">{achievement.title}</p>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2">{achievement.description}</p>
        </div>
        <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-2">✕</button>
      </div>
    </div>
  );
};

// Inventory Modal
const InventoryModal = ({ inventory, onClose, lang }: { inventory: string[], onClose: () => void, lang: Language }) => {
  const t = TRANSLATIONS[lang];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col transform transition-all scale-100 animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="p-5 bg-slate-800/80 border-b border-slate-700/50 flex justify-between items-center backdrop-blur-md">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xl border border-slate-600 shadow-inner">🎒</div>
             <h2 className="text-xl font-bold text-slate-100 font-sans tracking-wide">
               {t.inventory} <span className="text-slate-400 text-sm ml-2">({inventory.length})</span>
             </h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors flex items-center justify-center">✕</button>
        </div>
        
        <div className="overflow-y-auto p-6 max-h-[60vh] custom-scrollbar bg-slate-900/90">
          {inventory.length === 0 ? (
            <div className="text-center py-10 flex flex-col items-center gap-4 opacity-50">
              <div className="text-4xl grayscale">🕸️</div>
              <p className="text-slate-500 font-serif italic">{t.emptyInventory}</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {inventory.map((item, idx) => (
                <li key={idx} className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/50 flex items-center gap-3 hover:bg-slate-800 transition-colors group">
                  <span className="w-2 h-2 rounded-full bg-primary/50 group-hover:bg-primary transition-colors"></span>
                  <span className="text-slate-200 font-serif group-hover:text-white transition-colors"><FormattedText text={item} /></span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

// Game Over Modal
const GameOverModal = ({ stats, onRestart, lang }: { stats: GameState['stats'], onRestart: () => void, lang: Language }) => {
  const t = TRANSLATIONS[lang];
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/95 animate-fade-in backdrop-blur-md">
       <div className="flex flex-col items-center text-center max-w-lg w-full">
          <div className="text-8xl mb-6 animate-pulse grayscale opacity-80">💀</div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-red-600 mb-2 tracking-wide drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">{t.gameOver}</h1>
          <p className="text-slate-400 text-xl font-serif italic mb-10">{t.youDied}</p>
          
          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 w-full mb-8 shadow-2xl">
            <h3 className="text-slate-500 uppercase tracking-widest text-xs font-bold mb-4 border-b border-slate-800 pb-2">{t.finalScore}</h3>
            <div className="grid grid-cols-2 gap-6">
               <div className="flex flex-col">
                  <span className="text-slate-400 text-sm">{t.daysLived}</span>
                  <span className="text-2xl font-mono text-slate-100">{stats.daysLived}</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-slate-400 text-sm">{t.achievements}</span>
                  <span className="text-2xl font-mono text-primary">{stats.achievements.length}</span>
               </div>
            </div>
          </div>

          <button 
            onClick={onRestart}
            className="px-10 py-4 bg-red-700 hover:bg-red-600 text-white font-bold rounded-full transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_40px_rgba(220,38,38,0.6)] hover:-translate-y-1 active:scale-95 text-lg tracking-wider uppercase"
          >
            {t.restart}
          </button>
       </div>
    </div>
  );
};

// --- Main Component ---

interface GameScreenProps {
  initialState: GameState;
  language: Language;
  onSave: (state: GameState) => void;
  onReset: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ initialState, language, onSave, onReset }) => {
  const t = TRANSLATIONS[language];
  const [state, setState] = useState<GameState>(initialState);
  const [loading, setLoading] = useState<boolean>(false);
  const [customAction, setCustomAction] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Modals & Toasts
  const [showAchievements, setShowAchievements] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Derived state
  const isDead = (state.stats?.health ?? 100) <= 0;

  useEffect(() => {
    // Migration safety
    if (!state.stats) {
       setState(prev => ({
         ...prev,
         stats: { ageYears: 0, daysLived: 0, achievements: [], health: 100, wealth: 0, inventory: [] }
       }));
    }
    
    // Auto-start
    if (!state.currentTurn && state.history.length === 0 && !loading) {
      handleTurn(null);
    }
  }, []);

  const scrollToBottom = () => {
    if (bottomRef.current) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.history, isTyping, loading]);

  const handleTurn = async (action: string | null) => {
    if (isDead) return; // Prevent moves if dead

    setLoading(true);
    let nextHistory = [...state.history];
    if (action) {
      nextHistory.push({ role: 'user', parts: action });
    }

    const currentStats = state.stats || { ageYears: 0, daysLived: 0, achievements: [], health: 100, wealth: 0, inventory: [] };

    const response = await generateStorySegment(state.settings, currentStats, nextHistory, action, language);

    // Update Stats logic
    let updatedStats = { ...currentStats };
    
    if (response.time_passed_days) {
      updatedStats.daysLived += response.time_passed_days;
      updatedStats.ageYears = Math.floor(updatedStats.daysLived / 365);
    }

    if (response.health_change) {
      updatedStats.health = Math.min(100, Math.max(0, updatedStats.health + response.health_change));
    }

    if (response.wealth_change) {
      updatedStats.wealth = Math.max(0, updatedStats.wealth + response.wealth_change);
    }

    if (response.inventory_updates) {
      if (response.inventory_updates.add) {
        updatedStats.inventory = [...updatedStats.inventory, ...response.inventory_updates.add];
      }
      if (response.inventory_updates.remove) {
        const toRemove = response.inventory_updates.remove;
        updatedStats.inventory = updatedStats.inventory.filter(item => !toRemove.includes(item));
      }
    }

    if (response.new_achievement) {
      const ach: Achievement = {
        id: Date.now().toString(),
        title: response.new_achievement.title,
        description: response.new_achievement.description,
      };
      if (!updatedStats.achievements.some(a => a.title === ach.title)) {
        updatedStats.achievements.push(ach);
        setNewAchievement(ach);
      }
    }

    const newState: GameState = {
      ...state,
      stats: updatedStats,
      history: [
        ...nextHistory,
        { role: 'model', parts: response.story_text }
      ],
      currentTurn: {
        storySegment: response.story_text,
        options: response.choices
      },
      turnCount: state.turnCount + 1
    };

    setState(newState);
    onSave(newState);
    setLoading(false);
    setIsTyping(true);
    setCustomAction('');
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customAction.trim() && !isDead) {
      handleTurn(customAction);
    }
  };

  if (!state.stats) return null;

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto h-[90vh] sm:h-[88vh] bg-slate-900/60 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden relative">
      
      {/* --- Sticky HUD --- */}
      <div className="bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 p-3 z-30 shadow-lg sticky top-0">
        <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
          
          {/* Top Row: Info + Actions (Mobile Optimized) */}
          <div className="flex items-center justify-between gap-4 w-full md:w-auto">
             {/* Player Info */}
             <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 flex items-center justify-center text-xl md:text-2xl shadow-inner relative shrink-0">
                  👤
                  {state.stats.health < 20 && <span className="absolute inset-0 rounded-full animate-pulse ring-2 ring-red-500/50"></span>}
                </div>
                <div className="min-w-0 flex flex-col">
                  <h2 className="font-bold text-slate-100 leading-tight font-sans tracking-wide truncate text-sm md:text-base">{state.settings.playerName}</h2>
                  <p className="text-[10px] md:text-xs text-slate-400 font-mono mt-0.5 truncate">{state.settings.country} • {state.settings.year}</p>
                </div>
             </div>

             {/* Actions (visible on right for mobile) */}
             <div className="flex gap-2 shrink-0 md:hidden">
                <button onClick={() => setShowInventory(true)} className="p-2 bg-slate-800 rounded-lg border border-slate-700 text-slate-300">🎒</button>
                <button onClick={onReset} className="p-2 bg-slate-800 rounded-lg border border-slate-700 text-red-400">↺</button>
             </div>
          </div>

          {/* Stats Grid (Scrollable on mobile) */}
          <div className="w-full md:w-auto overflow-x-auto custom-scrollbar pb-1 md:pb-0">
             <div className="flex gap-4 md:gap-6 bg-black/20 p-2 md:p-3 rounded-xl border border-white/5 shadow-inner backdrop-blur-sm items-center min-w-max">
                
                {/* Age */}
                <div className="flex flex-col items-center min-w-[3rem]">
                    <span className="text-[9px] uppercase text-slate-500 font-bold tracking-wider">{t.age}</span>
                    <span className="font-mono text-sm md:text-base text-slate-200 font-bold">{state.stats.ageYears}</span>
                </div>
                <div className="w-px bg-white/10 h-6 self-center"></div>

                {/* Days Lived */}
                <div className="flex flex-col items-center min-w-[3rem]">
                    <span className="text-[9px] uppercase text-slate-500 font-bold tracking-wider">{t.daysLived}</span>
                    <span className="font-mono text-sm md:text-base text-slate-200 font-bold">{state.stats.daysLived}</span>
                </div>
                <div className="w-px bg-white/10 h-6 self-center"></div>

                {/* Wealth */}
                <div className="flex flex-col items-center min-w-[3rem]">
                    <span className="text-[9px] uppercase text-slate-500 font-bold tracking-wider">{t.wealth}</span>
                    <span className="font-mono text-sm md:text-base text-amber-400 font-bold flex items-center gap-1">
                      {state.stats.wealth} <span className="text-[10px] opacity-70">💰</span>
                    </span>
                </div>
                <div className="w-px bg-white/10 h-6 self-center"></div>

                {/* Health Bar */}
                <div className="flex flex-col items-center min-w-[80px] md:min-w-[100px]">
                    <div className="flex justify-between w-full text-[9px] uppercase text-slate-500 font-bold tracking-wider mb-1">
                      <span>{t.health}</span>
                      <span className={`${state.stats.health < 30 ? 'text-red-400 animate-pulse' : 'text-slate-400'}`}>{state.stats.health}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden shadow-inner border border-white/5">
                      <div 
                        className={`h-full transition-all duration-700 ease-out ${state.stats.health > 50 ? 'bg-gradient-to-r from-green-600 to-emerald-500' : state.stats.health > 25 ? 'bg-gradient-to-r from-yellow-600 to-amber-500' : 'bg-gradient-to-r from-red-600 to-rose-500'}`} 
                        style={{ width: `${state.stats.health}%` }}
                      ></div>
                    </div>
                </div>
             </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex gap-2 w-auto justify-end">
            <button 
              onClick={() => setShowInventory(true)}
              className="flex items-center gap-2 px-3 py-2 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl transition-all text-sm font-medium relative group hover:border-primary/50"
            >
              <span className="group-hover:rotate-12 transition-transform duration-300">🎒</span>
              <span className="font-sans">{t.inventory}</span>
              {state.stats.inventory.length > 0 && (
                <span className="bg-slate-600 text-white text-[9px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {state.stats.inventory.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setShowAchievements(true)}
              className="flex items-center gap-2 px-3 py-2 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl transition-all text-sm font-medium relative group hover:border-primary/50"
            >
              <span className="group-hover:scale-125 transition-transform duration-300">🏆</span>
              {state.stats.achievements.length > 0 && (
                <span className="bg-primary text-white text-[9px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-lg shadow-primary/20">
                  {state.stats.achievements.length}
                </span>
              )}
            </button>
            <button onClick={onReset} className="p-2.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all" title={t.startNewGame}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Narrative Scroll Area */}
      <div className="flex-grow overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8 space-y-10 scroll-smooth relative" ref={scrollRef}>
        
        {state.history.map((entry, index) => {
          const isUser = entry.role === 'user';
          const isLastModel = !isUser && index === state.history.length - 1;

          return (
            <div 
              key={index} 
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} ${isUser ? 'animate-slide-up' : 'animate-fade-in'}`}
            >
              {isUser ? (
                // User Action Bubble
                <div className="relative max-w-[85%] sm:max-w-[70%] bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 px-5 py-3 md:px-6 md:py-4 rounded-3xl rounded-tr-none text-slate-200 italic text-base sm:text-lg font-serif shadow-lg group">
                  {entry.parts}
                </div>
              ) : (
                // Model Story Block
                <div className="w-full relative px-1 sm:px-4">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-primary/30 to-transparent opacity-50"></div>
                  <div className="pl-5 rtl:pl-0 rtl:pr-5 text-slate-200 text-lg sm:text-xl md:text-2xl leading-relaxed sm:leading-loose font-serif font-light tracking-wide drop-shadow-sm selection:bg-primary/30">
                    {isLastModel && isTyping ? (
                      <TypewriterText 
                        text={entry.parts} 
                        speed={10} 
                        onComplete={() => setIsTyping(false)} 
                      />
                    ) : (
                      <span className="whitespace-pre-wrap"><FormattedText text={entry.parts} /></span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex flex-col items-center justify-center p-8 opacity-70 animate-pulse">
             <div className="flex space-x-1.5 space-x-reverse mb-2">
               <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
               <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
               <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
             </div>
             <span className="font-serif italic text-sm text-primary/80">{t.loading}</span>
          </div>
        )}

        <div ref={bottomRef} className="h-2" />
      </div>

      {/* Interaction Area (Hidden if Dead) */}
      {!isDead ? (
        <div className="bg-slate-950/80 backdrop-blur-xl border-t border-slate-800 p-4 sm:p-6 z-20 relative shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
          {!loading && state.currentTurn && !isTyping && (
            <div className="max-w-5xl mx-auto animate-slide-up">
              <h3 className="text-center text-slate-400 text-[10px] md:text-xs font-sans uppercase tracking-[0.2em] mb-4 md:mb-6 flex items-center justify-center gap-4">
                <span className="h-px w-8 bg-slate-700"></span>
                {t.whatDo}
                <span className="h-px w-8 bg-slate-700"></span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
                {state.currentTurn.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleTurn(option)}
                    className="group relative overflow-hidden flex flex-col items-start p-4 md:p-5 h-full min-h-[100px] md:min-h-[120px] bg-slate-800/40 hover:bg-slate-800 border border-slate-700/60 hover:border-primary/50 rounded-2xl transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 text-right rtl:text-right ltr:text-left w-full"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/0 to-transparent group-hover:via-primary/70 transition-all duration-500"></div>
                    
                    <span className="mb-2 w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-lg bg-slate-900/50 text-slate-400 group-hover:text-primary group-hover:bg-primary/10 transition-colors text-xs md:text-sm font-bold font-mono border border-slate-700 group-hover:border-primary/30">
                      {idx + 1}
                    </span>
                    
                    <span className="text-slate-300 font-serif text-sm md:text-base leading-snug group-hover:text-white transition-colors">
                      <FormattedText text={option} />
                    </span>
                  </button>
                ))}
              </div>

              <form onSubmit={handleCustomSubmit} className="flex gap-2 md:gap-3 relative group">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    value={customAction}
                    onChange={(e) => setCustomAction(e.target.value)}
                    placeholder={t.customActionPlaceholder}
                    className="w-full p-3 md:p-4 pl-4 pr-12 rounded-2xl bg-slate-900/60 border border-slate-700 text-slate-100 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder-slate-600 shadow-inner hover:bg-slate-900/80 text-sm md:text-base"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </span>
                </div>
                <button 
                  type="submit"
                  disabled={!customAction.trim()}
                  className="px-5 md:px-8 bg-primary hover:bg-primaryHover disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-primary/30 active:scale-95 flex items-center justify-center"
                >
                  <svg className="w-6 h-6 transform rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </form>
            </div>
          )}
          
          {(loading || isTyping) && (
             <div className="h-32 flex items-center justify-center">
               <div className="text-slate-600 font-serif italic text-sm animate-pulse">{loading ? "..." : ""}</div>
             </div>
          )}
        </div>
      ) : null}

      {/* --- Overlays --- */}
      
      {isDead && (
        <GameOverModal stats={state.stats} onRestart={onReset} lang={language} />
      )}

      {showAchievements && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setShowAchievements(false)}>
            <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col transform transition-all scale-100" onClick={e => e.stopPropagation()}>
              <div className="p-6 bg-slate-800/80 border-b border-slate-700/50 flex justify-between items-center backdrop-blur-md">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-xl">🏆</div>
                   <h2 className="text-2xl font-bold text-slate-100 font-sans tracking-wide">
                     {t.achievements} <span className="text-primary text-lg ml-2">{state.stats.achievements.length}</span>
                   </h2>
                </div>
                <button onClick={() => setShowAchievements(false)} className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors flex items-center justify-center">✕</button>
              </div>
              
              <div className="overflow-y-auto p-6 space-y-4 custom-scrollbar bg-slate-900/50">
                {state.stats.achievements.length === 0 ? (
                  <div className="text-center py-20 flex flex-col items-center gap-4">
                    <div className="text-6xl opacity-20 grayscale">🏅</div>
                    <p className="text-slate-500 font-serif italic text-lg">{t.noAchievements}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {state.stats.achievements.map((ach) => (
                      <div key={ach.id} className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 hover:border-primary/40 hover:bg-slate-800/60 transition-all duration-300 group">
                        <div className="flex items-start gap-4">
                          <div className="text-3xl group-hover:scale-110 transition-transform">🏅</div>
                          <div>
                            <h3 className="font-bold text-slate-100 group-hover:text-primary transition-colors">{ach.title}</h3>
                            <p className="text-sm text-slate-400 font-serif mt-1 leading-relaxed">{ach.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
         </div>
      )}

      {showInventory && (
        <InventoryModal 
          inventory={state.stats.inventory} 
          onClose={() => setShowInventory(false)} 
          lang={language} 
        />
      )}

      {newAchievement && (
        <AchievementToast 
          achievement={newAchievement} 
          onClose={() => setNewAchievement(null)} 
          lang={language} 
        />
      )}
    </div>
  );
};

export default GameScreen;