import React, { useState } from 'react';
import { X, Settings, Shield, Sparkles, Monitor, Trash2, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetAllData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onResetAllData,
}) => {
  const [searchEngine, setSearchEngine] = useState('DuckDuckGo (Privacy Focused)');
  const [themeName, setThemeName] = useState('Cyber Dark (Default)');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold text-white">Aether Preferences</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[420px] text-xs">
          {/* Search Engine */}
          <div>
            <label className="text-slate-300 font-semibold block mb-2">Default Search Engine</label>
            <select
              value={searchEngine}
              onChange={(e) => setSearchEngine(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-blue-500"
            >
              <option value="DuckDuckGo (Privacy Focused)">DuckDuckGo (Privacy Focused)</option>
              <option value="Google Search">Google Search</option>
              <option value="Startpage (Private Google)">Startpage (Private Google)</option>
            </select>
          </div>

          {/* Theme */}
          <div>
            <label className="text-slate-300 font-semibold block mb-2">Theme & Aesthetics</label>
            <select
              value={themeName}
              onChange={(e) => setThemeName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-blue-500"
            >
              <option value="Cyber Dark (Default)">Cyber Dark (Default)</option>
              <option value="Midnight OLED">Midnight OLED (Pure Black)</option>
              <option value="Slate Tech">Slate Tech</option>
            </select>
          </div>

          {/* AI Settings */}
          <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-900/40 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-blue-300">
              <Sparkles className="w-4 h-4" />
              <span>Neural Co-Pilot Engine</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Equipped with Gemini 2.5 Flash. Context-aware page reasoning, document summarization, and live code inspection.
            </p>
          </div>

          {/* Clear Data */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <div>
              <div className="font-semibold text-rose-400">Clear Cache & Local Storage</div>
              <div className="text-[11px] text-slate-500">Purges ephemeral cookies and memory buffers</div>
            </div>
            <button
              onClick={() => {
                if (confirm('Clear all local browser state and tabs?')) {
                  onResetAllData();
                  onClose();
                }
              }}
              className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold"
            >
              Clear Data
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-500">Aether Engine v2.6.4-stable</span>
          <button
            onClick={handleSave}
            className="flex items-center gap-1 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-colors"
          >
            {savedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Saved!</span>
              </>
            ) : (
              <span>Save & Close</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
