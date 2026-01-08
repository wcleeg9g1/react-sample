/**
 * Design Tokens → Tailwind v4 CSS 자동 생성
 *
 * tokens.json 파일을 읽어서 @theme 블록을 생성합니다.
 * npm run tokens 명령으로 실행
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

type TokenValue = {
  value: string
  type: string
}

type TokenGroup = {
  [key: string]: TokenValue | TokenGroup
}

/**
 * 토큰 그룹을 CSS 변수로 변환
 */
function generateCSSVariables(
  group: TokenGroup,
  prefix: string = '',
  parentKey: string = ''
): string[] {
  const lines: string[] = []

  for (const [key, value] of Object.entries(group)) {
    if (typeof value === 'object' && value !== null && 'value' in value) {
      // 토큰 값
      const cssVarName = parentKey
        ? `--${prefix}-${parentKey}-${key}`
        : `--${prefix}-${key}`

      lines.push(`  ${cssVarName}: ${(value as TokenValue).value};`)
    } else if (typeof value === 'object' && value !== null) {
      // 중첩 그룹
      const nestedKey = parentKey ? `${parentKey}-${key}` : key
      lines.push(...generateCSSVariables(value as TokenGroup, prefix, nestedKey))
    }
  }

  return lines
}

/**
 * tokens.json을 읽어서 CSS 생성
 */
function generateThemeCSS() {
  // tokens.json 읽기
  const tokensPath = path.join(__dirname, 'tokens.json')
  const tokensContent = fs.readFileSync(tokensPath, 'utf-8')
  const tokens = JSON.parse(tokensContent)

  const cssLines: string[] = [
    '/* ============================================ */',
    '/* 🎨 Design Tokens - Auto-generated from tokens.json */',
    '/* DO NOT EDIT MANUALLY - Run: npm run tokens */',
    '/* ============================================ */',
    '',
    '@theme {',
  ]

  // 각 토큰 그룹 처리
  const sections = [
    { key: 'colors', prefix: 'color', comment: 'Colors' },
    { key: 'spacing', prefix: 'spacing', comment: 'Spacing' },
    { key: 'fontSize', prefix: 'font-size', comment: 'Font Sizes' },
    { key: 'fontWeight', prefix: 'font-weight', comment: 'Font Weights' },
    { key: 'lineHeight', prefix: 'line-height', comment: 'Line Heights' },
    { key: 'borderRadius', prefix: 'radius', comment: 'Border Radius' },
    { key: 'shadow', prefix: 'shadow', comment: 'Shadows' },
  ]

  sections.forEach(({ key, prefix, comment }) => {
    if (tokens[key]) {
      cssLines.push('')
      cssLines.push(`  /* ${comment} */`)
      cssLines.push(...generateCSSVariables(tokens[key], prefix))
    }
  })

  cssLines.push('}')
  cssLines.push('')

  return cssLines.join('\n')
}

/**
 * 생성된 CSS를 파일에 쓰기
 */
function writeThemeCSS() {
  const themeCss = generateThemeCSS()
  const outputPath = path.join(__dirname, 'theme.css')

  fs.writeFileSync(outputPath, themeCss, 'utf-8')

  console.log('✅ Design tokens generated successfully!')
  console.log(`📝 Output: ${outputPath}`)
  console.log('')
  console.log('💡 Import in your CSS:')
  console.log('   @import "./shared/design-tokens/theme.css";')
}

// 실행
writeThemeCSS()
