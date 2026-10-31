package com.khaled.crafthost;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.DownloadManager;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.text.InputType;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowInsets;
import android.webkit.CookieManager;
import android.webkit.URLUtil;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

/**
 * CraftHost in a WebView. The site is the app: login, dashboard, console
 * (WebSocket), file manager, marketplace. The app adds what a browser tab
 * lacks: a remembered server address (the site's tunnel URL changes on
 * restart), uploads, cookie-authenticated downloads, an offline screen and
 * back navigation.
 */
public class MainActivity extends Activity {
    private static final String PREFS = "crafthost";
    private static final String KEY_URL = "base_url";
    private static final int REQ_FILE = 41;
    private static final String START_PATH = "/dashboard.html";
    /** The site's scripts use ?. and ?? (Chrome 80+); older WebViews fail to parse them. */
    static final int MIN_WEBVIEW_MAJOR = 80;

    private WebView web;
    private ProgressBar progress;
    private SharedPreferences prefs;
    private ValueCallback<Uri[]> fileCallback;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        prefs = getSharedPreferences(PREFS, MODE_PRIVATE);
        buildUi();
        configureWebView();

        String saved = prefs.getString(KEY_URL, null);
        if (savedInstanceState != null) {
            web.restoreState(savedInstanceState);
        } else if (saved == null) {
            askServer(true);
        } else {
            openStart();
        }
    }

    // ── UI ──────────────────────────────────────────────────────────────────

    private void buildUi() {
        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(getColor(R.color.bg));
        web = new WebView(this);
        web.setBackgroundColor(getColor(R.color.bg));
        root.addView(web, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

        progress = new ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal);
        progress.setMax(100);
        progress.setProgressTintList(android.content.res.ColorStateList.valueOf(getColor(R.color.brand)));
        progress.setProgressBackgroundTintList(android.content.res.ColorStateList.valueOf(Color.TRANSPARENT));
        FrameLayout.LayoutParams lp = new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, dp(3), Gravity.TOP);
        root.addView(progress, lp);
        progress.setVisibility(View.GONE);

        // Android 15 draws apps edge-to-edge: keep the page clear of the
        // status/navigation bars and the keyboard.
        root.setOnApplyWindowInsetsListener((v, insets) -> {
            int l, t, r, b;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                android.graphics.Insets in = insets.getInsets(
                        WindowInsets.Type.systemBars() | WindowInsets.Type.ime() | WindowInsets.Type.displayCutout());
                l = in.left; t = in.top; r = in.right; b = in.bottom;
            } else {
                l = insets.getSystemWindowInsetLeft(); t = insets.getSystemWindowInsetTop();
                r = insets.getSystemWindowInsetRight(); b = insets.getSystemWindowInsetBottom();
            }
            v.setPadding(l, t, r, b);
            return insets;
        });
        setContentView(root);
    }

    private int dp(int v) {
        return Math.round(v * getResources().getDisplayMetrics().density);
    }

    // ── WebView ─────────────────────────────────────────────────────────────

    private void configureWebView() {
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);          // the site keeps its session + language in localStorage
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(false);
        s.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        s.setUserAgentString(s.getUserAgentString() + " CraftHostApp/" + BuildConfig.VERSION_NAME);
        CookieManager.getInstance().setAcceptCookie(true);

        web.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest req) {
                return route(req.getUrl());
            }

            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                progress.setVisibility(View.VISIBLE);
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                progress.setVisibility(View.GONE);
                CookieManager.getInstance().flush();
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest req, WebResourceError err) {
                if (req.isForMainFrame()) showOffline();
            }
        });

        web.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int p) {
                progress.setProgress(p);
            }

            @Override
            public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> cb, FileChooserParams params) {
                if (fileCallback != null) fileCallback.onReceiveValue(null);
                fileCallback = cb;
                try {
                    startActivityForResult(params.createIntent(), REQ_FILE);
                } catch (ActivityNotFoundException e) {
                    fileCallback = null;
                    Toast.makeText(MainActivity.this, R.string.no_file_picker, Toast.LENGTH_SHORT).show();
                    return false;
                }
                return true;
            }
        });

        web.setDownloadListener((url, userAgent, contentDisposition, mimeType, length) ->
                download(url, userAgent, contentDisposition, mimeType));
    }

    /** true = handled here (don't load in the WebView). */
    private boolean route(Uri uri) {
        String scheme = uri.getScheme() == null ? "" : uri.getScheme();
        if ("crafthost".equals(scheme)) {             // buttons on the offline screen
            if ("retry".equals(uri.getHost())) openStart();
            else if ("server".equals(uri.getHost())) askServer(false);
            else if ("update-webview".equals(uri.getHost())) openWebViewStore();
            return true;
        }
        Uri base = Uri.parse(baseUrl());
        boolean isWeb = scheme.equals("http") || scheme.equals("https");
        if (isWeb && uri.getHost() != null && uri.getHost().equalsIgnoreCase(base.getHost())) return false;
        // Other sites (Modrinth, Discord, docs) and mailto:/intent: links go to their own apps.
        try {
            startActivity(new Intent(Intent.ACTION_VIEW, uri));
        } catch (ActivityNotFoundException ignored) {
        }
        return true;
    }

    private void openWebViewStore() {
        String pkg = "com.google.android.webview";
        try {
            startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse("market://details?id=" + pkg)));
        } catch (ActivityNotFoundException e) {
            try {
                startActivity(new Intent(Intent.ACTION_VIEW,
                        Uri.parse("https://play.google.com/store/apps/details?id=" + pkg)));
            } catch (ActivityNotFoundException ignored) {
            }
        }
    }

    private void download(String url, String ua, String disposition, String mime) {
        if (url.startsWith("blob:") || url.startsWith("data:")) {
            Toast.makeText(this, R.string.download_failed, Toast.LENGTH_SHORT).show();
            return;
        }
        try {
            String name = URLUtil.guessFileName(url, disposition, mime);
            DownloadManager.Request r = new DownloadManager.Request(Uri.parse(url));
            // Backups, world files and the .bat starter are behind the login cookie.
            String cookie = CookieManager.getInstance().getCookie(url);
            if (cookie != null) r.addRequestHeader("Cookie", cookie);
            r.addRequestHeader("User-Agent", ua);
            r.setMimeType(mime);
            r.setTitle(name);
            r.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
            r.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, name);
            ((DownloadManager) getSystemService(DOWNLOAD_SERVICE)).enqueue(r);
            Toast.makeText(this, getString(R.string.downloading, name), Toast.LENGTH_SHORT).show();
        } catch (Exception e) {
            Toast.makeText(this, R.string.download_failed, Toast.LENGTH_SHORT).show();
        }
    }

    private void showOffline() {
        progress.setVisibility(View.GONE);
        String html = page(getString(R.string.offline_title), getString(R.string.offline_body), baseUrl(),
                "<a class='p' href='crafthost://retry'>" + esc(getString(R.string.retry)) + "</a>"
                        + "<a class='s' href='crafthost://server'>" + esc(getString(R.string.change_server)) + "</a>");
        web.loadDataWithBaseURL("crafthost://offline/", html, "text/html", "utf-8", null);
    }

    /** A self-contained status page in the site's colours; buttons are crafthost:// links. */
    private static String page(String title, String body, String code, String buttonsHtml) {
        return "<!DOCTYPE html><html dir='auto'><head><meta name='viewport' content='width=device-width,initial-scale=1'>"
                + "<style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;"
                + "background:#0B1220;color:#E2E8F0;font-family:system-ui,sans-serif;text-align:center}"
                + "div{padding:28px;max-width:360px}h2{margin:0 0 10px;font-size:20px}p{color:#94A3B8;line-height:1.5}"
                + "a{display:block;margin:12px 0 0;padding:13px;border-radius:10px;text-decoration:none;font-weight:700}"
                + ".p{background:#10B981;color:#04140D}.s{border:1px solid #334155;color:#E2E8F0}code{color:#64748B;font-size:12px;word-break:break-all}</style>"
                + "</head><body><div><h2>" + esc(title) + "</h2><p>" + esc(body) + "</p>"
                + (code.isEmpty() ? "" : "<code>" + esc(code) + "</code>")
                + buttonsHtml + "</div></body></html>";
    }

    private static String esc(String s) {
        return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("'", "&#39;");
    }

    // ── Server address ──────────────────────────────────────────────────────

    private String baseUrl() {
        return prefs.getString(KEY_URL, BuildConfig.DEFAULT_URL);
    }

    private void openStart() {
        int major = webViewMajor();
        if (major > 0 && major < MIN_WEBVIEW_MAJOR) {
            showOldWebView(major);
            return;
        }
        web.loadUrl(baseUrl() + START_PATH);
    }

    /** Major version of the system WebView, or -1 when unknown. */
    private static int webViewMajor() {
        android.content.pm.PackageInfo p = WebView.getCurrentWebViewPackage();
        return p == null ? -1 : parseMajor(p.versionName);
    }

    static int parseMajor(String versionName) {
        if (versionName == null) return -1;
        java.util.regex.Matcher m = java.util.regex.Pattern.compile("^(\\d+)").matcher(versionName.trim());
        return m.find() ? Integer.parseInt(m.group(1)) : -1;
    }

    private void showOldWebView(int major) {
        progress.setVisibility(View.GONE);
        String body = getString(R.string.old_webview_body, major, MIN_WEBVIEW_MAJOR);
        web.loadDataWithBaseURL("crafthost://offline/", page(getString(R.string.old_webview_title), body, "",
                "<a class='p' href='crafthost://update-webview'>" + esc(getString(R.string.update_webview)) + "</a>"
                        + "<a class='s' href='crafthost://retry'>" + esc(getString(R.string.retry)) + "</a>"),
                "text/html", "utf-8", null);
    }

    /** Accepts "host", "https://host/", "https://host/dashboard.html"; returns "https://host" or null. */
    static String normalize(String input) {
        if (input == null) return null;
        String s = input.trim();
        if (s.isEmpty() || s.contains(" ")) return null;
        if (!s.matches("(?i)^[a-z][a-z0-9+.-]*://.*")) s = "https://" + s;
        java.net.URI u;
        try {
            u = new java.net.URI(s);
        } catch (java.net.URISyntaxException e) {
            return null;
        }
        String scheme = u.getScheme() == null ? "" : u.getScheme().toLowerCase(java.util.Locale.ROOT);
        String host = u.getHost();
        if (host == null || host.isEmpty() || !(scheme.equals("https") || scheme.equals("http"))) return null;
        host = host.toLowerCase(java.util.Locale.ROOT);
        boolean local = host.equals("10.0.2.2") || host.equals("localhost");
        if (scheme.equals("http") && !local) return null; // the network config only allows https
        return scheme + "://" + host + (u.getPort() > 0 ? ":" + u.getPort() : "");
    }

    private void askServer(boolean firstRun) {
        LinearLayout box = new LinearLayout(this);
        box.setOrientation(LinearLayout.VERTICAL);
        box.setPadding(dp(22), dp(8), dp(22), 0);
        TextView help = new TextView(this);
        help.setText(R.string.server_help);
        help.setTextSize(13);
        box.addView(help);
        EditText input = new EditText(this);
        input.setSingleLine(true);
        input.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_URI);
        input.setHint(R.string.server_hint);
        input.setText(baseUrl());
        input.setSelectAllOnFocus(true);
        input.setTextDirection(View.TEXT_DIRECTION_LTR);
        box.addView(input);

        AlertDialog d = new AlertDialog.Builder(this)
                .setTitle(R.string.server_title)
                .setView(box)
                .setCancelable(!firstRun)
                .setPositiveButton(R.string.save, null)
                .setNegativeButton(R.string.cancel, (dlg, w) -> {
                    if (firstRun) openStart();
                })
                .create();
        d.setOnShowListener(x -> d.getButton(AlertDialog.BUTTON_POSITIVE).setOnClickListener(v -> {
            String url = normalize(input.getText().toString());
            if (url == null) {
                input.setError(getString(R.string.invalid_url));
                return;
            }
            prefs.edit().putString(KEY_URL, url).apply();
            d.dismiss();
            web.clearHistory();
            openStart();
        }));
        d.show();
    }

    // ── Activity plumbing ───────────────────────────────────────────────────

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == REQ_FILE) {
            if (fileCallback != null)
                fileCallback.onReceiveValue(WebChromeClient.FileChooserParams.parseResult(resultCode, data));
            fileCallback = null;
            return;
        }
        super.onActivityResult(requestCode, resultCode, data);
    }

    @Override
    public void onBackPressed() {
        String url = web.getUrl();
        boolean offline = url != null && url.startsWith("crafthost:");
        if (!offline && web.canGoBack()) {
            web.goBack();
            return;
        }
        new AlertDialog.Builder(this)
                .setTitle(R.string.menu_title)
                .setItems(new CharSequence[]{
                        getString(R.string.reload), getString(R.string.change_server), getString(R.string.exit)
                }, (dlg, which) -> {
                    if (which == 0) openStart();
                    else if (which == 1) askServer(false);
                    else finish();
                })
                .show();
    }

    @Override
    protected void onSaveInstanceState(Bundle out) {
        super.onSaveInstanceState(out);
        web.saveState(out);
    }

    @Override
    protected void onPause() {
        super.onPause();
        CookieManager.getInstance().flush();
    }

    @Override
    protected void onDestroy() {
        if (web != null) {
            web.destroy();
        }
        super.onDestroy();
    }
}
