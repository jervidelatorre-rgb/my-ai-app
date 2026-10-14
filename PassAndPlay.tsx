import React, { useState } from 'react';
import { Eye, EyeOff, ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';
import { Player, RoundState } from '../types/game';
import { sounds } from '../utils/audio';

interface PassAndPlayProps {
  roundState: RoundState;
  players: Player[];
  onFinishDistribution: () => void;
  onNextPlayer: () => void;
}

export const PassAndPlay: React.FC<PassAndPlayProps> = ({
  roundState,
  players,
  onFinishDistribution,
  onNextPlayer,
}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isMemorized, setIsMemorized] = useState(false);

  const currentIndex = roundState.currentPassIndex;
  const assignment = roundState.assignments[currentIndex];
  const player = players.find(p => p.id === assignment.playerId) || {
    id: assignment.playerId,
    name: assignment.playerName,
    color: '#D97706',
  };

  const isLastPlayer = currentIndex === roundState.assignments.length - 1;

  const handleToggleReveal = () => {
    if (!isRevealed) {
      sounds.playChime();
    } else {
      sounds.playTap();
    }
    setIsRevealed(!isRevealed);
  };

  const handleConfirmAndNext = () => {
    sounds.playTap();
    setIsRevealed(false);
    setIsMemorized(false);
    if (isLastPlayer) {
      onFinishDistribution();
    } else {
      onNextPlayer();
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col justify-between max-w-md mx-auto py-4">
      {/* Top progress indicator */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
          <span>Secret Word Distribution</span>
          <span className="text-amber-400">
            Player {currentIndex + 1} of {roundState.assignments.length}
          </span>
        </div>
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-300"
            style={{
              width: `${((currentIndex + 1) / roundState.assignments.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Main Pass Box */}
      <div className="my-6">
        {!isRevealed ? (
          /* Privacy Locked Screen: Pass device to player */
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden space-y-6">
            <div className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-3xl font-extrabold text-white shadow-xl"
              style={{ backgroundColor: player.color }}
            >
              {player.name.charAt(0).toUpperCase()}
            </div>

            <div>
              <p className="text-xs font-medium text-amber-400/90 uppercase tracking-widest mb-1">
                Pass Device To
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif-biblical text-slate-100 tracking-wide">
                {player.name}
              </h2>
              <p className="text-xs text-slate-400 mt-2">
                Make sure no other players are looking at your screen!
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleToggleReveal}
                className="w-full py-4 px-6 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold text-base rounded-2xl shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
              >
                <Eye className="w-5 h-5" />
                <span>I am {player.name} (Reveal Word)</span>
              </button>
            </div>
          </div>
        ) : (
          /* Revealed Card with Warm Parchment Texture */
          <div className="bg-gradient-to-b from-[#FDFBF7] via-[#F7F2E7] to-[#EFE7D5] border-2 border-amber-600/40 rounded-3xl p-6 sm:p-8 text-center shadow-2xl space-y-6 text-slate-900 animate-in fade-in zoom-in duration-200">
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-amber-900/15 pb-3">
              <div className="flex items-center space-x-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm"
                  style={{ backgroundColor: player.color }}
                >
                  {player.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-bold text-sm text-amber-950">{player.name}</span>
              </div>
              <button
                onClick={handleToggleReveal}
                className="text-xs text-amber-900/70 hover:text-amber-950 flex items-center space-x-1 p-1 bg-amber-900/5 rounded-md"
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span>Hide</span>
              </button>
            </div>

            {/* Secret Word Box */}
            <div className="py-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-800/80 mb-2">
                Your Secret Bible Word
              </p>
              <div className="bg-amber-100/70 border-2 border-amber-400/60 rounded-2xl py-6 px-4 shadow-inner">
                {assignment.role === 'lost_sheep' ? (
                  <div>
                    <span className="text-2xl sm:text-3xl font-extrabold text-purple-900 tracking-wider">
                      NO WORD!
                    </span>
                    <p className="text-xs font-semibold text-purple-800 mt-2">
                      You are the <span className="underline">Lost Sheep</span>!
                    </p>
                  </div>
                ) : (
                  <div>
                    <span className="font-serif-biblical text-3xl sm:text-4xl font-extrabold text-amber-950 tracking-wider">
                      {assignment.word}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Role & Instructions */}
            <div className="p-3 bg-white/70 rounded-xl border border-amber-900/10 text-xs text-amber-950/80 text-left space-y-1">
              {assignment.role === 'lost_sheep' ? (
                <>
                  <p className="font-bold text-purple-900 flex items-center">
                    <span className="mr-1">❓</span> You received no word!
                  </p>
                  <p>
                    Listen to everyone’s clues carefully. Try to guess the topic and give convincing clues so no one suspects you!
                  </p>
                </>
              ) : (
                <>
                  <p className="font-bold text-amber-950 flex items-center">
                    <ShieldCheck className="w-4 h-4 text-amber-700 mr-1 shrink-0" />
                    Instructions:
                  </p>
                  <p>
                    Memorize your word. When it's your turn, give <span className="font-bold underline">one short clue</span> (word or sentence) related to your word without saying it directly!
                  </p>
                </>
              )}
            </div>

            {/* Confirmation Check */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() => setIsMemorized(true)}
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center space-x-2 ${
                  isMemorized
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-amber-900/10 hover:bg-amber-900/20 text-amber-950 border border-amber-900/20'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>{isMemorized ? 'Word Memorized!' : "I've Memorized My Word"}</span>
              </button>

              <button
                type="button"
                disabled={!isMemorized}
                onClick={handleConfirmAndNext}
                className="w-full py-4 px-6 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-base rounded-2xl shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
              >
                <span>{isLastPlayer ? 'Begin Discussion Round' : 'Next Player'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Advice */}
      <div className="text-center text-xs text-slate-500">
        💡 Pass the phone quietly to avoid tipping off other players!
      </div>
    </div>
  );
};
