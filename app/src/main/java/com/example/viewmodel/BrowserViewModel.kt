package com.example.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.data.ai.GeminiAiService
import com.example.data.local.BrowserDatabase
import com.example.data.local.model.BookmarkItem
import com.example.data.local.model.DownloadItem
import com.example.data.local.model.HistoryItem
import com.example.data.local.model.ReadingListItem
import com.example.data.model.BrowserTab
import com.example.data.model.ConsoleEntry
import com.example.data.model.DeviceLayoutMode
import com.example.data.model.DomInfo
import com.example.data.model.NetworkEntry
import com.example.data.model.SearchEngine
import com.example.data.model.ShieldStats
import com.example.data.model.WorkspaceType
import com.example.data.repository.BrowserRepository
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharedFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import java.net.URI

data class AiChatMessage(
    val id: String = java.util.UUID.randomUUID().toString(),
    val sender: String, // "user" or "aether"
    val text: String,
    val timestamp: Long = System.currentTimeMillis()
)

sealed interface WebViewCommand {
    data class LoadUrl(val tabId: String, val url: String) : WebViewCommand
    data class GoBack(val tabId: String) : WebViewCommand
    data class GoForward(val tabId: String) : WebViewCommand
    data class Reload(val tabId: String) : WebViewCommand
    data class Stop(val tabId: String) : WebViewCommand
    data class EvaluateJs(val tabId: String, val script: String) : WebViewCommand
}

class BrowserViewModel(application: Application) : AndroidViewModel(application) {

    private val repository: BrowserRepository
    private val aiService = GeminiAiService()

    init {
        val db = BrowserDatabase.getInstance(application)
        repository = BrowserRepository(db.browserDao())
    }

    val historyEntries: StateFlow<List<HistoryItem>> = repository.allHistory
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val bookmarkEntries: StateFlow<List<BookmarkItem>> = repository.allBookmarks
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val readingListEntries: StateFlow<List<ReadingListItem>> = repository.allReadingList
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val downloadEntries: StateFlow<List<DownloadItem>> = repository.allDownloads
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    // Tabs
    private val initialTab = BrowserTab(
        url = "aether://newtab",
        title = "Aether Home"
    )
    private val _tabs = MutableStateFlow<List<BrowserTab>>(listOf(initialTab))
    val tabs: StateFlow<List<BrowserTab>> = _tabs.asStateFlow()

    private val _activeTabId = MutableStateFlow(initialTab.id)
    val activeTabId: StateFlow<String> = _activeTabId.asStateFlow()

    private val _splitTabId = MutableStateFlow<String?>(null)
    val splitTabId: StateFlow<String?> = _splitTabId.asStateFlow()

    // Workspaces & Modes
    private val _activeWorkspace = MutableStateFlow(WorkspaceType.PERSONAL)
    val activeWorkspace: StateFlow<WorkspaceType> = _activeWorkspace.asStateFlow()

    private val _deviceLayoutMode = MutableStateFlow(DeviceLayoutMode.MOBILE)
    val deviceLayoutMode: StateFlow<DeviceLayoutMode> = _deviceLayoutMode.asStateFlow()

    private val _searchEngine = MutableStateFlow(SearchEngine.GOOGLE)
    val searchEngine: StateFlow<SearchEngine> = _searchEngine.asStateFlow()

    // DevTools & Shield
    private val _consoleLogs = MutableStateFlow<List<ConsoleEntry>>(emptyList())
    val consoleLogs: StateFlow<List<ConsoleEntry>> = _consoleLogs.asStateFlow()

    private val _networkLogs = MutableStateFlow<List<NetworkEntry>>(emptyList())
    val networkLogs: StateFlow<List<NetworkEntry>> = _networkLogs.asStateFlow()

    private val _domInfo = MutableStateFlow(DomInfo())
    val domInfo: StateFlow<DomInfo> = _domInfo.asStateFlow()

    private val _shieldStats = MutableStateFlow(ShieldStats())
    val shieldStats: StateFlow<ShieldStats> = _shieldStats.asStateFlow()

    // AI State
    private val _aiMessages = MutableStateFlow<List<AiChatMessage>>(
        listOf(
            AiChatMessage(
                sender = "aether",
                text = "Hello! I am your Aether AI Co-Pilot. I can summarize any active web page, explain complex articles, translate languages, and debug HTML/JS."
            )
        )
    )
    val aiMessages: StateFlow<List<AiChatMessage>> = _aiMessages.asStateFlow()

    private val _isAiLoading = MutableStateFlow(false)
    val isAiLoading: StateFlow<Boolean> = _isAiLoading.asStateFlow()

    // UI Sheets / Overlays
    private val _isTabOverviewOpen = MutableStateFlow(false)
    val isTabOverviewOpen: StateFlow<Boolean> = _isTabOverviewOpen.asStateFlow()

    private val _isDevToolsOpen = MutableStateFlow(false)
    val isDevToolsOpen: StateFlow<Boolean> = _isDevToolsOpen.asStateFlow()

    private val _isAiSheetOpen = MutableStateFlow(false)
    val isAiSheetOpen: StateFlow<Boolean> = _isAiSheetOpen.asStateFlow()

    private val _isShieldSheetOpen = MutableStateFlow(false)
    val isShieldSheetOpen: StateFlow<Boolean> = _isShieldSheetOpen.asStateFlow()

    private val _isHistoryBookmarksOpen = MutableStateFlow(false)
    val isHistoryBookmarksOpen: StateFlow<Boolean> = _isHistoryBookmarksOpen.asStateFlow()

    private val _historyBookmarksTab = MutableStateFlow(0)
    val historyBookmarksTab: StateFlow<Int> = _historyBookmarksTab.asStateFlow()

    private val _isQuickSettingsOpen = MutableStateFlow(false)
    val isQuickSettingsOpen: StateFlow<Boolean> = _isQuickSettingsOpen.asStateFlow()

    private val _isQrShareOpen = MutableStateFlow(false)
    val isQrShareOpen: StateFlow<Boolean> = _isQrShareOpen.asStateFlow()

    // WebView commands channel
    private val _webViewCommands = MutableSharedFlow<WebViewCommand>(extraBufferCapacity = 64)
    val webViewCommands: SharedFlow<WebViewCommand> = _webViewCommands.asSharedFlow()

    fun getActiveTab(): BrowserTab? {
        return _tabs.value.find { it.id == _activeTabId.value }
    }

    fun getSplitTab(): BrowserTab? {
        val splitId = _splitTabId.value ?: return null
        return _tabs.value.find { it.id == splitId }
    }

    fun createNewTab(
        url: String = "aether://newtab",
        title: String = "New Tab",
        isPrivate: Boolean = false
    ) {
        val newTab = BrowserTab(
            url = url,
            title = title,
            isPrivate = isPrivate,
            workspace = _activeWorkspace.value
        )
        _tabs.update { it + newTab }
        _activeTabId.value = newTab.id
        _isTabOverviewOpen.value = false
    }

    fun closeTab(tabId: String) {
        val currentTabs = _tabs.value
        if (currentTabs.size <= 1) {
            // Replace last remaining tab with fresh new tab
            val fresh = BrowserTab(url = "aether://newtab", title = "New Tab", workspace = _activeWorkspace.value)
            _tabs.value = listOf(fresh)
            _activeTabId.value = fresh.id
            _splitTabId.value = null
            return
        }

        val remaining = currentTabs.filter { it.id != tabId }
        _tabs.value = remaining

        if (_splitTabId.value == tabId) {
            _splitTabId.value = null
        }

        if (_activeTabId.value == tabId) {
            _activeTabId.value = remaining.last().id
        }
    }

    fun selectTab(tabId: String) {
        _activeTabId.value = tabId
        _isTabOverviewOpen.value = false
    }

    fun toggleSplitScreen(secondTabId: String? = null) {
        if (_splitTabId.value != null) {
            // Close split screen
            _splitTabId.value = null
        } else {
            // Open split screen with specified or second tab or create new
            val candidate = secondTabId ?: _tabs.value.firstOrNull { it.id != _activeTabId.value }?.id
            if (candidate != null) {
                _splitTabId.value = candidate
            } else {
                val newSplit = BrowserTab(
                    url = "https://news.ycombinator.com",
                    title = "Hacker News",
                    workspace = _activeWorkspace.value
                )
                _tabs.update { it + newSplit }
                _splitTabId.value = newSplit.id
            }
        }
    }

    fun closeSplitScreen() {
        _splitTabId.value = null
    }

    fun loadUrl(urlInput: String, tabId: String = _activeTabId.value) {
        val resolved = resolveUrl(urlInput)
        _tabs.update { list ->
            list.map {
                if (it.id == tabId) it.copy(url = resolved, isReaderMode = false) else it
            }
        }
        _webViewCommands.tryEmit(WebViewCommand.LoadUrl(tabId, resolved))
    }

    private fun resolveUrl(input: String): String {
        val trimmed = input.trim()
        if (trimmed == "aether://newtab") return trimmed
        if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("file://") || trimmed.startsWith("about:")) {
            return trimmed
        }
        if (trimmed.contains(".") && !trimmed.contains(" ") && trimmed.length > 3) {
            return "https://$trimmed"
        }
        return _searchEngine.value.searchUrl + java.net.URLEncoder.encode(trimmed, "UTF-8")
    }

    fun goBack(tabId: String = _activeTabId.value) {
        _webViewCommands.tryEmit(WebViewCommand.GoBack(tabId))
    }

    fun goForward(tabId: String = _activeTabId.value) {
        _webViewCommands.tryEmit(WebViewCommand.GoForward(tabId))
    }

    fun reload(tabId: String = _activeTabId.value) {
        _webViewCommands.tryEmit(WebViewCommand.Reload(tabId))
    }

    fun stop(tabId: String = _activeTabId.value) {
        _webViewCommands.tryEmit(WebViewCommand.Stop(tabId))
    }

    fun updateTabMetadata(
        tabId: String,
        url: String,
        title: String,
        canGoBack: Boolean,
        canGoForward: Boolean
    ) {
        _tabs.update { list ->
            list.map {
                if (it.id == tabId) {
                    it.copy(
                        url = url,
                        title = title.ifBlank { it.title },
                        canGoBack = canGoBack,
                        canGoForward = canGoForward
                    )
                } else it
            }
        }

        // Update Host for Shield
        try {
            val uri = URI(url)
            val host = uri.host ?: ""
            if (host.isNotBlank()) {
                _shieldStats.update { it.copy(currentHost = host, isHttpsSecure = url.startsWith("https://")) }
            }
        } catch (_: Exception) {}

        // Record to History if not private and not newtab
        val active = getActiveTab()
        if (active != null && !active.isPrivate && !url.startsWith("aether://")) {
            viewModelScope.launch {
                repository.recordHistory(url, title)
            }
        }
    }

    fun updateTabProgress(tabId: String, progress: Int, isLoading: Boolean) {
        _tabs.update { list ->
            list.map {
                if (it.id == tabId) it.copy(progress = progress, isLoading = isLoading) else it
            }
        }
    }

    fun toggleDesktopMode(tabId: String = _activeTabId.value) {
        _tabs.update { list ->
            list.map {
                if (it.id == tabId) it.copy(isDesktopMode = !it.isDesktopMode) else it
            }
        }
        reload(tabId)
    }

    fun toggleReaderMode(tabId: String = _activeTabId.value) {
        val tab = _tabs.value.find { it.id == tabId } ?: return
        val willBeReader = !tab.isReaderMode

        if (willBeReader) {
            // Extract text from page
            val extractionJs = """
                (function() {
                    var article = document.querySelector('article') || document.querySelector('main') || document.body;
                    var title = document.title || 'Article';
                    var paras = Array.from(article.querySelectorAll('p, h1, h2, h3, li'))
                                     .map(el => el.innerText.trim())
                                     .filter(t => t.length > 20)
                                     .join('\n\n');
                    return JSON.stringify({ title: title, content: paras });
                })();
            """.trimIndent()
            _webViewCommands.tryEmit(WebViewCommand.EvaluateJs(tabId, extractionJs))
        }

        _tabs.update { list ->
            list.map {
                if (it.id == tabId) it.copy(isReaderMode = willBeReader) else it
            }
        }
    }

    fun setReaderContent(tabId: String, title: String, content: String) {
        _tabs.update { list ->
            list.map {
                if (it.id == tabId) it.copy(readerTitle = title, readerContent = content) else it
            }
        }
    }

    fun setWorkspace(workspace: WorkspaceType) {
        _activeWorkspace.value = workspace
    }

    fun setDeviceLayoutMode(mode: DeviceLayoutMode) {
        _deviceLayoutMode.value = mode
    }

    fun setSearchEngine(engine: SearchEngine) {
        _searchEngine.value = engine
    }

    // DevTools & Console
    fun addConsoleEntry(level: String, message: String, source: String? = null, line: Int = 0) {
        _consoleLogs.update {
            (listOf(ConsoleEntry(level = level, message = message, source = source, lineNumber = line)) + it).take(150)
        }
    }

    fun clearConsole() {
        _consoleLogs.value = emptyList()
    }

    fun executeJsInActiveTab(script: String) {
        addConsoleEntry("INFO", "> $script")
        _webViewCommands.tryEmit(WebViewCommand.EvaluateJs(_activeTabId.value, script))
    }

    fun addNetworkEntry(url: String, method: String = "GET", status: Int = 200) {
        _networkLogs.update {
            (listOf(NetworkEntry(url = url, method = method, statusCode = status)) + it).take(150)
        }
    }

    fun updateDomInfo(info: DomInfo) {
        _domInfo.value = info
    }

    // Shield
    fun incrementBlockedTrackers() {
        _shieldStats.update { it.copy(trackersBlocked = it.trackersBlocked + 1) }
    }

    fun toggleShieldActive() {
        _shieldStats.update { it.copy(isShieldActive = !it.isShieldActive) }
    }

    // AI Assistant
    fun askAi(prompt: String) {
        if (prompt.isBlank()) return
        val currentTab = getActiveTab()
        val userMsg = AiChatMessage(sender = "user", text = prompt)
        _aiMessages.update { it + userMsg }
        _isAiLoading.value = true

        viewModelScope.launch {
            val responseText = aiService.askAssistant(
                prompt = prompt,
                pageTitle = currentTab?.title ?: "Web Page",
                pageContentSnippet = if (currentTab?.readerContent?.isNotBlank() == true) currentTab.readerContent else _domInfo.value.htmlSnippet
            )
            val aiMsg = AiChatMessage(sender = "aether", text = responseText)
            _aiMessages.update { it + aiMsg }
            _isAiLoading.value = false
        }
    }

    // Sheet Toggles
    fun setTabOverviewOpen(open: Boolean) { _isTabOverviewOpen.value = open }
    fun setDevToolsOpen(open: Boolean) { _isDevToolsOpen.value = open }
    fun setAiSheetOpen(open: Boolean) { _isAiSheetOpen.value = open }
    fun setShieldSheetOpen(open: Boolean) { _isShieldSheetOpen.value = open }
    fun setHistoryBookmarksOpen(open: Boolean, tabIndex: Int = 0) {
        _historyBookmarksTab.value = tabIndex
        _isHistoryBookmarksOpen.value = open
    }
    fun setHistoryBookmarksTab(tabIndex: Int) { _historyBookmarksTab.value = tabIndex }
    fun setQuickSettingsOpen(open: Boolean) { _isQuickSettingsOpen.value = open }
    fun setQrShareOpen(open: Boolean) { _isQrShareOpen.value = open }

    // Bookmark & Reading List Actions
    fun bookmarkCurrentTab() {
        val tab = getActiveTab() ?: return
        viewModelScope.launch {
            repository.addBookmark(tab.url, tab.title)
        }
    }

    fun saveCurrentTabToReadingList() {
        val tab = getActiveTab() ?: return
        viewModelScope.launch {
            repository.addReadingListItem(tab.url, tab.title, tab.readerContent.take(200))
        }
    }

    fun deleteBookmark(id: Long) = viewModelScope.launch { repository.removeBookmark(id) }
    fun deleteHistoryEntry(id: Long) = viewModelScope.launch { repository.deleteHistory(id) }
    fun clearAllHistory() = viewModelScope.launch { repository.clearHistory() }
    fun toggleReadingItemRead(item: ReadingListItem) = viewModelScope.launch { repository.toggleReadingListItemRead(item) }
    fun deleteReadingItem(id: Long) = viewModelScope.launch { repository.removeReadingListItem(id) }
    fun deleteDownload(id: Long) = viewModelScope.launch { repository.removeDownload(id) }

    fun addSimulatedDownload(fileName: String, url: String, sizeBytes: Long, mimeType: String) {
        viewModelScope.launch {
            repository.addDownload(fileName, url, sizeBytes, mimeType)
        }
    }
}
