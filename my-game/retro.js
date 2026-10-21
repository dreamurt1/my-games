// ─────────────────────────────────────────────
// 8bit 공용 도구 (arcade · catch · run · puzzle 이 함께 써요)
//  - PAL: 10색 팔레트
//  - SPR: 픽셀 스프라이트 (글자 한 개 = 픽셀 한 칸)
//  - draw / svg / text: 스프라이트를 캔버스·SVG에 찍기
//  - sfx / mountMute: 8bit 효과음과 음소거
// ─────────────────────────────────────────────
const Retro = (() => {
  // 팔레트: 글자 → 색
  const PAL = {
    k: "#0d0520", // 밤 (가장 어두운 색, 외곽선)
    d: "#1a0b3b", // 짙은 인디고
    i: "#2b1055", // 인디고
    v: "#7c5cff", // 보라
    p: "#b9a6ff", // 연보라
    c: "#fff1e0", // 크림
    o: "#f7924a", // 주황
    h: "#ffc58e", // 밝은 주황
    l: "#d8692e", // 짙은 주황
    r: "#ff6b6b", // 빨강 (위험)
  };

  // ── 스프라이트 ('.' = 투명) ──
  const SPR = {
    // 정면 고양이 얼굴 16×16
    catFace: [
      "................",
      ".kk..........kk.",
      ".kok........kok.",
      ".kook......kook.",
      ".kolokkkkkkolok.",
      ".kooooooooooook.",
      "kooooooooooooook",
      "kooccooooooccook",
      "koockoooooockook",
      "kooooooooooooook",
      "kooooccccccooook",
      "kooocccckkcccook",
      ".kooccccccccook.",
      "..kooooooooook..",
      "...kkkkkkkkkk...",
      "................",
    ],
    // 눈 감은 프레임
    catBlink: [
      "................",
      ".kk..........kk.",
      ".kok........kok.",
      ".kook......kook.",
      ".kolokkkkkkolok.",
      ".kooooooooooook.",
      "kooooooooooooook",
      "kooooooooooooook",
      "kookkooooookkook",
      "kooooooooooooook",
      "kooooccccccooook",
      "kooocccckkcccook",
      ".kooccccccccook.",
      "..kooooooooook..",
      "...kkkkkkkkkk...",
      "................",
    ],
    // 옆모습 달리는 고양이 18×13, 2프레임
    catRunA: [
      "............k..k..",
      "...........kokkok.",
      ".k.........kooook.",
      "kok........kockok.",
      "kok.kkkkkkkkooochk",
      ".kokoooooooooocck.",
      "..kooooooooooookk.",
      "..kooooooooooook..",
      "..klooooooooolok..",
      "...kooookkkooook..",
      "...kok.....kok....",
      "..kok.......kok...",
      "..kk.........kk...",
    ],
    catRunB: [
      "............k..k..",
      "...........kokkok.",
      ".k.........kooook.",
      "kok........kockok.",
      "kok.kkkkkkkkooochk",
      ".kokoooooooooocck.",
      "..kooooooooooookk.",
      "..kooooooooooook..",
      "..klooooooooolok..",
      "...kooookkkooook..",
      "....kok...kok.....",
      "....kok...kok.....",
      "....kk....kk......",
    ],
    // 숙인 고양이 20×8
    catDuck: [
      "...............k.k..",
      "..............kokok.",
      "kk.kkkkkkkkkkkkocokk",
      "kokoooooooooooooochk",
      ".koooooooooooooooock",
      "..kooooooooooooookk.",
      "..kok..kok..kok.kok.",
      "..kk...kk...kk..kk..",
    ],
    // 레코드판 12×12, 2프레임 (반짝이가 돌아요)
    recordA: [
      "....kkkk....",
      "..kkddddkk..",
      ".kdpddddddk.",
      ".kpdddddddk.",
      "kdddoooodddk",
      "kdddoccodddk",
      "kdddoccodddk",
      "kdddoooodddk",
      ".kdddddddpk.",
      ".kddddddpdk.",
      "..kkddddkk..",
      "....kkkk....",
    ],
    recordB: [
      "....kkkk....",
      "..kkddddkk..",
      ".kddddddpdk.",
      ".kdddddddpk.",
      "kdddoooodddk",
      "kdddoccodddk",
      "kdddoccodddk",
      "kdddoooodddk",
      ".kpdddddddk.",
      ".kdpddddddk.",
      "..kkddddkk..",
      "....kkkk....",
    ],
    // 빨간 X 10×10
    bad: [
      "kkk....kkk",
      "krrk..krrk",
      "kkrrkkrrkk",
      ".kkrrrrkk.",
      "..krrrrk..",
      "..krrrrk..",
      ".kkrrrrkk.",
      "kkrrkkrrkk",
      "krrk..krrk",
      "kkk....kkk",
    ],
    // 초승달 12×12
    moon: [
      "...hhhhh....",
      ".hhhhh......",
      ".hhhh.......",
      "hhhh........",
      "hhho........",
      "hhho........",
      "hhhh........",
      "hhhhh.......",
      ".hhhhh......",
      ".hhhhhhh..h.",
      "..hhhhhhhh..",
      "....hhhh....",
    ],
    // 스피커 콘 6×6
    cone: [
      ".pppp.",
      "pkkkkp",
      "pkookp",
      "pkookp",
      "pkkkkp",
      ".pppp.",
    ],
    // 퍼즐 고양이 꼬리 16×16 (짙은 색 'l')
    tail: [
      "................",
      "................",
      "................",
      "................",
      "..........lll...",
      ".........l...l..",
      ".........l......",
      "..........l.....",
      "...........l....",
      "...........l....",
      "..........l.....",
      ".........l......",
      "......lll.......",
      "....ll..........",
      "................",
      "................",
    ],
    // 가위바위보 손 16×16 (c 피부, h 하이라이트, l 그림자)
    handRock: [
      "................",
      "................",
      "...kkkkkkkkkk...",
      "..kchkchkchkck..",
      "..kcckcckcckck..",
      "..kcckcckcckck..",
      "..kkkkkkkkkkck..",
      ".kcccccccccccck.",
      ".kkkkkkkkcccck..",
      "..kccccccccccck.",
      "..kcccccccccck..",
      "...kllllllllk...",
      "....kkkkkkkk....",
      "................",
      "................",
      "................",
    ],
    handScissors: [
      "..kk......kk....",
      ".kcck....kcck...",
      ".kchk....kchk...",
      "..kcck..kcck....",
      "..kchk..kchk....",
      "...kcckkcck.....",
      "..kkcccccckkk...",
      ".kccccccckcck...",
      ".kcccccccckck...",
      ".kkkkcccccccck..",
      "..kcccccccccck..",
      "..kccccccccck...",
      "...kllllllllk...",
      "....kkkkkkkk....",
      "................",
      "................",
    ],
    handPaper: [
      "...kk.kk.kk.kk..",
      "..kcckcckcckcck.",
      "..kchkchkchkchk.",
      "..kcckcckcckcck.",
      "..kcckcckcckcck.",
      "..kcckcckcckcck.",
      "..kccccccccccck.",
      "kk.kcccccccccck.",
      "kckkccccccccccck",
      "kcccccccccccccck",
      ".kkccccccccccck.",
      "...kcccccccccck.",
      "....kllllllllk..",
      ".....kkkkkkkk...",
      "................",
      "................",
    ],
    // 트로피 16×16
    trophy: [
      "................",
      "...kkkkkkkkkk...",
      ".kkkhhhhhhhookk.",
      "kh.khhhhhhook.hk",
      "kh.khhhhhhook.hk",
      ".kkkhhhhhhookkk.",
      "...khhhhhook....",
      "....khhhook.....",
      ".....khhok......",
      "......kok.......",
      "......kok.......",
      ".....kooook.....",
      "....kllllllk....",
      "....kvvvvvvk....",
      "....kkkkkkkk....",
      "................",
    ],
    // 반짝 별 9×9 (이겼다)
    star: [
      "....k....",
      "...khk...",
      "...khk...",
      ".kkhhhkk.",
      "khhhohhhk",
      ".kkhhhkk.",
      "...khk...",
      "...khk...",
      "....k....",
    ],
    // 우는 얼굴 12×12 (졌다)
    sadFace: [
      "...kkkkkk...",
      ".kkppppppkk.",
      ".kppppppppk.",
      "kppkppppkppk",
      "kppkppppkppk",
      "kppvppppvppk",
      "kppvppppvppk",
      "kppppkkppppk",
      ".kppkppkppk.",
      ".kkppppppkk.",
      "...kkkkkk...",
      "............",
    ],
    // 악수 16×7 (비겼다)
    handshake: [
      "kk............kk",
      "ook..kkkkkk..kpp",
      "oookkccccccckkpp",
      "oookccckcckccckp",
      "oookccckcckccckp",
      "ook.kccccccccck.",
      "kk...kkkkkkkkk..",
    ],
    // 보물 상자 16×16 (닫힘 / 열림)
    chestClosed: [
      "................",
      "................",
      "................",
      ".kkkkkkkkkkkkkk.",
      ".kooooooooooook.",
      ".kllllllllllllk.",
      ".kllllllllllllk.",
      ".kkkkkkcckkkkkk.",
      ".klllllcclllllk.",
      ".kllllllllllllk.",
      ".kllllllllllllk.",
      ".kllllllllllllk.",
      ".kllllllllllllk.",
      ".kkkkkkkkkkkkkk.",
      "................",
      "................",
    ],
    chestOpen: [
      ".kkkkkkkkkkkkkk.",
      ".kooooooooooook.",
      ".kkkkkkkkkkkkkk.",
      "..khhhhhhhhhhk..",
      ".khhhchhhhchhhk.",
      ".khhhhhhhhhhhhk.",
      ".kddddddddddddk.",
      ".kkkkkkcckkkkkk.",
      ".klllllcclllllk.",
      ".kllllllllllllk.",
      ".kllllllllllllk.",
      ".kllllllllllllk.",
      ".kllllllllllllk.",
      ".kkkkkkkkkkkkkk.",
      "................",
      "................",
    ],
    // UI 아이콘 ('x' = 글자색을 따라가요)
    heart: [".xx.xx.", "xxxxxxx", "xxxxxxx", ".xxxxx.", "..xxx..", "...x..."],
    arrowL: ["...x...", "..xx...", ".xxxxxx", "xxxxxxx", ".xxxxxx", "..xx...", "...x..."],
    arrowR: ["...x...", "...xx..", "xxxxxx.", "xxxxxxx", "xxxxxx.", "...xx..", "...x..."],
    soundOn: ["....x......", "...xx...x..", "xxxxx.x..x.", "xxxxx..x.x.", "xxxxx..x.x.", "xxxxx.x..x.", "...xx...x..", "....x......"],
    soundOff: ["....x......", "...xx......", "xxxxx.x...x", "xxxxx..x.x.", "xxxxx...x..", "xxxxx..x.x.", "...xx.x...x", "....x......"],
  };

  // ── 스프라이트 → 캔버스 (한 번 만들고 재사용) ──
  const cache = new Map();
  function sprite(rows, map = {}) {
    const key = rows.join("|") + JSON.stringify(map);
    if (cache.has(key)) return cache.get(key);
    const cv = document.createElement("canvas");
    cv.width = rows[0].length;
    cv.height = rows.length;
    const g = cv.getContext("2d");
    rows.forEach((row, y) => [...row].forEach((ch, x) => {
      if (ch === ".") return;
      g.fillStyle = map[ch] || PAL[ch] || ch;
      g.fillRect(x, y, 1, 1);
    }));
    cache.set(key, cv);
    return cv;
  }

  // 캔버스에 찍기: 정수 좌표, 정수 배율
  function draw(ctx, rows, x, y, { s = 1, map, flip = false } = {}) {
    const img = sprite(rows, map);
    ctx.imageSmoothingEnabled = false;
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));
    if (flip) { ctx.translate(img.width * s, 0); ctx.scale(-1, 1); }
    ctx.drawImage(img, 0, 0, img.width * s, img.height * s);
    ctx.restore();
  }

  // SVG 사각형 묶음 (가로로 이어진 칸은 하나로 합쳐요)
  function rects(rows, map = {}, ox = 0, oy = 0) {
    let out = "";
    rows.forEach((row, y) => {
      let x = 0;
      while (x < row.length) {
        const ch = row[x];
        let n = 1;
        while (row[x + n] === ch) n++;
        if (ch !== ".") out += `<rect x="${ox + x}" y="${oy + y}" width="${n}" height="1" fill="${map[ch] || PAL[ch] || ch}"/>`;
        x += n;
      }
    });
    return out;
  }

  function svg(rows, map = { x: "currentColor" }, cls = "px-icon") {
    return `<svg class="${cls}" viewBox="0 0 ${rows[0].length} ${rows.length}" shape-rendering="crispEdges" aria-hidden="true">${rects(rows, map)}</svg>`;
  }

  // ── 3×5 픽셀 숫자 글꼴 (캔버스 안 글자용) ──
  const FONT = {
    0: "111101101101111", 1: "010110010010111", 2: "111001111100111", 3: "111001111001111", 4: "101101111001001",
    5: "111100111001111", 6: "111100111101111", 7: "111001010010010", 8: "111101111101111", 9: "111101111001111",
    "+": "000010111010000", "-": "000000111000000", "!": "010010010000010", "?": "111001011000010", x: "000101010101000", Z: "111001010100111",
  };
  function text(ctx, str, x, y, { color = PAL.c, shadow = PAL.k, s = 1, align = "left" } = {}) {
    const w = (str.length * 4 - 1) * s;
    let cx = Math.round(align === "center" ? x - w / 2 : x);
    const put = (ox, oy, col) => {
      ctx.fillStyle = col;
      [...String(str)].forEach((ch, i) => {
        const bits = FONT[ch];
        if (!bits) return;
        [...bits].forEach((b, j) => {
          if (b === "1") ctx.fillRect(cx + ox + (i * 4 + (j % 3)) * s, Math.round(y) + oy + Math.floor(j / 3) * s, s, s);
        });
      });
    };
    if (shadow) put(s, s, shadow);
    put(0, 0, color);
  }

  const pad = (n, len = 6) => String(Math.max(0, Math.floor(n))).padStart(len, "0");

  // ── 효과음 (WebAudio로 만든 사각파 · 삼각파) ──
  let ac = null, master = null;
  let muted = false;
  try { muted = localStorage.getItem("retro-mute") === "1"; } catch (e) {}

  function audio() {
    if (!ac) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ac = new AC();
      master = ac.createGain();
      master.gain.value = 0.8;
      master.connect(ac.destination);
    }
    if (ac.state === "suspended") ac.resume();
    return ac;
  }

  function tone(f, t, dur, { type = "square", vol = 0.06, to = null } = {}) {
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f, t);
    if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(master);
    o.start(t);
    o.stop(t + dur + 0.02);
  }

  function noise(t, dur, vol = 0.12) {
    const buf = ac.createBuffer(1, Math.floor(ac.sampleRate * dur), ac.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const src = ac.createBufferSource(), g = ac.createGain();
    src.buffer = buf;
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(g).connect(master);
    src.start(t);
  }

  const notes = (list, t, gap, dur, opt) => list.forEach((f, i) => tone(f, t + i * gap, dur, opt));

  // ── 녹음된 소리 재생 (CC0 등 자유 이용 녹음, 출처는 CREDITS.md) ──
  // addSample(이름, base64 mp3)로 등록하고, playSample로 원하는 구간만 재생해요
  const samples = {};
  function addSample(key, b64) { samples[key] = { b64, buf: null, loading: null }; }

  function playSample(key, { offset = 0, dur, vol = 0.1, rate = 1, fade = 0.03 } = {}) {
    const s = samples[key];
    if (muted || !s) return;
    if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return;
    try {
      if (!audio()) return;
      const go = () => {
        const t = ac.currentTime + 0.01, len = dur / rate;
        const src = ac.createBufferSource(), g = ac.createGain();
        src.buffer = s.buf;
        src.playbackRate.value = rate;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(vol, t + fade);
        g.gain.setValueAtTime(vol, t + len - fade);
        g.gain.linearRampToValueAtTime(0.0001, t + len);
        src.connect(g).connect(master);
        src.start(t, offset, dur);
      };
      if (s.buf) return go();
      if (!s.loading) {
        const bin = atob(s.b64), u = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
        s.loading = ac.decodeAudioData(u.buffer).then((b) => { s.buf = b; });
      }
      s.loading.then(go).catch(() => {});
    } catch (e) {}
  }

  const SFX = {
    select: (t) => tone(660, t, 0.05),
    start: (t) => notes([523, 659, 784, 1047], t, 0.07, 0.09),
    coin: (t) => { tone(988, t, 0.06); tone(1319, t + 0.06, 0.18); },
    hit: (t) => { noise(t, 0.18, 0.14); tone(220, t, 0.18, { type: "sawtooth", vol: 0.05, to: 70 }); },
    over: (t) => notes([392, 330, 262, 196], t + 0.15, 0.13, 0.16, { type: "triangle", vol: 0.14 }),
    jump: (t) => tone(280, t, 0.14, { to: 620, vol: 0.05 }),
    milestone: (t) => { tone(1047, t, 0.07); tone(1568, t + 0.08, 0.12); },
    pause: (t) => { tone(784, t, 0.06); tone(523, t + 0.07, 0.08); },
    resume: (t) => { tone(523, t, 0.06); tone(784, t + 0.07, 0.08); },
    place: (t) => { tone(523, t, 0.05); tone(784, t + 0.05, 0.07); },
    rotate: (t) => tone(880, t, 0.04, { vol: 0.04 }),
    error: (t) => tone(150, t, 0.12, { vol: 0.05 }),
    clear: (t) => notes([523, 659, 784, 1047, 784, 1047], t, 0.09, 0.12),
    hype: (t) => { notes([659, 784, 988, 1319], t, 0.06, 0.08); tone(1319, t + 0.26, 0.2, { vol: 0.05 }); },
    almost: (t) => {
      notes([523, 659, 784, 1047, 1319, 1568], t, 0.055, 0.07);
      notes([1047, 1568, 2093], t + 0.36, 0.09, 0.16, { type: "triangle", vol: 0.12 });
      noise(t + 0.36, 0.2, 0.05);
    },
    // 나무 상자가 삐걱 열리는 소리 (직접 합성한 효과음)
    chest: (t) => {
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = "sawtooth";
      [110, 150, 92, 140, 84, 120].forEach((f, i) => o.frequency.linearRampToValueAtTime(f, t + i * 0.06));
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.06, t + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.38);
      o.connect(g).connect(master);
      o.start(t);
      o.stop(t + 0.4);
      noise(t + 0.34, 0.12, 0.1);                       // 뚜껑이 탁
      notes([1568, 2093, 2637], t + 0.46, 0.07, 0.14, { type: "triangle", vol: 0.08 }); // 반짝
    },
  };

  function sfx(name) {
    if (muted || !SFX[name]) return;
    // 브라우저 규칙: 클릭·키 입력이 한 번도 없었으면 소리를 켤 수 없어요 (콘솔 경고 방지)
    if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return;
    try { if (audio()) SFX[name](ac.currentTime + 0.01); } catch (e) {}
  }

  // 음소거 버튼: 모든 게임 페이지가 같은 설정을 공유해요
  function mountMute(btn) {
    const render = () => {
      btn.innerHTML = svg(muted ? SPR.soundOff : SPR.soundOn) + `<span>${muted ? "Sound off" : "Sound on"}</span>`;
      btn.setAttribute("aria-pressed", String(!muted));
      btn.setAttribute("aria-label", muted ? "효과음 켜기" : "효과음 끄기");
    };
    btn.addEventListener("click", () => {
      muted = !muted;
      try { localStorage.setItem("retro-mute", muted ? "1" : "0"); } catch (e) {}
      render();
      sfx("select");
    });
    render();
  }

  // 아이콘 자리 채우기: <span data-px="arrowL"></span>
  function icons(root = document) {
    root.querySelectorAll("[data-px]").forEach((el) => { el.innerHTML = svg(SPR[el.dataset.px]); });
  }

  // ── 라이트 모드: 모든 게임 페이지가 같은 설정을 공유해요 ──
  const SUN = ["....x....", ".x.....x.", "...xxx...", "..xxxxx..", "x.xxxxx.x", "..xxxxx..", "...xxx...", ".x.....x.", "....x...."];
  const MOON = ["..xxx...", ".xx.....", "xx......", "xx......", "xx......", "xx......", ".xx.....", "..xxx..."];
  let light = false;
  try {
    const saved = localStorage.getItem("retro-theme") || localStorage.getItem("brick-theme"); // 예전 벽돌깨기 설정도 이어받기
    light = saved === "light";
  } catch (e) {}

  const isLight = () => light;

  // btn: 헤더의 Light/Dark 버튼, onChange: 캔버스를 다시 그리는 함수
  function mountTheme(btn, onChange) {
    const render = () => {
      document.body.classList.toggle("light", light);
      // 버튼에는 "누르면 바뀔 모드"를 보여줘요
      btn.innerHTML = svg(light ? MOON : SUN) + `<span>${light ? "Dark" : "Light"}</span>`;
      btn.setAttribute("aria-label", light ? "다크 모드로 바꾸기" : "라이트 모드로 바꾸기");
      btn.setAttribute("aria-pressed", String(light));
    };
    btn.addEventListener("click", () => {
      light = !light;
      try { localStorage.setItem("retro-theme", light ? "light" : "dark"); } catch (e) {}
      render();
      sfx("select");
      if (onChange) onChange(light);
    });
    // 다른 창에서 바꾼 설정 따라가기:
    //  - pageshow: 뒤로 가기로 돌아와 브라우저가 예전 화면을 그대로 보여 줄 때
    //  - storage: 다른 탭에서 바꿨을 때
    const sync = () => {
      let saved = null;
      try { saved = localStorage.getItem("retro-theme"); } catch (e) {}
      if (saved === null) return;
      const next = saved === "light";
      if (next === light) return;
      light = next;
      render();
      if (onChange) onChange(light);
    };
    window.addEventListener("pageshow", sync);
    window.addEventListener("storage", (e) => { if (e.key === "retro-theme") sync(); });
    render();
  }

  return { PAL, SPR, sprite, draw, rects, svg, text, pad, sfx, mountMute, icons, addSample, playSample, mountTheme, isLight };
})();
