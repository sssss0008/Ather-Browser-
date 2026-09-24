import React from 'react';
import { 
  Columns, 
  Square, 
  Smartphone, 
  Tablet, 
  Monitor, 
  ShieldCheck, 
  Sparkles, 
  Terminal, 
  Settings, 
  Command,
  Download,
  History,
  Layers,
  Search
} from 'lucide-react';
import { DeviceMode, SplitMode, PrivacyStats, Workspace } from '../types/browser';

interface TopBarProps {
  workspaces: Workspace[];
  activeWorkspaceId: string;
  onSelectWorkspace: (id: string) => void;
  onAddWorkspace: () => void;
  splitMode: SplitMode;
  onToggleSplitMode: (mode: SplitMode) => void;
  deviceMode: DeviceMode;
  onChangeDeviceMode: (mode: DeviceMode) => void;
  privacyStats: PrivacyStats;
  onOpenPrivacyModal: () => void;
  isAiDrawerOpen: boolean;
  onToggleAiDrawer: () => void;
  isDevToolsOpen: boolean;
  onToggleDevTools: () => void;
  onOpenCommandPalette: () => void;
  onOpenHistory: () => void;
  onOpenDownloads: () => void;
  onOpenSettings: () => void;
  downloadCount: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  workspaces,
  activeWorkspaceId,
  onSelectWorkspace,
  onAddWorkspace,
  splitMode,
  onToggleSplitMode,
  deviceMode,
  onChangeDeviceMode,
  privacyStats,
  onOpenPrivacyModal,
  isAiDrawerOpen,
  onToggleAiDrawer,
  isDevToolsOpen,
  onToggleDevTools,
  onOpenCommandPalette,
  onOpenHistory,
  onOpenDownloads,
  onOpenSettings,
  downloadCount
}) => {
  return (
    <header className="h-10 bg-slate-900/90 border-b border-slate-800/80 px-3 flex items-center justify-between gap-2 text-xs select-none backdrop-blur-md z-30">
      {/* Left: Window Dots & App Branding */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-1">
          <span className="w-3 h-3 rounded-full bg-rose-500/80 hover:bg-rose-500 transition-colors cursor-pointer inline-block" title="Close Aether Window" />
          <span className="w-3 h-3 rounded-full bg-amber-500/80 hover:bg-amber-500 transition-colors cursor-pointer inline-block" title="Minimize" />
          <span className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-500 transition-colors cursor-pointer inline-block" title="Expand Fullscreen" />
        </div>

        {/* Brand pill */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/30 text-blue-300 font-semibold tracking-wide">
          <span className="text-sm">✦</span>
          <span>AETHER</span>
          <span className="text-[10px] uppercase font-mono px-1 py-0.2 rounded bg-blue-500/20 text-blue-200">OS 2.6</span>
        </div>

        {/* Workspaces Switcher */}
        <div className="flex items-center gap-1 bg-slate-800/60 p-0.5 rounded-lg border border-slate-700/50">
          {workspaces.map((ws) => {
            const isActive = ws.id === activeWorkspaceId;
            return (
              <button
                key={ws.id}
                onClick={() => onSelectWorkspace(ws.id)}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm font-medium'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/40'
                }`}
                title={`Switch to ${ws.name} workspace`}
              >
                <span>{ws.icon}</span>
                <span className="hidden md:inline">{ws.name}</span>
                <span className={`text-[10px] px-1 rounded-full ${isActive ? 'bg-blue-800 text-blue-200' : 'bg-slate-700 text-slate-400'}`}>
                  {ws.tabIds.length}
                </span>
              </button>
            );
          })}
          <button
            onClick={onAddWorkspace}
            className="px-1.5 py-1 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 rounded-md transition-colors"
            title="Create New Workspace"
          >
            +
          </button>
        </div>
      </div>

      {/* Center: Command Palette Trigger */}
      <button
        onClick={onOpenCommandPalette}
        className="flex items-center gap-2 px-3 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-400 hover:text-slate-200 transition-all w-64 justify-between"
      >
        <span className="flex items-center gap-1.5">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[11px]">Command Palette / Quick Jump</span>
        </span>
        <kbd className="text-[10px] font-mono bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-700 text-slate-300">
          ⌘K
        </kbd>
      </button>

      {/* Right Controls: Multi-Device, Split Screen, Privacy, AI, DevTools */}
      <div className="flex items-center gap-1.5">
        {/* Device Viewport Selector */}
        <div className="flex items-center bg-slate-800/60 p-0.5 rounded-lg border border-slate-700/50">
          <button
            onClick={() => onChangeDeviceMode('desktop')}
            className={`p-1 rounded transition-colors ${deviceMode === 'desktop' ? 'bg-slate-700 text-blue-400' : 'text-slate-400 hover:text-slate-200'}`}
            title="Desktop Viewport"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onChangeDeviceMode('tablet')}
            className={`p-1 rounded transition-colors ${deviceMode === 'tablet' ? 'bg-slate-700 text-blue-400' : 'text-slate-400 hover:text-slate-200'}`}
            title="Tablet (iPad Pro 11-inch)"
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onChangeDeviceMode('mobile-ios')}
            className={`p-1 rounded transition-colors ${deviceMode === 'mobile-ios' ? 'bg-slate-700 text-blue-400' : 'text-slate-400 hover:text-slate-200'}`}
            title="Mobile (iPhone 16 Pro)"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Split Screen Selector */}
        <div className="flex items-center bg-slate-800/60 p-0.5 rounded-lg border border-slate-700/50">
          <button
            onClick={() => onToggleSplitMode('single')}
            className={`p-1 rounded transition-colors ${splitMode === 'single' ? 'bg-slate-700 text-blue-400' : 'text-slate-400 hover:text-slate-200'}`}
            title="Single Screen"
          >
            <Square className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onToggleSplitMode('split-vertical')}
            className={`p-1 rounded transition-colors ${splitMode === 'split-vertical' ? 'bg-slate-700 text-blue-400' : 'text-slate-400 hover:text-slate-200'}`}
            title="Dual Split Screen (Side by Side)"
          >
            <Columns className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Privacy Shield Button */}
        <button
          onClick={onOpenPrivacyModal}
          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 font-medium transition-colors"
          title="Aether Zero-Trust Privacy Shield"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-mono text-[11px]">{privacyStats.trackersBlockedTotal + privacyStats.adsBlockedTotal}</span>
        </button>

        {/* AI Co-Pilot Toggle */}
        <button
          onClick={onToggleAiDrawer}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-medium transition-all ${
            isAiDrawerOpen
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 border-blue-400 text-white shadow-md shadow-blue-500/20'
              : 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-blue-300 hover:text-white'
          }`}
          title="Toggle Neural Co-Pilot (Gemini)"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-300 animate-pulse" />
          <span className="hidden sm:inline">Co-Pilot</span>
        </button>

        {/* DevTools Drawer Button */}
        <button
          onClick={onToggleDevTools}
          className={`p-1.5 rounded-lg border transition-colors ${
            isDevToolsOpen
              ? 'bg-amber-600/30 border-amber-500 text-amber-300'
              : 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-300'
          }`}
          title="Toggle Developer Tools (Console & DOM Inspector)"
        >
          <Terminal className="w-3.5 h-3.5" />
        </button>

        {/* History & Downloads */}
        <button
          onClick={onOpenHistory}
          className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          title="Browse History"
        >
          <History className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onOpenDownloads}
          className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors relative"
          title="Downloads Manager"
        >
          <Download className="w-3.5 h-3.5" />
          {downloadCount > 0 && (
            <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-slate-900" />
          )}
        </button>

        <button
          onClick={onOpenSettings}
          className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          title="Aether Preferences"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
