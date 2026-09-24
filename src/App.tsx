import React, { useState, useEffect } from 'react';
import { 
  Tab, 
  Workspace, 
  SplitMode, 
  DeviceMode, 
  PrivacyStats, 
  Bookmark, 
  HistoryItem, 
  DownloadItem 
} from './types/browser';
import { SAMPLE_PAGES } from './data/samplePages';
import { TopBar } from './components/TopBar';
import { TabBar } from './components/TabBar';
import { Omnibar } from './components/Omnibar';
import { BookmarksBar } from './components/BookmarksBar';
import { BrowserPane } from './components/BrowserPane';
import { DevTools } from './components/DevTools';
import { AiCopilot } from './components/AiCopilot';
import { PrivacyShieldModal } from './components/PrivacyShieldModal';
import { CommandPalette } from './components/CommandPalette';
import { HistoryModal } from './components/HistoryModal';
import { DownloadsModal } from './components/DownloadsModal';
import { SettingsModal } from './components/SettingsModal';
import { VisualTabMatrix } from './components/VisualTabMatrix';

export const App: React.FC = () => {
  // Initial Workspaces
  const [workspaces, setWorkspaces] = useState<Workspace[]>([
    {
      id: 'ws-research',
      name: 'Research & Tech',
      icon: '🔬',
      color: '#3b82f6',
      tabIds: ['tab-1', 'tab-2', 'tab-3'],
      activeTabId: 'tab-2',
    },
    {
      id: 'ws-dev',
      name: 'Development',
      icon: '💻',
      color: '#10b981',
      tabIds: ['tab-4', 'tab-5'],
      activeTabId: 'tab-4',
    },
    {
      id: 'ws-media',
      name: 'Creative Canvas',
      icon: '🌌',
      color: '#8b5cf6',
      tabIds: ['tab-6'],
      activeTabId: 'tab-6',
    }
  ]);

  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>('ws-research');

  // Initial Tabs
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: 'tab-1',
      workspaceId: 'ws-research',
      title: 'Aether OS • Command Canvas',
      url: 'aether://home',
      favicon: '🌌',
      isLoading: false,
      canGoBack: false,
      canGoForward: false,
      history: ['aether://home'],
      historyIndex: 0,
      isPinned: true,
      isMuted: false,
      isIncognito: false,
      isReaderMode: false,
      lastActiveTime: Date.now(),
      memoryUsageMb: 32,
      securityStatus: 'secure',
      deviceMode: 'desktop',
      zoomLevel: 100,
    },
    {
      id: 'tab-2',
      workspaceId: 'ws-research',
      title: 'TechNews Today • Silicon Photonics Breakthrough',
      url: 'https://technews.today',
      favicon: '⚡',
      isLoading: false,
      canGoBack: false,
      canGoForward: false,
      history: ['https://technews.today'],
      historyIndex: 0,
      isPinned: false,
      isMuted: false,
      isIncognito: false,
      isReaderMode: false,
      lastActiveTime: Date.now(),
      memoryUsageMb: 54,
      securityStatus: 'secure',
      deviceMode: 'desktop',
      zoomLevel: 100,
    },
    {
      id: 'tab-3',
      workspaceId: 'ws-research',
      title: 'Artificial neural network - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Neural_network',
      favicon: '📖',
      isLoading: false,
      canGoBack: false,
      canGoForward: false,
      history: ['https://en.wikipedia.org/wiki/Neural_network'],
      historyIndex: 0,
      isPinned: false,
      isMuted: false,
      isIncognito: false,
      isReaderMode: false,
      lastActiveTime: Date.now(),
      memoryUsageMb: 46,
      securityStatus: 'secure',
      deviceMode: 'desktop',
      zoomLevel: 100,
    },
    {
      id: 'tab-4',
      workspaceId: 'ws-dev',
      title: 'Trending Repositories • GitHub',
      url: 'https://github.com/trending',
      favicon: '🐙',
      isLoading: false,
      canGoBack: false,
      canGoForward: false,
      history: ['https://github.com/trending'],
      historyIndex: 0,
      isPinned: false,
      isMuted: false,
      isIncognito: false,
      isReaderMode: false,
      lastActiveTime: Date.now(),
      memoryUsageMb: 68,
      securityStatus: 'secure',
      deviceMode: 'desktop',
      zoomLevel: 100,
    },
    {
      id: 'tab-5',
      workspaceId: 'ws-dev',
      title: 'CSS Grid Layout Architecture • DevDocs',
      url: 'https://devdocs.io/css-grid',
      favicon: '📐',
      isLoading: false,
      canGoBack: false,
      canGoForward: false,
      history: ['https://devdocs.io/css-grid'],
      historyIndex: 0,
      isPinned: false,
      isMuted: false,
      isIncognito: false,
      isReaderMode: false,
      lastActiveTime: Date.now(),
      memoryUsageMb: 40,
      securityStatus: 'secure',
      deviceMode: 'desktop',
      zoomLevel: 100,
    },
    {
      id: 'tab-6',
      workspaceId: 'ws-media',
      title: 'Aether OS • Command Canvas',
      url: 'aether://home',
      favicon: '🌌',
      isLoading: false,
      canGoBack: false,
      canGoForward: false,
      history: ['aether://home'],
      historyIndex: 0,
      isPinned: false,
      isMuted: false,
      isIncognito: false,
      isReaderMode: false,
      lastActiveTime: Date.now(),
      memoryUsageMb: 28,
      securityStatus: 'secure',
      deviceMode: 'desktop',
      zoomLevel: 100,
    }
  ]);

  // Active workspace & tab
  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId) || workspaces[0];
  const activeTabId = activeWorkspace?.activeTabId || tabs[0]?.id;
  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  // Secondary tab for split-screen
  const [secondaryTabId, setSecondaryTabId] = useState<string>('tab-3');
  const secondaryTab = tabs.find(t => t.id === secondaryTabId) || tabs[1] || activeTab;

  // Split mode & Device Viewport
  const [splitMode, setSplitMode] = useState<SplitMode>('single');
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');

  // Bookmarks
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([
    { id: 'b1', title: 'TechNews Today', url: 'https://technews.today', icon: '⚡', createdAt: Date.now() },
    { id: 'b2', title: 'Neural Networks', url: 'https://en.wikipedia.org/wiki/Neural_network', icon: '📖', createdAt: Date.now() },
    { id: 'b3', title: 'GitHub Trending', url: 'https://github.com/trending', icon: '🐙', createdAt: Date.now() },
    { id: 'b4', title: 'CSS Grid Lab', url: 'https://devdocs.io/css-grid', icon: '📐', createdAt: Date.now() },
    { id: 'b5', title: 'Aether Home', url: 'aether://home', icon: '🌌', createdAt: Date.now() },
  ]);

  // Browsing History
  const [history, setHistory] = useState<HistoryItem[]>([
    { id: 'h1', title: 'Silicon Photonics Breakthrough', url: 'https://technews.today', favicon: '⚡', visitedAt: Date.now() - 1000 * 60 * 15, workspaceName: 'Research & Tech' },
    { id: 'h2', title: 'Artificial neural network - Wikipedia', url: 'https://en.wikipedia.org/wiki/Neural_network', favicon: '📖', visitedAt: Date.now() - 1000 * 60 * 45, workspaceName: 'Research & Tech' },
    { id: 'h3', title: 'Trending Repositories • GitHub', url: 'https://github.com/trending', favicon: '🐙', visitedAt: Date.now() - 1000 * 60 * 120, workspaceName: 'Development' },
  ]);

  // Downloads
  const [downloads, setDownloads] = useState<DownloadItem[]>([
    { id: 'd1', filename: 'photonics_spec_sheet_v2.pdf', fileSize: '4.8 MB', progress: 100, status: 'completed', url: 'https://technews.today/pdf', timestamp: Date.now() - 1000 * 60 * 10 },
  ]);

  // Privacy Shield Stats
  const [privacyStats, setPrivacyStats] = useState<PrivacyStats>({
    trackersBlockedTotal: 142,
    adsBlockedTotal: 89,
    fingerprintsDefended: 34,
    httpsUpgrades: 67,
    thirdPartyCookiesBlocked: true,
    fingerprintProtection: true,
    scriptShield: true,
    webrtcLeakShield: true,
    stealthMode: false,
  });

  // UI Modals & Drawers
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isDownloadsModalOpen, setIsDownloadsModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isTabMatrixOpen, setIsTabMatrixOpen] = useState(false);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K -> Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
      // Cmd+T or Ctrl+T -> New Tab
      else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 't') {
        e.preventDefault();
        handleNewTab();
      }
      // Cmd+W or Ctrl+W -> Close active tab
      else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'w') {
        e.preventDefault();
        if (activeTab && !activeTab.isPinned) {
          handleCloseTab(activeTab.id);
        }
      }
      // Cmd+\ -> Toggle split screen
      else if ((e.metaKey || e.ctrlKey) && e.key === '\\') {
        e.preventDefault();
        setSplitMode(m => (m === 'single' ? 'split-vertical' : 'single'));
      }
      // F12 -> DevTools
      else if (e.key === 'F12') {
        e.preventDefault();
        setIsDevToolsOpen(d => !d);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeWorkspaceId, activeTabId, tabs]);

  // Navigate active tab to URL
  const handleNavigate = (newUrl: string) => {
    if (!activeTab) return;

    const sample = SAMPLE_PAGES[newUrl];
    const newTitle = sample?.title || newUrl.replace(/^https?:\/\//, '');
    const newFavicon = sample?.favicon || '🌐';

    setTabs(prevTabs =>
      prevTabs.map(t => {
        if (t.id === activeTab.id) {
          const newHistory = [...t.history.slice(0, t.historyIndex + 1), newUrl];
          return {
            ...t,
            url: newUrl,
            title: newTitle,
            favicon: newFavicon,
            history: newHistory,
            historyIndex: newHistory.length - 1,
            canGoBack: newHistory.length > 1,
            canGoForward: false,
            isLoading: false,
          };
        }
        return t;
      })
    );

    // Append to browsing history
    setHistory(prev => [
      {
        id: Date.now().toString(),
        title: newTitle,
        url: newUrl,
        favicon: newFavicon,
        visitedAt: Date.now(),
        workspaceName: activeWorkspace.name,
      },
      ...prev
    ]);

    // Update privacy metrics
    setPrivacyStats(prev => ({
      ...prev,
      trackersBlockedTotal: prev.trackersBlockedTotal + (sample?.trackersFound.length || 2),
      adsBlockedTotal: prev.adsBlockedTotal + 1,
    }));
  };

  const handleGoBack = () => {
    if (!activeTab || activeTab.historyIndex <= 0) return;
    const prevIdx = activeTab.historyIndex - 1;
    const prevUrl = activeTab.history[prevIdx];
    const sample = SAMPLE_PAGES[prevUrl];

    setTabs(prev =>
      prev.map(t => {
        if (t.id === activeTab.id) {
          return {
            ...t,
            url: prevUrl,
            title: sample?.title || prevUrl,
            favicon: sample?.favicon || '🌐',
            historyIndex: prevIdx,
            canGoBack: prevIdx > 0,
            canGoForward: true,
          };
        }
        return t;
      })
    );
  };

  const handleGoForward = () => {
    if (!activeTab || activeTab.historyIndex >= activeTab.history.length - 1) return;
    const nextIdx = activeTab.historyIndex + 1;
    const nextUrl = activeTab.history[nextIdx];
    const sample = SAMPLE_PAGES[nextUrl];

    setTabs(prev =>
      prev.map(t => {
        if (t.id === activeTab.id) {
          return {
            ...t,
            url: nextUrl,
            title: sample?.title || nextUrl,
            favicon: sample?.favicon || '🌐',
            historyIndex: nextIdx,
            canGoBack: true,
            canGoForward: nextIdx < t.history.length - 1,
          };
        }
        return t;
      })
    );
  };

  const handleReload = () => {
    if (!activeTab) return;
    setTabs(prev =>
      prev.map(t => (t.id === activeTab.id ? { ...t, isLoading: true } : t))
    );
    setTimeout(() => {
      setTabs(prev =>
        prev.map(t => (t.id === activeTab.id ? { ...t, isLoading: false } : t))
      );
    }, 400);
  };

  // Workspaces Management
  const handleSelectWorkspace = (wsId: string) => {
    setActiveWorkspaceId(wsId);
  };

  const handleAddWorkspace = () => {
    const wsName = prompt('Enter name for new workspace (e.g. Finance, AI Labs):');
    if (!wsName?.trim()) return;

    const newWsId = `ws-${Date.now()}`;
    const newTabId = `tab-${Date.now()}`;

    const newTab: Tab = {
      id: newTabId,
      workspaceId: newWsId,
      title: 'Aether OS • Command Canvas',
      url: 'aether://home',
      favicon: '🌌',
      isLoading: false,
      canGoBack: false,
      canGoForward: false,
      history: ['aether://home'],
      historyIndex: 0,
      isPinned: false,
      isMuted: false,
      isIncognito: false,
      isReaderMode: false,
      lastActiveTime: Date.now(),
      memoryUsageMb: 30,
      securityStatus: 'secure',
      deviceMode: 'desktop',
      zoomLevel: 100,
    };

    const newWs: Workspace = {
      id: newWsId,
      name: wsName.trim(),
      icon: '📁',
      color: '#6366f1',
      tabIds: [newTabId],
      activeTabId: newTabId,
    };

    setTabs(prev => [...prev, newTab]);
    setWorkspaces(prev => [...prev, newWs]);
    setActiveWorkspaceId(newWsId);
  };

  // Tab Management
  const handleSelectTab = (tabId: string) => {
    setWorkspaces(prev =>
      prev.map(ws => (ws.id === activeWorkspaceId ? { ...ws, activeTabId: tabId } : ws))
    );
  };

  const handleCloseTab = (tabId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const wsTabs = tabs.filter(t => t.workspaceId === activeWorkspaceId);
    if (wsTabs.length <= 1) {
      // Don't close last tab in workspace, just reset it to home
      handleNavigate('aether://home');
      return;
    }

    const remainingWsTabs = wsTabs.filter(t => t.id !== tabId);
    const newActiveTab = remainingWsTabs[remainingWsTabs.length - 1];

    setTabs(prev => prev.filter(t => t.id !== tabId));
    setWorkspaces(prev =>
      prev.map(ws => {
        if (ws.id === activeWorkspaceId) {
          return {
            ...ws,
            tabIds: ws.tabIds.filter(id => id !== tabId),
            activeTabId: ws.activeTabId === tabId ? newActiveTab.id : ws.activeTabId,
          };
        }
        return ws;
      })
    );
  };

  const handleNewTab = (workspaceId = activeWorkspaceId) => {
    const newTabId = `tab-${Date.now()}`;
    const newTab: Tab = {
      id: newTabId,
      workspaceId,
      title: 'Aether OS • Command Canvas',
      url: 'aether://home',
      favicon: '🌌',
      isLoading: false,
      canGoBack: false,
      canGoForward: false,
      history: ['aether://home'],
      historyIndex: 0,
      isPinned: false,
      isMuted: false,
      isIncognito: false,
      isReaderMode: false,
      lastActiveTime: Date.now(),
      memoryUsageMb: 32,
      securityStatus: 'secure',
      deviceMode: 'desktop',
      zoomLevel: 100,
    };

    setTabs(prev => [...prev, newTab]);
    setWorkspaces(prev =>
      prev.map(ws => {
        if (ws.id === workspaceId) {
          return {
            ...ws,
            tabIds: [...ws.tabIds, newTabId],
            activeTabId: newTabId,
          };
        }
        return ws;
      })
    );
  };

  const handleTogglePinTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTabs(prev =>
      prev.map(t => (t.id === tabId ? { ...t, isPinned: !t.isPinned } : t))
    );
  };

  const handleToggleMuteTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTabs(prev =>
      prev.map(t => (t.id === tabId ? { ...t, isMuted: !t.isMuted } : t))
    );
  };

  const handleToggleReaderMode = () => {
    if (!activeTab) return;
    setTabs(prev =>
      prev.map(t =>
        t.id === activeTab.id ? { ...t, isReaderMode: !t.isReaderMode } : t
      )
    );
  };

  const handleChangeZoom = (delta: number) => {
    if (!activeTab) return;
    setTabs(prev =>
      prev.map(t =>
        t.id === activeTab.id
          ? { ...t, zoomLevel: Math.min(200, Math.max(50, t.zoomLevel + delta)) }
          : t
      )
    );
  };

  const handleResetZoom = () => {
    if (!activeTab) return;
    setTabs(prev =>
      prev.map(t => (t.id === activeTab.id ? { ...t, zoomLevel: 100 } : t))
    );
  };

  const handleToggleBookmark = () => {
    if (!activeTab) return;
    const existing = bookmarks.find(b => b.url === activeTab.url);
    if (existing) {
      setBookmarks(prev => prev.filter(b => b.id !== existing.id));
    } else {
      setBookmarks(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          title: activeTab.title,
          url: activeTab.url,
          icon: activeTab.favicon,
          createdAt: Date.now(),
        }
      ]);
    }
  };

  const handleAddDownload = (filename: string, size: string) => {
    const newDownload: DownloadItem = {
      id: Date.now().toString(),
      filename,
      fileSize: size,
      progress: 100,
      status: 'completed',
      url: activeTab?.url || 'https://aether.internal',
      timestamp: Date.now(),
    };
    setDownloads(prev => [newDownload, ...prev]);
    setIsDownloadsModalOpen(true);
  };

  const handleResetAllData = () => {
    setHistory([]);
    setDownloads([]);
    setPrivacyStats(s => ({
      ...s,
      trackersBlockedTotal: 0,
      adsBlockedTotal: 0,
      fingerprintsDefended: 0,
    }));
  };

  const activeWorkspaceTabs = tabs.filter(t => t.workspaceId === activeWorkspaceId);
  const isCurrentBookmarked = bookmarks.some(b => b.url === activeTab?.url);

  return (
    <div className="w-screen h-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      {/* 1. Global Operating Top Bar */}
      <TopBar
        workspaces={workspaces}
        activeWorkspaceId={activeWorkspaceId}
        onSelectWorkspace={handleSelectWorkspace}
        onAddWorkspace={handleAddWorkspace}
        splitMode={splitMode}
        onToggleSplitMode={setSplitMode}
        deviceMode={deviceMode}
        onChangeDeviceMode={setDeviceMode}
        privacyStats={privacyStats}
        onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
        isAiDrawerOpen={isAiDrawerOpen}
        onToggleAiDrawer={() => setIsAiDrawerOpen(o => !o)}
        isDevToolsOpen={isDevToolsOpen}
        onToggleDevTools={() => setIsDevToolsOpen(d => !d)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenHistory={() => setIsHistoryModalOpen(true)}
        onOpenDownloads={() => setIsDownloadsModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        downloadCount={downloads.length}
      />

      {/* 2. Tabs Bar */}
      <TabBar
        tabs={activeWorkspaceTabs}
        activeTabId={activeTabId}
        secondaryTabId={secondaryTabId}
        splitMode={splitMode}
        onSelectTab={handleSelectTab}
        onCloseTab={handleCloseTab}
        onNewTab={() => handleNewTab(activeWorkspaceId)}
        onTogglePinTab={handleTogglePinTab}
        onToggleMuteTab={handleToggleMuteTab}
        onToggleTabOverview={() => setIsTabMatrixOpen(true)}
      />

      {/* 3. Omnibar / Address & Tools Bar */}
      {activeTab && (
        <Omnibar
          tab={activeTab}
          isBookmarked={isCurrentBookmarked}
          onNavigate={handleNavigate}
          onGoBack={handleGoBack}
          onGoForward={handleGoForward}
          onReload={handleReload}
          onToggleBookmark={handleToggleBookmark}
          onToggleReaderMode={handleToggleReaderMode}
          onChangeZoom={handleChangeZoom}
          onResetZoom={handleResetZoom}
          onAskAiCurrentPage={() => setIsAiDrawerOpen(true)}
        />
      )}

      {/* 4. Bookmarks Bar */}
      <BookmarksBar
        bookmarks={bookmarks}
        onOpenBookmark={handleNavigate}
        onAddBookmarkCurrent={handleToggleBookmark}
      />

      {/* 5. Main Content Area (Split Panes + AI Drawer) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Canvas Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Primary Viewport Pane */}
          {activeTab && (
            <div className="flex-1 h-full overflow-hidden flex flex-col">
              <BrowserPane
                tab={{ ...activeTab, deviceMode }}
                onNavigate={handleNavigate}
                onOpenAiDrawer={() => setIsAiDrawerOpen(true)}
                onToggleReaderMode={handleToggleReaderMode}
                onAddDownload={handleAddDownload}
                isActivePane={true}
              />
            </div>
          )}

          {/* Secondary Viewport Pane (If in Split View) */}
          {splitMode !== 'single' && secondaryTab && (
            <div className="w-1/2 h-full border-l border-slate-800 flex flex-col">
              {/* Secondary Pane Mini Omnibar */}
              <div className="h-8 bg-slate-900 border-b border-slate-800 px-3 flex items-center justify-between text-xs text-slate-400">
                <span className="truncate font-mono text-[11px] text-indigo-300">
                  Dual Split: {secondaryTab.title}
                </span>
                <button
                  onClick={() => setSplitMode('single')}
                  className="hover:text-white px-1.5 py-0.5 rounded bg-slate-800"
                >
                  Close Split
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <BrowserPane
                  tab={{ ...secondaryTab, deviceMode }}
                  onNavigate={(url) => {
                    setTabs(prev =>
                      prev.map(t => (t.id === secondaryTab.id ? { ...t, url, title: url } : t))
                    );
                  }}
                  onOpenAiDrawer={() => setIsAiDrawerOpen(true)}
                  onToggleReaderMode={() => {}}
                  onAddDownload={handleAddDownload}
                  isActivePane={false}
                />
              </div>
            </div>
          )}
        </div>

        {/* Neural Co-Pilot Docked Drawer */}
        {activeTab && (
          <AiCopilot
            isOpen={isAiDrawerOpen}
            onClose={() => setIsAiDrawerOpen(false)}
            activeTab={activeTab}
          />
        )}
      </div>

      {/* 6. Developer Tools Panel (Bottom Drawer) */}
      <DevTools
        isOpen={isDevToolsOpen}
        onClose={() => setIsDevToolsOpen(false)}
        activeUrl={activeTab?.url || 'aether://home'}
      />

      {/* 7. Floating Modals */}
      <PrivacyShieldModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        stats={privacyStats}
        onUpdateStats={(newStats) => setPrivacyStats(s => ({ ...s, ...newStats }))}
        activeDomain={activeTab?.url.startsWith('http') ? new URL(activeTab.url).hostname : 'local'}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={handleNavigate}
        onNewTab={() => handleNewTab(activeWorkspaceId)}
        onToggleSplitMode={setSplitMode}
        onChangeDeviceMode={setDeviceMode}
        onToggleAiDrawer={() => setIsAiDrawerOpen(o => !o)}
        onToggleDevTools={() => setIsDevToolsOpen(d => !d)}
        onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
        onReload={handleReload}
        onToggleReaderMode={handleToggleReaderMode}
        workspaces={workspaces}
        onSelectWorkspace={handleSelectWorkspace}
      />

      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        history={history}
        onOpenUrl={handleNavigate}
        onClearHistory={() => setHistory([])}
      />

      <DownloadsModal
        isOpen={isDownloadsModalOpen}
        onClose={() => setIsDownloadsModalOpen(false)}
        downloads={downloads}
        onClearDownloads={() => setDownloads([])}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onResetAllData={handleResetAllData}
      />

      <VisualTabMatrix
        isOpen={isTabMatrixOpen}
        onClose={() => setIsTabMatrixOpen(false)}
        tabs={tabs}
        workspaces={workspaces}
        activeTabId={activeTabId}
        onSelectTab={(tabId, wsId) => {
          setActiveWorkspaceId(wsId);
          handleSelectTab(tabId);
        }}
        onCloseTab={(tabId) => handleCloseTab(tabId)}
        onNewTabInWorkspace={(wsId) => handleNewTab(wsId)}
      />
    </div>
  );
};
export default App;
