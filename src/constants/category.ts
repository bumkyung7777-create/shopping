export interface Category {
    slug: string; // API 호출/URL에 쓰는 값 (예: 'womens-dresses')
    label: string; // 화면에 보여줄 이름 (예: 'DRESSES')
}

export const CATEGORIES: Category[] = [
    { slug: 'womens-dresses', label: 'DRESSES' },
    { slug: 'tops', label: 'TOPS' },
    { slug: 'womens-shoes', label: 'SHOES' },
    { slug: 'womens-bags', label: 'BAGS' },
    { slug: 'womens-jewellery', label: 'JEWELLERY' },
    { slug: 'womens-watches', label: 'WATCHES' },
];
