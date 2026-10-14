import React from 'react';
import { Volume2, VolumeX, Trophy, HelpCircle, BookOpen, RotateCcw } from 'lucide-react';
import { GamePhase } from '../types/game';

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenHowToPlay: () => void;
  onOpenLeaderboard: () => void;
  onOpenWordPairs: () => void;
  onResetToSetup?: () => void;
  currentPhase: GamePhase;
  roundNumber?: number;
}

export const Header: React.FC<HeaderProps> = ({
  soundEnabled,
  onToggleSound,
  onOpenHowToPlay,
  onOpenLeaderboard,
  onOpenWordPairs,
  onResetToSetup,
  currentPhase,
  roundNumber,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-950/85 backdrop-blur-md border-b border-amber-500/20 px-4 py-3 shadow-lg">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Left: Brand / Title */}
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center shadow-md shadow-amber-500/20 text-slate-950 font-bold">
            <span className="text-xl">🐑</span>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h1 className="font-serif-biblical text-base sm:text-lg font-bold tracking-wide text-amber-200">
                Do You Know Me?
              </h1>
              {roundNumber && currentPhase !== 'SETUP' && (
                <span className="text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 rounded-full">
                  R{roundNumber}
                </span>
              )}
            </div>
            <p className="text-[11px] text-amber-300/80 font-medium">by Tagumpay Church</p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-1 sm:space-x-1.5">
          {currentPhase !== 'SETUP' && onResetToSetup && (
            <button
              onClick={onResetToSetup}
              title="Return to Setup"
              className="p-2 text-slate-300 hover:text-amber-300 hover:bg-slate-800/80 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onOpenLeaderboard}
            title="Scoreboard"
            className="p-2 text-amber-300 hover:text-amber-200 hover:bg-slate-800/80 rounded-lg transition-colors relative"
          >
            <Trophy className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenWordPairs}
            title="Bible Words Library"
            className="p-2 text-slate-300 hover:text-amber-300 hover:bg-slate-800/80 rounded-lg transition-colors"
          >
            <BookOpen className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenHowToPlay}
            title="How to Play"
            className="p-2 text-slate-300 hover:text-amber-300 hover:bg-slate-800/80 rounded-lg transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
            className="p-2 text-slate-300 hover:text-amber-300 hover:bg-slate-800/80 rounded-lg transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
        </div>
      </div>
    </header>
  );
};
