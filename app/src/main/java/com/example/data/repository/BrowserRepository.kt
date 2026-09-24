package com.example.data.repository

import com.example.data.local.dao.BrowserDao
import com.example.data.local.model.BookmarkItem
import com.example.data.local.model.DownloadItem
import com.example.data.local.model.HistoryItem
import com.example.data.local.model.ReadingListItem
import kotlinx.coroutines.flow.Flow

class BrowserRepository(private val dao: BrowserDao) {

    val allHistory: Flow<List<HistoryItem>> = dao.getAllHistory()
    val allBookmarks: Flow<List<BookmarkItem>> = dao.getAllBookmarks()
    val allReadingList: Flow<List<ReadingListItem>> = dao.getAllReadingList()
    val allDownloads: Flow<List<DownloadItem>> = dao.getAllDownloads()

    suspend fun recordHistory(url: String, title: String, faviconUrl: String? = null) {
        if (url.isBlank() || url.startsWith("about:") || url.startsWith("data:")) return
        dao.insertHistory(
            HistoryItem(
                url = url,
                title = title.ifBlank { url },
                visitTime = System.currentTimeMillis(),
                faviconUrl = faviconUrl
            )
        )
    }

    suspend fun deleteHistory(id: Long) = dao.deleteHistoryById(id)
    suspend fun clearHistory() = dao.clearAllHistory()

    suspend fun addBookmark(url: String, title: String, folder: String = "Mobile Bookmarks") {
        dao.insertBookmark(
            BookmarkItem(
                url = url,
                title = title.ifBlank { url },
                folder = folder,
                dateAdded = System.currentTimeMillis()
            )
        )
    }

    suspend fun removeBookmark(id: Long) = dao.deleteBookmarkById(id)
    suspend fun removeBookmarkByUrl(url: String) = dao.deleteBookmarkByUrl(url)
    suspend fun isBookmarked(url: String): Boolean = dao.isBookmarked(url)

    suspend fun addReadingListItem(url: String, title: String, snippet: String = "") {
        dao.insertReadingList(
            ReadingListItem(
                url = url,
                title = title.ifBlank { url },
                contentSnippet = snippet,
                isRead = false,
                savedAt = System.currentTimeMillis()
            )
        )
    }

    suspend fun toggleReadingListItemRead(item: ReadingListItem) {
        dao.updateReadingList(item.copy(isRead = !item.isRead))
    }

    suspend fun removeReadingListItem(id: Long) = dao.deleteReadingListById(id)

    suspend fun addDownload(fileName: String, url: String, sizeBytes: Long, mimeType: String) {
        dao.insertDownload(
            DownloadItem(
                fileName = fileName,
                url = url,
                fileSizeBytes = sizeBytes,
                mimeType = mimeType,
                status = "Completed",
                progressPercent = 100,
                timestamp = System.currentTimeMillis()
            )
        )
    }

    suspend fun removeDownload(id: Long) = dao.deleteDownloadById(id)
}
