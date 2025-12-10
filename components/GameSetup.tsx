import React, { useState } from 'react';
import { GameSettings, Difficulty, Realism, WorldType, Trait, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface GameSetupProps {
  language: Language;
  onStart: (settings: GameSettings) => void;
}

// Simple SVG Icons
const Icons = {
  User: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Flag: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-8a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5-5 5h-3.586l-.707.707A1 1 0 006 21h3" /></svg>,
  Calendar: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Clock: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Gauge: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  Globe: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Eye: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
  Star: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>,
};

const InputGroup = ({ label, icon, children, fullWidth = false }: { label: string, icon?: React.ReactNode, children?: React.ReactNode, fullWidth?: boolean }) => (
  <div className={`${fullWidth ? 'col-span-2' : 'col-span-2 md:col-span-1'} flex flex-col group`}>
    <label className="mb-2 text-sm font-semibold text-slate-400 group-focus-within:text-primary transition-colors flex items-center gap-2 font-sans tracking-wide">
      {icon && <span className="opacity-70">{icon}</span>}
      {label}
    </label>
    <div className="relative">
      {children}
    </div>
  </div>
);

const GameSetup: React.FC<GameSetupProps> = ({ language, onStart }) => {
  const t = TRANSLATIONS[language];
  const [formData, setFormData] = useState<GameSettings>({
    playerName: '',
    difficulty: Difficulty.MEDIUM,
    year: '2024',
    realism: Realism.MEDIUM,
    trait: Trait.INTELLIGENCE,
    country: '',
    worldType: WorldType.REALISTIC,
    startingAge: 0,
  });

  const isTraitDisabled = 
    formData.difficulty === Difficulty.VERY_HARD || 
    formData.difficulty === Difficulty.IMPOSSIBLE;

  const handleChange = (field: keyof GameSettings, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDifficultyChange = (value: Difficulty) => {
    const shouldDisableTrait = value === Difficulty.VERY_HARD || value === Difficulty.IMPOSSIBLE;
    setFormData(prev => ({
      ...prev,
      difficulty: value,
      trait: shouldDisableTrait ? Trait.NONE : prev.trait
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.playerName && formData.country && formData.year) {
      onStart(formData);
    }
  };

  const inputClasses = "w-full p-3.5 rounded-xl bg-slate-900/40 border border-slate-700 text-slate-100 placeholder-slate-600 focus:bg-slate-900/80 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all duration-300 hover:border-slate-500 hover:bg-slate-800/50 shadow-inner";
  const selectClasses = "w-full p-3.5 rounded-xl bg-slate-900/40 border border-slate-700 text-slate-100 focus:bg-slate-900/80 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all duration-300 cursor-pointer hover:border-slate-500 hover:bg-slate-800/50 appearance-none shadow-inner";
  const arrowIcon = <div className="absolute top-1/2 left-4 rtl:left-auto rtl:right-4 transform -translate-y-1/2 pointer-events-none text-slate-500 group-hover:text-slate-300 transition-colors">▼</div>;

  return (
    <div className="w-full max-w-3xl bg-slate-800/40 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-slate-700/50 relative overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <div className="text-center mb-10 relative z-10">
        <h2 className="text-4xl font-bold text-slate-100 mb-3 font-sans drop-shadow-lg">{t.setupTitle}</h2>
        <div className="h-1.5 w-24 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto rounded-full opacity-80"></div>
      </div>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6 relative z-10">
        
        {/* Name */}
        <InputGroup label={t.playerName} icon={<Icons.User />} fullWidth>
          <input 
            type="text" 
            required
            placeholder={language === 'ar' ? "مثال: أحمد، سارة..." : "Örnek: Ahmet, Ayşe..."}
            className={inputClasses}
            value={formData.playerName}
            onChange={(e) => handleChange('playerName', e.target.value)}
          />
        </InputGroup>

        {/* Country */}
        <InputGroup label={t.country} icon={<Icons.Flag />}>
          <input 
            type="text" 
            required
            placeholder={language === 'ar' ? "مثال: مصر، تركيا..." : "Örnek: Türkiye, Mısır..."}
            className={inputClasses}
            value={formData.country}
            onChange={(e) => handleChange('country', e.target.value)}
          />
        </InputGroup>

        {/* Year */}
        <InputGroup label={t.year} icon={<Icons.Calendar />}>
          <input 
            type="text" 
            required
            placeholder="2024, 1990, 1200 BC"
            className={inputClasses}
            value={formData.year}
            onChange={(e) => handleChange('year', e.target.value)}
          />
        </InputGroup>

        {/* Starting Age */}
        <InputGroup label={t.startingAge} icon={<Icons.Clock />}>
          <input 
            type="number" 
            min="0"
            max="20"
            required
            className={inputClasses}
            value={formData.startingAge}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (!isNaN(val)) {
                if (val > 20) handleChange('startingAge', 20);
                else if (val < 0) handleChange('startingAge', 0);
                else handleChange('startingAge', val);
              } else {
                 handleChange('startingAge', 0);
              }
            }}
          />
        </InputGroup>

        <div className="col-span-2 border-t border-slate-700/50 my-2"></div>

        {/* Difficulty */}
        <InputGroup label={t.difficulty} icon={<Icons.Gauge />}>
          <div className="relative">
             <select 
              className={selectClasses}
              value={formData.difficulty}
              onChange={(e) => handleDifficultyChange(e.target.value as Difficulty)}
            >
              {Object.values(Difficulty).map(d => (
                <option key={d} value={d} className="bg-slate-900">{t.difficultyOptions[d]}</option>
              ))}
            </select>
            {arrowIcon}
          </div>
        </InputGroup>

        {/* World Type */}
        <InputGroup label={t.worldType} icon={<Icons.Globe />}>
          <div className="relative">
            <select 
              className={selectClasses}
              value={formData.worldType}
              onChange={(e) => handleChange('worldType', e.target.value as WorldType)}
            >
              {Object.values(WorldType).map(w => (
                <option key={w} value={w} className="bg-slate-900">{t.worldTypeOptions[w]}</option>
              ))}
            </select>
            {arrowIcon}
          </div>
        </InputGroup>

        {/* Realism */}
        <InputGroup label={t.realism} icon={<Icons.Eye />}>
          <div className="relative">
            <select 
              className={selectClasses}
              value={formData.realism}
              onChange={(e) => handleChange('realism', e.target.value as Realism)}
            >
              {Object.values(Realism).map(r => (
                <option key={r} value={r} className="bg-slate-900">{t.realismOptions[r]}</option>
              ))}
            </select>
            {arrowIcon}
          </div>
        </InputGroup>

        {/* Trait */}
        <InputGroup label={t.trait} icon={<Icons.Star />}>
          <div className="relative">
            <select 
              className={`${selectClasses} ${isTraitDisabled ? 'opacity-50 cursor-not-allowed bg-slate-900/50' : ''}`}
              value={formData.trait}
              disabled={isTraitDisabled}
              onChange={(e) => handleChange('trait', e.target.value as Trait)}
            >
              {Object.values(Trait).map(tr => (
                tr !== Trait.NONE && <option key={tr} value={tr} className="bg-slate-900">{t.traitOptions[tr]}</option>
              ))}
              {isTraitDisabled && <option value={Trait.NONE} className="bg-slate-900">{t.traitOptions[Trait.NONE]}</option>}
            </select>
            {arrowIcon}
          </div>
          {isTraitDisabled && <p className="text-xs text-red-400 mt-2 flex items-center gap-1">⚠️ {t.traitWarning}</p>}
        </InputGroup>

        <div className="col-span-2 mt-6">
          <button 
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-primary to-amber-700 hover:from-amber-500 hover:to-amber-800 text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-primary/40 transform hover:-translate-y-1 active:scale-95 text-lg font-sans tracking-wide border border-white/10 relative overflow-hidden group"
          >
            <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out skew-x-12"></span>
            {t.startGame}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GameSetup;