import React, { useState } from 'react';
import { Tab, DeviceMode, WebPageData } from '../types/browser';
import { SAMPLE_PAGES } from '../data/samplePages';
import { ReaderModeView } from './ReaderModeView';
import { 
  Sparkles, 
  Search, 
  ShieldCheck, 
  ExternalLink, 
  Terminal, 
  BookOpen, 
  Cpu, 
  HardDrive, 
  Wifi, 
  ThumbsUp, 
  MessageSquare, 
  Share2, 
  Bookmark, 
  Play, 
  Sliders, 
  Star, 
  GitFork, 
  Code,
  Check
} from 'lucide-react';

interface BrowserPaneProps {
  tab: Tab;
  onNavigate: (url: string) => void;
  onOpenAiDrawer: () => void;
  onToggleReaderMode: () => void;
  onAddDownload: (filename: string, size: string) => void;
  isActivePane: boolean;
}

export const BrowserPane: React.FC<BrowserPaneProps> = ({
  tab,
  onNavigate,
  onOpenAiDrawer,
  onToggleReaderMode,
  onAddDownload,
  isActivePane,
}) => {
  const [upvotes, setUpvotes] = useState<number>(342);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [starredRepos, setStarredRepos] = useState<Record<string, boolean>>({
    'aether-core': true,
  });

  // Interactive CSS Grid Playground state
  const [gridColumns, setGridColumns] = useState('repeat(auto-fit, minmax(200px, 1fr))');
  const [gridGap, setGridGap] = useState('1.5rem');
  const [gridCount, setGridCount] = useState(6);

  // Search state for Home / Search page
  const [searchQuery, setSearchQuery] = useState('');

  // Neural network interactive activation state
  const [activeNeuronLayer, setActiveNeuronLayer] = useState<number>(1);

  // Get matching page or create dynamic page
  let pageData: WebPageData = SAMPLE_PAGES[tab.url] || {
    url: tab.url,
    title: tab.url.startsWith('https://duckduckgo') ? `Search: ${new URL(tab.url).searchParams.get('q') || ''}` : tab.title || tab.url,
    domain: tab.url.startsWith('http') ? new URL(tab.url).hostname : 'local',
    favicon: '🌐',
    category: 'Web',
    trackersFound: ['AdTracker (Blocked)', 'Telemetry Agent (Blocked)'],
    summary: `Live web rendering for ${tab.url}`,
    markdownContent: `# Web Resource: ${tab.url}\n\nConnected securely through Aether sandbox.`
  };

  const handleUpvote = () => {
    if (hasUpvoted) {
      setUpvotes(u => u - 1);
      setHasUpvoted(false);
    } else {
      setUpvotes(u => u + 1);
      setHasUpvoted(true);
    }
  };

  const toggleStar = (repoKey: string) => {
    setStarredRepos(prev => ({ ...prev, [repoKey]: !prev[repoKey] }));
  };

  // If Reader Mode is enabled
  if (tab.isReaderMode) {
    return (
      <div className="w-full h-full">
        <ReaderModeView pageData={pageData} onExitReaderMode={onToggleReaderMode} />
      </div>
    );
  }

  // Device Frame Viewport Container
  const renderDeviceContainer = (children: React.ReactNode) => {
    const scale = tab.zoomLevel / 100;

    if (tab.deviceMode === 'mobile-ios') {
      return (
        <div className="w-full h-full bg-slate-950 flex items-center justify-center p-4 overflow-auto">
          <div 
            className="w-[390px] h-[844px] bg-slate-900 rounded-[50px] p-3 shadow-2xl border-4 border-slate-700 relative flex flex-col flex-shrink-0"
            style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
          >
            {/* Dynamic Island */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-30 flex items-center justify-end px-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            {/* Mobile Content */}
            <div className="w-full h-full bg-slate-900 rounded-[40px] overflow-y-auto pt-8 text-slate-100 select-text">
              {children}
            </div>
          </div>
        </div>
      );
    }

    if (tab.deviceMode === 'tablet') {
      return (
        <div className="w-full h-full bg-slate-950 flex items-center justify-center p-4 overflow-auto">
          <div 
            className="w-[768px] h-[1024px] bg-slate-900 rounded-[36px] p-4 shadow-2xl border-4 border-slate-700 relative flex flex-col flex-shrink-0"
            style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
          >
            {/* Tablet Camera dot */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-black rounded-full" />
            <div className="w-full h-full bg-slate-900 rounded-[24px] overflow-y-auto text-slate-100 select-text">
              {children}
            </div>
          </div>
        </div>
      );
    }

    // Default Desktop fluid
    return (
      <div 
        className="w-full h-full overflow-y-auto bg-slate-950 text-slate-100 select-text transition-transform"
        style={{ zoom: scale }}
      >
        {children}
      </div>
    );
  };

  // Render Start Page / Dashboard
  const renderHomePage = () => (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Hero Welcome */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AETHER BROWSER • SYSTEM READY</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-200 to-purple-300 mb-3 tracking-tight">
          Next-Gen Internet Operating Canvas
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Neural co-pilot integrated, real-time zero-trust tracker interception, multi-pane productivity, and local developer telemetry.
        </p>

        {/* Global Omnibox Search Bar */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (searchQuery.trim()) {
              onNavigate(`https://duckduckgo.com/?q=${encodeURIComponent(searchQuery)}`);
            }
          }}
          className="mt-8 max-w-2xl mx-auto relative"
        >
          <div className="flex items-center bg-slate-900/90 border border-slate-700/80 rounded-2xl px-4 py-3 shadow-xl focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/30 transition-all">
            <Search className="w-5 h-5 text-slate-400 mr-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search or enter URL (e.g. technews.today, wikipedia, github)..."
              className="bg-transparent border-none outline-none text-slate-100 placeholder-slate-500 text-sm w-full"
            />
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-all ml-2"
            >
              Explore
            </button>
          </div>
        </form>
      </div>

      {/* Quick Launchpad Grid */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Launchpad Hub</h2>
          <span className="text-xs text-blue-400 hover:underline cursor-pointer" onClick={() => onNavigate('https://github.com/trending')}>
            Explore Directory →
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div
            onClick={() => onNavigate('https://technews.today')}
            className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-850 cursor-pointer transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
              ⚡
            </div>
            <div className="text-sm font-semibold text-slate-200 group-hover:text-blue-400">TechNews Today</div>
            <div className="text-xs text-slate-400 mt-1">Silicon Photonics & Quantum computing reports</div>
          </div>

          <div
            onClick={() => onNavigate('https://en.wikipedia.org/wiki/Neural_network')}
            className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-850 cursor-pointer transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
              📖
            </div>
            <div className="text-sm font-semibold text-slate-200 group-hover:text-purple-400">Neural Network Wiki</div>
            <div className="text-xs text-slate-400 mt-1">Interactive architecture & backpropagation</div>
          </div>

          <div
            onClick={() => onNavigate('https://github.com/trending')}
            className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850 cursor-pointer transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
              🐙
            </div>
            <div className="text-sm font-semibold text-slate-200 group-hover:text-emerald-400">GitHub Trending</div>
            <div className="text-xs text-slate-400 mt-1">Today's top open source repositories</div>
          </div>

          <div
            onClick={() => onNavigate('https://devdocs.io/css-grid')}
            className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-850 cursor-pointer transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
              📐
            </div>
            <div className="text-sm font-semibold text-slate-200 group-hover:text-cyan-400">CSS Grid Lab</div>
            <div className="text-xs text-slate-400 mt-1">Interactive 2D layout playground</div>
          </div>
        </div>
      </div>

      {/* System Telemetry & AI Prompts Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Hardware Status */}
        <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-3">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-blue-400" />
              ENGINE STATUS
            </span>
            <span className="text-emerald-400 font-mono text-[10px]">HEALTHY 99.9%</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>WebGPU Pipeline</span>
              <span className="text-slate-200 font-mono">Vulkan 1.3 / Apple Metal</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Memory Footprint</span>
              <span className="text-slate-200 font-mono">{tab.memoryUsageMb} MB Active</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Privacy Shield</span>
              <span className="text-emerald-400 font-mono">Strict Active</span>
            </div>
          </div>
        </div>

        {/* Neural Co-Pilot Quick Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-950/40 to-indigo-950/40 border border-blue-800/40 md:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-300 mb-1.5">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>AETHER NEURAL CO-PILOT ASSISTANT</span>
            </div>
            <p className="text-xs text-slate-300">
              Have questions about any page you visit? Click Co-Pilot or press <kbd className="font-mono bg-slate-800 px-1 py-0.5 rounded text-[10px]">⌘K</kbd> to summarize, translate, or extract structured data tables instantly.
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={onOpenAiDrawer}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors"
            >
              Open AI Co-Pilot
            </button>
            <button
              onClick={() => onNavigate('https://technews.today')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
            >
              Read Latest Breakthroughs
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render TechNews Page
  const renderTechNews = () => (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header breadcrumb & actions */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="text-blue-400 font-semibold">TECHNEWS</span>
          <span>/</span>
          <span>HARDWARE</span>
          <span>/</span>
          <span>OPTICAL COMPUTING</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleReaderMode}
            className="flex items-center gap-1 text-xs text-slate-300 hover:text-white px-2.5 py-1 rounded bg-slate-800"
          >
            <BookOpen className="w-3 h-3 text-blue-400" />
            <span>Reader Mode</span>
          </button>
          <button
            onClick={() => onAddDownload('photonics_spec_sheet_v2.pdf', '4.8 MB')}
            className="flex items-center gap-1 text-xs text-slate-300 hover:text-white px-2.5 py-1 rounded bg-slate-800"
          >
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Article Title */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
        Silicon Photonics Breakthrough Accelerates Browser-Native AI
      </h1>

      {/* Meta */}
      <div className="flex items-center justify-between py-3 border-y border-slate-800/80 mb-6 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600/30 flex items-center justify-center font-bold text-blue-300">
            EV
          </div>
          <div>
            <div className="text-slate-200 font-medium">Elena Vance, Senior Tech Editor</div>
            <div>Published Sept 24, 2026 • 5 min read</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleUpvote}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              hasUpvoted ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>{upvotes}</span>
          </button>
          <button
            onClick={onOpenAiDrawer}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-blue-600/20 text-blue-300 hover:bg-blue-600/30"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask AI</span>
          </button>
        </div>
      </div>

      {/* Hero Illustration / Diagram Box */}
      <div className="my-6 p-6 rounded-2xl bg-gradient-to-r from-blue-950/50 via-slate-900 to-indigo-950/50 border border-blue-500/20 text-center">
        <div className="text-xs uppercase font-mono tracking-widest text-blue-400 mb-2">Diagram: Optical Waveguide Matrix</div>
        <div className="flex items-center justify-center gap-3 my-4">
          <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 text-xs">
            <span className="font-mono text-emerald-400">Input Laser (1550nm)</span>
          </div>
          <span className="text-blue-400 font-bold">──▶</span>
          <div className="p-3 bg-blue-900/60 rounded-xl border border-blue-500 text-xs">
            <span className="font-mono text-white font-bold">Interferometer Grid</span>
          </div>
          <span className="text-blue-400 font-bold">──▶</span>
          <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 text-xs">
            <span className="font-mono text-purple-400">Zero-Latency Tensors</span>
          </div>
        </div>
        <p className="text-xs text-slate-400">
          Photonic waveguides replace copper trace latency, eliminating high capacitance and heat generation during matrix multiplication.
        </p>
      </div>

      {/* Body text */}
      <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
        <p>
          Researchers at the International Nanotechnology Consortium unveiled a new class of optical coprocessors capable of executing transformer matrix operations at the speed of light with virtually zero thermal dissipation.
        </p>
        <blockquote className="border-l-4 border-blue-500 pl-4 py-1 italic text-slate-200 bg-blue-950/20 my-4">
          "We are moving away from copper bottlenecks into direct optical bus architectures. In the near future, browsers like Aether will execute frontier models locally in microseconds without cloud roundtrips."
        </blockquote>
        <h3 className="text-lg font-bold text-white mt-6 mb-2">Architectural Milestones</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Light-Speed Matrix Multipliers:</strong> 40 Terabits/sec waveguide bandwidth directly integrated with unified system RAM.</li>
          <li><strong>Sub-Milliwatt Idle State:</strong> Ultra-low thermal footprint suitable for lightweight AR glasses and mobile devices.</li>
          <li><strong>Open Optical Driver Layer:</strong> Standards consortium announces POSIX-compatible optical kernel drivers for Linux and Android.</li>
        </ul>
      </div>

      {/* Interactive Comments preview */}
      <div className="mt-10 pt-6 border-t border-slate-800">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-slate-400" />
          <span>Discussion (34 Comments)</span>
        </h3>
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="font-semibold text-slate-200">Sarah_Dev_22</span>
              <span>12 mins ago</span>
            </div>
            <p className="text-slate-300">
              This will completely revolutionize local WASM runtimes. If we can run a 70B parameter model in-browser at 120 tokens/sec, the privacy benefits are monumental.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Wikipedia Page
  const renderWikipedia = () => (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Article Header */}
      <div className="border-b border-slate-800 pb-3 mb-6 flex items-baseline justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white mb-1">Artificial neural network</h1>
          <p className="text-xs text-slate-400">From Wikipedia, the free encyclopedia</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onToggleReaderMode} className="text-xs bg-slate-800 px-2.5 py-1 rounded text-slate-300 hover:text-white">
            Clean View
          </button>
        </div>
      </div>

      {/* Info Card & Intro Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2 space-y-4 text-sm text-slate-300 leading-relaxed">
          <p>
            An <strong>artificial neural network</strong> (<strong>ANN</strong>), usually simply called a <strong>neural network</strong> (<strong>NN</strong>), is a computational model inspired by the biological neural networks that constitute animal brains.
          </p>
          <p>
            An ANN is based on a collection of connected units or nodes called artificial neurons. Each connection, like the synapses in a biological brain, can transmit a signal to other neurons. An artificial neuron receives signals then processes them and can signal neurons connected to it.
          </p>

          {/* Interactive Layer Stimulator Widget */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 my-4">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-semibold text-purple-400">Interactive Layer Activator</span>
              <span className="text-slate-400">Click a layer to stimulate synaptic weights</span>
            </div>
            <div className="flex items-center justify-around py-4 bg-slate-950/60 rounded-lg">
              {[1, 2, 3].map((layerNum) => (
                <button
                  key={layerNum}
                  onClick={() => setActiveNeuronLayer(layerNum)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                    activeNeuronLayer === layerNum
                      ? 'bg-purple-600/30 border-purple-500 text-purple-200 scale-105 shadow-lg shadow-purple-500/20'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <span className="text-xs font-mono font-bold">
                    {layerNum === 1 ? 'Input Layer' : layerNum === 2 ? 'Hidden Layer' : 'Output Layer'}
                  </span>
                  <div className="flex gap-1">
                    {[1, 2, 3].map(n => (
                      <span
                        key={n}
                        className={`w-3 h-3 rounded-full ${
                          activeNeuronLayer === layerNum ? 'bg-purple-400 animate-ping' : 'bg-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                </button>
              ))}
            </div>
            <div className="text-[11px] font-mono text-center text-slate-400 mt-2">
              Activation Function: ReLU [ f(x) = max(0, x) ] • Forward Gradient: +0.428
            </div>
          </div>
        </div>

        {/* Sidebar Info Card */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-3">
          <div className="text-center font-bold text-slate-200 border-b border-slate-800 pb-2">
            Neural Networks Overview
          </div>
          <div>
            <span className="text-slate-500 block">Subfield of:</span>
            <span className="text-slate-300 font-medium">Machine learning, Artificial intelligence</span>
          </div>
          <div>
            <span className="text-slate-500 block">First proposed by:</span>
            <span className="text-slate-300 font-medium">Warren McCulloch & Walter Pitts (1943)</span>
          </div>
          <div>
            <span className="text-slate-500 block">Common architectures:</span>
            <span className="text-slate-300 font-medium">Transformer, CNN, RNN, Diffusion, MLP</span>
          </div>
          <button
            onClick={() => onAddDownload('artificial_neural_network_full_paper.epub', '2.1 MB')}
            className="w-full py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-center font-medium mt-2 transition-colors"
          >
            Export Offline EPUB
          </button>
        </div>
      </div>
    </div>
  );

  // Render GitHub Trending Page
  const renderGitHub = () => (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl">
            🐙
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Trending Repositories</h1>
            <p className="text-xs text-slate-400">See what the GitHub open source community is most excited about today.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Language: <strong>All Languages</strong></span>
        </div>
      </div>

      {/* Repo items */}
      <div className="space-y-4">
        {[
          {
            key: 'aether-core',
            name: 'aether-engine / aether-browser-core',
            desc: 'Ultra high-performance headless browser engine with sandboxed isolates, optical compositing, and native WebGPU tensor acceleration.',
            lang: 'Rust',
            langColor: 'bg-orange-500',
            stars: '34,921',
            forks: '2,410'
          },
          {
            key: 'auto-canvas',
            name: 'deep-agents / auto-canvas',
            desc: 'Autonomous browser agent framework for multi-step web workflow execution, semantic DOM parsing, and resilient actions.',
            lang: 'TypeScript',
            langColor: 'bg-blue-500',
            stars: '19,842',
            forks: '1,120'
          },
          {
            key: 'zero-sqlite',
            name: 'hyper-wasm / zero-latency-sqlite',
            desc: 'Client-side reactive SQLite running in Web Workers with differential CRDT synchronization and sub-millisecond transactions.',
            lang: 'C / WASM',
            langColor: 'bg-purple-500',
            stars: '14,208',
            forks: '890'
          }
        ].map((repo) => {
          const isStarred = !!starredRepos[repo.key];
          return (
            <div key={repo.key} className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-blue-400 hover:underline cursor-pointer">
                    {repo.name}
                  </h2>
                  <p className="text-xs text-slate-300 mt-1 max-w-2xl">{repo.desc}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${repo.langColor}`} />
                      <span>{repo.lang}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400" />
                      <span>{repo.stars}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className="w-3 h-3" />
                      <span>{repo.forks}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => toggleStar(repo.key)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                      isStarred
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${isStarred ? 'fill-amber-400 text-amber-400' : ''}`} />
                    <span>{isStarred ? 'Starred' : 'Star'}</span>
                  </button>
                  <button
                    onClick={() => onAddDownload(`${repo.key}-main.zip`, '12.4 MB')}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                    title="Download Code Zip"
                  >
                    Code ▾
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Render CSS Grid DevDocs Playground
  const renderDevDocs = () => (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="border-b border-slate-800 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <span>CSS Grid Layout Specification & Sandbox</span>
          <span className="text-xs font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded">
            Interactive Lab
          </span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Adjust grid template columns, gap, and item counts to test responsive layout rules live.
        </p>
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 mb-6 flex flex-wrap items-center gap-4 text-xs">
        <div>
          <label className="text-slate-400 block mb-1 font-mono">grid-template-columns:</label>
          <select
            value={gridColumns}
            onChange={(e) => setGridColumns(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 rounded px-2.5 py-1 outline-none font-mono"
          >
            <option value="repeat(auto-fit, minmax(200px, 1fr))">repeat(auto-fit, minmax(200px, 1fr))</option>
            <option value="1fr 2fr 1fr">1fr 2fr 1fr (Sidebar + Center)</option>
            <option value="repeat(3, 1fr)">repeat(3, 1fr)</option>
            <option value="repeat(4, 1fr)">repeat(4, 1fr)</option>
            <option value="250px 1fr">250px 1fr (Fixed + Fluid)</option>
          </select>
        </div>

        <div>
          <label className="text-slate-400 block mb-1 font-mono">grid-gap:</label>
          <select
            value={gridGap}
            onChange={(e) => setGridGap(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 rounded px-2.5 py-1 outline-none font-mono"
          >
            <option value="0.5rem">0.5rem (8px)</option>
            <option value="1rem">1rem (16px)</option>
            <option value="1.5rem">1.5rem (24px)</option>
            <option value="2rem">2rem (32px)</option>
          </select>
        </div>

        <div>
          <label className="text-slate-400 block mb-1 font-mono">Items Count:</label>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setGridCount(c => Math.max(2, c - 1))}
              className="px-2 py-0.5 bg-slate-800 rounded hover:bg-slate-700 text-slate-200"
            >
              -
            </button>
            <span className="px-2 font-mono">{gridCount}</span>
            <button
              onClick={() => setGridCount(c => Math.min(12, c + 1))}
              className="px-2 py-0.5 bg-slate-800 rounded hover:bg-slate-700 text-slate-200"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Live Rendered Canvas */}
      <div
        className="p-6 rounded-2xl bg-slate-950 border-2 border-dashed border-slate-800 mb-6 transition-all"
        style={{
          display: 'grid',
          gridTemplateColumns: gridColumns,
          gap: gridGap,
        }}
      >
        {Array.from({ length: gridCount }).map((_, i) => (
          <div
            key={i}
            className="p-5 rounded-xl bg-gradient-to-br from-blue-900/40 via-indigo-900/30 to-slate-900 border border-blue-500/30 flex flex-col justify-between h-36 text-xs transition-all hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-blue-300 font-bold">Cell #{i + 1}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <p className="text-slate-400 text-[11px]">
              Computed track width automatically recalculates on parent resize.
            </p>
            <div className="font-mono text-[10px] text-slate-500">
              align-self: stretch
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render Generic Web Page / Search Engine View
  const renderGenericWeb = () => (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center">
        <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-2xl mx-auto mb-3">
          🌐
        </div>
        <h2 className="text-xl font-bold text-white mb-2">{pageData.title}</h2>
        <p className="text-xs font-mono text-slate-400 mb-4">{pageData.url}</p>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-mono mb-6">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Trackers & Ads Blocked ({pageData.trackersFound.length})</span>
        </div>

        <div className="max-w-xl mx-auto text-left p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
          <div className="font-semibold text-slate-200">Aether Sandbox Security Report:</div>
          <div className="text-slate-400">✓ Strict Content-Security-Policy (CSP) Active</div>
          <div className="text-slate-400">✓ DOM Node Isolates Encapsulated</div>
          <div className="text-slate-400">✓ Zero Telemetry Exfiltration Allowed</div>
        </div>

        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={onOpenAiDrawer}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Analyze Page with AI</span>
          </button>
          <button
            onClick={() => onNavigate('aether://home')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Back to Hub
          </button>
        </div>
      </div>
    </div>
  );

  // Router based on tab url
  let content;
  if (tab.url === 'aether://home') {
    content = renderHomePage();
  } else if (tab.url.includes('technews.today')) {
    content = renderTechNews();
  } else if (tab.url.includes('wikipedia.org')) {
    content = renderWikipedia();
  } else if (tab.url.includes('github.com')) {
    content = renderGitHub();
  } else if (tab.url.includes('devdocs.io')) {
    content = renderDevDocs();
  } else {
    content = renderGenericWeb();
  }

  return (
    <div className={`w-full h-full relative overflow-hidden flex flex-col ${isActivePane ? 'ring-1 ring-blue-500/20' : ''}`}>
      {renderDeviceContainer(content)}
    </div>
  );
};
