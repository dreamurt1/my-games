# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Role and ground rules

- You act as a **game web developer**. The owner (Ryan / 라이언, a beginner) builds the game with Claude Code alone. Do not introduce outside tools: no frameworks, bundlers, npm packages, game engines or image generators. Write plain HTML/CSS/JS and draw art in code (SVG / Canvas 2D).
  - **Exception (owner-approved 2026-10-08):** content that is free to use with no legal risk may be used. This means public domain, CC0, or a license that clearly allows this use, such as CC BY with credit given. It covers images, sounds and fonts.
  - Never use content ripped from games or videos, content with an unclear license, or NC/ND licenses.
  - **Whenever such content is used, tell the owner where it came from**: the source URL, the author, the license and the file.
  - Record the same details in `CREDITS.md` at the project root, creating it if missing. If the license asks for credit, also show it on the page.
  - Embed the asset as a base64 `data:` URI, the same way as `fonts/`, so it works on `file://` and on other devices.
- Reply in Korean, concisely. The owner usually asks for small, precise edits; do exactly that and don't expand scope.
- **Never auto-open the browser** after edits. The owner refreshes with F5. Headless screenshots for your own checks are fine.
- **Keep this file current.** Whenever an important decision, convention or constraint changes (brand, font, new page, game rules), update CLAUDE.md in the same turn without being asked.

## Design direction

- Use the **impeccable skill** (`/impeccable`) as the main tool for game design work. `PRODUCT.md` is its product record, and `.impeccable/config.json` holds the detector suppressions. The `.impeccable/surfaces` brief is stale (it describes the retired chibi page).
- **Game brand color: indigo.** Reuse the palette from the old chibi page (`index-chibi-backup.html`):

  | token | value | use |
  |---|---|---|
  | `--ink` | `#2b1055` | main indigo |
  | `--ink-deep` | `#1a0b3b` | deep indigo / backgrounds |
  | `--lilac-deep` | `#7c5cff` | accent violet |
  | `--lilac` | `#b9a6ff` | light violet |
  | `--text-soft` | `#d2c6f7` | secondary text on indigo |
  | `--orange` / `-hi` / `-lo` | `#f7924a` / `#ffc58e` / `#d8692e` | warm highlight (cat, CTAs) |
  | `--cream` | `#fff1e0` | text / light surface |

- **Game font (temporary): Galmuri11**, a Korean pixel font. It is applied in every game page. Canvas text uses the 3×5 pixel font `Retro.text` instead.
- **Fonts are local, never from a CDN** (since 2026-10-08):
  - `fonts/galmuri11.css` is used by the game pages, and `fonts/pretendard.css` is used by index.html.
  - Each file embeds the woff2 as a base64 `data:` URI, with no `local()` source, so every device renders the same font whether or not it is installed.
  - Use only `format('woff2')`, never `woff2-variations`, which older Safari skips.
  - The reason: CDN fonts made Edge log "Tracking Prevention blocked access to storage", and separate font files on `file://` fail CORS.
  - Keep every page free of console errors.
- `Retro.sfx` stays silent until `navigator.userActivation.hasBeenActive`. This avoids the "AudioContext was not allowed to start" warning, for example on the visibility auto-pause.
- The portfolio page (`index.html`) has its own separate look: a mid-century linocut poster style from `ref-images-1/`, with cream paper, coral, teal, mustard and ink, set in Pretendard.
- **Game pages are 8-bit retro pixel art** (approved by the owner on 2026-10-08). The rules:
  - **Palette:** 10 colors only, kept in `Retro.PAL` (k night, d deep, i ink, v violet, p lilac, c cream, o orange, h orange-hi, l orange-lo, r red). The CSS tokens in `retro.css` mirror them.
  - **Canvas:** draw at low resolution (catch 256×192, run 320×128, thumbnails 128×96) and scale up with `image-rendering: pixelated`. Use only `fillRect` and sprites, at integer coordinates, with no anti-aliased shapes.
  - **Sprites:** character matrices in `Retro.SPR`, one char per pixel and `.` for transparent. Animations are 2 frames (cat run A/B, record A/B, cat blink). `Retro.draw(ctx, rows, x, y, {s, map})` recolors through `map`.
  - **UI:**
    - `.px-frame`: a notched pixel border made of a 4-way box-shadow.
    - `.btn`: a pressed-in button. `.btn-ghost`: the secondary button.
    - `.band`: the title between dashed rules.
    - Blinking `PRESS ENTER` text.
    - Scores zero-padded with `Retro.pad`.
    - Scanlines on `body::after`.
  - **Sound:** `Retro.sfx(name)` plays WebAudio square/triangle effects (select, start, coin, hit, over, jump, milestone, pause, resume, place, rotate, error, clear, hype, almost, chest). Recorded clips (free-license only, see `CREDITS.md`) play through `Retro.addSample(key, base64)` and `Retro.playSample(key, {offset, dur, vol, rate, fade})`, which decode lazily on first use. `chest` is a creaky-wooden-chest sound synthesized in code; it is not a copy of any game's audio. Every game page has a **Sound on/off** button (`Retro.mountMute`), and the setting is shared in `localStorage["retro-mute"]`.
  - **Light mode (all 6 arcade pages, since 2026-10-16):** a header **Light/Dark** button (`Retro.mountTheme(btn, onChange)`, with a pixel sun or moon) toggles `body.light`.
    - The setting is **shared** in `localStorage["retro-theme"]` (it migrates the old `brick-theme`) and lasts on every page until clicked again.
    - `mountTheme` re-syncs on `pageshow`, for bfcache back-navigation, and on `storage`, for other tabs. `Retro.isLight()` tells canvases which colors to use.
    - Common light CSS lives in `retro.css` (`body.light …`).
    - Each canvas game has a `theme()` color set: night sky k/d/i becomes cream → #efe8fc → #e2d8fb, hills become #cfc2f7, and the ground becomes lilac. catch redraws its cached `drawBg()` on change.
    - Puzzle tiles use `.tile-a` / `.tile-b` classes. The arcade cards and thumbnails follow the theme too.
  - **Icons** are pixel SVGs from sprites (`<span data-px="arrowL">` plus `Retro.icons()`). Never use Unicode glyphs or emoji. The owner later asked that `rps.html` use pixel art too (no emoji anywhere).

## Running and checking

There is no build, lint or test setup. Open the files directly from disk (`file:///C:/Users/user/my-game/index.html`).

Use headless Edge for self-checks (Git Bash):

```bash
E="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
"$E" --headless --disable-gpu --window-size=1100,1100 --virtual-time-budget=3000 --screenshot="<scratchpad>/shot.png" "file:///C:/Users/user/my-game/arcade.html"
"$E" --headless --disable-gpu --dump-dom "file:///..."        # rendered DOM
"$E" --headless --enable-logging=stderr --v=0 "file:///..."   # console errors
```

- **Game states:** headless runs cannot press keys. To capture a specific game state (paused, game over), make a temporary copy that calls `start()` / `pause()` at the end of the script, screenshot it, then delete the copy.
- **Phone width:** headless has a minimum window width. To check 390px, load the page in an `<iframe width="390">` inside a wrapper file.
- **Known false error:** DevTools prints "Unsafe attempt to load URL file:///…" on any `file://` page, even a blank one. It is not a page bug.

## Architecture

`index.html` is self-contained. The four game pages share **`retro.css`** (tokens and 8-bit UI) and **`retro.js`** (the global `Retro`: palette, sprites, draw/svg/text, sfx, mute). Each page keeps only its own layout CSS and game script inline.

- **`index.html`**: the portfolio.
  - All copy lives in `const ME = {...}` at the top of the script. Use `\n` plus `white-space: pre-line` for line breaks.
  - JS renders the copy into the DOM, including the hobby `tags` lists.
  - Art is inline SVG with print-texture filters (`f-print`, `f-edge`).
  - The cat poster blinks only while hovered.
  - The ARCADE button links to `arcade.html`.
- **Site flow:** index → `brawl/arcade.html` → `brawl/*.html` (the Brawl-style copies, see below). index → `labs.html` → `labs/*.html` (separate, see Labs below). index → `arcade.html` (game select) → `catch.html` / `puzzle.html` / `run.html` / `rps.html` / `brick.html`. Each game's Back returns to arcade, and arcade's Back returns to index. Back uses `history.back()` when the referrer matches, and otherwise follows the link.
- **`arcade.html`**: the game-select hub, with no game of its own.
  - It shows 5 cards in a 2-column grid; an odd last card is centered (1 column at 900px and below). Each has an animated 128×96 canvas thumbnail drawn with the same sprites (6 fps, still when the user prefers reduced motion), a best score and a Play button.
  - It reads every game's localStorage key on `pageshow`, so scores refresh after coming back.
  - New games get a new card here.
- **Shared pattern in `catch.html` and `run.html`** (canvas games):
  - One `requestAnimationFrame` loop with frame-time `step`, and state flags `running` / `paused`.
  - One `#overlay` is reused for the start, Paused and Game Over screens through `showOverlay(title, text, btnText, withQuit)`.
  - ESC toggles `pause()` / `resume()`. QUIT goes back to the start screen. Switching tabs auto-pauses.
  - Always wrap localStorage access in try/catch.
- **`catch.html`**: "Record Catch".
  - Canvas is 256×192 (4:3). Catch records, avoid X marks, 3 lives shown as pixel hearts.
  - Best score: `localStorage["arcade-best"]`. The key name is legacy; keep it.
- **`run.html`**: "Cat Run", modeled on Chrome's dino game.
  - Canvas is 320×128 (5:2). The background scrolls in parallax: stars, then stepped hills, then ground.
  - Jump with Space / ↑ / tap, and hold for a higher jump. Duck with ↓, which also fast-falls in the air.
  - Speakers on the ground must be jumped. Flying records come low (jump) or high (duck) after score 250.
  - Speed ramps from 2.4 to 6 px/frame. The spawn gap grows with speed so the game stays fair.
  - Best score: `localStorage["run-best"]`.
- **`puzzle.html`**: "Cat Puzzle", modeled on *Cats Organized Neatly*.
  - Drag polyomino cats into a 5×5 room until no gaps remain. A tap (under 6px of movement) rotates 90°, and R rotates while dragging.
  - **Puzzles are random** (since 2026-10-08; the old fixed maps leaked the answer). `makeLevel(k)` partitions the 5×5 room into k connected cats of 2–6 cells. It places the biggest first and seeds from the tightest free cell, then retries. It returns a letter map, where the same letter is one cat. Because the room is cut first, every puzzle is solvable.
    - Levels 1/2/3 have `LEVEL_CATS = [5, 6, 7]` cats, and a new puzzle is made on every start.
    - The HUD has **New** (a fresh puzzle at the same level) and **Reset**.
    - A 300-run check per level showed 0 invalid layouts and almost no repeats.
  - Pieces are pixel SVGs (16 units per cell, face and tail sprites, coats from `COATS`), absolutely positioned inside `.stage`. A translucent `.shadow` previews a valid drop spot.
  - `layout()` puts the room on the **left** and the waiting pieces on the **right**. Below 640px of stage width it stacks the pieces under the room.
  - **The board size is fixed** (the owner asked for this): the tray height always equals the room height (or 1.1× the room height when stacked).
    - Each cat gets a square slot whose side is its longest dimension, so rotating never moves the other pieces. Slots are reserved even for cats already in the room.
    - Waiting cats are drawn at a smaller `trayCell` (`pack()` shrinks it until everything fits), and `draw(p, cell)` restores full size the moment a cat is dragged. There is no tray label: the owner removed "고양이 대기실".
  - Pieces start randomly rotated.
  - Grabbing a cat (`onDown`) plays one of 5 **real cat recordings**: 4 meows from BigSoundBank #0098 and a purr from #0436, both CC0 by Joseph SARDIN (see `CREDITS.md`).
    - The clips are embedded as base64 mp3 in `sounds/cat-sounds.js`, which only puzzle.html loads.
    - `CAT_SOUNDS` holds the offset, duration and volume of each clip, leveled to the blip effects (RMS about 0.015). Meows also get a random 0.95–1.05 playback rate.
    - No clip plays twice in a row. The owner capped this at 5 sounds; the earlier synthesized meows were removed.
  - Progress: `localStorage["puzzle-clear"]`, the number of levels cleared.
- **`rps.html`**: "가위바위보!" (Rock Paper Scissors) against the CPU.
  - Only the board is bright: a cream `.arena` with a faint lilac checker. The page chrome stays indigo 8-bit.
  - There are 3 big buttons with pixel hand sprites (`handScissors` / `handRock` / `handPaper` in `Retro.SPR`).
  - The CPU hand is **secretly weighted** (`ODDS` / `cpuPick()`): per round I win 35%, draw 35% and lose 30% (owner reset this on 2026-10-08). The owner asked for this and for nothing about it to show in the UI. The pick follows a short shuffle of the same pixel hands. The result area shows YOU vs COM (the label the owner chose), then "이겼다 / 졌다… / 비겼다" with pixel icons (`star` / `sadFace` / `handshake`).
  - Scoreboard: "나 N : N 컴퓨터". A win gives me 1 point, a loss gives the CPU 1 point, and a draw changes nothing. The first to `GOAL = 5` wins the match. When my score reaches 3, a `HYPE!` banner appears; at 4, a bigger flashing `ALMOST!` appears (`hype()`). The goal line sits in `.how` under the description.
  - The final screen (`#final`) shows win or lose. A win escalates in stages through `data-stage` and `later()` timers: (1) YOU WIN!, (2) rays and a dropping pixel `trophy`, (3) the flashing title and light confetti, (4) a cream flash, double rays and heavy confetti, then at about 1.9s it switches to a separate chest scene (`.final.is-gift` hides the victory text): (5) a big wobbling `chestClosed`, (6) `chestOpen` with `Retro.sfx("chest")`, (7) "Your gift is...?" and the 다시 하기 button. The gift reveal is not built yet; the owner is choosing gift ideas. A loss shows everything at once, with `sadFace`. "다시 하기" clears the timers and resets the score to 0:0.
  - Effects: `burst()` throws pixel fireworks on a round win, and `shake()` shakes the board on a round loss. Both are off when the user prefers reduced motion.
  - Match wins are counted in `localStorage["rps-wins"]`. They show as `WINS 000000` in the header (`.hi`) and on the arcade card, padded like the other games' HI. Preview mode never counts a win.
  - **Preview pages for monitoring:** `rps-if-3pt.html`, `rps-if-4pt.html` and `rps-if-you-win.html`.
    - Each is only a redirect to `rps.html?preview=3pt|4pt|win`, so it always reflects the current `rps.html`. Never copy the game into them.
    - In preview mode (`PREVIEWS` / `runPreview()`), the score is set to one point before the scene, and `play("rock", "scissors")` forces a win.
    - It auto-plays once. The orange PREVIEW bar's **다시 보기** button replays it, with sound because it is a click.
- **`brick.html`**: "Brick Break", arcade card 5, playable since 2026-10-16.
  - It follows the shared canvas-game pattern: `running` / `paused`, `showOverlay`, ESC pause with QUIT/RESUME, auto-pause on tab switch, sounds and mute.
  - The overlay sits inside `.screen-wrap`, because the HUD (Score, Stage, 3 pixel hearts) is **above** the canvas, as the owner asked.
  - Canvas is 256×224 (8:7) with violet walls (`WALL` = 3, `TOP` = 15). By default bricks are 5 rows × 8 columns (40), and the top rows are worth more (50/40/30/20/10).
  - **Stage layouts (`LAYOUTS`):** each layout is a letter map; the digit is the `ROW_COLORS` index (color and points) and `.` is empty. `buildBricks()` uses `LAYOUTS[stage]` when one exists and the default grid otherwise.
    - **Stage 2 is a cat face of 44 bricks**, a little more than stage 1 as the owner asked: red ear tips, orange head, gaps for the two eyes and the nose/mouth, and a chin.
    - Stages 3 and up use the default grid.
  - The ball rests on the paddle until it is launched with Space, ↑ or a click.
    - **Launch aiming** (owner request): while the ball waits, a dotted aim line of 6 dots swings left and right (`AIM` = max ±60°, period 150 frames, so 2.5s per swing; `aimDeg()` from `aimT`, reset to straight up by `stickBall()`). The ball launches along the line at that moment. This replaced the old random launch angle and the blinking `+` hint.
  - Controls: the paddle moves with arrows, A/D or the mouse/touch (`paddle.target`). Where the ball hits the paddle sets the bounce angle, up to ±60°, so the ball can never go flat.
  - **Cursor lock** (owner request 2026-10-21: the cursor leaving the board got in the way): while playing, the mouse is held inside the board with the Pointer Lock API (`lockPointer()` / `unlockPointer()`).
    - It locks on start, resume, 계속하기 / 다시 하기 and on a mouse click on the board. It unlocks on pause, the stage clear window, game over and quit.
    - While locked, `movementX/Y` (un-rotated for the weird cat spin) moves `paddle.target`.
    - If the browser drops the lock (ESC, switching windows), the game pauses. `lockLostAt` keeps that same ESC press from resuming at once.
    - A failed request (touch, or re-locking too soon after ESC) is swallowed so the console stays clean. Headless runs cannot take the lock, so test it by hand.
  - **Brick collision (fixed 2026-10-16; balls used to plow through 2–3 bricks in a row):** each sub-step breaks only the one most-overlapped brick. The side is chosen from where the ball was just before the step, the velocity is set to point **away** from the brick (never a toggle), and the ball is pushed outside it. Tests found 0 same-row chains and no 3+ chains; the remaining 2-brick cases are normal hole and corner bounces.
  - The ball moves in small sub-steps so it never tunnels through bricks. Speed rises by `SPEED_UP.brick` = 0.021 per brick (cap 4.2), and each stage starts faster (2.2 + `SPEED_UP.stage` = 0.21 per stage). The owner lowered both by 30% on 2026-10-21 (they were 0.03 and 0.3).
  - **Stage clear window** (`#clearWin` / `stageClear()`, since 2026-10-16): after a 50-frame flash, a celebration styled like the rps victory appears.
    - Contents: rays, a bobbing trophy, a blinking **CLEAR!** title above it (styled like the old Korean title: big orange-hi text with a stepped night/orange-lo shadow, `.clear h2`) and confetti. The owner asked for no Korean title and no stage number.
    - Stats: time taken (`stageMs`, counted only while playing), best time per stage (`localStorage["brick-times"]`, a JSON object keyed by stage, with NEW RECORD when beaten), stage score and hearts.
    - Buttons: **계속하기** (next stage, focused, so Enter works), **다시 하기** (replay this stage with the score and hearts it started with) and **그만하기** (back to the title).
    - `clearOpen` blocks Enter from starting a new game, and `IS_PREVIEW` keeps preview runs from saving times. Missing the ball costs a heart and shakes the screen; 0 hearts is Game Over.
  - Best score: `localStorage["brick-best"]`, shown as HI on the page and the arcade card. A bot test cleared 3 stages with 0 errors.
  - **Falling items (since 2026-10-16):** each broken brick can drop a pixel cat icon (`ITEM` base chances, largest first as the owner ordered: bad 3.5% > good 3% > sleepy 2% > twin 1.5% > gold 1.25% > weird 1% > heart 0.75%, 13% in total (the owner halved them all on 2026-10-21), falling at 1.1 px/frame).
    - **Chances grow exponentially with progress** (owner request, 2026-10-21; this replaced the old speed-based scaling): each base chance is multiplied by `DROP.start × 2^(broken / DROP.double)` = 0.5 × 2^(bricks/60), capped at `DROP.max` = ×3.6. `broken` counts bricks broken this game (pierced ones too), resets on a new game and rewinds to `stageStartBroken` on 다시 하기. The total drop rate is about 6.6% at the start, 10.3% after stage 1 (40 bricks), 17.2% after stage 2 (84), 27.2% after stage 3 (124), 43.2% after stage 4 (164), and 46.8% at the cap from about brick 171. The 12×10 sprites in `CATS` are recolored through `map: { b }` and blink; catching one runs `catchItem(kind)`.
    - **Golden cat** (`GOLD_CAT`, drawn cute at the owner's request: sparkly eyes with cream shine `c`, pink blush `r` = #ff9b8a, smiling mouth): **pierce** for `EFFECT.pierce` = 360 frames (6s). The ball does not bounce off bricks and breaks every brick it touches along its path. It turns gold with a gold trail. Pierced bricks still score, can drop items and do not add speed.
    - **Purple sleepy cat, 졸린 고양이** (the owner renamed it from 게으른/보라; the code key stays `lazy`, `LAZY_CAT`, sleepy eyes): **slow** for `EFFECT.slow` = 300 frames (5s), and the paddle turns violet.
      - Keyboard speed drops to `EFFECT.slowKey` = 30%. The mouse/touch lerp drops to `EFFECT.slowMouse` = 0.05 from 0.4.
      - The owner asked for a stronger slowdown (it was 45% and 0.1). Measured over 100px: keyboard 0.47s → 1.55s, mouse 0.13s → 1.28s.
    - Remaining effect time shows as bars in the empty strip above the top wall: gold on the left, violet on the right. Both effects reset on a lost life, a new stage or a new game.
    - **White twin cat** (`TWIN_CAT`, 14×12: two cat faces overlapping front and back, a cream front face `b` and a lilac back face `a`, drawn with `dx`/`dy` −1): **doubles the balls** (`doubleBalls()`). Every ball gets a mirrored twin (`vx` flipped; a near-vertical ball sends its twin off at an angle), up to `MAX_BALLS` = 8. A ball resting on the paddle is launched first. It pops a pixel `x2`.
      - Balls live in the `balls` array; `balls[0]` is the one that rests on the paddle. `moveBall(ball, s)` returns true when a ball falls out, and a heart is lost (`loseLife()`) only when **no ball is left**. Pierce turns every ball gold.
    - **Rainbow weird cat** (`WEIRD_CAT`: a 16×12 dizzy face drawn at `dx` −2 / `dy` −1, with 5×5 **swirl eyes** (the right eye mirrors the left). Two frames, the swirl turned half a turn, alternate every 8 frames so the eyes spin. It also has a wobbly dotted mouth and two little + stars circling over its head, and its body cycles through `RAINBOW`): **rotates the game screen** for `EFFECT.spin` = 300 frames (5s), owner request. The angle is picked fairly from `SPIN_ANGLES` = 90/180/270 (1/3 each; 3000 draws gave 976/1005/1019), and catching another one re-rolls the angle and restarts the timer. It pops a pixel `?`.
      - `setSpin(deg)` sets the CSS `rotate` and `scale` properties on `#game` (separate from the shake `transform`). At 90/270 it scales by `H / W` = 0.875 so the tall screen fits. The angle changes **instantly**, with no in-between animation (owner request).
      - Game logic and keyboard stay in game coordinates, so the controls feel turned around; that is the disruption. `aim()` un-rotates the pointer around the canvas center, so mouse and touch still follow where you point.
      - A rainbow timer bar sits in the middle of the top strip. The rotation resets on a lost life, stage clear, a new stage, game over and a new game.
    - **Pink heart cat** (`HEART_CAT`, owner request 2026-10-21: heart eyes `e` = red, a smile, body `PINK` = #ffb3c7 / #ffd9e4, a palette exception like green): **+1 heart**, up to `MAX_LIVES` = 5. It pops a pixel heart sprite (pops can carry `spr`) and plays `milestone`. The HUD shows `max(3, lives)` heart slots, and the clear window shows hearts as `lives / max(3, lives)`.
    - The **green smiling good cat** makes the paddle 15% longer; the **red angry bad cat** makes it 15% shorter, each times its width at that moment (owner changed this from 10%) (`resizePaddle`, centered, clamped to 20–80 px with a start of 40).
    - A pixel +/− pops above the paddle (the gold cat pops !). The sleepy cat instead shows a **ZZ** (`zz()`): a small Z, then a big Z, drifting slowly up-right with a sway. `Retro.text` has a `Z` glyph for it. The width lasts until game over, missed cats vanish, and falling cats clear on a new stage.
    - **Palette exception:** green (`GREEN` = #5fd068 / #b4f2a6 / #2f8f45) is outside the 10-color palette. The owner asked for it because orange did not stand out.
  - The owner asked for ❤️; pixel hearts follow the no-emoji rule.
  - **Preview pages:**
    - `brick-if-stage2.html` (redirects to `?preview=stage2`, `runStage2Demo()`) starts straight at stage 2, the cat layout, at speed 2.41.
    - `IS_PREVIEW` and `PREVIEW_KEY` are declared at the top of the script, so early code never hits a TDZ error.
    - `brick-if-items.html` (redirects to `?preview=items`, `runItemsDemo()`) is the cat demo: 21 bricks (3 rows of 7, shifted half a brick to center), each with a fixed `b.item`, so all 7 kinds drop exactly **three times** in a shuffled order (owner request). 계속하기 / 다시 하기 restart the demo.
    - `brick-if-clear.html` redirects to `brick.html?preview=clear` (`PREVIEWS` / `runPreview()`).
    - It leaves one brick with the ball flying at it, so the stage-clear moment plays. The PREVIEW bar has 다시 보기, and `saveBest` is disabled in preview.
    - Headless virtual time barely advances the rAF loop. To check the clear moment, step `update(1)` in a temporary copy instead.
  - **Light mode:** brick uses the shared theme (see Design direction).
    - The page uses a cream background with ink text, lighter scanlines and cream buttons.
    - The canvas uses a cream-to-pale-lilac (`#e9e1fb`) sky, and the ball turns ink so it stays visible.
    - The light styles are page-local CSS in brick.html, not in retro.css.
- **`brawl/` (Brawl-style copies, since 2026-10-21)**: the owner asked for copies of the arcade and all 5 games "like Brawl Stars". `index.html` links to them with a teal **Brawl Arcade** button (`.brawl-link`, #17788a) between ARCADE and LABS, and the brawl arcade's Back returns to index.
  - **Pages:** `brawl/arcade.html`, `catch.html`, `run.html`, `puzzle.html`, `rps.html` and `brick.html`.
    - The game rules, numbers and localStorage keys are identical to the originals, so best scores are shared.
    - The originals stay untouched. **A rule change to an original game does not reach its brawl copy automatically**; ask the owner whether to mirror it.
  - **Not Brawl Stars itself:** never use its name, logo, characters or skull motif, only the genre's UI grammar (see `.impeccable/surfaces/brawl-arcade-html.md`, the direction contract).
  - **Look:** a blue sunburst background, fat ink outlines, glossy candy buttons with a dark under-lip, tilted yellow shout titles, `.chip` score pills, and navy info plates behind body text.
    - Palette tokens live in `brawl/brawl.css`: ink, sky, sun, leaf, berry, grape, cat, milk.
    - It deliberately breaks the 8-bit rules: smooth vector canvas art, and no pixel sprites or Galmuri. There is no light mode.
  - **Fonts:**
    - `fonts/brawl-fonts.css` embeds Lilita One (Latin) and Black Han Sans (Hangul, every Google unicode-range slice) as base64 woff2. Both are OFL; see `CREDITS.md`.
    - Canvas text waits for `Toon.ready()`.
  - **`brawl/brawl.css`:** the shared UI. It reuses the retro class names (`.top`, `.band`, `.how`, `.board`, `.screen`, `.hud`, `.overlay`, `.btn`, `.btn-ghost`), so page markup ports 1:1.
    - Button variants are `.btn.go` (green), `.danger` and `.grape`.
    - `.touch-only` / `.desk-only` switch guidance by pointer type.
    - Under 560px, `.btn-ghost .label` hides and the button shows only its icon.
  - **`brawl/toon.js` (global `Toon`):** load it after `../retro.js`. Sound still uses `Retro.sfx`; the mute setting is shared.
    - `Toon.icon` / `icons()`: outlined SVG icons via `data-icon`.
    - `mountMute`.
    - `setup(canvas, W, H, 3)`: keeps the logical game coordinates and renders at 3×. **Map pointers with the logical W, never `canvas.width`.**
    - Drawing helpers: `box`, `ball`, `heart`, `star`, `text`, `sky`, `springOut`.
    - `cat(ctx, cx, cy, size, {coat, mood, look, t})`: the shared cartoon cat face. Moods: happy, blink, angry, sleepy, wow, dizzy (spinning swirl eyes), love, sad, grin, plus the default open eyes.
  - **Mobile:** viewport-fit, safe-area padding, thumb-size buttons (44px or more), one-column arcade tiles, and boards that fill 390px.
    - run has a touch-only **숙이기** hold button. The puzzle stage uses `touch-action: pan-y`.
  - **Vibration (`Toon.buzz(kind)`):**
    - It uses `navigator.vibrate`, guarded by `userActivation`. iPhone Safari does not support it.
    - A capture-phase `pointerdown` gives a light `tap` on any button or link, and on a touch on the canvas or stage.
    - Games add their own buzzes: `pick` (catch or score), `good` (combo or good item), `bump` (light collision; the brick paddle is throttled to once every 20 frames), `hit` (strong: life lost, crash, round loss), `over` (game over) and `win` (clear, record, match win).
  - **Per page:**
    - catch: the red X is now a spiky bomb, so the copy says "빨간 가시 폭탄".
    - brick: capsules are round badges with `Toon.cat` faces.
    - rps: the hands, trophy, chest and handshake are new outlined SVGs.
    - puzzle: pieces use an SVG port of the cat face (`faceSVG`).
  - **Detector:** `low-contrast` (ink-outlined text), `repeating-stripes-gradient` (the sunburst) and brick's `bounce-easing` are sanctioned ignores in `.impeccable/config.json`.
- **`rpg.html` (PROTOTYPE, not linked from arcade yet)**: "냥이 삼총사", a rock-paper-scissors party RPG with 3 cat heroes against 3 noise villains.
  - Heroes: 치즈 (rock, double damage), 라일락 (paper, heals the weakest ally) and 크림 (scissors, peeks at the target's next hand).
  - Villains: 삑삑이 (60% rock), 지지직 (60% scissors, 25% double hit) and 노이즈 킹 (random, switches to 60% paper at half HP). Villain sprites are `SPEAKER`, `RECORD` and `KING` inside rpg.html.
  - A turn is: pick a hero, then a target, then a hand. A win damages the villain, a loss hurts the hero, and a draw costs both 1. Three wins in a row show COMBO.
  - It reuses `catFace`, the hand sprites, `trophy`, `sadFace` and the CC0 meow clips. Random play wins about 52% of games.
- **Labs (long-term project, since 2026-10-14)**: quick prototypes of the 4 ideas in `game-ideas.md`, for comparing them.
  - The ideas file is the spec: ask the owner before filling any "미정" item.
  - `index.html` has a **LABS** button under ARCADE (`.hero-links`, outline variant `.labs-link`) that leads to `labs.html`.
  - **Labs does not use the 8-bit retro style.** It is a deliberately plain list page, and the games use smooth Canvas with soft glows.
    - Palette from game-ideas.md: `#1B2559` / `#121A45` / `#0C1233` indigo, `#FF9A3C` orange, `#FFD66B` yellow, `#FFE9A8` pale. Font: Pretendard (`../fonts/pretendard.css`).
    - No sound effects, one-line messages only, soft endings with a 다시 한 번 button.
    - State is shown by brightness more than by numbers.
  - Games in `labs/`. Each keeps its temporary tuning values in a `TUNE` object at the top of the script.
    - `ember.html` 불씨: the ember follows the pointer. Stay `TUNE.dwell` seconds near a dark lantern to light it. The warmth gauge drains over time and in fog. Lanterns are placed at random. A first-play dotted hint is stored in `localStorage["labs-ember-seen"]`.
    - `lighthouse-cat.html` 등대지기 고양이: grid one-stroke puzzle with 3 handmade `STAGES` (`#` wall, `C` cat, `L` lantern). Tap or press an arrow key to step to an adjacent tile. Visited tiles cannot be reentered. Light every lantern to clear the stage; with no moves left, the stage restarts. A DFS check showed every stage solvable (9–12 solutions each).
    - `until-dawn.html` 새벽까지: a sun marble pulled toward the pointer with inertia. Star shards refill its light and shadows drain it. Survive `TUNE.night` = 60s to reach dawn, while the sky warms from the bottom; light at 0 ends the run.
    - `glow-garden.html` 빛의 정원: a 15×11 tile garden. Move with arrows or WASD and plant with Space. A seed blooms after 3s, clears darkness within 2 tiles and protects those tiles; neighboring blooms score a bonus with light links. Darkness spreads from the edges, faster over time. The run ends when darkness reaches the center lantern.
- **Not part of the site:**
  - `index-chibi-backup.html`: the old chibi version, kept as a palette reference.
  - `parkchanjong_1st_index.html` and `pbakaus.impeccable.txt`: the owner's own files. Don't touch them.
  - `ref-images-1/` (references) and `errors/` (the owner's screenshots).

## Content rules (from PRODUCT.md)

- Never show the owner's birth year, or anything that reveals it.
- Only confirmed personal facts appear on the page. Don't invent works, tracks or achievements.
- Don't bring back retired interactions (emoji bursts, the "반가워요!" alert, and others) unless asked.

## Editing gotchas

- Don't use `sed` with `\n` inside JS strings. It inserts real newlines and breaks the script. Use the Edit tool.
- PowerShell 5.1 `.ps1` files that contain Korean must be saved as UTF-8 **with BOM**.
