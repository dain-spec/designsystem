# -*- coding: utf-8 -*-
"""docs/ICON_STYLE_GUIDE.md 생성기.

사용법:  python3 docs/build-icon-guide-md.py

Line / Fill / Multicolor 3종을 하나로 묶은 통합 아이콘 가이드를 만든다.
- Multicolor 수치는 public/icons/multicolor/*.svg 를 매번 전수 계측해서 채운다.
- Line / Fill 수치는 Figma "가이드 제작 진행중" 섹션의 원문을 상수로 인용한다.
  (출처가 Figma뿐이라 계측 대상이 없다. 원문이 바뀌면 아래 MONO_* 를 고칠 것)
"""
import os
import re
import glob
import math
from collections import Counter, defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SVGDIR = os.path.join(ROOT, "..", "..", "public/icongraph/icons/multicolor")
MANIFEST = os.path.join(ROOT, "..", "..", "src/design-system/icongraph/manifest.json")


def _manifest_icons():
    import json
    return json.load(open(MANIFEST, encoding="utf-8"))["multicolor"]

OUT = os.path.join(ROOT, "docs/ICON_STYLE_GUIDE.md")

# ---------------------------------------------------------------- 계측 유틸
TOK = re.compile(r'([MmLlHhVvCcSsQqTtAaZz])|(-?\d*\.?\d+(?:[eE][-+]?\d+)?)')
ARG = {'M': 2, 'L': 2, 'H': 1, 'V': 1, 'C': 6, 'S': 4, 'Q': 4, 'T': 2, 'A': 7, 'Z': 0}
K = 4.0 / 3.0 * (math.sqrt(2) - 1)          # 원호 근사 베지어 핸들 계수


def walk_path(d):
    """path d 를 서브패스별 (점 목록, 큐빅 목록) 로 편다.

    서브패스 단위로 나눠야 pill(완전 라운드)과 코너 라운드가 구분된다.
    path 하나에 여러 서브패스가 있으면 통합 bbox 로는 r == 변/2 판정이 깨진다.
    """
    toks = [(m.group(1), m.group(2)) for m in TOK.finditer(d)]
    i, cmd, cur, start = 0, None, (0.0, 0.0), (0.0, 0.0)
    pts, cubics, subs = [], [], []
    while i < len(toks):
        c, v = toks[i]
        if c is not None:
            cmd = c
            i += 1
            if cmd in 'Zz':
                cur = start
                continue
        if cmd is None:
            break
        C, rel, n = cmd.upper(), cmd.islower(), ARG[cmd.upper()]
        vals = []
        while len(vals) < n and i < len(toks) and toks[i][0] is None:
            vals.append(float(toks[i][1]))
            i += 1
        if len(vals) < n:
            break
        off = (lambda p: (cur[0] + p[0], cur[1] + p[1])) if rel else (lambda p: p)
        if C == 'M':
            if pts:
                subs.append((pts, cubics))
            pts, cubics = [], []
            cur = start = off((vals[0], vals[1]))
            pts.append(cur)
            cmd = 'l' if rel else 'L'
        elif C in ('L', 'T'):
            cur = off((vals[0], vals[1]))
            pts.append(cur)
        elif C == 'H':
            cur = ((cur[0] + vals[0]) if rel else vals[0], cur[1])
            pts.append(cur)
        elif C == 'V':
            cur = (cur[0], (cur[1] + vals[0]) if rel else vals[0])
            pts.append(cur)
        elif C == 'C':
            p1, p2, p3 = off((vals[0], vals[1])), off((vals[2], vals[3])), off((vals[4], vals[5]))
            cubics.append((cur, p1, p2, p3))
            pts += [p1, p2, p3]
            cur = p3
        elif C in ('S', 'Q'):
            p1, p2 = off((vals[0], vals[1])), off((vals[2], vals[3]))
            pts += [p1, p2]
            cur = p2
        elif C == 'A':
            cur = off((vals[5], vals[6]))
            pts.append(cur)
    if pts:
        subs.append((pts, cubics))
    return subs


def bbox(pts):
    if not pts:
        return None
    xs = [p[0] for p in pts]
    ys = [p[1] for p in pts]
    return (min(xs), min(ys), max(xs), max(ys))


def shapes_of(svg):
    """(bbox, cubics) 목록 — path / rect / circle 전부."""
    out = []
    for m in re.finditer(r'<(path|rect|circle)\b([^>]*)>', svg):
        tag, attr = m.group(1), m.group(2)

        def g(k, dv=0.0):
            mm = re.search(k + r'="([\d.-]+)"', attr)
            return float(mm.group(1)) if mm else dv

        if tag == 'circle':
            cx, cy, r = g('cx'), g('cy'), g('r')
            out.append(((cx - r, cy - r, cx + r, cy + r), []))
        elif tag == 'rect':
            out.append(((g('x'), g('y'), g('x') + g('width'), g('y') + g('height')), []))
        else:
            dm = re.search(r'\sd="([^"]+)"', attr)
            if not dm:
                continue
            for pts, cub in walk_path(dm.group(1)):
                b = bbox(pts)
                if b:
                    out.append((b, cub))
    return out


def corners_of(cubics, w, h):
    """사분원에 해당하는 큐빅만 골라 반경을 되돌린다."""
    res = []
    for p0, c1, c2, p1 in cubics:
        h1 = math.hypot(c1[0] - p0[0], c1[1] - p0[1])
        h2 = math.hypot(p1[0] - c2[0], p1[1] - c2[1])
        if h1 < 1e-6 or h2 < 1e-6 or abs(h1 - h2) > 0.06 * max(h1, h2):
            continue
        a_in = math.degrees(math.atan2(c1[1] - p0[1], c1[0] - p0[0]))
        a_out = math.degrees(math.atan2(p1[1] - c2[1], p1[0] - c2[0]))
        turn = (a_out - a_in + 540) % 360 - 180
        if abs(abs(turn) - 90) > 12:
            continue
        r = (h1 + h2) / 2 / K
        side = min(w, h)
        full = side > 0 and abs(r - side / 2) <= max(0.06, side * 0.04)
        res.append((r, side, full))
    return res


# ---------------------------------------------------------------- 데이터 수집
def load_meta():
    # manifest 의 tags 는 ko + en 순서로 합쳐져 있어, 한글이 든 태그만 ko 로 본다.
    return [dict(id=m["id"], cat=m["category"] or "미분류",
                 ko=[t for t in m["tags"] if re.search(r"[가-힣]", t)],
                 nid=m.get("figmaNodeId", ""))
            for m in _manifest_icons()]


META = load_meta()
CAT_ORDER = ["문서", "금융", "일반", "물류", "위치", "이모지"]
CAT_RANGE = {"문서": "서류·전표·계약·보고서", "금융": "카드·통장·금액·보험",
             "일반": "UI·기기·프로세스·기호", "물류": "상자·트럭·공장·재고",
             "위치": "지도·핀·장소", "이모지": "감정 표현"}

KEYSHAPE = {(18, 18): "square 18×18", (20, 16): "rect 20×16",
            (16, 20): "rect 16×20", (20, 20): "circle 20×20"}

corners, keyhit, keydetail, freeform, hexes = [], Counter(), defaultdict(list), [], set()
live = Counter()
for f in sorted(glob.glob(os.path.join(SVGDIR, "*.svg"))):
    name = os.path.basename(f)[:-4]
    short = name.replace("ic_", "").replace("_flat", "")
    svg = open(f).read()
    hexes |= set(re.findall(r'fill="(#[0-9A-Fa-f]{6})"', svg))
    sh = shapes_of(svg)
    if not sh:
        continue
    for b, cub in sh:
        for r, side, full in corners_of(cub, b[2] - b[0], b[3] - b[1]):
            corners.append(dict(icon=name, r=r, side=side, full=full))
    big = max(sh, key=lambda t: (t[0][2] - t[0][0]) * (t[0][3] - t[0][1]))[0]
    wh = (round(big[2] - big[0]), round(big[3] - big[1]))
    if wh in KEYSHAPE:
        keyhit[KEYSHAPE[wh]] += 1
        keydetail[KEYSHAPE[wh]].append(short)
    else:
        freeform.append(short)
    allb = bbox([(b[0], b[1]) for b, _ in sh] + [(b[2], b[3]) for b, _ in sh])
    if abs(allb[0] - 2) < .1 and abs(allb[1] - 2) < .1:
        live["20"] += 1
    elif abs(allb[0] - 3) < .1 and abs(allb[1] - 3) < .1:
        live["18"] += 1
    else:
        live["free"] += 1

EVENODD = []
for _f in sorted(glob.glob(os.path.join(SVGDIR, "*.svg"))):
    _s = open(_f).read()
    _m = re.search(r'fill-rule="evenodd"[^>]*\sd="([^"]+)"', _s)
    if _m:
        EVENODD.append((os.path.basename(_f)[:-4], len(re.findall(r'[Mm]', _m.group(1)))))

N_ALL = len(corners)
N_FULL = len([c for c in corners if c["full"]])
N_CO = N_ALL - N_FULL
LADDER_VALS = [0.5, 0.75, 1.0, 1.5, 2.2, 3.0, 3.5]



SNAP_TOL = 0.12          # 계단값에 배정하는 허용 오차


def _nearest(v, opts):
    return min(opts, key=lambda t: abs(t - v))


# 코너 하나를 가장 가까운 계단값에 한 번만 배정한다 (중복·누락 없음)
LADDER_HIT = Counter()
OFF_LADDER = []
for _c in corners:
    if _c["full"]:
        continue
    t = _nearest(_c["r"], LADDER_VALS)
    if abs(_c["r"] - t) <= SNAP_TOL:
        LADDER_HIT[t] += 1
    else:
        OFF_LADDER.append(_c)
N_ON = sum(LADDER_HIT.values())


def co_count(target):
    return LADDER_HIT[target]


FULL_SIDES = [1.5, 2.0, 2.7, 5.0, 10.0, 20.0]
FULL_HIT = Counter()
for _c in corners:
    if not _c["full"]:
        continue
    t = _nearest(_c["side"], FULL_SIDES)
    if abs(_c["side"] - t) <= 0.35:
        FULL_HIT[t] += 1


def full_count(side):
    return FULL_HIT[side]


def container_stat(side, tol=0.6):
    v = sorted(c["r"] for c in corners
               if not c["full"] and abs(c["side"] - side) < tol)
    return (v[len(v) // 2] if v else 0.0, len(v))


# ---------------------------------------------------------------- 인용 상수
# 출처: Figma 파일 "Icon Flat" › 섹션 "가이드 제작 진행중" › 프레임 "Guide"
MONO_SRC = "Figma · 가이드 제작 진행중 › Guide"
MONO_GRID = "아이콘을 그리기위한 기본 사이즈를 24px로 잡아서 그리드에 맞춰 제작합니다."
MONO_SIZES = "주요 크기는 24를 기준으로 14, 18, 24, 32, 40를 사용한다."
MONO_KEYSHAPE = ("Keyline shape를 가이드 라인으로 사용하여 아이콘에서 일관된 비율을 유지합니다. "
                 "아이콘의 시각적 균형을 맞추기 위해 keyline을 기준으로 일부 요소가 살짝 길거나 "
                 "짧게 조정이 가능합니다.")
MONO_STROKE = ("24x24px 사이즈의 아이콘 기본 두께는 1.5px이며 1 또는 2px를 적용할 수 있으며 "
               "획의 정렬은 Center로 합니다.")
MONO_RADIUS = "24x24px 사이즈의 아이콘의 Radius는 3.5px입니다."
MONO_OVERLAP = "오브제와 오브제가 결합된 아이콘은 겹쳐진 위치와 여백을 동일하게 적용합니다."
MONO_HOWTO = ("아이콘 오브젝트의 원형보존 및 추후 변형의 용의성을 위해 원본과 배포하는 영역은 "
              "분리하여 보존합니다. 아이콘은 outline stroke하여 채워진 도형으로 배포되어야 "
              "추후 SVG에서 변형이 되지 않습니다.")
MONO_FLATTEN_WARN = ("꼭 Union/Subtract를 적용 후 Flatten을 해야합니다. 도형을 곧바로 Flatten 하면 "
                     "도형 내 불필요한 선들이 남아 형태가 변형되거나 SVG 추출 시 코드가 "
                     "지저분해질 수 있습니다.")
MULTI_NOTE = ("플랫아이콘은 도형 subtract 하지 않습니다. (배경색 영향 받지 않게) "
              "Icon과 형태 똑같이 사용해주세요. (예: 원 표시)")

DODONT = [("선 끝을 둥글게 표현", "선 끝을 뾰족하거나 각지게 표현하지 않음"),
          ("일관된 선 굵기 사용", "다양한 굵기의 선을 함께 사용하지 않음"),
          ("요소들의 정렬은 눈으로 봤을 때 기준으로 맞춤", "수치로만 정렬하지 않음")]

ABBR = [("문서", "doc"), ("사람", "user"), ("연필", "edit"), ("통장", "passbook"),
        ("화살표", "arrow"), ("신용카드", "card"), ("명함", "idcard"), ("폴더", "folder")]

FAMILIES = [
    ("Blue", "주력 hue. 문서·업무·시스템 전반의 기본값",
     [("Tint", "#B5D4FF"), ("Light", "#83B3FF"), ("Base", "#4377F1"),
      ("Deep", "#1D4DBE"), ("Ink", "#0234A9")]),
    ("Navy Grey", "중립 오브젝트. 기기·건물·프로세스처럼 색이 의미를 갖지 않을 때",
     [("Tint", "#D7DDED"), ("Light", "#B3C1D8"), ("Base", "#8F99AD"),
      ("Deep", "#6F7F99"), ("Ink", "#465165")]),
    ("Purple", "AI·자동화·설정 계열",
     [("Tint", "#E9E1FF"), ("Light", "#B371FF"), ("Base", "#9271E7"),
      ("Deep", "#702CC4"), ("Ink", "#4119AB")]),
    ("Teal", "증빙·인증·신분 계열",
     [("Tint", "#DEF7F4"), ("Light", "#80E0DD"), ("Base", "#47CECB"),
      ("Deep", "#04AFAF"), ("Ink", "#188381")]),
    ("Green", "완료·승인·수취. 금액 기호에도 사용",
     [("Tint", "#91F5C8"), ("Light", "#49DBB4"), ("Base", "#2FBD97"),
      ("Deep", "#02B36D"), ("Ink", "#0C9D76")]),
    ("Coral", "경고·마감·위치 핀. 가장 강한 hue이므로 아껴 쓴다. Alt는 하트·강조 전용",
     [("Tint", "#FFA0BB"), ("Light", "#FF7491"), ("Base", "#FF506D"),
      ("Deep", "#EC648A"), ("Alt", "#FF474A")]),
    ("Amber", "이모지 얼굴과 강조 신호 전용. 스텝 이름이 다른 family와 다르다",
     [("Face", "#FFD24A"), ("Warm", "#FFC14D"), ("Base", "#FF8235"),
      ("Deep", "#ED672E"), ("Ink", "#402A32")]),
]

RADIUS_FIX = [
    ("ic_process_flat", "코너 라운드 6종 (0.75 · 1.1 · 1.25 · 1.6 · 3.25 · 4.1)", "3종 이하로 정리"),
    ("ic_receipt_flat", "`r 0.26` 3곳 — 0.5 미만", "`0.5` 로 올림"),
    ("ic_doc_state_flat", "18×18 컨테이너에 `3.25` / `3.35`", "`3.5` 로 통일"),
    ("ic_doc_search_flat", "10×10 면에 `4.0` — 계단 밖", "`3.0` 또는 완전 라운드로"),
    ("ic_card_flat · ic_embedding_flat · ic_idcard_flat",
     "20×16 면에 `3.5` — 같은 크기인 browser·card_money·contract 는 `3.0`", "`3.0` 으로 수정"),
    ("ic_arrow_left_flat · ic_arrow_right_flat", "11×11 면에 `0.75` / `0.8` 혼용", "`0.75` 로 통일"),
    ("ic_shop_bag_flat", "`1.35` / `2.25` — 계단 밖", "`1.5` / `2.2`"),
    ("ic_truck_flat", "`2.0` / `2.5`", "`2.2` 로 통일"),
]

CHECKS_COMMON = [
    ("캔버스", '24 × 24, viewBox "0 0 24 24"'),
    ("Key shape", "4종 중 하나에 맞췄는지 (자유 실루엣은 시각 무게로 맞춤)"),
    ("Radius", "면 최소변 × 0.19 → 변 18 = 3.5, 변 16 = 3.0"),
    ("좌표", "주요 형태는 0.5 스냅, 소수점 4자리 이하"),
    ("정렬", "수치가 아니라 눈으로 봤을 때 기준으로 맞췄는지"),
    ("Size 검증", "14 · 18 · 24 · 32 · 40 으로 축소해 형태가 읽히는지"),
    ("Flatten", "Union/Subtract 적용 후 Flatten 했는지 (곧바로 Flatten 금지)"),
    ("원본 보존", "원본 레이어를 백업하고 hidden 처리했는지"),
    ("Naming", "스타일별 접미사 규칙에 맞는지"),
]
CHECKS_LINE = [
    ("두께", "기본 1.5. 1 또는 2 사용 시 아이콘 전체에서 일관"),
    ("획 정렬", "Center"),
    ("선 끝", "둥글게 (round cap)"),
    ("Outline", "outline stroke 후 채워진 도형으로 배포"),
]
CHECKS_MULTI = [
    ("스트로크", "stroke 속성 0건 — 선처럼 보이는 요소도 면으로"),
    ("불투명도", "opacity / fill-opacity 로 톤을 만들지 않았는지"),
    ("Subtract", "도형 subtract 를 쓰지 않았는지 (배경색 영향)"),
    ("구멍", "색 배경 위에 올려 비치는 구멍이 없는지 — 흰 배경에서는 안 보인다"),
    ("레이어", "Base → Accent → Detail → Badge 순서, 3–4단"),
    ("hue", "주 hue 1개 + white. 두 번째 hue는 배지·신호에만"),
    ("토큰", "모든 색이 팔레트 토큰 값과 정확히 일치"),
    ("코너 라운드", "7단 계단 안의 값인지 · 한 아이콘에 3종 이하 · r ≥ 0.5"),
    ("최소 치수", "라인 두께 ≥ 1.5, 독립 도형 ≥ 2.0"),
    ("등록", "public/icongraph/icons/multicolor/ 저장 + manifest.json 메타 추가"),
]

# ---------------------------------------------------------------- 페이지 정의
PAGES = [
    ("P00", "", "표지"),
    ("P01", "", "목차"),
    ("P02", "1", "1.1  문서 범위 — 3가지 스타일"),
    ("P03", "1", "1.2  스타일 선택 기준"),
    ("P04", "1", "1.3  스타일 대조표"),
    ("P05", "2", "2.1  그리드와 패딩"),
    ("P06", "2", "2.2  Key shape"),
    ("P07", "2", "2.3  Radius"),
    ("P08", "2", "2.3-1  Corner radius 계단"),
    ("P09", "2", "2.4  Size"),
    ("P10", "2", "2.5  조합 — 겹친 형태"),
    ("P11", "3", "3.1  Line — 두께와 묘사"),
    ("P12", "3", "3.2  Fill — 면 구성"),
    ("P13", "3", "3.3  Multicolor — 레이어 3단 구조"),
    ("P14", "3", "3.3  Multicolor — 컬러 시스템"),
    ("P15", "3", "3.3  Multicolor — 컬러 사용 규칙"),
    ("P16", "3", "3.3  Multicolor — 디테일 토큰"),
    ("P17", "3", "3.3  Multicolor — 배지와 조합"),
    ("P18", "3", "3.3  Multicolor — 이모지 서브셋"),
    ("P19", "3", "3.4  Do · Don't"),
    ("P20", "4", "4.1  제작방법 — 스타일별 3플로우"),
    ("P21", "4", "4.2  Export 규칙"),
    ("P22", "4", "4.3  Naming"),
    ("P23", "4", "4.4  등록"),
    ("P24", "4", "4.5  QA 체크리스트"),
    ("P25", "A", "부록 A  현재 세트 현황"),
    ("P26", "A", "부록 B  약어 사전과 노드 대응표"),
]
PARTS = {"1": "시작하기", "2": "공통 규격", "3": "스타일별 규격",
         "4": "제작과 배포", "A": "부록"}
COLS, GAP, PW, PH, PAD = 3, 160, 1920, 1080, 120
POS = {p[0]: "%d, %d" % (PAD + (i % COLS) * (PW + GAP), PAD + (i // COLS) * (PH + GAP))
       for i, p in enumerate(PAGES)}
TITLE = {p[0]: p[2] for p in PAGES}
SECT_W = PAD * 2 + COLS * PW + (COLS - 1) * GAP
SECT_H = PAD * 2 + ((len(PAGES) + COLS - 1) // COLS) * PH + \
    (((len(PAGES) + COLS - 1) // COLS) - 1) * GAP

O = []


def w(line=""):
    O.append(line)


def page(pid):
    w("## %s · %s" % (pid, TITLE[pid]))
    w("")
    w("`배치 %s`" % POS[pid])
    w("")


def fmt(v):
    """0.5 → "0.5", 1.0 → "1.0", 0.75 → "0.75" — 소수점 한 자리는 유지."""
    t = ("%.2f" % v).rstrip("0")
    return t + "0" if t.endswith(".") else t


def table(headers, rows):
    w("| " + " | ".join(headers) + " |")
    w("|" + "|".join(["---"] * len(headers)) + "|")
    for r in rows:
        w("| " + " | ".join(str(c) for c in r) + " |")
    w("")


def hr():
    w("---")
    w("")


def quote(t):
    w("> " + t)
    w("")


def src(t):
    w("<sub>출처 — %s</sub>" % t)
    w("")


# ================================================================ 문서 시작
w("# 아이콘 제작 가이드")
w("")
w("Line · Fill · Multicolor 통합")
w("")
table(["", ""], [
    ["**문서 종류**", "아이콘 스타일 가이드 (보고용)"],
    ["**버전**", "Spec v2 — Monochrome 가이드 + Multicolor 가이드 통합"],
    ["**대상 스타일**", "Line · Fill · Multicolor 3종"],
    ["**대상 세트**", "`public/icons/multicolor` · %d종 (Multicolor) / Line·Fill 은 Figma 라이브러리" % len(META)],
    ["**근거**", "Multicolor = SVG %d개 전수 계측 · Line/Fill = %s 원문 인용" % (len(META), MONO_SRC)],
    ["**페이지 규격**", "1920 × 1080 · %d페이지" % len(PAGES)],
])
quote("이 문서는 1920×1080 페이지 단위로 작성되었다. `---` 로 구분된 각 블록이 한 페이지에 "
      "대응하며, 페이지 머리의 `배치` 값은 Figma Section 기준 상대좌표다. "
      "%d열 × %d행 배치이므로 Section 은 최소 **%d × %d** 여야 한다."
      % (COLS, (len(PAGES) + COLS - 1) // COLS, SECT_W, SECT_H))
quote("**표기** — 계측으로 확인한 값은 그대로 쓴다. Figma 가이드에서 인용한 문장은 각주로 "
      "출처를 밝힌다. 아직 정해지지 않아 확인이 필요한 항목은 `[확인 필요]` 로 표시했다.")

# ---------------- 레이아웃 규격
w("## 페이지 레이아웃 규격")
w("")
table(["항목", "값"], [
    ["페이지", "1920 × 1080 · 배경 `#FFFFFF`"],
    ["여백", "좌·우 140 / 상 96 / 하 88"],
    ["본문 폭", "1640"],
    ["페이지 그리드", "%d열 × %d행 · 간격 %d" % (COLS, (len(PAGES) + COLS - 1) // COLS, GAP)],
    ["머리글", "y 58 · `NN / %d · 아이콘 제작 가이드` · 16px" % len(PAGES)],
    ["머리글 구분선", "y 96 · 1640 × 1"],
])
w("### 타입 스케일")
w("")
table(["역할", "크기", "굵기", "색"], [
    ["표지 제목", "88", "800", "`#151A26`"],
    ["부 번호 (eyebrow)", "22", "600", "`#3B6FE8`"],
    ["장 제목", "46", "700", "`#151A26`"],
    ["리드", "24", "400", "`#3F4859`"],
    ["소제목", "22", "700", "`#151A26`"],
    ["본문 · 표 셀", "19", "400", "`#3F4859`"],
    ["표 머리 · 라벨", "16", "600", "`#78808F`"],
    ["캡션 · 머리글", "16", "400", "`#78808F`"],
])
w("### 문서 컬러 토큰")
w("")
w("아이콘 팔레트와 별개로, 문서 자체에 쓰는 색이다.")
w("")
table(["토큰", "값", "용도"], [
    ["ink", "`#151A26`", "제목"], ["ink-2", "`#3F4859`", "본문"],
    ["muted", "`#78808F`", "캡션·머리글"], ["line", "`#DCE2EE`", "구분선"],
    ["surface", "`#EBEFF7`", "표 머리 띠"], ["plate", "`#F7F9FC`", "아이콘 예시 배경"],
    ["accent", "`#3B6FE8`", "부 번호·강조"], ["good", "`#0C7F62`", "Do · 허용"],
    ["bad", "`#D2384F`", "Don't · 금지·경고"],
])
w("### 페이지 배치")
w("")
table(["페이지", "부", "제목", "배치 (x, y)"],
      [[p[0], PARTS.get(p[1], "—"), p[2], POS[p[0]]] for p in PAGES])
hr()

# ================================================================ P00 표지
page("P00")
w("```")
w("DOUZONE ICON LIBRARY                       ← eyebrow 22 / 600 / accent   @140, 300")
w("")
w("아이콘 제작 가이드                          ← 표지 제목 88 / 800 / ink    @140, 350")
w("Line · Fill · Multicolor")
w("")
w("[리드 26 / 400 / ink-2]                                                  @140, 620")
w("[문서 정보 4행 19 / 400 / muted]                                          @140, 770")
w("[3스타일 아이콘 스트립 · 각 96px]                                          @140, 900")
w("```")
w("")
w("**리드**")
w("")
quote("24px 그리드와 Key shape 4종을 세 스타일이 공유한다. 공통 규격을 먼저 익히고, "
      "그리기 방식이 갈리는 지점만 스타일별로 확인하면 된다.")
w("**문서 정보**")
w("")
w("```")
w("버전    Spec v2 (통합)")
w("대상    Line · Fill · Multicolor")
w("근거    Multicolor 전수 계측 %d종 / Line·Fill Figma 가이드 인용" % len(META))
w("```")
hr()

# ================================================================ P01 목차
page("P01")
cur_part = None
for pid, part, title in PAGES[2:]:
    if part != cur_part:
        cur_part = part
        w("")
        w("**%s. %s**" % (part, PARTS[part]) if part != "A" else "**부록**")
        w("")
    w("- `%s`  %s" % (pid, title))
w("")
w("### 계측 요약 — Multicolor")
w("")
table(["항목", "값", "비고"], [
    ["캔버스", "24 × 24", "%d / %d 전부 동일" % (len(META), len(META))],
    ["Key shape 일치", "%d / %d종" % (sum(keyhit.values()), len(META)),
     "나머지 %d종은 자유 오브젝트 실루엣" % len(freeform)],
    ["스트로크", "0건", "선처럼 보이는 요소도 전부 면"],
    ["그라디언트 · opacity", "0건", "—"],
    ["라운드 코너 총수", "%d개" % N_ALL, "완전 라운드 %d · 코너 라운드 %d" % (N_FULL, N_CO)],
    ["컨테이너 라운드", "3.5 / 3.0", "변 18 → 3.5 · 변 16 → 3.0"],
    ["레이어 단수", "3 – 4단", "Base → Accent → Detail → Badge"],
    ["사용 hex", "%d개" % len(hexes), "정규 토큰 35개로 수렴 필요"],
    ["카테고리", "6종", " · ".join(CAT_ORDER)],
])
hr()

# ================================================================ P02 문서 범위
page("P02")
w("이 문서는 세 가지 아이콘 스타일을 하나로 다룬다. 셋은 **같은 캔버스·같은 Key shape·같은 "
  "Radius** 위에서 그려지고, 표현 방식만 다르다.")
w("")
table(["스타일", "표현", "쓰이는 곳", "네이밍"], [
    ["**Line**", "선(stroke). 기본 두께 1.5", "UI 기본. 목록·버튼·내비게이션",
     "`ic_의미` · `_thin` · `_thick`"],
    ["**Fill**", "단색 면", "선택 상태, 강조가 필요한 자리", "`ic_의미_fill`"],
    ["**Multicolor**", "다색 면 3단 레이어", "대시보드·안내·빈 화면 등 설명이 필요한 자리",
     "`ic_의미_flat`"],
])
w("### 세 스타일이 공유하는 것")
w("")
table(["항목", "값", "근거"], [
    ["캔버스", "24 × 24", "두 가이드 모두 동일"],
    ["Key shape", "square 18×18 · rect 20×16 · rect 16×20 · circle 20×20",
     "Multicolor %d / %d종이 4종에 일치" % (sum(keyhit.values()), len(META))],
    ["Radius", "면 최소변 × 0.19", "변 18 → 3.5 · 변 16 → 3.0 (양쪽 모두)"],
    ["Size", "14 · 18 · 24 · 32 · 40", MONO_SRC],
    ["두께 기준값", "1.5", "Line = stroke 1.5 / Fill·Multicolor = 최소 면 두께 1.5"],
])
w("### 갈리는 것")
w("")
table(["항목", "Line", "Fill", "Multicolor"], [
    ["두께", "stroke 1 / 1.5 / 2, 정렬 Center", "면 두께 ≥ 1.5", "면 두께 ≥ 1.5"],
    ["색", "단색", "단색", "7 family × 5 step"],
    ["레이어", "단일", "단일", "Base → Accent → Detail → Badge"],
    ["제작", "outline stroke → Union → Flatten", "Union/Subtract → Flatten",
     "**Subtract 금지** → Flatten"],
    ["접미사", "`_thin` `_thick`", "`_fill`", "`_flat` · 이모지 `_face`"],
])
hr()

# ================================================================ P03 선택 기준
page("P03")
w("어떤 스타일로 그릴지는 **아이콘이 놓이는 자리**가 정한다. 같은 개념을 세 스타일로 "
  "모두 만들 필요는 없다.")
w("")
table(["상황", "스타일", "이유"], [
    ["목록·버튼·내비게이션 등 반복되는 UI", "**Line**", "면이 많으면 화면이 무거워진다"],
    ["같은 아이콘의 선택·활성 상태", "**Fill**", "Line 과 짝을 이뤄 상태를 구분"],
    ["대시보드 카드·안내 문구·빈 화면", "**Multicolor**", "설명을 돕는 자리. 개수가 적어야 효과가 있다"],
    ["16px 이하로 축소되는 자리", "**Line**", "Multicolor 는 레이어가 뭉개진다"],
    ["같은 화면에 8개 이상 나열", "**Line** 또는 **Fill**", "Multicolor 가 많으면 시선이 분산된다"],
])
quote("**[확인 필요]** 위 기준은 두 가이드의 용례에서 역산한 제안이다. 실제 운영 기준이 "
      "다르다면 이 표를 먼저 확정해야 한다.")
w("### 짝을 맞춰야 하는 경우")
w("")
w("Line 과 Fill 은 **같은 실루엣**을 공유해야 한다. 상태가 바뀔 때 형태가 달라 보이면 "
  "다른 아이콘으로 읽힌다. Multicolor 는 독립적으로 그려도 된다.")
w("")
hr()

# ================================================================ P04 대조표
page("P04")
w("한 장으로 보는 3스타일 규격. 자세한 내용은 각 장을 본다.")
w("")
table(["", "Line", "Fill", "Multicolor"], [
    ["캔버스", "24 × 24", "24 × 24", "24 × 24"],
    ["Key shape", "4종 공통", "4종 공통", "4종 공통"],
    ["Radius", "변 × 0.19", "변 × 0.19", "변 × 0.19"],
    ["Size", "14 · 18 · 24 · 32 · 40", "동일", "동일"],
    ["두께", "**1.5** (1 · 2 가능)<br>정렬 Center", "면 ≥ 1.5", "면 ≥ 1.5<br>텍스트 pill h 1.5"],
    ["선 끝", "round", "—", "—"],
    ["색", "단색", "단색", "주 hue 1개 + white"],
    ["레이어", "1단", "1단", "3 – 4단"],
    ["조합", "겹침 위치·여백 동일", "동일", "동일 + 우하단 배지"],
    ["제작", "outline stroke<br>→ Union → Flatten", "Union / Subtract<br>→ Flatten",
     "**Subtract 금지**<br>→ Flatten"],
    ["Naming", "`ic_folder`<br>`ic_folder_thin`<br>`ic_folder_thick`", "`ic_folder_fill`",
     "`ic_doc_money_flat`<br>`ic_emoji_sad_face`"],
])
quote("**충돌 [확인 필요]** — `_fill`(Monochrome 면)과 `_flat`(Multicolor)이 둘 다 '면'을 "
      "뜻해 이름만으로 구분되지 않는다. Multicolor 를 `_color` 로 바꾸는 안이 있으나 "
      "이미 %d종이 배포되어 있어 비용이 든다." % len(META))
hr()

# ================================================================ P05 그리드
page("P05")
quote(MONO_GRID)
src(MONO_SRC)
w("### 라이브 영역과 패딩")
w("")
w("캔버스 24 안에서 형태가 들어가는 영역이 라이브 영역이고, 그 바깥이 패딩이다. "
  "패딩은 아이콘이 다른 요소와 붙지 않게 하는 최소 여백이므로 침범하지 않는다.")
w("")
table(["라이브 영역", "좌표", "패딩", "쓰는 형태", "Multicolor 사용"], [
    ["**20 × 20**", "`2 → 22`", "2", "원형·와이드·유기적 실루엣", "%d종" % live["20"]],
    ["**18 × 18**", "`3 → 21`", "3", "사각 컨테이너", "%d종" % live["18"]],
    ["자유 실루엣", "`1 → 23`", "1", "핀·카트처럼 한쪽으로 뻗는 형태", "%d종" % live["free"]],
])
w("### 배지 예외 — Multicolor")
w("")
quote("배지가 붙을 때만 라이브 영역을 넘길 수 있다. 실제 세트의 최대 확장은 `x 22.13` — "
      "즉 캔버스 경계에서 최소 `1.8` 의 여백은 항상 남긴다.")
w("### 도해")
w("")
w("2단 구성 · 각 480 × 480 · 24분할 그리드 위에 아이콘 배치 · 라이브 영역은 점선 `#D2384F`")
w("")
hr()

# ================================================================ P06 Key shape
page("P06")
quote(MONO_KEYSHAPE)
src(MONO_SRC)
w("### 4종")
w("")
rows = []
for k in ["square 18×18", "rect 20×16", "rect 16×20", "circle 20×20"]:
    ex = ", ".join("`%s`" % n for n in keydetail[k][:4]) or "—"
    rows.append(["**%s**" % k, "%d종" % keyhit[k], ex])
table(["Key shape", "Multicolor 사용", "예"], rows)
w("Monochrome 가이드가 정의한 4종이 Multicolor 에도 그대로 나타난다 — "
  "**%d / %d종 (%.0f%%)**. 두 스타일이 같은 골격을 쓴다는 근거이며, 이 문서를 하나로 "
  "합친 이유이기도 하다." % (sum(keyhit.values()), len(META),
                          100.0 * sum(keyhit.values()) / len(META)))
w("")
w("### 자유 실루엣")
w("")
w("나머지 %d종은 4종에 맞지 않는 오브젝트 형태다. 이 경우 Key shape 대신 **시각 무게**를 "
  "4종에 맞춘다 — 나란히 놓았을 때 같은 크기로 보이면 된다." % len(freeform))
w("")
w(" ".join("`%s`" % n for n in sorted(freeform)))
w("")
hr()

# ================================================================ P07 Radius
page("P07")
quote(MONO_RADIUS)
src(MONO_SRC)
w("이 문장은 변 18 컨테이너를 전제로 한다. 실제로는 **면 크기에 비례**하며, 계측된 비율 "
  "중앙값은 `0.194` 다.")
w("")
w("### 규칙 — 면 최소변 × 0.19")
w("")
rows = []
for side in (18, 16, 15, 14, 13):
    actual, n = container_stat(side)
    pred = round(side * 0.19 * 2) / 2
    mark = "✓" if abs(actual - pred) < 0.26 else ("△" if side < 16 else "✕")
    rows.append(["**%d**" % side, "%.2f" % (side * 0.19), "`%.1f`" % pred,
                 "`%.1f` %s" % (actual, mark), n])
table(["면 최소변", "변 × 0.19", "0.5 단위", "세트 실사용", "n"], rows)
w("`✓` 규칙 일치 · `△` 사각 컨테이너가 아닌 오브젝트(폴더·트럭·사이렌·쇼핑백) · `✕` 규칙 이탈")
w("")
quote("검증된 앵커는 **변 18 → 3.5**, **변 16 → 3.0** 두 개다. Figma 가이드 본문의 "
      "\"Radius 3.5\" 와 알림 메모의 \"Corner radius 3\" 은 모순이 아니라 **면 크기가 다른 "
      "두 경우**를 각각 적은 것이다.")
w("### 세 스타일 공통")
w("")
w("Radius 는 형태의 골격이므로 Line · Fill · Multicolor 가 같은 값을 쓴다. Line 에서는 "
  "stroke 의 바깥선이 아니라 **패스 자체**의 라운드 값이다.")
w("")
hr()

# ================================================================ P08 corner radius
page("P08")
w("Multicolor 세트에서 라운드 코너 **%d개**를 추출해 정리했다. Line · Fill 도 같은 계단을 "
  "쓰되, 계측 대상이 Figma 라이브러리뿐이라 아래 수치는 Multicolor 기준이다." % N_ALL)
w("")
w("### 먼저 두 종류를 구분한다")
w("")
table(["종류", "정의", "수", "성격"], [
    ["**완전 라운드**", "`r = 변 / 2`", "%d개 (%.0f%%)" % (N_FULL, 100.0 * N_FULL / N_ALL),
     "값을 고르는 것이 아니라 형태 자체. pill · dot · 원"],
    ["**코너 라운드**", "`r < 변 / 2`", "%d개 (%.0f%%)" % (N_CO, 100.0 * N_CO / N_ALL),
     "실제로 값을 선택하는 대상"],
])
quote("두 값이 같은 표에 섞이면 규칙이 보이지 않는다. 예를 들어 `r 0.75` 는 변 1.5 pill 의 "
      "완전 라운드이면서 동시에 변 5 면의 코너 라운드로도 쓰인다.")
w("### 코너 라운드 계단 — 7단")
w("")
LADDER_ROLE = {
    0.5: "디테일 면 · 작은 구멍 · 최소 라운드",
    0.75: "작은 면. 변 1.5 pill 의 완전 라운드와 같은 값",
    1.0: "중간 디테일 면", 1.5: "소형 면", 2.2: "중형 면 · 폴더 탭",
    3.0: "변 16 컨테이너", 3.5: "변 18 컨테이너 — 세트 기본값",
}
rows = []
for v in LADDER_VALS:
    n = co_count(v)
    rows.append(["`R-%03d`" % round(v * 100), "**%s**" % fmt(v), "%d개 · %.1f%%" % (n, 100.0 * n / N_CO),
                 LADDER_ROLE[v]])
table(["토큰", "값", "세트 내 사용", "역할"], rows)
w("전체 코너 라운드의 **%.0f%%**(%d/%d)가 이 7단에 ±%.2f 이내로 들어온다. "
  "나머지 %d개가 아래 정리 대상이다."
  % (100.0 * N_ON / N_CO, N_ON, N_CO, SNAP_TOL, len(OFF_LADDER)))
w("")
w("### 완전 라운드 표준 변")
w("")
FULL_USE = [(1.5, "텍스트 라인 pill — 표준"), (2.0, "점 · 작은 마커"), (2.7, "이모지 눈"),
            (5.0, "중형 원형 요소"), (10.0, "배지 · 원형 요소"), (20.0, "원형 컨테이너")]
table(["변", "r", "세트 내 사용", "용도"],
      [["`%s`" % fmt(s), "`%s`" % fmt(s / 2), "%d개" % full_count(s), u]
       for s, u in FULL_USE])
_fu = sum(full_count(s) for s, _ in FULL_USE)
w("위 6종이 완전 라운드 %d개 중 **%d개(%.0f%%)** 를 차지한다. 나머지 %d개는 오브젝트 "
  "고유의 둥근 형태(핀 머리·트럭 바퀴 등)다." % (N_FULL, _fu, 100.0 * _fu / N_FULL, N_FULL - _fu))
w("")
w("### 제약")
w("")
w("- `r > 변 / 2` 는 불가능하다. 넘기면 완전 라운드이므로 그렇게 표기한다")
w("- **`r < 0.5` 금지** — 24px 에서 각진 코너와 구분되지 않는다")
w("- **한 아이콘 안의 코너 라운드는 3종 이하**")
w("- 컨테이너 라운드는 아이콘당 하나. 같은 크기 면에 다른 값을 쓰지 않는다")
w("")
w("### 정리 대상")
w("")
table(["아이콘", "문제", "조치"], [["`%s`" % a, b, c] for a, b, c in RADIUS_FIX])
hr()

# ================================================================ P09 Size
page("P09")
quote(MONO_SIZES)
src(MONO_SRC)
w("### 사이즈별 대응")
w("")
table(["Size", "용도", "두께 (Line)", "형태"], [
    ["**40**", "대형 안내·빈 화면", "2", "24 원본 확대"],
    ["**32**", "카드 헤더·강조", "2", "24 원본 확대"],
    ["**24**", "**기준 사이즈**. 원본을 이 크기로 그린다", "1.5", "원본"],
    ["**18**", "조밀한 목록·인라인", "1.5", "디테일 축약"],
    ["**14**", "텍스트 옆 인라인", "1", "디테일 축약"],
])
quote("**[확인 필요]** 사이즈별 두께 값은 Figma 가이드의 `두께` 섹션에 24/32/18/14 예시가 "
      "그려져 있으나 수치가 표로 적혀 있지 않다. 위 표는 예시 이미지에서 읽은 추정이므로 "
      "확정이 필요하다.")
w("### 축소 규칙")
w("")
w("- 24 원본을 그대로 축소하지 않는다. **18 이하는 디테일을 덜어낸다** — "
  "내부 요소 3개 → 2개, 작은 배지 제거")
w("- 확대(32 · 40)는 원본 비율 그대로. Figma 에서 Vector 를 `Scale` 로 지정하고 "
  "`Lock aspect ratio` 를 켠 뒤 조정한다")
src(MONO_SRC)
w("### Multicolor 의 하한")
w("")
w("Multicolor 는 레이어가 3단이라 축소에 약하다. **18 이하에서는 Line 으로 대체**하는 것을 "
  "기본으로 한다.")
w("")
hr()

# ================================================================ P10 조합
page("P10")
quote(MONO_OVERLAP)
src(MONO_SRC)
w("### 공통 규칙")
w("")
w("- 두 오브제가 겹칠 때 **겹친 위치와 여백을 세트 전체에서 동일하게** 적용한다")
w("- 겹치는 오브제는 2개까지. 개념이 셋 이상이면 아이콘을 쪼갠다")
w("- 뒤 오브제가 앞 오브제에 가려지는 양도 일정해야 한다")
w("")
w("### Line · Fill — 여백으로 분리")
w("")
w("앞 오브제 둘레에 **배경색 여백**을 두어 뒤 오브제와 분리한다. 이때 배경을 파내는 "
  "Subtract 를 쓰면 배경색이 바뀔 때 구멍이 드러나므로, 겹침은 여백으로만 표현한다.")
w("")
w("### Multicolor — 우하단 배지")
w("")
w("Multicolor 는 겹침 대신 **배지**로 두 개념을 합친다. 위치는 예외 없이 우하단이다. "
  "자세한 규칙은 `P17` 참조.")
w("")
quote(MULTI_NOTE)
src(MONO_SRC + " › 알림")
hr()

# ================================================================ P11 Line
page("P11")
quote(MONO_STROKE)
src(MONO_SRC)
w("### 두께")
w("")
table(["값", "쓰는 곳", "비고"], [
    ["**1.5**", "기본값", "24 기준. 세트 대부분이 이 값"],
    ["1", "가는 변형 · Size 14", "네이밍 `_thin`"],
    ["2", "굵은 변형 · Size 32 이상", "네이밍 `_thick`"],
])
w("- 획의 정렬은 **Center**")
w("- 한 아이콘 안에서 두께를 섞지 않는다")
w("")
w("### 묘사")
w("")
table(["항목", "규칙"], [
    ["선 끝", "둥글게 (round cap)"],
    ["꺾임", "둥글게 (round join)"],
    ["굵기", "아이콘 전체에서 하나의 값"],
    ["정렬", "수치가 아니라 눈으로 봤을 때 기준으로 맞춤"],
    ["디테일 수", "내부 요소 3개 이하"],
])
w("### 배포 형태")
w("")
quote(MONO_HOWTO)
src(MONO_SRC)
w("stroke 상태로 배포하면 SVG 에서 두께가 변형될 수 있다. **outline stroke 로 면으로 "
  "바꾼 뒤** 배포한다. 제작 절차는 `P20` 참조.")
w("")
hr()

# ================================================================ P12 Fill
page("P12")
w("Fill 은 Line 과 **같은 실루엣**을 단색 면으로 채운 스타일이다. 주로 Line 의 선택·활성 "
  "상태로 짝지어 쓴다.")
w("")
w("### 규칙")
w("")
table(["항목", "규칙"], [
    ["실루엣", "짝이 되는 Line 아이콘과 동일. 형태가 달라지면 다른 아이콘으로 읽힌다"],
    ["면 두께", "1.5 이상. Line 의 stroke 두께와 같은 하한"],
    ["구멍", "면 안의 구멍은 `fill-rule` (evenodd) 로 만든다"],
    ["색", "단색"],
    ["디테일 수", "내부 요소 3개 이하"],
])
w("### 도형 편집")
w("")
w("Fill 은 Line 과 달리 **Union / Subtract 등 도형 편집 툴을 활용**해 형태를 만든다. "
  "단 Multicolor 에는 이 방식을 쓰지 않는다 — `P20` 의 3플로우 대조를 볼 것.")
w("")
src(MONO_SRC)
w("### Line 과의 대응")
w("")
w("Line 아이콘 하나에 Fill 하나가 짝이 되는 것이 기본이다. Fill 만 단독으로 존재하는 "
  "아이콘은 만들지 않는다.")
w("")
quote("**[확인 필요]** Fill 단독 아이콘의 허용 여부, 그리고 Line/Fill 짝의 커버리지 "
      "(모든 Line 에 Fill 이 있어야 하는지)는 운영 정책이라 확정이 필요하다.")
hr()

# ================================================================ P13 레이어
page("P13")
w("모든 Multicolor 아이콘은 아래에서 위로 **Base → Accent → Detail** 순서로 쌓는다. "
  "배지가 있으면 그 위에 한 단 더 올린다. 순서를 바꾸면 같은 색이어도 다른 세트처럼 보인다.")
w("")
table(["레이어", "역할", "색"], [
    ["**L1 Base**", "실루엣 전체. 오브젝트가 무엇인지 결정", "Base 또는 Light"],
    ["**L2 Accent**", "구조 구분 — 문서 상단 바, 카드 스트라이프, 폴더 탭, 접힌 모서리",
     "같은 hue 의 Deep / Tint"],
    ["**L3 Detail**", "의미를 전달하는 글리프. 항상 최상단", "white 또는 Tint"],
    ["**L4 Badge**", "상태·부가 의미. 우하단 고정", "주 hue 또는 별도 hue"],
])
w("### 분해 도해 A — `ic_doc_money_flat` (3단)")
w("")
w("3단 누적 · 각 220 × 220 · 간격 40")
w("")
table(["단계", "요소", "색"], [
    ["L1 Base", "문서 실루엣", "`#6DACFF` Light Blue"],
    ["L2 Accent", "상단 헤더 바", "`#1772E9` Deep"],
    ["L3 Detail", "원화 기호", "`white`"],
])
w("### 분해 도해 B — `ic_doc_check_flat` (배지까지 4단)")
w("")
table(["단계", "요소", "색"], [
    ["L1 Base", "모서리를 깎아낸 문서", "`#9271E7` Purple"],
    ["L2 Accent", "텍스트 라인 2줄", "`#E9E1FF` Tint"],
    ["L3 Detail", "체크 2개", "`white`"],
    ["L4 Badge", "접힌 모서리", "`#4119AB` Ink"],
])
hr()

# ================================================================ P14 컬러
page("P14")
w("hue family 7종, 각 family 는 5스텝을 갖는다. 아래 값은 현재 세트에서 실제로 반복 "
  "사용된 hex 를 정규화한 것이다.")
w("")
w("스와치 · 각 140 × 68 · 간격 1 · family 라벨 폭 300")
w("")
rows = []
for name, note, steps in FAMILIES:
    rows.append(["**%s**" % name] +
                ["`%s`<br>%s" % (h, s) for s, h in steps] + [note])
table(["Family", "1", "2", "3", "4", "5", "용도"], rows)
w("### 스텝 정의")
w("")
table(["스텝", "역할"], [
    ["Tint", "컨테이너 내부의 밝은 면. Detail 로도 쓴다"],
    ["Light", "밝은 Base. white Detail 과 함께 쓸 때 대비 확인 필요"],
    ["Base", "실루엣의 기본값"],
    ["Deep", "구조 구분 · Accent"],
    ["Ink", "접힌 모서리 등 가장 어두운 표식"],
])
hr()

# ================================================================ P15 컬러 규칙
page("P15")
w("hue 를 늘려 의미를 만들지 않는다. 색은 오브젝트의 종류를 구분하는 장치이고, "
  "의미의 차이는 형태와 배지로 표현한다.")
w("")
table(["규칙", "내용"], [
    ["**아이콘 1개 = 주 hue 1개 + white**", "Base 와 Deep 은 같은 family 에서 가져온다"],
    ["**두 번째 hue 는 신호에만**",
     "배지, 경고 램프, 상태 점 등 '여기를 보라'는 요소에 한정. "
     "`ic_siren_flat`(grey+coral), `ic_goverment_money_flat`(navy+teal) 이 기준 사례"],
    ["**Tint 를 Base 로 쓰지 않는다**",
     "Base 가 밝으면 위에 얹은 white 디테일이 사라진다. Base 톤과 white 사이 명도 대비를 "
     "3:1 이상 유지"],
    ["**중립 오브젝트는 Navy Grey**",
     "기기·건물·프로세스처럼 색이 의미를 갖지 않는 대상. 컬러 hue 를 낭비하지 않는다"],
])
w("### 현황 — 정리 필요")
w("")
quote("현재 %d종에는 서로 다른 hex 가 **%d개** 쓰이고 있다. 거의 같은 파랑이 "
      "`#4377F1` / `#3B75FF` / `#457CFF` / `#4290FA` 로 흩어져 있다. 신규 아이콘은 정규 "
      "토큰 값만 사용하고, 기존 세트는 별도 작업으로 수렴시킨다." % (len(META), len(hexes)))
w("### 배경 전제")
w("")
w("이 스타일은 밝은 배경을 전제로 한다. Detail 이 white 이므로 다크 UI 에서는 아이콘을 "
  "밝은 plate 위에 올리거나, Tint 스텝을 Detail 로 바꿔 쓴다.")
w("")
hr()

# ================================================================ P16 디테일 토큰
page("P16")
w("반복해서 등장하는 내부 요소는 매번 새로 그리지 않고 아래 형태를 그대로 재사용한다.")
w("")
table(["토큰", "규격", "용도", "예시"], [
    ["**텍스트 라인 pill**", "`h 1.5 / r 0.75`", "문서·카드 안의 글줄 대체. 길이만 바꿔 2–3줄로 배치",
     "`ic_doc_check_flat`"],
    ["**접힌 모서리**", "우하단 삼각", "'문서'임을 알리는 표식. 컨테이너보다 Ink 톤",
     "`ic_doc_check_flat`"],
    ["**원형 컨테이너**", "`cx12 cy12 r10`", "화살표·원화·재생처럼 기호 하나만 담을 때. 안에 white 글리프",
     "`ic_arrow_right_flat` `ic_money_flat`"],
    ["**헤더 바**", "컨테이너 상단", "브라우저·카드·문서의 상단 영역 구분. Deep 톤",
     "`ic_browser_flat`"],
    ["**상태 표식**", "단색", "체크·퍼센트·마이너스·검색. white 또는 Deep 단색으로만",
     "`ic_doc_search_flat`"],
])
w("### 예시 배치")
w("")
w("5종 × 140px · 간격 48 · plate 배경 `#F7F9FC` · 각 하단에 토큰명 캡션 16px")
w("")
hr()

# ================================================================ P17 배지
page("P17")
w("'문서 + 검토', '사람 + 금액'처럼 두 개념을 합칠 때는 새 오브젝트를 만들지 않고 기존 "
  "아이콘에 배지를 붙인다. 위치는 예외 없이 우하단이다.")
w("")
table(["A · 컷아웃", "B · 오버레이"], [
    ["컨테이너 우하단 코너를 깎아내고 그 자리에 배지를 앉힌다",
     "컨테이너 위에 배지를 겹쳐 라이브 영역 밖으로 약간 확장"],
    ["라이브 영역을 넘지 않아 크기가 안정적이다", "최대 `x 22.13` — 캔버스 여백 1.8 유지"],
    ["기준 — `ic_doc_check_flat`", "기준 — `ic_doc_percent_flat` `ic_user_percent_flat`"],
])
w("### 공통 규칙")
w("")
w("- 배지 지름 `8 – 9`")
w("- 배지 hue 는 주 hue 와 달라도 된다 — `ic_goverment_money_flat` (navy + teal)")
w("- 한 아이콘에 배지는 **하나뿐**. 개념이 셋 이상이면 아이콘을 쪼갠다")
w("")
w("### 예시 배치")
w("")
w("5종 × 140px · 간격 48")
w("")
w("`ic_doc_check_flat` (컷아웃) · `ic_doc_percent_flat` (오버레이) · "
  "`ic_user_percent_flat` (오버레이) · `ic_doc_aicheck_flat` (오버레이) · "
  "`ic_goverment_money_flat` (별도 hue)")
w("")
hr()

# ================================================================ P18 이모지
page("P18")
w("이모지 5종은 오브젝트 아이콘과 다른 규칙을 쓴다. 감정만 표현하고, 오브젝트와 "
  "결합하지 않는다.")
w("")
table(["요소", "규격", "색"], [
    ["얼굴", "`circle r 10` (circle 20×20 Key shape)", "`#FFD24A`"],
    ["눈", "`r 1.35` · `(9, 9.6)` / `(15, 9.6)`", "`#402A32`"],
    ["입", "얼굴 하단, 폭 `5 – 6`", "`#ED672E`"],
    ["부가 요소", "하트 · 눈물 등 1개까지", "`#FF474A` · `#73BBFF`"],
])
w("### 네이밍 예외")
w("")
quote("`ic_emoji_{expression}_face` — `_flat` 접미사를 붙이지 않는다.")
w("### 5종")
w("")
w("각 160px · 간격 56 · 하단 캡션에 expression")
w("")
w("`smiling` · `slightly` · `cry` · `sad` · `heart`")
w("")
hr()

# ================================================================ P19 Do/Don't
page("P19")
w("세 스타일 공통 원칙이다. Line 예시로 그려져 있으나 Fill · Multicolor 에도 같이 적용된다.")
w("")
table(["✓ Do", "✕ Don't"], [[a, b] for a, b in DODONT])
src(MONO_SRC + " › Guide")
w("### 스타일별 추가")
w("")
table(["스타일", "✓ Do", "✕ Don't"], [
    ["Line", "선 끝·꺾임을 둥글게", "두께를 섞어 쓰기"],
    ["Fill", "짝이 되는 Line 과 같은 실루엣", "Fill 단독 아이콘 만들기"],
    ["Multicolor", "주 hue 1개 + white", "opacity 로 중간 톤 만들기 · 도형 Subtract"],
])
w("### 정렬에 대하여")
w("")
w("**수치로만 정렬하지 않는다.** 원과 사각형을 같은 좌표에 두면 원이 작아 보인다. "
  "Key shape 4종이 서로 다른 크기인 이유도 같다 — 눈으로 봤을 때 같은 무게가 되도록 맞춘다.")
w("")
hr()

# ================================================================ P20 제작방법
page("P20")
quote(MONO_HOWTO)
src(MONO_SRC)
w("### 3플로우 대조")
w("")
table(["", "Line", "Fill", "Multicolor"], [
    ["1", "24 가이드에 맞춰 제작", "24 가이드에 맞춰 제작", "24 가이드에 맞춰 제작"],
    ["2", "**Outline stroke**<br>`cmd + opt + O`", "**Union / Subtract** 등<br>도형 편집 툴 활용",
     "레이어 3단으로 면 구성<br>**Subtract 금지**"],
    ["3", "**Union** 으로 도형 합침<br>`opt + shift + U`", "**Flatten**<br>`opt + shift + F`",
     "면마다 별도 레이어 유지<br>`[확인 필요]`"],
    ["4", "**Flatten**<br>`opt + shift + F`", "—", "—"],
    ["원본", "백업 후 레이어 hidden", "백업 후 레이어 hidden", "백업 후 레이어 hidden"],
])
w("### 주의 — Subtract 가 갈리는 지점")
w("")
quote(MONO_FLATTEN_WARN)
src(MONO_SRC)
quote("**Multicolor 는 정반대다.** " + MULTI_NOTE)
src(MONO_SRC + " › 알림")
w("Fill 은 Subtract 로 구멍을 파도 되지만, Multicolor 에서 같은 방식을 쓰면 그 구멍으로 "
  "배경색이 비친다. Multicolor 의 '구멍'은 배경을 파는 것이 아니라 **그 자리에 다른 색 면을 "
  "얹어** 표현한다.")
w("")
w("### 현재 위반 1건")
w("")
w("`fill-rule=\"evenodd\"` 로 서브패스를 겹쳐 구멍을 만든 아이콘이 %d종 있고, 그 중 "
  "**`ic_set_flat`** 은 톱니 중앙이 실제로 뚫려 배경색이 그대로 비친다. 흰 배경에서는 "
  "티가 나지 않지만 색 배경 위에 올리면 드러난다." % len(EVENODD))
w("")
table(["아이콘", "evenodd 서브패스", "배경 비침"],
      [["`%s`" % n, "%d" % k, "**있음 — 수정 대상**" if n == "ic_set_flat" else "없음"]
       for n, k in EVENODD])
w("")
quote("나머지 %d종은 evenodd 를 쓰지만 아래에 다른 면이 깔려 있어 배경이 비치지 않는다. "
      "`evenodd` 자체가 금지는 아니고, **비쳐 보이는 구멍**이 금지다." % (len(EVENODD) - 1))
w("### 확대·축소")
w("")
quote("Vector 를 `Scale` 로 지정, 비율은 `Lock aspect ratio` 로 고정해주세요.")
src(MONO_SRC)
hr()

# ================================================================ P21 Export
page("P21")
w("Figma 에서 뽑은 SVG 를 그대로 커밋하지 않는다. 아래 형태로 정리한 뒤 저장한다.")
w("")
w("### Multicolor")
w("")
w("```svg")
w('<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">')
w('  <path d="…" fill="#6DACFF"/>   <!-- L1 Base -->')
w('  <path d="…" fill="#1772E9"/>   <!-- L2 Accent -->')
w('  <path d="…" fill="white"/>     <!-- L3 Detail -->')
w("</svg>")
w("```")
w("")
table(["", "내용"], [
    ["**제거**", "`id` / `class` 잔여물, 빈 `<g>`, 사용하지 않는 `clipPath`, `data-*`"],
    ["**금지**", "`stroke`, `opacity`, `filter`, `style` 속성"],
    ["**조건부 허용**",
     "`mask` 는 도넛·파이 형태에만. Figma 자동 생성 id(`mask0_16817_1404`)는 인라인 시 "
     "충돌하므로 아이콘 id 를 포함한 이름으로 바꾼다"],
    ["**좌표**", "소수점 4자리까지. 그 이상은 잘라낸다"],
    ["**구멍**", "`fill-rule=\"evenodd\"` 로 배경이 비치는 구멍을 만들지 않는다 — "
     "그 자리에 다른 색 면을 얹는다"],
])
w("### 검증")
w("")
w("- `nan` · `Infinity` 등 잘못된 좌표가 없는지 — 유효하지 않은 명령이 있으면 브라우저가 "
  "그 지점에서 렌더링을 멈춘다")
w("- 24px 로 축소해 실제로 보이는지")
w("")
quote("**[확인 필요]** Line · Fill 의 Export 규칙은 Figma 가이드에 없다. outline stroke 후 "
      "면으로 배포한다는 원칙만 있으므로, 나머지 정리 규칙을 Multicolor 와 동일하게 적용할지 "
      "결정이 필요하다.")
hr()

# ================================================================ P22 Naming
page("P22")
quote("Figma 라이브러리 스타일을 작성하고 적재시, 아래의 네이밍 규칙을 적용합니다.")
src(MONO_SRC)
w("### 구조")
w("")
w("```")
w("ic_{object}_{modifier}_{style}")
w("│  │        │          │")
w("│  │        │          └ 스타일  (없음=Line) · thin · thick · fill · flat · face")
w("│  │        └ 결합·상태  money check percent search list minus play down")
w("│  └ 주 오브젝트  doc card user box pc map graph folder truck")
w("└ 고정 접두사")
w("```")
w("")
w("### 스타일별 접미사")
w("")
table(["No.", "형식", "설명", "예"], [
    ["01", "`ic_의미`", "default (Line, stroke 1.5)", "`ic_folder`"],
    ["02", "`ic_의미_thin`", "stroke 1", "`ic_folder_thin`"],
    ["03", "`ic_의미_thick`", "stroke 2", "`ic_folder_thick`"],
    ["04", "`ic_의미_fill`", "면 스타일 (Monochrome)", "`ic_folder_fill`"],
    ["05", "`ic_의미_flat`", "Multicolor", "`ic_doc_money_flat`"],
    ["06", "`ic_emoji_{표정}_face`", "Multicolor 이모지", "`ic_emoji_sad_face`"],
])
w("### 공통 규칙")
w("")
table(["규칙", "내용"], [
    ["표기", "영문 소문자 + snake_case. 한글·대문자·하이픈 금지"],
    ["modifier 순서", "오브젝트 → 결합 대상 → 동작. `ic_doc_money_flat` (문서에 금액이 붙음)"],
    ["파일명", "`{id}.svg` — 확장자 제외하면 id 와 동일"],
    ["일치", "파일명 · 아이콘 id · Figma 컴포넌트명 셋이 같아야 한다"],
])
quote("**충돌 [확인 필요]** — `_fill` 과 `_flat` 이 둘 다 '면'을 뜻해 이름만으로 구분되지 "
      "않는다. `_flat` → `_color` 로 바꾸는 안을 검토할 것.")
w("### 기존 오탈자")
w("")
quote("`ic_goverment_flat`(→ government), `ic_calcu_flat`(→ calculator)는 이미 배포된 "
      "이름이라 유지 중이다. 신규 아이콘은 철자를 정확히 쓴다.")
hr()

# ================================================================ P23 등록
page("P23")
w("### 1. 파일 저장")
w("")
w("```")
w("public/icons/multicolor/ic_doc_money_flat.svg")
w("```")
w("")
w("이 디렉터리는 빌드 시 전수 스캔되므로 파일만 넣어도 목록에는 뜬다. 다만 메타데이터가 "
  "없으면 카테고리가 `미분류` 가 되고 검색이 되지 않는다.")
w("")
w("### 2. 메타데이터 등록")
w("")
w("```ts")
w("// src/data/icons.ts")
w("{")
w('  id: "ic_doc_money_flat",')
w('  category: "문서",              // 6종 중 하나')
w("  tags: {")
w('    ko: ["문서", "정산", "비용", "돈", "원"],       // 3개 이상')
w('    en: ["document", "money", "finance", "invoice"],')
w("  },")
w('  figmaNodeId: "14946:24831",     // 원본 노드')
w("}")
w("```")
w("")
w("### 카테고리 — 6종 고정")
w("")
table(["카테고리", "수", "범위"],
      [["**%s**" % c, len([m for m in META if m["cat"] == c]), CAT_RANGE[c]] for c in CAT_ORDER])
w("새 카테고리를 만들기 전에 기존 6종에 넣을 수 없는지 먼저 확인한다.")
w("")
quote("**[확인 필요]** Line · Fill 은 현재 이 저장소에 없고 Figma 라이브러리에만 있다. "
      "코드로 내려받아 관리할지, Figma 를 단일 출처로 둘지 결정이 필요하다.")
hr()

# ================================================================ P24 QA
page("P24")
w("커밋 전에 전 항목을 통과해야 한다. 하나라도 걸리면 세트 안에서 튄다.")
w("")
w("3열 그리드 · 각 셀 폭 520 · 간격 40 · 체크박스 14 × 14 · 라운드 2")
w("")
w("### 공통")
w("")
for i, (t, d) in enumerate(CHECKS_COMMON, 1):
    w("- [ ] **%02d %s** — %s" % (i, t, d))
w("")
w("### Line 추가")
w("")
for i, (t, d) in enumerate(CHECKS_LINE, 1):
    w("- [ ] **L%d %s** — %s" % (i, t, d))
w("")
w("### Multicolor 추가")
w("")
for i, (t, d) in enumerate(CHECKS_MULTI, 1):
    w("- [ ] **M%d %s** — %s" % (i, t, d))
w("")
hr()

# ================================================================ P25 인벤토리
page("P25")
w("신규 아이콘을 그릴 때는 먼저 여기에 같은 개념이 있는지 확인한다. 비슷한 것이 있으면 "
  "새로 만들지 않고 배지를 붙여 파생시킨다.")
w("")
w("카테고리별 그리드 · 아이콘 64px · 간격 32 · 하단 캡션 12px")
w("")
for cat in CAT_ORDER:
    ids = [m for m in META if m["cat"] == cat]
    w("### %s · %d종" % (cat, len(ids)))
    w("")
    w(" ".join("`%s`" % m["id"].replace("ic_", "").replace("_flat", "") for m in ids))
    w("")
quote("**[확인 필요]** Line · Fill 인벤토리는 Figma 라이브러리에 있어 이 문서에서 세지 "
      "못했다. 종수와 목록을 채워야 한다.")
hr()

# ================================================================ P26 부록 B
page("P26")
w("### 약어 사전")
w("")
w("네이밍의 `{object}` 자리에 쓰는 약어다. 새 오브젝트를 추가할 때 이 표에 함께 등록한다.")
w("")
table(["한글", "약어"] * 2,
      [[ABBR[i][0], "`%s`" % ABBR[i][1],
        ABBR[i + 4][0] if i + 4 < len(ABBR) else "",
        "`%s`" % ABBR[i + 4][1] if i + 4 < len(ABBR) else ""] for i in range(4)])
src(MONO_SRC + " › 알림")
w("### 아이콘 ↔ Figma 노드 대응표 — Multicolor")
w("")
w("페이지 제작 시 아이콘 배치에 사용한다. `src/data/icons.ts` 에서 추출.")
w("")
rows = []
i = 0
for cat in CAT_ORDER:
    for m in [x for x in META if x["cat"] == cat]:
        i += 1
        rows.append([i, "`%s`" % m["id"], m["cat"], "`%s`" % m["nid"], ", ".join(m["ko"][:4])])
table(["#", "아이콘 id", "카테고리", "Figma node", "주요 태그"], rows)
hr()
w("*Douzone Icon Library · 아이콘 제작 가이드 Spec v2 · Line · Fill · Multicolor*")

out = "\n".join(O) + "\n"
open(OUT, "w").write(out)
print("wrote docs/ICON_STYLE_GUIDE.md — %d bytes, %d pages" % (len(out), len(PAGES)))
print("  Multicolor 계측: 코너 %d (완전 %d / 코너 %d) · Key shape 일치 %d/%d · hex %d"
      % (N_ALL, N_FULL, N_CO, sum(keyhit.values()), len(META), len(hexes)))
print("  Section 최소 크기: %d × %d" % (SECT_W, SECT_H))
