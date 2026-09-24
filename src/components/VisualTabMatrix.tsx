import React, { useState } from 'react';
import { Tab, Workspace } from '../types/browser';
import { X, Search, Plus, Globe, Layers, Trash2 } from 'lucide-react';

interface VisualTabMatrixProps {
  isOpen: boolean;
  onClose: () => void;
  tabs: Tab[];
  workspaces: Workspace[];
  activeTabId: string;
  onSelectTab: (tabId: string, workspaceId: string) => void;
  onCloseTab: (tabId: string) => void;
  onNewTabInWorkspace: (workspaceId: string) => void;
}

export const VisualTabMatrix: React.FC<VisualTabMatrixProps> = ({
  isOpen,
  onClose,
  tabs,
  workspaces,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onNewTabInWorkspace,
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  if (!isOpen) return null;

  const filteredTabs = tabs.filter(
    t => t.title.toLowerCase().includes(filterQuery.toLowerCase()) || t.url.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xl flex flex-col p-6 select-none animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Visual Tab Canvas Matrix</h2>
            <p className="text-xs text-slate-400">{tabs.length} tabs open across {workspaces.length} workspaces</p>
          </div>
        </div>

        {/* Filter input */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 w-64 text-xs">
            <Search className="w-4 h-4 text-slate-400 mr-2" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter open tabs..."
              className="bg-transparent outline-none text-slate-100 placeholder-slate-500 w-full"
            />
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Grid of Workspaces and their Tabs */}
      <div className="max-w-6xl w-full mx-auto flex-1 overflow-y-auto py-6 space-y-8">
        {workspaces.map((ws) => {
          const wsTabs = filteredTabs.filter(t => t.workspaceId === ws.id);
          if (wsTabs.length === 0 && filterQuery) return null;

          return (
            <div key={ws.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{ws.icon}</span>
                  <h3 className="text-sm font-bold text-slate-200">{ws.name}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                    {wsTabs.length} tabs
                  </span>
                </div>

                <button
                  onClick={() => onNewTabInWorkspace(ws.id)}
                  className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-medium"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Tab</span>
                </button>
              </div>

              {/* Tab Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {wsTabs.map((tab) => {
                  const isActive = tab.id === activeTabId;
                  return (
                    <div
                      key={tab.id}
                      onClick={() => {
                        onSelectTab(tab.id, ws.id);
                        onClose();
                      }}
                      className={`group relative p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-44 ${
                        isActive
                          ? 'bg-slate-900 border-blue-500 ring-2 ring-blue-500/40 shadow-xl'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      {/* Card Top */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-base flex-shrink-0">{tab.favicon || '🌐'}</span>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-slate-200 truncate group-hover:text-blue-400">
                              {tab.title}
                            </h4>
                            <p className="text-[10px] font-mono text-slate-500 truncate">{tab.url}</p>
                          </div>
                        </div>

                        {!tab.isPinned && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onCloseTab(tab.id);
                            }}
                            className="p-1 rounded-full text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                            title="Close tab"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Card Preview Graphic */}
                      <div className="my-2 p-2 rounded-lg bg-slate-950/80 border border-slate-800/60 flex-1 flex flex-col justify-center text-[10px] text-slate-400 font-mono">
                        <div className="truncate opacity-75">URL: {tab.url}</div>
                        <div className="mt-1 text-emerald-400">Status: 200 OK • Isolated</div>
                      </div>

                      {/* Card Bottom Meta */}
                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-800/50">
                        <span>RAM: {tab.memoryUsageMb} MB</span>
                        {isActive && <span className="text-blue-400 font-bold">Active Canvas</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
