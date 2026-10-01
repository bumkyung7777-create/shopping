# Shopping — 여성 패션 쇼핑몰 클론

[DummyJSON](https://dummyjson.com) 상품 API를 이용해 만든 **여성 패션 쇼핑몰** 프로젝트입니다.
Next.js App Router 의 서버 컴포넌트, 동적 라우팅, `searchParams` 를 직접 써보면서 "주소(URL)가 곧 화면의 상태" 가 되는 구조를 익히는 것을 목표로 했습니다.

- 카테고리별 상품 목록 (드레스, 탑, 슈즈, 가방, 주얼리, 시계)
- 상품 상세 페이지 + 리뷰 목록
- 헤더 검색 패널을 통한 키워드 검색
- 상품 이미지 슬라이더 (Swiper)

<br />

## 기술 스택

| 구분 | 사용 기술 |
| --- | --- |
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| UI | React 18 |
| Styling | Tailwind CSS 3, CSS Modules, 일반 CSS |
| Slider | Swiper 14 |
| 상태관리 | React `useState` (Zustand 도입 검토 중) |
| Data | DummyJSON REST API |
| Code Style | Prettier (4 spaces, single quote, printWidth 100) |

<br />

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 으로 접속합니다.

| 스크립트 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 빌드 결과 실행 |
| `npm run lint` | ESLint 검사 |

<br />

## 폴더 구조

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # 루트 레이아웃 (Header 포함, 전역 CSS 로드)
│   ├── page.tsx                  # 메인 페이지 (전체 상품 목록)
│   ├── globals.css               # Tailwind + 리셋 CSS + 공통 스타일
│   ├── fonts/                    # Geist 로컬 폰트
│   ├── products/
│   │   ├── page.tsx              # 카테고리별 상품 목록 페이지 (?category=)
│   │   └── [id]/
│   │       └── page.tsx          # 상품 상세 페이지 (동적 라우팅)
│   └── search/
│       └── page.tsx              # 검색 결과 페이지 (?q=)
├── components/                   # 공통 컴포넌트
│   ├── header/
│   │   ├── header.tsx            # 헤더 (로고, 카테고리 메뉴, 검색 패널)
│   │   └── header.module.css     # 헤더 전용 CSS Module
│   ├── productCard/
│   │   ├── productCard.tsx       # 상품 카드 (이미지 슬라이더 + 정보)
│   │   └── productCard.css       # 상품 카드 스타일
│   └── loading/
│       └── loading.tsx           # 로딩 fallback 컴포넌트
├── constants/
│   └── category.ts               # 카테고리 목록 (slug / label) + 타입
├── services/
│   └── productService.ts         # 상품 목록 API 호출 함수
└── global.d.ts                   # CSS 파일 import 타입 선언

test/
└── db.json                       # API 응답 구조 확인용 샘플 데이터
```

<br />

## 페이지 및 기능 설명

### 0. 공통 레이아웃

**경로:** `src/app/layout.tsx`

- 모든 페이지 상단에 `Header` 를 고정으로 렌더링
- `globals.css` 와 `productCard.css` 를 루트에서 한 번에 불러와 전역 스타일 적용
- `next/font/local` 로 Geist 폰트를 로드하고, 본문 폰트는 Pretendard 를 우선 사용
- `html { font-size: 10px }` 로 기준을 잡아 `1.6rem = 16px` 처럼 계산하기 쉽게 구성

<br />

### 1. Header (헤더 + 검색 패널)

**경로:** `src/components/header/header.tsx`

**기능**

- 로고 클릭 시 메인(`/`)으로 이동
- 카테고리 메뉴
  - `constants/category.ts` 의 `CATEGORIES` 배열을 `map` 으로 돌려 자동 생성
  - DRESSES, TOPS, SHOES, BAGS, JEWELLERY, WATCHES (6개)
  - 클릭 시 `/products?category={slug}` 로 이동
- 검색 버튼
  - 클릭 시 화면 상단에 검색 패널이 열림 (`useState` 로 열림/닫힘 토글)
  - 검색 패널 뒤에 반투명 Dim 레이어 (`rgba(0, 0, 0, 0.3)`)
  - Dim 영역 클릭 또는 X 버튼 클릭 시 패널 닫힘
- 검색 입력
  - `Enter` 키 입력 시 검색 실행
  - 앞뒤 공백 제거(`trim`) 후 빈 값이면 검색하지 않음
  - 검색 시 패널을 닫고 `router.push('/search?q=...')` 로 이동

**스타일**

- 헤더 높이 82px, 로고 / 메뉴 / 검색 버튼 가로 배치 (flex)
- 검색 패널: `position: fixed`, 높이 200px, `z-index: 3`
- 입력 영역: 배경 `#f3f3f3`, 하단 border, placeholder 색상 `#9b9b9b`
- 헤더 레이아웃은 CSS Module, 검색 패널 내부는 Tailwind 로 작성

**구현 포인트**

- `useRouter`, `useState` 를 써야 해서 이 컴포넌트만 `'use client'` 로 선언
- 카테고리를 하드코딩하지 않고 상수 배열로 분리해서 메뉴 추가/수정 시 한 곳만 고치면 되도록 함

<br />

### 2. 메인 페이지 (전체 상품 목록)

**경로:** `src/app/page.tsx` **접속 URL:** `/`

**기능**

- 6개 카테고리의 상품을 모두 불러와 한 화면에 그리드로 표시
- 상품 카드 클릭 시 상세 페이지(`/products/{id}`)로 이동
- `Suspense` + `Loading` 컴포넌트로 로딩 fallback 처리

**데이터**

- `productService()` 를 카테고리 없이 호출
- 내부에서 6개 카테고리 API 를 `Promise.all` 로 **동시에** 요청한 뒤 `flat()` 으로 하나의 배열로 합침

**스타일**

- `grid grid-cols-4 gap-20` — 한 줄에 4개 카드

<br />

### 3. 카테고리별 상품 목록 페이지

**경로:** `src/app/products/page.tsx` **접속 URL:** `/products?category=womens-dresses`

**기능**

- 헤더에서 선택한 카테고리의 상품만 표시
- 카드 클릭 시 상세 페이지로 이동

**데이터**

- `searchParams.category` 값을 읽어 `productService(category)` 호출
- API: `GET https://dummyjson.com/products/category/{category}?limit=0`
  - `limit=0` 을 붙여서 기본 30개 제한 없이 전체 상품을 받아옴

**라우팅**

- 별도 폴더를 카테고리마다 만들지 않고, **쿼리스트링(`?category=`)** 하나로 6개 카테고리를 같은 페이지에서 처리

<br />

### 4. 상품 상세 페이지

**경로:** `src/app/products/[id]/page.tsx` **접속 URL:** `/products/{id}` (동적 ID)

**기능**

- 좌측: 상품 카드 (이미지 슬라이더, 상품명, 설명, 가격, 태그)
- 우측: 리뷰 목록
  - COMMENT (리뷰 내용)
  - NAME / EMAIL (작성자 정보)
  - DATE (작성일)

**데이터**

- API: `GET https://dummyjson.com/products/{id}`
- `Product`, `Review` interface 를 정의해서 응답 데이터 타입 지정
- 날짜는 `2024-05-23T08:56:21.618Z` 형태로 내려와서 `split('T')[0]` 로 날짜 부분만 표시

**레이아웃**

- `grid grid-cols-2 gap-4` — 상품 정보 / 리뷰 2열 배치

**라우팅**

- 폴더명을 `[id]` 로 만들어 동적 라우팅 적용
- 페이지 함수에서 `{ params }` 를 구조 분해로 받아 `params.id` 사용

<br />

### 5. 검색 결과 페이지

**경로:** `src/app/search/page.tsx` **접속 URL:** `/search?q={검색어}`

**기능**

- 헤더 검색 패널에서 입력한 키워드로 상품 검색
- 결과가 없으면 "검색 결과가 없습니다." 문구 표시
- 결과가 있으면 메인과 같은 4열 그리드로 표시, 클릭 시 상세 페이지 이동

**데이터**

- API: `GET https://dummyjson.com/products/search?q={q}`

**구현 포인트**

- `{ data.products.length == 0 ? <p>...</p> : null }` — 조건부 렌더링으로 빈 결과 처리

<br />

### 6. ProductCard (상품 카드 컴포넌트)

**경로:** `src/components/productCard/productCard.tsx`

**기능**

- 상품 이미지 슬라이더 (Swiper)
  - `loop` 무한 루프
  - `autoplay` 2.5초 간격 자동 재생
  - `disableOnInteraction: false` — 사용자가 넘겨도 자동 재생이 멈추지 않음
- 상품명, 설명, 가격, 태그 목록 표시

**스타일**

- 상품명: 24px, bold
- 설명: `-webkit-line-clamp: 4` 로 4줄까지만 보이고 말줄임(`...`) 처리
  → 설명 길이가 달라도 카드 높이가 들쭉날쭉하지 않도록 고정 높이 100px
- 태그: 둥근 배지 형태 (`border-radius: 26px`, 배경 `aliceblue`)

**구현 포인트**

- Swiper 는 브라우저에서 동작해야 해서 `'use client'` 선언
- 목록 / 검색 / 상세 페이지에서 모두 재사용

<br />

## 데이터 흐름

```
[Header 카테고리 클릭] ──▶ /products?category=tops ──▶ productService('tops') ──▶ DummyJSON
[Header 검색 Enter]   ──▶ /search?q=dress          ──▶ fetch(/products/search)  ──▶ DummyJSON
[ProductCard 클릭]    ──▶ /products/162            ──▶ fetch(/products/162)     ──▶ DummyJSON
```

- 페이지는 모두 **서버 컴포넌트(async)** 로 만들어서 서버에서 바로 `fetch` 후 렌더링
- 상호작용이 필요한 `Header`, `ProductCard` 만 클라이언트 컴포넌트로 분리
- 카테고리 / 검색어처럼 화면 상태를 URL(`searchParams`) 에 담아서 새로고침하거나 링크를 공유해도 같은 화면이 나오도록 함

<br />

## 고민했던 부분 & 트러블슈팅

### 1. 상세 페이지 요청 주소가 `/products/[object Object]` 로 찍히던 문제

처음에는 상세 페이지 함수를 `detailPage(productId?: string)` 처럼 만들었는데, 데이터가 계속 안 나왔습니다.
Next.js 는 페이지 함수에 `{ params, searchParams }` **객체 하나**를 넘겨주기 때문에, 객체가 통째로 문자열에 들어가면서 `[object Object]` 가 된 것이 원인이었습니다.

```tsx
// Before
export default async function detailPage(productId?: string) { ... }

// After
export default async function detailPage({ params }: { params: { id: string } }) {
    const res = await fetch(`https://dummyjson.com/products/${params.id}`);
}
```

→ 이때 `params`(경로의 `[id]` 값) 와 `searchParams`(`?` 뒤의 값) 의 차이를 확실히 정리했습니다.

### 2. `item` 이 암시적으로 `any` 타입이라는 에러

`res.json()` 결과는 TypeScript 가 모양을 알 수 없어서 `reviews.map((item) => ...)` 의 `item` 도 `any` 로 잡혔습니다.
`Product`, `Review` interface 를 만들어 응답 타입을 지정하니 `item.comment`, `item.reviewerName` 등이 자동완성까지 되도록 해결했습니다.

### 3. 카테고리를 어디서 관리할지

헤더 메뉴의 "보여주는 이름(DRESSES)" 과 API 에 넣는 값(`womens-dresses`) 이 달라서, `slug` / `label` 을 가진 `Category` interface 로 묶어 `constants/category.ts` 에 모아두었습니다.
메뉴를 추가할 때 헤더 코드를 건드리지 않고 배열에 한 줄만 추가하면 됩니다.

### 4. 전체 상품을 한 번에 불러오는 방법

DummyJSON 에는 "여성 패션 전체" 같은 API 가 없어서 카테고리 6개를 각각 요청해야 했습니다.
`for` 문으로 하나씩 기다리면 느려지기 때문에 `Promise.all` 로 동시에 요청하고, 결과가 `[[...], [...], ...]` 2차원 배열로 나와서 `flat()` 으로 펼쳤습니다.

### 5. 설명 길이에 따라 카드 높이가 달라지는 문제

상품 설명이 길고 짧음에 따라 그리드 카드 높이가 제각각이라 정렬이 깨졌습니다.
`-webkit-line-clamp: 4` + 고정 높이로 4줄 이후는 말줄임 처리해서 카드 높이를 맞췄습니다.

### 6. 서버 컴포넌트 / 클라이언트 컴포넌트 구분

처음엔 Swiper 를 넣자마자 에러가 났는데, Swiper 와 `useState`, `useRouter` 는 브라우저에서만 동작하기 때문이었습니다.
그래서 **데이터를 가져오는 페이지는 서버 컴포넌트**, **상호작용이 있는 Header / ProductCard 는 `'use client'`** 로 역할을 나눴습니다.

> 공부하면서 나온 질문과 답변은 [QA-NOTES.md](QA-NOTES.md) 에 더 자세히 정리해두었습니다.

<br />

## 앞으로 개선할 점 (TODO)

- [ ] 목록 페이지의 `product: any` 를 공통 `Product` 타입으로 교체하고, 타입 정의를 `types/` 폴더로 분리
- [ ] `map` 으로 렌더링하는 `<Link>` 에 `key` 추가
- [ ] 검색어에 특수문자/한글이 들어가도 안전하도록 `encodeURIComponent` 적용
- [ ] `Suspense` 위치 조정 (현재는 `await` 이후에 감싸고 있어 fallback 이 보이지 않음 → `loading.tsx` 활용 검토)
- [ ] 검색 패널 열림 상태를 Zustand store 로 옮겨 다른 컴포넌트에서도 제어할 수 있게 하기
- [ ] API 에러 처리 (`res.ok` 체크, 에러 페이지)
- [ ] 반응형 대응 (현재 4열 고정 → 태블릿 2열, 모바일 1열)
- [ ] `layout.tsx` 의 `metadata` (title, description) 를 프로젝트에 맞게 수정
- [ ] 상품 이미지 `<img>` → `next/image` 로 교체해서 이미지 최적화
