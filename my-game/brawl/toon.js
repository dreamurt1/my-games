// ─────────────────────────────────────────────
// Toon: 브롤 스타일 페이지(brawl/) 공용 도구
//  - 굵은 외곽선 아이콘(SVG), 효과음 버튼, 진동(바이브레이터)
//  - 캔버스 만화 그림: 외곽선 도형, 반짝이 · 그림자, 고양이 얼굴(표정 여러 개), 하트 · 별, 햇살 하늘
//  - ../retro.js 다음에 불러와요 (효과음 Retro.sfx · 숫자 Retro.pad는 그대로 써요)
// ─────────────────────────────────────────────
const Toon = (() => {
  // ── 색 (brawl.css의 색과 같아요) ──
  const C = {
    ink: "#120c24", navy: "#0b1d5e",
    skyLo: "#1447c4", sky: "#1e6bff", skyHi: "#4f9bff",
    sunLo: "#f29d0b", sun: "#ffd23f", sunHi: "#fff27a",
    leafLo: "#1e9b2a", leaf: "#3fd34a", leafHi: "#9cf26f",
    berryLo: "#c41d4b", berry: "#ff3d6e", berryHi: "#ff8fb0",
    grapeLo: "#5a25c9", grape: "#8b4dff", grapeHi: "#c4a2ff",
    catLo: "#d9600f", cat: "#ff8a2b", catHi: "#ffc07a",
    milk: "#ffffff", cream: "#fff6e6", pink: "#ff9fb8", mist: "#d9e6ff",
  };

  // 색을 밝게(+) · 어둡게(-) : amt = -1 ~ 1
  function tint(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    const to = amt < 0 ? 0 : 255, k = Math.abs(amt);
    r = Math.round(r + (to - r) * k); g = Math.round(g + (to - g) * k); b = Math.round(b + (to - b) * k);
    return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
  }

  // ── 아이콘 (24×24, 잉크 외곽선은 paint-order로 바깥쪽에) ──
  const O = `stroke="${C.ink}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" paint-order="stroke"`;
  const ICONS = {
    back: `<path d="M11 3.5 3 12l8 8.5V15h10V9H11z" fill="${C.milk}" ${O}/>`,
    next: `<path d="M13 3.5 21 12l-8 8.5V15H3V9h10z" fill="${C.milk}" ${O}/>`,
    play: `<path d="M7 4.5v15l13-7.5z" fill="${C.milk}" ${O}/>`,
    soundOn: `<path d="M3 9h4l5.5-4.5v15L7 15H3z" fill="${C.milk}" ${O}/>`
      + `<path d="M15.5 8.5c1.6 2 1.6 5 0 7M18.5 5.5c3.2 3.6 3.2 9.4 0 13" fill="none" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/>`
      + `<path d="M15.5 8.5c1.6 2 1.6 5 0 7M18.5 5.5c3.2 3.6 3.2 9.4 0 13" fill="none" stroke="${C.milk}" stroke-width="2" stroke-linecap="round"/>`,
    soundOff: `<path d="M3 9h4l5.5-4.5v15L7 15H3z" fill="${C.milk}" ${O}/>`
      + `<path d="m15.5 9 6 6m0-6-6 6" fill="none" stroke="${C.ink}" stroke-width="5.5" stroke-linecap="round"/>`
      + `<path d="m15.5 9 6 6m0-6-6 6" fill="none" stroke="${C.berry}" stroke-width="2.4" stroke-linecap="round"/>`,
    star: `<path d="m12 2.5 2.9 6 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.2 1.3-6.6-4.9-4.6 6.6-.8z" fill="${C.sun}" ${O}/>`
      + `<path d="m12 6 1.6 3.4" stroke="${C.sunHi}" stroke-width="1.6" stroke-linecap="round"/>`,
    heart: `<path d="M12 20.5S3 15 3 8.8C3 6 5.1 4 7.6 4c1.9 0 3.4 1.1 4.4 2.6C13 5.1 14.5 4 16.4 4 18.9 4 21 6 21 8.8 21 15 12 20.5 12 20.5z" fill="${C.berry}" ${O}/>`
      + `<path d="M6.8 7.6c.4-.9 1.1-1.4 2-1.5" stroke="${C.berryHi}" stroke-width="1.8" stroke-linecap="round" fill="none"/>`,
    trophy: `<path d="M7 3.5h10v5a5 5 0 0 1-10 0z" fill="${C.sun}" ${O}/>`
      + `<path d="M7 5H4.5v1.5A3.5 3.5 0 0 0 8 10M17 5h2.5v1.5A3.5 3.5 0 0 1 16 10" fill="none" stroke="${C.ink}" stroke-width="2.4"/>`
      + `<path d="M10.5 13.5h3v3h2.5v3.5H8V16.5h2.5z" fill="${C.sunLo}" ${O}/>`,
    puzzle: `<path d="M4 7h4a2.5 2.5 0 1 1 5 0h4v4a2.5 2.5 0 1 1 0 5v4H4z" fill="${C.grapeHi}" ${O}/>`,
    check: `<path d="m4 12.5 5 5L20 6.5" fill="none" stroke="${C.ink}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`
      + `<path d="m4 12.5 5 5L20 6.5" fill="none" stroke="${C.leaf}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`,
    pause: `<path d="M6 4.5h4v15H6zM14 4.5h4v15h-4z" fill="${C.milk}" ${O}/>`,
  };

  const icon = (name, cls = "ico") => `<svg class="${cls}" viewBox="-1 -1 26 26" aria-hidden="true" focusable="false">${ICONS[name] || ""}</svg>`;

  // 아이콘 자리 채우기: <span data-icon="back"></span>
  function icons(root = document) {
    root.querySelectorAll("[data-icon]").forEach((el) => { el.innerHTML = icon(el.dataset.icon); });
  }

  // 효과음 버튼: 원본과 같은 설정(localStorage "retro-mute")을 같이 써요
  function mountMute(btn) {
    Retro.mountMute(btn); // 켜고 끄기는 Retro가 해요
    const render = () => {
      const on = btn.getAttribute("aria-pressed") === "true";
      btn.innerHTML = icon(on ? "soundOn" : "soundOff") + `<span class="label">${on ? "Sound on" : "Sound off"}</span>`;
    };
    btn.addEventListener("click", render);
    render();
  }

  // ── 진동 (휴대폰의 바이브레이터) ──
  //  약한 진동 = 버튼 · 화면 터치, 강한 진동 = 목숨 감소 · 부딪힘, 그 외는 상황에 맞게
  //  아이폰(사파리)은 진동을 지원하지 않아서 조용히 넘어가요
  const BUZZ = {
    tap: 12,                       // 버튼 · 화면 터치 (약하게)
    pick: 18,                      // 아이템 줍기 · 점수
    good: [20, 40, 30],            // 좋은 일 (콤보 · 아이템 효과)
    hit: [160],                    // 부딪힘 · 목숨 감소 (강하게)
    bump: 45,                      // 가벼운 부딪힘 (벽 · 패들)
    over: [220, 90, 320],          // 게임 오버 (아주 강하게)
    win: [40, 50, 40, 50, 180],    // 승리 · 클리어
  };
  function buzz(kind = "tap") {
    if (!navigator.vibrate) return;
    // 브라우저 규칙: 화면을 한 번도 누르지 않았으면 진동을 켤 수 없어요 (콘솔 경고 방지)
    if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return;
    try { navigator.vibrate(BUZZ[kind] ?? kind); } catch (e) {}
  }
  // 버튼 · 링크를 누르거나 게임 화면을 터치하면 약한 진동 (게임이 더 센 진동을 바로 이어서 덮어쓸 수 있게 capture 단계에서 먼저)
  document.addEventListener("pointerdown", (e) => {
    const t = e.target;
    if (!(t instanceof Element)) return;
    if (t.closest("button, a, [role='button']") || (e.pointerType === "touch" && t.closest("canvas, .stage, .arena, .screen-wrap"))) buzz("tap");
  }, { capture: true, passive: true });

  // 시작 · 일시정지 · 게임오버 화면(.overlay)의 내용을 가운데 안내판(.plate)으로 감싸요
  //  (게임 그림은 뒤에서 그대로 보이고, 글자와 버튼만 판 위에. 요소를 옮기기만 해서 id와 이벤트는 그대로)
  document.querySelectorAll(".overlay").forEach((o) => {
    if (o.querySelector(":scope > .plate")) return;
    const plate = document.createElement("div");
    plate.className = "plate";
    while (o.firstChild) plate.appendChild(o.firstChild);
    o.appendChild(plate);
  });

  // ── 캔버스 준비: 게임 좌표(w×h)는 그대로, 실제 그림은 s배로 선명하게 ──
  function setup(canvas, w, h, s = 3) {
    canvas.width = Math.round(w * s);
    canvas.height = Math.round(h * s);
    const ctx = canvas.getContext("2d");
    ctx.setTransform(s, 0, 0, s, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    return ctx;
  }

  // 글꼴이 준비되면 다시 그리기 (캔버스 글자용)
  function ready(fn) {
    if (!document.fonts || !document.fonts.load) return fn();
    Promise.all([document.fonts.load('20px "Lilita One"'), document.fonts.load('20px "Black Han Sans"', "가")])
      .then(fn, fn);
  }

  // ── 도형 ──
  function rr(ctx, x, y, w, h, r) {
    r = Math.max(0, Math.min(r, w / 2, h / 2));
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  // 지금 만든 경로를 만화풍으로 칠하기: 아래 그림자 → 바탕 → 아래쪽 어두운 띠 → 위쪽 반짝이 → 외곽선
  //  opts: line(외곽선 두께), drop(아래로 떨어지는 그림자), shade(아래 어두운 정도), gloss(반짝이), bounds([x,y,w,h])
  function paint(ctx, fill, opts = {}) {
    const { line = 1.6, ink = C.ink, drop = 0, shade = 0.22, gloss = 0.5, bounds = null } = opts;
    const path = new Path2D();
    // 현재 경로를 Path2D로 옮길 수 없어서, 호출하는 쪽이 build()를 넘기는 방식도 지원해요
    if (opts.build) opts.build(path);
    const usePath = opts.build ? path : null;
    const doFill = (style) => { ctx.fillStyle = style; usePath ? ctx.fill(usePath) : ctx.fill(); };
    if (drop) {
      ctx.save(); ctx.translate(0, drop); doFill(ink); ctx.restore();
    }
    doFill(fill);
    if (bounds && (shade || gloss)) {
      const [bx, by, bw, bh] = bounds;
      ctx.save();
      usePath ? ctx.clip(usePath) : ctx.clip();
      if (shade) { ctx.fillStyle = tint(fill, -shade); ctx.fillRect(bx - 2, by + bh * 0.68, bw + 4, bh * 0.4); }
      if (gloss) {
        ctx.globalAlpha = gloss;
        ctx.fillStyle = C.milk;
        rr(ctx, bx + bw * 0.12, by + bh * 0.1, bw * 0.76, Math.max(1.2, bh * 0.16), bh * 0.08);
        ctx.fill();
      }
      ctx.restore();
    }
    if (line) {
      ctx.lineWidth = line; ctx.strokeStyle = ink;
      usePath ? ctx.stroke(usePath) : ctx.stroke();
    }
  }

  // 둥근 네모 (벽돌 · 버튼 · 판)
  function box(ctx, x, y, w, h, r, fill, opts = {}) {
    paint(ctx, fill, { ...opts, bounds: [x, y, w, h], build: (p) => {
      r = Math.max(0, Math.min(r, w / 2, h / 2));
      p.moveTo(x + r, y); p.arcTo(x + w, y, x + w, y + h, r); p.arcTo(x + w, y + h, x, y + h, r);
      p.arcTo(x, y + h, x, y, r); p.arcTo(x, y, x + w, y, r); p.closePath();
    } });
  }

  // 동그라미 (공 · 레코드)
  function ball(ctx, x, y, r, fill, opts = {}) {
    paint(ctx, fill, { gloss: 0, ...opts, bounds: [x - r, y - r, r * 2, r * 2], build: (p) => { p.arc(x, y, r, 0, Math.PI * 2); } });
    if (opts.shine !== false) { // 동그란 반짝이 점
      ctx.fillStyle = "rgba(255,255,255,0.8)";
      ctx.beginPath(); ctx.ellipse(x - r * 0.38, y - r * 0.42, r * 0.24, r * 0.16, -0.6, 0, Math.PI * 2); ctx.fill();
    }
  }

  // 외곽선 글자 (Lilita One · 한글은 Black Han Sans)
  function text(ctx, str, x, y, { size = 12, color = C.milk, align = "center", baseline = "middle", line = null, drop = null, font = null } = {}) {
    ctx.save();
    ctx.font = `${size}px ${font || '"Lilita One", "Black Han Sans", sans-serif'}`;
    ctx.textAlign = align; ctx.textBaseline = baseline;
    const lw = line ?? Math.max(1.2, size * 0.2);
    const dy = drop ?? Math.max(0.8, size * 0.1);
    ctx.lineJoin = "round"; ctx.strokeStyle = C.ink; ctx.fillStyle = C.ink; ctx.lineWidth = lw;
    if (dy) { ctx.strokeText(str, x, y + dy); ctx.fillText(str, x, y + dy); }
    ctx.strokeText(str, x, y);
    ctx.fillStyle = color; ctx.fillText(str, x, y);
    ctx.restore();
  }

  // 하트 (cx, cy = 가운데, s = 너비)
  function heart(ctx, cx, cy, s, fill = C.berry, opts = {}) {
    const k = s / 24;
    paint(ctx, fill, { line: opts.line ?? Math.max(1, s * 0.09), gloss: 0, shade: 0.18, ...opts, bounds: [cx - s / 2, cy - s / 2, s, s], build: (p) => {
      const X = (v) => cx + (v - 12) * k, Y = (v) => cy + (v - 12) * k;
      p.moveTo(X(12), Y(20.5));
      p.bezierCurveTo(X(12), Y(20.5), X(3), Y(15), X(3), Y(8.8));
      p.bezierCurveTo(X(3), Y(6), X(5.1), Y(4), X(7.6), Y(4));
      p.bezierCurveTo(X(9.5), Y(4), X(11), Y(5.1), X(12), Y(6.6));
      p.bezierCurveTo(X(13), Y(5.1), X(14.5), Y(4), X(16.4), Y(4));
      p.bezierCurveTo(X(18.9), Y(4), X(21), Y(6), X(21), Y(8.8));
      p.bezierCurveTo(X(21), Y(15), X(12), Y(20.5), X(12), Y(20.5));
      p.closePath();
    } });
    ctx.strokeStyle = "rgba(255,255,255,0.75)"; ctx.lineWidth = s * 0.07;
    ctx.beginPath(); ctx.arc(cx - s * 0.2, cy - s * 0.12, s * 0.12, Math.PI * 1.1, Math.PI * 1.6); ctx.stroke();
  }

  // 별 (cx, cy, r = 바깥 반지름)
  function star(ctx, cx, cy, r, fill = C.sun, opts = {}) {
    paint(ctx, fill, { line: opts.line ?? Math.max(1, r * 0.18), gloss: 0, shade: 0.15, ...opts, bounds: [cx - r, cy - r, r * 2, r * 2], build: (p) => {
      for (let i = 0; i < 10; i++) {
        const a = -Math.PI / 2 + (i * Math.PI) / 5, rad = i % 2 ? r * 0.48 : r;
        const px = cx + Math.cos(a) * rad, py = cy + Math.sin(a) * rad;
        i ? p.lineTo(px, py) : p.moveTo(px, py);
      }
      p.closePath();
    } });
  }

  // 햇살 하늘: 위 가운데에서 퍼지는 줄무늬 + 위아래 그라데이션
  function sky(ctx, w, h, { top = C.skyHi, bottom = C.sky, ray = "rgba(255,255,255,0.09)", cx = w / 2, cy = -h * 0.15, spin = 0, rays = 14 } = {}) {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, top); g.addColorStop(1, bottom);
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = ray;
    const R = Math.hypot(w, h) * 1.4;
    for (let i = 0; i < rays; i++) {
      const a = spin + (i * Math.PI * 2) / rays, b = a + Math.PI / rays;
      ctx.beginPath(); ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
      ctx.lineTo(cx + Math.cos(b) * R, cy + Math.sin(b) * R);
      ctx.closePath(); ctx.fill();
    }
  }

  // ── 고양이 얼굴 (모든 게임의 주인공) ──
  //  cx, cy = 얼굴 가운데, s = 얼굴 너비
  //  opts: coat(털 색), mood(happy · blink · angry · sleepy · wow · dizzy · love · sad · grin), look(-1~1 눈동자 방향), t(애니메이션 시간), line(외곽선)
  function cat(ctx, cx, cy, s, opts = {}) {
    const { coat = C.cat, mood = "happy", look = 0, t = 0, line = Math.max(1.1, s * 0.075), muzzle = C.cream, ears = true, blush = true } = opts;
    const w = s, h = s * 0.82, x = cx - w / 2, y = cy - h / 2;
    const lo = tint(coat, -0.22);
    ctx.save();
    ctx.lineJoin = "round"; ctx.lineCap = "round";
    // 귀
    if (ears) [-1, 1].forEach((d) => {
      const ex = cx + d * w * 0.3;
      const p = new Path2D();
      p.moveTo(ex - d * w * 0.2, y + h * 0.26);
      p.quadraticCurveTo(ex + d * w * 0.06, y - h * 0.42, ex + d * w * 0.17, y - h * 0.16);
      p.quadraticCurveTo(ex + d * w * 0.2, y + h * 0.08, ex + d * w * 0.16, y + h * 0.3);
      p.closePath();
      ctx.fillStyle = coat; ctx.fill(p);
      ctx.lineWidth = line; ctx.strokeStyle = C.ink; ctx.stroke(p);
      const q = new Path2D(); // 귀 안쪽 분홍
      q.moveTo(ex - d * w * 0.08, y + h * 0.18);
      q.quadraticCurveTo(ex + d * w * 0.06, y - h * 0.22, ex + d * w * 0.11, y - h * 0.04);
      q.quadraticCurveTo(ex + d * w * 0.12, y + h * 0.12, ex + d * w * 0.08, y + h * 0.24);
      q.closePath();
      ctx.fillStyle = C.pink; ctx.fill(q);
    });
    // 머리 (아래가 살짝 넓은 찹쌀떡 모양)
    const head = new Path2D();
    head.moveTo(cx, y);
    head.bezierCurveTo(x + w * 0.92, y, x + w * 1.02, y + h * 0.45, x + w, y + h * 0.62);
    head.bezierCurveTo(x + w * 0.98, y + h * 0.98, x + w * 0.7, y + h, cx, y + h);
    head.bezierCurveTo(x + w * 0.3, y + h, x + w * 0.02, y + h * 0.98, x, y + h * 0.62);
    head.bezierCurveTo(x - w * 0.02, y + h * 0.45, x + w * 0.08, y, cx, y);
    head.closePath();
    ctx.fillStyle = coat; ctx.fill(head);
    ctx.save(); ctx.clip(head);
    ctx.fillStyle = lo; ctx.beginPath(); ctx.ellipse(cx, y + h * 1.18, w * 0.7, h * 0.42, 0, 0, Math.PI * 2); ctx.fill(); // 아래 그림자
    ctx.fillStyle = "rgba(255,255,255,0.35)"; ctx.beginPath(); ctx.ellipse(cx - w * 0.12, y + h * 0.16, w * 0.26, h * 0.09, -0.2, 0, Math.PI * 2); ctx.fill(); // 반짝이
    // 이마 줄무늬 3개
    ctx.strokeStyle = lo; ctx.lineWidth = line * 0.9;
    [-0.1, 0, 0.1].forEach((d) => { ctx.beginPath(); ctx.moveTo(cx + d * w, y + h * 0.05); ctx.lineTo(cx + d * w * 0.8, y + h * 0.2); ctx.stroke(); });
    // 주둥이 (크림색)
    ctx.fillStyle = muzzle; ctx.beginPath(); ctx.ellipse(cx, y + h * 0.74, w * 0.25, h * 0.19, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ctx.lineWidth = line; ctx.strokeStyle = C.ink; ctx.stroke(head);

    // 볼 터치
    if (blush && mood !== "angry") {
      ctx.fillStyle = "rgba(255,111,145,0.55)";
      [-1, 1].forEach((d) => { ctx.beginPath(); ctx.ellipse(cx + d * w * 0.31, y + h * 0.66, w * 0.09, h * 0.055, 0, 0, Math.PI * 2); ctx.fill(); });
    }

    // 눈
    const ey = y + h * 0.47, ex = w * 0.2, er = w * 0.105;
    const eye = (d) => {
      const px = cx + d * ex;
      ctx.lineWidth = line; ctx.strokeStyle = C.ink; ctx.fillStyle = C.ink;
      switch (mood) {
        case "blink":
          ctx.beginPath(); ctx.moveTo(px - er, ey); ctx.lineTo(px + er, ey); ctx.stroke(); break;
        case "happy":
          ctx.beginPath(); ctx.arc(px, ey + er * 0.35, er * 0.85, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); break;
        case "sleepy":
          ctx.beginPath(); ctx.arc(px, ey - er * 0.2, er * 0.85, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke(); break;
        case "sad":
          ctx.beginPath(); ctx.ellipse(px, ey, er * 0.62, er * 0.8, 0, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.moveTo(px - er * d * -0.2 - er, ey - er * 1.25); ctx.lineTo(px + er, ey - er * 1.25 + d * er * 0.5); ctx.stroke(); break;
        case "dizzy": {
          // 흰 눈알 위에 1바퀴 반짜리 회오리 (빙글빙글 돌아요)
          ctx.fillStyle = C.milk; ctx.beginPath(); ctx.arc(px, ey, er * 1.05, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          ctx.lineWidth = line * 0.6; ctx.beginPath();
          const spin = t * 0.25 * d;
          for (let i = 0; i <= 24; i++) { const a = spin + d * i * 0.4, rad = (0.12 + (i / 24) * 0.7) * er; const qx = px + Math.cos(a) * rad, qy = ey + Math.sin(a) * rad; i ? ctx.lineTo(qx, qy) : ctx.moveTo(qx, qy); }
          ctx.stroke(); break;
        }
        case "love":
          heart(ctx, px, ey, er * 2.4, C.berry, { line: line * 0.7, shade: 0 }); break;
        case "angry":
        case "wow":
        case "grin":
        default: {
          const big = mood === "wow" ? 1.15 : 1;
          ctx.fillStyle = C.milk; ctx.beginPath(); ctx.ellipse(px, ey, er * 0.9 * big, er * 1.12 * big, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          ctx.fillStyle = C.ink; ctx.beginPath(); ctx.ellipse(px + look * er * 0.32, ey + er * 0.1, er * 0.52 * big, er * 0.7 * big, 0, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = C.milk; ctx.beginPath(); ctx.arc(px + look * er * 0.32 - er * 0.2, ey - er * 0.22, er * 0.22, 0, Math.PI * 2); ctx.fill();
          if (mood === "angry") { // 화난 눈썹
            ctx.lineWidth = line * 1.2; ctx.beginPath(); ctx.moveTo(px - d * er * 1.1, ey - er * 1.55); ctx.lineTo(px + d * er * 0.9, ey - er * 0.95); ctx.stroke();
          }
        }
      }
    };
    eye(-1); eye(1);

    // 코 + 입
    const ny = y + h * 0.64;
    ctx.fillStyle = C.pink; ctx.strokeStyle = C.ink; ctx.lineWidth = line * 0.7;
    ctx.beginPath(); ctx.moveTo(cx - w * 0.05, ny); ctx.lineTo(cx + w * 0.05, ny); ctx.lineTo(cx, ny + h * 0.055); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.lineWidth = line * 0.8;
    const my = ny + h * 0.07;
    if (mood === "wow") { ctx.fillStyle = "#7a1f3d"; ctx.beginPath(); ctx.ellipse(cx, my + h * 0.06, w * 0.05, h * 0.07, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
    else if (mood === "sad" || mood === "angry") { ctx.beginPath(); ctx.arc(cx, my + h * 0.1, w * 0.07, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
    else if (mood === "grin") { ctx.fillStyle = "#7a1f3d"; ctx.beginPath(); ctx.moveTo(cx - w * 0.11, my); ctx.quadraticCurveTo(cx, my + h * 0.16, cx + w * 0.11, my); ctx.closePath(); ctx.fill(); ctx.stroke(); }
    else if (mood === "dizzy") { ctx.beginPath(); for (let i = 0; i <= 8; i++) { const qx = cx - w * 0.1 + (i / 8) * w * 0.2, qy = my + h * 0.04 + Math.sin(i * 1.6) * h * 0.025; i ? ctx.lineTo(qx, qy) : ctx.moveTo(qx, qy); } ctx.stroke(); }
    else { // w 입
      ctx.beginPath(); ctx.arc(cx - w * 0.05, my, w * 0.05, 0.1 * Math.PI, 0.9 * Math.PI); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx + w * 0.05, my, w * 0.05, 0.1 * Math.PI, 0.9 * Math.PI); ctx.stroke();
    }
    // 수염
    ctx.lineWidth = line * 0.55; ctx.strokeStyle = C.ink;
    [-1, 1].forEach((d) => [0, 1].forEach((k) => {
      ctx.beginPath(); ctx.moveTo(cx + d * w * 0.3, ny + h * (0.04 + k * 0.07)); ctx.lineTo(cx + d * w * 0.52, ny + h * (0.0 + k * 0.11)); ctx.stroke();
    }));
    ctx.restore();
  }

  // 통통 튀는 숫자 (0~1 → 0~1, 끝에서 살짝 넘쳤다 돌아와요)
  const springOut = (k) => 1 + 2.2 * Math.pow(k - 1, 3) + 1.2 * Math.pow(k - 1, 2);

  return { C, tint, icon, icons, mountMute, buzz, setup, ready, rr, paint, box, ball, text, heart, star, sky, cat, springOut };
})();
