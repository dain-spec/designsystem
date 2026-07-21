// Figma 'Scale_2.0' 프레임(node 12726:23725)에서 추출한 크기 토큰

export type ScaleItem = { name: string; px: number }

export const radiusScale: ScaleItem[] = [
  { name: 'xxsmall', px: 4 },
  { name: 'xsmall', px: 6 },
  { name: 'small', px: 8 },
  { name: 'medium', px: 12 },
  { name: 'large', px: 16 },
  { name: 'xlarge', px: 20 },
  { name: 'max', px: 1000 },
]

export const gapScale: ScaleItem[] = [
  { name: '1', px: 4 },
  { name: '2', px: 6 },
  { name: '3', px: 8 },
  { name: '4', px: 12 },
  { name: '5', px: 16 },
  { name: '6', px: 20 },
  { name: '7', px: 24 },
  { name: '8', px: 28 },
  { name: '9', px: 32 },
  { name: '10', px: 36 },
]

export const paddingScale: ScaleItem[] = [
  { name: '1', px: 4 },
  { name: '2', px: 6 },
  { name: '3', px: 8 },
  { name: '4', px: 12 },
  { name: '5', px: 16 },
  { name: '6', px: 20 },
  { name: '7', px: 24 },
  { name: '8', px: 28 },
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
]

// Figma 원본에 실제 shadow(blur/offset/color) 값이 없어(플러그인이 effects를 지원하지 않음)
// 레벨 이름만 남겨둡니다. 값이 필요하면 Figma에서 직접 effect 스펙을 확인해야 합니다.
export const shadowLevels: string[] = ['shadow-level 1', 'shadow-level 2', 'shadow-level 3']
