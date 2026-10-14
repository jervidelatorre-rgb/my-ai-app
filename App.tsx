/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GamePhase, GameSettings, Player, RoundState, BibleWordPair } from './types/game';
import { INITIAL_BIBLE_WORD_PAIRS } from './data/bibleWordPairs';
import { generateRoundRoles, checkVictoryCondition, updatePlayerScores, PLAYER_COLORS, SUGGESTED_NAMES } from './utils/gameLogic';
import { sounds } from './utils/audio';

import { Header } from './components/Header';
import { PlayerSetup } from './components/PlayerSetup';
import { PassAndPlay } from './components/PassAndPlay';
import { DiscussionPhase } from './components/DiscussionPhase';
import { VotingPhase } from './components/VotingPhase';
import { EliminationRevealModal } from './components/EliminationRevealModal';
import { RoundOver } from './components/RoundOver';
import { LeaderboardModal } from './components/LeaderboardModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { CustomWordPairsModal } from './components/CustomWordPairsModal';

const DEFAULT_PLAYERS: Player[] = SUGGESTED_NAMES.slice(0, 5).map((name, idx) => ({
  id: 'p_init_' + idx,
  name,
  avatarIcon: 'sheep',
  color: PLAYER_COLORS[idx % PLAYER_COLORS.length].badge,
  score: 0,
  gamesPlayed: 0,
  winsAsSheep: 0,
  winsAsBlackSheep: 0,
}));

const DEFAULT_SETTINGS: GameSettings = {
  blackSheepCount: 1,
  includeLostSheep: false,
  selectedCategories: ['characters', 'places', 'objects_events'],
  timerDurationSeconds: 90,
  soundEnabled: true,
};

export default function App() {
  // Load saved players from localStorage if available
  const [players, setPlayers] = useState<Player[]>(() => {
    try {
      const saved = localStorage.getItem('doyouknowme_players');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 3) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return DEFAULT_PLAYERS;
  });

  // Custom word pairs
  const [customPairs, setCustomPairs] = useState<BibleWordPair[]>(() => {
    try {
      const saved = localStorage.getItem('doyouknowme_custom_pairs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fallback
    }
    return [];
  });

  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [phase, setPhase] = useState<GamePhase>('SETUP');
  const [roundState, setRoundState] = useState<RoundState | null>(null);
  const [roundCount, setRoundCount] = useState<number>(1);

  // Modals
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [isWordPairsOpen, setIsWordPairsOpen] = useState(false);

  // Sync players to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('doyouknowme_players', JSON.stringify(players));
    } catch {
      // ignore
    }
  }, [players]);

  // Sync custom word pairs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('doyouknowme_custom_pairs', JSON.stringify(customPairs));
    } catch {
      // ignore
    }
  }, [customPairs]);

  // Audio mute sync
  useEffect(() => {
    sounds.enabled = settings.soundEnabled;
  }, [settings.soundEnabled]);

  const allAvailableWordPairs = [...INITIAL_BIBLE_WORD_PAIRS, ...customPairs];

  // Actions
  const handleToggleSound = () => {
    const next = !settings.soundEnabled;
    sounds.enabled = next;
    setSettings(prev => ({ ...prev, soundEnabled: next }));
    if (next) sounds.playTap();
  };

  const handleStartGame = () => {
    const newRound = generateRoundRoles(players, settings, allAvailableWordPairs);
    newRound.roundNumber = roundCount;
    setRoundState(newRound);
    setPhase('PASS_AND_PLAY');
  };

  const handleNextPassPlayer = () => {
    if (!roundState) return;
    setRoundState({
      ...roundState,
      currentPassIndex: roundState.currentPassIndex + 1,
    });
  };

  const handleFinishDistribution = () => {
    setPhase('DISCUSSION');
  };

  const handleNextSpeaker = () => {
    if (!roundState) return;
    setRoundState({
      ...roundState,
      currentSpeakerIndex: roundState.currentSpeakerIndex + 1,
    });
  };

  const handleProceedToVoting = () => {
    setPhase('VOTING');
  };

  const handleBackToDiscussion = () => {
    setPhase('DISCUSSION');
  };

  const handleEliminatePlayer = (playerId: string, guessedWord?: string) => {
    if (!roundState) return;

    // Check if Lost Sheep guessed correctly
    const eliminatedAssign = roundState.assignments.find(a => a.playerId === playerId);
    if (!eliminatedAssign) return;

    const updatedAssignments = roundState.assignments.map(a => {
      if (a.playerId === playerId) {
        return {
          ...a,
          isEliminated: true,
          eliminatedInRound: roundState.clueRoundNumber,
        };
      }
      return a;
    });

    let detectedWinner: 'sheep' | 'black_sheep' | 'lost_sheep' | null = null;

    if (
      eliminatedAssign.role === 'lost_sheep' &&
      guessedWord &&
      guessedWord.trim().toLowerCase() === roundState.sheepWord.trim().toLowerCase()
    ) {
      detectedWinner = 'lost_sheep';
    } else {
      detectedWinner = checkVictoryCondition(updatedAssignments);
    }

    if (detectedWinner) {
      // Update cumulative scores immediately
      const updatedPlayers = updatePlayerScores(players, updatedAssignments, detectedWinner);
      setPlayers(updatedPlayers);
    }

    setRoundState({
      ...roundState,
      assignments: updatedAssignments,
      winner: detectedWinner,
      eliminatedThisRound: eliminatedAssign,
    });

    setPhase('ELIMINATION_REVEAL');
  };

  const handleContinueAfterEliminationReveal = () => {
    if (!roundState) return;
    if (roundState.winner) {
      setPhase('ROUND_OVER');
    } else {
      // Continue to next clue round with remaining active flock!
      setRoundState({
        ...roundState,
        clueRoundNumber: roundState.clueRoundNumber + 1,
        currentSpeakerIndex: 0,
        eliminatedThisRound: null,
      });
      setPhase('DISCUSSION');
    }
  };

  const handlePlayNextRound = () => {
    const nextCount = roundCount + 1;
    setRoundCount(nextCount);
    const newRound = generateRoundRoles(players, settings, allAvailableWordPairs);
    newRound.roundNumber = nextCount;
    setRoundState(newRound);
    setPhase('PASS_AND_PLAY');
  };

  const handleResetScores = () => {
    setPlayers(prev =>
      prev.map(p => ({
        ...p,
        score: 0,
        gamesPlayed: 0,
        winsAsSheep: 0,
        winsAsBlackSheep: 0,
      }))
    );
  };

  const handleAddCustomPair = (pair: BibleWordPair) => {
    setCustomPairs(prev => [pair, ...prev]);
  };

  const handleDeleteCustomPair = (id: string) => {
    setCustomPairs(prev => prev.filter(p => p.id !== id));
  };

  const handleResetToSetup = () => {
    setPhase('SETUP');
    setRoundState(null);
  };

  return (
    <div className="min-h-screen bg-[#090e1a] text-slate-100 flex flex-col font-sans-body selection:bg-amber-500 selection:text-slate-950">
      {/* Background ambient church glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-amber-600/10 via-blue-600/5 to-transparent blur-3xl opacity-70" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-blue-900/10 blur-3xl" />
      </div>

      {/* Persistent App Header */}
      <Header
        soundEnabled={settings.soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onOpenWordPairs={() => setIsWordPairsOpen(true)}
        onResetToSetup={handleResetToSetup}
        currentPhase={phase}
        roundNumber={roundState?.roundNumber}
      />

      {/* Main Game Container */}
      <main className="flex-1 w-full max-w-lg mx-auto px-4 pt-4 relative z-10">
        {phase === 'SETUP' && (
          <PlayerSetup
            players={players}
            settings={settings}
            onUpdatePlayers={setPlayers}
            onUpdateSettings={setSettings}
            onStartGame={handleStartGame}
            totalAvailablePairsCount={allAvailableWordPairs.length}
          />
        )}

        {phase === 'PASS_AND_PLAY' && roundState && (
          <PassAndPlay
            roundState={roundState}
            players={players}
            onFinishDistribution={handleFinishDistribution}
            onNextPlayer={handleNextPassPlayer}
          />
        )}

        {phase === 'DISCUSSION' && roundState && (
          <DiscussionPhase
            roundState={roundState}
            players={players}
            timerDurationSeconds={settings.timerDurationSeconds}
            onProceedToVoting={handleProceedToVoting}
            onNextSpeaker={handleNextSpeaker}
          />
        )}

        {phase === 'VOTING' && roundState && (
          <VotingPhase
            roundState={roundState}
            players={players}
            onEliminatePlayer={handleEliminatePlayer}
            onBackToDiscussion={handleBackToDiscussion}
          />
        )}

        {phase === 'ROUND_OVER' && roundState && (
          <RoundOver
            roundState={roundState}
            players={players}
            onPlayNextRound={handlePlayNextRound}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
            onResetToSetup={handleResetToSetup}
          />
        )}
      </main>

      {/* Elimination Reveal Suspense Modal */}
      {phase === 'ELIMINATION_REVEAL' && roundState && roundState.eliminatedThisRound && (
        <EliminationRevealModal
          eliminated={roundState.eliminatedThisRound}
          isGameOver={!!roundState.winner}
          winner={roundState.winner}
          onContinue={handleContinueAfterEliminationReveal}
        />
      )}

      {/* Modals */}
      <LeaderboardModal
        players={players}
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        onResetScores={handleResetScores}
      />

      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
      />

      <CustomWordPairsModal
        isOpen={isWordPairsOpen}
        onClose={() => setIsWordPairsOpen(false)}
        wordPairs={allAvailableWordPairs}
        onAddCustomPair={handleAddCustomPair}
        onDeleteCustomPair={handleDeleteCustomPair}
      />
    </div>
  );
}
