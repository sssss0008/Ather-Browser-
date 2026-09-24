import React from 'react';
import { Plus, X, Volume2, VolumeX, Pin, Globe, Lock, LayoutGrid } from 'lucide-react';
import { Tab } from '../types/browser';

interface TabBarProps {
  tabs: Tab[];
  activeTabId: string;
  secondaryTabId?: string;
  splitMode: string;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string, e: React.MouseEvent) => void;
  onNewTab: () => void;
  onTogglePinTab: (id: string, e: React.MouseEvent) => void;
  onToggleMuteTab: (id: string, e: React.MouseEvent) => void;
  onToggleTabOverview: () => void;
}

export const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTabId,
  secondaryTabId,
  splitMode,
  onSelectTab,
  onCloseTab,
  onNewTab,
  onTogglePinTab,
  onToggleMuteTab,
  onToggleTabOverview,
}) => {
  return (
    <div className="h-9 bg-slate-950/80 border-b border-slate-800/80 flex items-center px-2 gap-1 overflow-x-auto select-none no-scrollbar">
      {/* Tab Canvas Grid Button */}
      <button
        onClick={onToggleTabOverview}
        className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 rounded-md transition-colors mr-1"
        title="Open Visual Tab Matrix"
      >
        <LayoutGrid className="w-3.5 h-3.5" />
      </button>

      {/* Tabs List */}
      <div className="flex items-center gap-1.5 flex-1 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          const isSecondary = splitMode !== 'single' && tab.id === secondaryTabId;

          return (
            <div
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`group relative flex items-center gap-2 px-3 py-1 rounded-t-lg text-xs cursor-pointer transition-all border-t border-x ${
                isActive
                  ? 'bg-slate-900 text-slate-100 border-slate-700/80 shadow-inner'
                  : isSecondary
                  ? 'bg-slate-900/60 text-indigo-300 border-indigo-600/40'
                  : 'bg-slate-950/40 text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 border-transparent'
              } ${tab.isPinned ? 'w-auto max-w-[120px]' : 'max-w-[200px] min-w-[120px]'}`}
              title={`${tab.title}\n${tab.url}\nRAM: ${tab.memoryUsageMb} MB`}
            >
              {/* Active Tab Accent Line */}
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
              )}
              {isSecondary && (
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-indigo-500" />
              )}

              {/* Favicon or Icon */}
              <span className="text-sm flex-shrink-0">
                {tab.favicon ? (
                  <span>{tab.favicon}</span>
                ) : (
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                )}
              </span>

              {/* Title */}
              <span className="truncate flex-1 font-medium text-[11px]">
                {tab.title || 'New Tab'}
              </span>

              {/* Incognito Icon */}
              {tab.isIncognito && (
                <span title="Private Incognito Tab">
                  <Lock className="w-3 h-3 text-purple-400 flex-shrink-0" />
                </span>
              )}

              {/* Audio Indicator */}
              <button
                onClick={(e) => onToggleMuteTab(tab.id, e)}
                className={`p-0.5 rounded hover:bg-slate-700/50 ${tab.isMuted ? 'text-slate-500' : 'text-blue-400'}`}
                title={tab.isMuted ? 'Unmute Tab' : 'Mute Tab'}
              >
                {tab.isMuted ? (
                  <VolumeX className="w-3 h-3" />
                ) : (
                  <Volume2 className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                )}
              </button>

              {/* Pin indicator/button */}
              {tab.isPinned ? (
                <Pin className="w-3 h-3 text-amber-400 fill-amber-400/30 flex-shrink-0" />
              ) : (
                <button
                  onClick={(e) => onTogglePinTab(tab.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-amber-400 rounded transition-opacity"
                  title="Pin Tab"
                >
                  <Pin className="w-3 h-3" />
                </button>
              )}

              {/* Close Button */}
              {!tab.isPinned && (
                <button
                  onClick={(e) => onCloseTab(tab.id, e)}
                  className="p-0.5 rounded-full hover:bg-slate-700/80 text-slate-400 hover:text-slate-100 transition-colors"
                  title="Close Tab"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}

        {/* New Tab Button */}
        <button
          onClick={onNewTab}
          className="p-1 rounded-md text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-colors ml-1"
          title="Open New Tab (⌘T)"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
