package com.example.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Bookmark
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Download
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.MenuBook
import androidx.compose.material.icons.filled.Public
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Tab
import androidx.compose.material3.TabRow
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.CrimsonAlert
import com.example.ui.theme.EmeraldMint
import com.example.ui.theme.NeonCyan
import com.example.ui.theme.ObsidianBackground
import com.example.ui.theme.ObsidianBorder
import com.example.ui.theme.ObsidianSurfaceElevated
import com.example.viewmodel.BrowserViewModel
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AetherHistoryBookmarksSheet(
    viewModel: BrowserViewModel,
    onDismiss: () -> Unit
) {
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    val selectedTab by viewModel.historyBookmarksTab.collectAsState()
    val history by viewModel.historyEntries.collectAsState()
    val bookmarks by viewModel.bookmarkEntries.collectAsState()
    val readingList by viewModel.readingListEntries.collectAsState()
    val downloads by viewModel.downloadEntries.collectAsState()

    val tabTitles = listOf("History", "Bookmarks", "Reading List", "Downloads")
    val dateFormat = SimpleDateFormat("MMM d, HH:mm", Locale.getDefault())

    ModalBottomSheet(
        onDismissRequest = onDismiss,
        sheetState = sheetState,
        containerColor = ObsidianBackground,
        dragHandle = null
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .fillMaxHeight(0.85f)
                .padding(16.dp)
        ) {
            // Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "AETHER VAULT & ARCHIVES",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = NeonCyan,
                    letterSpacing = 1.sp
                )

                IconButton(
                    onClick = onDismiss,
                    modifier = Modifier.testTag("vault_close_button")
                ) {
                    Icon(
                        imageVector = Icons.Default.Close,
                        contentDescription = "Close",
                        tint = MaterialTheme.colorScheme.onSurface
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Tabs
            TabRow(
                selectedTabIndex = selectedTab,
                containerColor = ObsidianSurfaceElevated,
                contentColor = NeonCyan,
                modifier = Modifier.clip(RoundedCornerShape(10.dp))
            ) {
                tabTitles.forEachIndexed { index, title ->
                    Tab(
                        selected = selectedTab == index,
                        onClick = { viewModel.setHistoryBookmarksTab(index) },
                        text = {
                            Text(
                                text = title,
                                fontSize = 11.sp,
                                fontWeight = if (selectedTab == index) FontWeight.Bold else FontWeight.Normal
                            )
                        }
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Tab Content
            when (selectedTab) {
                0 -> {
                    // History
                    Column(modifier = Modifier.fillMaxSize()) {
                        if (history.isNotEmpty()) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.End
                            ) {
                                Button(
                                    onClick = { viewModel.clearAllHistory() },
                                    colors = ButtonDefaults.buttonColors(containerColor = CrimsonAlert.copy(alpha = 0.2f), contentColor = CrimsonAlert),
                                    shape = RoundedCornerShape(8.dp),
                                    modifier = Modifier.testTag("clear_history_button")
                                ) {
                                    Text("Clear All History", fontSize = 10.sp)
                                }
                            }
                            Spacer(modifier = Modifier.height(6.dp))
                        }

                        LazyColumn(modifier = Modifier.fillMaxSize()) {
                            if (history.isEmpty()) {
                                item {
                                    Text(
                                        text = "No browsing history yet.",
                                        fontSize = 12.sp,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }
                            }
                            items(history, key = { it.id }) { item ->
                                VaultListItem(
                                    title = item.title,
                                    subtitle = "${item.url} • ${dateFormat.format(Date(item.visitTime))}",
                                    icon = Icons.Default.History,
                                    onClick = {
                                        viewModel.loadUrl(item.url)
                                        onDismiss()
                                    },
                                    onDelete = { viewModel.deleteHistoryEntry(item.id) }
                                )
                            }
                        }
                    }
                }
                1 -> {
                    // Bookmarks
                    LazyColumn(modifier = Modifier.fillMaxSize()) {
                        if (bookmarks.isEmpty()) {
                            item {
                                Text(
                                    text = "No saved bookmarks. Tap Bookmark on any page to save it.",
                                    fontSize = 12.sp,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                        }
                        items(bookmarks, key = { it.id }) { item ->
                            VaultListItem(
                                title = item.title,
                                subtitle = item.url,
                                icon = Icons.Default.Bookmark,
                                onClick = {
                                    viewModel.loadUrl(item.url)
                                    onDismiss()
                                },
                                onDelete = { viewModel.deleteBookmark(item.id) }
                            )
                        }
                    }
                }
                2 -> {
                    // Reading List
                    LazyColumn(modifier = Modifier.fillMaxSize()) {
                        if (readingList.isEmpty()) {
                            item {
                                Text(
                                    text = "Your reading list is empty. Save articles for offline distraction-free reading.",
                                    fontSize = 12.sp,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                        }
                        items(readingList, key = { it.id }) { item ->
                            VaultListItem(
                                title = item.title,
                                subtitle = if (item.contentSnippet.isNotBlank()) item.contentSnippet else item.url,
                                icon = Icons.Default.MenuBook,
                                badge = if (item.isRead) "READ" else "UNREAD",
                                onClick = {
                                    viewModel.loadUrl(item.url)
                                    viewModel.toggleReaderMode()
                                    onDismiss()
                                },
                                onDelete = { viewModel.deleteReadingItem(item.id) }
                            )
                        }
                    }
                }
                3 -> {
                    // Downloads
                    Column(modifier = Modifier.fillMaxSize()) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.End
                        ) {
                            Button(
                                onClick = {
                                    viewModel.addSimulatedDownload(
                                        fileName = "Aether_Whitepaper_v2.pdf",
                                        url = "https://aether.browser/whitepaper.pdf",
                                        sizeBytes = 2450000,
                                        mimeType = "application/pdf"
                                    )
                                },
                                colors = ButtonDefaults.buttonColors(containerColor = NeonCyan.copy(alpha = 0.2f), contentColor = NeonCyan),
                                shape = RoundedCornerShape(8.dp)
                            ) {
                                Text("+ Demo Download", fontSize = 10.sp)
                            }
                        }
                        Spacer(modifier = Modifier.height(6.dp))

                        LazyColumn(modifier = Modifier.fillMaxSize()) {
                            if (downloads.isEmpty()) {
                                item {
                                    Text(
                                        text = "No files downloaded yet.",
                                        fontSize = 12.sp,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }
                            }
                            items(downloads, key = { it.id }) { item ->
                                VaultListItem(
                                    title = item.fileName,
                                    subtitle = "${item.url} • ${(item.fileSizeBytes / 1024 / 1024).coerceAtLeast(1)} MB • ${item.status}",
                                    icon = Icons.Default.Download,
                                    badge = item.status,
                                    onClick = { },
                                    onDelete = { viewModel.deleteDownload(item.id) }
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun VaultListItem(
    title: String,
    subtitle: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    badge: String? = null,
    onClick: () -> Unit,
    onDelete: () -> Unit
) {
    Card(
        shape = RoundedCornerShape(10.dp),
        colors = CardDefaults.cardColors(containerColor = ObsidianSurfaceElevated),
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp)
            .clickable(onClick = onClick)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(10.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.weight(1f)
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = NeonCyan,
                    modifier = Modifier.size(18.dp)
                )
                Spacer(modifier = Modifier.width(10.dp))
                Column {
                    Text(
                        text = title,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurface,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                    Text(
                        text = subtitle,
                        fontSize = 10.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
            }

            if (badge != null) {
                Text(
                    text = badge,
                    fontSize = 9.sp,
                    fontWeight = FontWeight.Bold,
                    color = EmeraldMint,
                    modifier = Modifier.padding(horizontal = 6.dp)
                )
            }

            IconButton(
                onClick = onDelete,
                modifier = Modifier.size(24.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.Delete,
                    contentDescription = "Delete",
                    tint = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.size(14.dp)
                )
            }
        }
    }
}
