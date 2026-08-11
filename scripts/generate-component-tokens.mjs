// wehago.token.json의 component/Light, component/Dark 색상 토큰을 읽어
// alias("{a.b.c}") 참조를 primitive/semantic 값까지 재귀적으로 풀어낸 뒤
// src/design-system/tokens/component.ts를 생성합니다.
//
// 실행: node scripts/generate-component-tokens.mjs

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const tokenPath = path.join(rootDir, 'wehago.token.json')
const outPath = path.join(rootDir, 'src/design-system/tokens/component.ts')

const tokens = JSON.parse(readFileSync(tokenPath, 'utf-8'))

/** group의 모든 리프 노드를 "a.b.c" -> {value, type} 형태로 평탄화합니다. */
function flatten(node, prefix, map) {
  if (node && typeof node === 'object' && '$value' in node) {
    map.set(prefix, { value: node.$value, type: node.$type })
    return
  }
  if (node && typeof node === 'object') {
    for (const [key, child] of Object.entries(node)) {
      flatten(child, prefix ? `${prefix}.${key}` : key, map)
    }
  }
}

// alias는 collection 이름 없이 "path.within.collection" 형태를 참조하므로
// primitive → semantic 순으로 병합한 단일 조회 테이블을 만듭니다.
const lookup = new Map()
const collisions = []
for (const groupName of ['primitive/Value', 'semantic/Value']) {
  const flat = new Map()
  flatten(tokens[groupName], '', flat)
  for (const [key, val] of flat) {
    if (lookup.has(key)) collisions.push(key)
    lookup.set(key, val)
  }
}
if (collisions.length > 0) {
  console.warn('[generate-component-tokens] primitive/semantic 경로 충돌:', collisions)
}

const ALIAS_RE = /^\{(.+)\}$/

function resolve(rawValue, seen = new Set()) {
  const match = typeof rawValue === 'string' ? rawValue.match(ALIAS_RE) : null
  if (!match) return rawValue
  const refPath = match[1]
  if (seen.has(refPath)) {
    throw new Error(`순환 참조 감지: ${[...seen, refPath].join(' -> ')}`)
  }
  const entry = lookup.get(refPath)
  if (!entry) {
    throw new Error(`별칭을 찾을 수 없음: {${refPath}}`)
  }
  return resolve(entry.value, new Set(seen).add(refPath))
}

/** component/Light 또는 component/Dark의 color 그룹을 role -> token[] 배열로 변환합니다. */
function buildComponentColorGroups(groupName) {
  const colorNode = tokens[groupName]?.color
  if (!colorNode) throw new Error(`${groupName}.color 를 찾을 수 없음`)

  return Object.entries(colorNode).map(([roleName, roleTokens]) => ({
    name: roleName,
    tokens: Object.entries(roleTokens).map(([tokenName, tokenNode]) => ({
      name: tokenName,
      value: resolve(tokenNode.$value),
      ref: tokenNode.$value,
    })),
  }))
}

const lightGroups = buildComponentColorGroups('component/Light')
const darkGroups = buildComponentColorGroups('component/Dark')

function renderGroups(varName, groups) {
  const body = groups
    .map((group) => {
      const tokenLines = group.tokens
        .map((t) => `      { name: '${t.name}', value: '${t.value}', ref: '${t.ref}' },`)
        .join('\n')
      return `  {\n    name: '${group.name}',\n    tokens: [\n${tokenLines}\n    ],\n  },`
    })
    .join('\n')
  return `export const ${varName}: ComponentColorGroup[] = [\n${body}\n]\n`
}

const output = `// AUTO-GENERATED FILE — 직접 수정하지 마세요.
// 생성: node scripts/generate-component-tokens.mjs
// 원본: wehago.token.json (component/Light.color, component/Dark.color)
// wehago.token.json이 갱신되면 이 스크립트를 다시 실행해 동기화하세요.

export type ComponentColorToken = { name: string; value: string; ref: string }
export type ComponentColorGroup = { name: string; tokens: ComponentColorToken[] }

${renderGroups('componentLightColor', lightGroups)}
${renderGroups('componentDarkColor', darkGroups)}`

writeFileSync(outPath, output)
console.log(`generated: ${path.relative(rootDir, outPath)}`)
console.log(`  component/Light roles: ${lightGroups.length}, tokens: ${lightGroups.reduce((n, g) => n + g.tokens.length, 0)}`)
console.log(`  component/Dark roles:  ${darkGroups.length}, tokens: ${darkGroups.reduce((n, g) => n + g.tokens.length, 0)}`)
