import React, { useState, useEffect } from 'react';
import { WebPageData, ReaderSettings } from '../types/browser';
import { Volume2, VolumeX, Type, Sun, Moon, Coffee, X } from 'lucide-react';

interface ReaderModeViewProps {
  pageData: WebPageData;
  onExitReaderMode: () => void;
}

export const ReaderModeView: React.FC<ReaderModeViewProps> = ({ pageData, onExitReaderMode }) => {
  const [settings, setSettings] = useState<ReaderSettings>({
    fontSize: 18,
    theme: 'sepia',
    lineHeight: 1.75,
    fontFamily: 'serif',
  });

  const [isSpeaking, setIsSpeaking] = useState(false);

  // Stop speech when component unmounts
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this device/browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const textToRead = `${pageData.title}. By ${pageData.author || 'Author'}. ${pageData.markdownContent || ''}`;
      const utterance = new SpeechSynthesisUtterance(textToRead.replace(/[#*`>_-]/g, ''));
      utterance.rate = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const themeClasses = {
    paper: 'bg-[#faf8f5] text-[#2c2c2c] border-[#e7e3dc]',
    sepia: 'bg-[#fbf0d9] text-[#433422] border-[#ebd6b1]',
    dark: 'bg-[#1e2430] text-[#cbd5e1] border-[#334155]',
    black: 'bg-[#000000] text-[#e2e8f0] border-[#1e293b]',
  };

  const fontClasses = {
    serif: 'font-serif',
    sans: 'font-sans',
    mono: 'font-mono',
  };

  return (
    <div className={`w-full h-full overflow-y-auto ${themeClasses[settings.theme]} transition-colors duration-300 relative select-text`}>
      {/* Floating Reader Controls Header */}
      <div className="sticky top-0 z-20 backdrop-blur-md bg-opacity-80 border-b px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onExitReaderMode}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border hover:opacity-80 transition-opacity"
          >
            <X className="w-3.5 h-3.5" />
            <span>Exit Reader</span>
          </button>
          <span className="text-xs opacity-70">
            {pageData.readingTimeMinutes || 4} min read • {pageData.domain}
          </span>
        </div>

        {/* Customization controls */}
        <div className="flex items-center gap-2">
          {/* Read Aloud */}
          <button
            onClick={toggleSpeech}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              isSpeaking ? 'bg-blue-600 text-white border-blue-600 animate-pulse' : 'hover:opacity-80'
            }`}
            title="Read Article Aloud (Text to Speech)"
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>{isSpeaking ? 'Pause Reading' : 'Listen'}</span>
          </button>

          {/* Font Size controls */}
          <div className="flex items-center border rounded-full px-2 py-0.5 text-xs">
            <button
              onClick={() => setSettings(s => ({ ...s, fontSize: Math.max(14, s.fontSize - 2) }))}
              className="px-1.5 hover:opacity-75 font-semibold"
              title="Decrease Font Size"
            >
              A-
            </button>
            <span className="px-1 font-mono text-[11px] opacity-70">{settings.fontSize}px</span>
            <button
              onClick={() => setSettings(s => ({ ...s, fontSize: Math.min(28, s.fontSize + 2) }))}
              className="px-1.5 hover:opacity-75 font-semibold"
              title="Increase Font Size"
            >
              A+
            </button>
          </div>

          {/* Font Family selector */}
          <button
            onClick={() => {
              const next: Record<string, 'serif' | 'sans' | 'mono'> = {
                serif: 'sans',
                sans: 'mono',
                mono: 'serif',
              };
              setSettings(s => ({ ...s, fontFamily: next[s.fontFamily] }));
            }}
            className="px-2.5 py-1 border rounded-full text-xs hover:opacity-80 capitalize"
            title="Toggle Typography"
          >
            {settings.fontFamily}
          </button>

          {/* Theme Palette */}
          <div className="flex items-center border rounded-full p-0.5 gap-1">
            <button
              onClick={() => setSettings(s => ({ ...s, theme: 'paper' }))}
              className={`w-5 h-5 rounded-full bg-[#faf8f5] border border-gray-300 ${settings.theme === 'paper' ? 'ring-2 ring-blue-500' : ''}`}
              title="Paper White"
            />
            <button
              onClick={() => setSettings(s => ({ ...s, theme: 'sepia' }))}
              className={`w-5 h-5 rounded-full bg-[#fbf0d9] border border-amber-300 ${settings.theme === 'sepia' ? 'ring-2 ring-blue-500' : ''}`}
              title="Warm Sepia"
            />
            <button
              onClick={() => setSettings(s => ({ ...s, theme: 'dark' }))}
              className={`w-5 h-5 rounded-full bg-[#1e2430] border border-slate-600 ${settings.theme === 'dark' ? 'ring-2 ring-blue-500' : ''}`}
              title="Slate Dark"
            />
            <button
              onClick={() => setSettings(s => ({ ...s, theme: 'black' }))}
              className={`w-5 h-5 rounded-full bg-[#000000] border border-slate-800 ${settings.theme === 'black' ? 'ring-2 ring-blue-500' : ''}`}
              title="OLED Pure Black"
            />
          </div>
        </div>
      </div>

      {/* Reader Article Body */}
      <article
        className={`max-w-3xl mx-auto px-8 py-12 ${fontClasses[settings.fontFamily]}`}
        style={{ fontSize: `${settings.fontSize}px`, lineHeight: settings.lineHeight }}
      >
        <header className="mb-10 pb-6 border-b border-current border-opacity-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            {pageData.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm opacity-75">
            {pageData.author && <span>By {pageData.author}</span>}
            {pageData.publishedDate && <span>• {pageData.publishedDate}</span>}
            <span className="px-2 py-0.5 rounded-full text-xs bg-current bg-opacity-10 font-mono">
              {pageData.category}
            </span>
          </div>
        </header>

        {/* Content body formatted */}
        <div className="space-y-6">
          {(pageData.markdownContent || '')
            .split('\n\n')
            .map((block, idx) => {
              const trimmed = block.trim();
              if (trimmed.startsWith('# ')) {
                return null; // already showed title
              }
              if (trimmed.startsWith('### ')) {
                return (
                  <h3 key={idx} className="text-xl font-bold mt-8 mb-2">
                    {trimmed.replace('### ', '')}
                  </h3>
                );
              }
              if (trimmed.startsWith('> ')) {
                return (
                  <blockquote
                    key={idx}
                    className="border-l-4 border-current border-opacity-40 pl-4 italic my-6 opacity-90"
                  >
                    {trimmed.replace('> ', '')}
                  </blockquote>
                );
              }
              if (trimmed.startsWith('```')) {
                const codeLines = trimmed.split('\n');
                const codeBody = codeLines.slice(1, -1).join('\n');
                return (
                  <pre
                    key={idx}
                    className="p-4 rounded-xl bg-black bg-opacity-20 font-mono text-sm overflow-x-auto my-4"
                  >
                    <code>{codeBody}</code>
                  </pre>
                );
              }
              return (
                <p key={idx} className="opacity-95 leading-relaxed">
                  {trimmed}
                </p>
              );
            })}
        </div>
      </article>
    </div>
  );
};
