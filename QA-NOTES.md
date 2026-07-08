# 학습 Q&A 노트

이 문서는 프로젝트 진행 중 나눈 질문과 답변을 정리한 기록입니다.

---

## 1. `searchParams.category`에서 왜 dot(`.`)으로 접근할 수 있는가?

**위치:** [src/app/products/page.tsx:9](src/app/products/page.tsx#L9)

```tsx
export default async function ProductsPage({
    searchParams,
}: {
    searchParams: { category?: string };
}) {
    const products = await productService(searchParams.category);
```

**쉽게 설명하면:**

- `searchParams`는 그냥 **평범한 객체(object)**예요. 예를 들면 `{ category: "shoes" }` 같은 모양이에요.
- 객체 안에 있는 값을 꺼낼 때는 `객체이름.키이름` 처럼 점(`.`)을 찍어서 꺼낼 수 있어요. `searchParams.category`도 그냥 그 객체 안에 있는 `category`라는 값을 꺼내는 것뿐이에요.
- 그럼 이 객체는 누가 만들어줄까요? 바로 **Next.js**예요! 주소창에 `/products?category=shoes`처럼 물음표(`?`) 뒤에 값을 붙여서 들어가면, Next.js가 그 값을 자동으로 읽어서 `{ category: "shoes" }` 객체로 만들어 우리 페이지 함수에 넣어줘요.
- 정리: `searchParams.category`는 특별한 문법이 아니라, "URL 뒤에 붙은 값을 담고 있는 상자(객체)에서 category 값을 꺼내 쓰는 것"이라고 생각하면 돼요.

---

## 2. `interface Category`는 왜 쓰는 걸까? slug, label은 그냥 이름 구별용 아닌가?

**위치:** [src/constants/category.ts:1-4](src/constants/category.ts#L1-L4)

```ts
export interface Category {
    slug: string; // API 호출/URL에 쓰는 값 (예: 'womens-dresses')
    label: string; // 화면에 보여줄 이름 (예: 'DRESSES')
}
```

**쉽게 설명하면:**

- `interface`는 일종의 **틀(모양 정하기)**이에요. "Category라는 이름을 가진 물건은 반드시 slug(글자)랑 label(글자)을 가지고 있어야 해!" 라고 규칙을 정하는 거예요.
- 이 규칙이 있으면, 나중에 실수로 `slug`를 빼먹거나 이름을 잘못 쓰면(`sulg`처럼) 컴퓨터가 코드를 실행하기도 전에 "여기 틀렸어!"라고 미리 알려줘요.
- 그리고 에디터에서 `.`을 찍으면 `slug`, `label`이 자동으로 나와서 타이핑하기도 편해져요.
- `slug`, `label`이라는 **이름**은 맞아요, 사람이 보기 쉽게 구별하려고 지은 이름이에요. (`slug`는 주소창/API에 쓰는 값, `label`은 화면에 보여주는 이름)
- 그런데 `interface` 자체가 하는 일은 "이름 구별"이 아니라 **"이 물건은 이런 모양이어야 한다"는 검사표를 만드는 것**이에요. 이름 짓기랑 타입 검사는 서로 다른 역할인데, 이 코드에서는 둘 다 같이 쓰인 거예요.

---

## 3. 동적 라우팅에서 `params`와 `searchParams`, 정확히 뭐가 다를까?

**위치:** [src/app/products/[id]/page.tsx](src/app/products/[id]/page.tsx)

### 먼저, 폴더 이름 `[id]`가 뭐길래?

Next.js에서는 **폴더 이름을 대괄호로 감싸면**(`[id]`), 그 자리에 어떤 값이든 들어올 수 있는 "빈칸"이 됩니다.

```
src/app/products/[id]/page.tsx
```

이렇게 만들어두면:
- `/products/1` 로 접속하면 → `id`는 `"1"`
- `/products/5` 로 접속하면 → `id`는 `"5"`
- `/products/womens-dresses` 로 접속하면 → `id`는 `"womens-dresses"`

즉, 주소의 그 부분에 어떤 글자가 오든 다 이 페이지로 연결되고, 그 글자가 `id`라는 이름으로 전달됩니다.

### `params` vs `searchParams` 차이

둘 다 "주소(URL)에서 정보를 꺼내오는 것"이지만, **꺼내오는 위치**가 달라요.

| 구분 | 어디서 오는 값인가 | 예시 주소 | 받는 모양 |
|---|---|---|---|
| `params` | 폴더 이름 `[id]` 자리에 들어간 값 | `/products/5` | `{ id: "5" }` |
| `searchParams` | 주소 뒤 `?` 다음에 붙는 값 (쿼리스트링) | `/products?category=shoes` | `{ category: "shoes" }` |

쉽게 비유하면:
- `params`는 **주소 자체의 일부**예요. "몇 번째 방으로 가고 싶어?" 처럼 주소 안에 딱 박혀 있는 값이에요. (예: `/products/5`의 `5`)
- `searchParams`는 **주소 뒤에 덧붙이는 옵션**이에요. "몇 번째 방으로 가는데, 이런 조건도 같이 알려줄게" 처럼 `?` 뒤에 추가로 붙는 값이에요. (예: `?category=shoes`)

### 페이지 함수에서 어떻게 받아야 할까?

Next.js는 페이지 함수를 부를 때 **값을 하나의 객체로 묶어서** 넘겨줘요. 그래서 함수는 반드시 그 객체를 구조 분해(destructuring)로 받아야 해요.

```tsx
// ✅ 올바른 방법
export default async function DetailPage({
    params,
    searchParams,
}: {
    params: { id: string };
    searchParams: { [key: string]: string | undefined };
}) {
    const res = await fetch(`https://dummyjson.com/products/${params.id}`);
    const data = await res.json();

    return <div>상세페이지</div>;
}
```

```tsx
// ❌ 잘못된 방법 (실제로 겪었던 버그!)
export default async function detailPage(productId?: string) {
    // productId는 사실 "1" 같은 글자가 아니라
    // { params: { id: '1' }, searchParams: {} } 라는 객체 전체가 들어와요!
    const res = await fetch(`https://dummyjson.com/products/${productId}`);
```

이렇게 객체를 통째로 문자열 안에 넣으면 `"[object Object]"`라는 이상한 글자로 바뀌어서, 요청 주소가 `.../products/[object Object]` 처럼 되어버려요. 그래서 원하는 데이터가 안 나왔던 거예요.

### 한 줄 정리

- `params` = 주소 경로(폴더 이름 `[ ]`) 안에 있는 값
- `searchParams` = 주소 뒤 `?` 뒤에 붙는 값
- 페이지 함수는 이 둘을 **하나의 객체**로 받기 때문에, 함수를 만들 때 꼭 `{ params, searchParams }` 형태로 구조 분해해서 받아야 해요.

---

## 4. `item` 매개변수에 "암시적으로 any 타입을 포함한다"는 에러, 무슨 뜻일까?

**위치:** [src/app/products/[id]/page.tsx:15](src/app/products/[id]/page.tsx#L15)

```tsx
const data = await res.json();
const product = data;
...
{product.reviews.map((item, index) => (
    <li key={index}>
        <h3>{item.comment}</h3>
    </li>
))}
```

**쉽게 설명하면:**

- `item`이 어떤 모양인지 컴퓨터(TypeScript)가 전혀 모른다는 뜻이에요. 그래서 "타입을 안 적어놨으니까 일단 아무거나 다 되는 것으로 취급할게" 라면서 경고를 주는 거예요.
- 왜 모를까요? `res.json()`으로 받은 `data`는 서버가 뭘 보내줄지 미리 알 수 없어서, TypeScript가 그냥 "몰라, 아무거나(any)"라고 취급해요.
- `product`도 `data`를 그대로 받은 거라 "몰라(any)" 상태고, `product.reviews`도 "몰라(any)" 상태예요.
- 배열에 `.map((item) => ...)`을 쓸 때 원래는 "이 배열 안에 뭐가 들어있는지 보고 item의 정체를 알아서 맞혀주는 기능"이 있는데, `product.reviews` 자체가 "몰라" 상태라서 그 기능이 작동을 못 해요. 그래서 `item`도 "몰라(any)"가 되고, 이걸 경고로 알려주는 거예요.

**고치는 방법 (2가지):**

1. `item`에 직접 타입을 적어주기: `(item: { comment: string }, index: number) => ...`
2. (더 좋은 방법) `Product`, `Review` 같은 interface를 만들어서 `product`가 어떤 모양인지 미리 정해두기. 그러면 `item`의 타입도 자동으로 정확하게 잡혀요.

---

## 5. 날짜에서 시간 부분은 빼고 날짜만 보여주고 싶을 때

**위치:** [src/app/products/[id]/page.tsx:41](src/app/products/[id]/page.tsx#L41)

```tsx
// 수정 전
<td>DATE : {item.date}</td>

// 수정 후
<td>DATE : {item.date.split('T')[0]}</td>
```

**쉽게 설명하면:**

- `item.date`는 원래 `"2024-05-23T08:56:21.618Z"`처럼 **날짜 + 시간**이 하나의 긴 글자로 붙어 있어요.
- 자세히 보면 가운데에 알파벳 `T`가 하나 껴 있는데, 이게 "여기부터는 시간이야"라고 구분해주는 표시예요.
- `split('T')`는 그 글자를 `T`를 기준으로 **둘로 잘라서 배열로 만들어줘요**: `["2024-05-23", "08:56:21.618Z"]`
- 그중 `[0]`번째(첫 번째) 것만 쓰면 `"2024-05-23"`, 즉 **날짜 부분만** 남길 수 있어요.

---

## 6. Zustand `create`로 만든 store, 도대체 뭐 하는 코드일까?

**위치:** [store/openState.ts](store/openState.ts)

```ts
import { create } from 'zustand';
type openState = {
    openValue: string;
    setOpenValue: (name: string) => void;
};

export const useUserStore = create<openState>()((set) => ({
    openValue: '',
    setOpenValue: (name) => set({ openValue: name }),
}));
```

**쉽게 설명하면:**

- `useState`는 그 컴포넌트 **안에서만** 쓸 수 있는 개인 서랍이에요. 다른 컴포넌트는 그 서랍을 절대 못 열어요.
- Zustand의 `create`는 **학교 전체가 같이 쓰는 공용 사물함**을 하나 만드는 거예요. 어떤 컴포넌트든 그 사물함 번호(`useUserStore`)만 알면 열어서 값을 읽거나 바꿀 수 있어요.
- `type openState`는 "이 사물함 안에 뭐가 들어있어야 하는지" 정하는 규칙표예요. `openValue`라는 글자(string) 하나랑, 그 글자를 바꾸는 `setOpenValue`라는 기능이 반드시 있어야 한다고 정해놨어요.
- `create<openState>()((set) => ({ ... }))` 부분:
  - `openValue: ''` → 사물함을 처음 만들 때 넣어두는 값. 지금은 빈 글자로 시작.
  - `setOpenValue: (name) => set({ openValue: name })` → `set`은 Zustand가 미리 챙겨주는 "사물함 내용 바꾸기" 도구예요. `setOpenValue('hello')`라고 부르면 사물함 안 `openValue`가 `'hello'`로 바뀌고, 그 사물함을 보고 있는 모든 컴포넌트가 자동으로 다시 그려져요(리렌더링).
- `useUserStore`는 이 사물함을 쓰기 위한 **열쇠(훅)**예요. 어느 컴포넌트에서든 `const { openValue, setOpenValue } = useUserStore();` 처럼 불러와서 값을 읽거나 바꿀 수 있어요.
- 참고: 지금 이름이 `useUserStore`인데, 실제로는 "유저 정보"가 아니라 "열림/닫힘 같은 값"을 담고 있어서 `useOpenStore` 같은 이름이 더 헷갈리지 않아요. (당장 고칠 필요는 없고 나중에 참고용)

---

<!-- 새로운 질문은 이 아래에 이어서 추가하면 됩니다. -->
