import React from 'react';
import { PlayerRoleAssignment } from '../types/game';
import { ShieldCheck, Skull, HelpCircle, ArrowRight } from 'lucide-react';

interface EliminationRevealModalProps {
  eliminated: PlayerRoleAssignment;
  isGameOver: boolean;
  winner: 'sheep' | 'black_sheep' | 'lost_sheep' | null;
  onContinue: () => void;
}

export const EliminationRevealModal: React.FC<EliminationRevealModalProps> = ({
  eliminated,
  isGameOver,
  winner,
  onContinue,
}) => {
  const isBlackSheep = eliminated.role === 'black_sheep';
  const isSheep = eliminated.role === 'sheep';
  const isLostSheep = eliminated.role === 'lost_sheep';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl space-y-6 animate-in fade-in zoom-in duration-300">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
            Identity Revealed
          </p>
          <h3 className="text-2xl font-serif-biblical font-bold text-slate-100">
            {eliminated.playerName}
          </h3>
          <p className="text-xs text-slate-400">was voted out of the flock!</p>
        </div>

        {/* Role Reveal Badge */}
        <div className="py-4">
          {isBlackSheep && (
            <div className="p-5 bg-rose-500/15 border-2 border-rose-500/50 rounded-2xl space-y-2">
              <span className="text-4xl block">🐺</span>
              <p className="text-rose-300 font-extrabold text-xl tracking-wide uppercase">
                Black Sheep!
              </p>
              <p className="text-xs text-rose-200/80">
                The flock discerned wisely! Their secret word was: <span className="font-bold underline text-rose-100">{eliminated.word}</span>
              </p>
            </div>
          )}

          {isSheep && (
            <div className="p-5 bg-blue-500/15 border-2 border-blue-500/50 rounded-2xl space-y-2">
              <span className="text-4xl block">🐑</span>
              <p className="text-blue-300 font-extrabold text-xl tracking-wide uppercase">
                Faithful Sheep!
              </p>
              <p className="text-xs text-blue-200/80">
                An innocent lamb was eliminated! Their secret word was: <span className="font-bold underline text-blue-100">{eliminated.word}</span>
              </p>
            </div>
          )}

          {isLostSheep && (
            <div className="p-5 bg-purple-500/15 border-2 border-purple-500/50 rounded-2xl space-y-2">
              <span className="text-4xl block">❓</span>
              <p className="text-purple-300 font-extrabold text-xl tracking-wide uppercase">
                Lost Sheep!
              </p>
              <p className="text-xs text-purple-200/80">
                They had no secret word and walked alone!
              </p>
            </div>
          )}
        </div>

        {/* Status of Game */}
        <div className="text-xs text-slate-300">
          {isGameOver ? (
            <p className="text-amber-300 font-semibold">
              The game has concluded! View the final results.
            </p>
          ) : (
            <p className="text-slate-400">
              The hunt is not over! Black Sheep are still hidden among the flock.
            </p>
          )}
        </div>

        {/* Continue Button */}
        <button
          type="button"
          onClick={onContinue}
          className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-base rounded-2xl shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center space-x-2"
        >
          <span>{isGameOver ? 'View Round Results' : 'Next Clue Round'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
