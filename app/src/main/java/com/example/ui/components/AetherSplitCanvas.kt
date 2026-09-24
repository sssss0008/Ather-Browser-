package com.example.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.SwapHoriz
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.BrowserTab
import com.example.ui.theme.ElectricViolet
import com.example.ui.theme.NeonCyan
import com.example.ui.theme.ObsidianBorder
import com.example.ui.theme.ObsidianSurface
import com.example.ui.theme.ObsidianSurfaceElevated
import com.example.viewmodel.BrowserViewModel

@Composable
fun AetherSplitCanvas(
    primaryTab: BrowserTab,
    splitTab: BrowserTab,
    viewModel: BrowserViewModel,
    isSideBySide: Boolean = true,
    modifier: Modifier = Modifier
) {
    if (isSideBySide) {
        Row(
            modifier = modifier.fillMaxSize(),
            horizontalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            // Left Pane (Primary)
            Box(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxHeight()
            ) {
                SplitPaneContainer(
                    tab = primaryTab,
                    badgeColor = NeonCyan,
                    badgeText = "PANE 1",
                    viewModel = viewModel,
                    onClose = { viewModel.closeSplitScreen() }
                )
            }

            // Right Pane (Split)
            Box(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxHeight()
            ) {
                SplitPaneContainer(
                    tab = splitTab,
                    badgeColor = ElectricViolet,
                    badgeText = "PANE 2",
                    viewModel = viewModel,
                    onClose = { viewModel.closeSplitScreen() }
                )
            }
        }
    } else {
        // Vertical stacked for smaller phone screens
        Column(
            modifier = modifier.fillMaxSize(),
            verticalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            Box(modifier = Modifier.weight(1f).fillMaxWidth()) {
                SplitPaneContainer(
                    tab = primaryTab,
                    badgeColor = NeonCyan,
                    badgeText = "PANE 1",
                    viewModel = viewModel,
                    onClose = { viewModel.closeSplitScreen() }
                )
            }
            Box(modifier = Modifier.weight(1f).fillMaxWidth()) {
                SplitPaneContainer(
                    tab = splitTab,
                    badgeColor = ElectricViolet,
                    badgeText = "PANE 2",
                    viewModel = viewModel,
                    onClose = { viewModel.closeSplitScreen() }
                )
            }
        }
    }
}

@Composable
private fun SplitPaneContainer(
    tab: BrowserTab,
    badgeColor: Color,
    badgeText: String,
    viewModel: BrowserViewModel,
    onClose: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .border(1.dp, badgeColor.copy(alpha = 0.5f))
    ) {
        // Mini Header
        Surface(
            color = ObsidianSurface,
            modifier = Modifier.fillMaxWidth()
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 8.dp, vertical = 4.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.weight(1f)
                ) {
                    Surface(
                        shape = RoundedCornerShape(4.dp),
                        color = badgeColor.copy(alpha = 0.2f)
                    ) {
                        Text(
                            text = badgeText,
                            fontSize = 8.sp,
                            fontWeight = FontWeight.Bold,
                            color = badgeColor,
                            modifier = Modifier.padding(horizontal = 4.dp, vertical = 2.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = tab.title.ifBlank { "Split Tab" },
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Medium,
                        color = MaterialTheme.colorScheme.onSurface,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }

                IconButton(
                    onClick = onClose,
                    modifier = Modifier.size(20.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Close,
                        contentDescription = "Close Split",
                        tint = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.size(12.dp)
                    )
                }
            }
        }

        // Web view
        Box(modifier = Modifier.fillMaxSize().weight(1f)) {
            if (tab.url == "aether://newtab") {
                AetherNewTabPage(viewModel = viewModel, onNavigate = { viewModel.loadUrl(it, tab.id) })
            } else {
                AetherWebView(tab = tab, viewModel = viewModel)
            }
        }
    }
}
