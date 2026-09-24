import React from 'react';
import { Bookmark as BookmarkType } from '../types/browser';
import { Folder, Globe, Plus } from 'lucide-react';

interface BookmarksBarProps {
  bookmarks: BookmarkType[];
  onOpenBookmark: (url: string) => void;
  onAddBookmarkCurrent: () => void;
}

export const BookmarksBar: React.FC<BookmarksBarProps> = ({
  bookmarks,
  onOpenBookmark,
  onAddBookmarkCurrent,
}) => {
  return (
    <div className="h-7 bg-slate-950/90 border-b border-slate-800/60 px-3 flex items-center gap-2 overflow-x-auto select-none text-[11px] text-slate-300 no-scrollbar">
      {/* Pinned Bookmarks list */}
      <div className="flex items-center gap-1">
        {bookmarks.map((b) => (
          <button
            key={b.id}
            onClick={() => onOpenBookmark(b.url)}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-slate-800/80 hover:text-white transition-colors max-w-[140px] truncate"
            title={`${b.title}\n${b.url}`}
          >
            <span className="text-xs">{b.icon || '🔖'}</span>
            <span className="truncate">{b.title}</span>
          </button>
        ))}
      </div>

      <button
        onClick={onAddBookmarkCurrent}
        className="text-slate-500 hover:text-slate-300 p-0.5 rounded hover:bg-slate-800/50"
        title="Add current tab to Bookmarks"
      >
        <Plus className="w-3 h-3" />
      </button>
    </div>
  );
};
