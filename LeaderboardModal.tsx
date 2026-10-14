import React, { useState } from 'react';
import { X, Trophy, Medal, RotateCcw, Award } from 'lucide-react';
import { Player } from '../types/game';
import { sounds } from '../utils/audio';

interface LeaderboardModalProps {
  players: Player[];
  isOpen: boolean;
  onClose: () => void;
  onResetScores: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  players,
  isOpen,
  onClose,
  onResetScores,
}) => {
  const [confirmReset, setConfirmReset] = useState(false);

  if (!isOpen) return null;

  // Sort players by score descending
  const sorted = [...players].sort((a, b) => b.score - a.score);

  const handleReset = () => {
    sounds.playTap();
    onResetScores();
    setConfirmReset(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif-biblical text-lg font-bold text-amber-100">
              Flock Leaderboard
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable list of players */}
        <div className="overflow-y-auto flex-1 space-y-2 pr-1">
          {sorted.map((player, idx) => {
            const isFirst = idx === 0 && player.score > 0;
            const isSecond = idx === 1 && player.score > 0;
            const isThird = idx === 2 && player.score > 0;

            return (
              <div
                key={player.id}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                  isFirst
                    ? 'bg-gradient-to-r from-amber-500/20 via-slate-900 to-slate-900 border-amber-500/50 shadow-md'
                    : 'bg-slate-950/60 border-slate-800/80'
                }`}
              >
                <div className="flex items-center space-x-3 overflow-hidden">
                  {/* Rank */}
                  <div className="w-6 text-center font-bold text-xs shrink-0">
                    {isFirst && <span className="text-amber-400 text-base">🥇</span>}
                    {isSecond && <span className="text-slate-300 text-base">🥈</span>}
                    {isThird && <span className="text-amber-700 text-base">🥉</span>}
                    {!isFirst && !isSecond && !isThird && (
                      <span className="text-slate-500">#{idx + 1}</span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-inner shrink-0"
                    style={{ backgroundColor: player.color }}
                  >
                    {player.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Name and stats */}
                  <div className="truncate">
                    <h4 className="text-sm font-semibold text-slate-100 truncate flex items-center space-x-1.5">
                      <span>{player.name}</span>
                      {isFirst && (
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded-full border border-amber-500/30">
                          Leader
                        </span>
                      )}
                    </h4>
                    <p className="text-[11px] text-slate-400 flex items-center space-x-2">
                      <span>{player.gamesPlayed} {player.gamesPlayed === 1 ? 'game' : 'games'}</span>
                      <span>•</span>
                      <span>🐑 {player.winsAsSheep} wins</span>
                      <span>•</span>
                      <span>🐺 {player.winsAsBlackSheep} wins</span>
                    </p>
                  </div>
                </div>

                {/* Score */}
                <div className="text-right shrink-0 pl-2">
                  <span className="text-base font-extrabold text-amber-400">
                    {player.score}
                  </span>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">
                    pts
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Scoring Rules Guide */}
        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
          <p className="font-semibold text-slate-300 flex items-center">
            <Award className="w-3.5 h-3.5 text-amber-400 mr-1" /> Point System:
          </p>
          <div className="grid grid-cols-2 gap-1 text-[10px]">
            <span>🐑 Sheep Win: +2 pts</span>
            <span>🐺 Black Sheep Win: +3 pts</span>
            <span>🛡️ Survival Bonus: +1 pt</span>
            <span>❓ Lost Sheep Win: +4 pts</span>
          </div>
        </div>

        {/* Footer controls */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="text-xs text-slate-500 hover:text-rose-400 transition-colors flex items-center space-x-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Scores</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="text-xs text-rose-300 font-medium">Reset all?</span>
              <button
                type="button"
                onClick={handleReset}
                className="px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-md"
              >
                Yes, Reset
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
