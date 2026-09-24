package com.example.data.model

import java.util.UUID

enum class WorkspaceType(val title: String, val description: String) {
    PERSONAL("Personal", "Daily browsing, socials, and leisure"),
    WORK("Work & Focus", "Productivity, docs, and communication"),
    DEV("Developer & Research", "Debugging, documentation, GitHub"),
    MEDIA("Media & Streaming", "Video, music, and entertainment")
}

enum class DeviceLayoutMode(val label: String, val description: String) {
    MOBILE("Mobile OS", "Ergonomic bottom navigation & one-hand command dock"),
    TABLET("Tablet Canvas", "Top tab strip, split view & productivity rail"),
    DESKTOP("Desktop Web OS", "Windowed chrome, menus, vertical tabs & dev bar"),
    TV("10-Foot TV UI", "High contrast, large d-pad tiles & media streaming")
}

enum class SearchEngine(val title: String, val searchUrl: String) {
    GOOGLE("Google", "https://www.google.com/search?q="),
    DUCKDUCKGO("DuckDuckGo", "https://duckduckgo.com/?q="),
    BRAVE("Brave Search", "https://search.brave.com/search?q="),
    BING("Bing", "https://www.bing.com/search?q="),
    PERPLEXITY("Perplexity AI", "https://www.perplexity.ai/search?q="),
    WIKIPEDIA("Wikipedia", "https://en.wikipedia.org/wiki/Special:Search?search=")
}

data class BrowserTab(
    val id: String = UUID.randomUUID().toString(),
    val url: String = "aether://newtab",
    val title: String = "New Tab",
    val faviconUrl: String? = null,
    val isLoading: Boolean = false,
    val progress: Int = 0,
    val canGoBack: Boolean = false,
    val canGoForward: Boolean = false,
    val isDesktopMode: Boolean = false,
    val isPrivate: Boolean = false,
    val workspace: WorkspaceType = WorkspaceType.PERSONAL,
    val isPinned: Boolean = false,
    val isReaderMode: Boolean = false,
    val readerContent: String = "",
    val readerTitle: String = "",
    val zoomPercent: Int = 100,
    val isMuted: Boolean = false
)

data class ConsoleEntry(
    val id: String = UUID.randomUUID().toString(),
    val level: String, // "LOG", "WARN", "ERROR", "INFO"
    val message: String,
    val source: String? = null,
    val lineNumber: Int = 0,
    val timestamp: Long = System.currentTimeMillis()
)

data class NetworkEntry(
    val id: String = UUID.randomUUID().toString(),
    val url: String,
    val method: String = "GET",
    val statusCode: Int = 200,
    val durationMs: Long = 120,
    val timestamp: Long = System.currentTimeMillis()
)

data class DomInfo(
    val title: String = "",
    val url: String = "",
    val characterCount: Int = 0,
    val elementCount: Int = 0,
    val scriptCount: Int = 0,
    val stylesheetCount: Int = 0,
    val htmlSnippet: String = ""
)

data class ShieldStats(
    val isShieldActive: Boolean = true,
    val trackersBlocked: Int = 14,
    val adsBlocked: Int = 8,
    val scriptsBlocked: Int = 3,
    val isHttpsSecure: Boolean = true,
    val fingerprintProtection: Boolean = true,
    val cookieIsolation: Boolean = true,
    val currentHost: String = ""
)

data class QuickDialSite(
    val title: String,
    val url: String,
    val category: String,
    val accentHex: Long
)
