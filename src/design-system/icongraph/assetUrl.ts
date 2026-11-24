// 배포 사이트는 /designsystem/ 아래에서 서비스되므로, 정적 자산 경로에 base를 붙입니다.
const BASE = import.meta.env.BASE_URL

export function assetUrl(path: string): string {
  return path.startsWith('/') ? BASE + path.slice(1) : path
}

// manifest 안의 '/icongraph/...' 경로를 모두 base 기준으로 바꿉니다.
export function withBase<T>(value: T): T {
  if (typeof value === 'string') return (value.startsWith('/icongraph/') ? assetUrl(value) : value) as T
  if (Array.isArray(value)) return value.map(withBase) as T
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, withBase(v)])) as T
  }
  return value
}
