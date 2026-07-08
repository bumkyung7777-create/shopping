'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import './productCard.css';

interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    images: string[];
    tags: string[];
}

export default function ProductCard({ product }: { product: Product }) {
    return (
        <div>
            <div className="swiper-container">
                <Swiper
                    loop={true} // 슬라이드 루프
                    spaceBetween={0} // 슬라이스 사이 간격
                    navigation={true} // prev, next button
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false, // 사용자 상호작용시 슬라이더 일시 정지 비활성
                    }}
                >
                    {product.images.map((slide, index) => (
                        <SwiperSlide key={index}>
                            <img src={slide} alt="" />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            <ul className="shoping-list">
                <li>
                    <h4>{product.title}</h4>
                </li>
                <li>
                    <p className="description">{product.description}</p>
                </li>
                <li>
                    <p>price : {product.price}</p>
                </li>
                <li className="tag">
                    <p>TAG : </p>
                    <ul className="tab-list">
                        {product.tags.map((tab, index) => (
                            <li key={index}>{tab}</li>
                        ))}
                    </ul>
                </li>
            </ul>
        </div>
    );
}
