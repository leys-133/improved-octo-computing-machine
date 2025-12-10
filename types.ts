export type Language = 'ar' | 'tr';

export enum Difficulty {
  VERY_EASY = 'very_easy',
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  VERY_HARD = 'very_hard',
  IMPOSSIBLE = 'impossible',
}

export enum Realism {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export enum WorldType {
  HISTORICAL = 'historical',
  REALISTIC = 'realistic',
  FANTASY = 'fantasy',
  POST_APOCALYPTIC = 'post_apocalyptic',
  CYBERPUNK = 'cyberpunk',
}

export enum Trait {
  INTELLIGENCE = 'intelligence',
  PRECISION = 'precision',
  RELIGIOUS = 'religious',
  CHARISMATIC = 'charismatic',
  STRONG = 'strong',
  NONE = 'none', // For Hard+ difficulties
}

export interface GameSettings {
  playerName: string;
  difficulty: Difficulty;
  year: string;
  realism: Realism;
  trait: Trait;
  country: string;
  worldType: WorldType;
  startingAge: number; // Age at game start (0-20)
}

export interface Achievement {
  id: string;
  title: string;
  description: string; // Short description
  icon?: string;
}

export interface CharacterStats {
  ageYears: number;
  daysLived: number;
  achievements: Achievement[];
  health: number; // 0-100
  wealth: number; // Gold/Money
  inventory: string[]; // List of items names
}

export interface TurnData {
  storySegment: string;
  options: string[]; // Always 3 generated options
}

export interface GameState {
  settings: GameSettings;
  stats: CharacterStats;
  history: { role: 'user' | 'model'; parts: string }[];
  currentTurn: TurnData | null;
  turnCount: number;
}

export interface AIResponseSchema {
  story_text: string;
  choices: string[];
  time_passed_days: number; 
  new_achievement?: { title: string; description: string } | null;
  health_change: number; 
  wealth_change?: number; // +/- change in money
  inventory_updates?: {
    add?: string[]; // Items to add
    remove?: string[]; // Items to remove
  } | null;
}