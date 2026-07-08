import ProductCard from '@/components/productCard/productCard';
export default async function detailPage({ params }: { params: { id: string } }) {
    const res = await fetch(`https://dummyjson.com/products/${params.id}`);
    const data: Product = await res.json();
    const product = data;
    console.log('심범경', data);

    interface Review {
        comment: string;
        rating: number;
        reviewerName: string;
        reviewerEmail: string;
        date: string;
    }

    interface Product {
        id: number;
        title: string;
        description: string;
        price: number;
        tags: [];
        reviews: Review[];
        images: [];
    }

    return (
        <div className="p-5">
            <div className="grid grid-cols-2 gap-4">
                <ProductCard product={product} />
                <ul className="flex-layout">
                    {product.reviews.map((item, index) => (
                        <li className="review-box" key={index}>
                            <h3>
                                <span>COMMENT : </span>
                                {item.comment}
                            </h3>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>NAME : {item.reviewerName}</td>
                                        <td>EMAIL : {item.reviewerEmail}</td>
                                    </tr>
                                    <tr>
                                        <td>DATE : {item.date.split('T')[0]}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
