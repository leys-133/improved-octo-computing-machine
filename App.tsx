import React, { useState, useEffect } from 'react';
import { Language, GameState, GameSettings } from './types';
import { TRANSLATIONS } from './constants';
import GameSetup from './components/GameSetup';
import GameScreen from './components/GameScreen';

const STORAGE_KEY = 'narrative_engine_save_v2'; 

function App() {
  const [language, setLanguage] = useState<Language>('ar');
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [hasSave, setHasSave] = useState(false);

  // Load save on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setHasSave(true);
    }
  }, []);

  // Update HTML direction based on language
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    if (language === 'tr') {
      document.body.classList.remove('font-serif');
      document.body.classList.add('font-sans');
    } else {
       // Reset for Arabic
       document.body.classList.remove('font-sans');
       document.body.classList.add('font-serif');
    }
  }, [language]);

  const handleStartGame = (settings: GameSettings) => {
    const initialDays = settings.startingAge * 365;
    const initialState: GameState = {
      settings,
      stats: {
        ageYears: settings.startingAge,
        daysLived: initialDays,
        health: 100,
        wealth: settings.startingAge > 10 ? 50 : 0, // Bonus gold if older
        inventory: [],
        achievements: []
      },
      history: [],
      currentTurn: null,
      turnCount: 0
    };
    setGameState(initialState);
  };

  const handleLoadGame = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migration: Ensure new fields exist in old saves
      if (!parsed.stats) {
        parsed.stats = {
          ageYears: 0,
          daysLived: 0,
          health: 100,
          wealth: 0,
          inventory: [],
          achievements: []
        };
      } else {
        if (typeof parsed.stats.wealth === 'undefined') parsed.stats.wealth = 0;
        if (typeof parsed.stats.inventory === 'undefined') parsed.stats.inventory = [];
      }
      setGameState(parsed);
    }
  };

  const handleSaveGame = (state: GameState) => {
    setGameState(state);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    setHasSave(true);
  };

  const handleReset = () => {
    if (window.confirm(TRANSLATIONS[language].resetConfirm)) {
      localStorage.removeItem(STORAGE_KEY);
      setGameState(null);
      setHasSave(false);
    }
  };

  const t = TRANSLATIONS[language];

  return (
    <div className="min-h-screen flex flex-col bg-darkBg text-slate-100 relative overflow-hidden font-sans">
      
      {/* Background Effects */}
      <div className="bg-noise-overlay fixed inset-0 z-0"></div>
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] animate-float"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Header */}
      <header className="px-6 py-5 border-b border-slate-800/50 bg-slate-950/60 sticky top-0 z-50 backdrop-blur-xl shadow-sm transition-all">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 hover:scale-105 transition-transform duration-300 origin-left cursor-default">
            <span className="text-3xl filter drop-shadow-md">📜</span>
            <div className="flex flex-col">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-100 font-sans tracking-wide drop-shadow-sm leading-none">
                {t.title}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                 <span className="h-0.5 w-8 bg-primary rounded-full"></span>
                 <span className="text-[10px] font-bold text-primary uppercase tracking-widest opacity-80">v1.2</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setLanguage(prev => prev === 'ar' ? 'tr' : 'ar')}
            className="px-4 py-2 text-xs sm:text-sm font-bold border border-slate-700 bg-slate-800/40 rounded-full hover:border-primary hover:text-white hover:bg-primary/10 transition-all duration-300 shadow-sm backdrop-blur-md flex items-center gap-2"
          >
            <span>{language === 'ar' ? '🇹🇷' : '🇸🇦'}</span>
            <span className="hidden sm:inline">{language === 'ar' ? 'Türkçe' : 'العربية'}</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 sm:p-6 lg:p-8 relative z-10 flex flex-col items-center">
        {!gameState ? (
          <div className="w-full max-w-5xl flex flex-col items-center space-y-10 mt-6 sm:mt-10 animate-fade-in">
            {hasSave && (
              <button
                onClick={handleLoadGame}
                className="w-full max-w-lg p-6 bg-slate-800/60 border border-slate-700/60 hover:border-primary/50 rounded-2xl shadow-xl hover:shadow-2xl hover:bg-slate-800/80 transition-all duration-300 group flex items-center justify-between backdrop-blur-xl transform hover:-translate-y-1"
              >
                <div className="flex flex-col items-start">
                  <span className="text-xl font-bold text-slate-100 mb-1 font-sans">{t.continueGame}</span>
                  <span className="text-sm text-slate-400 group-hover:text-primary/90 transition-colors">استكمل رحلتك من حيث توقفت</span>
                </div>
                <div className="w-12 h-12 rounded-full bg-slate-700/50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all border border-slate-600 group-hover:border-primary">
                  <svg className="w-6 h-6 transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </div>
              </button>
            )}
            
            <GameSetup language={language} onStart={handleStartGame} />
          </div>
        ) : (
          <GameScreen 
            initialState={gameState} 
            language={language} 
            onSave={handleSaveGame}
            onReset={handleReset}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-slate-800/30 bg-slate-950/40 backdrop-blur-sm relative z-10">
        <div className="max-w-3xl mx-auto flex flex-col gap-3">
          <p className="font-sans font-bold text-slate-500 hover:text-primary transition-colors cursor-default tracking-wide text-sm">
            {t.footer}
          </p>
          <div className="flex items-center justify-center gap-3 text-xs text-slate-600">
             <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
             <p className="font-serif italic opacity-60 hover:opacity-100 transition-opacity">{t.versionNote}</p>
             <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;