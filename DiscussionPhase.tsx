import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Plus, ChevronRight, Vote, MessageCircle, AlertCircle } from 'lucide-react';
import { Player, RoundState } from '../types/game';
import { sounds } from '../utils/audio';

interface DiscussionPhaseProps {
  roundState: RoundState;
  players: Player[];
  timerDurationSeconds: number;
  onProceedToVoting: () => void;
  onNextSpeaker: () => void;
}

export const DiscussionPhase: React.FC<DiscussionPhaseProps> = ({
  roundState,
  players,
  timerDurationSeconds,
  onProceedToVoting,
  onNextSpeaker,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(timerDurationSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(timerDurationSeconds > 0);

  // Active (non-eliminated) players in speaking order
  const activeAssignments = roundState.assignments.filter(a => !a.isEliminated);
  const activeSpeakerIds = roundState.speakerOrder.filter(id =>
    activeAssignments.some(a => a.playerId === id)
  );

  const currentSpeakerId = activeSpeakerIds[roundState.currentSpeakerIndex % activeSpeakerIds.length];
  const currentSpeaker = players.find(p => p.id === currentSpeakerId);
  const nextSpeakerId = activeSpeakerIds[(roundState.currentSpeakerIndex + 1) % activeSpeakerIds.length];
  const nextSpeaker = players.find(p => p.id === nextSpeakerId);

  // Timer effect
  useEffect(() => {
    if (!isTimerRunning || timerDurationSeconds === 0) return;

    if (timeLeft <= 0) {
      sounds.playTimeUp();
      setIsTimerRunning(false);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 4 && prev > 1) {
          sounds.playTick();
        }
        if (prev <= 1) {
          sounds.playTimeUp();
          setIsTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft, timerDurationSeconds]);

  const handleToggleTimer = () => {
    sounds.playTap();
    setIsTimerRunning(!isTimerRunning);
  };

  const handleResetTimer = () => {
    sounds.playTap();
    setTimeLeft(timerDurationSeconds);
    setIsTimerRunning(false);
  };

  const handleAdd30s = () => {
    sounds.playTap();
    setTimeLeft(prev => prev + 30);
  };

  const handleAdvanceSpeaker = () => {
    sounds.playTap();
    onNextSpeaker();
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-6 pb-10 max-w-md mx-auto">
      {/* Header Banner */}
      <div className="text-center space-y-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
          Clue Round {roundState.clueRoundNumber}
        </span>
        <h2 className="text-xl sm:text-2xl font-serif-biblical font-bold text-slate-100">
          Give Your Bible Clues
        </h2>
        <p className="text-xs text-slate-400 max-w-xs mx-auto">
          Take turns giving <span className="text-amber-300 font-semibold">one word or one short sentence</span> about your secret word!
        </p>
      </div>

      {/* Current Speaker Spotlight Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/40 rounded-2xl p-5 shadow-xl relative overflow-hidden text-center">
        <div className="absolute top-2 right-2 text-xs font-semibold text-amber-400/70 bg-slate-950/60 px-2 py-0.5 rounded-md border border-amber-500/20">
          Speaker {(roundState.currentSpeakerIndex % activeSpeakerIds.length) + 1} of {activeSpeakerIds.length}
        </div>

        <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-2">
          Now Speaking
        </p>

        <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-lg mb-2"
          style={{ backgroundColor: currentSpeaker?.color || '#D97706' }}
        >
          {currentSpeaker?.name.charAt(0).toUpperCase()}
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-slate-100">
          {currentSpeaker?.name}
        </h3>

        <p className="text-xs text-amber-200/80 mt-1 max-w-xs mx-auto">
          "Share a subtle clue that only true sheep will understand!"
        </p>

        {nextSpeaker && (
          <p className="text-[11px] text-slate-400 mt-3 pt-3 border-t border-slate-800">
            Up next: <span className="text-slate-200 font-semibold">{nextSpeaker.name}</span>
          </p>
        )}

        <button
          type="button"
          onClick={handleAdvanceSpeaker}
          className="mt-4 w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm rounded-xl border border-slate-700 hover:border-amber-500/50 transition-all flex items-center justify-center space-x-1"
        >
          <span>Next Speaker</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Optional Timer Box */}
      {timerDurationSeconds > 0 && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg text-center space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="font-medium">Discussion Timer</span>
            <span className={`font-bold ${timeLeft <= 10 ? 'text-rose-400 animate-pulse' : 'text-amber-400'}`}>
              {timeLeft <= 10 && timeLeft > 0 ? 'Ending soon!' : timeLeft === 0 ? 'Time Up!' : 'Active'}
            </span>
          </div>

          <div className="text-4xl sm:text-5xl font-mono font-bold text-slate-100 tracking-wider">
            {formatTime(timeLeft)}
          </div>

          <div className="flex items-center justify-center space-x-2 pt-1">
            <button
              onClick={handleToggleTimer}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                isTimerRunning
                  ? 'bg-rose-600 hover:bg-rose-500 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isTimerRunning ? 'Pause' : 'Start'}</span>
            </button>

            <button
              onClick={handleResetTimer}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={handleAdd30s}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition-colors flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>30s</span>
            </button>
          </div>
        </div>
      )}

      {/* Speaking Circle Queue */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
        <h4 className="text-xs font-semibold text-slate-400 mb-2 flex items-center space-x-1.5">
          <MessageCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>Speaking Circle ({activeSpeakerIds.length} Active)</span>
        </h4>
        <div className="flex gap-2 overflow-x-auto pb-1 text-center">
          {activeSpeakerIds.map((id, index) => {
            const isCurrent = id === currentSpeakerId;
            const p = players.find(x => x.id === id);
            return (
              <div
                key={id}
                className={`flex-shrink-0 px-3 py-2 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-md'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-400'
                }`}
              >
                <div
                  className="w-6 h-6 mx-auto rounded-full text-[10px] font-bold text-white flex items-center justify-center mb-1"
                  style={{ backgroundColor: p?.color || '#D97706' }}
                >
                  {p?.name.charAt(0).toUpperCase()}
                </div>
                <p className="text-[11px] font-medium truncate max-w-[70px]">
                  {p?.name}
                </p>
                <span className="text-[9px] opacity-75">#{index + 1}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rules Notice */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex items-start space-x-2 text-xs text-amber-200/90">
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p>
          Do not say your exact word! If you are the Black Sheep, pay close attention to others' clues so you can mimic their theme.
        </p>
      </div>

      {/* Proceed to Voting Button */}
      <button
        type="button"
        onClick={() => {
          sounds.playSuspense();
          onProceedToVoting();
        }}
        className="w-full py-4 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-amber-600/20 transition-all flex items-center justify-center space-x-2"
      >
        <Vote className="w-5 h-5 text-amber-200" />
        <span>Ready to Vote! Expose the Black Sheep</span>
      </button>
    </div>
  );
};
