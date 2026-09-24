import React, { useState, useRef, useEffect } from 'react';
import { Tab, AiChatMessage } from '../types/browser';
import { SAMPLE_PAGES } from '../data/samplePages';
import { askGeminiCoPilot } from '../services/geminiService';
import { 
  X, 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Copy, 
  Check, 
  RefreshCw, 
  Layers, 
  FileText, 
  Languages, 
  Table, 
  Code
} from 'lucide-react';

interface AiCopilotProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: Tab;
}

export const AiCopilot: React.FC<AiCopilotProps> = ({ isOpen, onClose, activeTab }) => {
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      text: `Hello! I'm **Aether Co-Pilot**. I'm connected to your active tab: **${activeTab.title || activeTab.url}**.\n\nAsk me anything about this article, or use one of the quick actions below to summarize or inspect.`,
      timestamp: Date.now()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const currentPage = SAMPLE_PAGES[activeTab.url] || {
    url: activeTab.url,
    title: activeTab.title,
    domain: 'active-page',
    favicon: '🌐',
    category: 'Web',
    trackersFound: [],
    markdownContent: `# ${activeTab.title}\nURL: ${activeTab.url}`
  };

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const sendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    const userMsg: AiChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: trimmed,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await askGeminiCoPilot({
        prompt: trimmed,
        currentPage
      });

      const assistantMsg: AiChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: response,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: `⚠️ Error communicating with Gemini Co-Pilot: ${err?.message || 'Network Timeout'}. Please check your connection or try again.`,
          timestamp: Date.now()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <aside className="w-80 sm:w-96 h-full bg-slate-900 border-l border-slate-800 flex flex-col z-30 shadow-2xl flex-shrink-0 text-xs">
      {/* Co-Pilot Header */}
      <div className="p-3 border-b border-slate-800 bg-slate-900/90 backdrop-blur flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="font-bold text-slate-100 flex items-center gap-1.5">
              <span>Aether Co-Pilot</span>
              <span className="text-[10px] font-mono px-1 rounded bg-blue-500/20 text-blue-300">Gemini</span>
            </div>
            <div className="text-[10px] text-slate-400 truncate max-w-[200px]">
              Context: {currentPage.title}
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
          title="Close Co-Pilot Drawer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Action Pills */}
      <div className="p-2 border-b border-slate-800/80 bg-slate-950/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <button
          onClick={() => sendMessage('Summarize this page into key bullet points.')}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition-colors flex-shrink-0"
        >
          <FileText className="w-3 h-3 text-blue-400" />
          <span>Summarize</span>
        </button>
        <button
          onClick={() => sendMessage('Explain the core technical concepts of this page like I am 5.')}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition-colors flex-shrink-0"
        >
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Explain</span>
        </button>
        <button
          onClick={() => sendMessage('Translate the main takeaways into French and Spanish.')}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition-colors flex-shrink-0"
        >
          <Languages className="w-3 h-3 text-emerald-400" />
          <span>Translate</span>
        </button>
        <button
          onClick={() => sendMessage('Extract all key facts or tabular data into a structured format.')}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition-colors flex-shrink-0"
        >
          <Table className="w-3 h-3 text-purple-400" />
          <span>Data Table</span>
        </button>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-1.5 mb-1 text-[10px] text-slate-500">
              {msg.sender === 'user' ? (
                <>
                  <span>You</span>
                  <User className="w-3 h-3 text-blue-400" />
                </>
              ) : (
                <>
                  <Bot className="w-3 h-3 text-indigo-400" />
                  <span>Aether Co-Pilot</span>
                </>
              )}
            </div>

            <div
              className={`p-3 rounded-2xl max-w-[90%] leading-relaxed select-text ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none shadow-md'
                  : 'bg-slate-800 text-slate-200 border border-slate-700/70 rounded-tl-none shadow-sm'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>

              {msg.sender === 'assistant' && (
                <div className="mt-2 pt-2 border-t border-slate-700/50 flex justify-end">
                  <button
                    onClick={() => handleCopy(msg.text, msg.id)}
                    className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 bg-slate-800/60 rounded-2xl w-2/3 border border-slate-700/50">
            <Sparkles className="w-4 h-4 text-blue-400 animate-spin" />
            <span className="text-xs text-slate-300">Synthesizing insights...</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(inputText);
        }}
        className="p-3 border-t border-slate-800 bg-slate-900 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask anything about this page or web topic..."
          className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-500 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white transition-all"
          title="Send Question"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </aside>
  );
};
