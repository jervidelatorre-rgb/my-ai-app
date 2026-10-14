import { BibleWordPair, GameSettings, Player, PlayerRoleAssignment, Role, RoundState } from '../types/game';

export const PLAYER_COLORS = [
  { bg: 'bg-amber-600', text: 'text-amber-100', border: 'border-amber-400', badge: '#D97706' },
  { bg: 'bg-blue-600', text: 'text-blue-100', border: 'border-blue-400', badge: '#2563EB' },
  { bg: 'bg-emerald-600', text: 'text-emerald-100', border: 'border-emerald-400', badge: '#059669' },
  { bg: 'bg-purple-600', text: 'text-purple-100', border: 'border-purple-400', badge: '#7C3AED' },
  { bg: 'bg-rose-600', text: 'text-rose-100', border: 'border-rose-400', badge: '#E11D48' },
  { bg: 'bg-cyan-600', text: 'text-cyan-100', border: 'border-cyan-400', badge: '#0891B2' },
  { bg: 'bg-indigo-600', text: 'text-indigo-100', border: 'border-indigo-400', badge: '#4F46E5' },
  { bg: 'bg-orange-600', text: 'text-orange-100', border: 'border-orange-400', badge: '#EA580C' },
  { bg: 'bg-teal-600', text: 'text-teal-100', border: 'border-teal-400', badge: '#0D9488' },
  { bg: 'bg-violet-600', text: 'text-violet-100', border: 'border-violet-400', badge: '#8B5CF6' },
  { bg: 'bg-yellow-600', text: 'text-yellow-100', border: 'border-yellow-400', badge: '#CA8A04' },
  { bg: 'bg-sky-600', text: 'text-sky-100', border: 'border-sky-400', badge: '#0284C7' },
  { bg: 'bg-lime-600', text: 'text-lime-100', border: 'border-lime-400', badge: '#65A30D' },
  { bg: 'bg-fuchsia-600', text: 'text-fuchsia-100', border: 'border-fuchsia-400', badge: '#C026D3' },
  { bg: 'bg-stone-600', text: 'text-stone-100', border: 'border-stone-400', badge: '#57534E' },
];

export const SUGGESTED_NAMES = [
  'Brother Peter', 'Sister Mary', 'Pastor David', 'Hannah',
  'Timothy', 'Grace', 'Joshua', 'Esther',
  'Caleb', 'Abigail', 'Samuel', 'Lydia',
  'Gideon', 'Ruth', 'Barnabas'
];

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function generateRoundRoles(
  players: Player[],
  settings: GameSettings,
  availablePairs: BibleWordPair[]
): RoundState {
  if (players.length < 3) {
    throw new Error('At least 3 players required');
  }

  // Filter word pairs by category
  let candidatePairs = availablePairs.filter(p => settings.selectedCategories.includes(p.category));
  if (candidatePairs.length === 0) {
    candidatePairs = availablePairs;
  }
  const selectedPair = candidatePairs[Math.floor(Math.random() * candidatePairs.length)];

  // Randomly assign which is sheep word and which is black sheep word
  const flip = Math.random() > 0.5;
  const sheepWord = flip ? selectedPair.word1 : selectedPair.word2;
  const blackSheepWord = flip ? selectedPair.word2 : selectedPair.word1;

  // Determine roles count
  // If 3-5 players: max 1 black sheep
  // If 6+ players: user settings (1 or 2)
  const actualBlackSheepCount = players.length <= 4 ? 1 : Math.min(settings.blackSheepCount, Math.floor(players.length / 3));
  const actualLostSheepCount = settings.includeLostSheep && players.length >= 5 ? 1 : 0;
  const sheepCount = players.length - actualBlackSheepCount - actualLostSheepCount;

  const roleDeck: Role[] = [
    ...Array(sheepCount).fill('sheep'),
    ...Array(actualBlackSheepCount).fill('black_sheep'),
    ...Array(actualLostSheepCount).fill('lost_sheep'),
  ];

  const shuffledRoles = shuffleArray(roleDeck);
  const shuffledPlayers = shuffleArray(players);

  const assignments: PlayerRoleAssignment[] = shuffledPlayers.map((player, idx) => {
    const role = shuffledRoles[idx];
    let word = sheepWord;
    if (role === 'black_sheep') {
      word = blackSheepWord;
    } else if (role === 'lost_sheep') {
      word = '??? (No Word)';
    }

    return {
      playerId: player.id,
      playerName: player.name,
      role,
      word,
      isEliminated: false,
    };
  });

  // Turn/pass order: keep player list orderly so it's predictable to pass around
  // But randomize initial speaker for the clue circle!
  const alivePlayerIds = assignments.map(a => a.playerId);
  const speakerOrder = shuffleArray(alivePlayerIds);

  return {
    roundNumber: 1,
    pair: selectedPair,
    sheepWord,
    blackSheepWord,
    assignments,
    currentPassIndex: 0,
    speakerOrder,
    currentSpeakerIndex: 0,
    clueRoundNumber: 1,
    winner: null,
    eliminatedThisRound: null,
  };
}

export function checkVictoryCondition(
  assignments: PlayerRoleAssignment[]
): 'sheep' | 'black_sheep' | 'lost_sheep' | null {
  const aliveSheep = assignments.filter(a => !a.isEliminated && a.role === 'sheep');
  const aliveBlackSheep = assignments.filter(a => !a.isEliminated && a.role === 'black_sheep');
  const aliveLostSheep = assignments.filter(a => !a.isEliminated && a.role === 'lost_sheep');

  // If all black sheep are eliminated:
  if (aliveBlackSheep.length === 0) {
    if (aliveLostSheep.length > 0 && aliveSheep.length === 0) {
      return 'lost_sheep';
    }
    return 'sheep';
  }

  // If black sheep count is greater than or equal to innocent sheep
  if (aliveBlackSheep.length >= (aliveSheep.length + aliveLostSheep.length)) {
    return 'black_sheep';
  }

  // Still active game
  return null;
}

export function updatePlayerScores(
  players: Player[],
  assignments: PlayerRoleAssignment[],
  winner: 'sheep' | 'black_sheep' | 'lost_sheep'
): Player[] {
  return players.map(player => {
    const assign = assignments.find(a => a.playerId === player.id);
    if (!assign) return player;

    let pointsEarned = 0;
    let wonAsSheep = 0;
    let wonAsBlackSheep = 0;

    if (winner === 'sheep') {
      if (assign.role === 'sheep') {
        pointsEarned += 2; // base win for faithful flock
        wonAsSheep = 1;
        if (!assign.isEliminated) {
          pointsEarned += 1; // bonus for surviving
        }
      }
    } else if (winner === 'black_sheep') {
      if (assign.role === 'black_sheep') {
        pointsEarned += 3; // Impostors triumph
        wonAsBlackSheep = 1;
        if (!assign.isEliminated) {
          pointsEarned += 1; // survival bonus
        }
      }
    } else if (winner === 'lost_sheep') {
      if (assign.role === 'lost_sheep') {
        pointsEarned += 4;
      }
    }

    // Consolation for black sheep surviving till later rounds
    if (assign.role === 'black_sheep' && assign.eliminatedInRound && assign.eliminatedInRound > 1) {
      pointsEarned += 1;
    }

    return {
      ...player,
      score: player.score + pointsEarned,
      gamesPlayed: player.gamesPlayed + 1,
      winsAsSheep: player.winsAsSheep + wonAsSheep,
      winsAsBlackSheep: player.winsAsBlackSheep + wonAsBlackSheep,
    };
  });
}
