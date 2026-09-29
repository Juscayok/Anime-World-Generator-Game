# Anime World Generator 1.0

Double-click `index.html` or the Anime World Generator desktop shortcut. No installation, internet connection, or server is required.

## Windows release

Share `dist/Anime World Generator 1.0.exe` on its own, or `dist/Anime-World-Generator-1.0-Windows.zip` with instructions and a checksum. The executable embeds the complete offline game, extracts verified assets into `%LOCALAPPDATA%\AnimeWorldGenerator\1.0`, and opens it in the default browser. It uses the .NET Framework included with modern Windows; Windows 10/11 and a modern browser are recommended. The app footer and window title show version 1.0, and the executable has Windows file/product version metadata.

This personal release is unsigned. Its packaged browser saves are separate from saves made by opening the development copy, and no player saves are embedded in the release.

Rebuild with `./build-release.ps1` in PowerShell. The build compiles the Windows launcher with the built-in .NET Framework compiler, verifies every embedded asset by SHA-256, then creates the shareable ZIP and checksum. Source and artwork are tracked in Git; generated `build/` and `dist/` folders are ignored.

Five anime worlds have separate ability and encounter pools. Spin, review your reaction, then Continue. Technique count adds individual technique and mastery wheels. Three rerolls are available per run. Conditional mastery wheels are skipped when the corresponding power is absent. The final battle uses weighted odds derived from the build, enemy, enemy condition, and starting advantage.

Age ranges now unlock an exact-age wheel with equal odds for each year. Ancient unlocks a bounded range first. Unfinished older saves gain this follow-up without losing their results or a pending roll; completed characters remain unchanged.

The desktop play area fits the available browser height. The full character sheet and odds use paged overlays. At narrow widths, use Wheel / Character / Reactions tabs. Extremely short viewports (under 380 CSS pixels tall, including extreme zoom) allow scrolling to preserve access to controls and enlarged text.

Each anime has two reaction characters: Yuji/Gojo, Naruto/Sasuke, Luffy/Zoro, Ichigo/Rukia, and Goku/Vegeta. Solo reactions alternate, while special rolls and battle outcomes show both. These are generated fan illustrations and original game captions.

Progress and up to 50 completed characters save in this browser's local storage. Browser data clearing removes those saves. Download completed builds from My Characters to keep a text copy. Local file storage support depends on the browser; the footer reports storage failures.

Game balance is an original fan-game interpretation, not a canonical power ranking. Reactions are original generated anime illustrations with contextual captions. Sound is optional. Settings include quick spins and reduced meme effects; OS reduced-motion preferences are respected.

Files: index.html, style.css, fit.css, game.js (rules), app.js (interface), reactions-*.png, icon.svg and icon.ico. REACTION-ART.md records the art brief. preview.cjs is an optional loopback-only development preview; it is not needed by the desktop shortcut.

Validation: `node test-game.cjs`, `node test-updates.cjs`, and `node test-interface.cjs`. Browser checks confirmed no document overflow at 1536×698, 1366×650, 1024×600, and 390×700, including the phone reaction panel. Verified range → exact-age → character sheet through the live interface.
