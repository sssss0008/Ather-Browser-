import React, { useState } from 'react';
import { DevToolsTab, ConsoleLog, NetworkRequest } from '../types/browser';
import { 
  X, 
  Terminal, 
  Code, 
  Activity, 
  Database, 
  Gauge, 
  Trash2, 
  Play, 
  Filter,
  CheckCircle2,
  AlertTriangle,
  AlertCircle
} from 'lucide-react';

interface DevToolsProps {
  isOpen: boolean;
  onClose: () => void;
  activeUrl: string;
}

export const DevTools: React.FC<DevToolsProps> = ({ isOpen, onClose, activeUrl }) => {
  const [activeTab, setActiveTab] = useState<DevToolsTab>('console');
  
  // Console logs state
  const [logs, setLogs] = useState<ConsoleLog[]>([
    { id: '1', type: 'info', message: 'Aether Runtime V8 Sandbox initialized in isolate #4', timestamp: '10:04:12', source: 'system:init' },
    { id: '2', type: 'log', message: `Connected to DOM tree: ${activeUrl}`, timestamp: '10:04:13', source: 'renderer:doc' },
    { id: '3', type: 'info', message: 'Zero-Trust Content Security Policy active: script-src self', timestamp: '10:04:13', source: 'security:csp' },
    { id: '4', type: 'warn', message: 'Third-party tracking script "analytics.js" was blocked by Aether Shield', timestamp: '10:04:14', source: 'shield:adblock' },
  ]);
  const [consoleInput, setConsoleInput] = useState('');

  // Elements DOM state
  const [selectedElement, setSelectedElement] = useState<string>('article.post-content');
  const [customStyles, setCustomStyles] = useState<Record<string, string>>({
    'font-family': 'Inter, sans-serif',
    'color': '#f8fafc',
    'background': '#0f172a',
    'padding': '24px',
    'border-radius': '12px',
  });

  // Network requests state
  const [requests] = useState<NetworkRequest[]>([
    { id: '1', url: `${activeUrl}`, method: 'GET', status: 200, type: 'xhr', size: '14.2 KB', timeMs: 42, timestamp: '10:04:12' },
    { id: '2', url: 'https://cdn.aether.io/fonts/inter.woff2', method: 'GET', status: 200, type: 'font', size: '28.4 KB', timeMs: 18, timestamp: '10:04:13' },
    { id: '3', url: 'https://cdn.aether.io/styles/theme.css', method: 'GET', status: 304, type: 'stylesheet', size: '6.1 KB', timeMs: 9, timestamp: '10:04:13' },
    { id: '4', url: 'https://telemetry.evil-tracker.com/pixel.gif', method: 'GET', status: 0, type: 'fetch', size: '0 B (Blocked)', timeMs: 1, timestamp: '10:04:14' },
  ]);

  // Storage key-values
  const [storageItems, setStorageItems] = useState<{ key: string; value: string }[]>([
    { key: 'aether_user_theme', value: '"dark"' },
    { key: 'aether_reader_font', value: '"serif"' },
    { key: 'aether_session_token', value: '"aeth_sec_99382109x"' },
  ]);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  if (!isOpen) return null;

  const handleConsoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = consoleInput.trim();
    if (!query) return;

    let resultMsg: string;
    let logType: 'log' | 'info' | 'warn' | 'error' = 'log';

    try {
      if (query === 'clear' || query === 'clear()') {
        setLogs([]);
        setConsoleInput('');
        return;
      }
      if (query.includes('location') || query.includes('url')) {
        resultMsg = activeUrl;
      } else if (query.includes('title')) {
        resultMsg = 'Aether Browser Canvas';
      } else if (query.includes('navigator')) {
        resultMsg = 'Mozilla/5.0 (AetherOS; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0';
      } else {
        // Safe evaluation of simple JS math or expressions
        // eslint-disable-next-line no-eval
        const res = Function(`"use strict"; return (${query})`)();
        resultMsg = typeof res === 'object' ? JSON.stringify(res, null, 2) : String(res);
      }
    } catch (err: any) {
      resultMsg = `Uncaught ${err?.message || 'SyntaxError'}`;
      logType = 'error';
    }

    setLogs(prev => [
      ...prev,
      { id: Date.now().toString(), type: 'log', message: `> ${query}`, timestamp: new Date().toLocaleTimeString() },
      { id: (Date.now() + 1).toString(), type: logType, message: resultMsg, timestamp: new Date().toLocaleTimeString() }
    ]);
    setConsoleInput('');
  };

  const handleAddStorageItem = () => {
    if (!newKey.trim()) return;
    setStorageItems(prev => [...prev, { key: newKey.trim(), value: newValue.trim() || '""' }]);
    setNewKey('');
    setNewValue('');
  };

  const handleDeleteStorageItem = (k: string) => {
    setStorageItems(prev => prev.filter(item => item.key !== k));
  };

  return (
    <div className="h-72 bg-slate-950 border-t border-slate-800 flex flex-col select-none text-xs z-30 font-mono shadow-2xl">
      {/* DevTools Header Bar */}
      <div className="h-8 bg-slate-900 border-b border-slate-800 px-3 flex items-center justify-between text-slate-400">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('console')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
              activeTab === 'console' ? 'bg-slate-800 text-blue-400 font-bold' : 'hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Console</span>
            <span className="text-[10px] px-1 rounded-full bg-slate-700 text-slate-300">{logs.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('elements')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
              activeTab === 'elements' ? 'bg-slate-800 text-blue-400 font-bold' : 'hover:text-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Elements</span>
          </button>

          <button
            onClick={() => setActiveTab('network')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
              activeTab === 'network' ? 'bg-slate-800 text-blue-400 font-bold' : 'hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Network</span>
            <span className="text-[10px] px-1 rounded-full bg-slate-700 text-slate-300">{requests.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('storage')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
              activeTab === 'storage' ? 'bg-slate-800 text-blue-400 font-bold' : 'hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Storage & Cookies</span>
          </button>

          <button
            onClick={() => setActiveTab('performance')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
              activeTab === 'performance' ? 'bg-slate-800 text-blue-400 font-bold' : 'hover:text-slate-200'
            }`}
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>Performance</span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="p-1 hover:text-white rounded hover:bg-slate-800"
          title="Close DevTools"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* DevTools Body Content */}
      <div className="flex-1 overflow-auto p-2">
        {/* TAB: CONSOLE */}
        {activeTab === 'console' && (
          <div className="h-full flex flex-col justify-between">
            <div className="flex-1 overflow-y-auto space-y-1 select-text">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className={`flex items-start gap-2 py-0.5 px-1 rounded font-mono text-[11px] ${
                    log.type === 'error'
                      ? 'bg-rose-950/40 text-rose-300 border-l-2 border-rose-500'
                      : log.type === 'warn'
                      ? 'bg-amber-950/40 text-amber-300 border-l-2 border-amber-500'
                      : log.type === 'info'
                      ? 'text-blue-300'
                      : 'text-slate-300'
                  }`}
                >
                  <span className="text-slate-500 text-[10px]">{log.timestamp}</span>
                  {log.type === 'error' && <AlertCircle className="w-3 h-3 text-rose-400 mt-0.5 flex-shrink-0" />}
                  {log.type === 'warn' && <AlertTriangle className="w-3 h-3 text-amber-400 mt-0.5 flex-shrink-0" />}
                  <span className="flex-1 whitespace-pre-wrap">{log.message}</span>
                  {log.source && <span className="text-slate-600 text-[10px]">{log.source}</span>}
                </div>
              ))}
            </div>

            {/* Console Input Bar */}
            <form onSubmit={handleConsoleSubmit} className="mt-2 flex items-center gap-2 border-t border-slate-800 pt-2">
              <span className="text-blue-400 font-bold">&gt;</span>
              <input
                type="text"
                value={consoleInput}
                onChange={(e) => setConsoleInput(e.target.value)}
                placeholder="Execute JavaScript in current tab sandbox (e.g. 5 * 1024, document.title)..."
                className="flex-1 bg-transparent border-none outline-none text-slate-100 placeholder-slate-600 text-[11px] font-mono"
              />
              <button
                type="button"
                onClick={() => setLogs([])}
                className="text-slate-500 hover:text-slate-300 p-1"
                title="Clear Console"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </form>
          </div>
        )}

        {/* TAB: ELEMENTS / DOM */}
        {activeTab === 'elements' && (
          <div className="h-full grid grid-cols-2 gap-4">
            {/* DOM Tree */}
            <div className="border border-slate-800 rounded p-2 overflow-y-auto space-y-1 font-mono text-[11px] text-slate-300">
              <div className="text-slate-500">&lt;!DOCTYPE html&gt;</div>
              <div className="pl-2 text-blue-400">&lt;<span className="text-rose-400">html</span> lang="en"&gt;</div>
              <div className="pl-4 text-blue-400">&lt;<span className="text-rose-400">head</span>&gt; ... &lt;/<span className="text-rose-400">head</span>&gt;</div>
              <div className="pl-4 text-blue-400">&lt;<span className="text-rose-400">body</span> class="aether-viewport"&gt;</div>
              <div className="pl-6 text-blue-400">&lt;<span className="text-rose-400">header</span> class="browser-nav"&gt; ... &lt;/<span className="text-rose-400">header</span>&gt;</div>
              <div
                onClick={() => setSelectedElement('article.post-content')}
                className={`pl-6 cursor-pointer rounded px-1 ${selectedElement === 'article.post-content' ? 'bg-blue-900/40 text-blue-200 ring-1 ring-blue-500' : 'hover:bg-slate-900'}`}
              >
                &lt;<span className="text-rose-400">main</span> class="post-content"&gt;
              </div>
              <div className="pl-8 text-slate-400">&lt;<span className="text-rose-400">h1</span>&gt;{activeUrl}&lt;/<span className="text-rose-400">h1</span>&gt;</div>
              <div className="pl-8 text-slate-400">&lt;<span className="text-rose-400">p</span>&gt;Reactive V8 sandbox render active.&lt;/<span className="text-rose-400">p</span>&gt;</div>
              <div className="pl-6 text-blue-400">&lt;/<span className="text-rose-400">main</span>&gt;</div>
              <div className="pl-4 text-blue-400">&lt;/<span className="text-rose-400">body</span>&gt;</div>
              <div className="pl-2 text-blue-400">&lt;/<span className="text-rose-400">html</span>&gt;</div>
            </div>

            {/* Live Styles Inspector */}
            <div className="border border-slate-800 rounded p-2 overflow-y-auto space-y-2">
              <div className="text-[11px] font-bold text-slate-400 border-b border-slate-800 pb-1 flex justify-between">
                <span>Styles: {selectedElement}</span>
                <span className="text-[10px] text-blue-400">element.style</span>
              </div>
              <div className="space-y-1 font-mono text-[11px]">
                {Object.entries(customStyles).map(([prop, val]) => (
                  <div key={prop} className="flex items-center gap-2">
                    <span className="text-blue-400">{prop}:</span>
                    <input
                      type="text"
                      value={val}
                      onChange={(e) => {
                        const nextVal = e.target.value;
                        setCustomStyles(prev => ({ ...prev, [prop]: nextVal }));
                      }}
                      className="bg-slate-900 px-1 rounded border border-slate-700 text-slate-200 outline-none flex-1 text-[10px]"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: NETWORK */}
        {activeTab === 'network' && (
          <div className="h-full overflow-y-auto">
            <table className="w-full text-left text-[11px] border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500">
                  <th className="py-1">Name</th>
                  <th>Status</th>
                  <th>Type</th>
                  <th>Method</th>
                  <th>Size</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.id} className="border-b border-slate-900 hover:bg-slate-900/50">
                    <td className="py-1 text-blue-400 truncate max-w-xs">{req.url}</td>
                    <td>
                      {req.status === 200 ? (
                        <span className="text-emerald-400 font-bold">200 OK</span>
                      ) : req.status === 304 ? (
                        <span className="text-blue-400">304 Cached</span>
                      ) : (
                        <span className="text-rose-400 font-bold">Blocked</span>
                      )}
                    </td>
                    <td className="text-slate-400 uppercase text-[10px]">{req.type}</td>
                    <td className="text-slate-300">{req.method}</td>
                    <td className="text-slate-300 font-mono">{req.size}</td>
                    <td className="text-slate-400 font-mono">{req.timeMs}ms</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB: STORAGE */}
        {activeTab === 'storage' && (
          <div className="h-full flex flex-col justify-between">
            <div className="overflow-y-auto space-y-1">
              <div className="text-[11px] text-slate-400 font-bold mb-1">Local Storage Key/Value Pairs:</div>
              {storageItems.map((item) => (
                <div key={item.key} className="flex items-center justify-between p-1.5 rounded bg-slate-900 border border-slate-800 text-[11px]">
                  <span className="text-blue-400 font-semibold">{item.key}</span>
                  <span className="text-slate-300 font-mono truncate max-w-md">{item.value}</span>
                  <button
                    onClick={() => handleDeleteStorageItem(item.key)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Key */}
            <div className="flex items-center gap-2 border-t border-slate-800 pt-2">
              <input
                type="text"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                placeholder="New key name..."
                className="bg-slate-900 border border-slate-700 px-2 py-1 rounded text-slate-200 text-xs flex-1 outline-none"
              />
              <input
                type="text"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="Value..."
                className="bg-slate-900 border border-slate-700 px-2 py-1 rounded text-slate-200 text-xs flex-1 outline-none"
              />
              <button
                onClick={handleAddStorageItem}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold"
              >
                Add Key
              </button>
            </div>
          </div>
        )}

        {/* TAB: PERFORMANCE */}
        {activeTab === 'performance' && (
          <div className="grid grid-cols-3 gap-4 h-full p-2">
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex flex-col justify-between">
              <span className="text-slate-400 font-bold">FRAME RATE</span>
              <div className="text-2xl font-bold text-emerald-400">60.0 FPS</div>
              <span className="text-[10px] text-slate-500">Zero jank detected in compositing layer</span>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex flex-col justify-between">
              <span className="text-slate-400 font-bold">JS HEAP USAGE</span>
              <div className="text-2xl font-bold text-blue-400">38.4 MB</div>
              <span className="text-[10px] text-slate-500">Allocated out of 512 MB sandbox limit</span>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex flex-col justify-between">
              <span className="text-slate-400 font-bold">DOM ELEMENT COUNT</span>
              <div className="text-2xl font-bold text-purple-400">412 Nodes</div>
              <span className="text-[10px] text-slate-500">Within optimal performance budget (&lt;1500)</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
