package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Code
import androidx.compose.material.icons.filled.Devices
import androidx.compose.material.icons.filled.Security
import androidx.compose.material.icons.filled.VerticalSplit
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.DeviceLayoutMode
import com.example.ui.components.AetherAiCopilotSheet
import com.example.ui.components.AetherBottomBar
import com.example.ui.components.AetherDesktopChrome
import com.example.ui.components.AetherDevToolsSheet
import com.example.ui.components.AetherHistoryBookmarksSheet
import com.example.ui.components.AetherNewTabPage
import com.example.ui.components.AetherOmnibox
import com.example.ui.components.AetherQrShareDialog
import com.example.ui.components.AetherQuickMenuSheet
import com.example.ui.components.AetherReaderModeView
import com.example.ui.components.AetherShieldSheet
import com.example.ui.components.AetherSplitCanvas
import com.example.ui.components.AetherTabGridDialog
import com.example.ui.components.AetherTabStrip
import com.example.ui.components.AetherTvLayout
import com.example.ui.components.AetherWebView
import com.example.ui.theme.EmeraldMint
import com.example.ui.theme.MyApplicationTheme
import com.example.ui.theme.NeonCyan
import com.example.ui.theme.ObsidianBackground
import com.example.ui.theme.ObsidianSurface
import com.example.viewmodel.BrowserViewModel

class MainActivity : ComponentActivity() {

    private val viewModel: BrowserViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            MyApplicationTheme(darkTheme = true) {
                AetherBrowserApp(viewModel = viewModel)
            }
        }
    }
}

@Composable
fun Greeting(name: String, modifier: Modifier = Modifier) {
    Text(
        text = "Hello $name!",
        modifier = modifier
    )
}

@Composable
fun AetherBrowserApp(viewModel: BrowserViewModel) {
    val activeTab = viewModel.getActiveTab()
    val splitTab = viewModel.getSplitTab()
    val deviceMode by viewModel.deviceLayoutMode.collectAsState()

    // Sheet states
    val isTabOverviewOpen by viewModel.isTabOverviewOpen.collectAsState()
    val isDevToolsOpen by viewModel.isDevToolsOpen.collectAsState()
    val isAiSheetOpen by viewModel.isAiSheetOpen.collectAsState()
    val isShieldSheetOpen by viewModel.isShieldSheetOpen.collectAsState()
    val isHistoryBookmarksOpen by viewModel.isHistoryBookmarksOpen.collectAsState()
    val isQuickSettingsOpen by viewModel.isQuickSettingsOpen.collectAsState()
    val isQrShareOpen by viewModel.isQrShareOpen.collectAsState()

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(ObsidianBackground)
    ) {
        when (deviceMode) {
            DeviceLayoutMode.TV -> {
                AetherTvLayout(viewModel = viewModel)
            }
            DeviceLayoutMode.DESKTOP -> {
                DesktopLayoutView(viewModel = viewModel)
            }
            DeviceLayoutMode.TABLET -> {
                TabletLayoutView(viewModel = viewModel)
            }
            DeviceLayoutMode.MOBILE -> {
                MobileLayoutView(viewModel = viewModel)
            }
        }

        // Global Overlay Dialogs & Sheets
        if (isTabOverviewOpen) {
            AetherTabGridDialog(
                viewModel = viewModel,
                onDismiss = { viewModel.setTabOverviewOpen(false) }
            )
        }

        if (isDevToolsOpen) {
            AetherDevToolsSheet(
                viewModel = viewModel,
                onDismiss = { viewModel.setDevToolsOpen(false) }
            )
        }

        if (isAiSheetOpen) {
            AetherAiCopilotSheet(
                viewModel = viewModel,
                onDismiss = { viewModel.setAiSheetOpen(false) }
            )
        }

        if (isShieldSheetOpen) {
            AetherShieldSheet(
                viewModel = viewModel,
                onDismiss = { viewModel.setShieldSheetOpen(false) }
            )
        }

        if (isHistoryBookmarksOpen) {
            AetherHistoryBookmarksSheet(
                viewModel = viewModel,
                onDismiss = { viewModel.setHistoryBookmarksOpen(false) }
            )
        }

        if (isQuickSettingsOpen) {
            AetherQuickMenuSheet(
                viewModel = viewModel,
                onDismiss = { viewModel.setQuickSettingsOpen(false) }
            )
        }

        if (isQrShareOpen) {
            AetherQrShareDialog(
                url = activeTab?.url ?: "https://aether.browser",
                onDismiss = { viewModel.setQrShareOpen(false) }
            )
        }
    }
}

@Composable
private fun MobileLayoutView(viewModel: BrowserViewModel) {
    val activeTab = viewModel.getActiveTab()
    val splitTab = viewModel.getSplitTab()

    Scaffold(
        topBar = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(ObsidianSurface)
                    .statusBarsPadding()
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 12.dp, vertical = 6.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(modifier = Modifier.weight(1f)) {
                        AetherOmnibox(tab = activeTab, viewModel = viewModel)
                    }

                    Spacer(modifier = Modifier.width(6.dp))

                    // Layout switcher
                    IconButton(
                        onClick = { viewModel.setQuickSettingsOpen(true) },
                        modifier = Modifier.size(34.dp).testTag("mobile_layout_mode_button")
                    ) {
                        Icon(
                            imageVector = Icons.Default.Devices,
                            contentDescription = "Device Layout Mode",
                            tint = NeonCyan,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                }

                // Progress Bar
                if (activeTab != null && activeTab.isLoading) {
                    LinearProgressIndicator(
                        progress = { activeTab.progress / 100f },
                        modifier = Modifier.fillMaxWidth().height(2.dp),
                        color = NeonCyan,
                        trackColor = ObsidianSurface
                    )
                }
            }
        },
        bottomBar = {
            AetherBottomBar(tab = activeTab, viewModel = viewModel)
        }
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            if (activeTab != null) {
                when {
                    splitTab != null -> {
                        AetherSplitCanvas(
                            primaryTab = activeTab,
                            splitTab = splitTab,
                            viewModel = viewModel,
                            isSideBySide = false
                        )
                    }
                    activeTab.isReaderMode -> {
                        AetherReaderModeView(tab = activeTab, viewModel = viewModel)
                    }
                    activeTab.url == "aether://newtab" -> {
                        AetherNewTabPage(viewModel = viewModel, onNavigate = { viewModel.loadUrl(it) })
                    }
                    else -> {
                        AetherWebView(tab = activeTab, viewModel = viewModel)
                    }
                }
            }
        }
    }
}

@Composable
private fun TabletLayoutView(viewModel: BrowserViewModel) {
    val activeTab = viewModel.getActiveTab()
    val splitTab = viewModel.getSplitTab()

    Scaffold(
        topBar = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(ObsidianSurface)
                    .statusBarsPadding()
            ) {
                // Top Tab Strip
                AetherTabStrip(viewModel = viewModel)

                // Toolbar with Omnibox & Power Icons
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 12.dp, vertical = 6.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(modifier = Modifier.weight(1f)) {
                        AetherOmnibox(tab = activeTab, viewModel = viewModel)
                    }

                    Spacer(modifier = Modifier.width(8.dp))

                    IconButton(
                        onClick = { viewModel.setDevToolsOpen(true) },
                        modifier = Modifier.size(32.dp).testTag("tablet_devtools_button")
                    ) {
                        Icon(imageVector = Icons.Default.Code, contentDescription = "DevTools", tint = MaterialTheme.colorScheme.onSurface, modifier = Modifier.size(18.dp))
                    }

                    IconButton(
                        onClick = { viewModel.setAiSheetOpen(true) },
                        modifier = Modifier.size(32.dp).testTag("tablet_ai_button")
                    ) {
                        Icon(imageVector = Icons.Default.AutoAwesome, contentDescription = "AI Co-Pilot", tint = NeonCyan, modifier = Modifier.size(18.dp))
                    }

                    IconButton(
                        onClick = { viewModel.setQuickSettingsOpen(true) },
                        modifier = Modifier.size(32.dp).testTag("tablet_device_mode_button")
                    ) {
                        Icon(imageVector = Icons.Default.Devices, contentDescription = "Device Mode", tint = MaterialTheme.colorScheme.onSurface, modifier = Modifier.size(18.dp))
                    }
                }

                if (activeTab != null && activeTab.isLoading) {
                    LinearProgressIndicator(
                        progress = { activeTab.progress / 100f },
                        modifier = Modifier.fillMaxWidth().height(2.dp),
                        color = NeonCyan,
                        trackColor = ObsidianSurface
                    )
                }
            }
        },
        bottomBar = {
            AetherBottomBar(tab = activeTab, viewModel = viewModel)
        }
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            if (activeTab != null) {
                when {
                    splitTab != null -> {
                        AetherSplitCanvas(
                            primaryTab = activeTab,
                            splitTab = splitTab,
                            viewModel = viewModel,
                            isSideBySide = true
                        )
                    }
                    activeTab.isReaderMode -> {
                        AetherReaderModeView(tab = activeTab, viewModel = viewModel)
                    }
                    activeTab.url == "aether://newtab" -> {
                        AetherNewTabPage(viewModel = viewModel, onNavigate = { viewModel.loadUrl(it) })
                    }
                    else -> {
                        AetherWebView(tab = activeTab, viewModel = viewModel)
                    }
                }
            }
        }
    }
}

@Composable
private fun DesktopLayoutView(viewModel: BrowserViewModel) {
    val activeTab = viewModel.getActiveTab()
    val splitTab = viewModel.getSplitTab()

    Scaffold(
        topBar = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(ObsidianSurface)
                    .statusBarsPadding()
            ) {
                AetherDesktopChrome(tab = activeTab, viewModel = viewModel)

                if (activeTab != null && activeTab.isLoading) {
                    LinearProgressIndicator(
                        progress = { activeTab.progress / 100f },
                        modifier = Modifier.fillMaxWidth().height(2.dp),
                        color = NeonCyan,
                        trackColor = ObsidianSurface
                    )
                }
            }
        }
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            if (activeTab != null) {
                when {
                    splitTab != null -> {
                        AetherSplitCanvas(
                            primaryTab = activeTab,
                            splitTab = splitTab,
                            viewModel = viewModel,
                            isSideBySide = true
                        )
                    }
                    activeTab.isReaderMode -> {
                        AetherReaderModeView(tab = activeTab, viewModel = viewModel)
                    }
                    activeTab.url == "aether://newtab" -> {
                        AetherNewTabPage(viewModel = viewModel, onNavigate = { viewModel.loadUrl(it) })
                    }
                    else -> {
                        AetherWebView(tab = activeTab, viewModel = viewModel)
                    }
                }
            }
        }
    }
}
