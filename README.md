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

## Town controls update

`play/town/2026.10.05.4/` uses Forge source
`8cb47be4b0eb6eca4ef0cf98c62fb1864fc11c4e`. The playable shirt/trousers
appearance uses the same common human controller. English is the default; the
menu still offers Traditional Chinese. Player walking/running is twice as fast.
Esc offers Close (the previous distance), Medium and Far camera presets. Ground
click routes round obstacle corners with collision-checked segments and slow
down at arrival, rather than at every bend. Player commands take priority over
new ambient chats. The existing outdoor-preview limitations still apply.

Chromium and WebKit passed 19 gameplay checks each; native Debug CTest passed
both town and navigation tests. Runtime packages and test revisions are recorded
in the retained engine release evidence. Older version URLs stay intact.

## Town mobile and conversation update

`play/town/2026.10.06.1/` uses Forge source
`9ba621a0260b2772aced3bbaa8156d9b8713c250`. Portrait controls are anchored
to the bottom with touch-sized buttons and a compact selected-target card.
The camera defaults to Medium; a main-view button cycles Far, Close and Medium.
Head-anchored UI Maker speech bubbles now render fractional coordinates.
Six coherent bilingual conversation topics add 18 lines. Companion follow speed
tracks the human running capability and movement multiplier, with refreshed
pursuit targets and shorter arrival pauses.

The existing loading/cache pipeline and outdoor-preview limitations remain.
Browser checks use headless Chromium/WebKit, including a 390px portrait viewport;
physical iPhone Safari acceptance is separate. Older version URLs remain intact.

## Town wind and water update

`play/town/2026.10.08.1/` uses Forge source
`deb76b4f9713bd9b3662b1aab4d7274fa811684e`. Trees, crops and grass sway in a
GPU wind drawn in both the visible and shadow passes (84 authored swaying
objects), and the water painted into the terrain gets procedural ripples, highlights
and foam. Wind and Water are UI Maker switches in the menu. UI drawing and
pointer picking share one viewport mapping, so touch targets line up on narrow
screens. The same 405-object outdoor town, residents, conversations and pet
follow/wait carry over; interiors, paired assistance and audio are still pending.

Chromium and WebKit passed startup (9), gameplay (22) and effects (8) checks
headlessly; physical iPhone Safari acceptance is separate. Older version URLs
remain intact.

## Town showcase and portrait framing 2026.10.08.2

`play/town/` is the town's showcase page: what you can do, the controls, how it
is made, captures from the released build and every version so far. It always
links to the latest version.

`play/town/2026.10.08.2/` uses Forge source
`66c438e3282a0fbbaec6ec4f1a2937aedfe70c54`. Screens narrower than 0.8
width/height widen the view (by up to 1/0.6), so a phone sees the street around
the player instead of the well and one wall; desktop framing is unchanged.
Chromium and WebKit again passed startup (9), gameplay (22) and effects (8)
checks headlessly.
