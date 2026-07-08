export default async function productService(category?: string) {
    if (category) {
        const res = await fetch(`https://dummyjson.com/products/category/${category}?limit=0`);
        const data = await res.json();
        return data.products;
    } else {
        const categories = [
            'womens-dresses',
            'tops',
            'womens-shoes',
            'womens-bags',
            'womens-jewellery',
            'womens-watches',
        ];

        const results = await Promise.all(
            categories.map(async (category) => {
                const res = await fetch(
                    `https://dummyjson.com/products/category/${category}?limit=0`
                );
                const data = await res.json();
                return data.products;
            })
        );

        return results.flat();
    }
}
