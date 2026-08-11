# Design System 개요

이 문서는 Figma [WEHAGO Web 2.0_DSG](https://www.figma.com/design/vVNdCTvO5nvN88byoPuYkV/WEHAGO-Web-2.0_DSG?node-id=6556-35225) 파일의 `UIGuide_v2.0` 캔버스 구조를 정리하고, 이 저장소(`src/design-system`)의 구현 현황과 매핑한 인덱스 문서입니다. [GitHub Primer](https://primer.style)의 Foundations → Components → Patterns 목차 구조를 참고했습니다.

## 목차

1. [Foundations](#1-foundations)
2. [Components](#2-components)
   - [Icons](#2-1-icons)
3. [Patterns](#3-patterns)
4. [Screens & Reference](#4-screens--reference)
5. [Implementation Status](#implementation-status)
6. [Roadmap](#roadmap)

## 1. Foundations

디자인의 최하위 단위인 토큰/스케일 가이드입니다.

| Figma 프레임 | 설명 | 저장소 구현 |
|---|---|---|
| `Typography_2.0` | 타이포그래피 스케일 가이드 | `src/design-system/foundation/Typography.tsx`, `tokens/typography.ts` |
| `Scale_2.0` | 간격/사이즈 스케일 가이드 | `src/design-system/foundation/Scale.tsx`, `tokens/scale.ts` |
| `Color_2.0` | 컬러 팔레트 가이드 | `src/design-system/foundation/Color.tsx`, `tokens/color.ts` |
| `Design Token` | 디자인 토큰(Primitive/Semantic/Component) 정의 | `wehago.token.json` (`primitive/Value`, `semantic/Value`, `component/Light`, `component/Dark`) → `tokens/component.ts` (자동 생성) |

## 2. Components

Foundations 위에서 조합되는 최소 단위 UI 컴포넌트입니다. Figma의 `--Type-Base` 프레임에 Size/State(Default/Focused/Typing/Completed/Disabled/ReadOnly/Success/Warning/Error 등) 변형이 심볼로 정리되어 있습니다.

| 컴포넌트 | 하위 요소 |
|---|---|
| `InputField` | Size(Medium/Small) × State(Default/Focused/Typing/Completed/Disabled/ReadOnly/Success/Warning/Error) |
| `DateTimeInput` | `DateInput`, `TimeInput` — Size × State(Default/Focused/Completed/Disabled) |
| `Dropdown` | `DropdownField`, `Dropdown` — Size × State(Default/Focused/Completed/Disabled) |
| `TextArea` | State(Default/Focused/Typing/Completed/Disabled) |
| `Search` | `Searchbar`, `SearchbarFilter` — State(Default/Focused/Typing/Completed/Disabled/Error) |
| `SelectControl` | `ToggleSwitch`, `CheckboxSingle`, `Checkbox`, `Radio` — Size × State × Select(On/Off/Indeterminate) |
| `Button` | `Button`(Primary/Secondary/Tertiary × Large/Medium/Small/XSmall × Default/Hovered/Disabled), `TextButton`, `ButtonIcon`, `Icon`, `GhostButton` |

저장소 구현: `InputField`, `Dropdown`(트리거 필드 + 열림 메뉴), `TextArea`, `Search`(Searchbar/SearchbarFilter), `SelectControl`(ToggleSwitch/CheckboxSingle/Checkbox/Radio), `Button`(Primary/Secondary/Tertiary)이 `src/components/`에 구현되어 있고, `src/design-system/components/TypeBaseDemo.tsx`에서 전체 변형을 확인할 수 있습니다. `TextButton`/`ButtonIcon`/`Icon`/`GhostButton`, `DateTimeInput`을 제외한 나머지는 아직 구현 전입니다 (`DateTimeInput`은 별도로 `src/components/DateTimeInput/DateTimeInput.tsx`에 기존 구현이 있습니다).

> `InputField`/`Dropdown`/`Search`는 Figma에 이미 다른(존재하지 않는) 코드 경로로 Code Connect가 걸려 있어 `get_design_context`가 실제 스타일 대신 자리표시자만 반환했습니다. 이 3개는 스크린샷과 `component/Light` 토큰(`input.*`, `text.*`, `icon.*`)을 근거로 이식했고, `Button`의 Medium/Small/XSmall 크기별 padding은 Large(Figma에서 직접 확인)를 기준으로 scale 토큰에 맞춰 비례 추정한 값이라 Figma 실측치와는 다를 수 있습니다.

> `Button`의 `Icon`은 상태(Default/Hovered/Disabled/On) 래퍼일 뿐, 실제 아이콘 글리프는 아래 별도 아이콘 라이브러리에서 가져와 채웁니다.

### 2-1. Icons

아이콘은 이 파일이 아니라 별도 Figma 파일 [Graphic Asset](https://www.figma.com/design/R6ZgOUWOgCZEgu38S8mhJl/Graphic-Asset?node-id=1866-6918)의 `Icon Library` 섹션(node `1866:6918`)에서 공통으로 관리됩니다.

- 카테고리: `서비스`, `디바이스`, `사람`, `파일`, `소리`, `반응`, `arrows`, `status`, `AI 기능 (별 조합)`, `메뉴, 뷰타입`, `화면 축소, 확장`, `사각형` 등
- 네이밍 규칙: `ic_` 접두사 (예: `ic_mail`, `ic_alarm`, `ic_add`) — 인스턴스 기준 약 640개 이상의 아이콘 컴포넌트
- 사이즈 변형: 아이콘당 14 / 18 / 24 / 32px 4단계 제공
- 저장소 구현: 없음 — 아직 `src/`에 아이콘 컴포넌트나 SVG 에셋이 존재하지 않습니다. 코드로 이식할 때는 이 파일을 소스 오브 트루스로 삼아야 합니다.

## 3. Patterns

Components를 여러 개 조합해 실제 화면 단위로 구성한 상위 레이어입니다. 메인 UIGuide 섹션과 `컴포넌트` 섹션 양쪽에 동일한 카테고리가 반복됩니다.

- `--Type-Display` — 표시/레이아웃 패턴
- `--Type-Feedback` — 알림, 다이얼로그 등 피드백 패턴
- `--Type-Navi` — 내비게이션 패턴
- `--Type-Action` — 버튼 등 액션 패턴
- `--Type-Form` — 입력 폼 패턴 (Searchbar, DatePicker, DateRangePicker, DateTimePicker, TabSegment 등)

`컴포넌트` 섹션은 위 패턴들을 Light/Dark 모드별로 재구성한 명세 섹션입니다.

### 3-1. `--Type-Form` 구성 요소

Figma 노드 `16160:26067`. `--Type-Base` 컴포넌트를 조합한 실제 폼 패턴입니다.

| 요소 | 설명 | 저장소 구현 |
|---|---|---|
| `Dropdown`의 `DropdownMenu` | 열림 목록(리스트 아이템 32px, 스크롤) | 구현됨 — `Dropdown`의 `options`/`onSelect` prop |
| `Picker`의 `DatePicker` | 월 이동 헤더 + 날짜 그리드, 일요일 빨강, 오늘 강조, `DefaultButton`(취소/확인 푸터) | 구현됨 — `src/components/DatePicker/` |
| `Picker`의 `DateRangePicker` | 달력 2개(당월/익월) + 구분선 + "선택기간 N일" 푸터 | 구현됨 — `src/components/DateRangePicker/` |
| `Picker`의 `TimePicker`, `DateTimePicker` | — | 미구현 — Figma Code Connect가 걸려 있어 `get_design_context`가 실제 코드를 반환하지 않음 (재조사 필요) |
| `Search`의 `SearchbarMenu`, `SearchbarFilterView`, `Atomic/Searchbar/_*` | 검색 제안 목록, 필터 뷰 | 미구현 — 일부만 Code Connect 자리표시자로 확인, 실제 레이아웃 미확인 |
| `Input`(Atomic), `DateTimeInput`/`Dropdown`/`TextArea`/`CheckboxLabel`/`RadioLabel`의 `*Label` 래퍼 | 라벨 + 컴포넌트 조합 | 미구현 |

## 4. Screens & Reference

패턴을 실제로 적용한 화면과, 아직 정식 카테고리로 정리되지 않은 리서치/작업용 프레임입니다.

- `Dark Theme` — 다크 테마 관련 안내
- `화면` — Light/Dark 실제 화면 스크린샷 모음
- `자동 다크모드 개발화면 참고` — 다크모드 자동 변환 개발 참고 화면
- 그 외 리서치/작업용 프레임: `Guide`, `History`, `색상팔레트 최종`, `현재 베리어블 프리미티브 색상`, `지피티 답변`, `통합검색`, `다이얼로그_조직도`, `다이얼로그_사용자목록`, `SidePanel` 등 (실험/작업용 캔버스)

## Implementation Status

| Figma 항목 | 저장소 구현 | 상태 |
|---|---|---|
| `Typography_2.0` | `src/design-system/foundation/Typography.tsx`, `tokens/typography.ts` | 구현됨 |
| `Scale_2.0` | `src/design-system/foundation/Scale.tsx`, `tokens/scale.ts` | 구현됨 |
| `Color_2.0` | `src/design-system/foundation/Color.tsx`, `tokens/color.ts` | 구현됨 |
| `Design Token` | `wehago.token.json` → `src/design-system/tokens/component.ts` (`node scripts/generate-component-tokens.mjs`로 자동 생성) | 구현됨 (component/Light·Dark 색상 82개 role 매핑) |
| `--Type-Base` (InputField/Dropdown/TextArea/Search/SelectControl/Button) | `src/components/{InputField,Dropdown,TextArea,SearchBar,ToggleSwitch,Checkbox,CheckboxSingle,Radio,Button}` | 구현됨 (필드 비주얼 기준, Dropdown 열림 메뉴·TextButton/ButtonIcon/Icon/GhostButton 제외) |
| `--Type-Base`의 `DateTimeInput` | `src/components/DateTimeInput/DateTimeInput.tsx` | 구현됨 |
| `Icon Library` (별도 파일 [Graphic Asset](https://www.figma.com/design/R6ZgOUWOgCZEgu38S8mhJl/Graphic-Asset?node-id=1866-6918)) | 없음 | 미착수 |
| `--Type-Form`의 `DropdownMenu`/`DatePicker`/`DateRangePicker` | `Dropdown`(options), `src/components/DatePicker/`, `src/components/DateRangePicker/` | 구현됨 |
| `--Type-Form`의 `TimePicker`/`DateTimePicker`/Searchbar 열림 메뉴/`*Label` 래퍼 | 없음 | 미착수 (Figma 실제 코드 미확인) |
| `--Type-Display`, `--Type-Feedback`, `--Type-Navi`, `--Type-Action` | 미구현 | 미착수 |
| `컴포넌트` 섹션 (Light/Dark 명세) | 다크 테마 대응 미구현 | 미착수 |
| `화면` (실제 스크린) | 해당 없음 (컴포넌트 단위 라이브러리) | 참고용 |

## Roadmap

1. ~~`Design Token`(Figma) ↔ `wehago.token.json`을 기준으로 `tokens/` 폴더에 semantic/component 레벨 토큰 매핑 보강~~ — `scripts/generate-component-tokens.mjs`로 `component/Light`·`component/Dark`의 alias를 재귀적으로 풀어 `tokens/component.ts`를 자동 생성하도록 완료. `wehago.token.json`이 갱신되면 `npm run tokens:generate`로 재생성
2. ~~`--Type-Base`의 InputField/Dropdown/TextArea/Search/SelectControl/Button부터 먼저 이식~~ — `src/components/`에 구현 완료 (`TypeBaseDemo`에서 확인 가능). Dropdown 열림 메뉴, TextButton/ButtonIcon/Icon/GhostButton, Button Medium/Small/XSmall 정확한 padding은 후속 확인 필요
3. ~~`--Type-Form`의 Searchbar, DatePicker류부터 순차적으로 `src/components`에 이식~~ — `DropdownMenu`, `DatePicker`(+ 취소/확인 푸터), `DateRangePicker` 구현 완료(`TypeFormDemo`에서 확인 가능). `TimePicker`/`DateTimePicker`와 Searchbar의 열림 메뉴(`SearchbarMenu`/`SearchbarFilterView`)는 Figma에서 Code Connect 자리표시자만 반환되어 미구현 — 실제 컴포넌트를 골라 재조사 필요
4. 컴포넌트 섹션의 Light/Dark 변형을 참고해 다크 테마 토큰 지원 검토
5. `Icon Library`(Graphic Asset 파일)의 아이콘을 SVG 컴포넌트로 이식 — 640개 전량보다는 `--Type-Base`/`--Type-Form` 등에서 실제로 참조하는 아이콘부터 우선 추출
