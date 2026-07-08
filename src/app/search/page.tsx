import ProductCard from '@/components/productCard/productCard';
import Link from 'next/link';

export default async function searchPage({ searchParams }: { searchParams: { q?: string } }) {
    const res = await fetch(`https://dummyjson.com/products/search?q=${searchParams.q}`);
    const data = await res.json();
    return (
        <div>
            {data.products.length == 0 ? <p className="no-item">검색 결과가 없습니다.</p> : null}
            <div className="grid grid-cols-4 gap-20 p-5">
                {data.products.map((product: any) => (
                    <Link href={`/products/${product.id}`}>
                        <ProductCard product={product} />
                    </Link>
                ))}
            </div>
        </div>
    );
}
