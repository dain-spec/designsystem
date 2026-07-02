// Figma "Typography_2.0" 프레임(node 12726:23597)에서 추출한 값

// 'Noto Sans CJK KR'은 Figma상의 원본 폰트명이며, 웹에서는 동일 글리프의 'Noto Sans KR'로 대체합니다.
export const fontFamily = "'Noto Sans CJK KR', 'Noto Sans KR', sans-serif"
export const letterSpacing = -0.5

export type TypeStyle = {
  name: string
  fontSize: number
  lineHeight: number
  weights: string[]
  usage: string
  isCoreSize?: boolean
}

export const typeface = {
  fontFamily,
  fontSize: 64,
  fontWeight: 700,
  lineHeight: 96,
  letterSpacing,
  sample: '가나다 AaBbCc 123 @#!?*',
  guides: {
    letterSpacing: 'Letter-spacing : 0.5px',
    lineHeight: 'Line-height : 150%',
  },
}

export const headingStyles: TypeStyle[] = [
  {
    name: 'Heading1',
    fontSize: 20,
    lineHeight: 30,
    weights: ['Regular', 'Medium', 'Bold'],
    usage: '페이지단위 타이틀 쓰임새로 사용 권장합니다.',
  },
  {
    name: 'Heading2',
    fontSize: 18,
    lineHeight: 27,
    weights: ['Regular', 'Medium', 'Bold'],
    usage: '페이지단위 타이틀 쓰임새로 사용 권장합니다.',
  },
]

export const bodyStyles: TypeStyle[] = [
  {
    name: 'Body1',
    fontSize: 16,
    lineHeight: 24,
    weights: ['Regular', 'Medium', 'Bold'],
    usage: '주요 본문 쓰임새로 사용 권장합니다.',
  },
  {
    name: 'Body2',
    fontSize: 15,
    lineHeight: 22.5,
    weights: ['Regular', 'Medium', 'Bold'],
    usage: '주요 본문 쓰임새로 사용 권장합니다.',
  },
  {
    name: 'Body3',
    fontSize: 14,
    lineHeight: 21,
    weights: ['Regular', 'Medium', 'Bold'],
    usage: '주요 본문 쓰임새로 사용 권장합니다.',
    isCoreSize: true,
  },
  {
    name: 'Body4',
    fontSize: 13,
    lineHeight: 19.5,
    weights: ['Regular', 'Medium', 'Bold'],
    usage: '주요 본문 쓰임새로 사용 권장합니다.',
  },
  {
    name: 'Body5',
    fontSize: 12,
    lineHeight: 18,
    weights: ['Regular', 'Medium', 'Bold'],
    usage: '본문 보조 쓰임새로 사용 권장합니다.',
  },
  {
    name: 'Body6',
    fontSize: 11,
    lineHeight: 16.5,
    weights: ['Regular', 'Medium', 'Bold'],
    usage: '본문 보조, 하위 위계 텍스트 쓰임새로 사용 권장합니다.',
  },
  {
    name: 'Body7',
    fontSize: 10,
    lineHeight: 15,
    weights: ['Regular', 'Medium', 'Bold'],
    usage: '본문 보조, 하위 위계 텍스트 쓰임새로 사용 권장합니다.',
  },
]

export const sampleText = '비즈니스 플랫폼 AaBbCc 9,0124,000 @#!?'
