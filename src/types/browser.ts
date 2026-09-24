export type DeviceMode = 'desktop' | 'tablet' | 'mobile-ios' | 'mobile-android' | 'responsive';
export type SplitMode = 'single' | 'split-vertical' | 'split-horizontal';
export type DevToolsTab = 'console' | 'elements' | 'network' | 'storage' | 'performance';

export interface Tab {
  id: string;
  workspaceId: string;
  title: string;
  url: string;
  favicon?: string;
  isLoading: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
  history: string[];
  historyIndex: number;
  isPinned: boolean;
  isMuted: boolean;
  isIncognito: boolean;
  isReaderMode: boolean;
  lastActiveTime: number;
  memoryUsageMb: number;
  securityStatus: 'secure' | 'warning' | 'insecure';
  deviceMode: DeviceMode;
  zoomLevel: number;
  scrollSync?: boolean;
}

export interface Workspace {
  id: string;
  name: string;
  icon: string;
  color: string;
  tabIds: string[];
  activeTabId: string;
}

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  icon?: string;
  folder?: string;
  createdAt: number;
}

export interface HistoryItem {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  visitedAt: number;
  workspaceName: string;
}

export interface DownloadItem {
  id: string;
  filename: string;
  fileSize: string;
  progress: number;
  status: 'downloading' | 'completed' | 'cancelled';
  url: string;
  timestamp: number;
}

export interface PrivacyStats {
  trackersBlockedTotal: number;
  adsBlockedTotal: number;
  fingerprintsDefended: number;
  httpsUpgrades: number;
  thirdPartyCookiesBlocked: boolean;
  fingerprintProtection: boolean;
  scriptShield: boolean;
  webrtcLeakShield: boolean;
  stealthMode: boolean;
}

export interface ConsoleLog {
  id: string;
  type: 'log' | 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
  source?: string;
}

export interface NetworkRequest {
  id: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS';
  status: number;
  type: 'fetch' | 'xhr' | 'script' | 'stylesheet' | 'image' | 'font';
  size: string;
  timeMs: number;
  timestamp: string;
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: number;
  codeSnippets?: { language: string; code: string }[];
  suggestedActions?: string[];
}

export interface ReaderSettings {
  fontSize: number; // in px, e.g. 18
  theme: 'paper' | 'sepia' | 'dark' | 'black';
  lineHeight: number; // 1.6, 1.8, 2.0
  fontFamily: 'serif' | 'sans' | 'mono';
}

export interface WebPageData {
  url: string;
  title: string;
  domain: string;
  favicon: string;
  author?: string;
  publishedDate?: string;
  readingTimeMinutes?: number;
  htmlContent?: string;
  markdownContent?: string;
  summary?: string;
  category: string;
  tags?: string[];
  trackersFound: string[];
}
