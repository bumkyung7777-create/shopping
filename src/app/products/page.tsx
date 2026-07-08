import productService from '@/services/productService';
import ProductCard from '@/components/productCard/productCard';
import Link from 'next/link';

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: { category?: string };
}) {
    const products = await productService(searchParams.category);

    return (
        <div className="grid grid-cols-4 gap-20 p-5">
            {products.map((product: any) => (
                <Link href={`/products/${product.id}`}>
                    <ProductCard product={product} />
                </Link>
            ))}
        </div>
    );
}
