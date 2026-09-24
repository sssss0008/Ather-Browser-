package com.example.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Code
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Surface
import androidx.compose.material3.Tab
import androidx.compose.material3.TabRow
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.CrimsonAlert
import com.example.ui.theme.EmeraldMint
import com.example.ui.theme.NeonCyan
import com.example.ui.theme.ObsidianBackground
import com.example.ui.theme.ObsidianBorder
import com.example.ui.theme.ObsidianSurface
import com.example.ui.theme.ObsidianSurfaceElevated
import com.example.ui.theme.SunsetAmber
import com.example.viewmodel.BrowserViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AetherDevToolsSheet(
    viewModel: BrowserViewModel,
    onDismiss: () -> Unit
) {
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    var selectedTab by remember { mutableIntStateOf(0) }
    val consoleLogs by viewModel.consoleLogs.collectAsState()
    val networkLogs by viewModel.networkLogs.collectAsState()
    val domInfo by viewModel.domInfo.collectAsState()
    var jsInput by remember { mutableStateOf("") }

    val tabTitles = listOf("Console", "Elements", "Network", "Storage")

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
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.Code,
                        contentDescription = null,
                        tint = NeonCyan,
                        modifier = Modifier.size(20.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "AETHER DEVTOOLS",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 1.sp,
                        color = NeonCyan
                    )
                }

                IconButton(
                    onClick = onDismiss,
                    modifier = Modifier.testTag("devtools_close_button")
                ) {
                    Icon(
                        imageVector = Icons.Default.Close,
                        contentDescription = "Close",
                        tint = MaterialTheme.colorScheme.onSurface
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Tabs Row
            TabRow(
                selectedTabIndex = selectedTab,
                containerColor = ObsidianSurfaceElevated,
                contentColor = NeonCyan,
                modifier = Modifier.clip(RoundedCornerShape(10.dp))
            ) {
                tabTitles.forEachIndexed { index, title ->
                    Tab(
                        selected = selectedTab == index,
                        onClick = { selectedTab = index },
                        text = {
                            Text(
                                text = title,
                                fontSize = 12.sp,
                                fontWeight = if (selectedTab == index) FontWeight.Bold else FontWeight.Normal
                            )
                        }
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Content based on tab
            when (selectedTab) {
                0 -> {
                    // Console Tab
                    Column(modifier = Modifier.fillMaxSize()) {
                        // Quick snippet pills
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            listOf("document.title", "location.href", "navigator.userAgent", "clear()").forEach { snippet ->
                                Surface(
                                    shape = RoundedCornerShape(6.dp),
                                    color = ObsidianSurfaceElevated,
                                    border = CardDefaults.outlinedCardBorder().copy(brush = SolidColor(ObsidianBorder)),
                                    modifier = Modifier.clickable {
                                        if (snippet == "clear()") {
                                            viewModel.clearConsole()
                                        } else {
                                            jsInput = snippet
                                            viewModel.executeJsInActiveTab(snippet)
                                        }
                                    }
                                ) {
                                    Text(
                                        text = snippet,
                                        fontSize = 10.sp,
                                        fontFamily = FontFamily.Monospace,
                                        color = NeonCyan,
                                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 4.dp)
                                    )
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(8.dp))

                        // Console Log Output
                        LazyColumn(
                            modifier = Modifier
                                .weight(1f)
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(10.dp))
                                .background(ObsidianSurface)
                                .border(1.dp, ObsidianBorder, RoundedCornerShape(10.dp))
                                .padding(8.dp)
                        ) {
                            if (consoleLogs.isEmpty()) {
                                item {
                                    Text(
                                        text = "// Console output is empty. Type JS expression below.",
                                        fontSize = 11.sp,
                                        fontFamily = FontFamily.Monospace,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }
                            }
                            items(consoleLogs, key = { it.id }) { log ->
                                val color = when (log.level) {
                                    "ERROR" -> CrimsonAlert
                                    "WARN" -> SunsetAmber
                                    "RESULT" -> EmeraldMint
                                    else -> NeonCyan
                                }
                                Text(
                                    text = "[${log.level}] ${log.message}",
                                    fontSize = 11.sp,
                                    fontFamily = FontFamily.Monospace,
                                    color = color,
                                    modifier = Modifier.padding(vertical = 2.dp)
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(8.dp))

                        // JS REPL Input Bar
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(10.dp))
                                .background(ObsidianSurfaceElevated)
                                .border(1.dp, ObsidianBorder, RoundedCornerShape(10.dp))
                                .padding(horizontal = 10.dp, vertical = 6.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = ">",
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold,
                                color = NeonCyan,
                                fontFamily = FontFamily.Monospace
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            BasicTextField(
                                value = jsInput,
                                onValueChange = { jsInput = it },
                                singleLine = true,
                                textStyle = TextStyle(
                                    color = MaterialTheme.colorScheme.onSurface,
                                    fontSize = 12.sp,
                                    fontFamily = FontFamily.Monospace
                                ),
                                cursorBrush = SolidColor(NeonCyan),
                                modifier = Modifier
                                    .weight(1f)
                                    .testTag("devtools_js_input")
                            )

                            IconButton(
                                onClick = {
                                    if (jsInput.isNotBlank()) {
                                        viewModel.executeJsInActiveTab(jsInput)
                                        jsInput = ""
                                    }
                                },
                                modifier = Modifier.size(28.dp).testTag("devtools_js_run_button")
                            ) {
                                Icon(
                                    imageVector = Icons.Default.PlayArrow,
                                    contentDescription = "Run",
                                    tint = NeonCyan,
                                    modifier = Modifier.size(18.dp)
                                )
                            }
                        }
                    }
                }
                1 -> {
                    // Elements Tab
                    LazyColumn(modifier = Modifier.fillMaxSize()) {
                        item {
                            Card(
                                shape = RoundedCornerShape(10.dp),
                                colors = CardDefaults.cardColors(containerColor = ObsidianSurfaceElevated),
                                modifier = Modifier.fillMaxWidth().padding(bottom = 10.dp)
                            ) {
                                Column(modifier = Modifier.padding(12.dp)) {
                                    Text(text = "DOM METRICS", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = NeonCyan)
                                    Spacer(modifier = Modifier.height(6.dp))
                                    Text(text = "Page Title: ${domInfo.title}", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurface)
                                    Text(text = "Elements count: ${domInfo.elementCount}", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurface)
                                    Text(text = "Script tags: ${domInfo.scriptCount}", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurface)
                                    Text(text = "Stylesheets: ${domInfo.stylesheetCount}", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurface)
                                }
                            }
                        }
                        item {
                            Text(text = "LIVE HTML SNIPPET", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            Spacer(modifier = Modifier.height(4.dp))
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(RoundedCornerShape(10.dp))
                                    .background(ObsidianSurface)
                                    .border(1.dp, ObsidianBorder, RoundedCornerShape(10.dp))
                                    .padding(10.dp)
                            ) {
                                Text(
                                    text = if (domInfo.htmlSnippet.isNotBlank()) domInfo.htmlSnippet else "<!DOCTYPE html>\n<html>\n  <head><title>Loading DOM...</title></head>\n  <body><!-- Web page DOM is active --></body>\n</html>",
                                    fontSize = 11.sp,
                                    fontFamily = FontFamily.Monospace,
                                    color = NeonCyan
                                )
                            }
                        }
                    }
                }
                2 -> {
                    // Network Tab
                    LazyColumn(modifier = Modifier.fillMaxSize()) {
                        if (networkLogs.isEmpty()) {
                            item {
                                Text(
                                    text = "No network activity captured yet. Navigate to a page to capture HTTP requests.",
                                    fontSize = 12.sp,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                        }
                        items(networkLogs, key = { it.id }) { net ->
                            Card(
                                shape = RoundedCornerShape(8.dp),
                                colors = CardDefaults.cardColors(containerColor = ObsidianSurfaceElevated),
                                modifier = Modifier.fillMaxWidth().padding(vertical = 3.dp)
                            ) {
                                Row(
                                    modifier = Modifier.fillMaxWidth().padding(8.dp),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Column(modifier = Modifier.weight(1f)) {
                                        Text(text = net.url, fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurface, maxLines = 1)
                                        Text(text = "${net.method} • ${net.durationMs}ms", fontSize = 10.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                    }
                                    Surface(
                                        shape = RoundedCornerShape(4.dp),
                                        color = EmeraldMint.copy(alpha = 0.2f)
                                    ) {
                                        Text(
                                            text = net.statusCode.toString(),
                                            fontSize = 10.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = EmeraldMint,
                                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
                3 -> {
                    // Storage Tab
                    Column(modifier = Modifier.fillMaxSize()) {
                        Card(
                            shape = RoundedCornerShape(10.dp),
                            colors = CardDefaults.cardColors(containerColor = ObsidianSurfaceElevated),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column(modifier = Modifier.padding(14.dp)) {
                                Text(text = "CLIENT STORAGE VAULT", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = NeonCyan)
                                Spacer(modifier = Modifier.height(8.dp))
                                Text(text = "• LocalStorage: Sandboxed isolated per tab", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurface)
                                Text(text = "• Cookies: 3rd-party tracking cookies blocked", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurface)
                                Text(text = "• Cache: In-memory & SQLite backed", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurface)
                                Spacer(modifier = Modifier.height(12.dp))
                                Button(
                                    onClick = {
                                        viewModel.executeJsInActiveTab("localStorage.clear(); sessionStorage.clear();")
                                        viewModel.addConsoleEntry("INFO", "LocalStorage & SessionStorage cleared.")
                                    },
                                    colors = ButtonDefaults.buttonColors(containerColor = CrimsonAlert.copy(alpha = 0.2f), contentColor = CrimsonAlert),
                                    shape = RoundedCornerShape(8.dp)
                                ) {
                                    Text("Clear LocalStorage & Cookies", fontSize = 11.sp)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
