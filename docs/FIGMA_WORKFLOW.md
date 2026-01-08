# Figma → Tailwind CSS 워크플로우

이 문서는 디자이너와 개발자가 Figma Tokens 플러그인을 사용하여 디자인 시스템을 코드로 동기화하는 방법을 설명합니다.

## 🎨 디자이너를 위한 가이드

### 1. Figma Tokens 플러그인 설치

1. Figma에서 플러그인 메뉴 열기
2. "Figma Tokens" 검색 및 설치
3. 프로젝트에서 플러그인 실행

### 2. 디자인 토큰 정의

Figma Tokens 플러그인에서 다음과 같이 토큰을 정의합니다:

```json
{
  "colors": {
    "primary": {
      "500": "#3b82f6",
      "600": "#2563eb"
    }
  },
  "spacing": {
    "md": "16px",
    "lg": "24px"
  }
}
```

### 3. 토큰 Export

1. Figma Tokens 플러그인 열기
2. Export 버튼 클릭
3. JSON 형식으로 다운로드
4. 개발자에게 전달 (또는 Git repository에 커밋)

## 💻 개발자를 위한 가이드

### 1. 디자인 토큰 업데이트

디자이너로부터 받은 `tokens.json` 파일을:

```bash
src/shared/design-tokens/tokens.json
```

위치에 복사합니다.

### 2. 자동 변환

빌드 시 자동으로 Tailwind 형식으로 변환됩니다:

- `tokens.json` → `transform.ts` → `tailwind.config.ts`

### 3. Tailwind에서 사용

```tsx
// 디자인 토큰 사용 예시
<button className="bg-primary-500 text-white px-md py-sm rounded-md">
  Click me
</button>
```

### 4. 토큰 매핑 규칙

| Figma Token Type | Tailwind Class Prefix |
|-----------------|----------------------|
| `colors.primary.500` | `bg-primary-500`, `text-primary-500` |
| `spacing.md` | `p-md`, `m-md`, `gap-md` |
| `fontSize.lg` | `text-lg` |
| `borderRadius.md` | `rounded-md` |

## 🔄 워크플로우

```
Figma 디자인
    ↓
토큰 정의 (Figma Tokens 플러그인)
    ↓
JSON export
    ↓
src/shared/design-tokens/tokens.json에 복사
    ↓
빌드 시 자동 변환 (transform.ts)
    ↓
Tailwind Config에 자동 적용
    ↓
개발 (Tailwind 클래스 사용)
```

## 📝 베스트 프랙티스

### 디자이너

1. **일관된 네이밍**: `primary-500`, `spacing-md` 같은 시맨틱 이름 사용
2. **계층 구조**: 색상은 50-900 스케일, spacing은 xs-3xl 스케일 사용
3. **타입 명시**: 각 토큰에 type 필드 포함 (`color`, `spacing`, `fontSize` 등)

### 개발자

1. **직접 값 사용 금지**: `bg-[#3b82f6]` 대신 `bg-primary-500` 사용
2. **토큰 우선**: 인라인 스타일보다 Tailwind 클래스 우선 사용
3. **변경 테스트**: 토큰 업데이트 후 빌드 및 UI 검증

## 🛠️ 문제 해결

### 토큰이 적용되지 않는 경우

1. `tokens.json` 파일 위치 확인
2. 빌드 재시도 (`npm run build`)
3. 브라우저 캐시 클리어 후 개발 서버 재시작

### 새로운 토큰 타입 추가

`src/shared/design-tokens/transform.ts`에서 변환 로직 추가:

```typescript
export function transformTokens(tokens: Record<string, TokenGroup>) {
  return {
    // ... 기존 토큰
    yourNewType: tokens.yourNewType ? transformTokenGroup(tokens.yourNewType) : {},
  }
}
```

그리고 `tailwind.config.ts`에 매핑 추가:

```typescript
theme: {
  extend: {
    yourNewType: tokens.yourNewType,
  }
}
```
