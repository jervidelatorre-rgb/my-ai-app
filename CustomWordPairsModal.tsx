import React, { useState } from 'react';
import { X, Plus, BookOpen, Trash2, Search } from 'lucide-react';
import { BibleCategory, BibleWordPair } from '../types/game';
import { CATEGORY_LABELS } from '../data/bibleWordPairs';
import { sounds } from '../utils/audio';

interface CustomWordPairsModalProps {
  isOpen: boolean;
  onClose: () => void;
  wordPairs: BibleWordPair[];
  onAddCustomPair: (pair: BibleWordPair) => void;
  onDeleteCustomPair: (id: string) => void;
}

export const CustomWordPairsModal: React.FC<CustomWordPairsModalProps> = ({
  isOpen,
  onClose,
  wordPairs,
  onAddCustomPair,
  onDeleteCustomPair,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<BibleCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Form state
  const [word1, setWord1] = useState('');
  const [word2, setWord2] = useState('');
  const [hint, setHint] = useState('');
  const [category, setCategory] = useState<BibleCategory>('characters');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const w1 = word1.trim();
    const w2 = word2.trim();
    if (!w1 || !w2) {
      setErrorMsg('Both Bible words are required.');
      return;
    }
    if (w1.toLowerCase() === w2.toLowerCase()) {
      setErrorMsg('Words must be different!');
      return;
    }

    const newPair: BibleWordPair = {
      id: 'custom-' + Date.now(),
      category: 'custom',
      word1: w1,
      word2: w2,
      hintOrScripture: hint.trim() || 'Custom church community word pair',
    };

    sounds.playTap();
    onAddCustomPair(newPair);
    setWord1('');
    setWord2('');
    setHint('');
    setIsAdding(false);
    setErrorMsg(null);
  };

  const filtered = wordPairs.filter(pair => {
    const matchesFilter = selectedFilter === 'all' || pair.category === selectedFilter;
    const matchesSearch =
      pair.word1.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pair.word2.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pair.hintOrScripture.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl space-y-4 max-h-[85vh] flex flex-col text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif-biblical text-lg font-bold text-amber-100">
              Bible Words Library ({wordPairs.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Add New Toggle */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search Bible words or scriptures..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="px-3 py-2 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 rounded-xl text-xs font-semibold flex items-center space-x-1 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAdding ? 'Close' : 'Add New'}</span>
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-1 overflow-x-auto pb-1 text-[11px]">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                selectedFilter === 'all'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({wordPairs.length})
            </button>
            {(['characters', 'places', 'objects_events', 'custom'] as BibleCategory[]).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors shrink-0 ${
                  selectedFilter === cat
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {CATEGORY_LABELS[cat].name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Add Custom Word Pair Form */}
        {isAdding && (
          <form onSubmit={handleAddSubmit} className="p-3.5 bg-slate-950/80 rounded-2xl border border-amber-500/40 space-y-2.5 animate-in fade-in duration-150">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Add Custom Bible Pair
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Word 1</label>
                <input
                  type="text"
                  placeholder="e.g. Gideon"
                  value={word1}
                  onChange={e => setWord1(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Word 2 (Decoy)</label>
                <input
                  type="text"
                  placeholder="e.g. Samson"
                  value={word2}
                  onChange={e => setWord2(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5">Scripture Reference / Connection Note</label>
              <input
                type="text"
                placeholder="e.g. Judges of Israel (Judges 6 & 13)"
                value={hint}
                onChange={e => setHint(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
              />
            </div>
            {errorMsg && (
              <p className="text-[11px] text-rose-400 font-medium">{errorMsg}</p>
            )}
            <div className="flex justify-end space-x-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1 text-xs text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg"
              >
                Save Word Pair
              </button>
            </div>
          </form>
        )}

        {/* Pairs List */}
        <div className="overflow-y-auto flex-1 space-y-2 pr-1">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              No matching Bible pairs found.
            </div>
          ) : (
            filtered.map(pair => (
              <div
                key={pair.id}
                className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-start justify-between space-x-2"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-slate-100 text-xs sm:text-sm">
                      {pair.word1}
                    </span>
                    <span className="text-amber-500 font-bold text-xs">↔</span>
                    <span className="font-semibold text-slate-100 text-xs sm:text-sm">
                      {pair.word2}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 uppercase font-semibold">
                      {pair.category.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 italic">
                    {pair.hintOrScripture}
                  </p>
                </div>

                {pair.category === 'custom' && (
                  <button
                    onClick={() => {
                      sounds.playTap();
                      onDeleteCustomPair(pair.id);
                    }}
                    title="Delete custom pair"
                    className="text-slate-500 hover:text-rose-400 p-1 shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
