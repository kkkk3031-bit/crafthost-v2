# CraftHost for Android

A small native wrapper (framework WebView, no dependencies, ~20 KB APK) around a
CraftHost site: login, dashboard, live console, files, marketplace.

What the app adds over a browser tab:

- **Server address setting** — asked on first launch, changeable from the back
  menu or the offline screen. CraftHost behind a quick tunnel gets a new URL on
  every restart, so it is not hard-coded. Plain `http://` is only allowed for
  `10.0.2.2`/`localhost` (local development).
- Uploads (world import, custom JARs), cookie-authenticated downloads (backups,
  files, the .bat starter) to *Downloads*, external links in their own apps,
  an offline screen with retry, back navigation, edge-to-edge insets, EN + AR.

## Build

```bash
./gradlew testDebugUnitTest assembleRelease          # app/build/outputs/apk/release/app-release.apk
./gradlew assembleRelease -PdefaultUrl=https://my-site.example   # different first-launch address
```

Release signing reads a gitignored `keystore.properties`
(`storeFile`, `storePassword`, `keyAlias`, `keyPassword`); without it the
release APK is unsigned. Keep `crafthost-release.jks` — updates must be signed
with the same key.
