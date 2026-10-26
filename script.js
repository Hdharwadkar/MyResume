const $ = (s) => document.querySelector(s),
  $$ = (s) => [...document.querySelectorAll(s)];
const RM = matchMedia("(prefers-reduced-motion:reduce)").matches,
  HV = matchMedia("(hover:hover)").matches;
const root = document.documentElement;
root.classList.add("js");
$("#yr").textContent = new Date().getFullYear();
// theme: light by default, remembers choice
const th = $("#th");
function setT(t, save) {
  root.dataset.theme = t;
  th.textContent = t === "dark" ? "☀️" : "🌙";
  th.setAttribute(
    "aria-label",
    "Switch to " + (t === "dark" ? "light" : "dark") + " mode",
  );
  if (save)
    try {
      localStorage.setItem("theme", t);
    } catch (e) {}
}
let st0 = "light";
try {
  st0 = localStorage.getItem("theme") || "light";
} catch (e) {}
setT(st0);
th.onclick = () => setT(root.dataset.theme === "dark" ? "light" : "dark", 1);
// nav + progress
const lk = $("#lk"),
  mb = $("#mb");
mb.onclick = () =>
  mb.setAttribute("aria-expanded", lk.classList.toggle("open"));
$$("#lk a").forEach(
  (a) =>
    (a.onclick = () => {
      lk.classList.remove("open");
      mb.setAttribute("aria-expanded", false);
    }),
);
const bar = $("#bar");
let tk = 0;
addEventListener(
  "scroll",
  () => {
    if (tk) return;
    tk = requestAnimationFrame(() => {
      tk = 0;
      bar.style.transform = `scaleX(${scrollY / (root.scrollHeight - innerHeight || 1)})`;
    });
  },
  { passive: true },
);
// reveal + counters
function count(el) {
  const n = +el.dataset.n,
    d = +el.dataset.d,
    s = el.dataset.s,
    o = el.querySelector(".num"),
    t0 = performance.now(),
    fm = (v) =>
      v.toLocaleString("en-US", {
        minimumFractionDigits: d,
        maximumFractionDigits: d,
      }) + s;
  if (RM) {
    o.textContent = fm(n);
    return;
  }
  const f = (t) => {
    const p = Math.min((t - t0) / 1300, 1);
    o.textContent = fm(n * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(f);
  };
  requestAnimationFrame(f);
}
const io = new IntersectionObserver(
  (es) =>
    es.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
        if (e.target.dataset.n) count(e.target);
      }
    }),
  { threshold: 0.1 },
);
$$(".rv").forEach((e, i) => {
  e.style.transitionDelay = (i % 3) * 80 + "ms";
  io.observe(e);
});
// typewriter
const W = [
    "RAG systems for Indian law.",
    "full-stack web apps.",
    "ML models you can audit.",
    "AI agents and RPA bots.",
  ],
  tw = $("#tw");
let wi = 0,
  ci = 0,
  dl = 0;
function tick() {
  const w = W[wi];
  ci += dl ? -1 : 1;
  tw.textContent = w.slice(0, ci);
  let t = dl ? 28 : 65;
  if (!dl && ci === w.length) {
    dl = 1;
    t = 1700;
  } else if (dl && !ci) {
    dl = 0;
    wi = (wi + 1) % W.length;
    t = 300;
  }
  setTimeout(tick, t);
}
RM ? (tw.textContent = W[0]) : tick();
// hero 3D stage follows pointer
if (HV && !RM) {
  const hero = $("#top"),
    sg = $("#stage");
  let q = 0,
    ex,
    ey;
  hero.addEventListener(
    "pointermove",
    (e) => {
      ex = e.clientX;
      ey = e.clientY;
      if (q) return;
      q = requestAnimationFrame(() => {
        q = 0;
        const r = hero.getBoundingClientRect();
        sg.style.transform = `rotateY(${((ex - r.left) / r.width - 0.5) * 30}deg) rotateX(${(0.5 - (ey - r.top) / r.height) * 22}deg)`;
      });
    },
    { passive: true },
  );
  hero.addEventListener("pointerleave", () => (sg.style.transform = ""));
}
// generic 3D tilt for content cards
if (HV && !RM)
  $$(".tilt").forEach((el) => {
    el.addEventListener(
      "pointermove",
      (e) => {
        const r = el.getBoundingClientRect(),
          x = (e.clientX - r.left) / r.width,
          y = (e.clientY - r.top) / r.height;
        el.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 10}deg) rotateY(${(x - 0.5) * 12}deg) translateZ(8px)`;
      },
      { passive: true },
    );
    el.addEventListener("pointerleave", () => (el.style.transform = ""));
  });
// 3D project carousel
const tr = $("#tr"),
  cards = $$(".pc"),
  dots = $("#dots");
let cur = 0,
  sx = null;
cards.forEach((_, i) => {
  const d = document.createElement("button");
  d.className = "dot";
  d.setAttribute("aria-label", "Project " + (i + 1));
  d.onclick = () => go(i);
  dots.appendChild(d);
});
function lay() {
  const w = cards[0].offsetWidth,
    nr = innerWidth < 700;
  cards.forEach((c, i) => {
    const o = i - cur,
      a = Math.abs(o);
    c.style.transform = `translateX(${o * w * (nr ? 0.55 : 0.64)}px) translateZ(${-a * 170}px) rotateY(${-o * (nr ? 32 : 38)}deg)`;
    c.style.opacity = a > 2 ? 0 : [1, 0.6, 0.3][a];
    c.style.zIndex = 9 - a;
    c.style.pointerEvents = a > 2 ? "none" : "auto";
    c.setAttribute("aria-hidden", a ? "true" : "false");
  });
  [...dots.children].forEach((d, i) =>
    d.setAttribute("aria-current", i === cur),
  );
  tr.style.height = Math.max(...cards.map((c) => c.offsetHeight)) + 16 + "px";
}
function go(i) {
  cur = Math.max(0, Math.min(cards.length - 1, i));
  lay();
}
$("#pv").onclick = () => go(cur - 1);
$("#nx").onclick = () => go(cur + 1);
cards.forEach((c, i) =>
  c.addEventListener("click", () => {
    if (i !== cur) go(i);
  }),
);
tr.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") go(cur - 1);
  if (e.key === "ArrowRight") go(cur + 1);
});
tr.addEventListener("pointerdown", (e) => (sx = e.clientX));
tr.addEventListener("pointerup", (e) => {
  if (sx !== null && Math.abs(e.clientX - sx) > 45)
    go(cur + (e.clientX < sx ? 1 : -1));
  sx = null;
});
if (HV && !RM) {
  tr.addEventListener(
    "pointermove",
    (e) => {
      const c = e.target.closest(".pc");
      if (!c || cards[cur] !== c) return;
      const r = c.getBoundingClientRect(),
        x = (e.clientX - r.left) / r.width,
        y = (e.clientY - r.top) / r.height;
      c.style.setProperty("--tx", (0.5 - y) * 9 + "deg");
      c.style.setProperty("--ty", (x - 0.5) * 11 + "deg");
    },
    { passive: true },
  );
  tr.addEventListener("pointerleave", () =>
    cards.forEach((c) => {
      c.style.setProperty("--tx", "0deg");
      c.style.setProperty("--ty", "0deg");
    }),
  );
}
let rt;
addEventListener("resize", () => {
  clearTimeout(rt);
  rt = setTimeout(lay, 120);
});
lay();
addEventListener("load", lay);
document.fonts && document.fonts.ready.then(lay);
// 3D skills cube
const cube = $("#cube"),
  cw = $("#cw"),
  tabs = $$(".tab"),
  T = [
    [0, 0],
    [0, -90],
    [0, -180],
    [0, 90],
    [-90, 0],
    [90, 0],
  ];
let rx = 0,
  ry = 0,
  dg = null;
const apply = (a) => {
  cube.style.transition = a ? "" : "none";
  cube.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
};
const mark = (i) =>
  tabs.forEach((t, k) => t.setAttribute("aria-selected", k === i));
tabs.forEach(
  (b, i) =>
    (b.onclick = () => {
      rx = T[i][0];
      ry = T[i][1] + 360 * Math.round((ry - T[i][1]) / 360);
      apply(1);
      mark(i);
    }),
);
cw.addEventListener("pointerdown", (e) => {
  dg = { x: e.clientX, r: ry };
  rx = 0;
  cw.setPointerCapture(e.pointerId);
});
cw.addEventListener("pointermove", (e) => {
  if (!dg) return;
  ry = dg.r + (e.clientX - dg.x) * 0.6;
  apply(0);
});
const end = () => {
  if (!dg) return;
  dg = null;
  ry = Math.round(ry / 90) * 90;
  apply(1);
  mark((((-ry / 90) % 4) + 4) % 4);
};
cw.addEventListener("pointerup", end);
cw.addEventListener("pointercancel", end);
apply(1);
