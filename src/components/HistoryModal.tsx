import React, { useState } from 'react';
import { HistoryItem } from '../types/browser';
import { X, Search, Trash2, Globe, Clock, ExternalLink } from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onOpenUrl: (url: string) => void;
  onClearHistory: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onOpenUrl,
  onClearHistory,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filtered = history.filter(
    h => h.title.toLowerCase().includes(searchTerm.toLowerCase()) || h.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[520px]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold text-white">Browsing History</h2>
            <span className="text-xs text-slate-500 font-mono">({history.length} events)</span>
          </div>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-medium border border-rose-500/20 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear History</span>
              </button>
            )}
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-slate-800 bg-slate-900 flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-500 ml-1" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search browsing history..."
            className="flex-1 bg-transparent border-none outline-none text-slate-100 placeholder-slate-500 text-xs"
          />
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-xs">
              No history records found.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onOpenUrl(item.url);
                  onClose();
                }}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-blue-500/50 hover:bg-slate-850 cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">{item.favicon || '🌐'}</span>
                  <div>
                    <div className="text-xs font-semibold text-slate-200 group-hover:text-blue-400">
                      {item.title}
                    </div>
                    <div className="text-[11px] font-mono text-slate-500 truncate max-w-md">
                      {item.url}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-medium">
                    {item.workspaceName}
                  </span>
                  <span>{new Date(item.visitedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-blue-400" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
