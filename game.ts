export type Role = 'sheep' | 'black_sheep' | 'lost_sheep';

export type BibleCategory = 'characters' | 'places' | 'objects_events' | 'custom';

export interface BibleWordPair {
  id: string;
  category: BibleCategory;
  word1: string;
  word2: string;
  hintOrScripture: string;
}

export interface Player {
  id: string;
  name: string;
  avatarIcon: string;
  color: string;
  score: number;
  gamesPlayed: number;
  winsAsSheep: number;
  winsAsBlackSheep: number;
}

export interface PlayerRoleAssignment {
  playerId: string;
  playerName: string;
  role: Role;
  word: string; // The word shown to this player (or empty for lost_sheep)
  isEliminated: boolean;
  eliminatedInRound?: number;
}

export type GamePhase =
  | 'SETUP'
  | 'PASS_AND_PLAY'
  | 'FIRST_SPEAKER_REVEAL'
  | 'DISCUSSION'
  | 'VOTING'
  | 'ELIMINATION_REVEAL'
  | 'ROUND_OVER';

export interface GameSettings {
  blackSheepCount: number; // 1 or 2
  includeLostSheep: boolean; // 1 lost sheep (optional)
  selectedCategories: BibleCategory[];
  timerDurationSeconds: number; // 60, 90, 120, 180, 0 for off
  soundEnabled: boolean;
}

export interface RoundState {
  roundNumber: number;
  pair: BibleWordPair;
  sheepWord: string;
  blackSheepWord: string;
  assignments: PlayerRoleAssignment[];
  currentPassIndex: number;
  speakerOrder: string[]; // player IDs in order of speaking
  currentSpeakerIndex: number;
  clueRoundNumber: number;
  winner: 'sheep' | 'black_sheep' | 'lost_sheep' | null;
  eliminatedThisRound: PlayerRoleAssignment | null;
}
