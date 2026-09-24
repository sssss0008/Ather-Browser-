package com.example.ui.components

import android.annotation.SuppressLint
import android.graphics.Bitmap
import android.webkit.ConsoleMessage
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.viewinterop.AndroidView
import com.example.data.model.BrowserTab
import com.example.data.model.DomInfo
import com.example.viewmodel.BrowserViewModel
import com.example.viewmodel.WebViewCommand
import kotlinx.coroutines.flow.collectLatest
import org.json.JSONObject
import java.io.ByteArrayInputStream

private val TRACKER_DOMAINS = listOf(
    "google-analytics.com",
    "googletagmanager.com",
    "doubleclick.net",
    "scorecardresearch.com",
    "facebook.net/tr",
    "adservice.google.com",
    "adnxs.com",
    "criteo.com",
    "hotjar.com",
    "mixpanel.com"
)

private const val DESKTOP_USER_AGENT =
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36"

@SuppressLint("SetJavaScriptEnabled")
@Composable
fun AetherWebView(
    tab: BrowserTab,
    viewModel: BrowserViewModel,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val webView = remember(tab.id) { WebView(context) }

    DisposableEffect(tab.id) {
        onDispose {
            try {
                webView.stopLoading()
                webView.destroy()
            } catch (_: Exception) {}
        }
    }

    LaunchedEffect(tab.id) {
        viewModel.webViewCommands.collectLatest { cmd ->
            when (cmd) {
                is WebViewCommand.LoadUrl -> {
                    if (cmd.tabId == tab.id) {
                        webView.loadUrl(cmd.url)
                    }
                }
                is WebViewCommand.GoBack -> {
                    if (cmd.tabId == tab.id && webView.canGoBack()) {
                        webView.goBack()
                    }
                }
                is WebViewCommand.GoForward -> {
                    if (cmd.tabId == tab.id && webView.canGoForward()) {
                        webView.goForward()
                    }
                }
                is WebViewCommand.Reload -> {
                    if (cmd.tabId == tab.id) {
                        webView.reload()
                    }
                }
                is WebViewCommand.Stop -> {
                    if (cmd.tabId == tab.id) {
                        webView.stopLoading()
                    }
                }
                is WebViewCommand.EvaluateJs -> {
                    if (cmd.tabId == tab.id) {
                        webView.evaluateJavascript(cmd.script) { result ->
                            if (result != null && result != "null" && result != "\"\"") {
                                if (result.contains("readerContent") || result.contains("title")) {
                                    try {
                                        val clean = if (result.startsWith("\"") && result.endsWith("\"")) {
                                            result.substring(1, result.length - 1).replace("\\\"", "\"").replace("\\n", "\n")
                                        } else result
                                        val json = JSONObject(clean)
                                        val title = json.optString("title", tab.title)
                                        val content = json.optString("content", "")
                                        viewModel.setReaderContent(tab.id, title, content)
                                    } catch (_: Exception) {}
                                }
                                viewModel.addConsoleEntry("RESULT", result)
                            }
                        }
                    }
                }
            }
        }
    }

    Box(modifier = modifier.fillMaxSize()) {
        AndroidView(
            factory = {
                webView.apply {
                    settings.apply {
                        javaScriptEnabled = true
                        domStorageEnabled = true
                        databaseEnabled = true
                        useWideViewPort = true
                        loadWithOverviewMode = true
                        setSupportZoom(true)
                        builtInZoomControls = true
                        displayZoomControls = false
                        mixedContentMode = WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE
                        cacheMode = WebSettings.LOAD_DEFAULT

                        userAgentString = if (tab.isDesktopMode) {
                            DESKTOP_USER_AGENT
                        } else {
                            null
                        }
                    }

                    webChromeClient = object : WebChromeClient() {
                        override fun onProgressChanged(view: WebView?, newProgress: Int) {
                            super.onProgressChanged(view, newProgress)
                            val isLoading = newProgress in 1..99
                            viewModel.updateTabProgress(tab.id, newProgress, isLoading)
                        }

                        override fun onReceivedTitle(view: WebView?, title: String?) {
                            super.onReceivedTitle(view, title)
                            if (!title.isNullOrBlank()) {
                                viewModel.updateTabMetadata(
                                    tabId = tab.id,
                                    url = view?.url ?: tab.url,
                                    title = title,
                                    canGoBack = view?.canGoBack() == true,
                                    canGoForward = view?.canGoForward() == true
                                )
                            }
                        }

                        override fun onConsoleMessage(consoleMessage: ConsoleMessage?): Boolean {
                            if (consoleMessage != null) {
                                val level = when (consoleMessage.messageLevel()) {
                                    ConsoleMessage.MessageLevel.ERROR -> "ERROR"
                                    ConsoleMessage.MessageLevel.WARNING -> "WARN"
                                    ConsoleMessage.MessageLevel.LOG -> "LOG"
                                    else -> "INFO"
                                }
                                viewModel.addConsoleEntry(
                                    level = level,
                                    message = consoleMessage.message() ?: "",
                                    source = consoleMessage.sourceId(),
                                    line = consoleMessage.lineNumber()
                                )
                            }
                            return super.onConsoleMessage(consoleMessage)
                        }
                    }

                    webViewClient = object : WebViewClient() {
                        override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                            val url = request?.url?.toString() ?: return false
                            if (url.startsWith("http://") || url.startsWith("https://")) {
                                return false
                            }
                            return true
                        }

                        override fun shouldInterceptRequest(
                            view: WebView?,
                            request: WebResourceRequest?
                        ): WebResourceResponse? {
                            val url = request?.url?.toString() ?: return null
                            val isShield = viewModel.shieldStats.value.isShieldActive

                            if (isShield) {
                                for (tracker in TRACKER_DOMAINS) {
                                    if (url.contains(tracker, ignoreCase = true)) {
                                        viewModel.incrementBlockedTrackers()
                                        return WebResourceResponse(
                                            "text/plain",
                                            "UTF-8",
                                            ByteArrayInputStream("".toByteArray())
                                        )
                                    }
                                }
                            }

                            // Log top-level assets in DevTools network tab
                            if (request.isForMainFrame || url.contains(".js") || url.contains(".css") || url.contains("api")) {
                                viewModel.addNetworkEntry(url, request.method, 200)
                            }

                            return super.shouldInterceptRequest(view, request)
                        }

                        override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                            super.onPageStarted(view, url, favicon)
                            viewModel.updateTabProgress(tab.id, 10, true)
                            if (url != null) {
                                viewModel.updateTabMetadata(
                                    tabId = tab.id,
                                    url = url,
                                    title = view?.title ?: tab.title,
                                    canGoBack = view?.canGoBack() == true,
                                    canGoForward = view?.canGoForward() == true
                                )
                            }
                        }

                        override fun onPageFinished(view: WebView?, url: String?) {
                            super.onPageFinished(view, url)
                            viewModel.updateTabProgress(tab.id, 100, false)
                            if (url != null) {
                                viewModel.updateTabMetadata(
                                    tabId = tab.id,
                                    url = url,
                                    title = view?.title ?: tab.title,
                                    canGoBack = view?.canGoBack() == true,
                                    canGoForward = view?.canGoForward() == true
                                )

                                // Extract DOM stats for DevTools and AI Assistant
                                val domProbeJs = """
                                    (function() {
                                        var elements = document.getElementsByTagName('*').length;
                                        var scripts = document.getElementsByTagName('script').length;
                                        var styles = document.getElementsByTagName('style').length + document.querySelectorAll('link[rel="stylesheet"]').length;
                                        var snippet = document.body ? document.body.innerText.substring(0, 1000) : '';
                                        return JSON.stringify({
                                            title: document.title,
                                            url: window.location.href,
                                            elementCount: elements,
                                            scriptCount: scripts,
                                            stylesheetCount: styles,
                                            htmlSnippet: snippet
                                        });
                                    })();
                                """.trimIndent()

                                view?.evaluateJavascript(domProbeJs) { rawJson ->
                                    try {
                                        if (!rawJson.isNullOrBlank() && rawJson != "null") {
                                            val clean = if (rawJson.startsWith("\"") && rawJson.endsWith("\"")) {
                                                rawJson.substring(1, rawJson.length - 1).replace("\\\"", "\"").replace("\\n", "\n")
                                            } else rawJson
                                            val json = JSONObject(clean)
                                            viewModel.updateDomInfo(
                                                DomInfo(
                                                    title = json.optString("title", ""),
                                                    url = json.optString("url", ""),
                                                    elementCount = json.optInt("elementCount", 0),
                                                    scriptCount = json.optInt("scriptCount", 0),
                                                    stylesheetCount = json.optInt("stylesheetCount", 0),
                                                    htmlSnippet = json.optString("htmlSnippet", "")
                                                )
                                            )
                                        }
                                    } catch (_: Exception) {}
                                }
                            }
                        }
                    }

                    if (tab.url != "aether://newtab" && (view?.url.isNullOrBlank() || view?.url == "about:blank")) {
                        loadUrl(tab.url)
                    }
                }
            },
            update = { view ->
                // Update Desktop mode user agent if changed
                val targetAgent = if (tab.isDesktopMode) DESKTOP_USER_AGENT else null
                if (view.settings.userAgentString != targetAgent && (targetAgent != null || tab.isDesktopMode)) {
                    view.settings.userAgentString = targetAgent
                }
            },
            modifier = Modifier.fillMaxSize()
        )
    }
}
