// Figma "Typography_2.0" 프레임(node 21405:65600)에서 추출한 값

// 'Noto Sans CJK KR'은 Figma상의 원본 폰트명이며, 웹에서는 동일 글리프의 'Noto Sans KR'로 대체합니다.
export const fontFamily = "'Noto Sans CJK KR', 'Noto Sans KR', sans-serif"

// 프레임 내 모든 텍스트 노드의 실측값. 가이드 라벨에는 부호가 빠진 '0.5px'로 표기돼 있으나 오기입니다.
export const letterSpacing = -0.5

// 프레임 내 모든 샘플 텍스트의 공통 색상.
export const textColor = '#333333'

// 모든 단계가 예외 없이 font-size의 150%를 line-height로 사용합니다.
export const lineHeightRatio = 1.5

export type TypeStyle = {
  name: string
  fontSize: number
  lineHeight: number
  weights: string[]
  /** 프레임에서 샘플이 렌더되는 기본 weight. Heading은 Medium(500), Body는 Regular(400). */
  sampleWeight: number
  /** Figma에서 Heading은 행별 용도 설명 없이 섹션 설명만 제공합니다. */
  usage?: string
  isCoreSize?: boolean
}

export const typeface = {
  fontFamily,
  fontSize: 24,
  fontWeight: 700,
  lineHeight: 36,
  letterSpacing,
  sample: '가나다   AaBbCc   123   @#!?*',
  guides: {
    letterSpacing: 'Letter-spacing : -0.5px',
    lineHeight: 'Line-height : 150%',
  },
}

export const headingStyles: TypeStyle[] = [
  { name: 'Heading1', fontSize: 36, lineHeight: 54, weights: ['Regular', 'Medium', 'Bold'], sampleWeight: 500 },
  { name: 'Heading2', fontSize: 32, lineHeight: 48, weights: ['Regular', 'Medium', 'Bold'], sampleWeight: 500 },
  { name: 'Heading3', fontSize: 28, lineHeight: 42, weights: ['Regular', 'Medium', 'Bold'], sampleWeight: 500 },
  {
    name: 'Heading4',
    fontSize: 24,
    lineHeight: 36,
    weights: ['Regular', 'Medium', 'Bold'],
    sampleWeight: 500,
    isCoreSize: true,
  },
  { name: 'Heading5', fontSize: 22, lineHeight: 33, weights: ['Regular', 'Medium', 'Bold'], sampleWeight: 500 },
  { name: 'Heading6', fontSize: 20, lineHeight: 30, weights: ['Regular', 'Medium', 'Bold'], sampleWeight: 500 },
  { name: 'Heading7', fontSize: 18, lineHeight: 27, weights: ['Regular', 'Medium', 'Bold'], sampleWeight: 500 },
]

export const bodyStyles: TypeStyle[] = [
  {
    name: 'Body1',
    fontSize: 16,
    lineHeight: 24,
    weights: ['Regular', 'Medium', 'Bold'],
    sampleWeight: 400,
    usage: '주요 본문 쓰임새로 사용 권장합니다.',
  },
  {
    name: 'Body2',
    fontSize: 15,
    lineHeight: 22.5,
    weights: ['Regular', 'Medium', 'Bold'],
    sampleWeight: 400,
    usage: '주요 본문 쓰임새로 사용 권장합니다.',
  },
  {
    name: 'Body3',
    fontSize: 14,
    lineHeight: 21,
    weights: ['Regular', 'Medium', 'Bold'],
    sampleWeight: 400,
    usage: '주요 본문 쓰임새로 사용 권장합니다.',
    isCoreSize: true,
  },
  {
    name: 'Body4',
    fontSize: 13,
    lineHeight: 19.5,
    weights: ['Regular', 'Medium', 'Bold'],
    sampleWeight: 400,
    usage: '주요 본문 쓰임새로 사용 권장합니다.',
  },
  {
    name: 'Body5',
    fontSize: 12,
    lineHeight: 18,
    weights: ['Regular', 'Medium', 'Bold'],
    sampleWeight: 400,
    usage: '본문 보조 쓰임새로 사용 권장합니다.',
  },
  {
    name: 'Body6',
    fontSize: 11,
    lineHeight: 16.5,
    weights: ['Regular', 'Medium', 'Bold'],
    sampleWeight: 400,
    usage: '본문 보조, 하위 위계 텍스트 쓰임새로 사용 권장합니다.',
  },
  {
    name: 'Body7',
    fontSize: 10,
    lineHeight: 15,
    weights: ['Regular', 'Medium', 'Bold'],
    sampleWeight: 400,
    usage: '본문 보조, 하위 위계 텍스트 쓰임새로 사용 권장합니다.',
  },
  {
    name: 'Body8',
    fontSize: 9,
    lineHeight: 13.5,
    weights: ['Regular', 'Medium', 'Bold'],
    sampleWeight: 400,
    usage: '작은 공간의 보조 정보에 제한적으로 사용합니다.',
  },
]

export const pageDescription =
  '타이포그래피는 콘텐츠를 명확하고 효율적으로 표현하기 위한 디자인 요소입니다.'

export const sectionDescriptions = {
  typeface: '기본 글꼴로 국문과 영문, 숫자 모두 Noto Sans CJK KR 폰트를 사용합니다.',
  heading: '페이지단위 타이틀 쓰임새로 사용 권장합니다.',
  body: '주요 본문 쓰임새로 사용 권장합니다.',
}

// Figma 샘플 문자열 그대로.
export const sampleText = '플랫폼 AaBb 9,012 #?'
