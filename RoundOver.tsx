import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, ArrowRight, BookOpen, ShieldCheck, Skull, Sparkles } from 'lucide-react';
import { Player, RoundState } from '../types/game';
import { sounds } from '../utils/audio';

interface RoundOverProps {
  roundState: RoundState;
  players: Player[];
  onPlayNextRound: () => void;
  onOpenLeaderboard: () => void;
  onResetToSetup: () => void;
}

export const RoundOver: React.FC<RoundOverProps> = ({
  roundState,
  players,
  onPlayNextRound,
  onOpenLeaderboard,
  onResetToSetup,
}) => {
  const winner = roundState.winner;

  useEffect(() => {
    // Sound & Confetti
    if (winner === 'sheep') {
      sounds.playSheepWin();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D97706', '#3B82F6', '#F59E0B', '#10B981'],
      });
    } else if (winner === 'black_sheep') {
      sounds.playBlackSheepWin();
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#DC2626', '#F59E0B', '#7C3AED'],
      });
    } else {
      sounds.playSheepWin();
    }
  }, [winner]);

  const isSheepWin = winner === 'sheep';
  const isBlackSheepWin = winner === 'black_sheep';

  return (
    <div className="space-y-6 pb-14 max-w-md mx-auto">
      {/* Winner Hero Card */}
      <div
        className={`rounded-3xl p-6 sm:p-7 text-center shadow-2xl border-2 relative overflow-hidden ${
          isSheepWin
            ? 'bg-gradient-to-b from-blue-950/80 via-slate-900 to-slate-950 border-blue-400/50'
            : isBlackSheepWin
            ? 'bg-gradient-to-b from-amber-950/80 via-slate-900 to-slate-950 border-amber-500/50'
            : 'bg-gradient-to-b from-purple-950/80 via-slate-900 to-slate-950 border-purple-400/50'
        }`}
      >
        <div className="text-5xl sm:text-6xl mb-3">
          {isSheepWin ? '🐑' : isBlackSheepWin ? '🐺' : '❓'}
        </div>

        <p className="text-xs uppercase tracking-widest font-bold text-amber-400">
          Round Concluded
        </p>

        <h2 className="text-2xl sm:text-3xl font-serif-biblical font-black text-slate-100 mt-1">
          {isSheepWin
            ? 'The Faithful Flock Wins!'
            : isBlackSheepWin
            ? 'The Black Sheep Wins!'
            : 'The Lost Sheep Triumphs!'}
        </h2>

        <p className="text-xs text-slate-300 mt-2 max-w-xs mx-auto">
          {isSheepWin
            ? 'The faithful sheep successfully discerned the truth and cast out the impostors!'
            : isBlackSheepWin
            ? 'The Black Sheep blended in and outsmarted the flock!'
            : 'The Lost Sheep walked alone and took victory!'}
        </p>
      </div>

      {/* Secret Bible Words Reveal Card (Warm Parchment Aesthetic) */}
      <div className="bg-gradient-to-b from-[#FDFBF7] via-[#F8F4EA] to-[#EFE7D5] border-2 border-amber-600/40 rounded-3xl p-5 sm:p-6 shadow-xl text-slate-900 space-y-4">
        <div className="flex items-center space-x-2 border-b border-amber-900/15 pb-2.5">
          <BookOpen className="w-4 h-4 text-amber-800" />
          <h3 className="font-serif-biblical font-bold text-base text-amber-950">
            Bible Words Revealed
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-blue-50/90 border border-blue-200 rounded-2xl text-center">
            <span className="text-[10px] uppercase font-bold text-blue-800 tracking-wider block mb-1">
              🐑 Faithful Sheep Word
            </span>
            <span className="font-serif-biblical text-lg sm:text-xl font-extrabold text-blue-950">
              {roundState.sheepWord}
            </span>
          </div>

          <div className="p-3 bg-amber-100/90 border border-amber-300 rounded-2xl text-center">
            <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider block mb-1">
              🐺 Black Sheep Word
            </span>
            <span className="font-serif-biblical text-lg sm:text-xl font-extrabold text-amber-950">
              {roundState.blackSheepWord}
            </span>
          </div>
        </div>

        {/* Biblical Connection / Scripture Note */}
        <div className="p-3 bg-white/80 rounded-xl border border-amber-900/10 text-xs text-amber-900/90 space-y-1">
          <p className="font-semibold text-amber-950 flex items-center">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 mr-1 shrink-0" />
            Scripture & Context:
          </p>
          <p className="italic leading-relaxed">
            "{roundState.pair.hintOrScripture}"
          </p>
        </div>
      </div>

      {/* Player Roles & Round Scoring Breakdown */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-slate-100 text-sm">
            Roles & Points Earned
          </h4>
          <span className="text-xs text-amber-400 font-medium">This Round</span>
        </div>

        <div className="space-y-2">
          {roundState.assignments.map(assignment => {
            const player = players.find(p => p.id === assignment.playerId);
            const isSheep = assignment.role === 'sheep';
            const isBlackSheep = assignment.role === 'black_sheep';
            const isLost = assignment.role === 'lost_sheep';

            let roundPoints = 0;
            if (winner === 'sheep' && isSheep) {
              roundPoints = assignment.isEliminated ? 2 : 3;
            } else if (winner === 'black_sheep' && isBlackSheep) {
              roundPoints = assignment.isEliminated ? 3 : 4;
            } else if (winner === 'lost_sheep' && isLost) {
              roundPoints = 4;
            }

            return (
              <div
                key={assignment.playerId}
                className="flex items-center justify-between p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl"
              >
                <div className="flex items-center space-x-2.5 overflow-hidden">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ backgroundColor: player?.color || '#D97706' }}
                  >
                    {player?.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-semibold text-slate-200 truncate flex items-center space-x-1.5">
                      <span>{player?.name}</span>
                      {assignment.isEliminated && (
                        <span className="text-[10px] text-slate-500 font-normal">
                          (Eliminated R{assignment.eliminatedInRound || 1})
                        </span>
                      )}
                    </p>
                    <div className="flex items-center space-x-1.5 text-[11px] mt-0.5">
                      {isSheep && (
                        <span className="text-blue-400 font-medium flex items-center">
                          🐑 Sheep
                        </span>
                      )}
                      {isBlackSheep && (
                        <span className="text-amber-400 font-medium flex items-center">
                          🐺 Black Sheep
                        </span>
                      )}
                      {isLost && (
                        <span className="text-purple-400 font-medium flex items-center">
                          ❓ Lost Sheep
                        </span>
                      )}
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400 font-mono">
                        "{assignment.word}"
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-2">
                  <span className={`text-xs font-bold ${roundPoints > 0 ? 'text-emerald-400' : 'text-slate-500'}`}>
                    +{roundPoints} pts
                  </span>
                  <p className="text-[10px] text-slate-400">
                    Total: {player?.score}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        <button
          type="button"
          onClick={() => {
            sounds.playChime();
            onPlayNextRound();
          }}
          className="w-full py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-extrabold text-base rounded-2xl shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center space-x-2 active:scale-[0.99]"
        >
          <span>Next Round (Keep Scores)</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onOpenLeaderboard}
            className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-xs sm:text-sm rounded-xl border border-slate-700 transition-colors flex items-center justify-center space-x-1.5"
          >
            <Trophy className="w-4 h-4" />
            <span>Leaderboard</span>
          </button>

          <button
            type="button"
            onClick={onResetToSetup}
            className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs sm:text-sm rounded-xl border border-slate-700 transition-colors flex items-center justify-center space-x-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Setup / Edit Flock</span>
          </button>
        </div>
      </div>
    </div>
  );
};
