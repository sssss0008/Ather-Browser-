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
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material.icons.filled.Devices
import androidx.compose.material.icons.filled.Fullscreen
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Tv
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.DeviceLayoutMode
import com.example.ui.theme.NeonCyan
import com.example.ui.theme.ObsidianBackground
import com.example.ui.theme.ObsidianBorder
import com.example.ui.theme.ObsidianSurface
import com.example.ui.theme.ObsidianSurfaceElevated
import com.example.viewmodel.BrowserViewModel

private val TV_CHANNELS = listOf(
    Pair("YouTube TV", "https://m.youtube.com"),
    Pair("Twitch", "https://m.twitch.tv"),
    Pair("Vimeo", "https://vimeo.com"),
    Pair("TED Talks", "https://ted.com"),
    Pair("NASA Live", "https://nasa.gov/live"),
    Pair("Bloomberg", "https://bloomberg.com")
)

@Composable
fun AetherTvLayout(
    viewModel: BrowserViewModel,
    modifier: Modifier = Modifier
) {
    val activeTab = viewModel.getActiveTab()

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(ObsidianBackground)
    ) {
        // High-Contrast TV Top Bar
        Surface(
            color = ObsidianSurface,
            modifier = Modifier.fillMaxWidth()
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(imageVector = Icons.Default.Tv, contentDescription = null, tint = NeonCyan, modifier = Modifier.size(24.dp))
                    Spacer(modifier = Modifier.width(10.dp))
                    Text(text = "AETHER 10-FOOT TV OS", fontSize = 13.sp, fontWeight = FontWeight.Bold, letterSpacing = 2.sp, color = NeonCyan)
                }

                Row(verticalAlignment = Alignment.CenterVertically) {
                    // Switch back to auto/mobile
                    Button(
                        onClick = { viewModel.setDeviceLayoutMode(DeviceLayoutMode.MOBILE) },
                        colors = ButtonDefaults.buttonColors(containerColor = ObsidianSurfaceElevated, contentColor = MaterialTheme.colorScheme.onSurface),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Text("Exit TV Mode", fontSize = 11.sp)
                    }
                }
            }
        }

        // TV Quick Launch Row (Large 10-Foot Horizontal Carousel)
        Surface(
            color = ObsidianSurfaceElevated,
            modifier = Modifier.fillMaxWidth()
        ) {
            LazyRow(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 10.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(TV_CHANNELS) { (title, url) ->
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(12.dp))
                            .background(ObsidianSurface)
                            .border(1.5.dp, ObsidianBorder, RoundedCornerShape(12.dp))
                            .clickable { viewModel.loadUrl(url) }
                            .padding(horizontal = 16.dp, vertical = 12.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = title,
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                    }
                }
            }
        }

        // TV Remote Navigation Bar
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 6.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                IconButton(onClick = { viewModel.goBack() }) {
                    Icon(imageVector = Icons.Default.ArrowBack, contentDescription = "Back", tint = MaterialTheme.colorScheme.onSurface)
                }
                IconButton(onClick = { viewModel.goForward() }) {
                    Icon(imageVector = Icons.Default.ArrowForward, contentDescription = "Forward", tint = MaterialTheme.colorScheme.onSurface)
                }
                IconButton(onClick = { viewModel.reload() }) {
                    Icon(imageVector = Icons.Default.Refresh, contentDescription = "Reload", tint = MaterialTheme.colorScheme.onSurface)
                }
            }

            Box(modifier = Modifier.weight(1f).padding(horizontal = 12.dp)) {
                AetherOmnibox(tab = activeTab, viewModel = viewModel)
            }
        }

        // Main Web View Canvas
        Box(modifier = Modifier.fillMaxSize().weight(1f)) {
            if (activeTab != null) {
                if (activeTab.url == "aether://newtab") {
                    AetherNewTabPage(viewModel = viewModel, onNavigate = { viewModel.loadUrl(it) })
                } else {
                    AetherWebView(tab = activeTab, viewModel = viewModel)
                }
            }
        }
    }
}
