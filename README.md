# 📚 Next-Labs

Next-Labs는 Next.js 기반 기능들을 모듈별로 정리하고,
다양한 라이브러리/패턴을 실험하기 위한 개인 실험실 레포입니다.

새로운 프로젝트에서 필요한 기능을
복사·참고·응용하기 쉽도록 만들었습니다.

각 기능은 /src/modules 아래에 독립적인 모듈 폴더로 구성되며,
각 폴더에는 해당 기능만을 설명하는 README.md가 포함됩니다.

## ✨ 특징 (Features)

- Next.js(App Router) 기반 기능 예제 모음
- 라이브러리별 구현 스니펫 정리
- 모듈 단위로 독립 테스트 가능
- Playground 페이지 제공 (/modules/...)
- 실제 서비스 코드에 바로 적용 가능한 형태로 구성

## 📁 디렉토리 구조

```
next-labs/
  src/
    app/
      modules/
        {module1}/
          page.tsx
        {module2}/
          page.tsx
        ...
    modules/
      {module1}/
        index.tsx
        README.md
      {module1}/
        index.tsx
        README.md
      ...
  README.md
  package.json
  tsconfig.json
  tailwind.config.ts
```

### 구조 설명

- src/modules/\* : 실제 기능 구현 모듈 (컴포넌트, hooks, 유틸 등) + 모듈별 README
- src/app/modules/\* : 해당 모듈을 확인할 수 있는 Playground 페이지
- README.md : 레포 전체 소개

## 🧩 모듈 추가 규칙

모듈을 추가할 때는 아래 규칙을 따릅니다.

### 1) 위치

> src/modules/{module-name}/

예시:

- src/modules/auth-basic/
- src/modules/table-mrt/
- src/modules/chart-pie/

### 2) 모듈 폴더 구성

모듈 폴더는 아래 형태를 권장합니다.

```
src/modules/{module-name}/
  index.ts        # hooks, types, components 전부 여기서 export
  components/
  hooks/
  types/
  README.md
```

### 3) Playground 페이지 추가

필수는 아니지만 대부분 다음처럼 페이지를 하나 추가합니다.

> src/app/modules/{module-name}/page.tsx

이 페이지는 UI 확인용이며, 실제 구현은 src/modules에 두어야 합니다.

## 📄 모듈 README 템플릿

각 모듈 폴더(src/modules/{module-name})에는 아래 템플릿으로 README.md를 작성합니다.

```
# 🧩 {module-name}

기능 설명
이 모듈이 어떤 문제를 해결하는지 또는 어떤 기능을 제공하는지 간단히 작성합니다.

## 📁 구조
src/modules/{module-name}/
  index.tsx
  hooks.ts (optional)
  utils.ts (optional)
  README.md

## 🚀 사용법
1) 설치/필요 라이브러리
npm install ...

2) 코드 예시
import Something from "@/modules/{module-name}";

export default function Page() {
  return <Something />;
}

## 🔍 Playground 페이지

Playground를 제공한 경우:

주소:
/modules/{module-name}

## 📝 참고 사항

제약 사항, 버전 호환성, 대체 가능 패턴 등을 간단히 작성합니다.

## 🚀 로컬 실행 방법
npm install
npm run dev


실행 후 아래 주소로 접근해 모듈별 데모를 확인할 수 있습니다.

http://localhost:3000/
```
