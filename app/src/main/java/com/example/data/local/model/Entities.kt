package com.example.data.local.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "history_entries")
data class HistoryItem(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val url: String,
    val title: String,
    val visitTime: Long = System.currentTimeMillis(),
    val faviconUrl: String? = null
)

@Entity(tableName = "bookmark_entries")
data class BookmarkItem(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val url: String,
    val title: String,
    val folder: String = "Mobile Bookmarks",
    val dateAdded: Long = System.currentTimeMillis(),
    val isPinned: Boolean = false
)

@Entity(tableName = "reading_list_entries")
data class ReadingListItem(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val url: String,
    val title: String,
    val contentSnippet: String = "",
    val isRead: Boolean = false,
    val savedAt: Long = System.currentTimeMillis()
)

@Entity(tableName = "download_entries")
data class DownloadItem(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val fileName: String,
    val url: String,
    val fileSizeBytes: Long = 0,
    val mimeType: String = "application/octet-stream",
    val status: String = "Completed", // "Pending", "Downloading", "Completed", "Failed"
    val progressPercent: Int = 100,
    val timestamp: Long = System.currentTimeMillis()
)
