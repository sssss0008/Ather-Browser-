package com.example.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Code
import androidx.compose.material.icons.filled.GridView
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Public
import androidx.compose.material.icons.filled.Security
import androidx.compose.material.icons.filled.VerticalSplit
import androidx.compose.material.icons.outlined.Bookmark
import androidx.compose.material.icons.outlined.Search
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.QuickDialSite
import com.example.data.model.WorkspaceType
import com.example.ui.theme.ElectricViolet
import com.example.ui.theme.EmeraldMint
import com.example.ui.theme.NeonCyan
import com.example.ui.theme.ObsidianBorder
import com.example.ui.theme.ObsidianSurface
import com.example.ui.theme.ObsidianSurfaceElevated
import com.example.ui.theme.SunsetAmber
import com.example.viewmodel.BrowserViewModel
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

private val POPULAR_SITES = listOf(
    QuickDialSite("Hacker News", "https://news.ycombinator.com", "Dev", 0xFFFF6600),
    QuickDialSite("GitHub", "https://github.com", "Dev", 0xFF6E5494),
    QuickDialSite("Wikipedia", "https://en.wikipedia.org", "Knowledge", 0xFF007788),
    QuickDialSite("Reddit", "https://reddit.com", "Social", 0xFFFF4500),
    QuickDialSite("MDN Docs", "https://developer.mozilla.org", "Dev", 0xFF2196F3),
    QuickDialSite("YouTube", "https://m.youtube.com", "Media", 0xFFFF0000),
    QuickDialSite("ArXiv AI", "https://arxiv.org", "Science", 0xFF00BFA5),
    QuickDialSite("DuckDuckGo", "https://duckduckgo.com", "Search", 0xFFDE5833)
)

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun AetherNewTabPage(
    viewModel: BrowserViewModel,
    onNavigate: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    val scrollState = rememberScrollState()
    val activeWorkspace by viewModel.activeWorkspace.collectAsState()
    val shieldStats by viewModel.shieldStats.collectAsState()
    val bookmarks by viewModel.bookmarkEntries.collectAsState()

    val timeFormat = SimpleDateFormat("HH:mm", Locale.getDefault())
    val dateFormat = SimpleDateFormat("EEEE, MMMM d", Locale.getDefault())
    val currentTime = timeFormat.format(Date())
    val currentDate = dateFormat.format(Date())

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(
                        MaterialTheme.colorScheme.background,
                        ObsidianSurface
                    )
                )
            )
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(scrollState)
                .padding(horizontal = 20.dp, vertical = 24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Futuristic Top HUD
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 8.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "AETHER WEB OS",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 2.sp,
                        color = NeonCyan
                    )
                    Text(
                        text = currentDate,
                        fontSize = 12.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }

                // Shield badge
                Surface(
                    shape = RoundedCornerShape(20.dp),
                    color = ObsidianSurfaceElevated,
                    border = CardDefaults.outlinedCardBorder().copy(brush = Brush.horizontalGradient(listOf(NeonCyan, EmeraldMint))),
                    modifier = Modifier
                        .clickable { viewModel.setShieldSheetOpen(true) }
                        .testTag("newtab_shield_status")
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Default.Security,
                            contentDescription = "Shield",
                            tint = EmeraldMint,
                            modifier = Modifier.size(14.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "${shieldStats.trackersBlocked + shieldStats.adsBlocked} Blocked",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = EmeraldMint
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Massive Digital Clock & Greeting
            Text(
                text = currentTime,
                fontSize = 52.sp,
                fontWeight = FontWeight.ExtraLight,
                color = MaterialTheme.colorScheme.onSurface,
                letterSpacing = (-1).sp
            )

            Text(
                text = "Next-Generation Internet Canvas",
                fontSize = 13.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                letterSpacing = 0.5.sp
            )

            Spacer(modifier = Modifier.height(20.dp))

            // Workspaces Chips
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.Center
            ) {
                WorkspaceType.values().forEach { ws ->
                    val isSelected = ws == activeWorkspace
                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = if (isSelected) NeonCyan.copy(alpha = 0.15f) else ObsidianSurfaceElevated,
                        border = if (isSelected) CardDefaults.outlinedCardBorder().copy(brush = Brush.horizontalGradient(listOf(NeonCyan, DeepIndigo))) else null,
                        modifier = Modifier
                            .padding(horizontal = 4.dp)
                            .clickable { viewModel.setWorkspace(ws) }
                            .testTag("workspace_${ws.name}")
                    ) {
                        Text(
                            text = ws.title.split(" ").first(),
                            fontSize = 11.sp,
                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                            color = if (isSelected) NeonCyan else MaterialTheme.colorScheme.onSurfaceVariant,
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Search Bar Trigger
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = ObsidianSurfaceElevated,
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, ObsidianBorder, RoundedCornerShape(16.dp))
                    .clickable { onNavigate("https://duckduckgo.com") }
                    .testTag("newtab_search_trigger")
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 16.dp, vertical = 14.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Outlined.Search,
                        contentDescription = "Search",
                        tint = NeonCyan,
                        modifier = Modifier.size(20.dp)
                    )
                    Spacer(modifier = Modifier.width(12.dp))
                    Text(
                        text = "Search web or enter address…",
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        fontSize = 14.sp
                    )
                }
            }

            Spacer(modifier = Modifier.height(28.dp))

            // Speed Dial Grid
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "SPEED DIAL",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.5.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Text(
                    text = "${POPULAR_SITES.size} Sites",
                    fontSize = 11.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            FlowRow(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalArrangement = Arrangement.spacedBy(14.dp),
                maxItemsInEachRow = 4
            ) {
                POPULAR_SITES.forEach { site ->
                    QuickDialItem(
                        site = site,
                        onClick = { onNavigate(site.url) }
                    )
                }
            }

            Spacer(modifier = Modifier.height(28.dp))

            // Power Hub Quick Actions
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.Start
            ) {
                Text(
                    text = "AETHER POWER TOOLS",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.5.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                PowerToolCard(
                    title = "AI Co-Pilot",
                    subtitle = "Page analysis",
                    icon = Icons.Default.AutoAwesome,
                    accentColor = NeonCyan,
                    modifier = Modifier.weight(1f),
                    onClick = { viewModel.setAiSheetOpen(true) }
                )
                PowerToolCard(
                    title = "DevTools",
                    subtitle = "JS & DOM",
                    icon = Icons.Default.Code,
                    accentColor = ElectricViolet,
                    modifier = Modifier.weight(1f),
                    onClick = { viewModel.setDevToolsOpen(true) }
                )
                PowerToolCard(
                    title = "Split Screen",
                    subtitle = "Dual tabs",
                    icon = Icons.Default.VerticalSplit,
                    accentColor = EmeraldMint,
                    modifier = Modifier.weight(1f),
                    onClick = { viewModel.toggleSplitScreen() }
                )
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Quick Hub for Bookmarks & History
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = ObsidianSurfaceElevated),
                border = CardDefaults.outlinedCardBorder().copy(brush = Brush.horizontalGradient(listOf(ObsidianBorder, ObsidianBorder))),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 12.dp),
                    horizontalArrangement = Arrangement.SpaceAround,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    HubButton(
                        icon = Icons.Outlined.Bookmark,
                        label = "Bookmarks",
                        count = bookmarks.size,
                        onClick = { viewModel.setHistoryBookmarksOpen(true, 1) }
                    )
                    HubButton(
                        icon = Icons.Default.History,
                        label = "History",
                        count = null,
                        onClick = { viewModel.setHistoryBookmarksOpen(true, 0) }
                    )
                    HubButton(
                        icon = Icons.Default.Security,
                        label = "Shield",
                        count = null,
                        onClick = { viewModel.setShieldSheetOpen(true) }
                    )
                }
            }

            Spacer(modifier = Modifier.height(36.dp))
        }
    }
}

@Composable
private fun QuickDialItem(
    site: QuickDialSite,
    onClick: () -> Unit
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier
            .width(72.dp)
            .clickable(onClick = onClick)
            .testTag("speed_dial_${site.title.lowercase().replace(" ", "_")}")
    ) {
        Box(
            modifier = Modifier
                .size(54.dp)
                .clip(RoundedCornerShape(16.dp))
                .background(ObsidianSurfaceElevated)
                .border(1.dp, ObsidianBorder, RoundedCornerShape(16.dp)),
            contentAlignment = Alignment.Center
        ) {
            Box(
                modifier = Modifier
                    .size(28.dp)
                    .clip(CircleShape)
                    .background(Color(site.accentHex).copy(alpha = 0.2f)),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = site.title.take(1).uppercase(),
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp,
                    color = Color(site.accentHex)
                )
            }
        }
        Spacer(modifier = Modifier.height(6.dp))
        Text(
            text = site.title,
            fontSize = 11.sp,
            color = MaterialTheme.colorScheme.onSurface,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis,
            textAlign = TextAlign.Center
        )
    }
}

@Composable
private fun PowerToolCard(
    title: String,
    subtitle: String,
    icon: ImageVector,
    accentColor: Color,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(containerColor = ObsidianSurfaceElevated),
        border = CardDefaults.outlinedCardBorder().copy(brush = Brush.linearGradient(listOf(accentColor.copy(alpha = 0.5f), ObsidianBorder))),
        modifier = modifier
            .clickable(onClick = onClick)
            .testTag("power_tool_${title.lowercase().replace(" ", "_")}")
    ) {
        Column(
            modifier = Modifier.padding(12.dp),
            horizontalAlignment = Alignment.Start
        ) {
            Icon(
                imageVector = icon,
                contentDescription = title,
                tint = accentColor,
                modifier = Modifier.size(20.dp)
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = title,
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurface
            )
            Text(
                text = subtitle,
                fontSize = 10.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

@Composable
private fun HubButton(
    icon: ImageVector,
    label: String,
    count: Int?,
    onClick: () -> Unit
) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier
            .clickable(onClick = onClick)
            .padding(8.dp)
    ) {
        Icon(
            imageVector = icon,
            contentDescription = label,
            tint = NeonCyan,
            modifier = Modifier.size(18.dp)
        )
        Spacer(modifier = Modifier.width(6.dp))
        Text(
            text = label,
            fontSize = 12.sp,
            fontWeight = FontWeight.Medium,
            color = MaterialTheme.colorScheme.onSurface
        )
        if (count != null && count > 0) {
            Spacer(modifier = Modifier.width(4.dp))
            Surface(
                shape = CircleShape,
                color = NeonCyan.copy(alpha = 0.2f)
            ) {
                Text(
                    text = count.toString(),
                    fontSize = 10.sp,
                    color = NeonCyan,
                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                )
            }
        }
    }
}
