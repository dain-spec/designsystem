# Icongraph 도구

IconLibrary repo에서 옮겨 온 문서와 Figma 플러그인입니다.

- `docs/` : 아이콘 스타일 가이드와 컬러 토큰, 이를 생성하는 스크립트
- `figma-plugin/icon-checker/` : 가이드의 QA 체크리스트를 Figma에서 검사하는 플러그인

## 스크립트 실행 (저장소 루트에서)

```bash
python3 tools/icongraph/docs/build-color-palette.py
python3 tools/icongraph/docs/build-icon-guide-md.py
```

아이콘 목록은 `src/design-system/icongraph/manifest.json`,
SVG는 `public/icongraph/icons/multicolor/`를 읽습니다.

## 알려진 상태

- `docs/ICON_STYLE_GUIDE.md`, `ICON_STYLE_GUIDE.html`은 아이콘 57종 시점에 생성된 결과 그대로입니다.
  현재 세트는 238종이라 `build-icon-guide-md.py`를 다시 실행하면 수치가 바뀝니다.
- `build-icon-guide.py`(HTML 생성)는 예전 아이콘 이름(`ic_emoji_smiling_face` 등)을 직접 참조해,
  현재 세트에서는 `FileNotFoundError`로 중단됩니다. IconLibrary에서도 같은 상태였습니다.
- 플러그인의 `sync-palette.js`는 이 폴더를 기준으로 `docs/color-tokens.json`을 읽습니다.
