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
