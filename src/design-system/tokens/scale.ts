// wehago.token.json (semantic.radius/gap/padding/size, primitive.shadow-level*)에서 추출한 크기 토큰

export type ScaleItem = { name: string; px: number }

export const radiusScale: ScaleItem[] = [
  { name: 'xxsmall', px: 4 },
  { name: 'xsmall', px: 6 },
  { name: 'small', px: 8 },
  { name: 'medium', px: 12 },
  { name: 'large', px: 16 },
  { name: 'xlarge', px: 20 },
  { name: 'xxlarge', px: 24 },
  { name: 'max', px: 1000 },
]

export const gapScale: ScaleItem[] = [
  { name: '1', px: 2 },
  { name: '2', px: 4 },
  { name: '3', px: 6 },
  { name: '4', px: 8 },
  { name: '5', px: 12 },
  { name: '6', px: 16 },
  { name: '7', px: 20 },
  { name: '8', px: 24 },
  { name: '9', px: 28 },
  { name: '10', px: 32 },
  { name: '11', px: 36 },
  { name: '12', px: 40 },
  { name: '13', px: 44 },
]

export const paddingScale: ScaleItem[] = [
  { name: '1', px: 2 },
  { name: '2', px: 4 },
  { name: '3', px: 6 },
  { name: '4', px: 8 },
  { name: '5', px: 12 },
  { name: '6', px: 16 },
  { name: '7', px: 20 },
  { name: '8', px: 24 },
  { name: '9', px: 28 },
  { name: '10', px: 32 },
  { name: '11', px: 36 },
  { name: '12', px: 40 },
  { name: '13', px: 44 },
]

export const sizeScale: ScaleItem[] = [
  { name: '1', px: 8 },
  { name: '2', px: 12 },
  { name: '3', px: 16 },
  { name: '4', px: 20 },
  { name: '5', px: 24 },
  { name: '6', px: 28 },
  { name: '7', px: 32 },
  { name: '8', px: 36 },
  { name: '9', px: 40 },
  { name: '10', px: 44 },
  { name: '11', px: 48 },
  { name: '12', px: 52 },
  { name: '13', px: 56 },
  { name: '14', px: 60 },
  { name: '15', px: 64 },
  { name: '16', px: 72 },
  { name: '17', px: 80 },
  { name: '18', px: 88 },
]

export type ShadowLevel = { name: string; x: number; y: number; blur: number; spread: number; color: string }

// primitive.shadow-level1/2/3 (boxShadow 타입)에서 추출한 실제 그림자 값입니다.
export const shadowLevels: ShadowLevel[] = [
  { name: 'shadow-level1', x: 0, y: 2, blur: 4, spread: 0, color: 'rgba(0, 0, 0, 0.1)' },
  { name: 'shadow-level2', x: 0, y: 4, blur: 12, spread: 0, color: 'rgba(0, 0, 0, 0.1)' },
  { name: 'shadow-level3', x: 4, y: 8, blur: 20, spread: 0, color: 'rgba(0, 0, 0, 0.1)' },
]
