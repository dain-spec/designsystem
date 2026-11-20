# -*- coding: utf-8 -*-
import re, os
# 사용법: python3 tools/icongraph/docs/build-icon-guide.py
#   public/icongraph/icons/multicolor/*.svg 와 src/design-system/icongraph/manifest.json 을 읽어
#   docs/ICON_STYLE_GUIDE.html 을 다시 생성한다. 아이콘이 추가되면 이 스크립트를 돌린다.
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SVGDIR = os.path.join(ROOT, "..", "..", "public/icongraph/icons/multicolor")
MANIFEST = os.path.join(ROOT, "..", "..", "src/design-system/icongraph/manifest.json")


def _manifest_icons():
    import json
    return json.load(open(MANIFEST, encoding="utf-8"))["multicolor"]



def load_meta():
    # manifest 의 tags 는 ko + en 순서로 합쳐져 있어, 한글이 든 태그만 ko 로 본다.
    return [{"id": m["id"], "category": m["category"],
             "ko": [t for t in m["tags"] if re.search(r"[가-힣]", t)]}
            for m in _manifest_icons()]


META = load_meta()
CAT = {m["id"]: m["category"] for m in META}
KO = {m["id"]: m["ko"] for m in META}

_cache = {}
_uid = [0]


def raw(icon_id):
    if icon_id not in _cache:
        _cache[icon_id] = open(os.path.join(SVGDIR, icon_id + ".svg")).read()
    return _cache[icon_id]


def elements(icon_id):
    """Top-level drawable elements, in paint order."""
    s = raw(icon_id)
    s = s[s.index(">", s.index("<svg")) + 1:s.rindex("</svg>")]
    return [e.strip() for e in s.strip().split("\n") if e.strip()]


def inner(icon_id, upto=None):
    els = elements(icon_id)
    if upto is not None:
        els = els[:upto]
    out = "".join(els)
    if "mask" in out:  # make Figma mask ids unique per inlined instance
        _uid[0] += 1
        for mid in set(re.findall(r'id="(mask[^"]+)"', out)):
            out = out.replace(mid, "%s_u%d" % (mid, _uid[0]))
    return out


def icon(icon_id, size=48, cls="ic", upto=None):
    return ('<svg class="%s" width="%d" height="%d" viewBox="0 0 24 24" fill="none" '
            'aria-hidden="true">%s</svg>') % (cls, size, size, inner(icon_id, upto))


def plate(icon_id, size=48, label=None, upto=None):
    lab = '<span class="plate-lab">%s</span>' % label if label else ""
    return '<div class="plate">%s%s</div>' % (icon(icon_id, size, upto=upto), lab)


# ---------- grid overlay ----------
def grid_overlay(live, with_circle=True):
    """live = 20 or 18"""
    lines = []
    for i in range(1, 24):
        w = "g-maj" if i % 4 == 0 else "g-min"
        lines.append('<line class="%s" x1="%d" y1="0" x2="%d" y2="24"/>' % (w, i, i))
        lines.append('<line class="%s" x1="0" y1="%d" x2="24" y2="%d"/>' % (w, i, i))
    off = (24 - live) / 2
    box = ('<rect class="g-live" x="%s" y="%s" width="%d" height="%d" rx="3.5"/>'
           % (off, off, live, live))
    circ = ('<circle class="g-live" cx="12" cy="12" r="%s"/>' % (live / 2)) if with_circle else ""
    return ('<svg class="grid-ov" viewBox="0 0 24 24" fill="none" aria-hidden="true">'
            '%s%s%s</svg>') % ("".join(lines), box, circ)


def gridfig(icon_id, live, caption, with_circle=True):
    return ('<figure class="gridfig">'
            '<div class="gridbox">%s%s</div>'
            '<figcaption><b>%d&times;%d</b> %s<span class="mono">%s</span></figcaption>'
            '</figure>') % (grid_overlay(live, with_circle), icon(icon_id, 200, cls="ic gridic"),
                            live, live, caption, icon_id)


# ---------- palette ----------
FAMILIES = [
    ("Blue", "주력 hue. 문서·업무·시스템 전반의 기본값.",
     [("Tint", "#B5D4FF"), ("Light", "#83B3FF"), ("Base", "#4377F1"),
      ("Deep", "#1D4DBE"), ("Ink", "#0234A9")]),
    ("Navy Grey", "중립 오브젝트. 기기·건물·프로세스처럼 색이 의미를 갖지 않을 때.",
     [("Tint", "#D7DDED"), ("Light", "#B3C1D8"), ("Base", "#8F99AD"),
      ("Deep", "#6F7F99"), ("Ink", "#465165")]),
    ("Purple", "AI·자동화·설정 계열.",
     [("Tint", "#E9E1FF"), ("Light", "#B371FF"), ("Base", "#9271E7"),
      ("Deep", "#702CC4"), ("Ink", "#4119AB")]),
    ("Teal", "증빙·인증·신분 계열.",
     [("Tint", "#DEF7F4"), ("Light", "#80E0DD"), ("Base", "#47CECB"),
      ("Deep", "#04AFAF"), ("Ink", "#188381")]),
    ("Green", "완료·승인·수취. 금액 기호에도 사용.",
     [("Tint", "#91F5C8"), ("Light", "#49DBB4"), ("Base", "#2FBD97"),
      ("Deep", "#02B36D"), ("Ink", "#0C9D76")]),
    ("Coral", "경고·마감·위치 핀. 가장 강한 hue이므로 아껴 쓴다. Alt는 하트·강조 전용.",
     [("Tint", "#FFA0BB"), ("Light", "#FF7491"), ("Base", "#FF506D"),
      ("Deep", "#EC648A"), ("Alt", "#FF474A")]),
    ("Amber", "이모지 얼굴과 강조 신호 전용. 스텝 이름이 다른 family와 다르다.",
     [("Face", "#FFD24A"), ("Warm", "#FFC14D"), ("Base", "#FF8235"),
      ("Deep", "#ED672E"), ("Ink", "#402A32")]),
]


def palette():
    rows = []
    for name, note, steps in FAMILIES:
        sw = "".join(
            '<div class="sw"><span class="chip" style="background:%s"></span>'
            '<span class="sw-t">%s</span><span class="mono sw-h">%s</span></div>'
            % (hexv, step, hexv) for step, hexv in steps)
        rows.append('<div class="fam"><div class="fam-h"><h4>%s</h4><p>%s</p></div>'
                    '<div class="fam-s">%s</div></div>' % (name, note, sw))
    return '<div class="pal">%s</div>' % "".join(rows)


CAT_RANGE = [("문서", "서류·전표·계약·보고서"), ("금융", "카드·통장·금액·보험"),
             ("일반", "UI·기기·프로세스·기호"), ("물류", "상자·트럭·공장·재고"),
             ("위치", "지도·핀·장소"), ("이모지", "감정 표현")]


def cat_rows():
    return "".join(
        '<tr><td><b>%s</b></td><td class="mono">%d</td><td>%s</td></tr>'
        % (c, len([m for m in META if m["category"] == c]), r) for c, r in CAT_RANGE)


# ---------- corner radius ----------
LADDER = [
    ("R-050", 0.5,  112, 23.3, "디테일 면 · 작은 구멍 · 최소 라운드"),
    ("R-075", 0.75, 114, 23.8, "작은 면. 변 1.5 pill의 완전 라운드와 같은 값"),
    ("R-100", 1.0,  71, 14.8, "중간 디테일 면"),
    ("R-150", 1.5,  24, 5.0, "소형 면"),
    ("R-220", 2.2,  20, 4.2, "중형 면 · 폴더 탭"),
    ("R-300", 3.0,  24, 5.0, "변 16 컨테이너"),
    ("R-350", 3.5,  83, 17.3, "변 18 컨테이너 — 세트 기본값"),
]

RADIUS_FIX = [
    ("ic_process_flat", "코너 라운드 6종 (0.75 · 1.1 · 1.25 · 1.6 · 3.25 · 4.1)", "3종 이하로 정리"),
    ("ic_receipt_flat", "r 0.26 3곳 &mdash; 0.5 미만", "0.5 로 올림"),
    ("ic_doc_state_flat", "18×18 컨테이너에 3.25 / 3.35", "3.5 로 통일"),
    ("ic_doc_search_flat", "10×10 면에 4.0 &mdash; 계단 밖", "3.0 또는 완전 라운드로"),
    ("ic_card_flat · ic_embedding_flat · ic_idcard_flat", "20×16 면에 3.5 "
     "&mdash; 같은 크기에 다른 아이콘은 3.0", "3.0 으로 수정"),
    ("ic_arrow_left_flat · ic_arrow_right_flat", "11×11 면에 0.75 / 0.8 혼용", "0.75 로 통일"),
    ("ic_shop_bag_flat", "1.35 / 2.25 &mdash; 계단 밖", "1.5 / 2.2"),
    ("ic_truck_flat", "2.0 / 2.5", "2.2 로 통일"),
]


RSW_BOX = 132          # px
RSW_SCALE = RSW_BOX / 24.0   # 24 단위 면을 그대로 확대 → 라운드도 같은 배율


def radius_swatches(scale=RSW_SCALE):
    """24-unit squares drawn at `scale`× so each ladder radius is visible."""
    cells = []
    for tok, val, _n, _p, _role in LADDER:
        cells.append(
            '<div class="rsw"><div class="rsw-box" style="border-radius:%gpx"></div>'
            '<b class="mono">%g</b><span class="mono">%s</span></div>'
            % (val * scale, val, tok))
    return '<div class="rswrap">%s</div>' % "".join(cells)


def radius_ladder_rows():
    return "".join(
        '<tr><td class="mono">%s</td><td class="mono"><b>%s</b></td>'
        '<td class="mono">%d · %.1f%%</td><td>%s</td></tr>'
        % (tok, ("%.2f" % val).rstrip("0").rstrip(".") + (".0" if val == int(val) else ""),
           n, pct, role)
        for tok, val, n, pct, role in LADDER)


def radius_fix_rows():
    return "".join(
        '<tr><td class="mono">%s</td><td>%s</td><td>%s</td></tr>' % f for f in RADIUS_FIX)


# ---------- gallery ----------
def gallery():
    order = ["문서", "금융", "일반", "물류", "위치", "이모지"]
    out = []
    for cat in order:
        ids = [m["id"] for m in META if m["category"] == cat]
        cells = "".join(
            '<li><div class="gcell">%s</div><span class="mono gid">%s</span></li>'
            % (icon(i, 32), i.replace("ic_", "").replace("_flat", "")) for i in ids)
        out.append('<section class="gcat"><h4>%s <span class="cnt">%d</span></h4>'
                   '<ul class="ggrid">%s</ul></section>' % (cat, len(ids), cells))
    return "".join(out)


# ---------- checklist ----------
CHECKS = [
    ("캔버스", "width/height 24, viewBox &ldquo;0 0 24 24&rdquo;, 루트에 fill=&ldquo;none&rdquo;"),
    ("라이브 영역", "20&times;20 또는 18&times;18 키라인 안에 들어오는지 (배지 예외)"),
    ("스트로크", "stroke 속성 0건 &mdash; 선처럼 보이는 요소도 면으로 그렸는지"),
    ("불투명도", "opacity / fill-opacity로 톤을 만들지 않았는지"),
    ("레이어", "Base → Accent → Detail → Badge 순서, 총 3&ndash;4단"),
    ("hue", "주 hue 1개 + white. 두 번째 hue는 배지·신호에만"),
    ("토큰", "모든 색이 팔레트 토큰 값과 정확히 일치 (임의 hex 금지)"),
    ("최소 치수", "라인 두께 ≥ 1.5, 독립 도형 ≥ 2.0"),
    ("라운드", "컨테이너 3.5, 디테일 0.5&ndash;1.5, 원형 10"),
    ("좌표", "주요 형태는 0.5 스냅, 소수점 4자리 이하"),
    ("24px 검증", "실제 24px로 축소해 실루엣과 디테일이 읽히는지"),
    ("네이밍", "ic_{object}_{modifier}_flat, 영문 소문자 snake_case"),
    ("등록", "public/icongraph/icons/multicolor/ 저장 + manifest.json 메타 추가"),
    ("Figma", "figmaNodeId 연결, ko/en 태그 각 3개 이상"),
]


def checklist():
    return '<ol class="chk">%s</ol>' % "".join(
        '<li><span class="chk-box"></span><div><b>%s</b><span>%s</span></div></li>' % (t, d)
        for t, d in CHECKS)


# ---------- allow / deny ----------
ALLOW = ["면(fill)만으로 구성된 다색 구조", "white 하이라이트 및 Tint 톤 디테일",
         "우하단 배지 &mdash; 컷아웃 또는 오버레이", "원형 컨테이너 + white 글리프",
         "도넛·파이 형태에 한한 mask", "fill-rule로 만든 구멍(evenodd)"]
DENY = ["stroke &mdash; 아웃라인 아이콘이 아니다", "그라디언트 / 패턴 / 텍스처",
        "그림자 · 블러 · 글로우", "opacity로 만든 중간 톤", "3D 원근 · 아이소메트릭(3D 세트 규격)",
        "1.5 미만 두께의 얇은 선", "내부 텍스트 · 숫자 렌더링(TAX 등 기존 예외 외 신규 금지)"]

STYLE = """
:root{
  --ground:#F5F7FB; --surface:#FFFFFF; --surface-2:#EBEFF7; --sunk:#E3E8F3;
  --ink:#151A26; --ink-2:#3F4859; --muted:#78808F;
  --line:#DCE2EE; --line-2:#C2CADB;
  --accent:#3B6FE8; --accent-2:#1D4DBE; --accent-soft:#E6EDFF;
  --good:#0C7F62; --bad:#D2384F;
  --plate:#FFFFFF; --plate-line:#E1E6F0;
  --shadow:0 1px 2px rgba(20,28,48,.05), 0 12px 28px -18px rgba(20,28,48,.28);
}
@media (prefers-color-scheme:dark){
  :root:not([data-theme="light"]){
    --ground:#0E1117; --surface:#161A22; --surface-2:#1D222C; --sunk:#11151C;
    --ink:#E8ECF5; --ink-2:#B0B8C8; --muted:#7C8494;
    --line:#242A35; --line-2:#39414F;
    --accent:#7DADFD; --accent-2:#B5D4FF; --accent-soft:#182134;
    --good:#49DBB4; --bad:#FF7491;
    --plate:#F7F9FC; --plate-line:#2A313D;
    --shadow:0 1px 2px rgba(0,0,0,.4), 0 16px 32px -20px rgba(0,0,0,.7);
  }
}
:root[data-theme="dark"]{
  --ground:#0E1117; --surface:#161A22; --surface-2:#1D222C; --sunk:#11151C;
  --ink:#E8ECF5; --ink-2:#B0B8C8; --muted:#7C8494;
  --line:#242A35; --line-2:#39414F;
  --accent:#7DADFD; --accent-2:#B5D4FF; --accent-soft:#182134;
  --good:#49DBB4; --bad:#FF7491;
  --plate:#F7F9FC; --plate-line:#2A313D;
  --shadow:0 1px 2px rgba(0,0,0,.4), 0 16px 32px -20px rgba(0,0,0,.7);
}

*{box-sizing:border-box}
body{
  margin:0; background:var(--ground); color:var(--ink);
  font-family:"IBM Plex Sans KR",-apple-system,"Apple SD Gothic Neo","Malgun Gothic",sans-serif;
  font-size:15px; line-height:1.75; -webkit-font-smoothing:antialiased;
  font-feature-settings:"tnum" 0;
}
.mono{font-family:"IBM Plex Mono",ui-monospace,SFMono-Regular,Menlo,monospace;
  font-variant-numeric:tabular-nums}
h1,h2,h3,h4{font-family:"Gothic A1","IBM Plex Sans KR",-apple-system,sans-serif;
  font-weight:800; letter-spacing:-.02em; text-wrap:balance; margin:0}
p{margin:0}
a{color:var(--accent)}
:focus-visible{outline:2px solid var(--accent); outline-offset:3px; border-radius:3px}

/* ---------- shell ---------- */
.wrap{max-width:1160px; margin:0 auto; padding:0 28px}
.layout{display:grid; grid-template-columns:196px minmax(0,1fr); gap:56px; align-items:start}

/* ---------- masthead ---------- */
.mast{border-bottom:1px solid var(--line); background:var(--surface)}
.mast-in{padding:52px 0 40px; display:grid; gap:26px}
.eyebrow{font-family:"IBM Plex Mono",monospace; font-size:11px; letter-spacing:.16em;
  text-transform:uppercase; color:var(--muted); display:flex; gap:10px; flex-wrap:wrap;
  align-items:center}
.eyebrow i{width:14px; height:1px; background:var(--line-2); display:inline-block}
h1{font-size:clamp(30px,4.4vw,50px); line-height:1.12}
.lead{font-size:17px; color:var(--ink-2); max-width:60ch; line-height:1.7}
.facts{display:flex; flex-wrap:wrap; gap:0; border:1px solid var(--line); border-radius:2px;
  overflow:hidden; width:fit-content; max-width:100%}
.facts div{padding:12px 20px; border-right:1px solid var(--line); min-width:96px}
.facts div:last-child{border-right:0}
.facts dt{font-family:"IBM Plex Mono",monospace; font-size:10.5px; letter-spacing:.1em;
  text-transform:uppercase; color:var(--muted); margin:0}
.facts dd{margin:2px 0 0; font-size:19px; font-weight:700; font-family:"Gothic A1",sans-serif;
  font-variant-numeric:tabular-nums}
.strip{display:flex; flex-wrap:wrap; gap:8px}
.strip .plate{width:56px; height:56px}

/* ---------- index rail ---------- */
.rail{position:sticky; top:0; padding:44px 0; font-size:13px}
.rail-h{font-family:"IBM Plex Mono",monospace; font-size:10.5px; letter-spacing:.14em;
  text-transform:uppercase; color:var(--muted); padding-bottom:10px;
  border-bottom:1px solid var(--line); margin-bottom:6px}
.rail a{display:flex; gap:10px; padding:5px 0; color:var(--ink-2); text-decoration:none;
  border-bottom:1px solid transparent}
.rail a:hover{color:var(--accent)}
.rail a b{font-family:"IBM Plex Mono",monospace; font-weight:400; color:var(--muted);
  font-size:11px; padding-top:1px; font-variant-numeric:tabular-nums}

/* ---------- sections ---------- */
main{padding:44px 0 96px; display:grid; gap:64px}
section.spec{scroll-margin-top:24px; display:grid; gap:20px}
.sec-h{display:grid; gap:8px; padding-bottom:4px}
.sec-n{font-family:"IBM Plex Mono",monospace; font-size:11px; letter-spacing:.16em;
  color:var(--accent); text-transform:uppercase}
h2{font-size:clamp(21px,2.6vw,27px)}
.sec-h p{color:var(--ink-2); max-width:64ch}
h3{font-size:15px; font-weight:700; letter-spacing:0}
.note{font-size:13.5px; color:var(--muted); max-width:64ch}
.body p{max-width:64ch; color:var(--ink-2)}
.body{display:grid; gap:16px}

/* card surfaces */
.card{background:var(--surface); border:1px solid var(--line); border-radius:3px;
  padding:22px; display:grid; gap:16px}
.card.tight{padding:16px}

/* ---------- icon plates ---------- */
.plate{background:var(--plate); border:1px solid var(--plate-line); border-radius:3px;
  display:grid; place-items:center; padding:14px; position:relative}
.plate-lab{font-family:"IBM Plex Mono",monospace; font-size:10px; color:#6A7286;
  letter-spacing:.05em; margin-top:8px}
.row{display:flex; flex-wrap:wrap; gap:12px}
.row .plate{min-width:112px}

/* grid figures */
.gridrow{display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:20px}
.gridfig{margin:0; display:grid; gap:10px}
.gridbox{position:relative; background:var(--plate); border:1px solid var(--plate-line);
  border-radius:3px; aspect-ratio:1; display:grid; place-items:center}
.gridbox .grid-ov,.gridbox .gridic{position:absolute; inset:8.33%; width:83.34%; height:83.34%}
.grid-ov{z-index:2}
.g-min{stroke:#C9D2E4; stroke-width:.03}
.g-maj{stroke:#9FAAC2; stroke-width:.055}
.g-live{stroke:#D2384F; stroke-width:.09; stroke-dasharray:.5 .35; fill:none}
.gridfig figcaption{font-size:12.5px; color:var(--muted); display:flex; gap:8px;
  flex-wrap:wrap; align-items:baseline}
.gridfig figcaption b{color:var(--ink); font-family:"IBM Plex Mono",monospace; font-weight:500}
.gridfig .mono{font-size:11px; margin-left:auto; color:var(--line-2)}

/* ---------- layer explode ---------- */
.expl{display:grid; grid-template-columns:repeat(auto-fit,minmax(128px,1fr)); gap:14px}
.step{display:grid; gap:10px}
.step .plate{aspect-ratio:1}
.step-m{display:grid; gap:2px; font-size:12.5px}
.step-m b{font-family:"IBM Plex Mono",monospace; font-size:10.5px; letter-spacing:.1em;
  text-transform:uppercase; color:var(--accent)}
.step-m span{color:var(--muted); font-size:12px; line-height:1.5}

/* ---------- tables ---------- */
.tbl-scroll{overflow-x:auto; border:1px solid var(--line); border-radius:3px;
  background:var(--surface)}
table{border-collapse:collapse; width:100%; font-size:13.5px; min-width:460px}
th,td{text-align:left; padding:11px 16px; border-bottom:1px solid var(--line);
  vertical-align:top}
th{font-family:"IBM Plex Mono",monospace; font-size:10.5px; letter-spacing:.12em;
  text-transform:uppercase; color:var(--muted); font-weight:500;
  background:var(--surface-2)}
tr:last-child td{border-bottom:0}
td.mono{font-variant-numeric:tabular-nums; color:var(--ink)}
td b{font-weight:600}

/* ---------- allow / deny ---------- */
.duo{display:grid; grid-template-columns:repeat(auto-fit,minmax(250px,1fr)); gap:16px}
.duo section{background:var(--surface); border:1px solid var(--line); border-radius:3px;
  padding:18px 20px; display:grid; gap:12px}
.duo h3{display:flex; gap:9px; align-items:center; font-size:13px;
  font-family:"IBM Plex Mono",monospace; letter-spacing:.12em; text-transform:uppercase;
  font-weight:500}
.duo .yes h3{color:var(--good)} .duo .no h3{color:var(--bad)}
.duo h3 s{width:16px; height:16px; border-radius:50%; display:grid; place-items:center;
  font-size:11px; text-decoration:none; color:#fff; flex:none}
.yes h3 s{background:var(--good)} .no h3 s{background:var(--bad)}
.duo ul{margin:0; padding:0; list-style:none; display:grid; gap:7px; font-size:13.5px;
  color:var(--ink-2)}
.duo li{padding-left:15px; position:relative; line-height:1.55}
.duo li::before{content:""; position:absolute; left:0; top:.62em; width:5px; height:1.5px;
  background:var(--line-2)}

/* ---------- palette ---------- */
.pal{display:grid; gap:1px; background:var(--line); border:1px solid var(--line);
  border-radius:3px; overflow:hidden}
.fam{display:grid; grid-template-columns:minmax(180px,1fr) minmax(0,2.1fr); gap:1px;
  background:var(--line)}
.fam-h{background:var(--surface); padding:16px 18px; display:grid; gap:3px;
  align-content:center}
.fam-h h4{font-size:14px}
.fam-h p{font-size:12.5px; color:var(--muted); line-height:1.55}
.fam-s{background:var(--surface); display:grid;
  grid-template-columns:repeat(auto-fit,minmax(88px,1fr)); gap:1px}
.sw{padding:12px 12px 11px; display:grid; gap:6px; border-left:1px solid var(--line)}
.sw:first-child{border-left:0}
.chip{height:34px; border-radius:2px; box-shadow:inset 0 0 0 1px rgba(0,0,0,.07)}
.sw-t{font-size:11px; font-weight:600; color:var(--ink-2)}
.sw-h{font-size:10.5px; color:var(--muted); text-transform:uppercase}

/* ---------- radius swatches ---------- */
.rswrap{display:flex; flex-wrap:wrap; gap:14px}
.rsw{display:grid; gap:6px; justify-items:center; width:132px}
.rsw-box{width:132px; height:132px; background:var(--accent-soft);
  box-shadow:inset 0 0 0 1.5px var(--accent)}
.rsw b{font-size:14px; font-weight:500; color:var(--ink)}
.rsw span{font-size:10px; color:var(--muted); letter-spacing:.04em}

/* ---------- code ---------- */
pre{margin:0; background:var(--sunk); border:1px solid var(--line); border-radius:3px;
  padding:16px 18px; overflow-x:auto; font-family:"IBM Plex Mono",monospace;
  font-size:12.5px; line-height:1.7; color:var(--ink-2)}
pre b{color:var(--ink); font-weight:500}
pre i{color:var(--muted); font-style:normal}
code{font-family:"IBM Plex Mono",monospace; font-size:.9em; background:var(--accent-soft);
  color:var(--accent-2); padding:1px 5px; border-radius:2px}

/* ---------- checklist ---------- */
.chk{margin:0; padding:0; list-style:none; display:grid;
  grid-template-columns:repeat(auto-fit,minmax(268px,1fr)); gap:1px;
  background:var(--line); border:1px solid var(--line); border-radius:3px;
  overflow:hidden; counter-reset:c}
.chk li{background:var(--surface); padding:13px 16px; display:flex; gap:11px}
.chk-box{width:14px; height:14px; border:1.5px solid var(--line-2); border-radius:2px;
  flex:none; margin-top:5px}
.chk li div{display:grid; gap:1px}
.chk b{font-size:13px; font-weight:600}
.chk span{font-size:12.5px; color:var(--muted); line-height:1.5}

/* ---------- gallery ---------- */
.gcat{display:grid; gap:12px; margin-bottom:26px}
.gcat h4{font-size:13px; display:flex; gap:8px; align-items:center;
  padding-bottom:8px; border-bottom:1px solid var(--line)}
.gcat .cnt{font-family:"IBM Plex Mono",monospace; font-size:11px; font-weight:400;
  color:var(--muted)}
.ggrid{margin:0; padding:0; list-style:none; display:grid;
  grid-template-columns:repeat(auto-fill,minmax(76px,1fr)); gap:10px}
.ggrid li{display:grid; gap:5px; justify-items:center; text-align:center; min-width:0}
.gcell{background:var(--plate); border:1px solid var(--plate-line); border-radius:3px;
  width:100%; aspect-ratio:1; display:grid; place-items:center}
.gid{font-size:9.5px; color:var(--muted); line-height:1.3; overflow-wrap:anywhere;
  max-width:100%}

/* ---------- misc ---------- */
.callout{border-left:2px solid var(--accent); background:var(--accent-soft);
  padding:14px 18px; border-radius:0 3px 3px 0; font-size:13.5px; color:var(--ink-2);
  display:grid; gap:5px}
.callout b{color:var(--ink); font-size:12.5px; font-family:"IBM Plex Mono",monospace;
  letter-spacing:.1em; text-transform:uppercase; font-weight:500}
.warn{border-left-color:var(--bad); background:color-mix(in srgb,var(--bad) 8%,transparent)}
.warn b{color:var(--bad)}
footer{border-top:1px solid var(--line); background:var(--surface); padding:30px 0;
  font-size:12.5px; color:var(--muted)}
footer .wrap{display:flex; gap:16px; flex-wrap:wrap; justify-content:space-between}

@media (max-width:900px){
  .layout{grid-template-columns:1fr; gap:0}
  .rail{position:static; padding:28px 0 0; border-bottom:1px solid var(--line)}
  .rail a{display:inline-flex; margin-right:14px}
  .rail-h{border-bottom:0; margin-bottom:0}
  .fam{grid-template-columns:1fr}
  .wrap{padding:0 20px}
}
@media (prefers-reduced-motion:reduce){*{animation:none!important; transition:none!important}}
"""

SECTIONS = [
    ("01", "스타일 정의", "style"),
    ("02", "캔버스와 라이브 영역", "canvas"),
    ("03", "형태와 두께", "form"),
    ("03-1", "Corner radius", "radius"),
    ("04", "레이어 3단 구조", "layers"),
    ("05", "컬러 시스템", "color"),
    ("06", "디테일 토큰", "detail"),
    ("07", "배지와 조합", "badge"),
    ("08", "이모지 서브셋", "emoji"),
    ("09", "네이밍과 카테고리", "naming"),
    ("10", "Export와 등록", "export"),
    ("11", "QA 체크리스트", "qa"),
    ("12", "현재 세트 57종", "set"),
]


def sec(num, title, sid, lead, body):
    return ('<section class="spec" id="%s"><div class="sec-h">'
            '<span class="sec-n">Plate %s</span><h2>%s</h2><p>%s</p></div>'
            '<div class="body">%s</div></section>') % (sid, num, title, lead, body)


def step(icon_id, upto, label, desc, size=96):
    return ('<div class="step"><div class="plate">%s</div>'
            '<div class="step-m"><b>%s</b><span>%s</span></div></div>'
            % (icon(icon_id, size, upto=upto), label, desc))


HEAD_STRIP = ["ic_doc_money_flat", "ic_card_flat", "ic_emoji_smiling_face",
              "ic_doc_check_flat", "ic_truck_flat", "ic_idcard_flat",
              "ic_goverment_flat", "ic_folder_flat", "ic_map_pin_flat",
              "ic_siren_flat", "ic_graph_flat", "ic_arrow_right_flat",
              "ic_shop_bag_flat", "ic_calcu_flat", "ic_browser_flat",
              "ic_doc_percent_flat", "ic_factory_flat", "ic_money_flat"]

html = []
A = html.append

A('<title>Flat Multicolor 아이콘 규격</title>')
A('<link rel="preconnect" href="https://fonts.googleapis.com">')
A('<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>')
A('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?'
  'family=Gothic+A1:wght@700;800&family=IBM+Plex+Sans+KR:wght@400;500;600&'
  'family=IBM+Plex+Mono:wght@400;500&display=swap">')
A('<style>' + STYLE + '</style>')

# ---- masthead ----
A('<header class="mast"><div class="wrap"><div class="mast-in">')
A('<div class="eyebrow">Douzone Icon Library<i></i>Multicolor<i></i>Spec v1<i></i>'
  '2026.09</div>')
A('<h1>Flat Multicolor 아이콘 규격</h1>')
A('<p class="lead">24×24 캔버스, 스트로크 없는 면 구성, Base·Accent·Detail 3단 레이어. '
  '기존 57종을 전수 계측해 정리한 규칙이며, 신규 아이콘은 이 문서만 보고 그려도 같은 결이 나오는 것을 '
  '목표로 한다.</p>')
A('<dl class="facts">'
  '<div><dt>Canvas</dt><dd>24×24</dd></div>'
  '<div><dt>Stroke</dt><dd>0</dd></div>'
  '<div><dt>Layers</dt><dd>3</dd></div>'
  '<div><dt>Radius</dt><dd>3.5</dd></div>'
  '<div><dt>현재 세트</dt><dd>57</dd></div>'
  '</dl>')
A('<div class="strip">%s</div>' % "".join(
    '<div class="plate">%s</div>' % icon(i, 28) for i in HEAD_STRIP))
A('</div></div></header>')

# ---- layout ----
A('<div class="wrap"><div class="layout">')
A('<nav class="rail"><div class="rail-h">Index</div>')
for n, t, sid in SECTIONS:
    A('<a href="#%s"><b>%s</b>%s</a>' % (sid, n, t))
A('</nav><main>')

# 01 style
A(sec("01", "스타일 정의", "style",
      "면(fill)만으로 형태를 만드는 다색 플랫 스타일이다. 선으로 그린 아이콘도, 입체감을 준 아이콘도 아니다. "
      "<code>public/icons/3d</code>의 3D 세트와는 완전히 다른 규격이므로 섞지 않는다.",
      '<div class="duo">'
      '<section class="yes"><h3><s>✓</s>허용</h3><ul>%s</ul></section>'
      '<section class="no"><h3><s>✕</s>금지</h3><ul>%s</ul></section>'
      '</div>'
      '<div class="callout"><b>계측 근거</b><span>현재 57종 전수에서 '
      '<span class="mono">stroke</span> 0건, 그라디언트 0건, <span class="mono">opacity</span> 0건. '
      '<span class="mono">mask</span>는 도넛 그래프 1종(<span class="mono">ic_graph_flat</span>)에만 '
      '쓰였다.</span></div>'
      % ("".join("<li>%s</li>" % x for x in ALLOW),
         "".join("<li>%s</li>" % x for x in DENY))))

# 02 canvas
A(sec("02", "캔버스와 라이브 영역", "canvas",
      "캔버스는 24×24로 고정하고, 형태는 두 개의 키라인 중 하나에 맞춘다. 두 키라인이 세트 전체의 "
      "시각적 크기를 맞추는 유일한 장치이므로 임의로 키우거나 줄이지 않는다.",
      '<div class="gridrow">%s%s</div>'
      '<div class="tbl-scroll"><table><thead><tr>'
      '<th>키라인</th><th>좌표</th><th>쓰는 형태</th><th>세트 내 사용</th></tr></thead><tbody>'
      '<tr><td><b>20×20</b></td><td class="mono">2 → 22</td>'
      '<td>원형·와이드·유기적 실루엣. 이모지, 카드, 브라우저, 폴더, 원형 컨테이너</td>'
      '<td class="mono">23종</td></tr>'
      '<tr><td><b>18×18</b></td><td class="mono">3 → 21</td>'
      '<td>사각 컨테이너. 문서 계열, 계산기, 사이렌, 상자</td>'
      '<td class="mono">23종</td></tr>'
      '<tr><td>자유 실루엣</td><td class="mono">1 → 23</td>'
      '<td>핀·카트처럼 한쪽으로 뻗는 형태. 시각 무게를 위 두 값에 맞춘다</td>'
      '<td class="mono">11종</td></tr>'
      '</tbody></table></div>'
      '<p>배지가 붙을 때만 라이브 영역을 넘길 수 있다. 실제 세트의 최대 확장은 '
      '<span class="mono">x 22.13</span> &mdash; 즉 캔버스 경계에서 최소 '
      '<span class="mono">1.8</span>의 여백은 항상 남긴다.</p>'
      % (gridfig("ic_emoji_smiling_face", 20, "원형·사각 키라인 쌍"),
         gridfig("ic_doc_money_flat", 18, "사각 키라인", with_circle=False))))

# 03 form
A(sec("03", "형태와 두께", "form",
      "형태의 인상을 결정하는 세 수치 &mdash; 두께, 요소 개수, 좌표 스냅. "
      "라운드는 분량이 많아 다음 장에서 따로 다룬다.",
      '<h3>두께와 개수의 하한</h3>'
      '<p>24px에서 사라지는 요소는 그리지 않는다. 라인 두께는 <b>1.5 이상</b>, 독립적으로 읽혀야 하는 '
      '도형은 <b>2.0 이상</b>. 컨테이너 내부 의미 요소는 <b>3개 이하</b>로 줄인다.</p>'
      '<h3>좌표 스냅</h3>'
      '<p>실루엣을 만드는 주요 좌표는 0.5 단위에 맞춘다 &mdash; 실제 세트에서 반복되는 값은 '
      '<span class="mono">2 · 3 · 6.5 · 7.5 · 17.5 · 21 · 22</span>다. 베지어 제어점은 예외.</p>'
      '<div class="row">%s</div>'
      % "".join(plate(i, 64, i.replace("ic_", "").replace("_flat", "")) for i in
                ["ic_box_flat", "ic_doc_list_flat", "ic_folder_flat", "ic_insurance_flat",
                 "ic_pin_flat", "ic_receipt_flat"])))

# 03-1 corner radius
A(sec("03-1", "Corner radius", "radius",
      "세트 전체에서 라운드 코너 875개를 추출해 정리했다. 새 아이콘은 아래 계단 위에서만 값을 고른다.",
      '<div class="tbl-scroll"><table><thead><tr>'
      '<th>종류</th><th>정의</th><th>수</th><th>성격</th></tr></thead><tbody>'
      '<tr><td><b>완전 라운드</b></td><td class="mono">r = 변 / 2</td>'
      '<td class="mono">395개 (45%)</td>'
      '<td>값을 고르는 것이 아니라 형태 자체. pill · dot · 원</td></tr>'
      '<tr><td><b>코너 라운드</b></td><td class="mono">r &lt; 변 / 2</td>'
      '<td class="mono">480개 (55%)</td><td>실제로 값을 선택하는 대상</td></tr>'
      '</tbody></table></div>'
      '<p class="note">두 값이 같은 표에 섞이면 규칙이 보이지 않는다. 예를 들어 '
      '<span class="mono">r 0.75</span>는 변 1.5 pill의 완전 라운드이면서 동시에 '
      '변 5 면의 코너 라운드로도 쓰인다.</p>'
      '<h3>코너 라운드 계단 &mdash; 7단</h3>'
      + radius_swatches() +
      '<p class="note">24 단위 면을 132px(5.5배)로 확대한 것이다 &mdash; 라운드에도 같은 배율을 적용했으므로 실제 아이콘에서 각 값이 차지하는 비율 그대로다. 0.5 미만이 왜 금지인지 여기서 보인다.</p>'
      '<div class="tbl-scroll"><table><thead><tr>'
      '<th>토큰</th><th>값</th><th>세트 내 사용</th><th>역할</th>'
      '</tr></thead><tbody>' + radius_ladder_rows() + '</tbody></table></div>'
      '<p>전체 코너 라운드의 <b>93%</b>(448/480)가 이 7단에 &plusmn;0.12 이내로 들어온다. 나머지 32개가 아래 정리 대상이다.</p>'
      '<h3>컨테이너 라운드 &mdash; 변 × 0.19</h3>'
      '<div class="tbl-scroll"><table><thead><tr>'
      '<th>면 최소변</th><th>변 × 0.19</th><th>0.5 단위</th><th>세트 실사용</th><th>n</th>'
      '</tr></thead><tbody>'
      '<tr><td class="mono"><b>18</b></td><td class="mono">3.42</td><td class="mono">3.5</td>'
      '<td class="mono">3.5 ✓</td><td class="mono">68</td></tr>'
      '<tr><td class="mono"><b>16</b></td><td class="mono">3.04</td><td class="mono">3.0</td>'
      '<td class="mono">3.0 ✓</td><td class="mono">51</td></tr>'
      '<tr><td class="mono">15</td><td class="mono">2.85</td><td class="mono">3.0</td>'
      '<td class="mono">2.2 △</td><td class="mono">8</td></tr>'
      '<tr><td class="mono">14</td><td class="mono">2.66</td><td class="mono">2.5</td>'
      '<td class="mono">2.2 △</td><td class="mono">17</td></tr>'
      '</tbody></table></div>'
      '<p class="note">△ 는 사각 컨테이너가 아닌 오브젝트(폴더·트럭·사이렌·쇼핑백). '
      '검증된 앵커는 변 18 → 3.5, 변 16 → 3.0 두 개다 (합계 n=119).</p>'
      '<h3>완전 라운드 표준 변</h3>'
      '<div class="tbl-scroll"><table><thead><tr>'
      '<th>변</th><th>r</th><th>세트 내 사용</th><th>용도</th></tr></thead><tbody>'
      '<tr><td class="mono">1.5</td><td class="mono">0.75</td><td class="mono">84개</td>'
      '<td>텍스트 라인 pill &mdash; 표준</td></tr>'
      '<tr><td class="mono">2.0</td><td class="mono">1.0</td><td class="mono">116개</td>'
      '<td>점 · 작은 마커</td></tr>'
      '<tr><td class="mono">2.7</td><td class="mono">1.35</td><td class="mono">24개</td>'
      '<td>이모지 눈</td></tr>'
      '<tr><td class="mono">10</td><td class="mono">5.0</td><td class="mono">41개</td>'
      '<td>배지 · 원형 요소</td></tr>'
      '<tr><td class="mono">20</td><td class="mono">10</td><td class="mono">24개</td>'
      '<td>원형 컨테이너</td></tr>'
      '</tbody></table></div>'
      '<h3>제약</h3>'
      '<div class="duo"><section class="no"><h3><s>✕</s>금지</h3><ul>'
      '<li><span class="mono">r &gt; 변/2</span> &mdash; 넘기면 완전 라운드로 표기한다</li>'
      '<li><span class="mono">r &lt; 0.5</span> &mdash; 24px에서 각진 코너와 구분되지 않는다</li>'
      '<li>한 아이콘 안의 코너 라운드 3종 초과</li>'
      '<li>같은 크기 면에 서로 다른 라운드</li>'
      '</ul></section></div>'
      '<h3>정리 대상</h3>'
      '<div class="tbl-scroll"><table><thead><tr>'
      '<th>아이콘</th><th>문제</th><th>조치</th></tr></thead><tbody>'
      + radius_fix_rows() + '</tbody></table></div>'))

# 04 layers
A(sec("04", "레이어 3단 구조", "layers",
      "모든 아이콘은 아래에서 위로 Base → Accent → Detail 순서로 쌓는다. 배지가 있으면 그 위에 한 단 "
      "더 올린다. 순서를 바꾸면 같은 색이어도 다른 세트처럼 보인다.",
      '<h3>ic_doc_money_flat &mdash; 3단</h3>'
      '<div class="expl">%s</div>'
      '<h3>ic_doc_check_flat &mdash; 배지까지 4단</h3>'
      '<div class="expl">%s</div>'
      '<div class="tbl-scroll"><table><thead><tr>'
      '<th>레이어</th><th>역할</th><th>색</th></tr></thead><tbody>'
      '<tr><td><b>L1 Base</b></td><td>실루엣 전체. 오브젝트가 무엇인지 결정</td>'
      '<td class="mono">Base 또는 Light</td></tr>'
      '<tr><td><b>L2 Accent</b></td><td>구조 구분 &mdash; 문서 상단 바, 카드 스트라이프, 폴더 탭, 접힌 모서리</td>'
      '<td class="mono">같은 hue의 Deep / Tint</td></tr>'
      '<tr><td><b>L3 Detail</b></td><td>의미를 전달하는 글리프. 항상 최상단</td>'
      '<td class="mono">white 또는 Tint</td></tr>'
      '<tr><td><b>L4 Badge</b></td><td>상태·부가 의미. 우하단 고정</td>'
      '<td class="mono">주 hue 또는 별도 hue</td></tr>'
      '</tbody></table></div>'
      % ("".join([
          step("ic_doc_money_flat", 1, "L1 Base", "문서 실루엣 · Light Blue #6DACFF"),
          step("ic_doc_money_flat", 2, "L2 Accent", "상단 헤더 바 · Deep #1772E9"),
          step("ic_doc_money_flat", 3, "L3 Detail", "원화 기호 · white"),
      ]),
         "".join([
             step("ic_doc_check_flat", 1, "L1 Base", "모서리를 깎아낸 문서 · Purple #9271E7", 84),
             step("ic_doc_check_flat", 3, "L2 Accent", "텍스트 라인 · Tint #E9E1FF", 84),
             step("ic_doc_check_flat", 5, "L3 Detail", "체크 2개 · white", 84),
             step("ic_doc_check_flat", 6, "L4 Badge", "접힌 모서리 · Ink #4119AB", 84),
         ]))))

# 05 color
A(sec("05", "컬러 시스템", "color",
      "hue family 7종, 각 family는 Tint·Light·Base·Deep·Ink 5스텝을 갖는다. 아래 값은 현재 세트에서 "
      "실제로 반복 사용된 hex를 정규화한 것이다.",
      palette() +
      '<h3>사용 규칙</h3>'
      '<div class="tbl-scroll"><table><tbody>'
      '<tr><td style="width:34%"><b>아이콘 1개 = 주 hue 1개 + white</b></td>'
      '<td>Base와 Deep은 같은 family에서 가져온다. 색으로 hue를 바꿔 의미를 만들지 않는다.</td></tr>'
      '<tr><td><b>두 번째 hue는 신호에만</b></td>'
      '<td>배지, 경고 램프, 상태 점 등 &ldquo;여기를 보라&rdquo;는 요소에 한정. '
      '<span class="mono">ic_siren_flat</span>(grey+coral), '
      '<span class="mono">ic_goverment_money_flat</span>(navy+teal)이 기준 사례.</td></tr>'
      '<tr><td><b>Tint를 Base로 쓰지 않는다</b></td>'
      '<td>Base가 밝으면 위에 얹은 white 디테일이 사라진다. Base 톤과 white 사이 명도 대비를 '
      '3:1 이상 유지.</td></tr>'
      '<tr><td><b>중립 오브젝트는 Navy Grey</b></td>'
      '<td>기기·건물·프로세스처럼 색이 의미를 갖지 않는 대상. 컬러 hue를 낭비하지 않는다.</td></tr>'
      '</tbody></table></div>'
      '<div class="callout warn"><b>정리 필요</b><span>현재 57종에는 서로 다른 hex가 '
      '<b>99개</b> 쓰이고 있다 &mdash; 예를 들어 거의 같은 파랑이 '
      '<span class="mono">#4377F1 / #3B75FF / #457CFF / #4290FA</span>로 흩어져 있다. '
      '신규 아이콘은 위 토큰 값만 사용하고, 기존 세트는 별도 작업으로 수렴시킨다.</span></div>'
      '<h3>배경 전제</h3>'
      '<p>이 스타일은 밝은 배경을 전제로 한다. Detail이 white이므로 다크 UI에서는 아이콘을 '
      '밝은 plate 위에 올리거나, Tint 스텝을 Detail로 바꿔 쓴다.</p>'))

# 06 detail
A(sec("06", "디테일 토큰", "detail",
      "반복해서 등장하는 내부 요소는 매번 새로 그리지 않고 아래 형태를 그대로 재사용한다.",
      '<div class="row">%s</div>'
      '<div class="tbl-scroll"><table><thead><tr>'
      '<th>토큰</th><th>규격</th><th>용도</th></tr></thead><tbody>'
      '<tr><td><b>텍스트 라인 pill</b></td>'
      '<td class="mono">h 1.5 / r 0.75</td>'
      '<td>문서·카드 안의 글줄 대체. 길이만 바꿔 2&ndash;3줄로 배치</td></tr>'
      '<tr><td><b>접힌 모서리</b></td>'
      '<td class="mono">우하단 삼각</td>'
      '<td>&ldquo;문서&rdquo;임을 알리는 표식. 컨테이너보다 Ink 톤</td></tr>'
      '<tr><td><b>원형 컨테이너</b></td>'
      '<td class="mono">cx12 cy12 r10</td>'
      '<td>화살표·원화·재생처럼 기호 하나만 담을 때. 안에 white 글리프</td></tr>'
      '<tr><td><b>헤더 바</b></td>'
      '<td class="mono">컨테이너 상단</td>'
      '<td>브라우저·카드·문서의 상단 영역 구분. Deep 톤</td></tr>'
      '<tr><td><b>상태 표식</b></td>'
      '<td class="mono">단색</td>'
      '<td>체크·퍼센트·마이너스·검색. white 또는 Deep 단색으로만</td></tr>'
      '</tbody></table></div>'
      % "".join(plate(i, 72, l) for i, l in [
          ("ic_doc_check_flat", "pill + 접힌 모서리"),
          ("ic_arrow_right_flat", "원형 컨테이너"),
          ("ic_money_flat", "원형 컨테이너"),
          ("ic_browser_flat", "헤더 바"),
          ("ic_doc_search_flat", "상태 표식"),
      ])))

# 07 badge
A(sec("07", "배지와 조합", "badge",
      "&ldquo;문서 + 검토&rdquo;, &ldquo;사람 + 금액&rdquo;처럼 두 개념을 합칠 때는 새 오브젝트를 만들지 않고 "
      "기존 아이콘에 배지를 붙인다. 위치는 예외 없이 우하단이다.",
      '<div class="row">%s</div>'
      '<div class="duo">'
      '<section class="yes"><h3><s>A</s>컷아웃</h3><ul>'
      '<li>컨테이너 우하단 코너를 깎아내고 그 자리에 배지를 앉힌다</li>'
      '<li>라이브 영역을 넘지 않아 크기가 안정적이다</li>'
      '<li>기준: <span class="mono">ic_doc_check_flat</span></li>'
      '</ul></section>'
      '<section class="yes"><h3><s>B</s>오버레이</h3><ul>'
      '<li>컨테이너 위에 배지를 겹쳐 라이브 영역 밖으로 약간 확장</li>'
      '<li>최대 <span class="mono">x 22.13</span> &mdash; 캔버스 여백 1.8 유지</li>'
      '<li>기준: <span class="mono">ic_doc_percent_flat</span>, '
      '<span class="mono">ic_user_percent_flat</span></li>'
      '</ul></section></div>'
      '<p>배지 지름은 8&ndash;9 사이. 배지 hue는 주 hue와 달라도 되지만, 한 아이콘에 배지는 하나뿐이다. '
      '개념이 셋 이상이면 아이콘을 쪼갠다.</p>'
      % "".join(plate(i, 72, l) for i, l in [
          ("ic_doc_check_flat", "컷아웃"),
          ("ic_doc_percent_flat", "오버레이"),
          ("ic_user_percent_flat", "오버레이"),
          ("ic_doc_aicheck_flat", "오버레이"),
          ("ic_goverment_money_flat", "별도 hue 배지"),
      ])))

# 08 emoji
A(sec("08", "이모지 서브셋", "emoji",
      "이모지 5종은 오브젝트 아이콘과 다른 규칙을 쓴다. 감정만 표현하고, 오브젝트와 결합하지 않는다.",
      '<div class="row">%s</div>'
      '<div class="tbl-scroll"><table><thead><tr>'
      '<th>요소</th><th>규격</th><th>색</th></tr></thead><tbody>'
      '<tr><td>얼굴</td><td class="mono">circle r 10 (20×20 키라인)</td>'
      '<td class="mono">#FFD24A</td></tr>'
      '<tr><td>눈</td><td class="mono">r 1.35 · (9, 9.6) / (15, 9.6)</td>'
      '<td class="mono">#402A32</td></tr>'
      '<tr><td>입</td><td class="mono">얼굴 하단, 폭 5&ndash;6</td>'
      '<td class="mono">#ED672E</td></tr>'
      '<tr><td>부가 요소</td><td class="mono">하트 · 눈물 등 1개까지</td>'
      '<td class="mono">#FF474A · #73BBFF</td></tr>'
      '</tbody></table></div>'
      '<p>네이밍도 별도 규칙을 따른다 &mdash; <span class="mono">ic_emoji_{expression}_face</span>. '
      '<span class="mono">_flat</span> 접미사를 붙이지 않는다.</p>'
      % "".join(plate(i, 64, i.replace("ic_emoji_", "").replace("_face", ""))
                for i in ["ic_emoji_smiling_face", "ic_emoji_slightly_face",
                          "ic_emoji_cry_face", "ic_emoji_sad_face",
                          "ic_emoji_heart_face"])))

# 09 naming
A(sec("09", "네이밍과 카테고리", "naming",
      "파일명 · 아이콘 id · Figma 컴포넌트명을 하나로 맞춘다. 셋 중 하나만 달라도 라이브러리 검색이 깨진다.",
      '<pre><b>ic_</b>{object}<b>_</b>{modifier}<b>_flat</b>\n'
      '<i>│  │        │</i>\n'
      '<i>│  │        └ 결합·상태: money check percent search list minus play folder down</i>\n'
      '<i>│  └ 주 오브젝트: doc card user box pc map graph goverment truck</i>\n'
      '<i>└ 고정 접두사</i></pre>'
      '<div class="tbl-scroll"><table><thead><tr>'
      '<th>규칙</th><th>내용</th></tr></thead><tbody>'
      '<tr><td>표기</td><td>영문 소문자 + snake_case. 한글·대문자·하이픈 금지</td></tr>'
      '<tr><td>접미사</td><td><span class="mono">_flat</span> 필수. 이모지만 '
      '<span class="mono">_face</span></td></tr>'
      '<tr><td>modifier 순서</td><td>오브젝트 → 결합 대상 → 동작. '
      '<span class="mono">ic_doc_money_flat</span> (문서에 금액이 붙음)</td></tr>'
      '<tr><td>파일명</td><td><span class="mono">{id}.svg</span> &mdash; 확장자 제외하면 id와 동일</td></tr>'
      '</tbody></table></div>'
      '<h3>카테고리</h3>'
      '<p>카테고리는 6종으로 고정한다. 새 카테고리를 만들기 전에 기존 6종에 넣을 수 없는지 먼저 확인한다.</p>'
      '<div class="tbl-scroll"><table><thead><tr>'
      '<th>카테고리</th><th>수</th><th>범위</th></tr></thead><tbody>'
      + cat_rows() +
      '</tbody></table></div>'
      '<div class="callout warn"><b>기존 오탈자</b><span>'
      '<span class="mono">ic_goverment_flat</span>(→ government), '
      '<span class="mono">ic_calcu_flat</span>(→ calculator)는 이미 배포된 이름이라 유지 중이다. '
      '신규 아이콘은 철자를 정확히 쓴다.</span></div>'))

# 10 export
A(sec("10", "Export와 등록", "export",
      "Figma에서 뽑은 SVG를 그대로 커밋하지 않는다. 아래 형태로 정리한 뒤 저장하고, 메타데이터를 함께 "
      "등록해야 라이브러리에 노출된다.",
      '<h3>1. SVG 정리</h3>'
      '<pre>&lt;svg width="<b>24</b>" height="<b>24</b>" viewBox="<b>0 0 24 24</b>" '
      'fill="<b>none</b>" xmlns="http://www.w3.org/2000/svg"&gt;\n'
      '  &lt;path d="…" fill="<b>#6DACFF</b>"/&gt;   <i>&lt;!-- L1 Base --&gt;</i>\n'
      '  &lt;path d="…" fill="<b>#1772E9</b>"/&gt;   <i>&lt;!-- L2 Accent --&gt;</i>\n'
      '  &lt;path d="…" fill="<b>white</b>"/&gt;     <i>&lt;!-- L3 Detail --&gt;</i>\n'
      '&lt;/svg&gt;</pre>'
      '<div class="tbl-scroll"><table><tbody>'
      '<tr><td style="width:30%"><b>제거</b></td>'
      '<td><span class="mono">id</span> / <span class="mono">class</span> 잔여물, 빈 '
      '<span class="mono">&lt;g&gt;</span>, 사용하지 않는 '
      '<span class="mono">clipPath</span>, <span class="mono">data-*</span></td></tr>'
      '<tr><td><b>금지</b></td><td><span class="mono">stroke</span>, '
      '<span class="mono">opacity</span>, <span class="mono">filter</span>, '
      '<span class="mono">style</span> 속성</td></tr>'
      '<tr><td><b>조건부 허용</b></td><td><span class="mono">mask</span>는 도넛·파이 형태에만. '
      'id가 <span class="mono">mask0_16817_1404</span>처럼 Figma 자동 생성값이라 인라인 시 '
      '충돌하므로 아이콘 id를 포함한 이름으로 바꾼다</td></tr>'
      '<tr><td><b>좌표</b></td><td>소수점 4자리까지. 그 이상은 잘라낸다</td></tr>'
      '</tbody></table></div>'
      '<h3>2. 파일 저장</h3>'
      '<pre>public/icons/multicolor/<b>ic_doc_money_flat</b>.svg</pre>'
      '<p class="note">이 디렉터리는 빌드 시 전수 스캔되므로 파일만 넣어도 목록에는 뜬다. 다만 메타데이터가 '
      '없으면 카테고리가 <span class="mono">미분류</span>가 되고 검색이 되지 않는다.</p>'
      '<h3>3. 메타데이터 등록</h3>'
      '<pre><i>// src/data/icons.ts</i>\n'
      '{\n'
      '  id: "<b>ic_doc_money_flat</b>",\n'
      '  category: "<b>문서</b>",              <i>// 6종 중 하나</i>\n'
      '  tags: {\n'
      '    ko: ["문서", "정산", "비용", "돈", "원"],   <i>// 3개 이상</i>\n'
      '    en: ["document", "money", "finance", "invoice"],\n'
      '  },\n'
      '  figmaNodeId: "<b>14946:24831</b>",     <i>// 원본 노드</i>\n'
      '}</pre>'
      '<p class="note">태그는 사용자가 실제로 검색할 단어를 넣는다 &mdash; 오브젝트명, 업무 용어, 동의어. '
      'ko·en 각각 3개 이상.</p>'))

# 11 qa
A(sec("11", "QA 체크리스트", "qa",
      "커밋 전에 전 항목을 통과해야 한다. 하나라도 걸리면 세트 안에서 튄다.",
      checklist()))

# 12 set
A(sec("12", "현재 세트 57종", "set",
      "신규 아이콘을 그릴 때는 먼저 여기에 같은 개념이 있는지 확인한다. 비슷한 것이 있으면 새로 만들지 않고 "
      "배지를 붙여 파생시킨다.",
      gallery()))

A('</main></div></div>')
A('<footer><div class="wrap"><span>Douzone Icon Library · Flat Multicolor Spec v1</span>'
  '<span class="mono">public/icons/multicolor · 57 icons · 2026.09</span></div></footer>')

out = "\n".join(html)
open(os.path.join(ROOT, "docs/ICON_STYLE_GUIDE.html"), "w").write(out)
print("wrote docs/ICON_STYLE_GUIDE.html —", len(out), "bytes,", len(META), "icons")
