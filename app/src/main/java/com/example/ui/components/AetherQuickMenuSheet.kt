package com.example.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Bookmark
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Code
import androidx.compose.material.icons.filled.DesktopWindows
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.MenuBook
import androidx.compose.material.icons.filled.PhoneAndroid
import androidx.compose.material.icons.filled.Security
import androidx.compose.material.icons.filled.Tablet
import androidx.compose.material.icons.filled.Tv
import androidx.compose.material.icons.filled.VerticalSplit
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.DeviceLayoutMode
import com.example.ui.theme.ElectricViolet
import com.example.ui.theme.EmeraldMint
import com.example.ui.theme.NeonCyan
import com.example.ui.theme.ObsidianBackground
import com.example.ui.theme.ObsidianBorder
import com.example.ui.theme.ObsidianSurfaceElevated
import com.example.ui.theme.SunsetAmber
import com.example.viewmodel.BrowserViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AetherQuickMenuSheet(
    viewModel: BrowserViewModel,
    onDismiss: () -> Unit
) {
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    val activeTab = viewModel.getActiveTab()
    val deviceMode by viewModel.deviceLayoutMode.collectAsState()
    val scrollState = rememberScrollState()

    ModalBottomSheet(
        onDismissRequest = onDismiss,
        sheetState = sheetState,
        containerColor = ObsidianBackground,
        dragHandle = null
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .verticalScroll(scrollState)
                .padding(20.dp)
        ) {
            // Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "AETHER CONTROL CENTER",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = NeonCyan,
                    letterSpacing = 1.5.sp
                )

                IconButton(
                    onClick = onDismiss,
                    modifier = Modifier.testTag("quick_menu_close_button")
                ) {
                    Icon(
                        imageVector = Icons.Default.Close,
                        contentDescription = "Close",
                        tint = MaterialTheme.colorScheme.onSurface
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Device Layout Mode Selector
            Text(
                text = "DEVICE LAYOUT ENGINE",
                fontSize = 10.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                letterSpacing = 1.sp
            )

            Spacer(modifier = Modifier.height(8.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                DeviceModeItem(
                    label = "Mobile",
                    icon = Icons.Default.PhoneAndroid,
                    isSelected = deviceMode == DeviceLayoutMode.MOBILE,
                    modifier = Modifier.weight(1f),
                    onClick = { viewModel.setDeviceLayoutMode(DeviceLayoutMode.MOBILE) }
                )
                DeviceModeItem(
                    label = "Tablet",
                    icon = Icons.Default.Tablet,
                    isSelected = deviceMode == DeviceLayoutMode.TABLET,
                    modifier = Modifier.weight(1f),
                    onClick = { viewModel.setDeviceLayoutMode(DeviceLayoutMode.TABLET) }
                )
                DeviceModeItem(
                    label = "Desktop",
                    icon = Icons.Default.DesktopWindows,
                    isSelected = deviceMode == DeviceLayoutMode.DESKTOP,
                    modifier = Modifier.weight(1f),
                    onClick = { viewModel.setDeviceLayoutMode(DeviceLayoutMode.DESKTOP) }
                )
                DeviceModeItem(
                    label = "TV UI",
                    icon = Icons.Default.Tv,
                    isSelected = deviceMode == DeviceLayoutMode.TV,
                    modifier = Modifier.weight(1f),
                    onClick = { viewModel.setDeviceLayoutMode(DeviceLayoutMode.TV) }
                )
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Browser Quick Actions Grid
            Text(
                text = "INTERNET OS TOOLS",
                fontSize = 10.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                letterSpacing = 1.sp
            )

            Spacer(modifier = Modifier.height(8.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                QuickActionItem(
                    icon = Icons.Default.AutoAwesome,
                    title = "AI Co-Pilot",
                    accent = NeonCyan,
                    modifier = Modifier.weight(1f),
                    onClick = {
                        onDismiss()
                        viewModel.setAiSheetOpen(true)
                    }
                )
                QuickActionItem(
                    icon = Icons.Default.Code,
                    title = "DevTools",
                    accent = ElectricViolet,
                    modifier = Modifier.weight(1f),
                    onClick = {
                        onDismiss()
                        viewModel.setDevToolsOpen(true)
                    }
                )
                QuickActionItem(
                    icon = Icons.Default.VerticalSplit,
                    title = "Split View",
                    accent = EmeraldMint,
                    modifier = Modifier.weight(1f),
                    onClick = {
                        onDismiss()
                        viewModel.toggleSplitScreen()
                    }
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                QuickActionItem(
                    icon = Icons.Default.Security,
                    title = "Privacy Shield",
                    accent = EmeraldMint,
                    modifier = Modifier.weight(1f),
                    onClick = {
                        onDismiss()
                        viewModel.setShieldSheetOpen(true)
                    }
                )
                QuickActionItem(
                    icon = Icons.Default.MenuBook,
                    title = if (activeTab?.isReaderMode == true) "Exit Reader" else "Reader Mode",
                    accent = SunsetAmber,
                    modifier = Modifier.weight(1f),
                    onClick = {
                        onDismiss()
                        activeTab?.let { viewModel.toggleReaderMode(it.id) }
                    }
                )
                QuickActionItem(
                    icon = Icons.Default.DesktopWindows,
                    title = if (activeTab?.isDesktopMode == true) "Mobile UA" else "Desktop UA",
                    accent = NeonCyan,
                    modifier = Modifier.weight(1f),
                    onClick = {
                        onDismiss()
                        activeTab?.let { viewModel.toggleDesktopMode(it.id) }
                    }
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Navigation Hub items (Bookmarks, History, Reading List)
            Card(
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = ObsidianSurfaceElevated),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(12.dp)) {
                    MenuRow(
                        icon = Icons.Default.Bookmark,
                        title = "Bookmark This Page",
                        onClick = {
                            viewModel.bookmarkCurrentTab()
                            onDismiss()
                        }
                    )
                    MenuRow(
                        icon = Icons.Default.MenuBook,
                        title = "Save to Reading List",
                        onClick = {
                            viewModel.saveCurrentTabToReadingList()
                            onDismiss()
                        }
                    )
                    MenuRow(
                        icon = Icons.Default.History,
                        title = "Vault (History, Bookmarks, Downloads)",
                        onClick = {
                            onDismiss()
                            viewModel.setHistoryBookmarksOpen(true, 0)
                        }
                    )
                    MenuRow(
                        icon = Icons.Default.Security,
                        title = "Open Incognito Private Tab",
                        onClick = {
                            viewModel.createNewTab(isPrivate = true)
                            onDismiss()
                        }
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))
        }
    }
}

@Composable
private fun DeviceModeItem(
    label: String,
    icon: ImageVector,
    isSelected: Boolean,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(10.dp))
            .background(if (isSelected) NeonCyan.copy(alpha = 0.2f) else ObsidianSurfaceElevated)
            .border(1.dp, if (isSelected) NeonCyan else ObsidianBorder, RoundedCornerShape(10.dp))
            .clickable(onClick = onClick)
            .padding(vertical = 10.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Icon(
                imageVector = icon,
                contentDescription = label,
                tint = if (isSelected) NeonCyan else MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.size(18.dp)
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = label,
                fontSize = 10.sp,
                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                color = if (isSelected) NeonCyan else MaterialTheme.colorScheme.onSurface
            )
        }
    }
}

@Composable
private fun QuickActionItem(
    icon: ImageVector,
    title: String,
    accent: Color,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Card(
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = ObsidianSurfaceElevated),
        border = CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(ObsidianBorder)),
        modifier = modifier.clickable(onClick = onClick)
    ) {
        Column(
            modifier = Modifier.padding(10.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Icon(
                imageVector = icon,
                contentDescription = title,
                tint = accent,
                modifier = Modifier.size(20.dp)
            )
            Spacer(modifier = Modifier.height(6.dp))
            Text(
                text = title,
                fontSize = 11.sp,
                fontWeight = FontWeight.SemiBold,
                color = MaterialTheme.colorScheme.onSurface
            )
        }
    }
}

@Composable
private fun MenuRow(
    icon: ImageVector,
    title: String,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(8.dp))
            .clickable(onClick = onClick)
            .padding(vertical = 10.dp, horizontal = 6.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            tint = NeonCyan,
            modifier = Modifier.size(18.dp)
        )
        Spacer(modifier = Modifier.width(12.dp))
        Text(
            text = title,
            fontSize = 12.sp,
            color = MaterialTheme.colorScheme.onSurface
        )
    }
}
