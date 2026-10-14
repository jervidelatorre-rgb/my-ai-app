import React, { useState } from 'react';
import { Plus, X, Users, Sparkles, BookOpen, Clock, ShieldAlert, Dice5 } from 'lucide-react';
import { BibleCategory, GameSettings, Player } from '../types/game';
import { CATEGORY_LABELS } from '../data/bibleWordPairs';
import { PLAYER_COLORS, SUGGESTED_NAMES } from '../utils/gameLogic';
import { sounds } from '../utils/audio';

interface PlayerSetupProps {
  players: Player[];
  settings: GameSettings;
  onUpdatePlayers: (players: Player[]) => void;
  onUpdateSettings: (settings: GameSettings) => void;
  onStartGame: () => void;
  totalAvailablePairsCount: number;
}

export const PlayerSetup: React.FC<PlayerSetupProps> = ({
  players,
  settings,
  onUpdatePlayers,
  onUpdateSettings,
  onStartGame,
  totalAvailablePairsCount,
}) => {
  const [newName, setNewName] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAddPlayer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) return;
    if (players.length >= 15) {
      setErrorMsg('Maximum of 15 players reached.');
      return;
    }
    if (players.some(p => p.name.toLowerCase() === trimmed.toLowerCase())) {
      setErrorMsg('Name already taken in this flock!');
      return;
    }

    const colorIdx = players.length % PLAYER_COLORS.length;
    const newPlayer: Player = {
      id: 'p_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      name: trimmed,
      avatarIcon: 'sheep',
      color: PLAYER_COLORS[colorIdx].badge,
      score: 0,
      gamesPlayed: 0,
      winsAsSheep: 0,
      winsAsBlackSheep: 0,
    };

    sounds.playTap();
    onUpdatePlayers([...players, newPlayer]);
    setNewName('');
    setErrorMsg(null);
  };

  const handleRemovePlayer = (id: string) => {
    if (players.length <= 3) {
      setErrorMsg('At least 3 players are required to play.');
      return;
    }
    sounds.playTap();
    onUpdatePlayers(players.filter(p => p.id !== id));
    setErrorMsg(null);
  };

  const handleQuickPreset = (count: number) => {
    sounds.playTap();
    const selectedNames = SUGGESTED_NAMES.slice(0, count);
    const presetPlayers: Player[] = selectedNames.map((name, idx) => {
      // Preserve existing score if player had that name
      const existing = players.find(p => p.name === name);
      return {
        id: existing ? existing.id : 'p_preset_' + idx + '_' + Date.now(),
        name,
        avatarIcon: 'sheep',
        color: PLAYER_COLORS[idx % PLAYER_COLORS.length].badge,
        score: existing ? existing.score : 0,
        gamesPlayed: existing ? existing.gamesPlayed : 0,
        winsAsSheep: existing ? existing.winsAsSheep : 0,
        winsAsBlackSheep: existing ? existing.winsAsBlackSheep : 0,
      };
    });
    onUpdatePlayers(presetPlayers);
    setErrorMsg(null);
  };

  const toggleCategory = (cat: BibleCategory) => {
    sounds.playTap();
    const current = settings.selectedCategories;
    if (current.includes(cat)) {
      if (current.length === 1) {
        setErrorMsg('Select at least one Bible category.');
        return;
      }
      onUpdateSettings({
        ...settings,
        selectedCategories: current.filter(c => c !== cat),
      });
    } else {
      onUpdateSettings({
        ...settings,
        selectedCategories: [...current, cat],
      });
    }
    setErrorMsg(null);
  };

  // Role Breakdown Calculations
  const playerCount = players.length;
  const blackSheepCount = playerCount <= 4 ? 1 : Math.min(settings.blackSheepCount, Math.floor(playerCount / 3));
  const lostSheepCount = settings.includeLostSheep && playerCount >= 5 ? 1 : 0;
  const sheepCount = playerCount - blackSheepCount - lostSheepCount;

  return (
    <div className="space-y-6 pb-12">
      {/* Banner / Verse Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-950/60 via-slate-900 to-slate-900 border border-amber-500/30 p-4 sm:p-5 shadow-xl text-center">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
          <span>John 10:14</span>
          <span>•</span>
          <span>"I know My sheep and My sheep know Me"</span>
        </div>
        <h2 className="font-serif-biblical text-xl sm:text-2xl font-bold text-amber-100 tracking-wide">
          Gather the Flock
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-sm mx-auto">
          One of you has strayed with a subtly different secret Bible word. Can the faithful Sheep expose the Black Sheep?
        </p>
      </div>

      {/* Player Roster Section */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-amber-400" />
            <h3 className="font-semibold text-slate-100 text-sm sm:text-base">
              Players ({players.length}/15)
            </h3>
          </div>
          <span className="text-xs text-amber-400 font-medium">
            Min 3 • Max 15
          </span>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center space-x-1.5 mb-3 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 flex items-center pr-1 shrink-0">
            <Dice5 className="w-3.5 h-3.5 mr-1 text-amber-400" /> Presets:
          </span>
          {[4, 5, 6, 8, 10].map(cnt => (
            <button
              key={cnt}
              type="button"
              onClick={() => handleQuickPreset(cnt)}
              className="px-2.5 py-1 bg-slate-800 hover:bg-amber-950/70 hover:text-amber-300 text-slate-300 rounded-lg border border-slate-700 transition-colors shrink-0 font-medium"
            >
              {cnt} Players
            </button>
          ))}
        </div>

        {/* Add Player Input */}
        <form onSubmit={handleAddPlayer} className="flex gap-2 mb-4">
          <input
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Enter screen name (e.g. Sister Grace)"
            maxLength={18}
            className="flex-1 px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
          />
          <button
            type="submit"
            disabled={!newName.trim() || players.length >= 15}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm rounded-xl disabled:opacity-40 disabled:cursor-not-allowed shadow-md transition-all flex items-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </form>

        {errorMsg && (
          <div className="mb-3 px-3 py-2 bg-rose-500/20 border border-rose-500/40 rounded-xl text-xs text-rose-300 flex items-center justify-between">
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg(null)} className="text-rose-400 hover:text-rose-200">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Player Chips Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
          {players.map((player, idx) => (
            <div
              key={player.id}
              className="flex items-center justify-between px-3 py-2 bg-slate-950/60 border border-slate-800/80 rounded-xl hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center space-x-2.5 overflow-hidden">
                <span className="w-5 text-[11px] font-bold text-slate-500">
                  {idx + 1}.
                </span>
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-inner shrink-0"
                  style={{ backgroundColor: player.color }}
                >
                  {player.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-slate-200 truncate">
                  {player.name}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleRemovePlayer(player.id)}
                disabled={players.length <= 3}
                title="Remove player"
                className="text-slate-500 hover:text-rose-400 p-1 disabled:opacity-20 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Bible Categories Selection */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <h3 className="font-semibold text-slate-100 text-sm sm:text-base">
              Bible Categories
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            {totalAvailablePairsCount} Pairs Available
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {(['characters', 'places', 'objects_events'] as BibleCategory[]).map(cat => {
            const isSelected = settings.selectedCategories.includes(cat);
            const info = CATEGORY_LABELS[cat];
            return (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCategory(cat)}
                className={`text-left p-3 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500/60 shadow-md shadow-amber-500/5'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs text-amber-200">
                    {info.name}
                  </span>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className="accent-amber-500 w-4 h-4 rounded"
                  />
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">
                  {info.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Game Mode & Role Configuration */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-lg space-y-4">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <h3 className="font-semibold text-slate-100 text-sm sm:text-base">
            Game Rules & Roles
          </h3>
        </div>

        {/* Black Sheep Count selector */}
        <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800">
          <div>
            <p className="text-xs sm:text-sm font-medium text-slate-200">Black Sheep (Impostors)</p>
            <p className="text-[11px] text-slate-400">Receives a decoy word</p>
          </div>
          <div className="flex items-center space-x-1.5">
            {[1, 2].map(count => (
              <button
                key={count}
                type="button"
                disabled={count === 2 && playerCount <= 5}
                onClick={() => {
                  sounds.playTap();
                  onUpdateSettings({ ...settings, blackSheepCount: count });
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  blackSheepCount === count
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed'
                }`}
              >
                {count} {count === 1 ? 'Black Sheep' : 'Black Sheep'}
              </button>
            ))}
          </div>
        </div>

        {/* Optional Lost Sheep Toggle */}
        <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800">
          <div>
            <div className="flex items-center space-x-1.5">
              <p className="text-xs sm:text-sm font-medium text-slate-200">Lost Sheep (Undercover Rogue)</p>
              <span className="text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/40 px-1.5 py-0.2 rounded">
                Special
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Receives NO word, must listen & blend in (min 5 players)</p>
          </div>
          <button
            type="button"
            disabled={playerCount < 5}
            onClick={() => {
              sounds.playTap();
              onUpdateSettings({ ...settings, includeLostSheep: !settings.includeLostSheep });
            }}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
              lostSheepCount > 0 ? 'bg-amber-500 justify-end' : 'bg-slate-700 justify-start'
            } disabled:opacity-30`}
          >
            <div className="bg-white w-4 h-4 rounded-full shadow-md" />
          </button>
        </div>

        {/* Discussion Timer */}
        <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <div>
              <p className="text-xs sm:text-sm font-medium text-slate-200">Discussion Timer</p>
              <p className="text-[11px] text-slate-400">Timer per voting round</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            {[60, 90, 120, 0].map(sec => (
              <button
                key={sec}
                type="button"
                onClick={() => {
                  sounds.playTap();
                  onUpdateSettings({ ...settings, timerDurationSeconds: sec });
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  settings.timerDurationSeconds === sec
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {sec === 0 ? 'Off' : `${sec}s`}
              </button>
            ))}
          </div>
        </div>

        {/* Role Breakdown Badge */}
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
          <p className="text-xs font-semibold text-amber-300 mb-1.5 flex items-center">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-400" />
            Roles Breakdown for {playerCount} Players:
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30 font-medium">
              🐑 {sheepCount} Faithful Sheep
            </span>
            <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium">
              🐺 {blackSheepCount} Black Sheep
            </span>
            {lostSheepCount > 0 && (
              <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 font-medium">
                ❓ 1 Lost Sheep
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Start Game Action */}
      <button
        type="button"
        onClick={() => {
          sounds.playChime();
          onStartGame();
        }}
        disabled={players.length < 3}
        className="w-full py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-extrabold text-base sm:text-lg rounded-2xl shadow-xl shadow-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all transform active:scale-[0.99] flex items-center justify-center space-x-2"
      >
        <span>Start Game & Pass Phone</span>
        <span>→</span>
      </button>
    </div>
  );
};
