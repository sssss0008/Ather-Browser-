package com.example.data.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.example.data.local.model.BookmarkItem
import com.example.data.local.model.DownloadItem
import com.example.data.local.model.HistoryItem
import com.example.data.local.model.ReadingListItem
import kotlinx.coroutines.flow.Flow

@Dao
interface BrowserDao {
    // --- History ---
    @Query("SELECT * FROM history_entries ORDER BY visitTime DESC LIMIT 200")
    fun getAllHistory(): Flow<List<HistoryItem>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertHistory(item: HistoryItem): Long

    @Query("DELETE FROM history_entries WHERE id = :id")
    suspend fun deleteHistoryById(id: Long)

    @Query("DELETE FROM history_entries")
    suspend fun clearAllHistory()

    // --- Bookmarks ---
    @Query("SELECT * FROM bookmark_entries ORDER BY isPinned DESC, dateAdded DESC")
    fun getAllBookmarks(): Flow<List<BookmarkItem>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertBookmark(item: BookmarkItem): Long

    @Query("DELETE FROM bookmark_entries WHERE id = :id")
    suspend fun deleteBookmarkById(id: Long)

    @Query("DELETE FROM bookmark_entries WHERE url = :url")
    suspend fun deleteBookmarkByUrl(url: String)

    @Query("SELECT EXISTS(SELECT 1 FROM bookmark_entries WHERE url = :url)")
    suspend fun isBookmarked(url: String): Boolean

    // --- Reading List ---
    @Query("SELECT * FROM reading_list_entries ORDER BY savedAt DESC")
    fun getAllReadingList(): Flow<List<ReadingListItem>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertReadingList(item: ReadingListItem): Long

    @Update
    suspend fun updateReadingList(item: ReadingListItem)

    @Query("DELETE FROM reading_list_entries WHERE id = :id")
    suspend fun deleteReadingListById(id: Long)

    // --- Downloads ---
    @Query("SELECT * FROM download_entries ORDER BY timestamp DESC")
    fun getAllDownloads(): Flow<List<DownloadItem>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertDownload(item: DownloadItem): Long

    @Query("DELETE FROM download_entries WHERE id = :id")
    suspend fun deleteDownloadById(id: Long)
}
