import React from 'react';
import { X, BookOpen, ShieldCheck, HelpCircle, Users, CheckCircle2 } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl space-y-4 max-h-[85vh] flex flex-col text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif-biblical text-lg font-bold text-amber-100">
              How to Play "Do You Know Me?"
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable instructions */}
        <div className="overflow-y-auto flex-1 space-y-4 pr-1 text-xs leading-relaxed">
          {/* Objective */}
          <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
            <p className="font-semibold text-amber-300 text-sm mb-1">
              Objective of the Game
            </p>
            <p className="text-slate-300">
              Inspired by the social deduction game <em>Undercover</em>, "Do You Know Me?" tests your Bible knowledge, social intuition, and discernment. One secret Bible word pair is chosen for each round.
            </p>
          </div>

          {/* Roles Breakdown */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-100 uppercase tracking-wider text-[11px] text-amber-400">
              The Roles
            </h4>

            <div className="p-3 bg-slate-950/70 border border-blue-500/30 rounded-xl space-y-1">
              <div className="flex items-center space-x-1.5 font-bold text-blue-300">
                <span>🐑</span>
                <span>The Faithful Sheep (Civilians)</span>
              </div>
              <p className="text-slate-300">
                The majority of the flock. You all receive the <strong className="text-white">exact same secret Bible word</strong> (e.g., <em>Moses</em>). Your goal is to identify and vote out the impostors!
              </p>
            </div>

            <div className="p-3 bg-slate-950/70 border border-amber-500/30 rounded-xl space-y-1">
              <div className="flex items-center space-x-1.5 font-bold text-amber-300">
                <span>🐺</span>
                <span>The Black Sheep (Impostor)</span>
              </div>
              <p className="text-slate-300">
                You receive a <strong className="text-white">closely related decoy Bible word</strong> (e.g., <em>Aaron</em>). You don’t know who has which word, so you must listen carefully and blend into the flock!
              </p>
            </div>

            <div className="p-3 bg-slate-950/70 border border-purple-500/30 rounded-xl space-y-1">
              <div className="flex items-center space-x-1.5 font-bold text-purple-300">
                <span>❓</span>
                <span>The Lost Sheep (Optional Rogue)</span>
              </div>
              <p className="text-slate-300">
                You receive <strong className="text-white">NO word at all</strong>! You must bluff your way through the clues. If you are eliminated, you have 1 guess to name the Sheep's word and steal 4 points!
              </p>
            </div>
          </div>

          {/* Step by step flow */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-slate-100 uppercase tracking-wider text-[11px] text-amber-400">
              Round Gameplay Flow
            </h4>

            <div className="flex items-start space-x-2.5">
              <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                1
              </div>
              <div>
                <p className="font-semibold text-slate-200">Pass-and-Play Word Peek</p>
                <p className="text-slate-400">
                  Pass the device to each player one by one. Tap and hold to reveal your secret Bible word in private.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-2.5">
              <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                2
              </div>
              <div>
                <p className="font-semibold text-slate-200">The Speaking Circle</p>
                <p className="text-slate-400">
                  Following the generated speaker order, each player shares <span className="text-amber-300 font-medium">one word or one short sentence</span> describing their word. Never say your word directly or rhyme it!
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-2.5">
              <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                3
              </div>
              <div>
                <p className="font-semibold text-slate-200">Voting & Elimination</p>
                <p className="text-slate-400">
                  Discuss and vote on who gave the most suspicious or off-topic clue. The player with the most votes is eliminated and their true role is revealed!
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-2.5">
              <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                4
              </div>
              <div>
                <p className="font-semibold text-slate-200">Victory & Scoring</p>
                <p className="text-slate-400">
                  If all Black Sheep are eliminated, the Faithful Sheep win! If the Black Sheep survive until numbers are equal, the Black Sheep triumph! Scores carry over across rounds.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-colors"
          >
            I'm Ready to Play!
          </button>
        </div>
      </div>
    </div>
  );
};
