// CraftHost — shared client helpers

// ── i18n: English ↔ Arabic ─────────────────────────────────────────────────
// Strings are referenced via [data-i18n="key"] on HTML nodes, or window.t(key).
// Language preference persists in localStorage.
window.I18N = {
  en: {
    // Navigation
    nav_servers: "Servers",
    nav_plugins: "Plugins",
    nav_files: "Files",
    nav_console: "Console",
    nav_settings: "Settings",
    nav_jars: "JAR Library",
    nav_account: "Account",
    // Common actions
    sign_in: "Sign in",
    sign_up: "Sign up",
    sign_out: "Sign out",
    create_server: "Create Server",
    start: "Start",
    stop: "Stop",
    restart: "Restart",
    delete: "Delete",
    cancel: "Cancel",
    save: "Save",
    apply: "Apply",
    loading: "Loading…",
    confirm: "Confirm",
    back: "Back",
    next: "Next",
    upload: "Upload",
    download: "Download",
    edit: "Edit",
    search: "Search",
    install: "Install",
    refresh: "Refresh",
    send: "Send",
    copy: "Copy",
    close: "Close",
    // Status
    online: "Online",
    offline: "Offline",
    starting: "Starting…",
    stopped: "Stopped",
    // Stats
    players: "Players",
    uptime: "Uptime",
    cpu: "CPU",
    ram: "RAM",
    tps: "TPS",
    address: "Address",
    mc_version: "MC version",
    host_port: "Host port",
    exit_code: "Exit code",
    msPT: "MSPT",
    // Landing page
    hero_title: "Your Minecraft Server.",
    hero_title_line2: "Live in 60 Seconds.",
    hero_eyebrow: "Now in production",
    meta_engines: "5 engines",
    meta_versions: "18 versions",
    meta_boot: "60s boot",
    meta_config: "0 config",
    ft_tagline: "Free Minecraft server hosting that just works.",
    ft_status: "Status",
    ft_dashboard: "Dashboard",
    skip_to_content: "Skip to content",
    ld_hint_click: "click the block ⛏",
    ld_engines_eyebrow: "engines",
    ld_engines_title: "One block, five engines.",
    ld_engines_sub:
      "Pick the runtime — CraftHost resolves the latest build, boots it and keeps it patched.",
    ld_e_plugins: "plugins",
    ld_e_perf: "performance +",
    ld_e_vanilla: "pure Mojang",
    ld_e_mods: "mods",
    ld_e_modded: "heavy modpacks",
    ld_cross_eyebrow: "cross-play",
    ld_cross_title: "Java and Bedrock. Same world.",
    ld_cross_sub:
      "Geyser is wired in automatically — friends on phones, Xbox, Switch and PlayStation join the same server as PC players.",
    ld_cross_java: "Java Edition",
    ld_cross_java_d: "PC — plugins, mods, full control",
    ld_cross_bed: "Bedrock Edition",
    ld_cross_bed_d: "Mobile, Xbox, Switch, PS — zero setup",
    ld_deploy_eyebrow: "deploy",
    ld_deploy_title: "Live in one command.",
    ld_deploy_sub:
      "Console, file manager, plugin marketplace and backups are already there when the server comes up.",
    ld_cta_title: "Place your block.",
    ld_cta_sub:
      "Free forever. No card, no queue — your server is one click away.",
    hero_sub:
      "Deploy vanilla, modded, or custom-JAR servers in a click. Real hardware. Zero throttling. DDoS-protected.",
    hero_sub_free:
      "Deploy vanilla, modded, or custom-JAR Minecraft servers in one click. Completely free.",
    hero_cta_trial: "Start Free 7-Day Trial →",
    hero_cta_plans: "View Plans",
    hero_cta_deploy: "Deploy My Server →",
    join_discord: "Join Discord",
    hero_cta_pricing: "View pricing",
    landing_systems_ok: "All systems operational · 99.98% uptime",
    landing_stats_servers: "Servers Online Now",
    landing_stats_players: "Players Connected",
    landing_stats_tps: "Average TPS",
    landing_stats_host: "Public Join Address",
    landing_live_badge: "🟢 Live Right Now",
    landing_live_title: "Real servers, real players",
    landing_live_sub:
      "Every card below is an actual Minecraft server running on CraftHost. Click Copy and paste into your client.",
    landing_features_badge: "Features",
    landing_features_title: "Everything you need to run a thriving server.",
    landing_features_sub:
      "Built on bare metal. Tuned for low MSPT. Designed for builders, not bureaucrats.",
    landing_pricing_badge: "Pricing",
    landing_pricing_title: "Plans that scale with your community.",
    landing_faq_badge: "FAQ",
    landing_faq_title: "Common questions, straight answers.",
    // Dashboard
    welcome_back: "Welcome back",
    your_servers: "Your Servers",
    manage_sub: "Manage your Minecraft servers, plugins, and worlds.",
    stat_active: "Your servers",
    stat_players_online: "Players online",
    stat_avg_tps: "Avg. TPS",
    stat_plan: "Plan",
    health_check: "Health Check",
    quick_deploy: "⚡ Quick Deploy",
    quick_deploy_sub:
      "Click any template to spin up a pre-configured server in seconds — no wizard.",
    qd_survival: "Survival",
    qd_creative: "Creative",
    qd_skyblock: "Skyblock",
    qd_modded: "Modded",
    // Auth pages
    auth_email: "Email",
    auth_password: "Password",
    auth_username: "Username",
    auth_signin_title: "Welcome back",
    auth_signin_sub: "Sign in to your CraftHost account",
    auth_signup_title: "Create your account",
    auth_signup_sub: "Start hosting in 60 seconds",
    auth_forgot: "Forgot password?",
    auth_no_account: "Don't have an account?",
    auth_have_account: "Already have an account?",
    auth_remember: "Keep me signed in for 30 days",
    auth_reset_title: "Reset password",
    // Marketplace
    market_title: "Plugins & Mods",
    market_sub:
      "200,000+ from Modrinth & CurseForge. One-click install on your server.",
    market_featured: "🔥 Featured Modpacks",
    market_featured_sub: "Live from Modrinth",
    market_top_picks: "Top Plugins · One-Click",
    market_top_sub: "Curated by CraftHost · paper/spigot/purpur",
    market_all: "All Plugins & Mods",
    market_search_ph: "Search 200,000+ plugins & mods...",
    market_load_more: "Load more →",
    // Files
    files_title: "File Manager",
    files_sub: "Browse, edit, upload, and download files inside your server.",
    files_new_folder: "New folder",
    files_upload_btn: "Upload",
    files_settings_tab: "Settings",
    files_backups_tab: "Backups",
    files_files_tab: "Files",
    // Console
    console_title: "Live Console",
    console_send_ph: "Type a command and press Enter...",
    // Billing
    billing_title: "Billing & Plan",
    billing_balance: "Balance",
    billing_plan: "Current plan",
    billing_invoices: "Invoices",
    // Settings page
    settings_title: "Account Settings",
    settings_change_password: "Change password",
    settings_delete_account: "Delete account",
    // JAR Library
    jars_title: "JAR Library",
    jars_sub: "Your custom JARs and the latest official builds.",
    // Footer / Chrome
    footer_credit: "Programmed by",
    free_plan: "Free",
    upgrade: "Upgrade",
    // Pricing page
    nav_features: "Features",
    nav_pricing: "Pricing",
    nav_faq: "FAQ",
    get_started: "Get Started",
    open_dashboard: "Dashboard",
    home: "Home",
    pricing_title: "Simple, transparent pricing.",
    pricing_sub:
      "All plans include DDoS protection, automatic backups, NVMe storage, and 24/7 support.",
    start_free: "Start free",
    choose: "Choose",
    popular: "Popular",
    feature: "Feature",
    cpu_cores: "CPU cores",
    nvme: "NVMe storage",
    player_slots: "Player slots",
    plugin_slots: "Plugin slots",
    backup_retention: "Backup retention",
    backup_interval: "Backup interval",
    custom_jar: "Custom JAR upload",
    dedicated_ip: "Dedicated IP",
    priority_support: "Priority support",
    ddos: "DDoS protection",
    bedrock_java: "Bedrock & Java",
    status_title: "System status",
    status_sub: "Real-time platform health. Auto-refreshes every 30 seconds.",
    status_users: "Users",
    status_running_now: "Running now",
    settings_profile: "Profile",
    settings_current_pw: "Current password (required to save)",
    save_changes: "Save changes",
    stop_server: "Stop Server",
    start_server: "Start Server",
    menu_view_logs: "View Logs",
    menu_change_jar: "Change JAR",
    menu_copy_address: "Copy address",
    menu_bedrock_on: "Bedrock cross-play (ON)",
    menu_bedrock_enable: "Enable Bedrock cross-play",
    menu_make_public: "Make Public",
    menu_clone: "Clone server",
    menu_import_world: "Import world.zip",
    menu_backups: "Backups",
    menu_launcher: "Launcher Menu (.bat)",
    menu_delete: "Delete server",
    details: "Details",
    bedrock_devices: "mobile / console",
    bedrock_diff_note: "Bedrock uses its OWN address — it is NOT the same as the Java address. Enter the host and the port exactly as shown.",
    bedrock_addr_label: "Bedrock (mobile / Xbox / Switch / PS)",
    java_addr_label: "Java players keep using",
    enable_arrow: "Enable →",
    files_new_file: "New File",
    jars_official: "Official Types",
    jars_custom: "My Custom JARs",
    wiz_deploy: "Deploy Server",
    // Auth recovery + settings pages
    auth_reset_sub: "Enter your account email and we'll send a reset link.",
    auth_send_reset: "Send reset link →",
    auth_back_to: "Back to",
    auth_reset_requested: "Reset requested",
    auth_reset_requested_sub: "If an account exists for that email, a reset link is ready. Ping us on Discord and we'll send it to you after a quick check.",
    auth_open_discord: "Open Discord →",
    auth_new_pw_title: "Set new password",
    label_new_password: "New password",
    label_confirm_password: "Confirm password",
    auth_remembered: "Remembered it?",
    settings_sub: "Manage your account and security.",
    settings_security: "Security",
    btn_change: "Change",
    settings_role: "Account role",
    settings_created: "Account created",
    settings_danger: "Danger zone",
    settings_delete_desc: "Permanently deletes your account, all servers, and all backups. This cannot be undone.",
    label_current_password: "Current password",
    label_confirm_new_password: "Confirm new password",
    btn_update_password: "Update password",
    settings_role_admin: "Administrator — full platform access",
    settings_role_user: "Standard user account",
    settings_created_unknown: "Available after next sign-in",
    settings_pw_desc: "Change your password regularly.",
    // Dashboard summary + cards
    dash_n_online: "{n} online",
    dash_no_running: "no servers running",
    dash_tps_target: "target 20.0",
    dash_n_server: "{n} server",
    dash_n_servers: "{n} servers",
    dash_across_all: "across all servers",
    dash_volume: "10 GB volume · 24/7",
    dash_public: "🌍 Public",
    dash_java_after_start: "address appears after you press ▶ Start",
    tpl_build: "Build",
    tpl_island: "Island",
    tpl_mods: "Mods",
    dash_internal: "🔒 Internal",
    dash_visitor: "Visitor",
    dash_demo_toast: "Showing demo servers — sign in to manage real ones.",
    // Status page
    status_api: "API Backend",
    status_jvm: "JVM Controller",
    status_jvm_desc: "Minecraft server spawner",
    status_tunnel: "Public Tunnel",
    status_checking: "Checking…",
    status_loading: "Loading…",
    status_activity: "Last 24 hours · activity",
    status_last_checked: "Last checked:",
    status_no_activity: "No activity in the last 24h",
    status_all_ok: "All systems operational",
    status_degraded: "Degraded performance",
    status_operational: "Operational",
    status_unavailable: "Unavailable",
    status_local: "Configured locally",
    status_unreachable: "Cannot reach API",
    status_error: "Error:",
    // Engines, JAR library, console, files
    engine_desc_paper: "High-performance plugin server. Recommended for most setups.",
    engine_desc_vanilla: "Pure Mojang Minecraft. No mods, no plugins.",
    engine_desc_purpur: "Configurable Paper fork with extra features.",
    engine_desc_fabric: "Lightweight modding API. Great for client-side mods.",
    engine_desc_neoforge: "Modern Forge fork. Faster release cycle.",
    engine_desc_spigot: "Classic plugin-enabled server.",
    jars_upload: "⬆ Upload Custom JAR",
    jars_upload_short: "⬆ Upload",
    jars_live_api: "Live from official API",
    jars_deploy_with: "Deploy with {name}",
    jars_latest: "Latest: {v}",
    jars_no_versions: "No versions available",
    console_no_players: "No players online",
    console_auto: "⤓ Auto",
    files_root: "/ (root)",
    ago_s: "{n}s ago",
    ago_m: "{n}m ago",
    ago_h: "{n}h ago",
    console_tps_target: "TPS (target 20.0)",
    console_mc_version: "MC version",
    console_host_port: "Host port",
    console_exit_code: "Exit code",
    // Dashboard modals + wizard
    refresh_btn: "↻ Refresh",
    logs_last_lines: "Last 200 lines · auto-refreshes",
    bk_none: "No backups yet. Take one before making big changes!",
    bk_includes: "Snapshots include your worlds, plugin and mod data, server.properties, and player lists.",
    bk_now: "📸 Back up now",
    bk_working: "⏳ Working…",
    swap_type: "Server Type",
    swap_version: "Version (latest 10)",
    swap_note: "⚠ Server will stop, download new JAR (~30s), and restart automatically. Your world data is preserved.",
    del_about: "You are about to permanently delete:",
    del_warn: "This stops the JVM, removes the world data, releases the public tunnel, and erases all backups. There is no undo.",
    del_type_name: "Type the server name to confirm",
    del_forever: "Delete forever",
    hc_n_healthy: "✓ {n} healthy",
    hc_n_warn: "! {n} warnings",
    hc_n_error: "✗ {n} errors",
    hc_no_servers: "No servers yet",
    hc_needs_attention: "Needs attention",
    hc_has_warnings: "Has warnings",
    hc_healthy: "Healthy",
    hc_offline: "Server is offline · no live stats",
    hc_polling: "Polling every 10s · last refresh: {t}",
    clone_desc: "Creates a new server with the same type, version, plan, world, and plugins.",
    clone_name: "New server name",
    clone_world: "Copy world (saves & terrain)",
    clone_plugins: "Copy plugins folder",
    clone_now: "📑 Clone now",
    wiz_step_type: "Type",
    wiz_step_version: "Version",
    wiz_step_configure: "Configure",
    wiz_step_review: "Review",
    wiz_pick_engine: "Pick the engine that powers your world.",
    engine_desc_custom: "Upload your own .jar file (up to 500MB).",
    // Server settings, world import, Bedrock modals (some values carry trusted markup)
    set_no_icon: "No icon",
    set_icon: "Server icon",
    set_icon_hint: "PNG, 64×64 recommended. Shown to players in their server list.",
    set_choose_png: "📁 Choose PNG",
    set_motd_hint: "(use &X color codes)",
    set_motd_preview: "Preview appears here",
    set_max_players: "Max Players",
    set_view_distance: "View Distance",
    set_sim_distance: "Simulation Distance",
    set_spawn_protection: "Spawn Protection",
    set_blocks_hint: "(blocks, 0=off)",
    set_pvp: "Enable PvP",
    set_flight: "Allow flight",
    set_nether: "Allow Nether",
    set_cmd_blocks: "Command blocks",
    set_force_gm: "Force gamemode",
    set_monsters: "Spawn monsters",
    set_animals: "Spawn animals",
    set_villagers: "Spawn villagers",
    set_daily_restart: "⏰ Scheduled daily restart",
    set_daily_hint: "(UTC — clears memory leaks)",
    set_empty_off: "Empty = off",
    set_restart_apply: "Restart to apply",
    wi_intro: "Upload a <strong>.zip</strong> of your single-player world (or one downloaded from Planet Minecraft). We accept both layouts: a wrapper folder (<code>world/</code>) at root, or world internals at root (<code>level.dat</code>, <code>region/</code>).",
    wi_click: "<strong>Click to choose</strong> or drop a .zip here",
    wi_limits: "Max 500 MB · server will be stopped & restarted",
    wi_warn: "⚠ This replaces your current world. There's no undo — consider clicking \"Back up world\" first via the file manager.",
    wi_submit: "🌍 Upload & restart",
    wi_target: "Target: {name}",
    br_title: "📱 Bedrock cross-play",
    br_intro: "Bedrock Edition players (mobile / Xbox / Switch / PlayStation) need a <strong>UDP-capable tunnel</strong> to connect. One click turns it on — no signup, no extra tabs.",
    br_how: "Click <em>Enable</em> and CraftHost provisions a <code>xxx.gl.ply.gg:&lt;port&gt;</code> address, then auto-installs Geyser + Floodgate so Java and Bedrock players share the same world.",
    br_enable: "⚡ Enable Bedrock cross-play",
    set_gamemode: "Gamemode",
    set_difficulty: "Difficulty",
    set_hardcore: "Hardcore",
    set_whitelist: "Whitelist",
    disable: "Disable",
    auto_refresh: "Auto-refresh",
    gm_survival: "Survival",
    gm_creative: "Creative",
    gm_adventure: "Adventure",
    gm_spectator: "Spectator",
    diff_peaceful: "Peaceful",
    diff_easy: "Easy",
    diff_normal: "Normal",
    diff_hard: "Hard",
    auth_new_pw_hint: "Choose a strong password (8+ characters).",
    auth_missing_token: "Missing reset token in the URL. Use the link from the reset request.",
    // Create-server wizard steps 2-4
    wiz_hint_engine: "Pick an engine to continue",
    wiz_hint_version: "Pick a version to continue",
    wiz_hint_name: "Enter a server name to continue",
    wiz_custom_intro: "Upload your custom server JAR (max 500MB).",
    wiz_click_upload: "<strong>Click to upload</strong> or drag-drop your .jar file",
    wiz_jar_limits: "Max 500MB · .jar files only",
    remove: "Remove",
    wiz_choose_version: "Choose your Minecraft version.",
    wiz_loading_versions: "Loading versions from {name}…",
    wiz_heavy_title: "⚠ This version may run out of memory on the Free plan.",
    wiz_heavy_body: "Minecraft {v} needs more memory than your plan provides. Pick a lighter version to avoid OOM.",
    wiz_use_instead: "Use {v} instead (recommended)",
    wiz_showing: "Choose your Minecraft version. Showing <strong>{n}</strong> releases (newest first).",
    tag_latest: "Latest",
    tag_may_oom: "⚠ may OOM",
    tag_recommended: "✓ recommended",
    wiz_selected: "Selected:",
    wiz_bedrock: "Bedrock cross-play",
    wiz_bedrock_desc: "Let mobile / Xbox / Switch / PS players join. Bridges Bedrock players through Geyser and opens the Bedrock tunnel automatically.",
    wiz_configure: "Configure your server.",
    wiz_server_name: "Server Name",
    wiz_name_ph: "My Awesome Server",
    wiz_motd: "MOTD (Server Message)",
    on: "On",
    off: "Off",
    wiz_starter: "Starter plugins (optional)",
    wiz_starter_desc: "Pre-installed on first boot. Toggle the ones you want — you can always install more later from the Marketplace.",
    pl_desc_luckperms: "Permissions manager — set roles + privileges.",
    pl_desc_essentialsx: "Server essentials — /home /tpa /kit /spawn.",
    pl_desc_worldedit: "Terrain editor — copy, paste, fill, generate.",
    pl_desc_viaversion: "Cross-version compatibility — older clients connect.",
    pl_desc_coreprotect: "Block logging — roll back grief, audit changes.",
    pl_desc_squaremap: "Lightweight web map — view your world in a browser.",
    wiz_review: "Review and confirm.",
    plan: "Plan",
    resources: "Resources",
    region: "Region",
    price_free: "FREE",
    price_per_month: "${p}/mo",
    wiz_resources: "{ram} GB RAM · {cpu} CPU · {slots} slots",
    wiz_deploy_note: "Your server will be deployed to the <span class=\"text-emerald\">{region}</span> region. Boot time is typically 30–90 seconds.",
    // Marketplace curated picks + landing footer
    mp_pick_luckperms: "Permissions & ranks",
    mp_pick_essentialsx: "Server essentials",
    mp_pick_worldedit: "Terrain editor",
    mp_pick_worldguard: "Region protection",
    mp_pick_viaversion: "Cross-version compat",
    mp_pick_coreprotect: "Block logging",
    mp_pick_squaremap: "Lightweight web map",
    mp_pick_placeholderapi: "Dynamic placeholders",
    mp_pick_geyser: "Bedrock players → Java",
    mp_pick_floodgate: "Bedrock auth (pairs with Geyser)",
    mp_pick_skinsrestorer: "Keep skins on offline mode",
    mp_pick_multiverse_core: "Multiple worlds",
    mp_pick_discordsrv: "Discord bridge",
    mp_pick_bluemap: "3D web map",
    mp_pick_chunky: "Pre-generate chunks",
    mp_pick_spark: "Performance profiler",
    mp_pick_griefprevention: "Land claims & anti-grief",
    mp_pick_dynmap: "Live web map",
    mp_pick_multiverse_inventories: "Per-world inventories",
    mp_pick_vaultunlocked: "Economy & perms API bridge",
    mp_trending: "Trending Now",
    mp_trending_sub: "Live · most downloaded on Modrinth",
    mp_recent: "Recently Updated",
    mp_recent_sub: "Live · fresh releases on Modrinth",
    mp_signin_hint: "Want to install? Sign in and create a server first.",
    ft_copyright: "© 2026 CRAFTHOST · NOT AFFILIATED WITH MOJANG AB",
    ft_built: "BUILT IN KUWAIT",
    msg_signin_players: "Sign in to manage real players",
    msg_demo_control: "Demo mode — sign in to control real servers",
    msg_req_start: "Start requested",
    msg_req_stop: "Stop requested",
    msg_req_restart: "Restart requested",
    msg_confirm_stop: "Stop the server?",
    msg_confirm_restart: "Restart the server?",
    msg_demo_console: "Showing a demo console — sign in to control real servers.",
    msg_delete_q: "Delete {name}?",
    msg_deleted: "Deleted",
    msg_only_jar: "Only .jar files",
    msg_jar_too_large: "File too large (max 500 MB)",
    msg_uploading: "Uploading {name}…",
    msg_uploaded: "✓ Uploaded {name} ({size})",
    msg_account_created: "Account created. Redirecting…",
    msg_welcome_back: "Welcome back!",
    msg_need_current_pw: "Enter your current password to save changes",
    msg_email_user_required: "Email and username are required",
    msg_profile_updated: "Profile updated",
    msg_fill_all: "Fill in all fields",
    msg_pw_min: "New password must be 8+ characters",
    msg_pw_mismatch: "Passwords do not match",
    msg_pw_updated: "Password updated",
    msg_type_delete: "Type DELETE to confirm",
    msg_pw_required: "Password required",
    msg_account_deleted: "Account deleted",
    msg_pw_reset_done: "Password updated — sign in with your new password",
    msg_signin_create: "Sign in to create a server",
    msg_missing_fields: "Missing required fields",
    msg_deploying: "Deploying your server… ⚡",
    msg_bedrock_deferred: "Bedrock setup deferred: {err}",
    msg_demo_signin: "Demo mode — sign in to do that",
    msg_discard_q: "You have unsaved changes — discard them?",
    msg_no_changes: "No changes to save",
    msg_saved: "✓ Saved {name}",
    msg_save_failed: "Save failed: {err}",
    msg_delete_file_q: "Delete \"{name}\"? This cannot be undone.",
    msg_created: "Created {name}",
    msg_signin_backups: "Sign in for real backups",
    msg_delete_backup_q: "Delete backup {id}? This cannot be undone.",
    msg_backup_deleted: "Backup deleted",
    msg_restore_q: "Restore backup {id}?\n\n⚠ This will REPLACE the current world. The server will stop, restore, then restart.",
    msg_signin_save: "Sign in to save",
    msg_signin_backup: "Sign in to back up",
    msg_backup_created_id: "✓ Backup {id} created ({size})",
    msg_signin_upload: "Sign in to upload",
    msg_demo_files: "Showing demo files — sign in to manage your real server.",
    msg_server_deleted: "Server deleted",
    msg_healing: "🔧 Healing {name}…",
    msg_healed: "✓ {name} restarted with Paper 1.21.1",
    msg_swapping: "✓ Switching to {engine} — restarting…",
    msg_backup_created: "✓ Backup created ({size})",
    msg_world_restored: "✓ World restored",
    msg_world_restored_restart: "✓ World restored — restarting server",
    msg_delete_backup_of_q: "Delete this backup of \"{name}\"? This cannot be undone.",
    msg_now_public: "✓ \"{name}\" is now public on {addr}",
    msg_servers_retry: "Could not load your servers — retrying…",
    msg_signin_control: "Sign in to control real servers",
    msg_signin_delete: "Sign in to delete real servers",
    msg_delete_server_q: "Delete \"{name}\"? This removes the server and all its data.",
    msg_server_cloned: "✓ Server cloned",
    msg_world_imported: "✓ World imported, restarting",
    msg_choose_zip: "Please choose a .zip file",
    msg_zip_too_large: "Zip exceeds 500 MB cap",
    msg_bedrock_connected: "✓ Bedrock cross-play connected",
    msg_bedrock_enabled: "✓ Bedrock cross-play enabled",
    msg_bedrock_disabled: "Bedrock cross-play disabled",
    msg_copied: "Copied!",
    editor_saving: "Saving…",
    editor_saved: "Saved",
    editor_save_failed: "Save failed",
    editor_unsaved: "UNSAVED",
    console_exit_running: "0 (running)",
    ui_sending: "Sending…",
    ui_empty_folder: "Empty folder",
    ui_signin_backups: "Sign in to view real backups.",
    ui_backups_summary: "{n} backup(s) · {used} used · retention: {max} max",
    ui_failed: "Failed: {err}",
    ui_props_loaded: "(loaded {n} keys from server.properties)",
    ui_saving: "⏳ Saving…",
    ui_snapshotting: "⏳ Snapshotting…",
    ui_deleting: "⏳ Deleting…",
    ui_failed_load: "Failed to load: {err}",
    ui_loading: "Loading…",
    ui_apply: "Apply",
    ui_failed_fetch: "Failed to fetch",
    ui_swapping: "⏳ Swapping…",
    ui_downgrade_anyway: "⚠ Downgrade anyway",
    ui_backups_load_failed: "Could not load backups — {err}",
    ui_not_started_note: "Server hasn't been started yet — saving will create the initial config.",
    ui_png_too_large: "✗ PNG too large (max 256 KB)",
    ui_must_png: "✗ Must be a PNG",
    ui_uploading: "Uploading…",
    ui_icon_saved: "✓ Saved ({kb} KB) — restart to apply",
    ui_icon_removed: "✓ Icon removed — restart to apply",
    ui_hc_none: "You haven't created a server yet. Hit <strong>+ Create Server</strong> to spin one up.",
    ui_hc_failed: "Failed to load health check: {err}",
    ui_hc_retry: "Error · retrying in 10s",
    ui_cloning: "Cloning…",
    ui_clone_copying: "Creating server row & copying files…",
    ui_cloned: "✓ Cloned · {files} file(s), {kb} KB · {state}",
    ui_clone_starting: "starting",
    ui_clone_manual: "created (manual start)",
    ui_retry: "Retry",
    ui_world_imported: "✓ World imported ({dims}) — server restarting",
    ui_network_error: "✗ Network error",
    ui_claim_failed: "✗ Claim {status}. Click \"Connect\" to try again.",
    ui_error: "Error: {err}",
    ui_enabling: "⏳ Enabling…",
    ui_live_load_failed: "Could not load live servers ({err}).",
    ui_copied: "✓ Copied!",
    ui_server_is: "Server is {status}",
    console_clear: "Clear",
    mp_installed_title: "Installed on this server",
    mp_installed_empty: "Nothing installed yet",
    mp_remove: "Remove",
    mp_remove_confirm: "Remove {name}? Restart the server to unload it.",
    mp_removed: "Removed {name}",
    mp_install: "Install",
    mp_installing: "Installing…",
    mp_installed: "Installed",
    mp_loading: "Loading…",
    mp_no_results: "No results",
    mp_load_failed: "Failed to load ({err})",
    mp_searching: "Searching…",
    mp_search_failed: "Search failed ({err})",
    mp_search_results: "Search Results",
    mp_results_count: "{n} results · Modrinth",
    mp_compat_for: "Showing only what runs on {engine}",
    mp_need_server: "Sign in and create a server first.",
    mp_demo_toast: "Sign in and create a server to install plugins for real.",
    mp_vanilla: "Vanilla servers can't load plugins or mods. Switch the engine to Paper or Fabric first.",
    mp_installing_toast: "Installing {name}…",
    mp_installed_toast: "✓ {name} {v} installed — restart the server to load it",
    mp_modpack_done: "✓ Modpack \"{name}\": {n} mods installed",
    mp_modpack_confirm: "Install modpack \"{name}\"? It may add many mods to your server and can take a while.",
    jars_source_note: "JARs come from the official source of each engine and are cached on the server, so new servers start fast.",
  },
  ar: {
    nav_servers: "السيرفرات",
    nav_plugins: "الإضافات",
    nav_files: "الملفات",
    nav_console: "الكونسول",
    nav_settings: "الإعدادات",
    nav_jars: "مكتبة JAR",
    nav_account: "الحساب",
    sign_in: "تسجيل الدخول",
    sign_up: "إنشاء حساب",
    sign_out: "تسجيل الخروج",
    create_server: "إنشاء سيرفر",
    start: "تشغيل",
    stop: "إيقاف",
    restart: "إعادة",
    delete: "حذف",
    cancel: "إلغاء",
    save: "حفظ",
    apply: "تطبيق",
    loading: "جارٍ التحميل…",
    confirm: "تأكيد",
    back: "رجوع",
    next: "التالي",
    upload: "رفع",
    download: "تنزيل",
    edit: "تعديل",
    search: "بحث",
    install: "تثبيت",
    refresh: "تحديث",
    send: "إرسال",
    copy: "نسخ",
    close: "إغلاق",
    online: "متصل",
    offline: "متوقف",
    starting: "يبدأ التشغيل…",
    stopped: "متوقف",
    players: "اللاعبون",
    uptime: "مدة التشغيل",
    cpu: "المعالج",
    ram: "الذاكرة",
    tps: "TPS",
    address: "العنوان",
    mc_version: "إصدار اللعبة",
    host_port: "منفذ الاتصال",
    exit_code: "كود الخروج",
    msPT: "MSPT",
    hero_title: "سيرفر ماين كرافت الخاص بك.",
    hero_title_line2: "جاهز خلال ٦٠ ثانية.",
    hero_eyebrow: "متاح الآن للجميع",
    meta_engines: "٥ محركات",
    meta_versions: "١٨ إصدار",
    meta_boot: "إقلاع ٦٠ ثانية",
    meta_config: "بدون إعدادات",
    ft_tagline: "استضافة ماين كرافت مجانية تعمل ببساطة.",
    ft_status: "الحالة",
    ft_dashboard: "لوحة التحكم",
    skip_to_content: "تخطي إلى المحتوى",
    ld_hint_click: "اضغط على المكعب ⛏",
    ld_engines_eyebrow: "المحركات",
    ld_engines_title: "مكعب واحد، خمسة محركات.",
    ld_engines_sub:
      "اختر المحرك — كرافت هوست يجلب أحدث نسخة، يشغّلها ويبقيها محدّثة.",
    ld_e_plugins: "إضافات",
    ld_e_perf: "أداء أعلى",
    ld_e_vanilla: "أصلي من موجانغ",
    ld_e_mods: "مودات",
    ld_e_modded: "مود باك ثقيلة",
    ld_cross_eyebrow: "لعب مشترك",
    ld_cross_title: "Java و Bedrock. نفس العالم.",
    ld_cross_sub:
      "Geyser يعمل تلقائياً — أصدقاؤك على الجوال و Xbox و Switch و PlayStation يدخلون نفس السيرفر مع لاعبي الكمبيوتر.",
    ld_cross_java: "نسخة Java",
    ld_cross_java_d: "كمبيوتر — إضافات ومودات وتحكم كامل",
    ld_cross_bed: "نسخة Bedrock",
    ld_cross_bed_d: "جوال، Xbox، Switch، PS — بدون أي إعداد",
    ld_deploy_eyebrow: "النشر",
    ld_deploy_title: "جاهز بأمر واحد.",
    ld_deploy_sub:
      "الكونسول ومدير الملفات وسوق الإضافات والنسخ الاحتياطي كلها جاهزة لحظة تشغيل السيرفر.",
    ld_cta_title: "ضع مكعبك.",
    ld_cta_sub: "مجاني للأبد. بدون بطاقة وبدون انتظار — سيرفرك على بعد ضغطة.",
    hero_sub:
      "انشر سيرفرات فانيلا أو مودات أو JAR مخصص بضغطة. أجهزة حقيقية، بدون اختناقات، حماية من DDoS.",
    hero_sub_free:
      "انشر سيرفرات ماين كرافت — فانيلا أو مودات أو JAR مخصص — بضغطة واحدة. مجاناً تماماً.",
    hero_cta_trial: "ابدأ تجربة مجانية ٧ أيام ←",
    hero_cta_plans: "عرض الخطط",
    hero_cta_deploy: "انشر سيرفري ←",
    join_discord: "انضم للديسكورد",
    hero_cta_pricing: "عرض الأسعار",
    landing_systems_ok: "كل الأنظمة تعمل · جاهزية ٩٩.٩٨٪",
    landing_stats_servers: "سيرفرات تعمل الآن",
    landing_stats_players: "لاعبون متصلون",
    landing_stats_tps: "متوسط TPS",
    landing_stats_host: "عنوان الانضمام العام",
    landing_live_badge: "🟢 يعمل الآن",
    landing_live_title: "سيرفرات حقيقية، لاعبون حقيقيون",
    landing_live_sub:
      "كل كرت بالأسفل هو سيرفر ماين كرافت فعلي يعمل على CraftHost. اضغط نسخ وألصقه في عميل اللعبة.",
    landing_features_badge: "المميزات",
    landing_features_title: "كل ما تحتاجه لإدارة مجتمع ناجح.",
    landing_features_sub: "مبني على أجهزة فعلية. مضبوط لأداء MSPT منخفض.",
    landing_pricing_badge: "الخطط",
    landing_pricing_title: "خطط تنمو مع مجتمعك.",
    landing_faq_badge: "الأسئلة الشائعة",
    landing_faq_title: "أسئلة شائعة وإجابات مباشرة.",
    welcome_back: "مرحباً بعودتك",
    your_servers: "سيرفراتك",
    manage_sub: "أدر سيرفرات ماين كرافت والإضافات والعوالم.",
    stat_active: "سيرفراتك",
    stat_players_online: "اللاعبون المتصلون",
    stat_avg_tps: "متوسط TPS",
    stat_plan: "الخطة",
    health_check: "فحص الحالة",
    auth_email: "البريد الإلكتروني",
    auth_password: "كلمة المرور",
    auth_username: "اسم المستخدم",
    auth_signin_title: "مرحباً بعودتك",
    auth_signin_sub: "سجّل دخولك إلى حساب CraftHost",
    auth_signup_title: "أنشئ حسابك",
    auth_signup_sub: "ابدأ الاستضافة خلال ٦٠ ثانية",
    auth_forgot: "نسيت كلمة المرور؟",
    auth_no_account: "لا تملك حساباً؟",
    auth_have_account: "تملك حساباً بالفعل؟",
    auth_remember: "إبقني مسجلاً ٣٠ يوماً",
    auth_reset_title: "إعادة تعيين كلمة المرور",
    market_title: "الإضافات والمودات",
    market_sub:
      "أكثر من ٢٠٠ ألف من Modrinth و CurseForge. تثبيت بضغطة على سيرفرك.",
    market_featured: "🔥 مودباكس مميزة",
    market_featured_sub: "مباشرة من Modrinth",
    market_top_picks: "أفضل الإضافات · تثبيت بضغطة",
    market_top_sub: "مختارة من CraftHost · paper/spigot/purpur",
    market_all: "كل الإضافات والمودات",
    quick_deploy: "⚡ نشر سريع",
    quick_deploy_sub:
      "اضغط على أي قالب لتشغيل سيرفر جاهز خلال ثوانٍ — بدون معالج.",
    qd_survival: "البقاء",
    qd_creative: "الإبداع",
    qd_skyblock: "سكاي بلوك",
    qd_modded: "مودات",
    market_search_ph: "ابحث في أكثر من ٢٠٠ ألف إضافة ومود...",
    market_load_more: "تحميل المزيد ←",
    files_title: "مدير الملفات",
    files_sub: "تصفّح وعدّل وارفع وحمّل الملفات داخل سيرفرك.",
    files_new_folder: "مجلد جديد",
    files_upload_btn: "رفع",
    files_settings_tab: "الإعدادات",
    files_backups_tab: "النسخ الاحتياطية",
    files_files_tab: "الملفات",
    console_title: "الكونسول المباشر",
    console_send_ph: "اكتب أمراً واضغط Enter...",
    billing_title: "الفواتير والخطة",
    billing_balance: "الرصيد",
    billing_plan: "الخطة الحالية",
    billing_invoices: "الفواتير",
    settings_title: "إعدادات الحساب",
    settings_change_password: "تغيير كلمة المرور",
    settings_delete_account: "حذف الحساب",
    jars_title: "مكتبة JAR",
    jars_sub: "ملفات JAR المخصصة وأحدث الإصدارات الرسمية.",
    footer_credit: "برمجة",
    free_plan: "مجاني",
    upgrade: "ترقية",
    nav_features: "المميزات",
    nav_pricing: "الأسعار",
    nav_faq: "الأسئلة الشائعة",
    get_started: "ابدأ الآن",
    open_dashboard: "لوحة التحكم",
    home: "الرئيسية",
    pricing_title: "أسعار بسيطة وواضحة.",
    pricing_sub:
      "كل الخطط تتضمن حماية DDoS ونسخاً احتياطية تلقائية وتخزين NVMe ودعماً ٢٤/٧.",
    start_free: "ابدأ مجاناً",
    choose: "اختر",
    popular: "الأكثر شعبية",
    feature: "الميزة",
    cpu_cores: "أنوية المعالج",
    nvme: "تخزين NVMe",
    player_slots: "عدد اللاعبين",
    plugin_slots: "عدد الإضافات",
    backup_retention: "مدة حفظ النسخ",
    backup_interval: "تكرار النسخ",
    custom_jar: "رفع JAR مخصص",
    dedicated_ip: "IP مخصص",
    priority_support: "دعم ذو أولوية",
    ddos: "حماية DDoS",
    bedrock_java: "Bedrock و Java",
    status_title: "حالة النظام",
    status_sub: "صحة المنصة في الوقت الفعلي. يتم التحديث تلقائيًا كل 30 ثانية.",
    status_users: "المستخدمون",
    status_running_now: "يعمل الآن",
    settings_profile: "الملف الشخصي",
    settings_current_pw: "كلمة المرور الحالية (مطلوبة للحفظ)",
    save_changes: "حفظ التغييرات",
    stop_server: "إيقاف السيرفر",
    start_server: "تشغيل السيرفر",
    menu_view_logs: "عرض السجلات",
    menu_change_jar: "تغيير JAR",
    menu_copy_address: "نسخ العنوان",
    menu_bedrock_on: "لعب Bedrock المشترك (مفعّل)",
    menu_bedrock_enable: "تفعيل لعب Bedrock المشترك",
    menu_make_public: "جعله عامًا",
    menu_clone: "استنساخ السيرفر",
    menu_import_world: "استيراد world.zip",
    menu_backups: "النسخ الاحتياطية",
    menu_launcher: "قائمة المشغّل (.bat)",
    menu_delete: "حذف السيرفر",
    details: "التفاصيل",
    bedrock_devices: "جوال / كونسول",
    bedrock_diff_note: "لـ Bedrock عنوان خاص به — وهو ليس نفس عنوان Java. أدخل العنوان والمنفذ (port) تمامًا كما هو معروض.",
    bedrock_addr_label: "Bedrock (جوال / Xbox / Switch / PS)",
    java_addr_label: "لاعبو Java يستمرون على",
    enable_arrow: "تفعيل ←",
    files_new_file: "ملف جديد",
    jars_official: "الأنواع الرسمية",
    jars_custom: "ملفات JAR الخاصة بي",
    wiz_deploy: "نشر السيرفر",
    // Auth recovery + settings pages
    auth_reset_sub: "أدخل بريد حسابك وسنجهّز لك رابط إعادة التعيين.",
    auth_send_reset: "إرسال رابط إعادة التعيين ←",
    auth_back_to: "العودة إلى",
    auth_reset_requested: "تم طلب إعادة التعيين",
    auth_reset_requested_sub: "إذا كان هناك حساب بهذا البريد فرابط إعادة التعيين جاهز. راسلنا على ديسكورد وسنرسله لك بعد تحقق سريع.",
    auth_open_discord: "افتح ديسكورد ←",
    auth_new_pw_title: "تعيين كلمة مرور جديدة",
    label_new_password: "كلمة المرور الجديدة",
    label_confirm_password: "تأكيد كلمة المرور",
    auth_remembered: "تذكّرتها؟",
    settings_sub: "إدارة حسابك وأمانه.",
    settings_security: "الأمان",
    btn_change: "تغيير",
    settings_role: "دور الحساب",
    settings_created: "تاريخ إنشاء الحساب",
    settings_danger: "منطقة الخطر",
    settings_delete_desc: "يحذف حسابك وجميع خوادمك ونسخك الاحتياطية نهائياً. لا يمكن التراجع عن ذلك.",
    label_current_password: "كلمة المرور الحالية",
    label_confirm_new_password: "تأكيد كلمة المرور الجديدة",
    btn_update_password: "تحديث كلمة المرور",
    settings_role_admin: "مسؤول — صلاحيات كاملة على المنصة",
    settings_role_user: "حساب مستخدم عادي",
    settings_created_unknown: "يظهر بعد تسجيل الدخول القادم",
    settings_pw_desc: "غيّر كلمة المرور بانتظام.",
    // Dashboard summary + cards
    dash_n_online: "{n} متصل",
    dash_no_running: "لا توجد سيرفرات تعمل",
    dash_tps_target: "الهدف 20.0",
    dash_n_server: "{n} سيرفر",
    dash_n_servers: "{n} سيرفرات",
    dash_across_all: "على كل السيرفرات",
    dash_volume: "مساحة 10 GB · على مدار الساعة",
    dash_public: "🌍 عام",
    dash_java_after_start: "يظهر العنوان بعد الضغط على ▶ تشغيل",
    tpl_build: "بناء",
    tpl_island: "جزيرة",
    tpl_mods: "مودات",
    dash_internal: "🔒 داخلي",
    dash_visitor: "زائر",
    dash_demo_toast: "هذه سيرفرات تجريبية — سجّل الدخول لإدارة سيرفراتك.",
    // Status page
    status_api: "الواجهة الخلفية (API)",
    status_jvm: "متحكم JVM",
    status_jvm_desc: "مشغّل سيرفرات ماين كرافت",
    status_tunnel: "النفق العام",
    status_checking: "جارٍ الفحص…",
    status_loading: "جارٍ التحميل…",
    status_activity: "آخر 24 ساعة · النشاط",
    status_last_checked: "آخر فحص:",
    status_no_activity: "لا يوجد نشاط خلال آخر 24 ساعة",
    status_all_ok: "جميع الأنظمة تعمل",
    status_degraded: "أداء متراجع",
    status_operational: "يعمل",
    status_unavailable: "غير متاح",
    status_local: "مُعدّ محلياً",
    status_unreachable: "تعذّر الوصول إلى الخادم",
    status_error: "خطأ:",
    // Engines, JAR library, console, files
    engine_desc_paper: "سيرفر إضافات عالي الأداء. الخيار الأنسب لمعظم الحالات.",
    engine_desc_vanilla: "ماين كرافت الأصلية من Mojang. بدون مودات أو إضافات.",
    engine_desc_purpur: "نسخة من Paper قابلة للتخصيص مع ميزات إضافية.",
    engine_desc_fabric: "واجهة مودات خفيفة. ممتازة لمودات اللاعبين.",
    engine_desc_neoforge: "نسخة حديثة من Forge بتحديثات أسرع.",
    engine_desc_spigot: "سيرفر الإضافات الكلاسيكي.",
    jars_upload: "⬆ رفع JAR مخصص",
    jars_upload_short: "⬆ رفع",
    jars_live_api: "مباشرة من الواجهة الرسمية",
    jars_deploy_with: "انشر باستخدام {name}",
    jars_latest: "الأحدث: {v}",
    jars_no_versions: "لا توجد إصدارات متاحة",
    console_no_players: "لا يوجد لاعبون متصلون",
    console_auto: "⤓ تلقائي",
    files_root: "/ (الجذر)",
    ago_s: "قبل {n} ث",
    ago_m: "قبل {n} د",
    ago_h: "قبل {n} س",
    console_tps_target: "TPS (الهدف 20.0)",
    console_mc_version: "إصدار ماين كرافت",
    console_host_port: "منفذ المضيف",
    console_exit_code: "رمز الخروج",
    // Dashboard modals + wizard
    refresh_btn: "↻ تحديث",
    logs_last_lines: "آخر 200 سطر · تحديث تلقائي",
    bk_none: "لا توجد نسخ احتياطية بعد. خذ نسخة قبل أي تغيير كبير!",
    bk_includes: "تشمل النسخ عوالمك وبيانات الإضافات والمودات وملف server.properties وقوائم اللاعبين.",
    bk_now: "📸 انسخ الآن",
    bk_working: "⏳ جارٍ العمل…",
    swap_type: "نوع السيرفر",
    swap_version: "الإصدار (آخر 10)",
    swap_note: "⚠ سيتوقف السيرفر ويُنزّل JAR الجديد (~30 ث) ثم يعيد التشغيل تلقائياً. بيانات عالمك محفوظة.",
    del_about: "أنت على وشك الحذف النهائي لـ:",
    del_warn: "سيؤدي هذا إلى إيقاف JVM وحذف بيانات العالم وتحرير النفق العام ومسح كل النسخ الاحتياطية. لا يمكن التراجع.",
    del_type_name: "اكتب اسم السيرفر للتأكيد",
    del_forever: "حذف نهائي",
    hc_n_healthy: "✓ {n} سليم",
    hc_n_warn: "! {n} تحذيرات",
    hc_n_error: "✗ {n} أخطاء",
    hc_no_servers: "لا توجد سيرفرات بعد",
    hc_needs_attention: "يحتاج إلى انتباه",
    hc_has_warnings: "توجد تحذيرات",
    hc_healthy: "سليم",
    hc_offline: "السيرفر متوقف · لا توجد إحصاءات مباشرة",
    hc_polling: "فحص كل 10 ث · آخر تحديث: {t}",
    clone_desc: "ينشئ سيرفراً جديداً بنفس النوع والإصدار والخطة والعالم والإضافات.",
    clone_name: "اسم السيرفر الجديد",
    clone_world: "نسخ العالم (الحفظ والتضاريس)",
    clone_plugins: "نسخ مجلد الإضافات",
    clone_now: "📑 انسخ الآن",
    wiz_step_type: "النوع",
    wiz_step_version: "الإصدار",
    wiz_step_configure: "الإعداد",
    wiz_step_review: "المراجعة",
    wiz_pick_engine: "اختر المحرك الذي يشغّل عالمك.",
    engine_desc_custom: "ارفع ملف ‎.jar الخاص بك (حتى 500MB).",
    // Server settings, world import, Bedrock modals (some values carry trusted markup)
    set_no_icon: "لا توجد أيقونة",
    set_icon: "أيقونة السيرفر",
    set_icon_hint: "يُفضّل PNG بحجم 64×64. تظهر للاعبين في قائمة السيرفرات.",
    set_choose_png: "📁 اختر PNG",
    set_motd_hint: "(استخدم رموز الألوان &X)",
    set_motd_preview: "تظهر المعاينة هنا",
    set_max_players: "الحد الأقصى للاعبين",
    set_view_distance: "مسافة الرؤية",
    set_sim_distance: "مسافة المحاكاة",
    set_spawn_protection: "حماية نقطة الظهور",
    set_blocks_hint: "(بالكتل، 0 = إيقاف)",
    set_pvp: "تفعيل القتال بين اللاعبين",
    set_flight: "السماح بالطيران",
    set_nether: "السماح بالنذر",
    set_cmd_blocks: "كتل الأوامر",
    set_force_gm: "فرض نمط اللعب",
    set_monsters: "ظهور الوحوش",
    set_animals: "ظهور الحيوانات",
    set_villagers: "ظهور القرويين",
    set_daily_restart: "⏰ إعادة تشغيل يومية مجدولة",
    set_daily_hint: "(بتوقيت UTC — يحرّر الذاكرة)",
    set_empty_off: "فارغ = إيقاف",
    set_restart_apply: "إعادة التشغيل للتطبيق",
    wi_intro: "ارفع ملف <strong>.zip</strong> لعالمك الفردي (أو عالم من Planet Minecraft). نقبل الشكلين: مجلد (<code>world/</code>) في الجذر، أو محتويات العالم مباشرة في الجذر (<code>level.dat</code>، <code>region/</code>).",
    wi_click: "<strong>اضغط للاختيار</strong> أو أفلت ملف .zip هنا",
    wi_limits: "الحد 500 MB · سيتوقف السيرفر ثم يعيد التشغيل",
    wi_warn: "⚠ سيستبدل هذا عالمك الحالي ولا يمكن التراجع — يُفضّل أخذ نسخة من العالم أولاً عبر مدير الملفات.",
    wi_submit: "🌍 رفع وإعادة تشغيل",
    wi_target: "الهدف: {name}",
    br_title: "📱 اللعب المشترك مع Bedrock",
    br_intro: "يحتاج لاعبو Bedrock (الجوال / Xbox / Switch / PlayStation) إلى <strong>نفق يدعم UDP</strong> للاتصال. ضغطة واحدة تفعّله — بدون تسجيل أو خطوات إضافية.",
    br_how: "اضغط <em>تفعيل</em> وسيجهّز CraftHost عنواناً بصيغة <code>xxx.gl.ply.gg:&lt;port&gt;</code> ثم يثبّت Geyser و Floodgate تلقائياً ليلعب لاعبو Java و Bedrock في العالم نفسه.",
    br_enable: "⚡ تفعيل اللعب المشترك مع Bedrock",
    set_gamemode: "نمط اللعب",
    set_difficulty: "الصعوبة",
    set_hardcore: "هاردكور",
    set_whitelist: "القائمة البيضاء",
    disable: "تعطيل",
    auto_refresh: "تحديث تلقائي",
    gm_survival: "البقاء",
    gm_creative: "الإبداع",
    gm_adventure: "المغامرة",
    gm_spectator: "المشاهدة",
    diff_peaceful: "سلمي",
    diff_easy: "سهل",
    diff_normal: "عادي",
    diff_hard: "صعب",
    auth_new_pw_hint: "اختر كلمة مرور قوية (8 أحرف أو أكثر).",
    auth_missing_token: "رمز إعادة التعيين غير موجود في الرابط. استخدم الرابط الذي وصلك من طلب الاستعادة.",
    // Create-server wizard steps 2-4
    wiz_hint_engine: "اختر محركاً للمتابعة",
    wiz_hint_version: "اختر إصداراً للمتابعة",
    wiz_hint_name: "أدخل اسم السيرفر للمتابعة",
    wiz_custom_intro: "ارفع ملف JAR الخاص بسيرفرك (حتى 500MB).",
    wiz_click_upload: "<strong>اضغط للرفع</strong> أو اسحب ملف ‎.jar وأفلته هنا",
    wiz_jar_limits: "الحد 500MB · ملفات ‎.jar فقط",
    remove: "إزالة",
    wiz_choose_version: "اختر إصدار ماين كرافت.",
    wiz_loading_versions: "جارٍ تحميل إصدارات {name}…",
    wiz_heavy_title: "⚠ قد تنفد ذاكرة هذا الإصدار على الخطة المجانية.",
    wiz_heavy_body: "يحتاج Minecraft {v} ذاكرة أكثر مما توفره خطتك. اختر إصداراً أخف لتجنّب نفاد الذاكرة.",
    wiz_use_instead: "استخدم {v} بدلاً منه (مُستحسن)",
    wiz_showing: "اختر إصدار ماين كرافت. يتم عرض <strong>{n}</strong> إصداراً (الأحدث أولاً).",
    tag_latest: "الأحدث",
    tag_may_oom: "⚠ قد تنفد الذاكرة",
    tag_recommended: "✓ مُستحسن",
    wiz_selected: "المحدد:",
    wiz_bedrock: "اللعب المشترك مع Bedrock",
    wiz_bedrock_desc: "يتيح للاعبي الجوال وXbox وSwitch وPS الانضمام. يربط لاعبي Bedrock عبر Geyser ويفتح نفق Bedrock تلقائياً.",
    wiz_configure: "اضبط إعدادات سيرفرك.",
    wiz_server_name: "اسم السيرفر",
    wiz_name_ph: "سيرفري الرائع",
    wiz_motd: "رسالة السيرفر (MOTD)",
    on: "تشغيل",
    off: "إيقاف",
    wiz_starter: "إضافات البداية (اختياري)",
    wiz_starter_desc: "تُثبَّت عند أول تشغيل. فعّل ما تريد — ويمكنك تثبيت المزيد لاحقاً من المتجر.",
    pl_desc_luckperms: "مدير الصلاحيات — حدّد الأدوار والامتيازات.",
    pl_desc_essentialsx: "أساسيات السيرفر — /home /tpa /kit /spawn.",
    pl_desc_worldedit: "محرر التضاريس — نسخ، لصق، تعبئة، توليد.",
    pl_desc_viaversion: "توافق بين الإصدارات — تتصل الإصدارات الأقدم.",
    pl_desc_coreprotect: "تسجيل الكتل — تراجع عن التخريب وراجع التغييرات.",
    pl_desc_squaremap: "خريطة ويب خفيفة — شاهد عالمك في المتصفح.",
    wiz_review: "راجع وأكّد.",
    plan: "الخطة",
    resources: "الموارد",
    region: "المنطقة",
    price_free: "مجاني",
    price_per_month: "${p}/شهرياً",
    wiz_resources: "{ram} GB RAM · {cpu} CPU · {slots} خانة",
    wiz_deploy_note: "سيُنشر سيرفرك في منطقة <span class=\"text-emerald\">{region}</span>. يستغرق الإقلاع عادةً من 30 إلى 90 ثانية.",
    // Marketplace curated picks + landing footer
    mp_pick_luckperms: "الصلاحيات والرتب",
    mp_pick_essentialsx: "أساسيات السيرفر",
    mp_pick_worldedit: "محرر التضاريس",
    mp_pick_worldguard: "حماية المناطق",
    mp_pick_viaversion: "توافق الإصدارات",
    mp_pick_coreprotect: "تسجيل الكتل",
    mp_pick_squaremap: "خريطة ويب خفيفة",
    mp_pick_placeholderapi: "متغيرات ديناميكية",
    mp_pick_geyser: "لاعبو Bedrock إلى Java",
    mp_pick_floodgate: "دخول Bedrock (مع Geyser)",
    mp_pick_skinsrestorer: "الاحتفاظ بالسكنات في الوضع غير المتصل",
    mp_pick_multiverse_core: "عوالم متعددة",
    mp_pick_discordsrv: "ربط مع ديسكورد",
    mp_pick_bluemap: "خريطة ويب ثلاثية الأبعاد",
    mp_pick_chunky: "توليد الخرائط مسبقاً",
    mp_pick_spark: "محلل الأداء",
    mp_pick_griefprevention: "حجز الأراضي ومنع التخريب",
    mp_pick_dynmap: "خريطة ويب مباشرة",
    mp_pick_multiverse_inventories: "حقائب منفصلة لكل عالم",
    mp_pick_vaultunlocked: "جسر الاقتصاد والصلاحيات",
    mp_trending: "الأكثر رواجاً",
    mp_trending_sub: "مباشر · الأكثر تحميلاً على Modrinth",
    mp_recent: "المحدَّثة مؤخراً",
    mp_recent_sub: "مباشر · أحدث الإصدارات على Modrinth",
    mp_signin_hint: "تريد التثبيت؟ سجّل الدخول وأنشئ سيرفراً أولاً.",
    ft_copyright: "© 2026 CRAFTHOST · غير تابع لشركة MOJANG AB",
    ft_built: "صُنع في الكويت",
    msg_signin_players: "سجّل الدخول لإدارة اللاعبين الحقيقيين",
    msg_demo_control: "وضع العرض — سجّل الدخول للتحكم بسيرفرات حقيقية",
    msg_req_start: "تم طلب التشغيل",
    msg_req_stop: "تم طلب الإيقاف",
    msg_req_restart: "تم طلب إعادة التشغيل",
    msg_confirm_stop: "إيقاف السيرفر؟",
    msg_confirm_restart: "إعادة تشغيل السيرفر؟",
    msg_demo_console: "هذه وحدة تحكم تجريبية — سجّل الدخول للتحكم بسيرفراتك الحقيقية.",
    msg_delete_q: "حذف {name}؟",
    msg_deleted: "تم الحذف",
    msg_only_jar: "ملفات ‎.jar فقط",
    msg_jar_too_large: "الملف كبير جداً (الحد 500 MB)",
    msg_uploading: "جارٍ رفع {name}…",
    msg_uploaded: "✓ تم رفع {name} ({size})",
    msg_account_created: "تم إنشاء الحساب. جارٍ التحويل…",
    msg_welcome_back: "أهلاً بعودتك!",
    msg_need_current_pw: "أدخل كلمة المرور الحالية لحفظ التغييرات",
    msg_email_user_required: "البريد الإلكتروني واسم المستخدم مطلوبان",
    msg_profile_updated: "تم تحديث الملف الشخصي",
    msg_fill_all: "املأ جميع الحقول",
    msg_pw_min: "يجب أن تتكون كلمة المرور الجديدة من 8 أحرف على الأقل",
    msg_pw_mismatch: "كلمتا المرور غير متطابقتين",
    msg_pw_updated: "تم تحديث كلمة المرور",
    msg_type_delete: "اكتب DELETE للتأكيد",
    msg_pw_required: "كلمة المرور مطلوبة",
    msg_account_deleted: "تم حذف الحساب",
    msg_pw_reset_done: "تم تحديث كلمة المرور — سجّل الدخول بكلمة المرور الجديدة",
    msg_signin_create: "سجّل الدخول لإنشاء سيرفر",
    msg_missing_fields: "حقول مطلوبة ناقصة",
    msg_deploying: "جارٍ نشر سيرفرك… ⚡",
    msg_bedrock_deferred: "تأجّل إعداد Bedrock: {err}",
    msg_demo_signin: "وضع العرض — سجّل الدخول لتنفيذ ذلك",
    msg_discard_q: "لديك تغييرات غير محفوظة — تجاهلها؟",
    msg_no_changes: "لا توجد تغييرات لحفظها",
    msg_saved: "✓ تم حفظ {name}",
    msg_save_failed: "فشل الحفظ: {err}",
    msg_delete_file_q: "حذف \"{name}\"؟ لا يمكن التراجع.",
    msg_created: "تم إنشاء {name}",
    msg_signin_backups: "سجّل الدخول لنسخ احتياطية حقيقية",
    msg_delete_backup_q: "حذف النسخة {id}؟ لا يمكن التراجع.",
    msg_backup_deleted: "تم حذف النسخة الاحتياطية",
    msg_restore_q: "استعادة النسخة {id}؟\n\n⚠ سيستبدل هذا العالم الحالي. سيتوقف السيرفر ثم يستعيد النسخة ثم يعيد التشغيل.",
    msg_signin_save: "سجّل الدخول للحفظ",
    msg_signin_backup: "سجّل الدخول لأخذ نسخة احتياطية",
    msg_backup_created_id: "✓ تم إنشاء النسخة {id} ({size})",
    msg_signin_upload: "سجّل الدخول للرفع",
    msg_demo_files: "هذه ملفات تجريبية — سجّل الدخول لإدارة سيرفرك الحقيقي.",
    msg_server_deleted: "تم حذف السيرفر",
    msg_healing: "🔧 جارٍ إصلاح {name}…",
    msg_healed: "✓ أُعيد تشغيل {name} على Paper 1.21.1",
    msg_swapping: "✓ جارٍ التبديل إلى {engine} — إعادة التشغيل…",
    msg_backup_created: "✓ تم إنشاء النسخة الاحتياطية ({size})",
    msg_world_restored: "✓ تمت استعادة العالم",
    msg_world_restored_restart: "✓ تمت استعادة العالم — جارٍ إعادة تشغيل السيرفر",
    msg_delete_backup_of_q: "حذف هذه النسخة من \"{name}\"؟ لا يمكن التراجع.",
    msg_now_public: "✓ \"{name}\" أصبح عاماً على {addr}",
    msg_servers_retry: "تعذّر تحميل سيرفراتك — جارٍ إعادة المحاولة…",
    msg_signin_control: "سجّل الدخول للتحكم بسيرفرات حقيقية",
    msg_signin_delete: "سجّل الدخول لحذف سيرفرات حقيقية",
    msg_delete_server_q: "حذف \"{name}\"؟ سيؤدي هذا إلى إزالة السيرفر وجميع بياناته.",
    msg_server_cloned: "✓ تم نسخ السيرفر",
    msg_world_imported: "✓ تم استيراد العالم، جارٍ إعادة التشغيل",
    msg_choose_zip: "اختر ملف ‎.zip",
    msg_zip_too_large: "حجم الملف يتجاوز 500 MB",
    msg_bedrock_connected: "✓ تم ربط اللعب المشترك مع Bedrock",
    msg_bedrock_enabled: "✓ تم تفعيل اللعب المشترك مع Bedrock",
    msg_bedrock_disabled: "تم تعطيل اللعب المشترك مع Bedrock",
    msg_copied: "تم النسخ!",
    editor_saving: "جارٍ الحفظ…",
    editor_saved: "تم الحفظ",
    editor_save_failed: "فشل الحفظ",
    editor_unsaved: "غير محفوظ",
    console_exit_running: "0 (يعمل)",
    ui_sending: "جارٍ الإرسال…",
    ui_empty_folder: "مجلد فارغ",
    ui_signin_backups: "سجّل الدخول لعرض النسخ الاحتياطية الحقيقية.",
    ui_backups_summary: "{n} نسخة · {used} مستخدمة · الحد الأقصى: {max}",
    ui_failed: "فشل: {err}",
    ui_props_loaded: "(تم تحميل {n} إعداداً من server.properties)",
    ui_saving: "⏳ جارٍ الحفظ…",
    ui_snapshotting: "⏳ جارٍ أخذ النسخة…",
    ui_deleting: "⏳ جارٍ الحذف…",
    ui_failed_load: "تعذّر التحميل: {err}",
    ui_loading: "جارٍ التحميل…",
    ui_apply: "تطبيق",
    ui_failed_fetch: "تعذّر الجلب",
    ui_swapping: "⏳ جارٍ التبديل…",
    ui_downgrade_anyway: "⚠ خفّض الإصدار على أي حال",
    ui_backups_load_failed: "تعذّر تحميل النسخ الاحتياطية — {err}",
    ui_not_started_note: "لم يُشغَّل السيرفر بعد — الحفظ سينشئ الإعدادات الأولية.",
    ui_png_too_large: "✗ ملف PNG كبير جداً (الحد 256 KB)",
    ui_must_png: "✗ يجب أن يكون ملف PNG",
    ui_uploading: "جارٍ الرفع…",
    ui_icon_saved: "✓ تم الحفظ ({kb} KB) — أعد التشغيل للتطبيق",
    ui_icon_removed: "✓ تمت إزالة الأيقونة — أعد التشغيل للتطبيق",
    ui_hc_none: "لم تنشئ سيرفراً بعد. اضغط <strong>+ إنشاء سيرفر</strong> لتشغيل واحد.",
    ui_hc_failed: "تعذّر تحميل فحص الحالة: {err}",
    ui_hc_retry: "خطأ · إعادة المحاولة خلال 10 ث",
    ui_cloning: "جارٍ النسخ…",
    ui_clone_copying: "جارٍ إنشاء السيرفر ونسخ الملفات…",
    ui_cloned: "✓ تم النسخ · {files} ملف، {kb} KB · {state}",
    ui_clone_starting: "قيد التشغيل",
    ui_clone_manual: "أُنشئ (تشغيل يدوي)",
    ui_retry: "إعادة المحاولة",
    ui_world_imported: "✓ تم استيراد العالم ({dims}) — جارٍ إعادة تشغيل السيرفر",
    ui_network_error: "✗ خطأ في الشبكة",
    ui_claim_failed: "✗ الربط {status}. اضغط \"اتصال\" للمحاولة مجدداً.",
    ui_error: "خطأ: {err}",
    ui_enabling: "⏳ جارٍ التفعيل…",
    ui_live_load_failed: "تعذّر تحميل السيرفرات المباشرة ({err}).",
    ui_copied: "✓ تم النسخ!",
    ui_server_is: "حالة السيرفر: {status}",
    console_clear: "مسح",
    mp_installed_title: "المثبّت على هذا السيرفر",
    mp_installed_empty: "لا يوجد شيء مثبّت بعد",
    mp_remove: "إزالة",
    mp_remove_confirm: "إزالة {name}؟ أعد تشغيل السيرفر لإلغاء تحميلها.",
    mp_removed: "تمت إزالة {name}",
    mp_install: "تثبيت",
    mp_installing: "جارٍ التثبيت…",
    mp_installed: "تم التثبيت",
    mp_loading: "جارٍ التحميل…",
    mp_no_results: "لا توجد نتائج",
    mp_load_failed: "تعذّر التحميل ({err})",
    mp_searching: "جارٍ البحث…",
    mp_search_failed: "فشل البحث ({err})",
    mp_search_results: "نتائج البحث",
    mp_results_count: "{n} نتيجة · Modrinth",
    mp_compat_for: "يُعرض فقط ما يعمل على {engine}",
    mp_need_server: "سجّل الدخول وأنشئ سيرفراً أولاً.",
    mp_demo_toast: "سجّل الدخول وأنشئ سيرفراً لتثبيت الإضافات فعلياً.",
    mp_vanilla: "سيرفرات Vanilla لا تدعم الإضافات أو المودات. غيّر المحرك إلى Paper أو Fabric أولاً.",
    mp_installing_toast: "جارٍ تثبيت {name}…",
    mp_installed_toast: "✓ تم تثبيت {name} {v} — أعد تشغيل السيرفر لتفعيله",
    mp_modpack_done: "✓ حزمة المودات \"{name}\": تم تثبيت {n} مود",
    mp_modpack_confirm: "تثبيت حزمة المودات \"{name}\"؟ قد تضيف مودات كثيرة إلى سيرفرك وتستغرق بعض الوقت.",
    jars_source_note: "تُجلب ملفات JAR من المصدر الرسمي لكل محرك وتُخزَّن مؤقتاً على الخادم، فتبدأ السيرفرات الجديدة بسرعة.",
  },
};
window.t = (key) => {
  const lang = localStorage.getItem("crafthost.lang") || "en";
  return (
    (window.I18N[lang] && window.I18N[lang][key]) || window.I18N.en[key] || key
  );
};
// t() with {placeholder} substitution: tf("mp_results_count", { n: 5 }).
window.tf = (key, vars = {}) =>
  Object.entries(vars).reduce((str, [k, v]) => str.split(`{${k}}`).join(String(v)), window.t(key));
// t() with a fallback for keys that may not exist (t() returns the key itself).
window.tOr = (key, fallback) => (window.I18N.en[key] ? window.t(key) : fallback);
// Modals, cards and menus are inserted after applyLang ran, so their
// data-i18n nodes would stay English. Translate anything with data-i18n as it
// is added. Only text nodes change, which this observer ignores (no loops).
// Tooltips (title="…") are English in the markup and templates; in Arabic
// mode they are swapped from this table. The English original is kept in
// data-title-en so switching back restores it. Icon-only buttons rely on
// these as their accessible name, so they matter beyond hover text.
window.TITLE_AR = {
  "Aggregate health of all your servers": "الحالة العامة لجميع سيرفراتك",
  "Bedrock Edition (mobile / console) · click to copy": "إصدار Bedrock (جوال / كونسول) · اضغط للنسخ",
  "Bedrock cross-play is on — waiting for tunnel address": "اللعب المشترك مع Bedrock مفعّل — بانتظار عنوان النفق",
  "Click for actions": "اضغط للإجراءات",
  "Delete": "حذف",
  "Delete backup": "حذف النسخة الاحتياطية",
  "Disconnected": "غير متصل",
  "Download": "تنزيل",
  "Download as .zip": "تنزيل كملف zip",
  "Download log": "تنزيل السجل",
  "Download zip": "تنزيل zip",
  "Edit": "تعديل",
  "Enable Bedrock cross-play — mobile / Xbox / Switch / PS players": "تفعيل اللعب المشترك مع Bedrock — لاعبو الجوال و Xbox و Switch و PS",
  "Internal only — promote to play": "داخلي فقط — اجعله عاماً للعب",
  "Java Edition · click to copy": "إصدار Java · اضغط للنسخ",
  "More actions": "إجراءات أخرى",
  "New File": "ملف جديد",
  "New Folder": "مجلد جديد",
  "Open console": "فتح الكونسول",
  "Reachable from Minecraft clients": "متاح للاعبي ماين كرافت",
  "Refresh": "تحديث",
  "Restart": "إعادة التشغيل",
  "Restart server": "إعادة تشغيل السيرفر",
  "Restore — replaces current world": "استعادة — تستبدل العالم الحالي",
  "Sign out": "تسجيل الخروج",
  "Start": "تشغيل",
  "Start the server to get its join address": "شغّل السيرفر للحصول على عنوان الدخول",
  "Stop": "إيقاف",
  "TPS over last ~60s": "TPS خلال آخر ~60 ثانية",
  "Toggle auto-scroll": "تبديل التمرير التلقائي",
  "Too large or binary": "كبير جداً أو ملف ثنائي",
  "Up one level": "مستوى للأعلى",
  "Upload": "رفع"
};
window.translateTitles = (root, lang) => {
  if (!root || !root.querySelectorAll) return;
  lang = lang || localStorage.getItem("crafthost.lang") || "en";
  const els = root.matches && root.matches("[title]") ? [root, ...root.querySelectorAll("[title]")] : root.querySelectorAll("[title]");
  for (const el of els) {
    const en = el.dataset.titleEn || el.getAttribute("title");
    const ar = window.TITLE_AR[en];
    if (!ar) continue;
    el.dataset.titleEn = en;
    el.setAttribute("title", lang === "ar" ? ar : en);
  }
};
(function translateInsertedNodes() {
  if (typeof MutationObserver === "undefined" || typeof document === "undefined") return;
  const apply = (root) => {
    const dict = window.I18N[localStorage.getItem("crafthost.lang") || "en"];
    if (!dict || !root.querySelectorAll) return;
    const els = root.matches("[data-i18n]") ? [root, ...root.querySelectorAll("[data-i18n]")] : root.querySelectorAll("[data-i18n]");
    for (const el of els) {
      const v = dict[el.getAttribute("data-i18n")];
      if (v && el.textContent !== v) el.textContent = v;
    }
    window.translateTitles(root);
  };
  new MutationObserver((muts) => {
    for (const m of muts) for (const n of m.addedNodes) if (n.nodeType === 1) apply(n);
  }).observe(document.documentElement, { childList: true, subtree: true });
})();
window.applyLang = (lang) => {
  lang = lang === "ar" ? "ar" : "en";
  localStorage.setItem("crafthost.lang", lang);
  document.documentElement.setAttribute("lang", lang);
  document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
  document.body && document.body.classList.toggle("lang-ar", lang === "ar");
  document.body && document.body.classList.toggle("lang-en", lang === "en");
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const k = el.getAttribute("data-i18n");
    if (k && window.I18N[lang] && window.I18N[lang][k])
      el.textContent = window.I18N[lang][k];
  });
  window.translateTitles(document, lang);
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const k = el.getAttribute("data-i18n-placeholder");
    if (k && window.I18N[lang] && window.I18N[lang][k])
      el.setAttribute("placeholder", window.I18N[lang][k]);
  });
  // Update the language toggle button label to show the OTHER language
  document.querySelectorAll("[data-lang-toggle]").forEach((btn) => {
    btn.textContent = lang === "ar" ? "EN" : "عربي";
  });
};

// Inject PWA manifest + favicon + Open Graph / Twitter tags + theme color into
// every page. Pages can override by defining their own tags (this script only
// adds if not already present). Idempotent — safe to call from anywhere.
(function injectMetaAndManifest() {
  if (typeof document === "undefined") return;
  function add(tag, attrs) {
    // Skip if already present with the same key attr
    const keyAttr = attrs.property
      ? "property"
      : attrs.name
        ? "name"
        : attrs.rel
          ? "rel"
          : null;
    if (
      keyAttr &&
      document.head.querySelector(`${tag}[${keyAttr}="${attrs[keyAttr]}"]`)
    )
      return;
    const el = document.createElement(tag);
    for (const k of Object.keys(attrs)) el.setAttribute(k, attrs[k]);
    document.head.appendChild(el);
  }
  // Favicon (SVG works in all modern browsers, scales perfectly)
  add("link", { rel: "icon", type: "image/svg+xml", href: "/icon.svg" });
  add("link", { rel: "apple-touch-icon", href: "/icon.svg" });
  // PWA manifest — Chromium will offer "Install app" once visited twice
  add("link", { rel: "manifest", href: "/manifest.json" });
  // Theme color (Chrome/Android address bar + iOS Safari tab color)
  add("meta", { name: "theme-color", content: "#0f172a" });
  add("meta", {
    name: "apple-mobile-web-app-status-bar-style",
    content: "black-translucent",
  });
  add("meta", { name: "apple-mobile-web-app-capable", content: "yes" });
  add("meta", { name: "apple-mobile-web-app-title", content: "CraftHost" });
  // SEO description (most pages already have a <meta name="description">, but
  // pages without one will get this default)
  add("meta", {
    name: "description",
    content:
      "Free Minecraft server hosting. One-click Paper deploy in 60 seconds. Plugins, world import, custom JARs, real public IP — all free.",
  });
  // Open Graph — share previews on Discord/Twitter/Slack/Facebook
  const url = location.origin + location.pathname;
  add("meta", { property: "og:type", content: "website" });
  add("meta", { property: "og:site_name", content: "CraftHost" });
  add("meta", {
    property: "og:title",
    content: document.title || "CraftHost — Free Minecraft Server Hosting",
  });
  add("meta", {
    property: "og:description",
    content:
      "Free Minecraft server hosting. One-click Paper deploy in 60 seconds. Plugins, world import, custom JARs — all free.",
  });
  add("meta", { property: "og:url", content: url });
  add("meta", { property: "og:image", content: location.origin + "/og.svg" });
  add("meta", { property: "og:image:width", content: "1200" });
  add("meta", { property: "og:image:height", content: "630" });
  add("meta", {
    property: "og:locale",
    content: (document.documentElement.lang || "en").startsWith("ar")
      ? "ar_KW"
      : "en_US",
  });
  // Twitter card
  add("meta", { name: "twitter:card", content: "summary_large_image" });
  add("meta", {
    name: "twitter:title",
    content: document.title || "CraftHost",
  });
  add("meta", {
    name: "twitter:description",
    content: "Free Minecraft server hosting. Deploy in 60 seconds.",
  });
  add("meta", { name: "twitter:image", content: location.origin + "/og.svg" });
})();

// Inject Google Fonts (Inter for EN, Tajawal for AR — both load once).
(function loadFonts() {
  if (typeof document === "undefined") return;
  if (document.getElementById("ch-fonts")) return;
  const pre1 = document.createElement("link");
  pre1.rel = "preconnect";
  pre1.href = "https://fonts.googleapis.com";
  document.head.appendChild(pre1);
  const pre2 = document.createElement("link");
  pre2.rel = "preconnect";
  pre2.href = "https://fonts.gstatic.com";
  pre2.crossOrigin = "anonymous";
  document.head.appendChild(pre2);
  const link = document.createElement("link");
  link.id = "ch-fonts";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Tajawal:wght@400;500;700;900&display=swap";
  document.head.appendChild(link);
})();

// Inject credit footer + language toggle into every page.
(function injectChrome() {
  if (typeof document === "undefined") return;
  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }
  ready(() => {
    // Credit footer — single shared element across every page, links to
    // the author's X/Twitter account.
    if (!document.querySelector(".site-credit, .ft-credit")) {
      const f = document.createElement("div");
      f.className = "site-credit";
      f.innerHTML = `<span data-i18n="footer_credit">Programmed by</span> <a href="https://x.com/KhaledQ84Ever" target="_blank" rel="noopener noreferrer" aria-label="@KhaledQ84Ever on X">@KhaledQ84Ever</a>`;
      // On dashboard-style pages the .dash grid is min-height:100vh, so a
      // body-appended credit lands below the fold with a huge empty gap.
      // Append it inside the content column so it follows the page content.
      const dashMain = document.querySelector(".dash main.main");
      if (dashMain) {
        f.style.marginTop = "28px";
        f.style.background = "transparent";
        dashMain.appendChild(f);
      } else {
        document.body.appendChild(f);
      }
    }
    // Home icon — fixed top-left circular button on every page so users can
    // always return to the marketing homepage with one tap. Idempotent —
    // skips injection if the page already has a brand-link to "/" visible
    // OR if a previous app.js run already added one.
    if (!document.querySelector(".ch-home-btn")) {
      const existingBrand = document.querySelector('a.brand[href="/"]');
      // On dashboard pages the brand lives in the collapsing sidebar, so add
      // the home icon to the topbar regardless. On marketing/auth pages the
      // brand is in the nav already, but a small home icon is still helpful
      // mobile-side.
      const a = document.createElement("a");
      a.href = "/";
      a.className = "ch-home-btn";
      a.setAttribute("aria-label", "CraftHost — Home");
      a.title = window.t("home");
      // Match the index brand: [C] CraftHost. This way every page has the same
      // recognizable brand element users can click to return to the homepage.
      a.innerHTML =
        '<span class="brand-mark">C</span><span class="ch-home-label">CraftHost</span>';
      document.body.appendChild(a);
    }
    // Auth-aware nav + instant user-info hydration. After login the user object
    // is cached in localStorage.crafthost.user (set by login.html / register.html).
    // On every page load we synchronously read it and apply to UI elements
    // BEFORE any API round-trip — no flash of "Visitor" / "Sign in" state.
    // Then asynchronously verify the session via /api/auth/me; if invalid, clear
    // the cached info.
    (function hydrateUserFromCache() {
      let cached = null;
      try {
        const raw = localStorage.getItem("crafthost.user");
        if (raw) cached = JSON.parse(raw);
      } catch {}
      if (cached?.username) {
        // Hide Sign-in button on landing
        const signIn = document.getElementById("navSignIn");
        if (signIn) signIn.style.display = "none";
        // Pre-fill dashboard greeting + avatar synchronously (before loadMe runs)
        const nameEl = document.getElementById("userName");
        if (nameEl) nameEl.textContent = cached.username;
        const av = document.getElementById("avatar");
        if (av) av.textContent = (cached.username[0] || "U").toUpperCase();
        // Any element with [data-user-name] / [data-user-email] gets filled
        document.querySelectorAll("[data-user-name]").forEach((el) => {
          el.textContent = cached.username;
        });
        document.querySelectorAll("[data-user-email]").forEach((el) => {
          el.textContent = cached.email || "";
        });
      }
    })();
    // Global signed-in signal — other modules (dashboard.js loadServers,
    // useServerPicker) read window.isSignedIn / await window.authReady before
    // deciding whether to show "demo" mode. Fixes the bug where a transient
    // network blip on /api/servers made a logged-in user look like a visitor.
    // Optimistic seed from cache so deploy buttons work immediately on a fresh
    // page load; the /api/auth/me call below corrects it within ~100ms.
    window.isSignedIn = !!(() => {
      try {
        return JSON.parse(localStorage.getItem("crafthost.user") || "null");
      } catch {
        return null;
      }
    })();
    window.currentUser = null;
    try {
      const raw = localStorage.getItem("crafthost.user");
      if (raw) window.currentUser = JSON.parse(raw);
    } catch {}
    window.authReady = (async function reflectAuth() {
      try {
        const r = await fetch("/api/auth/me", { credentials: "include" });
        if (r.ok) {
          const data = await r.json().catch(() => ({}));
          const u = data?.user || data;
          if (u?.username) {
            window.isSignedIn = true;
            window.currentUser = u;
            // Refresh cache (covers username/email changes from /settings)
            try {
              localStorage.setItem("crafthost.user", JSON.stringify(u));
            } catch {}
            const signIn = document.getElementById("navSignIn");
            if (signIn) signIn.style.display = "none";
          }
        } else if (r.status === 401) {
          // Session expired or revoked — clear cache so the next page load
          // doesn't show stale identity.
          window.isSignedIn = false;
          window.currentUser = null;
          try {
            localStorage.removeItem("crafthost.user");
          } catch {}
        }
        // 5xx / network failure: leave optimistic isSignedIn untouched so a
        // server hiccup doesn't kick the user out of their dashboard.
      } catch {
        // Network failure — keep optimistic state from cache.
      }
      return window.isSignedIn;
    })();
    // Global logout — any element with id=logoutBtn / id=logoutLink /
    // class=logout-link triggers a full sign-out (clear cache + DELETE
    // session + redirect to /login.html). Page-specific handlers can
    // pre-empt by stopping propagation if they want different behavior.
    document
      .querySelectorAll("#logoutBtn, #logoutLink, .logout-link")
      .forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          e.preventDefault();
          try {
            localStorage.removeItem("crafthost.user");
          } catch {}
          try {
            await fetch("/api/auth/logout", {
              method: "POST",
              credentials: "include",
            });
          } catch {}
          location.href = "/login.html";
        });
      });

    // Inject Sign out into the sidebar of every .dash page that doesn't
    // already have one. Appears under Settings.
    (function injectSidebarSignOut() {
      const sideNav = document.querySelector(".side-nav");
      if (!sideNav) return;
      if (sideNav.querySelector("#logoutLink, .logout-link")) return;
      const a = document.createElement("a");
      a.href = "#";
      a.id = "logoutLink";
      a.className = "logout-link";
      a.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg><span data-i18n="sign_out">' +
        (window.t ? window.t("sign_out") : "Sign out") +
        "</span>";
      // Re-bind global handler since this element didn't exist when the
      // outer forEach ran.
      a.addEventListener("click", async (e) => {
        e.preventDefault();
        try {
          localStorage.removeItem("crafthost.user");
        } catch {}
        try {
          await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
          });
        } catch {}
        location.href = "/login.html";
      });
      sideNav.appendChild(a);
    })();

    // Sidebar icons — auto-inject the same SVGs the dashboard uses into the
    // sidebar of every .dash page (billing/settings/files/etc), keyed by href.
    // This way I don't have to copy-paste 8 SVGs across 8 HTML files. Also
    // sets the `active` class on the link matching the current pathname.
    (function injectSidebarIcons() {
      const SIDEBAR_ICONS = {
        "/dashboard.html":
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
        "/marketplace.html":
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
        "/files.html":
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
        "/jars.html":
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
        "/console.html":
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>',
        "/settings.html":
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
      };
      const sideNav = document.querySelector(".side-nav");
      if (!sideNav) return;
      const currentPath =
        location.pathname.replace(/\/$/, "") || "/dashboard.html";
      sideNav.querySelectorAll("a[href]").forEach((a) => {
        const href = a.getAttribute("href");
        // Add the active class if this link matches the current page
        if (href === currentPath || href === location.pathname)
          a.classList.add("active");
        const icon = SIDEBAR_ICONS[href];
        if (!icon) return;
        // Don't double-inject if the page's HTML already has an inline SVG
        if (a.querySelector("svg")) return;
        // Prepend the SVG so the text stays in place
        a.insertAdjacentHTML("afterbegin", icon);
      });
    })();
    // Language toggle — float top-right (fixed) if no topbar exists, otherwise
    // append to topbar/header. Button shows the OTHER language as the call-to-action.
    if (!document.querySelector("[data-lang-toggle]")) {
      const btn = document.createElement("button");
      btn.setAttribute("data-lang-toggle", "1");
      btn.className = "lang-toggle";
      btn.type = "button";
      btn.setAttribute("aria-label", "Switch language");
      btn.addEventListener("click", () => {
        const cur = localStorage.getItem("crafthost.lang") || "en";
        window.applyLang(cur === "ar" ? "en" : "ar");
      });
      // Prefer placing the lang toggle inside an existing nav so it doesn't float
      // over CTAs. nav.nav is the landing/marketing nav (index.html, pricing.html).
      // .nav-cta is the right-side CTA cluster — append there so it sits inline
      // with the dashboard / sign-in buttons.
      const cta = document.querySelector(".nav .nav-cta");
      const actions = document.querySelector(".topbar-actions");
      const topbar =
        cta ||
        actions ||
        document.querySelector(".topbar") ||
        document.querySelector("header") ||
        document.querySelector("nav.main-nav") ||
        document.querySelector("nav.nav");
      if (topbar) topbar.appendChild(btn);
      else document.body.appendChild(btn);
    }
    // Apply the saved language (or detect from browser on first visit)
    const saved = localStorage.getItem("crafthost.lang");
    const lang =
      saved ||
      ((navigator.language || "en").toLowerCase().startsWith("ar")
        ? "ar"
        : "en");
    window.applyLang(lang);
  });
})();

// Server error messages are English; in Arabic mode the known ones are
// translated here (exact text, then patterns for messages with values).
// Unknown messages pass through unchanged.
window.ERRORS_AR = {
  "Admin accounts cannot be self-deleted. Demote first.": "لا يمكن لحسابات المشرفين حذف نفسها. أزل صلاحية المشرف أولاً.",
  "Admin only": "للمشرفين فقط",
  "Backup not found": "النسخة الاحتياطية غير موجودة",
  "Both passwords required": "كلمتا المرور مطلوبتان",
  "Cannot delete root": "لا يمكن حذف المجلد الرئيسي",
  "Command too long (max 1000)": "الأمر طويل جداً (الحد 1000)",
  "Could not write server.properties": "تعذّر حفظ server.properties",
  "Current password required": "كلمة المرور الحالية مطلوبة",
  "Download failed": "فشل التنزيل",
  "Email already in use": "البريد الإلكتروني مستخدم مسبقاً",
  "Email and password required": "البريد الإلكتروني وكلمة المرور مطلوبان",
  "Email or username already exists": "البريد الإلكتروني أو اسم المستخدم موجود مسبقاً",
  "Email or username already in use": "البريد الإلكتروني أو اسم المستخدم مستخدم مسبقاً",
  "Email required": "البريد الإلكتروني مطلوب",
  "Failed to list public servers": "تعذّر عرض السيرفرات العامة",
  "File is not a PNG": "الملف ليس بصيغة PNG",
  "File not found": "الملف غير موجود",
  "File too large to edit": "الملف كبير جداً للتعديل",
  "Hash mismatch — refusing to install": "بصمة الملف غير مطابقة — تم رفض التثبيت",
  "Invalid credentials": "بيانات الدخول غير صحيحة",
  "Invalid current password": "كلمة المرور الحالية غير صحيحة",
  "Invalid difficulty": "مستوى الصعوبة غير صالح",
  "Invalid email address": "عنوان البريد الإلكتروني غير صالح",
  "Invalid gamemode": "نمط اللعب غير صالح",
  "Invalid max_players": "عدد اللاعبين الأقصى غير صالح",
  "Invalid name": "الاسم غير صالح",
  "Invalid or expired token": "الرابط غير صالح أو منتهي الصلاحية",
  "Invalid password": "كلمة المرور غير صحيحة",
  "Invalid username": "اسم المستخدم غير صالح",
  "Invalid version": "الإصدار غير صالح",
  "JAR file missing on server": "ملف JAR مفقود على الخادم",
  "JAR library storage is full. Delete a JAR first.": "مساحة مكتبة JAR ممتلئة. احذف ملف JAR أولاً.",
  "JAR upload failed": "فشل رفع ملف JAR",
  "Missing command": "الأمر مفقود",
  "Missing fields": "حقول مطلوبة ناقصة",
  "Missing type": "النوع مفقود",
  "Modpack hash mismatch — refusing to install": "بصمة حزمة المودات غير مطابقة — تم رفض التثبيت",
  "Modpack is not a valid .mrpack": "حزمة المودات ليست ملف ‎.mrpack صالحاً",
  "Modrinth project lookup failed": "تعذّر العثور على المشروع في Modrinth",
  "Modrinth project not found": "المشروع غير موجود في Modrinth",
  "Modrinth search failed": "فشل البحث في Modrinth",
  "Modrinth version lookup failed": "تعذّر العثور على الإصدار في Modrinth",
  "Modrinth versions fetch failed": "تعذّر جلب الإصدارات من Modrinth",
  "No downloadable file in version": "لا يوجد ملف قابل للتنزيل في هذا الإصدار",
  "No file uploaded": "لم يتم رفع أي ملف",
  "No icon set": "لا توجد أيقونة",
  "No modpack versions available": "لا توجد إصدارات متاحة لحزمة المودات",
  "No updatable fields": "لا توجد حقول للتحديث",
  "Not a directory": "ليس مجلداً",
  "Not a file": "ليس ملفاً",
  "Not found": "غير موجود",
  "Password required": "كلمة المرور مطلوبة",
  "Read failed": "فشلت القراءة",
  "Server is not online": "السيرفر غير متصل",
  "Server not found": "السيرفر غير موجود",
  "Source server not found": "السيرفر المصدر غير موجود",
  "This project does not ship a server JAR": "هذا المشروع لا يوفّر ملف JAR للسيرفر",
  "Token + password required": "الرابط وكلمة المرور مطلوبان",
  "Token already used": "تم استخدام الرابط مسبقاً",
  "Token expired": "انتهت صلاحية الرابط",
  "Too large": "كبير جداً",
  "Type DELETE to confirm": "اكتب DELETE للتأكيد",
  "Unauthorized": "غير مصرّح",
  "Unknown JAR": "ملف JAR غير معروف",
  "Unknown type": "نوع غير معروف",
  "Unsupported type": "نوع غير مدعوم",
  "Username already in use": "اسم المستخدم مستخدم مسبقاً",
  "Vanilla servers cannot load plugins or mods. Switch to Paper or Fabric first.": "سيرفرات Vanilla لا تدعم الإضافات أو المودات. غيّر المحرك إلى Paper أو Fabric أولاً.",
  "Empty zip": "ملف zip فارغ",
  "Zip does not look like a Minecraft world (no level.dat found; expected world/level.dat or level.dat at root)": "الملف لا يبدو عالم ماين كرافت (لم يُعثر على level.dat)",
  "Too many requests — try again in a minute.": "طلبات كثيرة — حاول مجدداً بعد دقيقة.",
  "Upload failed": "فشل الرفع"
};
window.ERROR_PATTERNS_AR = [
  [/^Storage limit reached: (.+) used of (.+?)\. Delete files or old worlds to make room\.$/, "تم بلوغ حد المساحة: $1 مستخدمة من $2. احذف ملفات أو عوالم قديمة لتوفير مساحة."],
  [/^Server limit reached — you can create up to (\d+) servers\. Delete one to make room\.$/, "تم بلوغ حد السيرفرات — يمكنك إنشاء $1 سيرفرات كحد أقصى. احذف واحداً لتوفير مكان."],
  [/^You can have up to (\d+) servers running at a time\. Stop one \(e\.g\. \"(.+)\"\) to start another\.$/, "يمكنك تشغيل $1 سيرفر في نفس الوقت. أوقف واحداً (مثل \"$2\") لتشغيل آخر."],
  [/^No (\w+)-compatible version found for this project$/, "لا يوجد إصدار متوافق مع $1 لهذا المشروع"],
  [/^JAR library is full \((\d+) JARs\)\. Delete one first\.$/, "مكتبة JAR ممتلئة ($1 ملفات). احذف واحداً أولاً."],
  [/^JAR library storage is full \((\d+) MB\)\. Delete a JAR first\.$/, "مساحة مكتبة JAR ممتلئة ($1 MB). احذف ملف JAR أولاً."],
  [/^In use by: (.+)\. Switch their engine first\.$/, "مستخدم في: $1. غيّر محركها أولاً."],
  [/^World is too large when unpacked \((\d+) MB, limit (\d+) MB\)$/, "العالم كبير جداً بعد فك الضغط ($1 MB، الحد $2 MB)"],
  [/^Not a valid zip: .*$/, "الملف ليس zip صالحاً"],
  [/^Install failed: (.*)$/, "فشل التثبيت: $1"]
];
window.trError = (msg) => {
  if (!msg || (localStorage.getItem("crafthost.lang") || "en") !== "ar") return msg;
  const s = String(msg);
  if (window.ERRORS_AR[s]) return window.ERRORS_AR[s];
  for (const [re, ar] of window.ERROR_PATTERNS_AR) if (re.test(s)) return s.replace(re, ar);
  return s;
};
window.api = async (path, opts = {}) => {
  const init = {
    method: opts.method || "GET",
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    credentials: "include",
  };
  if (opts.body) init.body = JSON.stringify(opts.body);
  const r = await fetch(path, init);
  let data;
  try {
    data = await r.json();
  } catch {
    data = {};
  }
  if (!r.ok) {
    const err = new Error(window.trError(data.error) || `HTTP ${r.status}`);
    err.status = r.status; // 401 = unauth, 5xx = server, etc.
    err.transient = r.status >= 500; // server-side issue, retry is reasonable
    err.data = data; // full response body (e.g. conflict details)
    throw err;
  }
  return data;
};

// Where to go after sign-in: the ?next= path, but only if it stays on this site.
// Parsing (not prefix checks) catches tricks like "/\evil.com" that browsers treat as "//evil.com".
window.safeNext = (fallback = "/dashboard.html") => {
  const next = new URLSearchParams(location.search).get("next");
  if (!next) return fallback;
  try {
    const u = new URL(next, location.origin);
    return u.origin === location.origin ? u.pathname + u.search + u.hash : fallback;
  } catch {
    return fallback;
  }
};

window.toast = (msg, type = "success") => {
  const host =
    document.getElementById("toasts") ||
    (() => {
      const h = document.createElement("div");
      h.className = "toast-host";
      h.id = "toasts";
      document.body.appendChild(h);
      return h;
    })();
  const t = document.createElement("div");
  t.className =
    "toast " + (type === "error" ? "error" : type === "warn" ? "warn" : "");
  t.textContent = msg;
  host.appendChild(t);
  setTimeout(() => {
    t.style.opacity = "0";
    t.style.transform = "translateX(50px)";
    setTimeout(() => t.remove(), 300);
  }, 3500);
};

window.fmtBytes = (b) => {
  if (!b) return "0 B";
  const u = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(b) / Math.log(1024));
  return (b / Math.pow(1024, i)).toFixed(1) + " " + u[i];
};

window.fmtTime = (sec) => {
  if (sec < 60) return sec + "s";
  if (sec < 3600) return Math.floor(sec / 60) + "m";
  if (sec < 86400) return Math.floor(sec / 3600) + "h";
  return Math.floor(sec / 86400) + "d";
};

window.copyText = (text) => {
  navigator.clipboard.writeText(text);
  toast(window.t("msg_copied"));
};

// Auto-inject the unified mobile bottom nav on EVERY page (not just dashboard).
// Uses professional Lucide-style stroke SVG icons (no cartoon emoji).
(function injectMobileNav() {
  if (typeof document === "undefined") return;
  // Lucide-derived stroke icons — uniform 24x24 viewBox, currentColor, 1.8 stroke.
  const ICONS = {
    server:
      '<svg class="mn-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="7" rx="2"/><rect x="2" y="14" width="20" height="7" rx="2"/><line x1="6" y1="6.5" x2="6.01" y2="6.5"/><line x1="6" y1="17.5" x2="6.01" y2="17.5"/></svg>',
    plugin:
      '<svg class="mn-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2v3M15 2v3M9 19v3M15 19v3"/><path d="M2 9h3M2 15h3M19 9h3M19 15h3"/><rect x="5" y="5" width="14" height="14" rx="2"/></svg>',
    folder:
      '<svg class="mn-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h5l2 3h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/></svg>',
    package:
      '<svg class="mn-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M16.5 9.4 7.55 4.24"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
    terminal:
      '<svg class="mn-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>',
    card: '<svg class="mn-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>',
    settings:
      '<svg class="mn-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    help: '<svg class="mn-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  };
  document.addEventListener("DOMContentLoaded", () => {
    if (document.querySelector(".mobile-nav")) return;
    const HIDE_PATHS = [
      "/",
      "/index",
      "/login",
      "/register",
      "/forgot",
      "/reset",
      "/status",
      "/pricing",
    ];
    const pathNorm =
      location.pathname.replace(/\.html$/, "").replace(/\/$/, "") || "/";
    if (HIDE_PATHS.includes(pathNorm)) return;
    const here = pathNorm === "/" ? "/dashboard" : pathNorm;
    const items = [
      { href: "/dashboard.html", label: "nav_servers", icon: ICONS.server },
      { href: "/marketplace.html", label: "nav_plugins", icon: ICONS.plugin },
      { href: "/files.html", label: "nav_files", icon: ICONS.folder },
      { href: "/jars.html", label: "nav_jars", icon: ICONS.package },
      { href: "/console.html", label: "nav_console", icon: ICONS.terminal },
      { href: "/settings.html", label: "nav_settings", icon: ICONS.settings },
    ];
    const nav = document.createElement("nav");
    nav.className = "mobile-nav";
    nav.innerHTML = `<div class="mobile-nav-inner">${items
      .map((i) => {
        const active =
          here === i.href.replace(/\.html$/, "") ? ' class="active"' : "";
        return `<a href="${i.href}"${active}>${i.icon}<div data-i18n="${i.label}">${window.t(i.label)}</div></a>`;
      })
      .join("")}</div>`;
    document.body.appendChild(nav);

    // Hamburger to open the side nav as a drawer on small screens
    const side = document.querySelector(".side");
    if (side && !document.querySelector(".menu-btn")) {
      const topbar = document.querySelector(".topbar");
      if (topbar) {
        const btn = document.createElement("button");
        btn.className = "btn btn-ghost btn-sm menu-btn";
        btn.innerHTML = "☰";
        btn.setAttribute("aria-label", "Menu");
        btn.style.cssText =
          "display:none;font-size:18px;margin-right:8px;flex-shrink:0;";
        btn.onclick = () => side.classList.toggle("open");
        // If the page uses a .topbar-title block, put the hamburger INSIDE it
        // so [☰ Title] stays grouped on the left, instead of floating as a
        // third flex child that confuses justify-content:space-between.
        const titleBlock = topbar.querySelector(".topbar-title");
        if (titleBlock) {
          titleBlock.insertBefore(btn, titleBlock.firstChild);
        } else {
          topbar.insertBefore(btn, topbar.firstChild);
        }
      }
      const bd = document.createElement("div");
      bd.className = "side-backdrop";
      bd.onclick = () => side.classList.remove("open");
      document.body.appendChild(bd);
    }
  });
})();

// Fetch user's servers and populate a <select>. Persists selection across pages.
// Returns { servers, current, demo, empty, signedIn, onChange(cb) }.
//   demo     — true only when /api/servers errors (i.e. visitor not signed in)
//   empty    — true when signed in but has no servers yet
//   signedIn — true when API call succeeded
window.useServerPicker = async (selectEl) => {
  const KEY = "crafthost.currentServerId";
  let servers = [];
  let demo = false;
  let signedIn = false;
  // Wait for /api/auth/me to settle so we know whether the user is really
  // logged in. Without this, a slow /api/servers response could race ahead and
  // demote a logged-in user to "demo" mode.
  try {
    if (window.authReady) await window.authReady;
  } catch {}
  try {
    const r = await api("/api/servers");
    servers = r.servers || [];
    signedIn = true;
  } catch (err) {
    // Only show demo placeholders when the user is genuinely not signed in
    // (401). Network blips, 5xx, or any other failure should NOT kick a logged-
    // in user back to demo — that was the bug where users got "Visitor" after
    // they had just logged in.
    if (err?.status === 401 || !window.isSignedIn) {
      demo = true;
      servers = [
        {
          id: "demo-survival",
          name: "Survival World (demo)",
          type: "paper",
          version: "1.21.1",
          status: "online",
          port: 25565,
        },
        {
          id: "demo-creative",
          name: "Creative Build (demo)",
          type: "vanilla",
          version: "1.21",
          status: "offline",
          port: 25566,
        },
      ];
    } else {
      // Signed in but the API call failed transiently. Keep signed-in state
      // and show an empty list rather than demo cards.
      signedIn = true;
      servers = [];
      try {
        window.toast?.(window.t("msg_servers_retry"), "warn");
      } catch {}
    }
  }
  const empty = signedIn && servers.length === 0;
  if (empty) {
    servers = [
      {
        id: "no-server",
        name: "No servers yet — create one in the dashboard",
        type: "",
        version: "",
        status: "offline",
        port: 0,
      },
    ];
  }
  const savedId = localStorage.getItem(KEY);
  let current = servers.find((s) => s.id === savedId) || servers[0];

  if (selectEl) {
    // Built with textContent: server names are user input and must never parse as HTML.
    selectEl.replaceChildren(
      ...servers.map((s) => {
        const dot =
          s.status === "online" || s.status === "starting" ? "🟢" : "🔴";
        const opt = document.createElement("option");
        opt.value = s.id;
        opt.selected = s.id === current.id;
        opt.textContent = `${dot} ${s.name}${s.version ? " — " + (s.type ? s.type[0].toUpperCase() + s.type.slice(1) : "") + " " + s.version : ""}`;
        return opt;
      }),
    );
  }

  const listeners = [];
  if (selectEl) {
    selectEl.addEventListener("change", () => {
      current = servers.find((s) => s.id === selectEl.value) || current;
      localStorage.setItem(KEY, current.id);
      listeners.forEach((fn) => fn(current));
    });
  }

  return {
    get current() {
      return current;
    },
    servers,
    demo,
    empty,
    signedIn,
    onChange: (fn) => listeners.push(fn),
  };
};

// ── Global modal UX: Escape or backdrop-click closes any open modal ────────
// Routes through the modal's own ✕ button when it has one (so per-modal
// cleanup like claim-poll timers still runs); otherwise just hides it.
(() => {
  const dismiss = (bg) => {
    const btn = bg.querySelector(".close-btn, .modal-close, [data-close]");
    if (btn) btn.click();
    else if (bg.classList.contains("modal-host")) bg.style.display = "none";
    else bg.classList.remove("show", "open");
  };
  // Three overlay patterns exist: .modal-bg.show (class toggle), .modal.show
  // (clone/world/health — the overlay IS the .modal), .modal-host (bedrock,
  // display toggle). The inner ".modal" of the modal-bg pattern never carries
  // .show, so ".modal.show" only matches the overlay variant.
  const OPEN_SEL = ".modal-bg.show, .modal-bg.open, .modal.show, .modal-host";
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    const open = [...document.querySelectorAll(OPEN_SEL)]
      .filter((el) => getComputedStyle(el).display !== "none");
    if (open.length) dismiss(open[open.length - 1]);
  });
  document.addEventListener("click", (e) => {
    const c = e.target.classList;
    if (c && (c.contains("modal-bg") || c.contains("modal-host") || (c.contains("modal") && c.contains("show"))))
      dismiss(e.target);
  });
})();
