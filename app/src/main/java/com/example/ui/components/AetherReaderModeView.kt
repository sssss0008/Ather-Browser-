package com.example.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
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
import androidx.compose.material.icons.filled.Bookmark
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.FormatSize
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.BrowserTab
import com.example.ui.theme.NeonCyan
import com.example.ui.theme.OLEDBackground
import com.example.ui.theme.ObsidianBackground
import com.example.ui.theme.ObsidianBorder
import com.example.ui.theme.ObsidianSurfaceElevated
import com.example.ui.theme.SepiaBackground
import com.example.ui.theme.SepiaText
import com.example.viewmodel.BrowserViewModel

@Composable
fun AetherReaderModeView(
    tab: BrowserTab,
    viewModel: BrowserViewModel,
    modifier: Modifier = Modifier
) {
    val scrollState = rememberScrollState()
    var fontSizeSp by remember { mutableFloatStateOf(16f) }
    var selectedThemeIndex by remember { mutableIntStateOf(0) } // 0: Dark, 1: Sepia, 2: OLED, 3: Light
    var selectedFontIndex by remember { mutableIntStateOf(0) } // 0: Sans, 1: Serif, 2: Monospace

    val (bgColor, textColor) = when (selectedThemeIndex) {
        1 -> Pair(SepiaBackground, SepiaText)
        2 -> Pair(OLEDBackground, Color.White)
        3 -> Pair(Color.White, Color(0xFF1E293B))
        else -> Pair(ObsidianBackground, Color(0xFFE2E8F0))
    }

    val currentFontFamily = when (selectedFontIndex) {
        1 -> FontFamily.Serif
        2 -> FontFamily.Monospace
        else -> FontFamily.Default
    }

    val content = if (tab.readerContent.isNotBlank()) tab.readerContent
    else "No article body could be automatically extracted from this page. Aether Reader Mode optimizes standard news and article paragraphs."

    val wordCount = content.split("\\s+".toRegex()).size
    val readTimeMinutes = maxOf(1, wordCount / 200)

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(bgColor)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(scrollState)
                .padding(horizontal = 24.dp, vertical = 20.dp)
        ) {
            // Reader Control Toolbar
            Surface(
                shape = RoundedCornerShape(14.dp),
                color = if (selectedThemeIndex == 1) Color(0xFFEAE0D0) else ObsidianSurfaceElevated,
                border = CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(ObsidianBorder)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 12.dp, vertical = 6.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // Font Size - / +
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = "A-",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = textColor,
                            modifier = Modifier
                                .clickable { if (fontSizeSp > 12f) fontSizeSp -= 2f }
                                .padding(6.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "${fontSizeSp.toInt()}sp",
                            fontSize = 11.sp,
                            color = textColor.copy(alpha = 0.7f)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "A+",
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Bold,
                            color = textColor,
                            modifier = Modifier
                                .clickable { if (fontSizeSp < 28f) fontSizeSp += 2f }
                                .padding(6.dp)
                        )
                    }

                    // Font Family Toggle
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        listOf("Sans", "Serif", "Mono").forEachIndexed { index, name ->
                            Text(
                                text = name,
                                fontSize = 11.sp,
                                fontWeight = if (selectedFontIndex == index) FontWeight.Bold else FontWeight.Normal,
                                color = if (selectedFontIndex == index) NeonCyan else textColor.copy(alpha = 0.6f),
                                modifier = Modifier
                                    .clickable { selectedFontIndex = index }
                                    .padding(horizontal = 6.dp, vertical = 4.dp)
                            )
                        }
                    }

                    // Theme Dots
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        listOf(
                            ObsidianBackground,
                            SepiaBackground,
                            OLEDBackground,
                            Color.White
                        ).forEachIndexed { idx, col ->
                            Box(
                                modifier = Modifier
                                    .size(18.dp)
                                    .clip(CircleShape)
                                    .background(col)
                                    .border(1.dp, if (selectedThemeIndex == idx) NeonCyan else Color.Gray, CircleShape)
                                    .clickable { selectedThemeIndex = idx }
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                        }

                        // Close Reader Mode
                        IconButton(
                            onClick = { viewModel.toggleReaderMode(tab.id) },
                            modifier = Modifier.size(28.dp).testTag("reader_mode_exit_button")
                        ) {
                            Icon(
                                imageVector = Icons.Default.Close,
                                contentDescription = "Exit Reader Mode",
                                tint = textColor,
                                modifier = Modifier.size(16.dp)
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Article Header
            Text(
                text = tab.readerTitle.ifBlank { tab.title },
                fontSize = (fontSizeSp + 8f).sp,
                fontWeight = FontWeight.Bold,
                fontFamily = currentFontFamily,
                color = textColor,
                lineHeight = (fontSizeSp + 14f).sp
            )

            Spacer(modifier = Modifier.height(8.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "${tab.url.removePrefix("https://").take(30)} • $readTimeMinutes min read",
                    fontSize = 12.sp,
                    color = textColor.copy(alpha = 0.6f)
                )

                Row {
                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = NeonCyan.copy(alpha = 0.15f),
                        modifier = Modifier
                            .clickable { viewModel.saveCurrentTabToReadingList() }
                            .padding(4.dp)
                    ) {
                        Row(modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)) {
                            Icon(imageVector = Icons.Default.Bookmark, contentDescription = null, tint = NeonCyan, modifier = Modifier.size(14.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(text = "Save", fontSize = 11.sp, color = NeonCyan)
                        }
                    }

                    Spacer(modifier = Modifier.width(6.dp))

                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = NeonCyan.copy(alpha = 0.15f),
                        modifier = Modifier
                            .clickable { viewModel.setAiSheetOpen(true) }
                            .padding(4.dp)
                    ) {
                        Row(modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)) {
                            Icon(imageVector = Icons.Default.AutoAwesome, contentDescription = null, tint = NeonCyan, modifier = Modifier.size(14.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(text = "AI Summary", fontSize = 11.sp, color = NeonCyan)
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Article Text Body
            Text(
                text = content,
                fontSize = fontSizeSp.sp,
                lineHeight = (fontSizeSp * 1.65f).sp,
                fontFamily = currentFontFamily,
                color = textColor
            )

            Spacer(modifier = Modifier.height(40.dp))
        }
    }
}
