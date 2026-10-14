import React, { useState } from 'react';
import { ShieldAlert, UserX, AlertTriangle, ArrowLeft, Check, Sparkles } from 'lucide-react';
import { Player, PlayerRoleAssignment, RoundState } from '../types/game';
import { sounds } from '../utils/audio';

interface VotingPhaseProps {
  roundState: RoundState;
  players: Player[];
  onEliminatePlayer: (playerId: string, guessedWord?: string) => void;
  onBackToDiscussion: () => void;
}

export const VotingPhase: React.FC<VotingPhaseProps> = ({
  roundState,
  players,
  onEliminatePlayer,
  onBackToDiscussion,
}) => {
  // Map of playerId -> vote count
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [lostSheepGuess, setLostSheepGuess] = useState('');

  const activeAssignments = roundState.assignments.filter(a => !a.isEliminated);

  const handleVoteAdd = (playerId: string) => {
    sounds.playTap();
    setVotes(prev => ({
      ...prev,
      [playerId]: (prev[playerId] || 0) + 1,
    }));
    setSelectedPlayerId(playerId);
  };

  const handleVoteSubtract = (playerId: string) => {
    sounds.playTap();
    setVotes(prev => {
      const current = prev[playerId] || 0;
      if (current <= 1) {
        const next = { ...prev };
        delete next[playerId];
        return next;
      }
      return { ...prev, [playerId]: current - 1 };
    });
  };

  const totalVotesCast = Object.values(votes).reduce((a, b) => a + b, 0);

  // Find candidate with most votes
  let highestVoteCount = 0;
  let topCandidates: string[] = [];
  Object.entries(votes).forEach(([id, count]) => {
    if (count > highestVoteCount) {
      highestVoteCount = count;
      topCandidates = [id];
    } else if (count === highestVoteCount && count > 0) {
      topCandidates.push(id);
    }
  });

  const isTie = topCandidates.length > 1;

  const targetPlayerId = selectedPlayerId || (topCandidates.length === 1 ? topCandidates[0] : null);
  const targetPlayer = players.find(p => p.id === targetPlayerId);
  const targetAssignment = roundState.assignments.find(a => a.playerId === targetPlayerId);

  const handleConfirmElimination = () => {
    if (!targetPlayerId) return;
    sounds.playSuspense();
    setShowConfirmModal(true);
  };

  const handleFinalExecute = () => {
    if (!targetPlayerId) return;
    onEliminatePlayer(targetPlayerId, lostSheepGuess);
  };

  return (
    <div className="space-y-6 pb-12 max-w-md mx-auto">
      {/* Top Banner */}
      <div className="text-center space-y-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
          Voting Phase
        </span>
        <h2 className="text-xl sm:text-2xl font-serif-biblical font-bold text-slate-100">
          Who is the Black Sheep?
        </h2>
        <p className="text-xs text-slate-400 max-w-xs mx-auto">
          Cast your votes based on the clues given. The person with the most votes will be exposed!
        </p>
      </div>

      {/* Tie notice if detected */}
      {isTie && totalVotesCast > 0 && (
        <div className="p-3 bg-amber-500/20 border border-amber-500/40 rounded-xl flex items-center space-x-2 text-xs text-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Tie detected between {topCandidates.length} players! Break the tie before confirming.
          </span>
        </div>
      )}

      {/* Voting Cards Grid */}
      <div className="space-y-2.5">
        {activeAssignments.map(assignment => {
          const player = players.find(p => p.id === assignment.playerId);
          const voteCount = votes[assignment.playerId] || 0;
          const isSelected = targetPlayerId === assignment.playerId;
          const isTopCandidate = topCandidates.includes(assignment.playerId) && voteCount > 0;

          return (
            <div
              key={assignment.playerId}
              onClick={() => setSelectedPlayerId(assignment.playerId)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                isSelected
                  ? 'bg-amber-950/40 border-amber-400 shadow-md ring-1 ring-amber-400'
                  : isTopCandidate
                  ? 'bg-slate-900 border-amber-500/40'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Player details */}
              <div className="flex items-center space-x-3 overflow-hidden">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-md shrink-0"
                  style={{ backgroundColor: player?.color || '#D97706' }}
                >
                  {player?.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-100 truncate">
                    {player?.name}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {voteCount === 0 ? 'No votes' : `${voteCount} ${voteCount === 1 ? 'vote' : 'votes'}`}
                  </p>
                </div>
              </div>

              {/* Vote Counters / Tally buttons */}
              <div className="flex items-center space-x-1.5" onClick={e => e.stopPropagation()}>
                {voteCount > 0 && (
                  <button
                    type="button"
                    onClick={() => handleVoteSubtract(assignment.playerId)}
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-base flex items-center justify-center transition-colors"
                  >
                    -
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleVoteAdd(assignment.playerId)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
                    voteCount > 0
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  <span>Vote</span>
                  {voteCount > 0 && <span className="font-extrabold">({voteCount})</span>}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        <button
          type="button"
          disabled={!targetPlayerId}
          onClick={handleConfirmElimination}
          className="w-full py-4 bg-gradient-to-r from-rose-600 via-rose-700 to-amber-700 hover:from-rose-500 hover:to-amber-600 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-rose-900/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
        >
          <UserX className="w-5 h-5 text-rose-200" />
          <span>
            {targetPlayer
              ? `Eliminate ${targetPlayer.name}`
              : 'Select a Player to Eliminate'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            sounds.playTap();
            onBackToDiscussion();
          }}
          className="w-full py-2.5 text-xs text-slate-400 hover:text-slate-200 flex items-center justify-center space-x-1 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Clue Discussion</span>
        </button>
      </div>

      {/* Dramatic Reveal Confirmation Modal */}
      {showConfirmModal && targetPlayer && targetAssignment && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div
              className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-3xl font-extrabold text-white shadow-xl"
              style={{ backgroundColor: targetPlayer.color }}
            >
              {targetPlayer.name.charAt(0).toUpperCase()}
            </div>

            <div>
              <p className="text-xs font-semibold text-rose-400 uppercase tracking-widest">
                Judgment of the Flock
              </p>
              <h3 className="text-2xl font-serif-biblical font-bold text-slate-100 mt-1">
                {targetPlayer.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                has received the most votes and is being cast out.
              </p>
            </div>

            {/* Special Lost Sheep Guess Option if target is Lost Sheep */}
            {targetAssignment.role === 'lost_sheep' && (
              <div className="p-3 bg-purple-950/40 border border-purple-500/40 rounded-xl text-left space-y-2">
                <p className="text-xs font-semibold text-purple-300 flex items-center">
                  <Sparkles className="w-3.5 h-3.5 mr-1" />
                  Lost Sheep Guess Chance:
                </p>
                <p className="text-[11px] text-purple-200/80">
                  Before departure, guess what the Sheep's secret Bible word was to steal 4 points!
                </p>
                <input
                  type="text"
                  value={lostSheepGuess}
                  onChange={e => setLostSheepGuess(e.target.value)}
                  placeholder="Guess secret Bible word..."
                  className="w-full px-3 py-1.5 bg-slate-950 border border-purple-500/50 rounded-lg text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-purple-400"
                />
              </div>
            )}

            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={handleFinalExecute}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center space-x-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Reveal {targetPlayer.name}'s True Identity</span>
              </button>

              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="w-full py-2 text-xs text-slate-400 hover:text-slate-200 transition-colors"
              >
                Cancel / Re-vote
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
