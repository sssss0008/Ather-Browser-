package com.example.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import com.example.data.local.dao.BrowserDao
import com.example.data.local.model.BookmarkItem
import com.example.data.local.model.DownloadItem
import com.example.data.local.model.HistoryItem
import com.example.data.local.model.ReadingListItem

@Database(
    entities = [
        HistoryItem::class,
        BookmarkItem::class,
        ReadingListItem::class,
        DownloadItem::class
    ],
    version = 1,
    exportSchema = false
)
abstract class BrowserDatabase : RoomDatabase() {
    abstract fun browserDao(): BrowserDao

    companion object {
        @Volatile
        private var INSTANCE: BrowserDatabase? = null

        fun getInstance(context: Context): BrowserDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    BrowserDatabase::class.java,
                    "aether_browser.db"
                ).fallbackToDestructiveMigration().build()
                INSTANCE = instance
                instance
            }
        }
    }
}
