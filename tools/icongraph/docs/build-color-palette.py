# -*- coding: utf-8 -*-
"""docs/COLOR_PALETTE.html · color-tokens.css · color-tokens.json 생성기.

사용법:  python3 docs/build-color-palette.py

Gray 의 CIELAB 명도(L*) 계단을 기준으로 8색을 11단(0–900)으로 확장한다.
색상별 정책은 POLICY 에 있다 — 확정된 결정이므로 바꾸려면 거기만 고친다.
외부 의존성 없음.
"""
import os
import json
import math
import itertools

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_HTML = os.path.join(ROOT, "docs/COLOR_PALETTE.html")
OUT_CSS = os.path.join(ROOT, "docs/color-tokens.css")
OUT_JSON = os.path.join(ROOT, "docs/color-tokens.json")

# ===================================================================== 색 변환
def hex2rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) / 255.0 for i in (0, 2, 4))


def rgb2hex(rgb):
    return "#" + "".join("%02X" % max(0, min(255, round(c * 255))) for c in rgb)


def _lin(c):
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def _unlin(c):
    return c * 12.92 if c <= 0.0031308 else 1.055 * c ** (1 / 2.4) - 0.055


_M = [[0.4124564, 0.3575761, 0.1804375],
      [0.2126729, 0.7151522, 0.0721750],
      [0.0193339, 0.1191920, 0.9503041]]
_MI = [[3.2404542, -1.5371385, -0.4985314],
       [-0.9692660, 1.8760108, 0.0415560],
       [0.0556434, -0.2040259, 1.0572252]]
_WP = (0.95047, 1.0, 1.08883)


def _f(t):
    return t ** (1 / 3) if t > 216 / 24389 else (841 / 108) * t + 4 / 29


def _fi(t):
    return t ** 3 if t ** 3 > 216 / 24389 else (t - 4 / 29) * 108 / 841


def hex2lab(h):
    r, g, b = (_lin(c) for c in hex2rgb(h))
    xyz = [sum(_M[i][j] * v for j, v in enumerate((r, g, b))) for i in range(3)]
    fx, fy, fz = (_f(xyz[i] / _WP[i]) for i in range(3))
    return (116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz))


def lab2hex(lab):
    L, a, b = lab
    fy = (L + 16) / 116
    xyz = (_WP[0] * _fi(fy + a / 500), _WP[1] * _fi(fy), _WP[2] * _fi(fy - b / 200))
    return rgb2hex(tuple(_unlin(sum(_MI[i][j] * v for j, v in enumerate(xyz)))
                         for i in range(3)))


def hex2lch(h):
    L, a, b = hex2lab(h)
    return (L, math.hypot(a, b), math.degrees(math.atan2(b, a)) % 360)


def lch2lab(L, C, h):
    r = math.radians(h)
    return (L, C * math.cos(r), C * math.sin(r))


def in_gamut(L, C, h):
    lab = lch2lab(L, C, h)
    fy = (lab[0] + 16) / 116
    xyz = (_WP[0] * _fi(fy + lab[1] / 500), _WP[1] * _fi(fy), _WP[2] * _fi(fy - lab[2] / 200))
    rgb = [sum(_MI[i][j] * v for j, v in enumerate(xyz)) for i in range(3)]
    return all(-1e-4 <= _unlin(c) <= 1 + 1e-4 for c in rgb)


def max_chroma(L, h):
    if in_gamut(L, 200, h):
        return 200.0
    lo, hi = 0.0, 200.0
    for _ in range(40):
        mid = (lo + hi) / 2
        if in_gamut(L, mid, h):
            lo = mid
        else:
            hi = mid
    return lo


def lch2hex(L, C, h):
    return lab2hex(lch2lab(L, min(C, max_chroma(L, h)), h))


def deltaE(a, b):
    return math.sqrt(sum((x - y) ** 2 for x, y in zip(hex2lab(a), hex2lab(b))))


def lum(h):
    r, g, b = (_lin(c) for c in hex2rgb(h))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast(a, b):
    la, lb = lum(a), lum(b)
    return (max(la, lb) + 0.05) / (min(la, lb) + 0.05)


# ================================================================ 원본 팔레트
GRAY = [("0", "#FFFFFF"), ("50", "#E6ECF2"), ("100", "#D0D8E6"), ("200", "#B0BFCF"),
        ("300", "#97A7B8"), ("400", "#7D8D9E"), ("500", "#687B8C"), ("600", "#58697A"),
        ("700", "#3D4B59"), ("800", "#2E3B47"), ("900", "#1F252C")]

SOURCE = {
    "Yellow": [("50", "#FFF7C2"), ("100", "#FFE96B"), ("200", "#FFDC38"), ("300", "#FFC311"),
               ("400", "#FFA800"), ("500", "#FF8A00"), ("600", "#EF6D00")],
    "Brown":  [("50", "#F4D0BE"), ("100", "#E9B08D"), ("200", "#D08C64"), ("300", "#B66F49"),
               ("400", "#A05225"), ("500", "#91391D"), ("600", "#803017")],
    "Red":    [("50", "#FFD6D9"), ("100", "#FFB9C0"), ("200", "#FF929F"), ("300", "#FF6F80"),
               ("400", "#F65369"), ("500", "#DF3E56"), ("600", "#A9233B")],
    "Green":  [("50", "#CDF4E0"), ("100", "#86E5B7"), ("200", "#5BD59A"), ("300", "#12BA73"),
               ("400", "#009F5E"), ("500", "#008951"), ("600", "#006840")],
    "Teal":   [("50", "#DEF7F4"), ("100", "#90E5E2"), ("200", "#50D1CE"), ("300", "#19B6B6"),
               ("400", "#009C9C"), ("500", "#0B807D"), ("600", "#006562")],
    "Blue":   [("50", "#E3F3FF"), ("100", "#BBE0FF"), ("200", "#7AC7FF"), ("300", "#4BA9FF"),
               ("400", "#1088FF"), ("500", "#0B72E6"), ("600", "#0A58CC")],
    "Indigo": [("50", "#D1D8FF"), ("100", "#BBC6FF"), ("200", "#A6B9FF"), ("300", "#8CA5FF"),
               ("400", "#607DFD"), ("500", "#305AE8"), ("600", "#2434C6")],
    "Purple": [("50", "#E3DFFF"), ("100", "#CCC3FF"), ("200", "#B3A7FF"), ("300", "#8D79FF"),
               ("400", "#6F58FF"), ("500", "#5139E4"), ("600", "#351DB5")],
}

# 확정된 정책 —  (50–600 처리, 700–900 명도 기준)
#   keep   : 기존값 유지          reseat : Gray L* 로 재정렬
#   gray   : 다크단을 Gray L* 에  own    : 자체 추세로 연장
POLICY = {
    "Yellow": ("keep",   "gray", "채도 최고점이 밝은 쪽에 있어 Gray 계단에 앉히면 겨자색이 된다"),
    "Brown":  ("keep",   "own",  "브라운은 어두운 오렌지다. 밝게 올리면 살구색이 되어 브라운으로 읽히지 않는다"),
    "Red":    ("keep",   "gray", "이미 Gray 계단에 정렬되어 있다"),
    "Green":  ("keep",   "gray", "이미 Gray 계단에 정렬되어 있다"),
    "Teal":   ("keep",   "gray", "이미 Gray 계단에 정렬되어 있다"),
    "Blue":   ("keep",   "gray", "이미 Gray 계단에 정렬되어 있다"),
    "Indigo": ("reseat", "gray", "램프가 0.6단 어둡게 밀려 있었다"),
    "Purple": ("reseat", "gray", "램프가 0.9단 어둡게 밀려 있었다"),
}

HUES = ["Yellow", "Brown", "Red", "Green", "Teal", "Blue", "Indigo", "Purple"]
KO = {"Gray": "그레이", "Yellow": "옐로", "Brown": "브라운", "Red": "레드", "Green": "그린",
      "Teal": "틸", "Blue": "블루", "Indigo": "인디고", "Purple": "퍼플"}
ORDER = [s for s, _ in GRAY]
G = dict(GRAY)
GL = {s: hex2lch(h)[0] for s, h in GRAY}
L0 = 97.6                       # 0 단 공통 명도

# ==================================================================== 빌드
def sample_curve(samples, L):
    """(L,C,h) 표본에서 주어진 L 의 채도·색상각을 보간/외삽."""
    s = sorted(samples, key=lambda t: -t[0])
    if L >= s[0][0]:
        L1, C1, h1 = s[0]
        return C1 * (100 - L) / max(100 - L1, 1e-6), h1
    if L <= s[-1][0]:
        Ln, Cn, hn = s[-1]
        return Cn * (L / max(Ln, 1e-6)) ** 0.35, hn
    for i in range(len(s) - 1):
        L1, C1, h1 = s[i]
        L2, C2, h2 = s[i + 1]
        if L2 <= L <= L1:
            t = (L1 - L) / (L1 - L2)
            dh = ((h2 - h1 + 540) % 360) - 180
            return C1 + (C2 - C1) * t, (h1 + dh * t) % 360
    return s[-1][1], s[-1][2]


PALETTE, KIND = {"Gray": dict(GRAY)}, {"Gray": {s: "keep" for s in ORDER}}
KIND["Gray"]["0"] = "keep"

for name in HUES:
    src = {s: h.upper() for s, h in SOURCE[name]}
    samples = [hex2lch(h) for _, h in SOURCE[name]]
    mid_policy, dark_policy, _ = POLICY[name]
    out, kind = {}, {}

    # --- 50 – 600
    for s in [x for x in ORDER if x not in ("0", "700", "800", "900")]:
        if mid_policy == "keep":
            out[s], kind[s] = src[s], "keep"
        else:
            C, h = sample_curve(samples, GL[s])
            out[s], kind[s] = lch2hex(GL[s], C, h), "fix"

    # --- 0 단 : 전 색상 공통 명도, 낮은 채도
    _, _, h50 = hex2lch(out["50"])
    C0, _ = sample_curve(samples, L0)
    out["0"], kind["0"] = lch2hex(L0, min(C0, 6.0), h50), "new"

    # --- 700 / 800 / 900
    L6, C6, h6 = hex2lch(out["600"])
    if dark_policy == "gray":
        targets = [GL[s] for s in ("700", "800", "900")]
    else:
        L4 = hex2lch(out["400"])[0]
        L5 = hex2lch(out["500"])[0]
        step = max(4.5, min(9.7, ((L4 - L5) + (L5 - L6)) / 2))
        targets = [max(9.0, L6 - step * i) for i in (1, 2, 3)]
    for s, Lt in zip(("700", "800", "900"), targets):
        C = C6 * (Lt / L6) ** 0.35
        out[s] = lch2hex(Lt, min(C, max_chroma(Lt, h6) * 0.95), h6)
        kind[s] = "new"

    PALETTE[name], KIND[name] = out, kind

# ------------------------------------------------- 다크 모드 틴트 표면
# 표면 역할이므로 색상각은 라이트 표면(50 단)에서 가져온다.
# 600 단 색상각을 쓰면 옐로(h56)와 브라운(h45)이 거의 같은 색이 된다.
SURF_SPEC = (("bg", 21.0, 14.0), ("bg-hover", 26.0, 17.0), ("border", 33.0, 20.0))
SURFACE = {}
for name in HUES:
    _, _, h50 = hex2lch(PALETTE[name]["50"])
    SURFACE[name] = {k: lch2hex(Lt, min(Ct, max_chroma(Lt, h50) * 0.95), h50)
                     for k, Lt, Ct in SURF_SPEC}

# 역할별 단계 — 통과하는 가장 선명한 단계
def first_pass(name, bg, lo, order):
    for s in order:
        if contrast(PALETTE[name][s], bg) >= lo:
            return s
    return None


ROLE = {}
for name in HUES + ["Gray"]:
    ROLE[name] = {
        "text_l": first_pass(name, G["0"], 4.5, ORDER),
        "ui_l": first_pass(name, G["0"], 3.0, ORDER),
        "text_d": first_pass(name, G["900"], 4.5, list(reversed(ORDER))),
        "ui_d": first_pass(name, G["900"], 3.0, list(reversed(ORDER))),
        "tint_text_l": next((s for s in ORDER
                             if contrast(PALETTE[name][s], PALETTE[name]["50"]) >= 4.5), None),
    }
    if name in HUES:
        ROLE[name]["tint_text_d"] = next(
            (s for s in reversed(ORDER)
             if contrast(PALETTE[name][s], SURFACE[name]["bg"]) >= 4.5), None)

DUAL = {n: [s for s in ORDER
            if contrast(PALETTE[n][s], G["0"]) >= 3.0
            and contrast(PALETTE[n][s], G["900"]) >= 3.0] for n in HUES}

# 예외 2색이 다른 색의 몇 단에 해당하는지 (번역표)
EQUIV = {}
for name in ("Yellow", "Brown"):
    EQUIV[name] = {}
    for s in ORDER:
        L = hex2lch(PALETTE[name][s])[0]
        EQUIV[name][s] = min(ORDER, key=lambda g: abs(GL[g] - L))

# ==================================================================== 검증
REPORT = []


def check(label, ok, detail):
    REPORT.append((label, ok, detail))
    return ok


for name in HUES:
    Ls = [hex2lch(PALETTE[name][s])[0] for s in ORDER]
    mono = all(Ls[i] > Ls[i + 1] for i in range(len(Ls) - 1))
    pairs = [(ORDER[i], ORDER[i + 1],
              deltaE(PALETTE[name][ORDER[i]], PALETTE[name][ORDER[i + 1]]))
             for i in range(len(ORDER) - 1)]
    mn = min(pairs, key=lambda t: t[2])
    check("%s 명도 단조감소" % name, mono, "OK" if mono else "역전 발생")
    check("%s 인접 단계 구분" % name, mn[2] >= 3.0,
          "최소 ΔE %.1f (%s↔%s)" % (mn[2], mn[0], mn[1]))

worst = min(((a, b, deltaE(SURFACE[a]["bg"], SURFACE[b]["bg"]))
             for a, b in itertools.combinations(HUES, 2)), key=lambda t: t[2])
check("다크 표면 8색 구분", worst[2] >= 2.0,
      "가장 가까운 쌍 %s↔%s ΔE %.1f" % (worst[0], worst[1], worst[2]))

for name in HUES:
    st = ROLE[name]["tint_text_d"]
    ok = st is not None
    v = contrast(PALETTE[name][st], SURFACE[name]["bg"]) if ok else 0.0
    check("%s 다크 틴트 위 본문" % name, ok and v >= 4.5,
          "%s 단 %.1f:1" % (st, v) if ok else "통과 단계 없음")

# ==================================================================== 출력
def ink(h):
    return "#1F252C" if contrast(h, "#1F252C") >= contrast(h, "#FFFFFF") else "#FFFFFF"


BADGE = {"keep": "", "new": '<i class="bd bd-new">NEW</i>',
         "fix": '<i class="bd bd-fix">FIX</i>'}


def swatch(name, step, hexv, kind="keep"):
    L = hex2lch(hexv)[0]
    return ('<button class="sw" style="background:%s;color:%s" data-hex="%s" '
            'title="%s %s · L* %.1f · 흰 배경 대비 %.1f:1">'
            '<span class="sw-s">%s</span>%s<span class="sw-h">%s</span></button>'
            % (hexv, ink(hexv), hexv, name, step, L, contrast(hexv, "#FFFFFF"),
               step, BADGE[kind], hexv))


def prow(name):
    cells = "".join(swatch(name, s, PALETTE[name][s], KIND[name][s]) for s in ORDER)
    tag = ""
    if POLICY.get(name, ("", "", ""))[0] == "keep" and name in ("Yellow", "Brown"):
        tag = '<em class="ex">예외</em>'
    return ('<div class="prow"><div class="rl"><b>%s</b><span>%s</span>%s</div>'
            '<div class="swrow">%s</div></div>' % (name, KO[name], tag, cells))


def chart(mode):
    W, H, PL, PR, PT, PB = 480, 300, 42, 10, 14, 34
    iw, ih = W - PL - PR, H - PT - PB
    xs = {s: PL + iw * i / (len(ORDER) - 1) for i, s in enumerate(ORDER)}
    y = lambda L: PT + ih * (100 - L) / 100.0
    g = []
    for L in (0, 25, 50, 75, 100):
        g.append('<line x1="%g" y1="%g" x2="%g" y2="%g" class="gl"/>' % (PL, y(L), W - PR, y(L)))
        g.append('<text x="%g" y="%g" class="ct ca">%d</text>' % (PL - 7, y(L) + 3.5, L))
    for s in ORDER:
        g.append('<text x="%g" y="%g" class="ct cx">%s</text>' % (xs[s], H - PB + 15, s))
    g.append('<polyline points="%s" class="gray-line"/>'
             % " ".join("%g,%g" % (xs[s], y(GL[s])) for s in ORDER))
    for s in ORDER:
        g.append('<circle cx="%g" cy="%g" r="3.2" class="gray-dot"/>' % (xs[s], y(GL[s])))
    for name in HUES:
        src = dict(SOURCE[name]) if mode == "before" else PALETTE[name]
        steps = [s for s in ORDER if s in src]
        pts = " ".join("%g,%g" % (xs[s], y(hex2lch(src[s])[0])) for s in steps)
        dash = ' stroke-dasharray="4 3"' if (mode == "after" and name in ("Yellow", "Brown")) else ""
        g.append('<polyline points="%s" fill="none" stroke="%s" stroke-width="1.6" '
                 'stroke-linejoin="round" opacity=".9"%s/>' % (pts, PALETTE[name]["500"], dash))
    return ('<svg viewBox="0 0 %d %d" class="chart" role="img" '
            'aria-label="단계별 L* 비교">%s</svg>' % (W, H, "".join(g)))


SEM = [("정보", "Blue", "전표가 자동 분류되었습니다"),
       ("성공", "Green", "12건이 저장되었습니다"),
       ("주의", "Yellow", "마감이 3일 남았습니다"),
       ("오류", "Red", "사업자번호를 확인해주세요")]


def pane(light):
    bans = []
    for label, hue, msg in SEM:
        if light:
            bg, bd = PALETTE[hue]["50"], PALETTE[hue]["200"]
            tx = PALETTE[hue][ROLE[hue]["tint_text_l"]]
        else:
            bg, bd = SURFACE[hue]["bg"], SURFACE[hue]["border"]
            tx = PALETTE[hue][ROLE[hue]["tint_text_d"]]
        ic = PALETTE[hue]["400"]
        bans.append('<div class="ban" style="background:%s;border-color:%s;color:%s">'
                    '<i style="background:%s"></i><div><b>%s</b><span>%s</span></div></div>'
                    % (bg, bd, tx, ic, label, msg))
    chips = []
    for _, hue, _ in SEM:
        st = ROLE[hue]["text_l"] if light else ROLE[hue]["text_d"]
        f = PALETTE[hue][st]
        chips.append('<span class="chip" style="background:%s;color:%s">%s</span>'
                     % (f, "#FFFFFF" if light else "#1F252C", f))
    return ('<div class="pane pane-%s"><div class="pane-h"><span>%s</span><span>%s</span></div>'
            '<div class="pane-b">%s<div class="chips">%s</div></div></div>'
            % ("l" if light else "d", "라이트" if light else "다크",
               "#FFFFFF" if light else "Gray 900", "".join(bans), "".join(chips)))


CSS = """
:root{
  --g0:#FFFFFF; --g50:#E6ECF2; --g100:#D0D8E6; --g200:#B0BFCF; --g300:#97A7B8;
  --g400:#7D8D9E; --g500:#687B8C; --g600:#58697A; --g700:#3D4B59; --g800:#2E3B47;
  --g900:#1F252C;
  --ground:var(--g0); --surface:#FBFCFD; --band:var(--g50);
  --line:var(--g100); --line-2:var(--g200);
  --ink:var(--g900); --ink-2:var(--g600); --muted:var(--g400);
  --accent:#0B72E6; --accent-soft:#E3F3FF;
  --new:#008951; --new-soft:#CDF4E0; --fix:#DF3E56; --fix-soft:#FFD6D9;
  --ex:#EF6D00; --ex-soft:#FFF7C2;
  --chart-grid:var(--g100); --chart-ref:var(--g500);
}
@media (prefers-color-scheme:dark){
  :root:not([data-theme="light"]){
    --ground:var(--g900); --surface:#252E38; --band:#20282F;
    --line:#33404C; --line-2:var(--g700);
    --ink:var(--g50); --ink-2:var(--g200); --muted:var(--g400);
    --accent:#7AC7FF; --accent-soft:#123049;
    --new:#5BD59A; --new-soft:#0C3B27; --fix:#FF929F; --fix-soft:#40161D;
    --ex:#FFA800; --ex-soft:#402F1A;
    --chart-grid:#33404C; --chart-ref:var(--g300);
  }
}
:root[data-theme="dark"]{
  --ground:var(--g900); --surface:#252E38; --band:#20282F;
  --line:#33404C; --line-2:var(--g700);
  --ink:var(--g50); --ink-2:var(--g200); --muted:var(--g400);
  --accent:#7AC7FF; --accent-soft:#123049;
  --new:#5BD59A; --new-soft:#0C3B27; --fix:#FF929F; --fix-soft:#40161D;
  --ex:#FFA800; --ex-soft:#402F1A;
  --chart-grid:#33404C; --chart-ref:var(--g300);
}
*{box-sizing:border-box}
body{margin:0; background:var(--ground); color:var(--ink);
  font-family:"Archivo","IBM Plex Sans KR",-apple-system,"Apple SD Gothic Neo",sans-serif;
  font-size:14px; line-height:1.6; -webkit-font-smoothing:antialiased}
h1,h2,h3,h4{margin:0; font-weight:700; letter-spacing:-.015em; text-wrap:balance}
p{margin:0}
code,.mono,.sw-h,.sw-s{font-family:"IBM Plex Mono",ui-monospace,Menlo,monospace;
  font-variant-numeric:tabular-nums}
:focus-visible{outline:2px solid var(--accent); outline-offset:2px}
.wrap{max-width:1500px; margin:0 auto; padding:0 32px}
header{border-bottom:1px solid var(--line); background:var(--surface)}
.head{padding:44px 0 34px; display:grid; gap:22px}
.eyebrow{font-family:"IBM Plex Mono",monospace; font-size:11px; letter-spacing:.16em;
  text-transform:uppercase; color:var(--muted)}
h1{font-size:clamp(28px,3.6vw,42px); line-height:1.15}
.lead{font-size:16px; color:var(--ink-2); max-width:68ch}
.stats{display:flex; flex-wrap:wrap; border:1px solid var(--line); border-radius:2px;
  width:fit-content; overflow:hidden}
.stats div{padding:11px 22px; border-right:1px solid var(--line)}
.stats div:last-child{border-right:0}
.stats dt{margin:0; font-family:"IBM Plex Mono",monospace; font-size:10px;
  letter-spacing:.11em; text-transform:uppercase; color:var(--muted)}
.stats dd{margin:1px 0 0; font-size:21px; font-weight:700; font-variant-numeric:tabular-nums}
main{padding:40px 0 90px; display:grid; gap:58px}
section{display:grid; gap:18px}
.sh{display:grid; gap:6px}
.sn{font-family:"IBM Plex Mono",monospace; font-size:11px; letter-spacing:.14em;
  text-transform:uppercase; color:var(--accent)}
h2{font-size:20px}
.sh p{color:var(--ink-2); max-width:72ch; font-size:14px}
.pal{display:grid; gap:5px; min-width:1080px}
.prow{display:grid; grid-template-columns:112px minmax(0,1fr); gap:12px}
.rl{display:grid; align-content:center; gap:1px; padding-right:4px}
.rl b{font-size:14px; font-weight:700}
.rl span{font-size:11px; color:var(--muted)}
.ex{font-style:normal; font-family:"IBM Plex Mono",monospace; font-size:9px;
  letter-spacing:.08em; color:var(--ex); background:var(--ex-soft); padding:1px 5px;
  border-radius:2px; width:fit-content; margin-top:3px}
.swrow{display:grid; grid-template-columns:repeat(11,minmax(0,1fr)); gap:5px}
.sw{position:relative; border:0; border-radius:3px; padding:11px 9px 10px;
  min-height:74px; text-align:left; cursor:pointer; display:grid;
  align-content:space-between; font:inherit;
  box-shadow:inset 0 0 0 1px rgba(31,37,44,.10)}
.sw:hover{box-shadow:inset 0 0 0 1px rgba(31,37,44,.10), 0 0 0 2px var(--accent)}
.sw-s{font-size:11px; font-weight:600; letter-spacing:.04em; opacity:.9}
.sw-h{font-size:10.5px; opacity:.85}
.bd{position:absolute; top:9px; right:8px; font-family:"IBM Plex Mono",monospace;
  font-size:8.5px; font-style:normal; letter-spacing:.09em; padding:1.5px 4px;
  border-radius:2px; background:rgba(255,255,255,.92); color:#1F252C}
.bd-fix{color:#A9233B}
.scroll{overflow-x:auto; padding-bottom:6px}
.legend{display:flex; flex-wrap:wrap; gap:20px; font-size:12.5px; color:var(--ink-2)}
.legend span{display:flex; align-items:center; gap:7px}
.key{width:22px; height:13px; border-radius:2px; flex:none;
  box-shadow:inset 0 0 0 1px rgba(31,37,44,.14)}
.charts{display:grid; grid-template-columns:repeat(auto-fit,minmax(330px,1fr)); gap:26px}
.cbox{display:grid; gap:9px}
.cbox h4{font-size:13px}
.cbox p{font-size:12.5px; color:var(--muted)}
.chart{width:100%; height:auto; background:var(--surface); border:1px solid var(--line);
  border-radius:3px}
.gl{stroke:var(--chart-grid); stroke-width:1}
.ct{font-family:"IBM Plex Mono",monospace; font-size:9px; fill:var(--muted)}
.ca{text-anchor:end} .cx{text-anchor:middle}
.gray-line{fill:none; stroke:var(--chart-ref); stroke-width:2.4; stroke-dasharray:5 3}
.gray-dot{fill:var(--chart-ref)}
.modes{display:grid; grid-template-columns:repeat(auto-fit,minmax(330px,1fr)); gap:20px}
.pane{border:1px solid var(--line); border-radius:4px; overflow:hidden}
.pane-h{display:flex; justify-content:space-between; padding:9px 14px;
  font-family:"IBM Plex Mono",monospace; font-size:10.5px; letter-spacing:.11em;
  text-transform:uppercase}
.pane-b{padding:16px; display:grid; gap:10px}
.pane-l{background:#FFFFFF} .pane-l .pane-h{background:#E6ECF2; color:#58697A}
.pane-d{background:#1F252C} .pane-d .pane-h{background:#2E3B47; color:#B0BFCF}
.ban{display:flex; gap:11px; align-items:flex-start; padding:12px 14px;
  border-radius:4px; border:1px solid}
.ban i{width:16px; height:16px; border-radius:50%; flex:none; margin-top:1px}
.ban div{display:grid; gap:2px; min-width:0}
.ban b{font-size:12.5px; font-weight:600}
.ban span{font-size:11.5px; opacity:.92}
.chips{display:flex; flex-wrap:wrap; gap:7px; padding-top:3px}
.chip{font-family:"IBM Plex Mono",monospace; font-size:10px; padding:4px 9px;
  border-radius:3px}
.dual{display:grid; gap:5px; min-width:700px}
.dualrow{display:grid; grid-template-columns:112px minmax(0,1fr); gap:12px}
.dualcells{display:grid; grid-template-columns:repeat(11,minmax(0,1fr)); gap:5px}
.dcell{border-radius:3px; min-height:44px; display:grid; place-items:center;
  font-family:"IBM Plex Mono",monospace; font-size:9.5px;
  box-shadow:inset 0 0 0 1px rgba(31,37,44,.10)}
.dcell.off{background:var(--band); color:var(--muted); box-shadow:none}
table{border-collapse:collapse; width:100%; font-size:13px; min-width:520px}
th,td{text-align:left; padding:10px 14px; border-bottom:1px solid var(--line);
  vertical-align:top}
th{font-family:"IBM Plex Mono",monospace; font-size:10px; letter-spacing:.11em;
  text-transform:uppercase; color:var(--muted); font-weight:500; background:var(--band)}
tr:last-child td{border-bottom:0}
.tw{border:1px solid var(--line); border-radius:3px; overflow-x:auto;
  background:var(--surface)}
.note{border-left:2px solid var(--accent); background:var(--accent-soft);
  padding:13px 17px; border-radius:0 3px 3px 0; font-size:13px; color:var(--ink-2);
  display:grid; gap:4px}
.note b{color:var(--ink); font-family:"IBM Plex Mono",monospace; font-size:11px;
  letter-spacing:.1em; text-transform:uppercase; font-weight:500}
.note.warn{border-left-color:var(--ex); background:var(--ex-soft)}
.note.warn b{color:var(--ex)}
pre{margin:0; background:var(--band); border:1px solid var(--line); border-radius:3px;
  padding:15px 17px; overflow-x:auto; font-family:"IBM Plex Mono",monospace;
  font-size:12px; line-height:1.65; color:var(--ink-2)}
.pass{color:var(--new); font-family:"IBM Plex Mono",monospace; font-size:11px}
.toast{position:fixed; left:50%; bottom:26px; transform:translateX(-50%) translateY(14px);
  background:var(--g900); color:var(--g0); font-family:"IBM Plex Mono",monospace;
  font-size:12px; padding:8px 15px; border-radius:3px; opacity:0;
  transition:opacity .18s, transform .18s; pointer-events:none}
.toast.on{opacity:1; transform:translateX(-50%) translateY(0)}
footer{border-top:1px solid var(--line); background:var(--surface); padding:26px 0;
  font-size:12px; color:var(--muted)}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
@media (max-width:820px){ .wrap{padding:0 18px} }
"""

H = []
a = H.append
a('<title>Douzone 11단 컬러 팔레트</title>')
a('<link rel="preconnect" href="https://fonts.googleapis.com">')
a('<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>')
a('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?'
  'family=Archivo:wght@400;600;700&family=IBM+Plex+Sans+KR:wght@400;500;600&'
  'family=IBM+Plex+Mono:wght@400;500&display=swap">')
a('<style>' + CSS + '</style>')

n_new = sum(1 for n in HUES for s in ORDER if KIND[n][s] == "new")
n_fix = sum(1 for n in HUES for s in ORDER if KIND[n][s] == "fix")
n_keep = sum(1 for n in HUES for s in ORDER if KIND[n][s] == "keep")

a('<header><div class="wrap"><div class="head">')
a('<div class="eyebrow">Color Palette · 확정본</div>')
a('<h1>11단 컬러 팔레트</h1>')
a('<p class="lead">Gray 의 CIELAB 명도 계단을 기준으로 8색을 0–900 11단으로 맞췄다. '
  '인디고·퍼플은 계단에 되맞췄고, 옐로·브라운은 색이 무너지므로 예외로 둔다. '
  '스와치를 누르면 hex 가 복사된다.</p>')
a('<dl class="stats">'
  '<div><dt>신규</dt><dd>%d</dd></div>'
  '<div><dt>재정렬</dt><dd>%d</dd></div>'
  '<div><dt>무변경</dt><dd>%d</dd></div>'
  '<div><dt>다크 표면</dt><dd>%d</dd></div>'
  '<div><dt>전체</dt><dd>%d</dd></div>'
  '</dl>' % (n_new, n_fix, n_keep, len(HUES) * 3, len(HUES) * 11 + 11 + len(HUES) * 3))
a('</div></div></header>')
a('<div class="wrap"><main>')

# --- 팔레트
a('<section><div class="sh"><span class="sn">확정 팔레트</span>'
  '<h2>9 색상 × 11 단계</h2>'
  '<p>맨 위 Gray 가 기준이다. 같은 단계 번호는 같은 명도를 뜻한다 &mdash; '
  '<b>예외</b> 표시가 붙은 옐로·브라운만 다르다.</p></div>')
a('<div class="legend">'
  '<span><i class="key" style="background:var(--new-soft)"></i>NEW 신규</span>'
  '<span><i class="key" style="background:var(--fix-soft)"></i>FIX 재정렬</span>'
  '<span><i class="key" style="background:var(--band)"></i>표시 없음 &mdash; 기존값</span>'
  '<span><i class="key" style="background:var(--ex-soft)"></i>예외 &mdash; 계단을 따르지 않음</span>'
  '</div>')
a('<div class="scroll"><div class="pal">')
a('<div class="prow"><div class="rl"><b>Gray</b><span>그레이</span></div>'
  '<div class="swrow">%s</div></div>'
  % "".join(swatch("Gray", s, G[s]) for s in ORDER))
for n in HUES:
    a(prow(n))
a('</div></div></section>')

# --- 예외 번역표
a('<section><div class="sh"><span class="sn">예외 2색</span>'
  '<h2>옐로와 브라운은 단계 번호가 다른 밝기를 가리킨다</h2>'
  '<p>%s<br>%s</p></div>'
  % ("<b>옐로</b> &mdash; " + POLICY["Yellow"][2],
     "<b>브라운</b> &mdash; " + POLICY["Brown"][2]))
a('<div class="tw"><table><thead><tr><th>단계</th>'
  + "".join("<th>%s</th>" % s for s in ORDER) +
  '</tr></thead><tbody>')
for name in ("Yellow", "Brown"):
    a('<tr><td><b>%s</b> 는 다른 색의</td>' % name
      + "".join('<td class="mono">%s</td>' % EQUIV[name][s] for s in ORDER)
      + '</tr>')
a('</tbody></table></div>')
a('<p class="sh" style="font-size:12.5px;color:var(--muted)">읽는 법 &mdash; '
  '옐로 400 은 다른 색의 200 정도 밝기다. 브라운 400 은 다른 색의 600 정도다. '
  '같은 무게로 보이게 하려면 이 표대로 짝지어 쓴다.</p>')
a('<div class="note warn"><b>브라운 다크단은 자체 추세를 잇는다</b><span>'
  '브라운 600(%s)은 이미 Gray 700 의 밝기(L* %.0f)에 있다. 다크단을 Gray 계단에 맞추면 '
  '600 과 같은 색이 되므로, 브라운만 자체 간격으로 연장했다. 옐로는 반대로 600 이 L* %.0f 라 '
  '여유가 있어 Gray 계단을 그대로 쓴다.</span></div>'
  % (PALETTE["Brown"]["600"], hex2lch(PALETTE["Brown"]["600"])[0],
     hex2lch(PALETTE["Yellow"]["600"])[0]))
a('</section>')

# --- 차트
a('<section><div class="sh"><span class="sn">근거</span><h2>단계별 명도 정렬</h2>'
  '<p>점선이 Gray 기준선이다. 확정본에서 실선 6개가 기준선에 붙고, 예외 2색(점선)만 '
  '떨어져 있다.</p></div>')
a('<div class="charts">')
a('<div class="cbox"><h4>기존</h4><p>브라운·퍼플·인디고가 기준선 아래로 처짐</p>%s</div>'
  % chart("before"))
a('<div class="cbox"><h4>확정</h4><p>정렬 6색 ±0.2 이내 · 예외 2색은 점선</p>%s</div>'
  % chart("after"))
a('</div></section>')

# --- 퍼플 재정렬
a('<section><div class="sh"><span class="sn">재정렬</span>'
  '<h2>인디고 · 퍼플</h2>'
  '<p>두 색은 램프 전체가 밀려 있어 500·600 만 고치면 기존 400 과 겹치거나 명도가 '
  '역전됐다. 50–600 전체를 되맞췄다.</p></div>')
a('<div class="tw"><table><thead><tr><th>색상</th><th>단계</th><th>기존</th><th>확정</th>'
  '<th>ΔE</th><th>L* 이동</th></tr></thead><tbody>')
for name in ("Indigo", "Purple"):
    for s in [x for x in ORDER if x in dict(SOURCE[name])]:
        o, nn = dict(SOURCE[name])[s].upper(), PALETTE[name][s]
        a('<tr><td>%s</td><td class="mono">%s</td><td class="mono">%s</td>'
          '<td class="mono">%s</td><td class="mono">%.0f</td>'
          '<td class="mono">%.0f → %.0f</td></tr>'
          % (name if s == "50" else "", s, o, nn, deltaE(o, nn),
             hex2lch(o)[0], hex2lch(nn)[0]))
a('</tbody></table></div></section>')

# --- 모드 매핑
a('<section><div class="sh"><span class="sn">다크 · 라이트</span>'
  '<h2>모드별 단계 매핑</h2>'
  '<p>램프 하나로 두 모드를 쓴다. 같은 hex 를 쓰되 역할마다 단계 번호를 바꾼다. '
  '모든 값은 WCAG 대비비로 검증했다.</p></div>')
a('<div class="tw"><table><thead><tr><th>역할</th><th>라이트 (#FFFFFF)</th>'
  '<th>다크 (Gray 900)</th><th>기준</th></tr></thead><tbody>'
  '<tr><td><b>틴트 표면</b></td><td class="mono">50</td><td class="mono">신규 bg</td>'
  '<td>—</td></tr>'
  '<tr><td><b>표면 hover</b></td><td class="mono">100</td>'
  '<td class="mono">신규 bg-hover</td><td>—</td></tr>'
  '<tr><td><b>보더</b></td><td class="mono">200</td><td class="mono">신규 border</td>'
  '<td>—</td></tr>'
  '<tr><td><b>아이콘 · UI</b></td><td class="mono">400</td><td class="mono">400</td>'
  '<td>3:1 · 양 모드 공용</td></tr>'
  '<tr><td><b>본문 텍스트</b></td><td class="mono">%s</td><td class="mono">%s</td>'
  '<td>4.5:1</td></tr>'
  '<tr><td><b>본문 (틴트 위)</b></td><td class="mono">%s</td><td class="mono">%s</td>'
  '<td>4.5:1</td></tr>'
  '</tbody></table></div>'
  % (" · ".join(sorted({ROLE[n]["text_l"] for n in HUES}, key=ORDER.index)),
     " · ".join(sorted({ROLE[n]["text_d"] for n in HUES}, key=ORDER.index)),
     " · ".join(sorted({ROLE[n]["tint_text_l"] for n in HUES}, key=ORDER.index)),
     " · ".join(sorted({ROLE[n]["tint_text_d"] for n in HUES}, key=ORDER.index))))
a('<div class="modes">%s%s</div>' % (pane(True), pane(False)))
a('<p class="sh" style="font-size:12.5px;color:var(--muted)">같은 팔레트로 만든 배너와 '
  '버튼이다. 배지의 hex 가 각 모드에서 실제로 쓰인 값이다.</p></section>')

# --- 공용 대역
a('<section><div class="sh"><span class="sn">공용 대역</span>'
  '<h2>모드 분기가 필요 없는 단계</h2>'
  '<p>흰 배경과 Gray 900 배경에서 <em>모두</em> 3:1 이상인 단계다. 아이콘·보더·큰 텍스트는 '
  '여기서 고르면 모드별로 색을 갈아끼울 필요가 없다.</p></div>')
a('<div class="scroll"><div class="dual">')
for n in HUES:
    cells = []
    for s in ORDER:
        h = PALETTE[n][s]
        if s in DUAL[n]:
            cells.append('<div class="dcell" style="background:%s;color:%s">%s</div>'
                         % (h, ink(h), s))
        else:
            cells.append('<div class="dcell off">%s</div>' % s)
    cells = "".join(cells)
    a('<div class="dualrow"><div class="rl"><b>%s</b><span>%s</span></div>'
      '<div class="dualcells">%s</div></div>' % (n, KO[n], cells))
a('</div></div>')
a('<div class="note"><b>표면이 밝아지면 달라진다</b><span>400 단은 Gray 900·800 위에서 3:1 을 '
  '넘지만 Gray 700(#3D4B59) 위에서는 2.5–2.7 로 미달한다. 카드가 겹쳐 올라가는 다크 UI 에서는 '
  '그 층에만 300 단을 쓴다.</span></div></section>')

# --- 다크 표면
a('<section><div class="sh"><span class="sn">신규</span><h2>다크 모드 틴트 표면</h2>'
  '<p>라이트의 50·100·200 단이 하는 역할을 다크에서 대신할 값이 램프에 없다. '
  '700–900 단은 채도가 높아 배경으로 쓰면 튄다. 채도를 14–20 으로 낮춘 3단을 따로 둔다.</p></div>')
a('<div class="scroll"><div class="pal">')
for n in HUES:
    cells = []
    for key, ko in (("bg", "표면"), ("bg-hover", "hover"), ("border", "보더")):
        h = SURFACE[n][key]
        cells.append('<button class="sw" style="background:%s;color:%s" data-hex="%s" '
                     'title="%s %s"><span class="sw-s">%s</span>'
                     '<span class="sw-h">%s</span></button>' % (h, ink(h), h, n, key, ko, h))
    st = ROLE[n]["tint_text_d"]
    cells.append('<div class="dcell off" style="grid-column:span 3">본문 %s %s · %.1f:1</div>'
                 % (st, PALETTE[n][st], contrast(PALETTE[n][st], SURFACE[n]["bg"])))
    a('<div class="prow"><div class="rl"><b>%s</b><span>%s</span></div>'
      '<div class="swrow" style="grid-template-columns:repeat(6,minmax(0,1fr))">%s</div></div>'
      % (n, KO[n], "".join(cells)))
a('</div></div></section>')

# --- 검증
ok_all = all(o for _, o, _ in REPORT)
a('<section><div class="sh"><span class="sn">검증</span><h2>자동 점검 %d항목</h2>'
  '<p>생성할 때마다 아래 항목을 다시 계산한다. 하나라도 실패하면 빌드가 멈춘다.</p></div>'
  % len(REPORT))
a('<div class="tw"><table><thead><tr><th>항목</th><th>결과</th><th>값</th></tr></thead><tbody>')
for label, ok, detail in REPORT:
    a('<tr><td>%s</td><td class="pass">%s</td><td class="mono">%s</td></tr>'
      % (label, "통과" if ok else "실패", detail))
a('</tbody></table></div></section>')

# --- 토큰
a('<section><div class="sh"><span class="sn">내보내기</span><h2>토큰</h2>'
  '<p><code>docs/color-tokens.css</code> 와 <code>docs/color-tokens.json</code> 로 '
  '함께 저장된다.</p></div>')
a('<pre>:root{\n'
  '  --color-blue-400: %s;   /* 아이콘 · 양 모드 공용 */\n'
  '  --color-blue-500: %s;   /* 라이트 본문 */\n'
  '  --color-blue-300: %s;   /* 다크 본문 */\n'
  '  --color-blue-surface-dark: %s;\n'
  '  ...\n}</pre>'
  % (PALETTE["Blue"]["400"], PALETTE["Blue"]["500"], PALETTE["Blue"]["300"],
     SURFACE["Blue"]["bg"]))
a('</section>')

a('</main></div>')
a('<footer><div class="wrap">Douzone Design System · 11단 컬러 팔레트 확정본 · '
  'CIELAB(D65) · WCAG 2.1 대비비 검증</div></footer>')
a('<div class="toast" id="toast">복사</div>')
a('''<script>
document.addEventListener("click", function (e) {
  var b = e.target.closest(".sw"); if (!b) return;
  var hex = b.dataset.hex, t = document.getElementById("toast");
  function done() { t.textContent = hex + " 복사"; t.classList.add("on");
    clearTimeout(window.__tt);
    window.__tt = setTimeout(function () { t.classList.remove("on"); }, 1400); }
  if (navigator.clipboard && navigator.clipboard.writeText)
    navigator.clipboard.writeText(hex).then(done, done);
  else done();
});
</script>''')

# ==================================================================== 파일 출력
if not ok_all:
    fails = [r for r in REPORT if not r[1]]
    raise SystemExit("검증 실패 %d건: %s" % (len(fails), fails))

open(OUT_HTML, "w").write("\n".join(H))

css = ["/* Douzone 11단 컬러 팔레트 — docs/build-color-palette.py 로 생성됨 */", ":root {"]
for s in ORDER:
    css.append("  --color-gray-%s: %s;" % (s, G[s]))
for n in HUES:
    css.append("")
    for s in ORDER:
        css.append("  --color-%s-%s: %s;" % (n.lower(), s, PALETTE[n][s]))
css.append("")
css.append("  /* 다크 모드 틴트 표면 */")
for n in HUES:
    for k in ("bg", "bg-hover", "border"):
        css.append("  --color-%s-dark-%s: %s;" % (n.lower(), k, SURFACE[n][k]))
css.append("}")
open(OUT_CSS, "w").write("\n".join(css) + "\n")

json.dump({
    "meta": {"basis": "CIELAB D65", "gray_reference": True,
             "exceptions": {k: POLICY[k][2] for k in ("Yellow", "Brown")}},
    "steps": ORDER,
    "gray": G,
    "hues": PALETTE,
    "kind": KIND,
    "dark_surface": SURFACE,
    "role": ROLE,
    "dual_mode_steps": DUAL,
    "equivalence": EQUIV,
}, open(OUT_JSON, "w"), ensure_ascii=False, indent=2)

print("wrote docs/COLOR_PALETTE.html · color-tokens.css · color-tokens.json")
print("  신규 %d · 재정렬 %d · 무변경 %d · 다크 표면 %d" % (n_new, n_fix, n_keep, len(HUES) * 3))
print("  검증 %d항목 전부 통과" % len(REPORT))
for n in HUES:
    print("  %-7s %s  [%s / %s]" % (n, " ".join(PALETTE[n][s] for s in ORDER),
                                    POLICY[n][0], POLICY[n][1]))
