# AbyssGames

Source for the AbyssGames website — an independent studio building privacy-first,
on-device software.

- **Live site:** https://abyssband.github.io/abyssgames/
- **Built as:** a static site (plain HTML/CSS). No web fonts, no CDNs, no analytics,
  no trackers — consistent with the privacy-first ethos.

## Structure

- `index.html` — landing (Work / About / Contact)
- `legal/blur-and-red-pills/` — Privacy Policy for Blur And Red Pills
- `styles.css` — shared styles
- `.nojekyll` — serve files as-is (no Jekyll processing)

## License

Copyright © 2026 Ting Feng Chou (周庭峰). All rights reserved.

## OpenWorld preview

`play/openworld/` contains the compiled Abyss Engine Web preview, not an independent copy of its source. Source and build tools remain in `abyssband/abyss-engine`, `projects/character-lab/platform/web/`. Build with `build.py --public` and an explicit reviewed portable world, run its browser checks, then replace the release files together. `release.json` records file hashes. Do not copy development receipts, source maps or local saves.

The preview supports WebGL 2 browsers, including iPad Safari. Saves stay in localStorage on this origin and are separate from local development saves. The FPS HUD is a short rolling browser measurement, not a GPU or thermal benchmark. MuJoCo physics is not included. Models/art are provided for this preview under the site's existing copyright; third-party runtime notices are in the preview directory.

Version 2026.09.28.2 adds browser-language detection and a persistent Traditional Chinese / Simplified Chinese / English selector. The loading overlay follows actual asset download progress and scene readiness, supports reduced motion, and offers retry on download failure. Technical diagnostics retain their original repair details.

## Town renderer preview

`play/town/2026.10.05.2/` is a versioned WebGL 2 town imaging release. Source
remains in Abyss Engine / Forge revision `aa84f2438c16e3697b3fabcffdf616e4cd80077f`.
Every visible application control/readout uses UI Maker and Behavior; the HTML
shell hosts canvases only. `release.json` records exact public file hashes.
The release contains no source maps, development receipts, local saves or unused
C/header/Abyss authoring sources. Performance acceptance and full gameplay remain
pending. Update this versioned path only by an explicit replacement release.

Version 2026.10.05.2 adds a pre-runtime loading screen exported from UI Maker,
real download progress, initialization stages and Retry. Model parsing and GPU
uploads yield between batches. A verified cache holds one package, at most
96 MiB decoded, keyed by both WASM/data hashes; denied storage or eviction falls
back to HTTP. Cache access does not touch player saves. Initial delivery still
uses GitHub Pages gzip. The previous version remains at its versioned URL.

## Town interactive preview

`play/town/2026.10.05.3/` uses Forge source
`be1066da2a05f167cbb799cd40b95114e220f44b`. Its 405-object town contains
five independent actors using shared C/Behavior gameplay and Jolt movement.
Click the ground to walk or an actor to interact. WASD moves, Shift runs,
Space jumps, F falls, R recovers, and Esc pauses. The menu switches Traditional
Chinese/English and Low/Balance/Quality. Pet follow/wait and resident conversation
use actual world state. Interior entry, paired assistance and audio are pending.

Chromium and WebKit each passed 9 startup and 17 gameplay checks. Physical mobile
acceptance and sustained performance measurements remain pending. Packaging and
verified caching follow the existing `docs/release/web-town.md` engine runbook;
`release.json` binds all eight public runtime files. Older version URLs stay intact.
