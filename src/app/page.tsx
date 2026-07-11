import productService from '@/services/productService';
import ProductCard from '@/components/productCard/productCard';
import { Suspense } from 'react';
import Loading from '@/components/loading/loading';
import Link from 'next/link';
export default async function Home({ searchParams }: { searchParams: { category?: string } }) {
    const products = await productService(searchParams.category);

    return (
        <Suspense fallback={<Loading />}>
            <div className="grid grid-cols-4 gap-20 p-5">
                {products.map((product: any) => (
                    <Link href={`/products/${product.id}`}>
                        <ProductCard product={product} />
                    </Link>
                ))}
            </div>
        </Suspense>
    );
}
