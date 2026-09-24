package com.example.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Code
import androidx.compose.material.icons.filled.Devices
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.MenuBook
import androidx.compose.material.icons.filled.QrCode
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Security
import androidx.compose.material.icons.filled.Share
import androidx.compose.material.icons.filled.VerticalSplit
import androidx.compose.material.icons.outlined.Search
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.BrowserTab
import com.example.data.model.SearchEngine
import com.example.ui.theme.ElectricViolet
import com.example.ui.theme.EmeraldMint
import com.example.ui.theme.NeonCyan
import com.example.ui.theme.ObsidianBorder
import com.example.ui.theme.ObsidianSurfaceElevated
import com.example.viewmodel.BrowserViewModel

@Composable
fun AetherOmnibox(
    tab: BrowserTab?,
    viewModel: BrowserViewModel,
    modifier: Modifier = Modifier
) {
    val searchEngine by viewModel.searchEngine.collectAsState()
    val shieldStats by viewModel.shieldStats.collectAsState()
    val focusManager = LocalFocusManager.current
    val focusRequester = remember { FocusRequester() }

    var textInput by remember { mutableStateOf(tab?.url ?: "") }
    var isFocused by remember { mutableStateOf(false) }

    LaunchedEffect(tab?.url) {
        if (!isFocused) {
            textInput = if (tab?.url == "aether://newtab") "" else (tab?.url ?: "")
        }
    }

    Column(modifier = modifier.fillMaxWidth()) {
        Surface(
            shape = RoundedCornerShape(14.dp),
            color = ObsidianSurfaceElevated,
            modifier = Modifier
                .fillMaxWidth()
                .border(
                    width = 1.dp,
                    brush = if (isFocused) Brush.horizontalGradient(listOf(NeonCyan, ElectricViolet))
                    else SolidColor(ObsidianBorder),
                    shape = RoundedCornerShape(14.dp)
                )
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 8.dp, vertical = 4.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Shield / Security Lock Pill
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .clip(RoundedCornerShape(8.dp))
                        .clickable { viewModel.setShieldSheetOpen(true) }
                        .padding(horizontal = 6.dp, vertical = 4.dp)
                        .testTag("omnibox_shield_icon")
                ) {
                    Icon(
                        imageVector = if (shieldStats.isHttpsSecure) Icons.Default.Lock else Icons.Default.Security,
                        contentDescription = "Shield",
                        tint = if (shieldStats.isShieldActive) EmeraldMint else NeonCyan,
                        modifier = Modifier.size(16.dp)
                    )
                    if (shieldStats.trackersBlocked > 0) {
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = "${shieldStats.trackersBlocked}",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = EmeraldMint
                        )
                    }
                }

                Spacer(modifier = Modifier.width(6.dp))

                // Input Field
                Box(
                    modifier = Modifier.weight(1f),
                    contentAlignment = Alignment.CenterStart
                ) {
                    if (textInput.isEmpty() && !isFocused) {
                        Text(
                            text = "Search with ${searchEngine.title} or enter URL…",
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            fontSize = 13.sp,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )
                    }

                    BasicTextField(
                        value = textInput,
                        onValueChange = { textInput = it },
                        singleLine = true,
                        cursorBrush = SolidColor(NeonCyan),
                        textStyle = TextStyle(
                            color = MaterialTheme.colorScheme.onSurface,
                            fontSize = 13.sp
                        ),
                        keyboardOptions = KeyboardOptions(
                            keyboardType = KeyboardType.Uri,
                            imeAction = ImeAction.Go
                        ),
                        keyboardActions = KeyboardActions(
                            onGo = {
                                if (textInput.isNotBlank()) {
                                    viewModel.loadUrl(textInput)
                                }
                                isFocused = false
                                focusManager.clearFocus()
                            }
                        ),
                        modifier = Modifier
                            .fillMaxWidth()
                            .focusRequester(focusRequester)
                            .onFocusChanged { focusState ->
                                isFocused = focusState.isFocused
                                if (focusState.isFocused && tab?.url != "aether://newtab") {
                                    textInput = tab?.url ?: ""
                                }
                            }
                            .testTag("omnibox_text_field")
                    )
                }

                // Action Icons on the right
                if (isFocused) {
                    if (textInput.isNotEmpty()) {
                        IconButton(
                            onClick = { textInput = "" },
                            modifier = Modifier.size(28.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.Close,
                                contentDescription = "Clear",
                                tint = MaterialTheme.colorScheme.onSurfaceVariant,
                                modifier = Modifier.size(16.dp)
                            )
                        }
                    }
                } else {
                    // Reader Mode Icon
                    if (tab != null && tab.url != "aether://newtab") {
                        IconButton(
                            onClick = { viewModel.toggleReaderMode(tab.id) },
                            modifier = Modifier.size(28.dp).testTag("omnibox_reader_mode_button")
                        ) {
                            Icon(
                                imageVector = Icons.Default.MenuBook,
                                contentDescription = "Reader Mode",
                                tint = if (tab.isReaderMode) NeonCyan else MaterialTheme.colorScheme.onSurfaceVariant,
                                modifier = Modifier.size(16.dp)
                            )
                        }

                        // Reload / Progress
                        if (tab.isLoading) {
                            CircularProgressIndicator(
                                modifier = Modifier.size(16.dp).padding(2.dp),
                                strokeWidth = 2.dp,
                                color = NeonCyan
                            )
                        } else {
                            IconButton(
                                onClick = { viewModel.reload(tab.id) },
                                modifier = Modifier.size(28.dp).testTag("omnibox_reload_button")
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Refresh,
                                    contentDescription = "Reload",
                                    tint = MaterialTheme.colorScheme.onSurfaceVariant,
                                    modifier = Modifier.size(16.dp)
                                )
                            }
                        }
                    }
                }
            }
        }

        // Suggestions Dropdown when focused
        AnimatedVisibility(
            visible = isFocused,
            enter = fadeIn(),
            exit = fadeOut()
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 8.dp)
                    .clip(RoundedCornerShape(14.dp))
                    .background(ObsidianSurfaceElevated)
                    .border(1.dp, ObsidianBorder, RoundedCornerShape(14.dp))
                    .padding(8.dp)
            ) {
                // Search Engine Switcher Chips
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "ENGINES",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        letterSpacing = 1.sp
                    )

                    Row {
                        SearchEngine.values().take(4).forEach { engine ->
                            val isSel = engine == searchEngine
                            Text(
                                text = engine.title.take(3),
                                fontSize = 10.sp,
                                fontWeight = if (isSel) FontWeight.Bold else FontWeight.Normal,
                                color = if (isSel) NeonCyan else MaterialTheme.colorScheme.onSurfaceVariant,
                                modifier = Modifier
                                    .padding(horizontal = 4.dp)
                                    .clip(RoundedCornerShape(6.dp))
                                    .background(if (isSel) NeonCyan.copy(alpha = 0.15f) else Color.Transparent)
                                    .clickable { viewModel.setSearchEngine(engine) }
                                    .padding(horizontal = 6.dp, vertical = 2.dp)
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(8.dp))

                // Quick Omnibox Shortcuts
                OmniboxShortcutRow(
                    icon = Icons.Outlined.Search,
                    title = "Search \"${textInput.ifBlank { "..." }}\" on ${searchEngine.title}",
                    onClick = {
                        viewModel.loadUrl(textInput.ifBlank { "https://google.com" })
                        isFocused = false
                        focusManager.clearFocus()
                    }
                )

                OmniboxShortcutRow(
                    icon = Icons.Default.AutoAwesome,
                    title = "Ask AI Co-Pilot: \"${textInput.ifBlank { "Summarize this page" }}\"",
                    onClick = {
                        viewModel.setAiSheetOpen(true)
                        if (textInput.isNotBlank()) {
                            viewModel.askAi(textInput)
                        }
                        isFocused = false
                        focusManager.clearFocus()
                    }
                )

                OmniboxShortcutRow(
                    icon = Icons.Default.Code,
                    title = "Run script in Console: \"${textInput.ifBlank { "document.title" }}\"",
                    onClick = {
                        viewModel.setDevToolsOpen(true)
                        if (textInput.isNotBlank()) {
                            viewModel.executeJsInActiveTab(textInput)
                        }
                        isFocused = false
                        focusManager.clearFocus()
                    }
                )

                OmniboxShortcutRow(
                    icon = Icons.Default.QrCode,
                    title = "Share via QR Code or Link",
                    onClick = {
                        viewModel.setQrShareOpen(true)
                        isFocused = false
                        focusManager.clearFocus()
                    }
                )
            }
        }
    }
}

@Composable
private fun OmniboxShortcutRow(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    title: String,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(8.dp))
            .clickable(onClick = onClick)
            .padding(horizontal = 8.dp, vertical = 6.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            tint = NeonCyan,
            modifier = Modifier.size(16.dp)
        )
        Spacer(modifier = Modifier.width(10.dp))
        Text(
            text = title,
            fontSize = 12.sp,
            color = MaterialTheme.colorScheme.onSurface,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis
        )
    }
}
