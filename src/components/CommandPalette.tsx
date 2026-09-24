import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Sparkles, 
  Columns, 
  Terminal, 
  ShieldCheck, 
  Plus, 
  BookOpen, 
  RotateCw, 
  Globe, 
  Monitor, 
  Tablet, 
  Smartphone,
  ExternalLink,
  Command
} from 'lucide-react';
import { Workspace, SplitMode, DeviceMode } from '../types/browser';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (url: string) => void;
  onNewTab: () => void;
  onToggleSplitMode: (mode: SplitMode) => void;
  onChangeDeviceMode: (mode: DeviceMode) => void;
  onToggleAiDrawer: () => void;
  onToggleDevTools: () => void;
  onOpenPrivacyModal: () => void;
  onReload: () => void;
  onToggleReaderMode: () => void;
  workspaces: Workspace[];
  onSelectWorkspace: (id: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onNewTab,
  onToggleSplitMode,
  onChangeDeviceMode,
  onToggleAiDrawer,
  onToggleDevTools,
  onOpenPrivacyModal,
  onReload,
  onToggleReaderMode,
  workspaces,
  onSelectWorkspace,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const actions = [
    {
      id: 'ai-copilot',
      title: 'Open Aether Neural Co-Pilot (AI)',
      category: 'AI Assistant',
      icon: <Sparkles className="w-4 h-4 text-blue-400" />,
      run: () => onToggleAiDrawer()
    },
    {
      id: 'split-screen',
      title: 'Toggle Dual Split-Screen (Side by Side)',
      category: 'Layout',
      icon: <Columns className="w-4 h-4 text-indigo-400" />,
      run: () => onToggleSplitMode('split-vertical')
    },
    {
      id: 'devtools',
      title: 'Toggle Developer Tools (Console & DOM)',
      category: 'Developer',
      icon: <Terminal className="w-4 h-4 text-amber-400" />,
      run: () => onToggleDevTools()
    },
    {
      id: 'reader-mode',
      title: 'Toggle Clean Distraction-Free Reader Mode',
      category: 'Reading',
      icon: <BookOpen className="w-4 h-4 text-cyan-400" />,
      run: () => onToggleReaderMode()
    },
    {
      id: 'new-tab',
      title: 'Create New Tab',
      category: 'Navigation',
      icon: <Plus className="w-4 h-4 text-emerald-400" />,
      run: () => onNewTab()
    },
    {
      id: 'reload',
      title: 'Reload Active Page',
      category: 'Navigation',
      icon: <RotateCw className="w-4 h-4 text-slate-400" />,
      run: () => onReload()
    },
    {
      id: 'privacy-shield',
      title: 'Open Zero-Trust Privacy Shield Settings',
      category: 'Security',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
      run: () => onOpenPrivacyModal()
    },
    {
      id: 'device-mobile',
      title: 'Switch Viewport to Mobile (iPhone 16 Pro)',
      category: 'Responsive',
      icon: <Smartphone className="w-4 h-4 text-blue-400" />,
      run: () => onChangeDeviceMode('mobile-ios')
    },
    {
      id: 'device-tablet',
      title: 'Switch Viewport to Tablet (iPad Pro)',
      category: 'Responsive',
      icon: <Tablet className="w-4 h-4 text-blue-400" />,
      run: () => onChangeDeviceMode('tablet')
    },
    {
      id: 'device-desktop',
      title: 'Switch Viewport to Desktop (Fluid Canvas)',
      category: 'Responsive',
      icon: <Monitor className="w-4 h-4 text-blue-400" />,
      run: () => onChangeDeviceMode('desktop')
    },
    // Websites
    {
      id: 'nav-home',
      title: 'Go to Aether OS Dashboard (aether://home)',
      category: 'Quick Jump',
      icon: <Globe className="w-4 h-4 text-blue-400" />,
      run: () => onNavigate('aether://home')
    },
    {
      id: 'nav-technews',
      title: 'Go to TechNews Today (Silicon Photonics Report)',
      category: 'Quick Jump',
      icon: <Globe className="w-4 h-4 text-amber-400" />,
      run: () => onNavigate('https://technews.today')
    },
    {
      id: 'nav-wiki',
      title: 'Go to Neural Network Architecture (Wikipedia)',
      category: 'Quick Jump',
      icon: <Globe className="w-4 h-4 text-purple-400" />,
      run: () => onNavigate('https://en.wikipedia.org/wiki/Neural_network')
    },
    {
      id: 'nav-github',
      title: 'Go to GitHub Trending Repositories',
      category: 'Quick Jump',
      icon: <Globe className="w-4 h-4 text-emerald-400" />,
      run: () => onNavigate('https://github.com/trending')
    },
    {
      id: 'nav-devdocs',
      title: 'Go to CSS Grid Interactive Lab (DevDocs)',
      category: 'Quick Jump',
      icon: <Globe className="w-4 h-4 text-cyan-400" />,
      run: () => onNavigate('https://devdocs.io/css-grid')
    },
  ];

  // Also include workspaces
  workspaces.forEach(ws => {
    actions.push({
      id: `workspace-${ws.id}`,
      title: `Switch to Workspace: ${ws.name} ${ws.icon}`,
      category: 'Workspaces',
      icon: <span className="text-base">{ws.icon}</span>,
      run: () => onSelectWorkspace(ws.id)
    });
  });

  const filtered = actions.filter(
    a => a.title.toLowerCase().includes(query.toLowerCase()) || a.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => (i + 1) % (filtered.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => (i - 1 + filtered.length) % (filtered.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].run();
        onClose();
      } else if (query.trim()) {
        onNavigate(`https://duckduckgo.com/?q=${encodeURIComponent(query.trim())}`);
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-start justify-center pt-24 px-4 select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Search input field */}
        <div className="p-3 border-b border-slate-800 flex items-center gap-3 bg-slate-950/60">
          <Search className="w-5 h-5 text-blue-400 ml-1" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type an action, search query, or navigate..."
            className="flex-1 bg-transparent border-none outline-none text-slate-100 placeholder-slate-500 text-sm"
          />
          <kbd className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-slate-400">
            ESC
          </kbd>
        </div>

        {/* Action list */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-400">
              No direct actions found. Press <kbd className="font-mono bg-slate-800 px-1 py-0.5 rounded text-slate-200">Enter</kbd> to search the web for "{query}".
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    item.run();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors ${
                    isSelected ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isSelected ? 'bg-white/20' : 'bg-slate-800'}`}>
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-xs font-semibold">{item.title}</div>
                      <div className={`text-[10px] ${isSelected ? 'text-blue-200' : 'text-slate-500'}`}>
                        {item.category}
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="text-[10px] font-mono bg-white/20 px-2 py-0.5 rounded">
                      ↵ Enter
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-2.5 bg-slate-950/80 border-t border-slate-800/80 px-4 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span>Aether OS Quick-Command</span>
        </div>
      </div>
    </div>
  );
};
