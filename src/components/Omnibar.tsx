import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  RotateCw, 
  Home, 
  Lock, 
  ShieldAlert, 
  Star, 
  BookOpen, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Search, 
  Globe, 
  Calculator,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { Tab } from '../types/browser';

interface OmnibarProps {
  tab: Tab;
  isBookmarked: boolean;
  onNavigate: (url: string) => void;
  onGoBack: () => void;
  onGoForward: () => void;
  onReload: () => void;
  onToggleBookmark: () => void;
  onToggleReaderMode: () => void;
  onChangeZoom: (delta: number) => void;
  onResetZoom: () => void;
  onAskAiCurrentPage: () => void;
}

export const Omnibar: React.FC<OmnibarProps> = ({
  tab,
  isBookmarked,
  onNavigate,
  onGoBack,
  onGoForward,
  onReload,
  onToggleBookmark,
  onToggleReaderMode,
  onChangeZoom,
  onResetZoom,
  onAskAiCurrentPage,
}) => {
  const [inputValue, setInputValue] = useState(tab.url);
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<{ title: string; url: string; type: 'site' | 'search' | 'calc' }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync URL when tab changes
  useEffect(() => {
    setInputValue(tab.url);
  }, [tab.url]);

  // Handle typing & dynamic smart suggestions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    if (!val.trim()) {
      setSuggestions([]);
      return;
    }

    // Check if it's a math expression
    const isMath = /^[\d\s\+\-\*\/\^\(\)\.]+$/.test(val) && /[+\-*\/]/.test(val);
    if (isMath) {
      try {
        // Safe evaluation of simple arithmetic
        const result = Function(`"use strict"; return (${val})`)();
        setSuggestions([
          { title: `= ${result}`, url: `calc:${result}`, type: 'calc' }
        ]);
        return;
      } catch {
        // ignore math syntax error while typing
      }
    }

    const defaultSites: { title: string; url: string; type: 'site' | 'search' | 'calc' }[] = [
      { title: 'TechNews Today', url: 'https://technews.today', type: 'site' },
      { title: 'Artificial Neural Networks - Wikipedia', url: 'https://en.wikipedia.org/wiki/Neural_network', type: 'site' },
      { title: 'Trending Repositories - GitHub', url: 'https://github.com/trending', type: 'site' },
      { title: 'CSS Grid Architecture - DevDocs', url: 'https://devdocs.io/css-grid', type: 'site' },
      { title: 'Aether OS Hub', url: 'aether://home', type: 'site' },
    ];

    const matched = defaultSites.filter(
      s => s.title.toLowerCase().includes(val.toLowerCase()) || s.url.toLowerCase().includes(val.toLowerCase())
    );

    matched.push({
      title: `Search Aether: "${val}"`,
      url: `https://duckduckgo.com/?q=${encodeURIComponent(val)}`,
      type: 'search'
    });

    setSuggestions(matched);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      submitNavigation(inputValue);
    }
  };

  const submitNavigation = (target: string) => {
    let finalUrl = target.trim();
    if (!finalUrl) return;

    if (finalUrl.startsWith('calc:')) return;

    // Detect if valid URL or search
    if (finalUrl === 'aether://home' || finalUrl.startsWith('aether://')) {
      // keep protocol
    } else if (/^https?:\/\//i.test(finalUrl)) {
      // keep
    } else if (finalUrl.includes('.') && !finalUrl.includes(' ')) {
      finalUrl = 'https://' + finalUrl;
    } else {
      finalUrl = `https://duckduckgo.com/?q=${encodeURIComponent(finalUrl)}`;
    }

    setIsFocused(false);
    onNavigate(finalUrl);
  };

  return (
    <div className="relative bg-slate-900/95 border-b border-slate-800 px-3 py-1.5 flex items-center gap-2 select-none text-xs z-20">
      {/* Navigation History & Refresh */}
      <div className="flex items-center gap-1">
        <button
          onClick={onGoBack}
          disabled={!tab.canGoBack}
          className={`p-1.5 rounded-md transition-colors ${
            tab.canGoBack
              ? 'text-slate-200 hover:bg-slate-800'
              : 'text-slate-600 cursor-not-allowed'
          }`}
          title="Go Back (Alt + Left)"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onGoForward}
          disabled={!tab.canGoForward}
          className={`p-1.5 rounded-md transition-colors ${
            tab.canGoForward
              ? 'text-slate-200 hover:bg-slate-800'
              : 'text-slate-600 cursor-not-allowed'
          }`}
          title="Go Forward (Alt + Right)"
        >
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onReload}
          className={`p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-all ${
            tab.isLoading ? 'animate-spin text-blue-400' : ''
          }`}
          title="Reload Page (⌘R)"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onNavigate('aether://home')}
          className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
          title="Home Page"
        >
          <Home className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Omnibar Search/Address Input */}
      <div className="relative flex-1">
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all ${
          isFocused
            ? 'bg-slate-950 border-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.3)] ring-1 ring-blue-500/50'
            : 'bg-slate-950/70 hover:bg-slate-950/90 border-slate-700/80 text-slate-300'
        }`}>
          {/* Security Indicator */}
          <div className="flex items-center gap-1 text-[11px] font-medium">
            {tab.url.startsWith('https://') || tab.url.startsWith('aether://') ? (
              <span className="flex items-center gap-1 text-emerald-400" title="Connection is 256-bit Encrypted">
                <Lock className="w-3 h-3" />
                <span className="hidden sm:inline text-[10px] uppercase font-mono tracking-wider">TLS</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-400" title="Unencrypted Connection">
                <ShieldAlert className="w-3 h-3" />
              </span>
            )}
          </div>

          {/* Text Input */}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => {
              setIsFocused(true);
              inputRef.current?.select();
            }}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            onKeyDown={handleKeyDown}
            placeholder="Search the web, enter URL, or calculate arithmetic..."
            className="flex-1 bg-transparent border-none outline-none text-slate-100 placeholder-slate-500 text-xs font-mono"
          />

          {/* Quick AI Page Summary Icon inside bar */}
          <button
            onClick={onAskAiCurrentPage}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-[10px] font-sans font-medium transition-colors"
            title="Ask Aether Co-Pilot about this page"
          >
            <Sparkles className="w-2.5 h-2.5" />
            <span className="hidden md:inline">Ask AI</span>
          </button>

          {/* Bookmark Star Toggle */}
          <button
            onClick={onToggleBookmark}
            className={`p-1 rounded hover:bg-slate-800 transition-colors ${
              isBookmarked ? 'text-amber-400 fill-amber-400' : 'text-slate-400 hover:text-amber-300'
            }`}
            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark this Tab (⌘D)'}
          >
            <Star className="w-3.5 h-3.5" fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Autocomplete Dropdown */}
        {isFocused && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900/95 border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl z-50">
            {suggestions.map((item, idx) => (
              <div
                key={idx}
                onMouseDown={() => submitNavigation(item.url)}
                className="flex items-center justify-between px-3 py-2 hover:bg-blue-600/20 cursor-pointer border-b border-slate-800/50 last:border-none transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  {item.type === 'calc' ? (
                    <Calculator className="w-4 h-4 text-emerald-400" />
                  ) : item.type === 'search' ? (
                    <Search className="w-4 h-4 text-blue-400" />
                  ) : (
                    <Globe className="w-4 h-4 text-indigo-400" />
                  )}
                  <div>
                    <div className="text-xs font-medium text-slate-200">{item.title}</div>
                    {item.type === 'site' && (
                      <div className="text-[10px] font-mono text-slate-400 truncate max-w-sm">{item.url}</div>
                    )}
                  </div>
                </div>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Accessories: Reader Mode & Zoom */}
      <div className="flex items-center gap-1.5 text-slate-400">
        {/* Reader Mode */}
        <button
          onClick={onToggleReaderMode}
          className={`p-1.5 rounded-md transition-colors ${
            tab.isReaderMode
              ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50'
              : 'hover:bg-slate-800 hover:text-slate-200'
          }`}
          title="Distraction-Free Reader Mode"
        >
          <BookOpen className="w-3.5 h-3.5" />
        </button>

        {/* Zoom Controls */}
        <div className="hidden sm:flex items-center bg-slate-800/60 rounded-md border border-slate-700/50 px-1 py-0.5">
          <button
            onClick={() => onChangeZoom(-10)}
            className="p-0.5 hover:text-slate-200 rounded"
            title="Zoom Out"
          >
            <ZoomOut className="w-3 h-3" />
          </button>
          <button
            onClick={onResetZoom}
            className="text-[10px] font-mono px-1 hover:text-slate-200"
            title="Reset Zoom"
          >
            {tab.zoomLevel}%
          </button>
          <button
            onClick={() => onChangeZoom(10)}
            className="p-0.5 hover:text-slate-200 rounded"
            title="Zoom In"
          >
            <ZoomIn className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
